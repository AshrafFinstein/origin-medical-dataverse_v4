<script setup lang="ts">
import type { ExtractedResourceStatus, Label } from '@prisma/client'
import type { PropType } from 'vue'
import { nextTick, computed, ref, watch } from 'vue'
import { NButton, NCard, NCheckbox, NColorPicker, NForm, NInput, NModal, NPopconfirm, NPopover, NTooltip, useNotification } from 'naive-ui'
import Konva from 'konva'
import DraggableList from './DraggableList.vue'
import type { DeleteSingleTaxonomyDataInput, GetMarkupDataInput, GetTaxonomyDataInput, TaxonomyInput, UpdateTaxonomyDataInput } from '~~/types'
import type { ExtractedResourceLong } from '~~/types/ExtractedResource'

// Add at the top of <script setup>
let latestRequestId = 0;
let gridImageObj: HTMLImageElement | null = null
let annotationImageObj: HTMLImageElement | null = null

const props = defineProps({
  resourceData: {
    type: Object as PropType<ExtractedResourceLong>,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
  status: {
    type: String as PropType<ExtractedResourceStatus>,
    required: true,
  },
  comment: {
    type: String as PropType<string | undefined>,
    required: true,
  },
  totalResourceData: {
    type: Array,
    required: false,
  },
  filter: {
    type: Object,
    required: false,
  },
  // chosenExtractedResources: {
  //   type: Array,
  //   required: false
  // },
  labelColors: {
    type: Object as PropType<{ [labelId: string]: string }>,
    required: true,
  },
  labels: {
    type: Array as PropType<Label[]>,
    required: true,
  },
})

const emit = defineEmits(['update:comment', 'activeChoosenImage', 'refreshDataGrid', 'annotationModalClosed'])

const notification = useNotification()

const route = useRoute()
const { $client } = useNuxtApp()
const { comment } = useVModels(props, emit)
const inputText = ref<string>('')
const isImageInverted = ref<Boolean>(false)
const isImageAnnotationInverted = ref<Boolean>(false)
const isLock = ref<boolean>(false)
const isVisualizationLock = ref<boolean>(false)
const imageContainerDimensions = ref({ width: 0, height: 0 })

// Loading states for accept/reject operations
const isAccepting = ref<boolean>(false)
const isRejecting = ref<boolean>(false)
// Track if accept/reject was just performed to close preview panel
const wasAcceptRejectPerformed = ref<boolean>(false)

// Time spent for the current resource
const timeSpent = ref<number>(0)

// Annotation modal time tracking
const annotationModalStartTime = ref<number>(0)
const currentTimeSpentRecordId = ref<string | null>(null)

// Format time in human-readable format
const formatTime = (timeMs: number) => {
  if (!timeMs || timeMs === 0) {
    return '0s'
  }
  
  const totalSeconds = Math.floor(timeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

// Fetch time spent for the current resource
const fetchTimeSpent = async () => {
  if (!props.resourceData?.id) return
  
  try {
    const result = await $client.timeSpent.getTimeSpentInExtractedResource.query({
      extractedResourceId: props.resourceData.id,
      dLSessionId: route.params.id.toString()
    })
    timeSpent.value = result?.totalTimeMs || 0
  } catch (error) {
    console.error(`Error fetching time spent for resource ${props.resourceData.id}:`, error)
    timeSpent.value = 0
  }
}

// Start tracking time when annotation modal opens
const startAnnotationTimeTracking = async () => {
  if (!props.resourceData?.id) return
  
  annotationModalStartTime.value = Date.now()
  currentTimeSpentRecordId.value = null
  
  try {
    // Create a new time spent record when modal opens
    const result = await $client.timeSpent.createTimeSpentInExtractedResource.mutate({
      extractedResourceId: props.resourceData.id,
      dLSessionId: route.params.id.toString(),
      startTime: annotationModalStartTime.value
    })
    
    if (result?.id) {
      currentTimeSpentRecordId.value = result.id
    }
  } catch (error) {
    console.error('Error creating time spent record:', error)
  }
}

// Stop tracking time when annotation modal closes
const stopAnnotationTimeTracking = async () => {
  if (!annotationModalStartTime.value || !props.resourceData?.id || !currentTimeSpentRecordId.value) return
  
  const endTime = Date.now()
  const duration = (endTime - annotationModalStartTime.value) / 1000 // in seconds
  
  try {
    // Update the existing record with the actual end time
    await $client.timeSpent.updateTimeSpentInExtractedResource.mutate({
      id: currentTimeSpentRecordId.value,
      endTime: endTime
    })
    
    // Refresh the time spent display
    await fetchTimeSpent()
  } catch (error) {
    console.error('Error updating time spent record:', error)
  }
  
  // Reset tracking variables
  annotationModalStartTime.value = 0
  currentTimeSpentRecordId.value = null
}

// Watch for changes in resourceData and fetch time spent
watch(() => props.resourceData?.id, async (newId) => {
  if (newId) {
    await fetchTimeSpent()
  }
}, { immediate: true })
// Handle Comment
function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

function handleComment() {
  // Trim the input to remove leading/trailing whitespace
  const trimmedValue = inputText.value.trim()

  // If input is empty or only whitespace, clear the comment
  // This allows clearing comments while preventing whitespace-only comments
  if (trimmedValue === '') {
    comment.value = ''
    // Also clear inputText to remove any whitespace from the UI
    inputText.value = ''
  } else {
    // If there's actual content, save the trimmed value
    comment.value = trimmedValue
    // Update inputText to reflect the trimmed value
    inputText.value = trimmedValue
  }
}

const handleInput = debounce(handleComment, 1000)

// Visualization
const visualization = reactive({
  brightness: 1,
  contrast: 1,
})

// Annotation Visualization
const annotationVisualization = reactive({
  brightness: 1,
  contrast: 1,
})

const zoomer = ref()
const newTaxonomyInCESession = ref<null>(null)
const isCreatingTaxonomyInCESession = computed(() => !!newTaxonomyInCESession.value)
const container = ref(null)
const layers = []
const isShowStatusSelected = ref(true)
let selectedTaxonomyType = ref({})
let taxonomyCoordinates = ref({})
// Track current resource ID to preserve annotation object identity when same resource is reopened
let currentAnnotationResourceId: string | null = null
const konvaContainer = ref<HTMLDivElement | null>(null)
const annotationZoomer = ref()
const annotationContainer = ref<HTMLDivElement | null>(null)
let stage: Konva.Stage
let layer: Konva.Layer
let imageAspectRatio: number
let resizeObserver: ResizeObserver
let gridResizeObserver: ResizeObserver | null = null
const taxonomyIndex = ref<number>(0)
const showTaxonomyMappingModal = ref<boolean>(false)
const showDeleteConfirmationModal = ref<boolean>(false)
const showRemoveLabelsConfirmationModal = ref<boolean>(false)
const resourcesToRemoveLabels = ref<ExtractedResourceLong[]>([])

interface AnnotationHistoryEntry {
  id: string
  type: string
  name: string
  abbreviation: string
  colorCode: string
  index: number | null
  parentId?: string | null
  typesInTaxonomyId?: string | null
  taxonomiesAnnotationsInDLSessionsId?: string | null
  changeAppearance?: boolean
  isStored?: boolean
  taxonomyMetrics: Record<string, any>
  // Special marker for batch operations (e.g., copied annotations)
  isBatchOperation?: boolean
  batchEntries?: AnnotationHistoryEntry[] // All annotations in the batch
}

const undoStack = ref<AnnotationHistoryEntry[]>([])
const redoStack = ref<AnnotationHistoryEntry[]>([])
const markupUndoStack = ref<string[]>([])
const markupRedoStack = ref<string[]>([])
const markupGridUndoStack = ref<string[]>([])
const markupGridRedoStack = ref<string[]>([])
let isReplayingHistory = false

function payloadsAreEqual(a: any, b: any) {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  catch {
    return false
  }
}

function findLatestEntryForId(id: string) {
  for (let i = undoStack.value.length - 1; i >= 0; i--) {
    if (undoStack.value[i].id === id)
      return undoStack.value[i]
  }
  return null
}

function buildHistoryEntryFromTaxonomy(taxonomyId: string): AnnotationHistoryEntry | null {
  const data: any = taxonomyCoordinates.value?.[taxonomyId]
  if (!data || !data.type)
    return null

  const entry: AnnotationHistoryEntry = {
    id: taxonomyId,
    type: data.type,
    name: data.name,
    abbreviation: data.abbreviation,
    colorCode: data.colorCode || '#ff0000',
    index: typeof data.index === 'number' ? data.index : null,
    parentId: data.parentId ?? null,
    typesInTaxonomyId: data.typesInTaxonomyId ?? null,
    taxonomiesAnnotationsInDLSessionsId: data.taxonomiesAnnotationsInDLSessionsId ?? null,
    changeAppearance: data.changeAppearance,
    isStored: data.isStored,
    taxonomyMetrics: {},
  }

  switch (data.type) {
    case 'Landmark':
    case 'Crossbar':
      entry.taxonomyMetrics = {
        x: data.x,
        y: data.y,
        rotation: data.rotation ?? 0,
      }
      break
    case 'Measurement':
      if (!data.start || !data.end)
        return null
      entry.taxonomyMetrics = {
        start: { ...data.start },
        end: { ...data.end },
      }
      break
    case 'Bounding Box':
    case 'Non-Rotational Bounding Box':
      if (!data.start || !data.end || !data.center)
        return null
      entry.taxonomyMetrics = {
        start: { ...data.start },
        end: { ...data.end },
        center: { ...data.center },
        width: data.width,
        height: data.height,
        rotationDegrees: data.type === 'Non-Rotational Bounding Box' 
          ? 0 
          : (data.rotationDegrees ?? data.rect?.rotation?.() ?? 0),
      }
      break
    case 'Ellipse': {
      const ellipseNode: Konva.Ellipse | undefined = data.ellipse
      if (!ellipseNode)
        return null
      entry.taxonomyMetrics = {
        x: ellipseNode.x(),
        y: ellipseNode.y(),
        radiusX: ellipseNode.radiusX(),
        radiusY: ellipseNode.radiusY(),
        rotationDegrees: data.rotationDegrees ?? ellipseNode.rotation?.() ?? 0,
        leftRightValue: data.leftRightValue ?? 0,
        topBottomValue: data.topBottomValue ?? 0,
        circumference: data.circumference ?? 0,
      }
      break
    }
    case 'Angle':
      if (!data.angle || !data.angle.vertex || !data.angle.armPoint1 || !data.angle.armPoint2)
        return null
      entry.taxonomyMetrics = {
        vertex: { ...data.angle.vertex },
        armPoint1: { ...data.angle.armPoint1 },
        armPoint2: { ...data.angle.armPoint2 },
        angleValue: data.angle.angleValue,
      }
      break
    default:
      return null
  }

  return entry
}

// Store the state before drag starts
const dragStartStates = new Map<string, AnnotationHistoryEntry>()

function captureAnnotationSnapshot(taxonomyId: string, isDragStart: boolean = false) {
  const entry = buildHistoryEntryFromTaxonomy(taxonomyId)
  if (entry) {
    if (isDragStart) {
      // Store the "before" state when drag starts, preserving the original isStored value
      dragStartStates.set(taxonomyId, entry)
    } else {
      // When drag ends, check if we have a "before" state
      const beforeState = dragStartStates.get(taxonomyId)
      if (beforeState) {
        // This is a modification to an existing annotation
        // First, check if there's already an entry for this annotation
        const lastEntryForId = findLatestEntryForId(taxonomyId)
        if (!lastEntryForId) {
          // No previous entry, so add the "before" state first
          // Preserve the original isStored value for the "before" state
          recordAnnotationCreation(beforeState, true) // Pass true to preserve isStored
        }
        // Clear the drag start state
        dragStartStates.delete(taxonomyId)
      }
      // Record the new state (always mark as not stored since it's been modified)
      recordAnnotationCreation(entry, false)
      // Mark annotation as modified (not stored) when user makes changes
      if (taxonomyCoordinates.value[taxonomyId]) {
        taxonomyCoordinates.value[taxonomyId].isStored = false
      }
    }
  }
}

const annotationCanUndo = computed(() => undoStack.value.length > 0)
const annotationCanRedo = computed(() => redoStack.value.length > 0)

const uniqueLabelCount = computed(() => {
  if (!resourcesToRemoveLabels.value || resourcesToRemoveLabels.value.length === 0) {
    return 0
  }
  const allLabelIds = new Set<string>()
  resourcesToRemoveLabels.value.forEach(resource => {
    if (resource.labelIds && resource.labelIds.length > 0) {
      resource.labelIds.forEach(labelId => allLabelIds.add(labelId))
    }
  })
  return allLabelIds.size
})

function recordAnnotationCreation(entry: AnnotationHistoryEntry, preserveIsStored: boolean = false) {
  if (isReplayingHistory) return
  // Allow tracking changes to stored annotations (user modifications after save)
  // When captureAnnotationSnapshot is called, it's a user action that should be tracked
  const lastEntryForId = findLatestEntryForId(entry.id)
  if (lastEntryForId && payloadsAreEqual(lastEntryForId.taxonomyMetrics, entry.taxonomyMetrics))
    return
  // Only mark as not stored if we're not preserving the original isStored value
  // (e.g., when adding the "before" state, preserve its original isStored value)
  if (!preserveIsStored) {
    entry.isStored = false
  }
  undoStack.value.push(entry)
  redoStack.value = []
}

function removeAnnotationById(annotationId: string) {
  const group = layer?.findOne(g => g.attrs.id === `${annotationId}group`)
  if (group) {
    group.destroy()
  }
  if (taxonomyCoordinates.value && taxonomyCoordinates.value[annotationId]) {
    delete taxonomyCoordinates.value[annotationId]
  }
  isClickedItems.value = (isClickedItems.value || []).filter((id: string) => id !== annotationId)
  selectedItems.value = selectedItems.value.filter((id: string) => id !== annotationId)
  lockedItems.value = lockedItems.value.filter((id: string) => id !== annotationId)
  if (visibilityStates.has(annotationId)) {
    visibilityStates.delete(annotationId)
  }
  if (lockStates.has(annotationId)) {
    lockStates.delete(annotationId)
  }
  selectedGroups.value = selectedGroups.value.filter((group: any) => {
    if (!Array.isArray(group))
      return true
    return !group.some((item: any) => item.id === annotationId)
  })
  layer?.batchDraw()
}

function restoreAnnotation(entry: AnnotationHistoryEntry) {
  const index = entry.index ?? null
  const parentId = entry.parentId ?? null
  const typesInTaxonomyId = entry.typesInTaxonomyId ?? null
  const taxonomiesAnnotationsInDLSessionsId = entry.taxonomiesAnnotationsInDLSessionsId ?? null
  // Use entry.isStored if provided, otherwise default to false
  const isStored = entry.isStored ?? false

  switch (entry.type) {
    case 'Landmark':
    case 'Crossbar': {
      const { x, y, rotation = 0 } = entry.taxonomyMetrics
      const taxonomyData = { rotation }
      addLandmark(
        taxonomyData,
        x,
        y,
        entry.id,
        entry.name,
        entry.abbreviation,
        entry.type,
        entry.colorCode,
        index,
        isStored,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId,
        entry.changeAppearance
      )
      // Ensure isStored is set correctly after restoration
      if (taxonomyCoordinates.value[entry.id]) {
        taxonomyCoordinates.value[entry.id].isStored = isStored
      }
      break
    }
    case 'Measurement': {
      const { start, end } = entry.taxonomyMetrics
      addMeasurementPoint(
        start.x,
        start.y,
        { start },
        entry.id,
        entry.name,
        entry.abbreviation,
        entry.type,
        entry.colorCode,
        index,
        isStored,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId
      )
      addMeasurementPoint(
        end.x,
        end.y,
        { start, end },
        entry.id,
        entry.name,
        entry.abbreviation,
        entry.type,
        entry.colorCode,
        index,
        isStored,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId
      )
      // Ensure isStored is set correctly after restoration
      if (taxonomyCoordinates.value[entry.id]) {
        taxonomyCoordinates.value[entry.id].isStored = isStored
      }
      break
    }
    case 'Bounding Box':
    case 'Non-Rotational Bounding Box': {
      const { start, end, center, width, height, rotationDegrees } = entry.taxonomyMetrics
      startBoundingBox(
        start.x,
        start.y,
        entry.id,
        entry.name,
        entry.abbreviation,
        entry.type,
        entry.colorCode,
        index,
        undefined,
        isStored,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId
      )
      startBoundingBox(
        end.x,
        end.y,
        entry.id,
        entry.name,
        entry.abbreviation,
        entry.type,
        entry.colorCode,
        index,
        {
          center,
          width,
          height,
          rotationDegrees: entry.type === 'Non-Rotational Bounding Box' ? 0 : rotationDegrees,
        },
        isStored,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId
      )
      // Ensure isStored is set correctly after restoration
      if (taxonomyCoordinates.value[entry.id]) {
        taxonomyCoordinates.value[entry.id].isStored = isStored
      }
      break
    }
    case 'Ellipse': {
      const { x, y, radiusX, radiusY, rotationDegrees, leftRightValue, topBottomValue, circumference } = entry.taxonomyMetrics
      startEllipse(
        x,
        y,
        entry.id,
        entry.name,
        entry.abbreviation,
        entry.type,
        entry.colorCode,
        index,
        radiusX,
        radiusY,
        isStored,
        false,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId
      )
      const ellipseData = taxonomyCoordinates.value[entry.id]
      if (ellipseData) {
        if (ellipseData.ellipse) {
          ellipseData.ellipse.position({ x, y })
          ellipseData.ellipse.radiusX(radiusX)
          ellipseData.ellipse.radiusY(radiusY)

          // Apply rotation if it exists
          if (typeof rotationDegrees === 'number') {
            ellipseData.ellipse.rotation(rotationDegrees)
            ellipseData.rotationDegrees = rotationDegrees
          }

          // Use rotation-aware update if rotation exists
          if (rotationDegrees) {
            updateEllipseAnchorPositionWithRotation(ellipseData.anchors, ellipseData.ellipse, entry.id)
          } else {
            updateEllipseAnchorPosition(ellipseData.anchors, ellipseData.ellipse, entry.id)
          }

          const labelNode = layer?.findOne(`#${entry.id}label`) as Konva.Text | null
          if (labelNode)
            updateEllipseLabelPosition(labelNode, ellipseData.ellipse)
        }

        ellipseData.completed = true

        if (typeof leftRightValue === 'number')
          ellipseData.leftRightValue = leftRightValue
        if (typeof topBottomValue === 'number')
          ellipseData.topBottomValue = topBottomValue
        if (typeof circumference === 'number')
          ellipseData.circumference = circumference
        
        // Ensure isStored is set correctly after restoration
        ellipseData.isStored = isStored
        
        if (stage)
          updateControlPoints(zoomFactor.value)
        layer?.batchDraw()
      }
      break
    }
    case 'Angle': {
      const { vertex, armPoint1, armPoint2, angleValue } = entry.taxonomyMetrics
      currentAnglePoints.value = [
        { x: vertex.x, y: vertex.y },
        { x: armPoint1.x, y: armPoint1.y },
        { x: armPoint2.x, y: armPoint2.y },
      ]
      const angle = calculateAndDrawAngle(currentAnglePoints.value, entry.id, entry.name, entry.abbreviation, entry.colorCode)
      taxonomyCoordinates.value[entry.id] = {
        id: entry.id,
        name: entry.name,
        abbreviation: entry.abbreviation,
        index: index != null ? index : taxonomyIndex.value,
        type: entry.type,
        angle,
        isStored: isStored,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId,
        colorCode: entry.colorCode,
      }
      currentAnglePoints.value = []
      if (typeof angleValue === 'number') {
        taxonomyCoordinates.value[entry.id].angle.angleValue = angleValue
        const angleTextNode = layer?.findOne(`#${entry.id}angletext`) as Konva.Text | null
        if (angleTextNode) {
          angleTextNode.text(`${entry.abbreviation} - ${angleValue.toFixed(1)}°`)
        }
      }
      if (stage)
        updateControlPoints(zoomFactor.value)
      layer?.batchDraw()
      break
    }
  }

  taxonomyIndex.value = Math.max(taxonomyIndex.value, (index ?? 0) + 1)
}

async function undoLastAnnotation() {
  if (!undoStack.value.length) return
  const last = undoStack.value.pop()
  if (!last) return
  
  // Handle batch operations (e.g., copied annotations)
  if (last.isBatchOperation && last.batchEntries) {
    // Remove all annotations in the batch temporarily
    isReplayingHistory = true
    for (const entry of last.batchEntries) {
      removeAnnotationById(entry.id)
    }
    isReplayingHistory = false
    redoStack.value.push(last)
    return
  }
  
  // Handle single annotation undo (existing logic)
  removeAnnotationById(last.id)
  redoStack.value.push(last)

  // Find the previous state for this annotation
  let foundPrevious = false
  for (let i = undoStack.value.length - 1; i >= 0; i--) {
    if (undoStack.value[i].id === last.id) {
      isReplayingHistory = true
      restoreAnnotation(undoStack.value[i])
      isReplayingHistory = false
      foundPrevious = true
      break
    }
  }

  // If no previous state found in undo stack, check if the annotation was originally stored
  // If it was stored (isStored = true in the entry we just removed), restore it
  if (!foundPrevious && last.isStored) {
    // The annotation was originally stored, restore it to its stored state
    isReplayingHistory = true
    restoreAnnotation(last)
    isReplayingHistory = false
    // Mark it as stored again
    if (taxonomyCoordinates.value[last.id]) {
      taxonomyCoordinates.value[last.id].isStored = true
    }
  }
}

async function redoLastAnnotation() {
  if (!redoStack.value.length) return
  const entry = redoStack.value.pop()
  if (!entry) return
  
  // Handle batch operations (e.g., copied annotations)
  if (entry.isBatchOperation && entry.batchEntries) {
    // Restore all annotations in the batch
    isReplayingHistory = true
    for (const batchEntry of entry.batchEntries) {
      // Check if annotation was already removed (should be, but check to be safe)
      if (!taxonomyCoordinates.value[batchEntry.id]) {
        restoreAnnotation(batchEntry)
      }
    }
    isReplayingHistory = false
    undoStack.value.push(entry)
    return
  }
  
  // Handle single annotation redo (existing logic)
  isReplayingHistory = true
  removeAnnotationById(entry.id)
  restoreAnnotation(entry)
  isReplayingHistory = false
  undoStack.value.push(entry)
}

// Watch for annotation modal state changes to track time and emit to parent
watch(showTaxonomyMappingModal, async (newValue) => {
  // Time tracking: start when modal opens, stop when modal closes
  if (newValue) {
    // Modal opened - start tracking
    await startAnnotationTimeTracking()
  } else {
    // Modal closed - stop tracking and update endTime
    await stopAnnotationTimeTracking()
  }
  
  // Emit the current state to parent component
  emit('annotationModalClosed', {
    resourceData: props.resourceData,
    currentIndex: props.totalResourceData ? props.totalResourceData.findIndex((resource: any) => resource.id === props.resourceData.id) : -1,
    isOpen: newValue,
    wasAcceptRejectPerformed: wasAcceptRejectPerformed.value
  })
  // Reset the flag after emitting
  if (!newValue) {
    wasAcceptRejectPerformed.value = false
  }
})


// --- Responsive Canvas Fix Variables (top-level scope) ---
let resizeTimeout: ReturnType<typeof setTimeout> | null = null
let windowResizeTimeout: ReturnType<typeof setTimeout> | null = null


  // Add this computed property
const canSaveTaxonomyAtApprovalLevel = computed(() => {

  // Check if resourceData exists
  if (!props.resourceData) {
    return true;
  }

  // Status is PENDING - should be enabled
  if (props.resourceData.status === 'PENDING' && props.stage != 'QUALITY_CONTROLLER') {
    return false; // disabled = false (enabled)
  }

  // REJECTED with specific conditions - should be enabled
  if (props.resourceData.status === 'REJECTED' &&
      // props.resourceData.approvalLevel == null &&
      props.resourceData.isReSubmitApprover === true) {
    return false; // disabled = false (enabled)
  }

  // Check the complex approver conditions
  const isNextApproverFalse = props.resourceData.isNextApprover === false;
  const isReSubmitApproverDefined = props.resourceData.isReSubmitApprover === true ||
                                    props.resourceData.isReSubmitApprover === false;

  // These conditions should disable the button
  if (isNextApproverFalse && isReSubmitApproverDefined) {
    return true; // disabled = true
  }

  if ((props.resourceData.isNextApprover === false && props.resourceData.isReSubmitApprover === false) ||
      (props.resourceData.isNextApprover === true && props.resourceData.isReSubmitApprover === true)) {
    return true; // disabled = true
  }

  // Default to enabled
  return false; // disabled = false (enabled)
});

// For Grid Markup
const gridContainer = ref<HTMLDivElement | null>(null)
let markupGridStage: Konva.Stage
let markupGridLayer: Konva.Layer
let gridImageLayer: Konva.Layer
let markupGridGroup: Konva.Group
const savedMarkupGridData = ref()
const isDrawingGrid = ref(false)
const markerColorGrid = ref('#000000')
const markerThicknessGrid = ref(5)
const showMarkupPopoverGrid = ref<boolean>(false)
const isEraserGrid = ref<boolean>(false)
let lastLineGrid: Konva.Line | null = null

const parentContainerGrid = ref<HTMLElement | null>(null)
const cursorSmallGrid = ref<HTMLElement | null>(null)
const cursorBigGrid = ref<HTMLElement | null>(null)
const cursorSmallAnnotate = ref<HTMLElement | null>(null)
const cursorBigAnnotate = ref<HTMLElement | null>(null)
const mouseEnterGrid = ref<boolean>(false)
const mouseEnterAnnotate = ref<boolean>(false)
const lastMousePositionGrid = ref({ x: 0, y: 0 })
const lastMousePositionAnnotate = ref({ x: 0, y: 0 })
const fetchTaxonomies = ref({})

// Track database order for each taxonomy (by taxonomyId) - for persistent ordering (user-specific and session-specific)
const databaseOrderMap = ref<Map<string, string[]>>(new Map());

const initialAnchorRadius = 5;
const initialRotatingAnchorRadius=4;
const initialCrosshairSize = 10;
const initialControlStroke = 2;
function recordMarkupGridHistory(line: Konva.Line | null) {
  if (!line)
    return

  markupGridUndoStack.value.push(line.toJSON())
  markupGridRedoStack.value = []
}

async function undoMarkupGridStroke() {
  if (!markupGridGroup || !markupGridLayer)
    return

  if (!markupGridUndoStack.value.length)
    return

  const serialized = markupGridUndoStack.value.pop()
  if (!serialized)
    return

  const children = markupGridGroup.getChildren()
  if (children.length) {
    children[children.length - 1].destroy()
    markupGridLayer.batchDraw()
  }

  markupGridRedoStack.value.push(serialized)
  await saveMarkupGrid()
}

async function redoMarkupGridStroke() {
  if (!markupGridGroup || !markupGridLayer)
    return

  if (!markupGridRedoStack.value.length)
    return

  const serialized = markupGridRedoStack.value.pop()
  if (!serialized)
    return

  const node = Konva.Node.create(serialized) as Konva.Line
  markupGridGroup.add(node)
  markupGridUndoStack.value.push(serialized)
  markupGridLayer.batchDraw()
  await saveMarkupGrid()
}



const taxonomyOpen = reactive({});
// Track sort order per taxonomy/group (by index) - each group has its own sort order
const sortOrderMap = ref<Map<number, 'asc' | 'desc' | 'annotated'>>(new Map());

// Track the annotation image node globally
let annotationImageNode: Konva.Image | null = null;

// --- Responsive Canvas Fix: Grid Image Selection ---

// ADD THESE TWO FUNCTIONS:
const handleWindowResize = () => {
  if (windowResizeTimeout) {
    clearTimeout(windowResizeTimeout)
  }

  windowResizeTimeout = setTimeout(() => {
    // Handle grid stage resize
    if (gridContainer.value && markupGridStage) {
      const gridRect = gridContainer.value.getBoundingClientRect()
      if (gridRect.width > 0 && gridRect.height > 0) {
        markupGridStage.width(gridRect.width)
        markupGridStage.height(gridRect.height)

        const imageSize = calculateSize(gridRect.width, gridRect.height, imageAspectRatio)
        const konvaImage = gridImageLayer?.getChildren().find(child => child instanceof Konva.Image)
        if (konvaImage) {
          konvaImage.setAttrs(imageSize)
        }
        gridImageLayer?.batchDraw()
      }
    }

    // Handle annotation stage resize
    if (annotationContainer.value && stage) {
      const rect = annotationContainer.value.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        stage.width(rect.width)
        stage.height(rect.height)

        const imageSize = calculateSize(rect.width, rect.height, imageAspectRatio)
        const konvaImage = layer?.getChildren().find(child => child instanceof Konva.Image)
        if (konvaImage) {
          konvaImage.setAttrs(imageSize)
        }
        layer?.batchDraw()
      }
    }
  }, 150)
}

const handleVisibilityChange = () => {
  if (!document.hidden) {
    setTimeout(() => {
      if (gridContainer.value && markupGridStage) {
        const gridRect = gridContainer.value.getBoundingClientRect()
        const currentGridWidth = markupGridStage.width()
        const currentGridHeight = markupGridStage.height()

        if (Math.abs(gridRect.width - currentGridWidth) > 10 ||
            Math.abs(gridRect.height - currentGridHeight) > 10) {
          markupGridStage.width(gridRect.width)
          markupGridStage.height(gridRect.height)

          const imageSize = calculateSize(gridRect.width, gridRect.height, imageAspectRatio)
          const konvaImage = gridImageLayer?.getChildren().find(child => child instanceof Konva.Image)
          if (konvaImage) {
            konvaImage.setAttrs(imageSize)
          }
          gridImageLayer?.batchDraw()
        }
      }

      if (annotationContainer.value && stage) {
        const rect = annotationContainer.value.getBoundingClientRect()
        const currentStageWidth = stage.width()
        const currentStageHeight = stage.height()

        if (Math.abs(rect.width - currentStageWidth) > 10 ||
            Math.abs(rect.height - currentStageHeight) > 10) {
          stage.width(rect.width)
          stage.height(rect.height)

          const imageSize = calculateSize(rect.width, rect.height, imageAspectRatio)
          const konvaImage = layer?.getChildren().find(child => child instanceof Konva.Image)
          if (konvaImage) {
            konvaImage.setAttrs(imageSize)
          }
          layer?.batchDraw()
        }
      }
    }, 100)
  }
}

function gridImageSelected() {
  if (gridContainer.value) {
    if (markupGridStage) {
      try { markupGridStage.destroy() } catch {}
      // @ts-ignore
      markupGridStage = undefined
    }
    if (gridResizeObserver) {
      try { gridResizeObserver.disconnect() } catch {}
      gridResizeObserver = null
    }
    if (gridImageObj) {
      try { gridImageObj.onload = null as any } catch {}
      try { gridImageObj.src = '' } catch {}
      gridImageObj = null
    }

    markupGridStage = new Konva.Stage({
      container: gridContainer.value,
      width: gridContainer.value.offsetWidth,
      height: gridContainer.value.offsetHeight,
      draggable: true,
    })

    // Handle panning limits based on the zoom level and image size
    markupGridStage!.on('dragmove', () => {
      limitPan(markupGridStage)
    })

    gridImageLayer = new Konva.Layer()
    markupGridStage.add(gridImageLayer)

    // Load the image
    gridImageObj = new Image()
    gridImageObj.onload = () => {
      imageAspectRatio = gridImageObj.width / gridImageObj.height
      // Create Konva Image after the native image has loaded
      const konvaImage = new Konva.Image({
        image: gridImageObj,
        x: 0,
        y: 0,
        ...calculateSize(markupGridStage.width(), markupGridStage.height(), imageAspectRatio),
      })
      // Add the image to the layer and draw
      gridImageLayer.add(konvaImage)
      gridImageLayer.batchDraw()
    }

    gridImageObj.src = props.resourceData.fullPath
    // resizeObserver = new ResizeObserver((entries) => {
    //   for (const entry of entries) {
    //     const { width, height } = entry.contentRect
    //     markupGridStage.width(width)
    //     markupGridStage.height(height)

    //     const imageSize = calculateSize(width, height, imageAspectRatio)
    //     const konvaImage = gridImageLayer.getChildren().find(child => child instanceof Konva.Image)
    //     if (konvaImage)
    //       konvaImage.setAttrs(imageSize)

    //     gridImageLayer.batchDraw()
    //   }
    // })

    if (gridResizeObserver) {
      gridResizeObserver.disconnect()
    }

    gridResizeObserver = new ResizeObserver((entries) => {
      // Skip resizing while annotation modal is open to avoid locking to transient dimensions
      if (showTaxonomyMappingModal.value)
        return
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect

          // Ensure minimum dimensions
          const finalWidth = Math.max(width, 300)
          const finalHeight = Math.max(height, 200)

          markupGridStage.width(finalWidth)
          markupGridStage.height(finalHeight)

          const imageSize = calculateSize(finalWidth, finalHeight, imageAspectRatio)
          const konvaImage = gridImageLayer.getChildren().find(child => child instanceof Konva.Image)
          if (konvaImage) {
            konvaImage.setAttrs(imageSize)
          }

          gridImageLayer.batchDraw()
        }
      }, 100)
    })

    gridResizeObserver.observe(gridContainer.value!)

    markupGridLayer = new Konva.Layer()
    markupGridGroup = new Konva.Group()

    markupGridLayer.add(markupGridGroup)
    markupGridStage.add(markupGridLayer)

    markupGridLayer.batchDraw()

    markupGridGroup.visible(false)

    markupGridStage.on('mousedown', markupHandleMouseDownGrid)
    markupGridStage.on('mousemove', markupHandleMouseMoveGrid)
    markupGridStage.on('mouseup', markupHandleMouseUpGrid)
    markupGridStage.on('mouseenter', handleMouseEnterGrid)
    markupGridStage.on('mouseleave', handleMouseLeaveGrid)
  }
}
const preventDefaultHandler = (e: any) => {
  // Allow context menu in annotation modal for label menu
  if (showTaxonomyMappingModal.value && annotationContainer.value && annotationContainer.value.contains(e.target)) {
    return 
  }// Don't prevent default, let the @contextmenu handler work
  if (e.type === 'dragstart' && e.target?.closest('.taxonomy-content')) {
    return; // Don't prevent dragstart for taxonomy lists - allow drag-and-drop to work
  }
  e.preventDefault()
}

onMounted(async() => {
  // Prevent context menu and drag
  window.addEventListener('contextmenu', preventDefaultHandler, { capture: true })
  window.addEventListener('dragstart', preventDefaultHandler, { capture: true })

  // ADD RESPONSIVE FIX: Window/Visibility Handlers (only once!)
  window.addEventListener('resize', handleWindowResize)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Additional context menu prevention for the annotation window (but allow label menu)
  if (konvaContainer.value) {
    konvaContainer.value.addEventListener('contextmenu', (e: any) => {
      // Allow context menu when annotation modal is open for label menu
      if (showTaxonomyMappingModal.value) {
        return // Don't prevent, let @contextmenu handler work
      }
      e.preventDefault()
    })
  }

  await nextTick()
  if (showTaxonomyMappingModal.value && annotationContainer.value) {
    const rect = annotationContainer.value.getBoundingClientRect()
    imageContainerDimensions.value = {
      width: rect.width,
      height: rect.height
    }
    // annotationContainer.value.style.width = `${rect.width}px`
    // annotationContainer.value.style.height = `${rect.height}px`
  }
// await ApiService.findTaxonomyData()
// await ApiService.getTaxonomyData()
  setupDisplayChangeDetection()
})

onBeforeUnmount(() => {
  // RESPONSIVE FIX: Enhanced cleanup
  const cleanupResizeListeners = () => {
    window.removeEventListener('resize', handleWindowResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    if (gridResizeObserver) {
      gridResizeObserver.disconnect()
      gridResizeObserver = null
    }

    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    if (windowResizeTimeout) {
      clearTimeout(windowResizeTimeout)
    }
  }

  cleanupResizeListeners()

  // Remove other event listeners
  window.removeEventListener('contextmenu', preventDefaultHandler, { capture: true })
  window.removeEventListener('dragstart', preventDefaultHandler, { capture: true })
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mousedown', handleMouseDownEvent)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('mouseup', handleMouseUpEvent)
  window.removeEventListener('wheel', handleWheel)

  if (konvaContainer.value) {
    konvaContainer.value.removeEventListener('contextmenu', preventDefaultHandler)
  }

  if (stage) {
    stage.destroy();
  }
  // Only destroy markupGridStage on actual component unmount, not modal close
  if (markupGridStage) {
    markupGridStage.destroy();
  }

  const mediaQuery = window.matchMedia('(width)')
  mediaQuery.removeEventListener('change', refreshAnnotationData)
  window.removeEventListener('resize', refreshAnnotationData)
})


const preventDefaultBehaviors = {
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none',
  '-webkit-user-drag': 'none',
  '-webkit-tap-highlight-color': 'transparent'
}

nextTick(() => {
  gridImageSelected()
})

function markupHandleMouseDownGrid() {
  if (!showMarkupPopoverGrid.value)
    return

    if (canSaveTaxonomyAtApprovalLevel.value)
    return


  const pos = markupGridStage.getPointerPosition()
  if (!pos)
    return

  lastLineGrid = new Konva.Line({
    stroke: isEraserGrid.value ? '#ffffff' : markerColorGrid.value,
    strokeWidth: markerThicknessGrid.value,
    globalCompositeOperation: isEraserGrid.value ? 'destination-out' : 'source-over',
    points: [pos.x + (isEraserGrid.value ? 10 : 0), pos.y + 20],
    lineCap: 'round',
    lineJoin: 'round',
  })

  markupGridGroup.add(lastLineGrid)
  markupGridLayer.batchDraw()
}

function handleMouseEnterGrid() {
  mouseEnterGrid.value = true
  if (!showMarkupPopoverGrid.value)
    return

  if (cursorSmallGrid.value && cursorBigGrid.value && parentContainerGrid.value) {
    if (eraserModeLabelGrid.value === 'Eraser Mode')
      cursorSmallGrid.value.style.opacity = '1'
    else
      cursorBigGrid.value.style.opacity = '1'

    parentContainerGrid.value.style.cursor = 'none'
  }
}

function handleMouseLeaveGrid() {
  mouseEnterGrid.value = false
  if (cursorSmallGrid.value)
    cursorSmallGrid.value.style.opacity = '0'
  else if (cursorBigGrid.value && parentContainerGrid.value)
    cursorBigGrid.value.style.opacity = '0'

  if (parentContainerGrid.value)
    parentContainerGrid.value.style.cursor = 'default'
}

function markupHandleMouseMoveGrid() {
  if (!showMarkupPopoverGrid.value)
    return

  const pos = markupGridStage.getPointerPosition()
  if (!pos)
    return

  const mouseX = pos.x
  const mouseY = pos.y
  lastMousePositionGrid.value = { x: mouseX, y: mouseY }

  if (eraserModeLabelGrid.value === 'Eraser Mode' && cursorSmallGrid.value)
    cursorSmallGrid.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  else if (cursorBigGrid.value)
    cursorBigGrid.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`

  if (cursorSmallGrid.value && eraserModeLabelGrid.value === 'Eraser Mode')
    cursorSmallGrid.value.style.opacity = '1'
  else if (cursorBigGrid.value && parentContainerGrid.value)
    cursorBigGrid.value.style.opacity = '1'

  if (parentContainerGrid.value)
    parentContainerGrid.value.style.cursor = 'none'

  if (!showMarkupPopoverGrid.value || !lastLineGrid)
    return

  const newPoints = lastLineGrid.points().concat([pos.x + (eraserModeLabelGrid.value === 'Eraser Mode' ? 0 : 10), pos.y + 20])
  lastLineGrid.points(newPoints)
  markupGridLayer.batchDraw()
}

async function markupHandleMouseUpGrid() {
  if (!showMarkupPopoverGrid.value)
    return

  if (cursorSmallGrid.value && eraserModeLabelGrid.value === 'Eraser Mode')
    cursorSmallGrid.value.style.opacity = '1'
  else if (cursorBigGrid.value && parentContainerGrid.value)
    cursorBigGrid.value.style.opacity = '1'

  if (parentContainerGrid.value)
    parentContainerGrid.value.style.cursor = 'none'

  if (!lastLineGrid)
    return

  recordMarkupGridHistory(lastLineGrid)
  await saveMarkupGrid()
  lastLineGrid = null
}

async function saveMarkupGrid() {
  const imageSize = calculateSize(markupGridStage.width(), markupGridStage.height(), imageAspectRatio)

  const markupGridGroupClone = markupGridGroup.clone()

  // Normalize the points in the markup group
  markupGridGroupClone.getChildren().forEach((line) => {
    const points = line.points()
    const normalizedPoints = []

    // Normalize each point based on the image dimensions
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i] / imageSize.width // Normalize X coordinate
      const y = points[i + 1] / imageSize.height // Normalize Y coordinate
      normalizedPoints.push(x, y)
    }
    line.points(normalizedPoints) // Update the line points with normalized values
  })

  const json = markupGridGroupClone.toJSON()

  const markupData: any = {
    dLSessionId: route.params.id.toString(),
    extractedResourceId: currentImage.value!.id,
    markupData: json,
  }
  await $client.dLSession.updateMarkupData.mutate(markupData)
}

function loadSavedMarkupGrid(data: any) {
  const imageSize = calculateSize(markupGridStage.width(), markupGridStage.height(), imageAspectRatio)
  if (data) {
    markupGridGroup.destroyChildren()
    markupGridLayer.draw()
    const newMarkupGroup = Konva.Node.create(data)

    // Scale the points back to actual image size
    newMarkupGroup.getChildren().forEach((line) => {
      const points = line.points()
      const denormalizedPoints = []

      // Denormalize each point based on the current image size
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i] * imageSize.width // Scale X coordinate to current image width
        const y = points[i + 1] * imageSize.height // Scale Y coordinate to current image height
        denormalizedPoints.push(x, y)
      }
      line.points(denormalizedPoints) // Update the line points with denormalized values
    })

    markupGridGroup.add(...newMarkupGroup.getChildren())
    markupGridLayer.batchDraw()
    markupGridUndoStack.value = markupGridGroup.getChildren().map(child => child.toJSON())
    markupGridRedoStack.value = []
    // Set initial state after loading saved data
    initialMarkupGridUndoStackLength.value = markupGridUndoStack.value.length
  }
  else {
    markupGridGroup.destroyChildren()
    markupGridLayer.draw()
    markupGridUndoStack.value = []
    markupGridRedoStack.value = []
    initialMarkupGridUndoStackLength.value = 0
  }
}

function toggleEraserModeGrid() {
  if (canSaveTaxonomyAtApprovalLevel.value || isVisualizationLock.value) return;
  isEraserGrid.value = !isEraserGrid.value
}
const eraserModeLabelGrid = computed(() => (isEraserGrid.value ? 'Marker Mode' : 'Eraser Mode'))

// Convert fetchTaxonomies to array for DraggableList
const taxonomiesArray = computed(() => {
  if (Array.isArray(fetchTaxonomies.value)) {
    return fetchTaxonomies.value;
  } else if (fetchTaxonomies.value && typeof fetchTaxonomies.value === 'object') {
    return Object.values(fetchTaxonomies.value);
  }
  return [];
})

function clearCanvasGrid() {
  markupGridGroup.destroyChildren()
  markupGridLayer.draw()
  if (!showMarkupPopoverGrid.value)
    return

  saveMarkupGrid()
  lastLineGrid = null
  markupGridUndoStack.value = []
  markupGridRedoStack.value = []
  initialMarkupGridUndoStackLength.value = 0
}

function togglePopoverGrid() {
  showMarkupPopoverGrid.value = !showMarkupPopoverGrid.value
  if (showMarkupPopoverGrid.value) {
    markupGridStage.draggable(false)
    const requestData: GetMarkupDataInput = {
      dLSessionId: route.params.id.toString(),
      extractedResourceId: props.resourceData.id,
    }
    $client.dLSession.getMarkupData.useQuery(requestData, {
      transform: (response) => {
        loadSavedMarkupGrid(response!.markupData)
      },
    })
    markupGridGroup.visible(true)
    markupGridPreviewLayerAdded()
  }
  else {
    markupGridStage.draggable(true)
    markupGridGroup.visible(false)
  }
}
const currentIndex = ref(0)
currentIndex.value = props.totalResourceData?.findIndex((item: any) => item.id === props.resourceData.id) ?? 0
const currentImage = computed(() => props.totalResourceData ? props.totalResourceData[currentIndex.value] : null)

// Label Menu functionality (right-click popup) - exactly like grid page
const labelMenu = reactive<{ visible: boolean; x: number; y: number; resources: ExtractedResourceLong[] }>({
  visible: false,
  x: 0,
  y: 0,
  resources: [],
})
const labelMenuEl = ref<HTMLElement | null>(null)
const labelMenuSearchInput = ref<HTMLInputElement | null>(null)
onClickOutside(labelMenuEl, (e) => showLabelMenu(e as MouseEvent))

// Search query for label menu filtering
const labelMenuSearchQuery = ref<string>('')

// Computed property to filter labels based on search query
const filteredLabels = computed(() => {
  if (!props.labels) return []
  
  const search = labelMenuSearchQuery.value.toLowerCase().trim()
  if (!search) {
    return props.labels
  }
  
  return props.labels.filter((label: Label) => 
    label.name.toLowerCase().includes(search)
  )
})

function showLabelMenu(e: MouseEvent) {
  // Only work when annotation modal is open
  if (!showTaxonomyMappingModal.value) {
    return
  }
  
  // Prevent label popup if canSaveTaxonomyAtApprovalLevel is true (saving is disabled)
  if (canSaveTaxonomyAtApprovalLevel.value) {
    return
  }
  
  if (currentImage.value) {
    e.preventDefault()
    e.stopPropagation()
    const previousVisible = labelMenu.visible
    labelMenu.visible = !labelMenu.visible
    
    // Use clientX/clientY for fixed positioning (viewport-relative) instead of pageX/pageY (document-relative)
    labelMenu.x = e.clientX
    labelMenu.y = e.clientY
    labelMenu.resources = [JSON.parse(JSON.stringify(currentImage.value))]
    labelMenuSearchQuery.value = ''
    
    // Focus the search input when menu opens
    if (labelMenu.visible) {
      // Use double nextTick to ensure DOM is fully rendered
      nextTick(() => {
        nextTick(() => {
          // Find the input element within the label menu (Naive UI wraps it)
          const inputElement = labelMenuEl.value?.querySelector('input') as HTMLInputElement
          if (inputElement) {
            try {
              // Prevent any buttons from getting focus
              const buttons = labelMenuEl.value?.querySelectorAll('button')
              buttons?.forEach(btn => {
                (btn as HTMLElement).tabIndex = -1
              })
              
              // Focus the input
              inputElement.focus()
              inputElement.select() // Select any existing text
              
              // Verify focus after a short delay
              setTimeout(() => {
              }, 50)
            } catch (error) {
            }
          }
        })
      })
    }
  }
}

function getLabelCheckedStatus(resources: ExtractedResourceLong[], labelId: string): number {
  if (resources.every(resource => resource.labelIds && resource.labelIds.includes(labelId)))
    return 2
  else if (resources.some(resource => resource.labelIds && resource.labelIds.includes(labelId)))
    return 1
  else return 0
}

function handleLabelStatusChange(label: Label) {
  const status = getLabelCheckedStatus(labelMenu.resources, label.id)

  if (status === 1) {
    labelMenu.resources.forEach((resource) => {
      if (!resource.labelIds) resource.labelIds = []
      if (resource.labelIds.includes(label.id))
        return
      resource.labelIds.push(label.id)
    })
  }
  else if (status === 2) {
    labelMenu.resources.forEach((resource) => {
      if (!resource.labelIds) resource.labelIds = []
      resource.labelIds = resource.labelIds.filter(l => l !== label.id)
    })
  }
  else if (status === 0) {
    labelMenu.resources.forEach((resource) => {
      if (!resource.labelIds) resource.labelIds = []
      if (resource.labelIds.includes(label.id))
        return
      resource.labelIds.push(label.id)
    })
  }
}

// Computed property to check if at least one label is selected across all resources
const hasSelectedLabels = computed(() => {
  if (!labelMenu.resources || labelMenu.resources.length === 0) {
    return false
  }
  // Check if any resource has at least one label selected
  return labelMenu.resources.some(resource => 
    resource.labelIds && 
    Array.isArray(resource.labelIds) && 
    resource.labelIds.length > 0
  )
})

async function executeSaveExtractedResourcesLabels(e: MouseEvent) {
  try {
    await $client.dLSession.updateManyExtractedResources.mutate({
      dLSessionId: route.params.id.toString(),
      extractedResources: labelMenu.resources.map(resource => ({
        id: resource.id,
        status: resource.status,
        labelIds: resource.labelIds || [],
      })),
    })
    // Close the label menu after saving
    labelMenu.visible = false
    notification.success({ 
      content: `Successfully Labelled Image`,
      duration: 3000,
      closable: true
    })
    // Emit refresh event to update the resources list
    emit('refreshDataGrid')
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Failed to update labels',
      duration: 5000
    })
  }
}

async function saveExtractedResourcesLabels(e: MouseEvent) {
  // Check if there are unsaved annotation changes
  if (hasUnsavedChanges.value) {
    // Hide the label menu
    labelMenu.visible = false
    // Store the event for later use
    pendingLabelEvent.value = e
    showUnsavedChangesModal.value = true
    pendingAction.value = () => {
      executeSaveExtractedResourcesLabels(e)
    }
  } else {
    // No unsaved changes, proceed with saving labels
    await executeSaveExtractedResourcesLabels(e)
  }
}

// Function to remove labels from the current image (similar to grid level page)
async function removeLabelsFromResource() {
  if (!resourcesToRemoveLabels.value || resourcesToRemoveLabels.value.length === 0) {
    showRemoveLabelsConfirmationModal.value = false
    return
  }

  try {
    // Remove all labels by setting labelIds to empty array for all selected resources
    await $client.dLSession.updateManyExtractedResources.mutate({
      dLSessionId: route.params.id.toString(),
      extractedResources: resourcesToRemoveLabels.value.map(resource => ({
        id: resource.id,
        status: resource.status,
        labelIds: [], // Empty array removes all labels
      })),
    })

    const resourceCount = resourcesToRemoveLabels.value.length

    notification.success({ 
      content: `Labels removed successfully from ${resourceCount} image${resourceCount > 1 ? 's' : ''}`, 
      duration: 3000 
    })

    // Emit refresh event to update the resources list from server
    emit('refreshDataGrid')
  }
  catch (error: any) {
    notification.error({ 
      content: error.message || 'Error in removing labels', 
      duration: 5000 
    })
  }
  finally {
    showRemoveLabelsConfirmationModal.value = false
    resourcesToRemoveLabels.value = []
  }
}

const listTaxonomyInput = ref({
  filter: {
    dLSessionId: route.params.id.toString(),
    extractedResourceId: props.resourceData.id,
  }
});

fetchTaxonomyMasters()

if (props.resourceData.comment)
  inputText.value = props.resourceData.comment

watch(() => [props.resourceData], async () => {
  if (!isVisualizationLock.value) {
    zoomer?.value?.reset()
    rotateImage('main', true)
    flipImage('main', true)
  }

  visualization.brightness = isVisualizationLock.value ? visualization.brightness : 1
  visualization.contrast = isVisualizationLock.value ? visualization.contrast : 1
  isImageInverted.value = isVisualizationLock.value ? isImageInverted.value : false

  currentIndex.value = props.totalResourceData?.findIndex((item: any) => item.id === props.resourceData.id) ?? 0
  if (props.resourceData.comment)
    inputText.value = props.resourceData.comment
  else
    inputText.value = ''
    await fetchTaxonomyMasters();
  gridImageSelected()
  undoStack.value = []
  redoStack.value = []
  markupUndoStack.value = []
  markupRedoStack.value = []
  markupGridUndoStack.value = []
  markupGridRedoStack.value = []
  // Reset initial state when resource data changes
  initialUndoStackLength.value = 0
  initialMarkupUndoStackLength.value = 0
  initialMarkupGridUndoStackLength.value = 0
  unlockAllTaxonomies()
  // Close label menu when image changes
  labelMenu.visible = false
})

function refreshActiveResource() {
  if (showTaxonomyMappingModal.value)
    openTaxonomyMappingModel(props.resourceData)
}

defineExpose({
  refreshActiveResource,
})

onBeforeUnmount(() => {
  if (stage)
    stage.destroy()

  resizeObserver?.disconnect()
})

// Shortcut keys
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('mousedown', handleMouseDownEvent)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('mouseup', handleMouseUpEvent)
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mousedown', handleMouseDownEvent)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('mouseup', handleMouseUpEvent)
  window.removeEventListener('wheel', handleWheel)
  const mediaQuery = window.matchMedia('(width)')
  mediaQuery.removeEventListener('change', refreshAnnotationData)
  window.removeEventListener('resize', refreshAnnotationData)
})

const isShiftKey = ref<boolean>(false)

let direction = ''
let oldx = 0
let oldy = 0

function handleMouseDownEvent(event: MouseEvent | TouchEvent | any) {
  if (isShiftKey.value && 'button' in event && event.button === 0)
    window.addEventListener('mousemove', handleMouseMoveEvent)
}

function handleKeyUp(event: MouseEvent | TouchEvent | any) {
  isShiftKey.value = false
  oldx = 0
  oldy = 0
}

function handleMouseUpEvent(event: MouseEvent | TouchEvent | any) {
  window.removeEventListener('mousemove', handleMouseMoveEvent)
  oldx = 0
  oldy = 0
}

function handleMouseMoveEvent(e: TouchEvent | any) {
  if (!isShiftKey.value)
    return

  if (e.pageX > oldx && e.pageY == oldy)
    direction = 'East'

  else if (e.pageX == oldx && e.pageY > oldy)
    direction = 'South'

  else if (e.pageX == oldx && e.pageY < oldy)
    direction = 'North'

  else if (e.pageX < oldx && e.pageY == oldy)
    direction = 'West'

  oldx = e.pageX
  oldy = e.pageY

  if (!isLock.value && showTaxonomyMappingModal.value) {
    if (direction === 'North' && annotationVisualization.brightness < 2)
      annotationVisualization.brightness = Number(Math.min(2, annotationVisualization.brightness + 0.05).toPrecision(3))
    else if (direction === 'South' && annotationVisualization.brightness > 0)
      annotationVisualization.brightness = Number(Math.max(0, annotationVisualization.brightness - 0.05).toPrecision(3))
    else if (direction === 'East' && annotationVisualization.contrast < 2)
      annotationVisualization.contrast = Number(Math.min(2, annotationVisualization.contrast + 0.05).toPrecision(3))
    else if (direction === 'West' && annotationVisualization.contrast > 0)
      annotationVisualization.contrast = Number(Math.max(0, annotationVisualization.contrast - 0.05).toPrecision(3))
  }

  if (!isVisualizationLock.value && !showTaxonomyMappingModal.value) {
    if (direction === 'North' && visualization.brightness < 2)
      visualization.brightness = Number(Math.min(2, visualization.brightness + 0.05).toPrecision(3))
    else if (direction === 'South' && visualization.brightness > 0)
      visualization.brightness = Number(Math.max(0, visualization.brightness - 0.05).toPrecision(3))
    else if (direction === 'East' && visualization.contrast < 2)
      visualization.contrast = Number(Math.min(2, visualization.contrast + 0.05).toPrecision(3))
    else if (direction === 'West' && visualization.contrast > 0)
      visualization.contrast = Number(Math.max(0, visualization.contrast - 0.05).toPrecision(3))
  }
}

const isClickedItems = ref([])
async function handleKeyDown(event: KeyboardEvent | MouseEvent | TouchEvent | any) {

  // Allow typing in input fields - check if user is typing in any input field
  const activeElement = document.activeElement as HTMLElement | null
  const target = (event.target as HTMLElement) || activeElement
  // Check if the active element (what's actually focused) is an input field
  // This is more reliable than checking event.target, especially for keyboard events
  const isActiveElementInput = activeElement && (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable === true ||
    activeElement.closest('input') !== null ||
    activeElement.closest('textarea') !== null ||
    activeElement.closest('[contenteditable="true"]') !== null ||
    (labelMenuEl.value && labelMenuEl.value.contains(activeElement))
  )

  // Also check if the target is an input field or within the label menu
  const isTargetInput = target && (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable === true ||
    (labelMenuEl.value && labelMenuEl.value.contains(target)) ||
    // Check for Naive UI input elements (they use nested structure)
    target.closest('input') ||
    target.closest('textarea') ||
    target.closest('[contenteditable="true"]')
  )

  // Use activeElement check as primary, fallback to target check
  const isInputField = isActiveElementInput || isTargetInput

  // Special case: If label menu is visible, check if we're typing in it
  // This handles cases where focus might not be on the input but user is trying to type
  const isLabelMenuVisible = labelMenu.visible
  const isWithinLabelMenu = labelMenuEl.value && (
    labelMenuEl.value.contains(activeElement) || 
    labelMenuEl.value.contains(target)
  )
  
  // If label menu is visible and user is interacting with it, allow typing
  // This is important because the input might not have focus but user is trying to type
  const shouldAllowTyping = isInputField || (isLabelMenuVisible && isWithinLabelMenu && !event.ctrlKey && !event.metaKey)

  // Special handling: If label menu is visible and user types a regular character,
  // focus the input and insert the character
  if (isLabelMenuVisible && !isInputField && !event.ctrlKey && !event.metaKey) {
    const key = event.key
    // Check if it's a printable character (not special keys like Escape, Enter, etc.)
    const isPrintableChar = key && key.length === 1 && !['Escape', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Backspace', 'Delete'].includes(key)
    
    if (isPrintableChar) {
      const inputElement = labelMenuEl.value?.querySelector('input') as HTMLInputElement
      if (inputElement) {
        event.preventDefault()
        event.stopPropagation()
        inputElement.focus()
        // Insert the character at the cursor position
        const start = inputElement.selectionStart || 0
        const end = inputElement.selectionEnd || 0
        const currentValue = inputElement.value || ''
        const newValue = currentValue.substring(0, start) + key + currentValue.substring(end)
        inputElement.value = newValue
        labelMenuSearchQuery.value = newValue
        // Set cursor position after the inserted character
        const newCursorPos = start + 1
        inputElement.setSelectionRange(newCursorPos, newCursorPos)
        return
      }
    }
    
    // Handle Backspace/Delete in label menu
    if ((key === 'Backspace' || key === 'Delete') && isLabelMenuVisible) {
      const inputElement = labelMenuEl.value?.querySelector('input') as HTMLInputElement
      if (inputElement) {
        event.preventDefault()
        event.stopPropagation()
        inputElement.focus()
        const start = inputElement.selectionStart || 0
        const end = inputElement.selectionEnd || 0
        const currentValue = inputElement.value || ''
        let newValue = currentValue
        if (key === 'Backspace' && start > 0) {
          newValue = currentValue.substring(0, start - 1) + currentValue.substring(end)
          const newCursorPos = start - 1
          inputElement.value = newValue
          labelMenuSearchQuery.value = newValue
          inputElement.setSelectionRange(newCursorPos, newCursorPos)
        } else if (key === 'Delete' && end < currentValue.length) {
          newValue = currentValue.substring(0, start) + currentValue.substring(end + 1)
          inputElement.value = newValue
          labelMenuSearchQuery.value = newValue
          inputElement.setSelectionRange(start, start)
        }
        return
      }
    }
  }

  // If user is typing in an input field or in the label menu, allow normal input behavior
  // Only process keyboard shortcuts (Ctrl+S, Ctrl+Z, Ctrl+Y, Ctrl+R) even in input fields
  if (shouldAllowTyping) {
    const isShortcutKey = (
      (event.ctrlKey || event.metaKey) && 
      (event.key && typeof event.key === 'string' && 
       (event.key.toLowerCase() === 's' || event.key.toLowerCase() === 'z' || event.key.toLowerCase() === 'y' || event.key.toLowerCase() === 'r'))
    )
    
    // Allow normal typing unless it's a shortcut key
    if (!isShortcutKey) {
      return
    }
  }

  // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm') {
    event.preventDefault()
    // Use the proper toggle functions instead of inline logic
    if (showTaxonomyMappingModal.value) {
      togglePopover()  // For annotation markup
    } else {
      togglePopoverGrid()  // For grid markup
    }
  }

  // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'e') {
    event.preventDefault()

    if (canSaveTaxonomyAtApprovalLevel.value) return;

    if (showMarkupPopover.value && showTaxonomyMappingModal.value) {
      isEraser.value = !isEraser.value
      setTimeout(() => {
        const { x, y } = lastMousePositionAnnotate.value
        if (eraserModeLabel.value == 'Marker Mode' && isEraser.value && cursorBigAnnotate.value)
          cursorBigAnnotate.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
        else if (eraserModeLabel.value == 'Eraser Mode' && !isEraser.value && cursorSmallAnnotate.value)
          cursorSmallAnnotate.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }, 0)
    }
    if (showMarkupPopoverGrid.value) {
      if (isVisualizationLock.value) return;
      isEraserGrid.value = !isEraserGrid.value
      setTimeout(() => {
        const { x, y } = lastMousePositionGrid.value
        if (eraserModeLabelGrid.value == 'Marker Mode' && isEraserGrid.value && cursorBigGrid.value)
          cursorBigGrid.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
        else if (eraserModeLabelGrid.value == 'Eraser Mode' && !isEraserGrid.value && cursorSmallGrid.value)
          cursorSmallGrid.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }, 0)
    }
  }
  if (event.key && event.key.toLowerCase() === 'h') {
    fetchTaxonomies.value.forEach((taxonomy) => {
      const typesInTaxonomies = taxonomy.taxonomy.typesInTaxonomies
      typesInTaxonomies.forEach((item) => {
        if (layer && item && item.id) {
          const checkIsClickedItemsAvailable = isClickedItems.value.indexOf(item.id)
          if (checkIsClickedItemsAvailable !== -1) {
            toggleSelectedItem(item, taxonomy.taxonomy.typesInTaxonomies)
          }
          else {
            const childElement = item.ChildTaxonomy
            childElement.forEach((parent: any) => {
              if (parent) {
                parent.ChildTaxonomyDataInDLSessions.forEach((child: any) => {
                  if (layer && child && child.id) {
                    const checkChildIsClickedItemsAvailable = isClickedItems.value.indexOf(child.id)
                    if (checkChildIsClickedItemsAvailable !== -1)
                      toggleSelectedItem(child, childElement)
                  }
                })
              }
            })
          }
        }
      })
    })
    layer.batchDraw()
  }
  if (event.shiftKey && event.key.toLowerCase() === 'h')
    hideAndShowBasedOnKey()
  // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() == 's') {
    event.preventDefault()
    if (canSaveTaxonomyAtApprovalLevel.value) return
    if (Object.keys(taxonomyCoordinates.value).length > 0) {
      selectedItems.value = []
      selectedGroups.value = []
      submitTaxonomyMapping()
    }
  }
  // "l" key: Toggle lock/unlock for currently clicked/selected annotations
  if (event.key && event.key.toLowerCase() === 'l' && !event.shiftKey && !event.ctrlKey && !event.altKey && showTaxonomyMappingModal.value) {
    const activeElement = document.activeElement as HTMLElement | null
    const target = (event.target as HTMLElement) || activeElement

    const isInputField = target && (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable === true
    )

    if (isInputField) {
      return
    }

    event.preventDefault()

    // Get all clicked annotation IDs (from clicking on canvas labels)
    let clickedItemIds = (isClickedItems.value || []).filter((id: string) => !!taxonomyCoordinates.value[id])

    // Fallback: If no clicked items, check if there's a selected annotation from sidebar
    if (clickedItemIds.length === 0 && selectedTaxonomyType.value && selectedTaxonomyType.value.id) {
      const selectedId = selectedTaxonomyType.value.id
      if (taxonomyCoordinates.value[selectedId]) {
        clickedItemIds = [selectedId]
      }
    }

    if (clickedItemIds.length === 0) {
      return // No clicked items, nothing to do
    }

    // Process each clicked annotation
    clickedItemIds.forEach((clickedId: string) => {
      // Find the taxonomy data for this clicked annotation
      let found = false
      fetchTaxonomies.value.forEach((taxonomy) => {
        if (found) return
        const typesInTaxonomies = taxonomy.taxonomy.typesInTaxonomies

        // Check if it's a parent item
        const parentItem = typesInTaxonomies.find((item: any) => item.id === clickedId)
        if (parentItem) {
          found = true
          toggleLockedItem(parentItem, typesInTaxonomies)
          return
        }

        // Check if it's a child item
        typesInTaxonomies.forEach((item: any) => {
          if (found) return
          if (item.ChildTaxonomy) {
            item.ChildTaxonomy.forEach((parent: any) => {
              if (found) return
              if (parent && parent.ChildTaxonomyDataInDLSessions) {
                const childItem = parent.ChildTaxonomyDataInDLSessions.find((child: any) => child.id === clickedId)
                if (childItem) {
                  found = true
                  toggleLockedItem(childItem, item.ChildTaxonomy)
                  return
                }
              }
            })
          }
        })
      })
    })

    layer.batchDraw()
  }

  // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() == 'l' && !event.shiftKey && !event.altKey) {
    if (showTaxonomyMappingModal.value) {
      event.preventDefault()

      // Get all annotation IDs from taxonomyCoordinates
      const allAnnotationIds = Object.keys(taxonomyCoordinates.value)

      if (allAnnotationIds.length === 0) {
        return
      }

      // First, ensure all annotations have lock states initialized
      allAnnotationIds.forEach((id) => {
        if (!lockStates.has(id)) {
          const group = layer!.findOne(g => g.attrs.id === `${id}group`) as Konva.Group
          if (group) {
            lockStates.set(id, {
              locked: false,
              group,
              parentId: null,
            })
            setAnnotationDraggable(id, true)
          }
        }
      })

      // Check if all annotations are currently locked
      const allLocked = allAnnotationIds.every(id => {
        if (lockedItems.value.includes(id)) {
          return true
        }
        const state = lockStates.get(id)
        return state?.locked === true
      })

      // Determine the action: if all are locked, unlock all; otherwise lock all
      const shouldLock = !allLocked

      // Directly update all annotations instead of relying on group state
      allAnnotationIds.forEach((id) => {
        const state = lockStates.get(id)
        if (state) {
          const currentlyLocked = state.locked || lockedItems.value.includes(id)

          // Only update if state needs to change
          if (shouldLock && !currentlyLocked) {
            state.locked = true
            setAnnotationDraggable(id, false)
            if (!lockedItems.value.includes(id)) {
              lockedItems.value.push(id)
            }
          } else if (!shouldLock && currentlyLocked) {
            state.locked = false
            setAnnotationDraggable(id, true)
            const index = lockedItems.value.indexOf(id)
            if (index !== -1) {
              lockedItems.value.splice(index, 1)
            }
          }
        }
      })

      // Update group states to match individual annotation states
      fetchTaxonomies.value.forEach((taxonomy) => {
        const typesInTaxonomies = taxonomy.taxonomy.typesInTaxonomies
        if (typesInTaxonomies && typesInTaxonomies.length > 0) {
          // Check if all items in this group match the desired state
          const groupItemIds = typesInTaxonomies.flatMap(item => [
            item.id,
            ...getChildTypeIds(item.ChildTaxonomy),
            ...getUnAnnotatedIds(item.ChildTaxonomy),
          ])

          const groupAnnotationsInCoordinates = groupItemIds.filter(id =>
            allAnnotationIds.includes(id)
          )

          if (groupAnnotationsInCoordinates.length > 0) {
            const allGroupItemsLocked = groupAnnotationsInCoordinates.every(id => {
              const state = lockStates.get(id)
              return state?.locked === true || lockedItems.value.includes(id)
            })

            const groupIndex = lockedGroups.value.indexOf(typesInTaxonomies)
            const groupIsInLockedGroups = groupIndex !== -1

            // Sync group state with individual annotation states
            if (shouldLock && allGroupItemsLocked && !groupIsInLockedGroups) {
              lockedGroups.value.push(typesInTaxonomies)
            } else if (!shouldLock && !allGroupItemsLocked && groupIsInLockedGroups) {
              lockedGroups.value.splice(groupIndex, 1)
            }
          }
        }
      })

      layer.batchDraw()
    }
    else {
      isVisualizationLock.value = !isVisualizationLock.value
    }
  }
  if (event.shiftKey && event.key.toLowerCase() == 'l') {
    if (showTaxonomyMappingModal.value)
      isLock.value = !isLock.value
    else
      isVisualizationLock.value = !isVisualizationLock.value
  }
  // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() == 'r') {
    event.preventDefault()
    event.stopPropagation()
    annotationVisualization.brightness = 1
    annotationVisualization.contrast = 1
    if (!showTaxonomyMappingModal.value) {
      visualization.brightness = 1
      visualization.contrast = 1
    }
  }

  if (showTaxonomyMappingModal.value) {
    // Ctrl + Shift + Arrow keys: Copy annotations to next/previous image
    // Check this FIRST to prevent the regular navigation from also triggering
    // Use the exact same functionality as the button click
    // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault()
      if (event.key === 'ArrowRight') {
        // Exact same logic as the "Next Image" button in copy annotation modal
        if (isNextButtonDisabled()) {
          notification.warning({ content: 'No next image available', duration: 3000 })
          return
        }
        pendingCopyAction.value = 'next'
        navigateToNextImageForCopy()
        showCopyAnnotationModal.value = false
      } else {
        // Exact same logic as the "Previous Image" button in copy annotation modal
        if (isPreviousButtonDisabled()) {
          notification.warning({ content: 'No previous image available', duration: 3000 })
          return
        }
        pendingCopyAction.value = 'previous'
        navigateToPreviousImageForCopy()
        showCopyAnnotationModal.value = false
      }
      return // Important: prevent other handlers from executing
    }
    // Ctrl/Cmd + Arrow keys: Regular navigation (without Shift)
    // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault() // Prevent macOS browser navigation (back/forward)
      event.stopPropagation() // Prevent DataView from also handling this event
      if(event.key=== 'ArrowRight'){
        nextImage()
      }
      else
      {
        previousImage()
      }
      return // Prevent further event processing
    }
  }
  const isModifierPressed = event.ctrlKey || event.metaKey
  const key = typeof event.key === 'string' ? event.key.toLowerCase() : ''

  if (isModifierPressed && key === 'z' && !event.shiftKey) {
    if (showTaxonomyMappingModal.value || showMarkupPopover.value || showMarkupPopoverGrid.value) {
      event.preventDefault()
      await handleUndoAction()
      return
    }
  }

  if (isModifierPressed && (key === 'y' || (event.shiftKey && key === 'z'))) {
    if (showTaxonomyMappingModal.value || showMarkupPopover.value || showMarkupPopoverGrid.value) {
      event.preventDefault()
      await handleRedoAction()
      return
    }
  }

  const isBackspace = event.key === 'Backspace' || (event as any).keyCode === 8 || (event as any).which === 8

  if (isBackspace) {
    const activeElement = document.activeElement as HTMLElement | null
    const target = (event.target as HTMLElement) || activeElement

    const isInputField = target && (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable === true
    )

    // Check for selected items from the list (selectedItems)
    const selectedItemIds = (selectedItems.value || []).filter((id: string) => !!taxonomyCoordinates.value[id])

    if (
      selectedItemIds.length > 0 &&
      showTaxonomyMappingModal.value &&
      !isInputField
    ) {
      event.preventDefault()
      event.stopPropagation()

      // Delete selected items directly
      for (const selectedId of selectedItemIds) {
        // Find the taxonomy data to pass to deleteTaxonomyMarking
        const taxonomyData = findTaxonomyDataById(selectedId)
        if (taxonomyData) {
          await deleteTaxonomyMarking(taxonomyData)
        } else {
          // If not found in fetchTaxonomies, create a simple object with id
          await deleteTaxonomyMarking({ id: selectedId })
        }
      }



      // Clear selected items after deletion
      selectedItems.value = []
      return
    }

    const clickedItems = (isClickedItems.value || []).filter((id: string) => !!taxonomyCoordinates.value[id])

    if (
      clickedItems.length > 0 &&
      showTaxonomyMappingModal.value &&
      !isInputField
    ) {
      event.preventDefault()
      event.stopPropagation()
      showDeleteConfirmationModal.value = true
      return
    }

    // Handle label deletion in image preview ONLY when annotation modal is open
    // When modal is closed, DataView handles label deletion to avoid duplicate modals
    if (
      showTaxonomyMappingModal.value &&
      currentImage.value &&
      currentImage.value.labelIds &&
      currentImage.value.labelIds.length > 0 &&
      !isInputField
    ) {
      // Only allow label deletion if we're not deleting taxonomy annotations
      const selectedItemIds = (selectedItems.value || []).filter((id: string) => !!taxonomyCoordinates.value[id])
      const clickedItems = (isClickedItems.value || []).filter((id: string) => !!taxonomyCoordinates.value[id])
      
      // If there are selected taxonomy items, prioritize taxonomy deletion
      if (selectedItemIds.length > 0 || clickedItems.length > 0) {
        // Taxonomy deletion will be handled above, don't interfere
        return
      }
      
      event.preventDefault()
      event.stopPropagation()
      resourcesToRemoveLabels.value = [currentImage.value]
      showRemoveLabelsConfirmationModal.value = true
      return
    }
  }
  if (event.shiftKey)
    isShiftKey.value = true
}

function saveLastType(type: object, isChild: boolean, parentData?: any, groupItems?: any[]) {
  // If this annotation is already drawn, toggle its selection state in selectedItems
  // This allows selecting drawn annotations for deletion with backspace
  const typeId = type.id || (type as any).id
  if (typeId && Object.keys(taxonomyCoordinates.value).includes(typeId)) {
    const selectedIndex = selectedItems.value.indexOf(typeId)
    // if (selectedIndex !== -1) {
    //   // Already selected, deselect it
    //   selectedItems.value.splice(selectedIndex, 1)
    // } else {
    //   // Not selected, add it
    //   selectedItems.value.push(typeId)
    // }
  }

  if (isChild) {
    // Extract abbreviation from multiple possible locations
    const getAbbrev = (t: any) => t?.abbreviation || t?.taxonomyData?.abbreviation || t?.annotation_abbreviation ||
                                 t?.ChildTaxonomyDataInDLSessions?.[0]?.abbreviation ||
                                 t?.ChildTaxonomyDataInDLSessions?.[0]?.taxonomyData?.abbreviation ||
                                 t?.taxonomiesAnnotationsInDLSessions?.annotation?.abbreviation || ''

    let abbrev = getAbbrev(type) || getAbbrev(parentData) || (type as any).name || ''

    // Preserve serial number from child name (e.g., "ParentName1" -> "CN1")
    const childName = (type as any).name || ''
    const parentName = parentData?.name || ''
    const parentAbbrev = parentData?.abbreviation || ''
    if (childName?.startsWith(parentName) && parentAbbrev) {
      const serialNum = childName.slice(parentName.length)
      if (/^\d+$/.test(serialNum) && !abbrev.endsWith(serialNum)) {
        abbrev = parentAbbrev + serialNum
      }
    }

    const transformedObject = {
      ...type,
      colorCode: parentData?.colorCode ?? (type as any).colorCode,
      taxonomyType: parentData?.taxonomyType ?? (type as any).taxonomyType,
      taxonomiesAnnotationsInDLSessionsId: (type as any).taxonomiesAnnotationsInDLSessionsId ||
                                         parentData?.taxonomiesAnnotationsInDLSessionsId,
      abbreviation: abbrev,
      changeAppearance: (type as any).changeAppearance || parentData?.changeAppearance,
      rotation: 0
    }

    if (typeof transformedObject.taxonomyType !== 'object' || Array.isArray(transformedObject.taxonomyType))
      transformedObject.taxonomyType = {}

    if (!transformedObject.taxonomyType.parentId) {
      transformedObject.taxonomyType.parentId = type.id
      transformedObject.taxonomyType.typesInTaxonomyId = type.typesInTaxonomyId
    }

    delete transformedObject.typesInTaxonomy
    selectedTaxonomyType.value = transformedObject
  }
  else {
    selectedTaxonomyType.value = {
      ...type,
      abbreviation: type.abbreviation || type?.name,
      taxonomiesAnnotationsInDLSessionsId: type.taxonomiesAnnotationsInDLSessionsId,
      changeAppearance: type.changeAppearance,
      rotation: 0  // FIX 8: Initialize rotation for new parent crossbars
    }
  }
}

function handleMouseMove(event: any) {
  if (isLock.value) return;
  if (Object.keys(selectedTaxonomyType.value).length != 0) {
    // Bounding Box and Non-Rotational Bounding Box
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Transform the coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const position = transform.point(pointerPosition);
    if (
      (selectedTaxonomyType.value.taxonomyType.name == 'Bounding Box' ||
       selectedTaxonomyType.value.taxonomyType.name == 'Non-Rotational Bounding Box')
      && (
        !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)
        | (Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id) && taxonomyCoordinates.value[selectedTaxonomyType.value.id].end == null)
      )
    )
      updateBoundingBox(position.x, position.y, selectedTaxonomyType.value.id, selectedTaxonomyType.value.name, selectedTaxonomyType.value.taxonomyType.name)

    // Ellipse
    if (
      selectedTaxonomyType.value.taxonomyType.name == 'Ellipse'
      && (
        !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)
        | (Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id) && taxonomyCoordinates.value[selectedTaxonomyType.value.id].completed == false)
      )
    )
      updateEllipseSize(position.x, position.y, selectedTaxonomyType.value.id, selectedTaxonomyType.value.name, selectedTaxonomyType.value.taxonomyType.name)

    // Angle
    if (selectedTaxonomyType.value.taxonomyType.name == 'Angle' && !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)) {
      if (currentAnglePoints.value.length === 0 || currentAnglePoints.value.length > 2)
        return

      const pos = { x: position.x, y: position.y }
      const tempLine = currentAnglePoints.value.length === 1 ? layer.findOne('#tempLine1') : layer.findOne('#tempLine2')

      if (tempLine) {
        const start = currentAnglePoints.value.length === 1 ? currentAnglePoints.value[0] : currentAnglePoints.value[0]
        tempLine.points([start.x, start.y, pos.x, pos.y])
        layer.batchDraw()
      }
    }
  }
}

function handleMouseUp(event: any) {
  if (isLock.value) return;
  const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Transform the coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const position = transform.point(pointerPosition);
  if (
    selectedTaxonomyType.value.taxonomyType && selectedTaxonomyType.value.taxonomyType.name == 'Ellipse'
    && (
      !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)
      | (Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id) && taxonomyCoordinates.value[selectedTaxonomyType.value.id].completed == false)
    )
  )
    completeEllipse(
      position.x,
      position.y,
      selectedTaxonomyType.value.id,
      selectedTaxonomyType.value.name,
      selectedTaxonomyType.value.abbreviation,
      selectedTaxonomyType.value.taxonomyType.name
    )
}

function handleMouseDown(event: any) {
  if (isLock.value) return;
  const pointerPosition = stage.getPointerPosition();
  if (!pointerPosition) return;

    // Transform the coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const position = transform.point(pointerPosition);


  // Ellipse
  if (
    selectedTaxonomyType.value.taxonomyType && selectedTaxonomyType.value.taxonomyType.name == 'Ellipse'
    && (
      !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id))
      | (Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id) && Object.keys(taxonomyCoordinates.value[selectedTaxonomyType.value.id]).includes('ellipse'))
  )
    startEllipse(position.x, position.y, selectedTaxonomyType.value.id, selectedTaxonomyType.value.name,selectedTaxonomyType.value.abbreviation, selectedTaxonomyType.value.taxonomyType.name, selectedTaxonomyType.value.colorCode, null, null, null, false, false, selectedTaxonomyType.value.taxonomyType?.parentId, selectedTaxonomyType.value.taxonomyType?.typesInTaxonomyId,selectedTaxonomyType.value?.taxonomiesAnnotationsInDLSessionsId)
}

function handleClick(event: any) {
  if (isLock.value) return;
  if (Object.keys(selectedTaxonomyType.value).length != 0) {
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Transform the coordinates
    const transform = stage.getAbsoluteTransform().copy().invert();
    const position = transform.point(pointerPosition);
    // Landmark
    if (selectedTaxonomyType.value.taxonomyType.name == 'Landmark' && !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)){
      addLandmark({},position.x, position.y, selectedTaxonomyType.value.id, selectedTaxonomyType.value.name, selectedTaxonomyType.value.abbreviation,selectedTaxonomyType.value.taxonomyType.name, selectedTaxonomyType.value.colorCode, null, false, selectedTaxonomyType.value.taxonomyType?.parentId, selectedTaxonomyType.value.taxonomyType?.typesInTaxonomyId,  selectedTaxonomyType.value?.taxonomiesAnnotationsInDLSessionsId,selectedTaxonomyType.value?.changeAppearance || selectedTaxonomyType.value.taxonomyType?.changeAppearance)
    }
    // Measurement
    if (
      selectedTaxonomyType.value.taxonomyType.name == 'Measurement'
      && (
        !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)
        | (Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id) && taxonomyCoordinates.value[selectedTaxonomyType.value.id].end == null)
      )
    )
      addMeasurementPoint(position.x, position.y, {}, selectedTaxonomyType.value.id, selectedTaxonomyType.value.name, selectedTaxonomyType.value.abbreviation,selectedTaxonomyType.value.taxonomyType.name, selectedTaxonomyType.value.colorCode, null, false, selectedTaxonomyType.value.taxonomyType?.parentId, selectedTaxonomyType.value.taxonomyType?.typesInTaxonomyId,selectedTaxonomyType.value?.taxonomiesAnnotationsInDLSessionsId)

    // Bounding Box and Non-Rotational Bounding Box
    if (
      (selectedTaxonomyType.value.taxonomyType.name == 'Bounding Box' ||
       selectedTaxonomyType.value.taxonomyType.name == 'Non-Rotational Bounding Box')
      && (
        !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)
        | (Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id) && taxonomyCoordinates.value[selectedTaxonomyType.value.id].end == null)
      )
    )
      startBoundingBox(position.x, position.y, selectedTaxonomyType.value.id, selectedTaxonomyType.value.name, selectedTaxonomyType.value.abbreviation,selectedTaxonomyType.value.taxonomyType.name, selectedTaxonomyType.value.colorCode, null, undefined, false, selectedTaxonomyType.value.taxonomyType?.parentId, selectedTaxonomyType.value.taxonomyType?.typesInTaxonomyId,selectedTaxonomyType.value?.taxonomiesAnnotationsInDLSessionsId)

    // Angle
    if (selectedTaxonomyType.value.taxonomyType.name == 'Angle' && !Object.keys(taxonomyCoordinates.value).includes(selectedTaxonomyType.value.id)) {
      const pos = { x: position.x, y: position.y }
      currentAnglePoints.value.push(pos)

      if (currentAnglePoints.value.length === 1) {
        // First click: define the vertex and start drawing the first arm
        drawTemporaryLine(pos, 'tempLine1', selectedTaxonomyType.value.colorCode)
      }
      else if (currentAnglePoints.value.length === 2) {
        // Second click: start drawing the second arm
        drawTemporaryLine(currentAnglePoints.value[0], 'tempLine2', selectedTaxonomyType.value.colorCode)
      }
      else if (currentAnglePoints.value.length === 3) {
        // Third click: finalize the angle
        finalizeAngle(selectedTaxonomyType.value.id, selectedTaxonomyType.value.name, selectedTaxonomyType.value.abbreviation,selectedTaxonomyType.value.taxonomyType.name,selectedTaxonomyType.value.colorCode, null, false, selectedTaxonomyType.value.taxonomyType?.parentId, selectedTaxonomyType.value.taxonomyType?.typesInTaxonomyId,selectedTaxonomyType.value?.taxonomiesAnnotationsInDLSessionsId)
      }
    }
  }
}

function calculateSize(containerWidth: number, containerHeight: number, aspectRatio: number) {
  let newWidth, newHeight

  if (containerWidth / containerHeight > aspectRatio) {
    newHeight = containerHeight
    newWidth = newHeight * aspectRatio
  }
  else {
    newWidth = containerWidth
    newHeight = newWidth / aspectRatio
  }

  return { width: newWidth, height: newHeight }
}
async function openTaxonomyMappingModel(resourceData, requestId) {
  const thisRequestId = requestId ?? ++latestRequestId;
  if (stage) {
    try {
      stage.destroy()
    }
    catch {}
    stage = undefined
  }
  if (annotationImageObj) {
    try { annotationImageObj.onload = null as any } catch {}
    try { annotationImageObj.src = '' } catch {}
    annotationImageObj = null
  }
  if (resizeObserver) { try { resizeObserver.disconnect() } catch {} }
  // Disconnect grid ResizeObserver to prevent grid image from resizing when annotation modal opens
  if (gridResizeObserver) {
    try { gridResizeObserver.disconnect() } catch {}
    gridResizeObserver = null
  }
  // Clear all undo stacks when opening modal
  undoStack.value = []
  redoStack.value = []
  markupUndoStack.value = []
  markupRedoStack.value = []
  markupGridUndoStack.value = []
  markupGridRedoStack.value = []
  // Reset initial state tracking
  initialUndoStackLength.value = 0
  initialMarkupUndoStackLength.value = 0
  initialMarkupGridUndoStackLength.value = 0
  // Clear order maps when opening a new image to avoid stale data
  manualOrderMap.value.clear()
  databaseOrderMap.value.clear()
  await fetchTaxonomyMasters();
  annotationVisualization.brightness = isLock.value ? annotationVisualization.brightness : 1
  annotationVisualization.contrast = isLock.value ? annotationVisualization.contrast : 1
  isImageAnnotationInverted.value = isLock.value ? isImageAnnotationInverted.value : false
  if (!isLock.value) {
    annotationZoomer?.value?.reset()
    rotateImage('annotation', true)
    flipImage('annotation', true)
  }
  taxonomyIndex.value = 0
  selectedTaxonomyType = ref({})
  // IMPORTANT: Match `Preview (7).vue` / revamp behavior:
  // On every open of the annotation modal, rebuild the annotation canvas from server data.
  // This avoids the "close -> open -> empty canvas" case caused by keeping stale/detached Konva node refs.
  //
  // Also: mutate the existing ref instead of reassigning to preserve reactivity.
  taxonomyCoordinates.value = {}
  currentAnnotationResourceId = resourceData.id
  // Reset saved annotations flag when opening a new image
  hasSavedAnnotationsInCurrentSession.value = false
  newTaxonomyInCESession.value = {
    id: resourceData.id,
    typesInTaxonomies: '',
    metadata: resourceData.metadata,
  }
  await nextTick()
  if (annotationContainer.value) {
    annotationContainer.value.style.width = '70%'
    annotationContainer.value.style.height = '100%'
    annotationContainer.value.style.position = 'relative'
    annotationContainer.value.offsetHeight
  }
  setTimeout(async () => {
    if (konvaContainer.value && annotationContainer.value) {
      const rect = annotationContainer.value.getBoundingClientRect()
      stage = new Konva.Stage({
        container: konvaContainer.value,
        width: rect.width,
        height: rect.height,
        draggable: false,
        dragBoundFunc: (pos) => getBoundedPosition(stage, pos),
      })
      layer = new Konva.Layer()
      stage.add(layer)
      annotationImageObj = new Image()
      annotationImageObj.onload = () => {
        imageAspectRatio = annotationImageObj.width / annotationImageObj.height
        const konvaImage = new Konva.Image({
          image: annotationImageObj,
          x: 0,
          y: 0,
          ...calculateSize(stage.width(), stage.height(), imageAspectRatio),
        })
        annotationImageNode = konvaImage;
        layer.add(konvaImage)
        layer.batchDraw()

        markupLayer = new Konva.Layer()
        markupGroup = new Konva.Group()
        markupLayer.add(markupGroup)
        stage.add(markupLayer)
        stage.on('mousedown', markupHandleMouseDown)
        stage.on('mousemove', markupHandleMouseMove)
        stage.on('mouseup', markupHandleMouseUp)
        stage.on('mouseenter', markupHandleMouseEnter)
        stage.on('mouseleave', markupHandleMouseLeave)

        const requestData = {
          dLSessionId: route.params.id.toString(),
          extractedResourceId: resourceData.id,
        }
        $client.dLSession.getMarkupData.useQuery(requestData, {
          transform: (response) => {
            loadSavedMarkup(response && response.markupData)
            markupGroup.visible(false) // Hide by default; only show when popover is open
            markupLayer.visible(true)
            markupLayer.batchDraw()
          },
        })

        setTimeout(() => {
          if (thisRequestId !== latestRequestId) return;
          getTaxonomyData(resourceData.id, thisRequestId);
          // Set initial state after data is loaded
          // Note: loadSavedMarkup and loadSavedMarkupGrid set their own initial states
          // This ensures annotation undo stack initial state is set after getTaxonomyData completes
          setTimeout(() => {
            if (thisRequestId !== latestRequestId) return;
            // Stored annotations don't populate undo stack, so it should be 0
            // But set it to current length to be safe
            initialUndoStackLength.value = undoStack.value.length
            // Ensure markup initial states are set if load functions haven't run yet
            if (markupUndoStack.value.length > 0 && initialMarkupUndoStackLength.value === 0) {
              initialMarkupUndoStackLength.value = markupUndoStack.value.length
            }
            if (markupGridUndoStack.value.length > 0 && initialMarkupGridUndoStackLength.value === 0) {
              initialMarkupGridUndoStackLength.value = markupGridUndoStack.value.length
            }
          }, 500);
        }, 100);
      }
      annotationImageObj.src = resourceData.fullPath
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      resizeObserver = new ResizeObserver((entries) => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }
        resizeTimeout = setTimeout(() => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect
            const finalWidth = Math.max(width, 300)
            const finalHeight = Math.max(height, 200)
            if (stage && layer) {
              stage.width(finalWidth)
              stage.height(finalHeight)
              const imageSize = calculateSize(finalWidth, finalHeight, imageAspectRatio)
              const konvaImage = layer.getChildren().find(child => child instanceof Konva.Image)
              if (konvaImage) {
                konvaImage.setAttrs(imageSize)
                annotationImageNode = konvaImage;
              }
              layer.batchDraw()
            }
          }
        }, 100)
      })
      resizeObserver.observe(annotationContainer.value)
    }
    await nextTick()
    if (annotationContainer.value) {
      const rect = annotationContainer.value.getBoundingClientRect()
      imageContainerDimensions.value = {
        width: rect.width,
        height: rect.height
      }
      // annotationContainer.value.style.width = `${rect.width}px`
      // annotationContainer.value.style.height = `${rect.height}px`
    }
  }, 500)
  resetZoom()
  showTaxonomyMappingModal.value = true
}

// Add getBoundedPosition function for annotation stage boundary
function getBoundedPosition(stage: Konva.Stage, pos: { x: number, y: number }) {
  // Use the annotation image node if available
  if (annotationImageNode) {
    const scale = stage.scaleX();
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    // The image is always at (0,0) in stage coordinates, but may be letterboxed
    const imgX = annotationImageNode.x();
    const imgY = annotationImageNode.y();
    const imgWidth = annotationImageNode.width() * scale;
    const imgHeight = annotationImageNode.height() * scale;
    // The visible area of the image in stage coordinates
    const minX = Math.min(0, stageWidth - imgWidth) + imgX * scale;
    const maxX = imgX * scale;
    const minY = Math.min(0, stageHeight - imgHeight) + imgY * scale;
    const maxY = imgY * scale;
    let x = Math.max(minX, Math.min(pos.x, maxX));
    let y = Math.max(minY, Math.min(pos.y, maxY));
    return { x, y };
  }
  // fallback to old logic if image node not available
  const scale = stage.scaleX();
  const stageWidth = stage.width();
  const stageHeight = stage.height();
  const containerWidth = stageWidth;
  const containerHeight = stageHeight;
  const scaledWidth = stageWidth * scale;
  const scaledHeight = stageHeight * scale;
  let minX = Math.min(0, containerWidth - scaledWidth);
  let maxX = 0;
  let minY = Math.min(0, containerHeight - scaledHeight);
  let maxY = 0;
  if (scaledHeight < containerHeight) {
    minY = maxY = (containerHeight - scaledHeight) / 2;
  }
  if (scaledWidth < containerWidth) {
    minX = maxX = (containerWidth - scaledWidth) / 2;
  }
  let x = Math.max(minX, Math.min(pos.x, maxX));
  let y = Math.max(minY, Math.min(pos.y, maxY));
  return { x, y };
}

function getRelativePosition(absoluteX: number, absoluteY: number, imageWidth: number, imageHeight: number) {
  return [absoluteX / imageWidth, absoluteY / imageHeight]
}

function getAbsolutePosition(relativeX: number, relativeY: number, imageWidth: number, imageHeight: number) {
  return [relativeX * imageWidth, relativeY * imageHeight]
}


async function fetchTaxonomyMasters() {
  listTaxonomyInput.value.filter.extractedResourceId = currentImage.value?.id || props.resourceData.id;

  const result = await $client.dLSession.taxonomyData.useQuery(listTaxonomyInput.value, {
    transform: (response) => {
      // First check if response exists and has the expected structure
      if (response && Array.isArray(response) && response.length > 0) {
        const taxonomiesData = response[0];
        fetchTaxonomies.value = taxonomiesData;
        
        // Extract and preserve the order from the API response
        // The backend already returns data in the correct order, so we should preserve it
        const taxonomies = Array.isArray(taxonomiesData) ? taxonomiesData : [taxonomiesData];
        
        taxonomies.forEach((taxonomy: any) => {
          if (taxonomy?.taxonomy?.typesInTaxonomies && taxonomy?.taxonomy?.id) {
            const taxonomyId = taxonomy.taxonomy.id;
            
            // Extract the order from the API response (items are already in correct order)
            const orderedAnnotationIds = taxonomy.taxonomy.typesInTaxonomies
              .map((item: any) => item.taxonomiesAnnotationsInDLSessionsId)
              .filter(Boolean);
            
            // Store the order as it comes from the API
            if (orderedAnnotationIds.length > 0) {
              databaseOrderMap.value.set(taxonomyId, orderedAnnotationIds);
            }
          }
        });
      }
      // else {
      //   // Show notification when no taxonomies are found
      //   notification.info({
      //     content: 'No Taxonomies are mapped to this Session',
      //     duration: 5000
      //   });
      // }
    },
    server: false,
  });
  
  return result;
}

async function getTaxonomyData(resourceId?: string, requestId?: number) {
  const thisRequestId = requestId ?? latestRequestId;
  await fetchTaxonomyMasters();
  const requestData: GetTaxonomyDataInput = {
    dLSessionId: route.params.id.toString(),
    extractedResourceId: resourceId || props.resourceData.id,
  }
  await $client.dLSession.getTaxonomyData.useQuery(requestData, {
    transform: (response) => {
      if (thisRequestId !== latestRequestId) return;
      
      // If response has no annotations, immediately set flag to false and return
      if (!response || (!response.parentData || response.parentData.length === 0) && (!response.childtaxonomydata || response.childtaxonomydata.length === 0)) {
        hasSavedAnnotationsInCurrentSession.value = false
        return
      }
      
      const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)
      response.parentData.forEach((d) => {
        if (taxonomyIndex.value <= d.taxonomyData.index) {
          taxonomyIndex.value = d.taxonomyData.index
          taxonomyIndex.value += 1
        }
        if (d.type == 'Landmark' || d.type == 'Crossbar') {
          const tmp = getAbsolutePosition(d.taxonomyData.x, d.taxonomyData.y, imageSize.width, imageSize.height)
          d.taxonomyData.x = tmp[0]
          d.taxonomyData.y = tmp[1]
          d.taxonomyData.type = d.type  // FIX 6: Preserve the actual type

          // FIX 6: Pass the complete taxonomyData object which includes rotation
          addLandmark(
            d.taxonomyData,           // Pass full data object with rotation
            d.taxonomyData.x,
            d.taxonomyData.y,
            d.taxonomiesAnnotationsInDLSessionsId,
            d.name,
            d.annotation_abbreviation,
            d.taxonomyData.type,      // Use the actual type
            d.colorCode,
            d.taxonomyData.index,
            true,                      // isStored
            null,                      // parentId (null for parent)
            null,                      // typesInTaxonomyId (null for parent)
            d.taxonomiesAnnotationsInDLSessionsId,
            d.changeAppearance         // This determines if it's a crossbar
          )
        }
        if (d.type == 'Measurement') {
          d.taxonomyData.type = 'Measurement'
          const tmp1 = getAbsolutePosition(d.taxonomyData.start.x, d.taxonomyData.start.y, imageSize.width, imageSize.height)
          d.taxonomyData.start.x = tmp1[0]
          d.taxonomyData.start.y = tmp1[1]
          addMeasurementPoint(d.taxonomyData.start.x, d.taxonomyData.start.y, d.taxonomyData, d.taxonomiesAnnotationsInDLSessionsId, d.name, d.annotation_abbreviation,d.taxonomyData.type, d.colorCode, d.taxonomyData.index, true,null,null,d.taxonomiesAnnotationsInDLSessionsId)

          const tmp2 = getAbsolutePosition(d.taxonomyData.end.x, d.taxonomyData.end.y, imageSize.width, imageSize.height)
          d.taxonomyData.end.x = tmp2[0]
          d.taxonomyData.end.y = tmp2[1]
          addMeasurementPoint(d.taxonomyData.end.x, d.taxonomyData.end.y, d.taxonomyData, d.taxonomiesAnnotationsInDLSessionsId, d.name, d.annotation_abbreviation,d.taxonomyData.type, d.colorCode, d.taxonomyData.index,true,null,null,d.taxonomiesAnnotationsInDLSessionsId)
        }
        if (d.type == 'Bounding Box' || d.type == 'Non-Rotational Bounding Box') {
          d.taxonomyData.type = d.type
          const tmp1 = getAbsolutePosition(d.taxonomyData.start.x, d.taxonomyData.start.y, imageSize.width, imageSize.height)
          d.taxonomyData.start.x = tmp1[0]
          d.taxonomyData.start.y = tmp1[1]
          startBoundingBox(d.taxonomyData.start.x, d.taxonomyData.start.y, d.taxonomiesAnnotationsInDLSessionsId, d.name,d.annotation_abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, undefined, true,null,null,d.taxonomiesAnnotationsInDLSessionsId)

          const tmp2 = getAbsolutePosition(d.taxonomyData.end.x, d.taxonomyData.end.y, imageSize.width, imageSize.height)
          d.taxonomyData.end.x = tmp2[0]
          d.taxonomyData.end.y = tmp2[1]

          const tmp3 = getAbsolutePosition(d.taxonomyData.center.x, d.taxonomyData.center.y, imageSize.width, imageSize.height)
          taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId].center.x = tmp3[0]
          taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId].center.y = tmp3[1]
          d.taxonomyData.center.x = tmp3[0]
          d.taxonomyData.center.y = tmp3[1]

          const tmp4 = getAbsolutePosition(d.taxonomyData.width, d.taxonomyData.height, imageSize.width, imageSize.height)
          taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId].width = tmp4[0]
          taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId].height = tmp4[1]
          d.taxonomyData.width = tmp4[0]
          d.taxonomyData.height = tmp4[1]

          startBoundingBox(d.taxonomyData.end.x, d.taxonomyData.end.y, d.taxonomiesAnnotationsInDLSessionsId, d.name,d.annotation_abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, d.taxonomyData, true,d.taxonomiesAnnotationsInDLSessionsId)

          setTimeout(() => {
            updateAnchorPositions(taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId].anchors, taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId].rect, d.taxonomiesAnnotationsInDLSessionsId)
          }, 100)
        }
        if (d.type == 'Ellipse') {
          d.taxonomyData.type = 'Ellipse'
          const tmp1 = getAbsolutePosition(d.taxonomyData.x, d.taxonomyData.y, imageSize.width, imageSize.height)
          const tmp2 = getAbsolutePosition(d.taxonomyData.radiusX, d.taxonomyData.radiusY, imageSize.width, imageSize.height)
          d.taxonomyData.x = tmp1[0]
          d.taxonomyData.y = tmp1[1]
          d.taxonomyData.radiusX = tmp2[0]
          d.taxonomyData.radiusY = tmp2[1]
          startEllipse(d.taxonomyData.x, d.taxonomyData.y, d.taxonomiesAnnotationsInDLSessionsId, d.name,d.annotation_abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, d.taxonomyData.radiusX, d.taxonomyData.radiusY, true,null,null,null,d.taxonomiesAnnotationsInDLSessionsId)
          // BUG FIX 1: Apply rotation after ellipse is created
          if (d.taxonomyData.rotationDegrees && taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId]) {
            const ellipseData = taxonomyCoordinates.value[d.taxonomiesAnnotationsInDLSessionsId]
            if (ellipseData.ellipse) {
              ellipseData.ellipse.rotation(d.taxonomyData.rotationDegrees)
              ellipseData.rotationDegrees = d.taxonomyData.rotationDegrees
              updateEllipseAnchorPositionWithRotation(ellipseData.anchors, ellipseData.ellipse, d.taxonomiesAnnotationsInDLSessionsId)
            }
          }
        }
        if (d.type == 'Angle') {
          d.taxonomyData.type = 'Angle'
          const tmp1 = getAbsolutePosition(d.taxonomyData.vertex.x, d.taxonomyData.vertex.y, imageSize.width, imageSize.height)
          const tmp2 = getAbsolutePosition(d.taxonomyData.armPoint1.x, d.taxonomyData.armPoint1.y, imageSize.width, imageSize.height)
          const tmp3 = getAbsolutePosition(d.taxonomyData.armPoint2.x, d.taxonomyData.armPoint2.y, imageSize.width, imageSize.height)
          currentAnglePoints.value = [
            { x: tmp1[0], y: tmp1[1] },
            { x: tmp2[0], y: tmp2[1] },
            { x: tmp3[0], y: tmp3[1] },
          ]
          drawTemporaryLine({ x: tmp1[0], y: tmp1[1] }, 'tempLine1', d.colorCode)
          drawTemporaryLine({ x: tmp2[0], y: tmp2[1] }, 'tempLine2', d.colorCode)
          finalizeAngle(d.taxonomiesAnnotationsInDLSessionsId, d.name,d.annotation_abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, true,null,null,d.taxonomiesAnnotationsInDLSessionsId)
        }
        // annotationVisualization.brightness = d.taxonomyData.brightness
        // annotationVisualization.contrast = d.taxonomyData.contrast
      })

      response.childtaxonomydata.forEach((d) => {
        if (taxonomyIndex.value <= d.taxonomyData.index) {
          taxonomyIndex.value = d.taxonomyData.index
          taxonomyIndex.value += 1
        }
        if (d.type == 'Landmark' || d.type == 'Crossbar') {
          const tmpChild = getAbsolutePosition(d.taxonomyData.x, d.taxonomyData.y, imageSize.width, imageSize.height)
          d.taxonomyData.x = tmpChild[0]
          d.taxonomyData.y = tmpChild[1]

          // FIX 7: Preserve the actual type and ensure all data is passed correctly
          d.taxonomyData.type = d.type  // Use actual type from response

          // FIX 7: Ensure rotation is included in taxonomyData
          // The rotation should already be in d.taxonomyData.rotation from the server

          addLandmark(
            d.taxonomyData,           // Pass full data object with rotation
            d.taxonomyData.x,
            d.taxonomyData.y,
            d.id,                     // Child's own ID
            d.taxonomyData.name,      // Use name from taxonomyData
            d.taxonomyData.abbreviation, // Use abbreviation from taxonomyData
            d.taxonomyData.type,      // Use the actual type
            d.colorCode,
            d.taxonomyData.index,
            true,                     // isStored
            d.taxonomyData.parentId,  // Link to parent
            d.taxonomyData.typesInTaxonomyId, // Link to taxonomy type
            d.taxonomiesAnnotationsInDLSessionsId,
            d.changeAppearance        // This determines if it's a crossbar
          )
        }

        if (d.type == 'Measurement') {
          const tmp1 = getAbsolutePosition(d.taxonomyData.start.x, d.taxonomyData.start.y, imageSize.width, imageSize.height)
          d.taxonomyData.start.x = tmp1[0]
          d.taxonomyData.start.y = tmp1[1]
          addMeasurementPoint(d.taxonomyData.start.x, d.taxonomyData.start.y, d.taxonomyData, d.id, d.taxonomyData.name,d.taxonomyData.abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, true, d.taxonomyData.parentId, d.taxonomyData.typesInTaxonomyId,d.taxonomyData.taxonomiesAnnotationsInDLSessionsId)

          const tmp2 = getAbsolutePosition(d.taxonomyData.end.x, d.taxonomyData.end.y, imageSize.width, imageSize.height)
          d.taxonomyData.end.x = tmp2[0]
          d.taxonomyData.end.y = tmp2[1]
          addMeasurementPoint(d.taxonomyData.end.x, d.taxonomyData.end.y, d.taxonomyData, d.id, d.taxonomyData.name,d.taxonomyData.abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, true, d.taxonomyData.parentId, d.taxonomyData.typesInTaxonomyId,d.taxonomyData.taxonomiesAnnotationsInDLSessionsId)
        }

        if (d.type == 'Bounding Box' || d.type == 'Non-Rotational Bounding Box') {
          const tmp1 = getAbsolutePosition(d.taxonomyData.start.x, d.taxonomyData.start.y, imageSize.width, imageSize.height)
          d.taxonomyData.start.x = tmp1[0]
          d.taxonomyData.start.y = tmp1[1]
          startBoundingBox(d.taxonomyData.start.x, d.taxonomyData.start.y, d.id, d.taxonomyData.name,d.taxonomyData.abbreviation,d.taxonomyData.type, d.colorCode, d.taxonomyData.index, undefined, true, d.taxonomyData.parentId, d.taxonomyData.typesInTaxonomyId,d.taxonomyData.taxonomiesAnnotationsInDLSessionsId)

          const tmp2 = getAbsolutePosition(d.taxonomyData.end.x, d.taxonomyData.end.y, imageSize.width, imageSize.height)
          d.taxonomyData.end.x = tmp2[0]
          d.taxonomyData.end.y = tmp2[1]

          const tmp3 = getAbsolutePosition(d.taxonomyData.center.x, d.taxonomyData.center.y, imageSize.width, imageSize.height)
          taxonomyCoordinates.value[d.id].center.x = tmp3[0]
          taxonomyCoordinates.value[d.id].center.y = tmp3[1]
          d.taxonomyData.center.x = tmp3[0]
          d.taxonomyData.center.y = tmp3[1]

          const tmp4 = getAbsolutePosition(d.taxonomyData.width, d.taxonomyData.height, imageSize.width, imageSize.height)
          taxonomyCoordinates.value[d.id].width = tmp4[0]
          taxonomyCoordinates.value[d.id].height = tmp4[1]
          d.taxonomyData.width = tmp4[0]
          d.taxonomyData.height = tmp4[1]

          startBoundingBox(d.taxonomyData.end.x, d.taxonomyData.end.y, d.id, d.taxonomyData.name,d.taxonomyData.abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, d.taxonomyData, true, d.taxonomyData.parentId, d.taxonomyData.typesInTaxonomyId,d.taxonomyData.taxonomiesAnnotationsInDLSessionsId)

          setTimeout(() => {
            updateAnchorPositions(taxonomyCoordinates.value[d.id].anchors, taxonomyCoordinates.value[d.id].rect, d.id)
          }, 100)
        }

        if (d.type == 'Ellipse') {
          const tmp1 = getAbsolutePosition(d.taxonomyData.x, d.taxonomyData.y, imageSize.width, imageSize.height)
          const tmp2 = getAbsolutePosition(d.taxonomyData.radiusX, d.taxonomyData.radiusY, imageSize.width, imageSize.height)
          d.taxonomyData.x = tmp1[0]
          d.taxonomyData.y = tmp1[1]
          d.taxonomyData.radiusX = tmp2[0]
          d.taxonomyData.radiusY = tmp2[1]
          startEllipse(d.taxonomyData.x, d.taxonomyData.y, d.id, d.taxonomyData.name,d.taxonomyData.abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, d.taxonomyData.radiusX, d.taxonomyData.radiusY, true, false, d.taxonomyData.parentId, d.taxonomyData.typesInTaxonomyId,d.taxonomyData.taxonomiesAnnotationsInDLSessionsId)
          // BUG FIX 1: Apply rotation after ellipse is created
          if (d.taxonomyData.rotationDegrees && taxonomyCoordinates.value[d.id]) {
            const ellipseData = taxonomyCoordinates.value[d.id]
            if (ellipseData.ellipse) {
              ellipseData.ellipse.rotation(d.taxonomyData.rotationDegrees)
              ellipseData.rotationDegrees = d.taxonomyData.rotationDegrees
              updateEllipseAnchorPositionWithRotation(ellipseData.anchors, ellipseData.ellipse, d.id)
            }
          }
        }

        if (d.type == 'Angle') {
          const tmp1 = getAbsolutePosition(d.taxonomyData.vertex.x, d.taxonomyData.vertex.y, imageSize.width, imageSize.height)
          const tmp2 = getAbsolutePosition(d.taxonomyData.armPoint1.x, d.taxonomyData.armPoint1.y, imageSize.width, imageSize.height)
          const tmp3 = getAbsolutePosition(d.taxonomyData.armPoint2.x, d.taxonomyData.armPoint2.y, imageSize.width, imageSize.height)
          currentAnglePoints.value = [
            { x: tmp1[0], y: tmp1[1] },
            { x: tmp2[0], y: tmp2[1] },
            { x: tmp3[0], y: tmp3[1] },
          ]
          drawTemporaryLine({ x: tmp1[0], y: tmp1[1] }, 'tempLine1', d.colorCode)
          drawTemporaryLine({ x: tmp2[0], y: tmp2[1] }, 'tempLine2', d.colorCode)
          finalizeAngle(d.id, d.taxonomyData.name,d.annotation_abbreviation, d.taxonomyData.type, d.colorCode, d.taxonomyData.index, true, d.taxonomyData.parentId, d.taxonomyData.typesInTaxonomyId,d.taxonomyData.taxonomiesAnnotationsInDLSessionsId)
        }
      })
      
      // After loading all annotations, update hasSavedAnnotationsInCurrentSession
      // Enable button if there are any annotations (regardless of saved state)
      // Use multiple timeouts to ensure all annotation creation operations complete
      // This is important for both initial load and navigation between images
      const checkAndUpdateButtonState = () => {
        if (thisRequestId !== latestRequestId) return;
        const allAnnotations = Object.keys(taxonomyCoordinates.value);
        if (allAnnotations.length > 0) {
          // Check if we have valid annotations
          const validAnnotations = allAnnotations.filter(key => {
            const annotation = taxonomyCoordinates.value[key];
            return annotation && annotation.type;
          });
          
          if (validAnnotations.length > 0) {
            // If there are valid annotations, enable the button
            hasSavedAnnotationsInCurrentSession.value = true;
          } else {
            hasSavedAnnotationsInCurrentSession.value = false;
          }
        } else {
          hasSavedAnnotationsInCurrentSession.value = false;
        }
      };
      
      // Check immediately after annotations are loaded
      nextTick(() => {
        checkAndUpdateButtonState();
      });
      
      // Check again after a short delay to catch any late-loading annotations
      setTimeout(() => {
        checkAndUpdateButtonState();
      }, 100);
      
      // Check again after medium delay
      setTimeout(() => {
        checkAndUpdateButtonState();
      }, 400);
      
      // Final check after longer delay to ensure everything is loaded
      // This is especially important when navigating between images
      setTimeout(() => {
        checkAndUpdateButtonState();
      }, 800);
    },
    server: false,
  })
}

// Measurement Supporting Functions
function createCrosshair(x: number, y: number, taxonomyId: string, taxonomyName: string, pointId: string, colorCode: string) {
  const scaledCrosshairSize = getScaledSize(10); // Base size is 10
  const scaledStrokeWidth = getScaledSize(2);
  const scaledRadius = getScaledSize(4);
  const crosshair = new Konva.Group({
    x,
    y,
    draggable: true,
    id: `${taxonomyId}_${pointId}`, // Unique ID for the crosshair
  })

  // Horizontal line
  crosshair.add(new Konva.Line({
    points: [-scaledCrosshairSize / 2, 0, scaledCrosshairSize / 2, 0],
    stroke: colorCode,
    strokeWidth: scaledStrokeWidth,
    name: 'measurementCrosshair',
  }))

  // Vertical line
  crosshair.add(new Konva.Line({
    points: [0, -scaledCrosshairSize / 2, 0, scaledCrosshairSize / 2],
    stroke: colorCode,
    strokeWidth:scaledStrokeWidth,
    name: 'measurementCrosshair',
  }))

  // Add rotation anchor
  const rotationAnchor = new Konva.Circle({
    x: 0,
    y: -scaledCrosshairSize - 5,
    radius: scaledRadius,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth: scaledStrokeWidth,
    draggable: true,
    name: 'rotation',
  })

  rotationAnchor.on('dragstart', () => {
    if (isLocked({ id: taxonomyId })) {
      rotationAnchor.stopDrag()
      return
    }
    captureAnnotationSnapshot(taxonomyId, true)
  })

  rotationAnchor.on('dragmove', (event) => {
    if (isLocked({ id: taxonomyId })) {
      rotationAnchor.stopDrag()
      return
    }
    updateCrosshairRotation(rotationAnchor, crosshair, event.evt.offsetX, event.evt.offsetY, taxonomyId, pointId)
    layer.batchDraw()
  })

  rotationAnchor.on('dragend', () => {
    if (isLocked({ id: taxonomyId })) {
      return
    }
    // Restrict the rotation anchor to stay near the crosshair
    const scale = stage.scaleX();
    const maxDistance = (initialCrosshairSize + 5) / scale
    const anchorPos = rotationAnchor.position()
    const distance = Math.sqrt(anchorPos.x ** 2 + anchorPos.y ** 2)

    if (distance > maxDistance || distance < maxDistance) {
      const angle = Math.atan2(anchorPos.y, anchorPos.x)
      rotationAnchor.position({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      })
    }
    layer.batchDraw()
    captureAnnotationSnapshot(taxonomyId, false)
  })

  crosshair.add(rotationAnchor)

  if (taxonomyCoordinates.value[taxonomyId])
    crosshair.rotation(taxonomyCoordinates.value[taxonomyId][pointId].rotation)

  crosshair.on('dragstart', () => {
    if (isLocked({ id: taxonomyId })) {
      crosshair.stopDrag()
      return
    }
    captureAnnotationSnapshot(taxonomyId, true)
  })

  crosshair.on('dragmove', () => {
    if (isLocked({ id: taxonomyId })) {
      crosshair.stopDrag()
      return
    }
    updateMeasurementLine(taxonomyId, taxonomyName, pointId, crosshair.x(), crosshair.y())
  })

  crosshair.on('dragend', () => {
    if (isLocked({ id: taxonomyId })) {
      return
    }
    updateMeasurementLine(taxonomyId, taxonomyName, pointId, crosshair.x(), crosshair.y())
    captureAnnotationSnapshot(taxonomyId, false)
  })

  return crosshair
}

function updateCrosshairRotation(anchor, crosshair, x, y, taxonomyId, pointId) {

  const stage = crosshair.getStage();
  const transform = stage.getAbsoluteTransform().copy().invert();
  const scale = stage.scaleX();
  // Transform coordinates
  const stagePoint = transform.point({x, y});
  const centerPoint = transform.point(crosshair.getAbsolutePosition());
  // Normalize current rotation to 0-360 range
  let currentRotation = crosshair.rotation() % 360;
  currentRotation = currentRotation < 0 ? currentRotation + 360 : currentRotation;
  // Calculate new angle in 0-360 range
  let angleRadians = Math.atan2(
    (stagePoint.y - centerPoint.y) / scale,
    (stagePoint.x - centerPoint.x) / scale
  );
  let angleDegrees = (angleRadians * 180 / Math.PI + 360) % 360;
  // Find the shortest path of rotation
  let diff = angleDegrees - currentRotation;
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  // Apply smooth transition with rate limiting
  const smoothFactor = 0.3;
  const maxRotationDelta = 5; // Limit maximum rotation per frame
  const clampedDiff = Math.max(Math.min(diff * smoothFactor, maxRotationDelta), -maxRotationDelta);

  let finalRotation = currentRotation + clampedDiff;

  // Keep rotation in 0-360 range
  finalRotation = finalRotation % 360;
  if (finalRotation < 0) finalRotation += 360;
  // Apply the rotation
  crosshair.rotation(finalRotation);
  if (taxonomyCoordinates.value[taxonomyId]) {
    taxonomyCoordinates.value[taxonomyId][pointId].rotation = finalRotation;
  }
}

function addMeasurementPoint(clickX: number, clickY: number, data: object, taxonomyId: string, taxonomyName: string,abbreviation: string, taxonomyType: string, colorCode: string, index: number | null = null, isStored = false, parentId: string, typesInTaxonomyId: string, taxonomiesAnnotationsInDLSessionsId: string) {
  const x = clickX
  const y = clickY

  if (!taxonomyCoordinates.value[taxonomyId]) {
    // Start a new measurement
    const group = new Konva.Group({ id: `${taxonomyId}group` })
    taxonomyCoordinates.value[taxonomyId] = { id: taxonomyId, name: taxonomyName,abbreviation: abbreviation, type: taxonomyType, colorCode, index: index != null ? index : taxonomyIndex.value, start: { x, y, rotation: Object.keys(data).length > 0 ? data.start.rotation : 0 }, end: null, isStored, parentId, typesInTaxonomyId ,taxonomiesAnnotationsInDLSessionsId}
    const crosshair = createCrosshair(x, y, taxonomyId, taxonomyName, 'start', colorCode)
    group.add(crosshair)

    layer.add(group)
    layer.batchDraw()
  }
  else {
    // Complete the measurement
    taxonomyCoordinates.value[taxonomyId].end = { x, y, rotation: Object.keys(data).length > 0 ? data.end.rotation : 0 }
    const crosshair = createCrosshair(x, y, taxonomyId, taxonomyName, 'end', colorCode)
    const group = layer.findOne(g => g.attrs.id === `${taxonomyId}group`)
    group.add(crosshair)
    drawMeasurementLine(taxonomyCoordinates.value[taxonomyId], colorCode)
    if (index == null)
      taxonomyIndex.value += 1

    // Initialize lock state for new annotation (unlocked/unhidden)
    // This ensures new annotations are always unlocked even if all existing ones are locked
    if (!isStored) {
      // Find the item from fetchTaxonomies to get groupItems
      let foundItem: any = null
      let foundGroupItems: any[] = []
      fetchTaxonomies.value.forEach((taxonomy) => {
        const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies
        if (typesInTaxonomies && Array.isArray(typesInTaxonomies)) {
          const item = typesInTaxonomies.find((t: any) => t.id === taxonomyId)
          if (item) {
            foundItem = item
            foundGroupItems = typesInTaxonomies
          }
        }
      })
      initializeNewAnnotationLockState(taxonomyId, foundItem || { id: taxonomyId, parentId }, foundGroupItems.length > 0 ? foundGroupItems : [])
    }

    layer.batchDraw()

  if (!isReplayingHistory && !isStored && taxonomyCoordinates.value[taxonomyId]?.end) {
    recordAnnotationCreation({
      id: taxonomyId,
      type: taxonomyType,
      name: taxonomyName,
      abbreviation,
      colorCode,
      index: taxonomyCoordinates.value[taxonomyId].index ?? null,
      parentId,
      typesInTaxonomyId,
      taxonomiesAnnotationsInDLSessionsId,
      isStored,
        taxonomyMetrics: {
        start: { ...taxonomyCoordinates.value[taxonomyId].start },
        end: { ...taxonomyCoordinates.value[taxonomyId].end },
      },
    })
  }
  }
}

function drawMeasurementLine(measurement, colorCode) {


  const scaledStrokeWidth = getScaledSize(2)
  const scaledText = getScaledSize(14)
  const line = new Konva.Line({
    points: [measurement.start.x, measurement.start.y, measurement.end.x, measurement.end.y],
    stroke: colorCode,
    strokeWidth: scaledStrokeWidth,
    lineJoin: 'round',
    dash: [getScaledSize(10),getScaledSize(5)], // Dashed line configuration
    name: 'measurementLine',
  })

  const midX = (measurement.start.x + measurement.end.x) / 2
  const midY = (measurement.start.y + measurement.end.y) / 2

  const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)
  const measurementValue = calculateMeasurementDistance(
    [
      measurement.start.x / imageSize.width,
      measurement.start.y / imageSize.height,
      measurement.end.x / imageSize.width,
      measurement.end.y / imageSize.height,
    ],
    newTaxonomyInCESession.value.metadata.width,
    newTaxonomyInCESession.value.metadata.height,
    newTaxonomyInCESession.value.metadata.pixelResolution,
  )

  const label = new Konva.Text({
    x: midX,
    y: midY,
    text: measurement.abbreviation,
    fontSize: scaledText,
    fill: colorCode,
  })


  taxonomyCoordinates.value[measurement.id].value = `${measurementValue.toFixed(2)} mm`

  label.on('click', () => {
    const index = isClickedItems.value.indexOf(measurement.id)
    if (index !== -1) {
      isClickedItems.value.splice(index, 1)
      label.fontStyle('normal')
      label.textDecoration('')
    }
    else {
      isClickedItems.value.push(measurement.id)
      label.fontStyle('italic bold')
      label.textDecoration('underline')
    }
    layer!.batchDraw()
  })

  // Group line and label together
  // Use the full measurement.id to find the group (same as how it's created in addMeasurementPoint)
  const group = layer!.findOne(g => g.attrs.id === `${measurement.id}group`) as Konva.Group

  // Check if group exists before adding elements
  if (!group) {
    console.error(`Group not found for measurement ID: ${measurement.id}`)
    return
  }

  group.add(line)
  group.add(label)
  line.moveToBottom()
  const isClicked = isClickedItems.value.includes(measurement.id)
  label.fontStyle(isClicked ? 'italic bold' : 'normal')
  label.textDecoration(isClicked ? 'underline' : '')
}

function updateMeasurementLine(taxonomyId: string, taxonomyName: string, pointId: string, newX: number, newY: number) {
  // Find the measurement by ID
  const measurement = taxonomyCoordinates.value[taxonomyId]
  if (!measurement)
    return

  // Update the appropriate point (start or end)
  if (pointId === 'start') {
    measurement.start.x = newX
    measurement.start.y = newY
  }
  else {
    measurement.end.x = newX
    measurement.end.y = newY
  }

  // Redraw the line
  const group = layer!.findOne(g => g.attrs.id === `${taxonomyId}group`) as Konva.Group
  const line = group.getChildren(node => node.getClassName() === 'Line')[0]
  const label = group.getChildren(node => node.getClassName() === 'Text')[0]

  line.points([measurement.start.x, measurement.start.y, measurement.end.x, measurement.end.y])

  // Update label position and text
  const midX = (measurement.start.x + measurement.end.x) / 2
  const midY = (measurement.start.y + measurement.end.y) / 2
  label.position({ x: midX, y: midY })
  label.text(measurement.abbreviation)

  // Update label box position
  const labelWidth = label.width() + 10
  const labelHeight = label.height() + 2

  const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)
  const measurementValue = calculateMeasurementDistance(
    [
      measurement.start.x / imageSize.width,
      measurement.start.y / imageSize.height,
      measurement.end.x / imageSize.width,
      measurement.end.y / imageSize.height,
    ],
    newTaxonomyInCESession.value.metadata.width,
    newTaxonomyInCESession.value.metadata.height,
    newTaxonomyInCESession.value.metadata.pixelResolution,
  )

  taxonomyCoordinates.value[taxonomyId].value = `${measurementValue.toFixed(2)} mm`

  layer.batchDraw()
}
// Landmark Supporting Functions
function addLandmark(taxonomyData:any,clickX: number, clickY: number, taxonomyId: string, taxonomyName: string,abbreviation: string, taxonomyType: string, colorCode: string, index: number | null = null, isStored = false, parentId: any, typesInTaxonomyId: any,taxonomiesAnnotationsInDLSessionsId: any,changeAppearance?:boolean) {
  // Create crosshair shape
  const scaledRadius = getScaledSize(5); // Base radius is 5
  const scaledStrokeWidth = getScaledSize(2); // Base stroke width is 2
  const scaledText = getScaledSize(14)
  const landmark = new Konva.Group({
    id:`${taxonomyId}group`,
    x: clickX,
    y: clickY,
    draggable: true,
  })

  // Store taxonomy metadata
  landmark.setAttr('taxonomyId', taxonomyId)
  landmark.setAttr('taxonomyIndex', index != null ? index : taxonomyIndex)
  landmark.setAttr('taxonomyName', taxonomyName)
  landmark.setAttr('taxonomyAbbreviation', abbreviation)
  if (changeAppearance) {
    const scaledCrosshairSize = getScaledSize(10); // Base size is 10
    const scaledStrokeWidth = getScaledSize(2);
    const scaledRadius = getScaledSize(4);
    const crosshair = new Konva.Group({
      x: 0,
      y: 0,
      draggable: false,
      id: `${taxonomyId}`, // Unique ID for the crosshair
    })

    // Horizontal line
    crosshair.add(new Konva.Line({
      points: [-scaledCrosshairSize / 2, 0, scaledCrosshairSize / 2, 0],
      stroke: colorCode,
      strokeWidth: scaledStrokeWidth,
      name: 'measurementCrosshair',
    }))

    // Vertical line
    crosshair.add(new Konva.Line({
      points: [0, -scaledCrosshairSize / 2, 0, scaledCrosshairSize / 2],
      stroke: colorCode,
      strokeWidth: scaledStrokeWidth,
      name: 'measurementCrosshair',
    }))

    // FIX 1: Get the saved rotation value early
    const savedRotation = (taxonomyData && taxonomyData.rotation !== undefined && taxonomyData.rotation !== null)
      ? taxonomyData.rotation
      : 0;

    // FIX 2: Calculate rotation anchor position based on the saved rotation
    // Convert rotation to radians for calculation
    const rotationRadians = (savedRotation * Math.PI) / 180;
    const scaledOffset = getScaledSize(15);
    const anchorDistance = scaledCrosshairSize + scaledOffset;

    // Calculate anchor position accounting for rotation
    const anchorX = Math.sin(rotationRadians) * anchorDistance;
    const anchorY = -Math.cos(rotationRadians) * anchorDistance;

    // Add rotation anchor with calculated position
    const rotationAnchor = new Konva.Circle({
      x: anchorX,
      y: anchorY,
      radius: scaledRadius,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: scaledStrokeWidth,
      draggable: true,
      name: 'rotation',
    })

    rotationAnchor.on('dragstart', () => {
      if (isLocked({ id: taxonomyId })) {
        rotationAnchor.stopDrag()
        return
      }
      captureAnnotationSnapshot(taxonomyId, true)
    })

    rotationAnchor.on('dragmove', (event) => {
      if (isLocked({ id: taxonomyId })) {
        rotationAnchor.stopDrag()
        return
      }
      updateCrossbarRotation(rotationAnchor, landmark, crosshair, event.evt.offsetX, event.evt.offsetY, taxonomyId)
      layer.batchDraw()
    })

    rotationAnchor.on('dragend', () => {
      if (isLocked({ id: taxonomyId })) {
        return
      }
      // Restrict the rotation anchor to stay near the crosshair
      const stage = crosshair.getStage();
      const scale = stage.scaleX();
      const maxDistance = (scaledCrosshairSize + 5) / scale
      const anchorPos = rotationAnchor.position()
      const distance = Math.sqrt(anchorPos.x ** 2 + anchorPos.y ** 2)

      if (distance > maxDistance) {
        const angle = Math.atan2(anchorPos.y, anchorPos.x)
        rotationAnchor.position({
          x: Math.cos(angle) * maxDistance,
          y: Math.sin(angle) * maxDistance,
        })
      }
      layer.batchDraw()
      captureAnnotationSnapshot(taxonomyId, false)
    })

    crosshair.add(rotationAnchor)

    // FIX 3: Apply saved rotation to crosshair BEFORE adding to landmark
    if (savedRotation !== 0) {
      crosshair.rotation(savedRotation);
    }

    landmark.add(crosshair)

    // FIX 4: Store rotation in taxonomyCoordinates immediately
    if (!taxonomyCoordinates.value[taxonomyId]) {
      taxonomyCoordinates.value[taxonomyId] = {
        x: clickX,
        y: clickY,
        index: index != null ? index : taxonomyIndex.value,
        name: taxonomyName,
        abbreviation: abbreviation,
        type: taxonomyType,
        isStored,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId: taxonomiesAnnotationsInDLSessionsId,
        changeAppearance: changeAppearance,
        rotation: savedRotation
      };
    } else {
      taxonomyCoordinates.value[taxonomyId].rotation = savedRotation;
    }
  } else {
    // Regular landmark (circle)
    const circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: scaledRadius,
      fill: colorCode,
      stroke: '#666',
      strokeWidth: scaledStrokeWidth,
      name: 'landmark',
      draggable: false  // Circle should not be draggable independently - it moves with the landmark group
    })
    landmark.add(circle)

    // For regular landmarks, no rotation tracking needed
    taxonomyCoordinates.value[taxonomyId] = {
      x: clickX,
      y: clickY,
      index: index != null ? index : taxonomyIndex.value,
      name: taxonomyName,
      abbreviation: abbreviation,
      type: taxonomyType,
      isStored,
      parentId,
      typesInTaxonomyId,
      taxonomiesAnnotationsInDLSessionsId: taxonomiesAnnotationsInDLSessionsId,
      changeAppearance: changeAppearance
    };
  }


  // Update text label to use abbreviation
  const label = new Konva.Text({
    x: getScaledSize(-10),
    y: getScaledSize(20),
    text: abbreviation,
    fontSize: scaledText,
    fill: colorCode,
    name: "landMark",
    draggable: false  // Label should never be draggable independently - it moves with the landmark group
  })
  landmark.add(label)

  label.on('click', () => {
    const index = isClickedItems.value.indexOf(taxonomyId)
    if (index !== -1) {
      isClickedItems.value.splice(index, 1)
      label.fontStyle('normal')
      label.textDecoration('')
    }
    else {
      isClickedItems.value.push(taxonomyId)
      label.fontStyle('italic bold')
      label.textDecoration('underline')
    }
    layer!.batchDraw()
  })

  const isClicked = isClickedItems.value.includes(taxonomyId)
  label.fontStyle(isClicked ? 'italic bold' : 'normal')
  label.textDecoration(isClicked ? 'underline' : '')

  taxonomyCoordinates.value[taxonomyId] = { x: clickX, y: clickY, index: index != null ? index : taxonomyIndex.value, name: taxonomyName, abbreviation: abbreviation, type: taxonomyType, isStored, parentId, typesInTaxonomyId, taxonomiesAnnotationsInDLSessionsId: taxonomiesAnnotationsInDLSessionsId, changeAppearance: changeAppearance, colorCode }

  if (!isReplayingHistory && !isStored) {
    recordAnnotationCreation({
      id: taxonomyId,
      type: taxonomyType,
      name: taxonomyName,
      abbreviation,
      colorCode,
      index: taxonomyCoordinates.value[taxonomyId].index ?? null,
      parentId,
      typesInTaxonomyId,
      taxonomiesAnnotationsInDLSessionsId,
      changeAppearance,
      isStored,
      taxonomyMetrics: {
        x: clickX,
        y: clickY,
        rotation: taxonomyCoordinates.value[taxonomyId]?.rotation ?? 0,
      },
    })
  }

  if (index == null)
    taxonomyIndex.value += 1

  landmark.on('dragstart', () => {
    if (isLocked({ id: taxonomyId })) {
      landmark.stopDrag()
      return
    }
    // Capture the state before dragging starts
    captureAnnotationSnapshot(taxonomyId, true)
  })

  landmark.on('dragend', async () => {
    if (isLocked({ id: taxonomyId })) {
      return
    }
    taxonomyCoordinates.value[taxonomyId].x = landmark.x()
    taxonomyCoordinates.value[taxonomyId].y = landmark.y()
    captureAnnotationSnapshot(taxonomyId, false)
  })

  layer.add(landmark)

  // Initialize lock state for new annotation (unlocked/unhidden)
  // This ensures new annotations are always unlocked even if all existing ones are locked
  if (!isStored) {
    // Find the item from fetchTaxonomies to get groupItems
    let foundItem: any = null
    let foundGroupItems: any[] = []
    fetchTaxonomies.value.forEach((taxonomy) => {
      const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies
      if (typesInTaxonomies && Array.isArray(typesInTaxonomies)) {
        const item = typesInTaxonomies.find((t: any) => t.id === taxonomyId)
        if (item) {
          foundItem = item
          foundGroupItems = typesInTaxonomies
        }
      }
    })
    initializeNewAnnotationLockState(taxonomyId, foundItem || { id: taxonomyId, parentId }, foundGroupItems.length > 0 ? foundGroupItems : [])
  }

  layer.batchDraw()
}

function constrainAnchorPosition(anchor, oppositeAnchor, rotation, minDistance = 20) {
  const currentPos = anchor.position();
  const oppositePos = oppositeAnchor.position();

  // Calculate distance between anchors
  const distance = Math.sqrt(
    Math.pow(currentPos.x - oppositePos.x, 2) +
    Math.pow(currentPos.y - oppositePos.y, 2)
  );

  // If distance is too small, maintain minimum distance
  if (distance < minDistance) {
    const angle = Math.atan2(currentPos.y - oppositePos.y, currentPos.x - oppositePos.x);
    anchor.position({
      x: oppositePos.x + Math.cos(angle) * minDistance,
      y: oppositePos.y + Math.sin(angle) * minDistance
    });
  }
}

// Bounding Box Supporting Functions
function createAnchor(x, y, name, boundingBox, label, taxonomyId, colorCode) {
  const scaledStrokeWidth = getScaledSize(2);
  const scaledAnchorRadius = getScaledSize(5);

  const anchor = new Konva.Circle({
    x,
    y,
    radius: scaledAnchorRadius,
    stroke: '#666',
    fill: name === 'rotation' ? colorCode : '#ddd',
    strokeWidth: scaledStrokeWidth,
    draggable: true,
    name,
  });

  // Store the initial state when dragging starts
  let dragStartState = null;

  anchor.on('dragstart', (event) => {
    if (isLocked({ id: taxonomyId })) {
      anchor.stopDrag()
      return
    }
    // Store the initial positions of both anchors
    dragStartState = {
      topLeft: { ...boundingBox.anchors.topLeft.position() },
      bottomRight: { ...boundingBox.anchors.bottomRight.position() },
      boxCenter: { ...boundingBox.rect.position() },
      boxRotation: boundingBox.rect.rotation()
    };
    // Capture the state before dragging starts
    captureAnnotationSnapshot(taxonomyId, true)
  });

  anchor.on('dragmove', (event) => {
    if (isLocked({ id: taxonomyId })) {
      anchor.stopDrag()
      return
    }
    if (name === 'rotation') {
      updateBoundingBoxRotation(anchor, boundingBox, taxonomyId, event.evt.offsetX, event.evt.offsetY);
    } else {
      // For resize anchors, we need to constrain the movement properly
      const currentPos = anchor.position();
      const otherAnchor = name === 'topLeft' ? boundingBox.anchors.bottomRight : boundingBox.anchors.topLeft;

      // Update the bounding box based on the new anchor position
      updateBoundingBoxSize(anchor, boundingBox, taxonomyId);
    }

    updateBBLabelPosition(label, boundingBox.rect);
    layer.batchDraw();
  });

  anchor.on('dragend', (event) => {
    if (isLocked({ id: taxonomyId })) {
      return
    }
    // Final update after drag is complete
    updateAnchorPositions(boundingBox.anchors, boundingBox.rect, taxonomyId);
    updateBBLabelPosition(label, boundingBox.rect);
    layer.batchDraw();

    // Clear the drag state
    dragStartState = null;
    captureAnnotationSnapshot(taxonomyId, false)
  });

  return anchor;
}




// Update the rotation of the bounding box
// Update the rotation of the bounding box
function updateBoundingBoxRotation(anchor, boundingBox, taxonomyId, x, y) {
  const box = boundingBox.rect
  const stage = box.getStage()

  if (!stage) return

  // Convert screen coordinates (x, y) to stage coordinates
  const transform = stage.getAbsoluteTransform().copy().invert()
  const stagePoint = transform.point({ x, y })

  // Get box center in stage coordinates
  const boxCenterX = box.x()
  const boxCenterY = box.y()

  // Calculate the angle from the center of the box to the transformed mouse position
  const angleRadians = Math.atan2(
    stagePoint.y - boxCenterY,
    stagePoint.x - boxCenterX
  ) + Math.PI / 2

  // Apply rotation
  box.rotation(angleRadians * 180 / Math.PI)

  // Update positions of resizing anchors and label
  updateAnchorPositions(boundingBox.anchors, box, taxonomyId)
  const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}Text`)
  updateBBLabelPosition(label, box)

  // Store the rotation in coordinates
  taxonomyCoordinates.value[taxonomyId].rotationDegrees = box.rotation()
}


function updateAnchorPositions(anchors, box, taxonomyId) {
  const topLeft = anchors.topLeft;
  const bottomRight = anchors.bottomRight;
  const rotationAnchor = anchors.rotationAnchor;
  
  // Get the annotation type to check if rotation is allowed
  const annotationType = taxonomyCoordinates.value[taxonomyId]?.type;
  const isRotatable = annotationType === 'Bounding Box';
  
  // For Non-Rotational Bounding Box, use 0 rotation; otherwise use actual rotation
  const rotationAngleRadians = (isRotatable ? box.rotation() : 0) * Math.PI / 180;

  // Calculate the relative positions of the anchors from the center of the box
  const relativeTopLeft = { x: -box.width() / 2, y: -box.height() / 2 };
  const relativeBottomRight = { x: box.width() / 2, y: box.height() / 2 };

  // Rotate these points around the center
  const rotatedTopLeft = rotatePoint(relativeTopLeft, rotationAngleRadians);
  const rotatedBottomRight = rotatePoint(relativeBottomRight, rotationAngleRadians);

  // Update corner anchors to their rotated positions
  const newTopLeftPos = { x: box.x() + rotatedTopLeft.x, y: box.y() + rotatedTopLeft.y };
  const newBottomRightPos = { x: box.x() + rotatedBottomRight.x, y: box.y() + rotatedBottomRight.y };

  topLeft.position(newTopLeftPos);
  bottomRight.position(newBottomRightPos);

  // Update rotation anchor with proper zoom scaling
  // const currentScale = stage ? stage.scaleX() : 1;
  // const scaledOffset = 20 / currentScale;

  // const rotatedTopCenter = rotatePoint({
  //   x: 0,
  //   y: -box.height() / 2 - scaledOffset
  // }, rotationAngleRadians);

  // rotationAnchor.position({
  //   x: box.x() + rotatedTopCenter.x,
  //   y: box.y() + rotatedTopCenter.y
  // });
  // Only update rotation anchor if it exists and type allows rotation
  if (isRotatable && rotationAnchor) {
    // Update rotation anchor with proper zoom scaling
    const currentScale = stage ? stage.scaleX() : 1;
    const scaledOffset = 20 / currentScale;
    
    const rotatedTopCenter = rotatePoint({ 
      x: 0, 
      y: -box.height() / 2 - scaledOffset
    }, rotationAngleRadians);
    
    rotationAnchor.position({ 
      x: box.x() + rotatedTopCenter.x, 
      y: box.y() + rotatedTopCenter.y 
    });
  }

  // Update stored coordinates if they exist
  if (taxonomyCoordinates.value[taxonomyId]) {
    const storedCoords = taxonomyCoordinates.value[taxonomyId];
    if (storedCoords.anchors) {
      storedCoords.anchors.topLeft = topLeft;
      storedCoords.anchors.bottomRight = bottomRight;
      if (isRotatable && rotationAnchor) {
        storedCoords.anchors.rotationAnchor = rotationAnchor;
      }
      if (isRotatable && rotationAnchor) {
        storedCoords.anchors.rotationAnchor = rotationAnchor;
      }
    }
  }
}


function rotatePoint(point, angle) {
  return {
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
  }
}

function updateBoundingBoxSize(anchor, boundingBox, taxonomyId) {
  const box = boundingBox.rect;
  const topLeft = boundingBox.anchors.topLeft;
  const bottomRight = boundingBox.anchors.bottomRight;
  const rotationAngleRadians = box.rotation() * Math.PI / 180;

  // Get the current anchor positions
  const topLeftPos = topLeft.position();
  const bottomRightPos = bottomRight.position();

  // Determine which anchor is being dragged
  const isDraggingTopLeft = anchor === topLeft;
  const isDraggingBottomRight = anchor === bottomRight;

  let newTopLeftPos, newBottomRightPos;

  if (isDraggingTopLeft) {
    // TopLeft is being dragged, bottomRight should stay fixed
    newTopLeftPos = topLeftPos;
    newBottomRightPos = bottomRightPos; // Keep bottomRight fixed
  } else if (isDraggingBottomRight) {
    // BottomRight is being dragged, topLeft should stay fixed
    newTopLeftPos = topLeftPos; // Keep topLeft fixed
    newBottomRightPos = bottomRightPos;
  } else {
    // Neither anchor is being dragged (shouldn't happen in normal usage)
    newTopLeftPos = topLeftPos;
    newBottomRightPos = bottomRightPos;
  }

  // Calculate the center and dimensions in screen coordinates
  const centerX = (newTopLeftPos.x + newBottomRightPos.x) / 2;
  const centerY = (newTopLeftPos.y + newBottomRightPos.y) / 2;

  // Calculate the distance between anchors (this gives us the diagonal)
  const deltaX = newBottomRightPos.x - newTopLeftPos.x;
  const deltaY = newBottomRightPos.y - newTopLeftPos.y;

  // For a rotated rectangle, we need to calculate the actual width and height
  // based on the rotation angle and the anchor positions
  const cosAngle = Math.cos(rotationAngleRadians);
  const sinAngle = Math.sin(rotationAngleRadians);

  // Transform the delta back to the rectangle's local coordinate system
  const localDeltaX = deltaX * cosAngle + deltaY * sinAngle;
  const localDeltaY = -deltaX * sinAngle + deltaY * cosAngle;

  // The actual width and height are the absolute values of the local deltas
  const newWidth = Math.abs(localDeltaX);
  const newHeight = Math.abs(localDeltaY);

  // Ensure minimum size
  const minSize = 10 / (zoomFactor.value || 1);
  const finalWidth = Math.max(newWidth, minSize);
  const finalHeight = Math.max(newHeight, minSize);

  // Update the rectangle
  box.width(finalWidth);
  box.height(finalHeight);
  box.position({ x: centerX, y: centerY });

  // Set the offset to center the rectangle
  box.offsetX(finalWidth / 2);
  box.offsetY(finalHeight / 2);

  // Update stored coordinates
  const storedCoords = taxonomyCoordinates.value[taxonomyId];
  if (storedCoords) {
    // Update the screen coordinates
    storedCoords.start.x = Math.min(newTopLeftPos.x, newBottomRightPos.x);
    storedCoords.start.y = Math.min(newTopLeftPos.y, newBottomRightPos.y);
    storedCoords.end.x = Math.max(newTopLeftPos.x, newBottomRightPos.x);
    storedCoords.end.y = Math.max(newTopLeftPos.y, newBottomRightPos.y);
    storedCoords.width = finalWidth;
    storedCoords.height = finalHeight;
    // FIX: Calculate center from start and end for consistency with save logic
    storedCoords.center.x = (storedCoords.start.x + storedCoords.end.x) / 2;
    storedCoords.center.y = (storedCoords.start.y + storedCoords.end.y) / 2;
    storedCoords.rect = box;
  }

  // Update anchor positions to match the new rectangle
  updateAnchorPositions(boundingBox.anchors, box, taxonomyId);

  // Update label position
  const label = layer.findOne(g => g.attrs.id === `${taxonomyId}Text`);
  if (label) {
    updateBBLabelPosition(label, box);
  }

  layer.batchDraw();
}

function updateBBLabelPosition(label, box) {
  // Get the current zoom factor
  const currentZoom = zoomFactor.value || 1

  // Calculate the center position of the bounding box
  const centerX = box.x()
  const centerY = box.y()

  // Get label dimensions (these are already scaled by updateControlPoints)
  const labelWidth = label.width()
  const labelHeight = label.height()

  // Position the label at the center of the bounding box
  // No need to divide by zoom since label dimensions are already scaled
  label.position({
    x: centerX - labelWidth / 2,
    y: centerY - labelHeight / 2
  })
}

function startBoundingBox(clickX: number, clickY: number, taxonomyId: string, taxonomyName: string, abbreviation: string, taxonomyType: string, colorCode: string, index: number | null = null, data: undefined, isStored = false, parentId?: string, typesInTaxonomyId?: string, taxonomiesAnnotationsInDLSessionsId?: string) {
  const x = clickX
  const y = clickY
  const scaledStrokeWidth = getScaledSize(2)
  const scaledText = getScaledSize(14)
  const scaledAnchorRadius = getScaledSize(5);

  // CRITICAL FIX: Check if annotation doesn't exist OR if Konva nodes were destroyed (stage was recreated).
  // This ensures annotations are recreated when stage is destroyed but taxonomyCoordinates objects still exist.
  const existingAnnotation = taxonomyCoordinates.value[taxonomyId]
  const isBBoxType = existingAnnotation && (existingAnnotation.type === 'Bounding Box' || existingAnnotation.type === 'Non-Rotational Bounding Box')
  const needsRecreation = !existingAnnotation || (isBBoxType && !existingAnnotation.rect)

  if (needsRecreation) {
    // If annotation exists but nodes are missing, clear it first to recreate properly
    if (existingAnnotation && !existingAnnotation.rect) {
      delete taxonomyCoordinates.value[taxonomyId]
    }
    // Start a new bounding box
    taxonomyCoordinates.value[taxonomyId] = {
      id: taxonomyId,
      name: taxonomyName,
      abbreviation: abbreviation,
      index: index != null ? index : taxonomyIndex.value,
      start: { x, y },
      rect: new Konva.Rect({
        x,
        y,
        width: 0,
        height: 0,
        stroke: colorCode,
        strokeWidth: scaledStrokeWidth,
        dash: [getScaledSize(2), getScaledSize(2)],
        draggable: true,
      }),
      end: null,
      center: {},
      anchors: {},
      type: taxonomyType,
      isStored,
      parentId,
      typesInTaxonomyId,
      taxonomiesAnnotationsInDLSessionsId,
      colorCode,
    }

    // Create text label
    const label = new Konva.Text({
      x: 0, // Will be positioned properly after creation
      y: 0, // Will be positioned properly after creation
      text: abbreviation,
      fontSize: scaledText,
      fill: colorCode,
      id: `${taxonomyId}Text`,
    })

    // Position label at the center of the initial rect
    updateBBLabelPosition(label, taxonomyCoordinates.value[taxonomyId].rect)

    taxonomyCoordinates.value[taxonomyId].anchors.topLeft = createAnchor(x, y, 'topLeft', taxonomyCoordinates.value[taxonomyId], label, taxonomyId, colorCode)

    // Add dragmove event listener to the bounding box
    taxonomyCoordinates.value[taxonomyId].rect.on('dragstart', () => {
      if (isLocked({ id: taxonomyId })) {
        taxonomyCoordinates.value[taxonomyId].rect.stopDrag()
        return
      }
      captureAnnotationSnapshot(taxonomyId, true)
    })
    taxonomyCoordinates.value[taxonomyId].rect.on('dragmove', () => {
      if (isLocked({ id: taxonomyId })) {
        taxonomyCoordinates.value[taxonomyId].rect.stopDrag()
        return
      }
      updateAnchorPositions(taxonomyCoordinates.value[taxonomyId].anchors, taxonomyCoordinates.value[taxonomyId].rect, taxonomyId)
      updateBBLabelPosition(label, taxonomyCoordinates.value[taxonomyId].rect)

      // CRITICAL FIX: Update start and end positions based on anchor positions
      // This ensures the position is correctly saved when captureAnnotationSnapshot is called
      const topLeftPos = taxonomyCoordinates.value[taxonomyId].anchors.topLeft.position()
      const bottomRightPos = taxonomyCoordinates.value[taxonomyId].anchors.bottomRight.position()
      
      taxonomyCoordinates.value[taxonomyId].start.x = Math.min(topLeftPos.x, bottomRightPos.x)
      taxonomyCoordinates.value[taxonomyId].start.y = Math.min(topLeftPos.y, bottomRightPos.y)
      taxonomyCoordinates.value[taxonomyId].end.x = Math.max(topLeftPos.x, bottomRightPos.x)
      taxonomyCoordinates.value[taxonomyId].end.y = Math.max(topLeftPos.y, bottomRightPos.y)

      // FIX: Calculate center from start and end instead of rect.x/y for consistency
      taxonomyCoordinates.value[taxonomyId].center.x = (taxonomyCoordinates.value[taxonomyId].start.x + taxonomyCoordinates.value[taxonomyId].end.x) / 2
      taxonomyCoordinates.value[taxonomyId].center.y = (taxonomyCoordinates.value[taxonomyId].start.y + taxonomyCoordinates.value[taxonomyId].end.y) / 2

      // Update width and height from rect
      taxonomyCoordinates.value[taxonomyId].width = taxonomyCoordinates.value[taxonomyId].rect.width()
      taxonomyCoordinates.value[taxonomyId].height = taxonomyCoordinates.value[taxonomyId].rect.height()

      layer.batchDraw()
    })
    taxonomyCoordinates.value[taxonomyId].rect.on('dragend', () => {
      if (isLocked({ id: taxonomyId })) {
        return
      }
      // CRITICAL FIX: Final update of start and end positions based on anchor positions
      // This ensures the position is correctly saved when captureAnnotationSnapshot is called
      const topLeftPos = taxonomyCoordinates.value[taxonomyId].anchors.topLeft.position()
      const bottomRightPos = taxonomyCoordinates.value[taxonomyId].anchors.bottomRight.position()
      
      taxonomyCoordinates.value[taxonomyId].start.x = Math.min(topLeftPos.x, bottomRightPos.x)
      taxonomyCoordinates.value[taxonomyId].start.y = Math.min(topLeftPos.y, bottomRightPos.y)
      taxonomyCoordinates.value[taxonomyId].end.x = Math.max(topLeftPos.x, bottomRightPos.x)
      taxonomyCoordinates.value[taxonomyId].end.y = Math.max(topLeftPos.y, bottomRightPos.y)

      // FIX: Calculate center from start and end instead of rect.x/y for consistency
      taxonomyCoordinates.value[taxonomyId].center.x = (taxonomyCoordinates.value[taxonomyId].start.x + taxonomyCoordinates.value[taxonomyId].end.x) / 2
      taxonomyCoordinates.value[taxonomyId].center.y = (taxonomyCoordinates.value[taxonomyId].start.y + taxonomyCoordinates.value[taxonomyId].end.y) / 2

      // Final update of width and height from rect
      taxonomyCoordinates.value[taxonomyId].width = taxonomyCoordinates.value[taxonomyId].rect.width()
      taxonomyCoordinates.value[taxonomyId].height = taxonomyCoordinates.value[taxonomyId].rect.height()

      // Capture snapshot after all position updates are complete
      captureAnnotationSnapshot(taxonomyId, false)
    })

    // Group rect, anchors, and label together
    const group = new Konva.Group({
      id: `${taxonomyId}group`,
    })
    group.setAttr('isClick', false)

    label.on('click', () => {
      const index = isClickedItems.value.indexOf(taxonomyId)
      if (index !== -1) {
        isClickedItems.value.splice(index, 1)
        label.fontStyle('')
        label.textDecoration('')
      }
      else {
        isClickedItems.value.push(taxonomyId)
        label.fontStyle('italic bold')
        label.textDecoration('underline')
      }
      layer!.batchDraw()
    })

    group.add(taxonomyCoordinates.value[taxonomyId].rect)
    group.add(taxonomyCoordinates.value[taxonomyId].anchors.topLeft)
    group.add(label)

    const isClicked = isClickedItems.value.includes(taxonomyId)
    label.fontStyle(isClicked ? 'italic bold' : 'normal')
    label.textDecoration(isClicked ? 'underline' : '')

    layer.add(group)
  }
  else {
    // Complete the bounding box
    const group = layer!.findOne(g => g.attrs.id === `${taxonomyId}group`)
    const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}Text`)

    // IMPORTANT FIX: Calculate proper start and end positions
    const startX = taxonomyCoordinates.value[taxonomyId].start.x
    const startY = taxonomyCoordinates.value[taxonomyId].start.y

    // Determine actual top-left and bottom-right coordinates
    const actualTopLeftX = Math.min(startX, x)
    const actualTopLeftY = Math.min(startY, y)
    const actualBottomRightX = Math.max(startX, x)
    const actualBottomRightY = Math.max(startY, y)

    // Update the stored coordinates to reflect correct positions
    taxonomyCoordinates.value[taxonomyId].start = { x: actualTopLeftX, y: actualTopLeftY }
    taxonomyCoordinates.value[taxonomyId].end = { x: actualBottomRightX, y: actualBottomRightY }

    // Create anchors at the correct positions
    taxonomyCoordinates.value[taxonomyId].anchors.topLeft.position({ x: actualTopLeftX, y: actualTopLeftY })
    taxonomyCoordinates.value[taxonomyId].anchors.bottomRight = createAnchor(actualBottomRightX, actualBottomRightY, 'bottomRight', taxonomyCoordinates.value[taxonomyId], label, taxonomyId, colorCode)
    group.add(taxonomyCoordinates.value[taxonomyId].anchors.bottomRight)

    // Calculate dimensions
    const width = actualBottomRightX - actualTopLeftX
    const height = actualBottomRightY - actualTopLeftY
    const centerX = actualTopLeftX + width / 2
    const centerY = actualTopLeftY + height / 2

    // FIXED: Update rectangle properties
    taxonomyCoordinates.value[taxonomyId].rect.x(centerX)
    taxonomyCoordinates.value[taxonomyId].rect.y(centerY)
    taxonomyCoordinates.value[taxonomyId].rect.width(width)
    taxonomyCoordinates.value[taxonomyId].rect.height(height)
    taxonomyCoordinates.value[taxonomyId].rect.offsetX(width / 2)
    taxonomyCoordinates.value[taxonomyId].rect.offsetY(height / 2)

    // Create rotation anchor
    // const currentZoom = zoomFactor.value || 1
    // const scaledOffset = 20 / currentZoom

    // const rotationAnchor = createAnchor(
    //   centerX,
    //   centerY - height / 2 - scaledOffset,
    //   'rotation',
    //   taxonomyCoordinates.value[taxonomyId],
    //   label,
    //   taxonomyId,
    //   colorCode
    // )
    // group.add(rotationAnchor)
    // taxonomyCoordinates.value[taxonomyId].anchors.rotationAnchor = rotationAnchor
    // Create rotation anchor only for Bounding Box (not for Non-Rotational Bounding Box)
    if (taxonomyType === 'Bounding Box') {
      const currentZoom = zoomFactor.value || 1
      const scaledOffset = 20 / currentZoom

      const rotationAnchor = createAnchor(
        centerX, 
        centerY - height / 2 - scaledOffset, 
        'rotation', 
        taxonomyCoordinates.value[taxonomyId], 
        label, 
        taxonomyId, 
        colorCode
      )
      group.add(rotationAnchor)
      taxonomyCoordinates.value[taxonomyId].anchors.rotationAnchor = rotationAnchor
    } else {
      // For Non-Rotational Bounding Box, ensure rotationAnchor is not created
      taxonomyCoordinates.value[taxonomyId].anchors.rotationAnchor = undefined
    }

    if (data != undefined) {
      taxonomyCoordinates.value[taxonomyId].center.x = data.center.x
      taxonomyCoordinates.value[taxonomyId].center.y = data.center.y
      taxonomyCoordinates.value[taxonomyId].width = data.width
      taxonomyCoordinates.value[taxonomyId].height = data.height

      taxonomyCoordinates.value[taxonomyId].rect.offsetX(data.width / 2)
      taxonomyCoordinates.value[taxonomyId].rect.offsetY(data.height / 2)

      // Position the box at its center
      taxonomyCoordinates.value[taxonomyId].rect.x(data.center.x)
      taxonomyCoordinates.value[taxonomyId].rect.y(data.center.y)

      taxonomyCoordinates.value[taxonomyId].rect.rotation(data.rotationDegrees)
      taxonomyCoordinates.value[taxonomyId].rotationDegrees = data.rotationDegrees

      taxonomyCoordinates.value[taxonomyId].rect.width(data.width)
      taxonomyCoordinates.value[taxonomyId].rect.height(data.height)
    }
    else {
      taxonomyCoordinates.value[taxonomyId].center.x = centerX
      taxonomyCoordinates.value[taxonomyId].center.y = centerY
      taxonomyCoordinates.value[taxonomyId].width = width
      taxonomyCoordinates.value[taxonomyId].height = height
      // For Non-Rotational Bounding Box, always set rotationDegrees to 0
      taxonomyCoordinates.value[taxonomyId].rotationDegrees = taxonomyType === 'Non-Rotational Bounding Box' 
        ? 0 
        : taxonomyCoordinates.value[taxonomyId].rect.rotation()
    }

    // Update label position to center of the bounding box
    updateBBLabelPosition(label, taxonomyCoordinates.value[taxonomyId].rect)

    if (index == null)
      taxonomyIndex.value += 1

    if (!isReplayingHistory && !isStored) {
      recordAnnotationCreation({
        id: taxonomyId,
        type: taxonomyType,
        name: taxonomyName,
        abbreviation,
        colorCode,
        index: taxonomyCoordinates.value[taxonomyId].index ?? null,
        parentId,
        typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId,
        isStored,
        taxonomyMetrics: {
          start: { ...taxonomyCoordinates.value[taxonomyId].start },
          end: { ...taxonomyCoordinates.value[taxonomyId].end },
          center: { ...taxonomyCoordinates.value[taxonomyId].center },
          width: taxonomyCoordinates.value[taxonomyId].width,
          height: taxonomyCoordinates.value[taxonomyId].height,
          rotationDegrees: taxonomyCoordinates.value[taxonomyId].rotationDegrees ?? 0,
        },
      })
    }

    // Initialize lock state for new annotation (unlocked/unhidden)
    // This ensures new annotations are always unlocked even if all existing ones are locked
    if (!isStored) {
      // Find the item from fetchTaxonomies to get groupItems
      let foundItem: any = null
      let foundGroupItems: any[] = []
      fetchTaxonomies.value.forEach((taxonomy) => {
        const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies
        if (typesInTaxonomies && Array.isArray(typesInTaxonomies)) {
          const item = typesInTaxonomies.find((t: any) => t.id === taxonomyId)
          if (item) {
            foundItem = item
            foundGroupItems = typesInTaxonomies
          }
        }
      })
      initializeNewAnnotationLockState(taxonomyId, foundItem || { id: taxonomyId, parentId }, foundGroupItems.length > 0 ? foundGroupItems : [])
    }
  }

  layer.batchDraw()
}

function updateBoundingBox(clickX: number, clickY: number, taxonomyId: string, taxonomyName: string,abbreviation: string, taxonomyType: string, index: number | null = null) {
  if (!taxonomyCoordinates.value[taxonomyId])
    return

  const mouseX = clickX
  const mouseY = clickY
  const startX = taxonomyCoordinates.value[taxonomyId].start.x
  const startY = taxonomyCoordinates.value[taxonomyId].start.y

  taxonomyCoordinates.value[taxonomyId].rect.width(mouseX - startX)
  taxonomyCoordinates.value[taxonomyId].rect.height(mouseY - startY)

  // const label = layer.findOne(`#${taxonomyId}Text`);
  const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}Text`)
  updateBBLabelPosition(label, taxonomyCoordinates.value[taxonomyId].rect)

  layer.batchDraw()
}

// Ellipse Supporting Functions
function createEllipseAnchor(x, y, name, taxonomyId, _colorCode) {
  // Use cross-shaped anchor for better visibility and consistent appearance
  const scaledCrossSize = getScaledSize(5)
  const scaledStrokeWidth = getScaledSize(2)

  const anchor = new Konva.Shape({
    x,
    y,
    stroke: '#ffffff', // White color to match ellipse default
    strokeWidth: scaledStrokeWidth,
    draggable: true,
    name,
    id: `${taxonomyId}_${name}`,
    // Custom scene function to draw a cross shape
    sceneFunc: (context, shape) => {
      context.beginPath()
      // Horizontal line
      context.moveTo(-scaledCrossSize, 0)
      context.lineTo(scaledCrossSize, 0)
      // Vertical line
      context.moveTo(0, -scaledCrossSize)
      context.lineTo(0, scaledCrossSize)
      context.fillStrokeShape(shape)
    },
    // Custom hit function for better hit detection on the cross shape
    hitFunc: (context, shape) => {
      context.beginPath()
      context.rect(-scaledCrossSize, -scaledCrossSize, scaledCrossSize * 2, scaledCrossSize * 2)
      context.closePath()
      context.fillStrokeShape(shape)
    },
  })

  anchor.on('dragstart', () => {
    if (isLocked({ id: taxonomyId })) {
      anchor.stopDrag()
      return
    }
    captureAnnotationSnapshot(taxonomyId, true)
  })

  anchor.on('dragmove', () => {
    if (isLocked({ id: taxonomyId })) {
      anchor.stopDrag()
      return
    }
    updateEllipseSizeByAnchor(anchor, taxonomyId)
  })

  anchor.on('dragend', () => {
    if (isLocked({ id: taxonomyId }))
      return
    updateEllipseSizeByAnchor(anchor, taxonomyId)
    captureAnnotationSnapshot(taxonomyId, false)
  })

  return anchor
}

// Helper function to update ellipse anchor visual size
function updateEllipseAnchorSize(anchor, scaledCrossSize, scaledStrokeWidth) {
  anchor.strokeWidth(scaledStrokeWidth)
  anchor.sceneFunc((context, shape) => {
    context.beginPath()
    context.moveTo(-scaledCrossSize, 0)
    context.lineTo(scaledCrossSize, 0)
    context.moveTo(0, -scaledCrossSize)
    context.lineTo(0, scaledCrossSize)
    context.fillStrokeShape(shape)
  })
  anchor.hitFunc((context, shape) => {
    context.beginPath()
    context.rect(-scaledCrossSize, -scaledCrossSize, scaledCrossSize * 2, scaledCrossSize * 2)
    context.closePath()
    context.fillStrokeShape(shape)
  })
}

function updateEllipseSizeByAnchor(anchor, taxonomyId) {
  if (!taxonomyCoordinates.value[taxonomyId])
    return

  const ellipse = taxonomyCoordinates.value[taxonomyId].ellipse
  const anchors = taxonomyCoordinates.value[taxonomyId].anchors
  const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}label`)
  const rotation = ellipse.rotation() || 0
  const rotationRadians = rotation * Math.PI / 180

  // Get anchor position using .x() and .y() directly like the reference implementation
  const anchorX = anchor.x()
  const anchorY = anchor.y()
  const centerX = ellipse.x()
  const centerY = ellipse.y()

  // Calculate the vector from center to anchor in world coordinates
  const dx = anchorX - centerX
  const dy = anchorY - centerY

  // Rotate the vector back to local coordinates (inverse rotation)
  const localX = dx * Math.cos(-rotationRadians) - dy * Math.sin(-rotationRadians)
  const localY = dx * Math.sin(-rotationRadians) + dy * Math.cos(-rotationRadians)

  // Update the ellipse radius based on the anchor position in local space
  switch (anchor.name()) {
    case 'top':
      ellipse.radiusY(Math.abs(localY))
      break
    case 'bottom':
      ellipse.radiusY(Math.abs(localY))
      break
    case 'left':
      ellipse.radiusX(Math.abs(localX))
      break
    case 'right':
      ellipse.radiusX(Math.abs(localX))
      break
  }

  // Use rotation-aware update if ellipse is rotated, otherwise use standard update
  if (rotation !== 0) {
    updateEllipseAnchorPositionWithRotation(anchors, ellipse, taxonomyId)
  } else {
    updateEllipseAnchorPosition(anchors, ellipse, taxonomyId)
  }

  // CRITICAL FIX: Force the dragged anchor back to its geometry-derived position
  // This ensures ellipse geometry is always the single source of truth
  // and prevents anchors from moving independently during drag
  const anchorName = anchor.name()
  const newCenterX = ellipse.x()
  const newCenterY = ellipse.y()
  const radiusX = ellipse.radiusX()
  const radiusY = ellipse.radiusY()

  if (rotation !== 0) {
    // For rotated ellipse, calculate rotated anchor position
    const rotatePoint = (px: number, py: number) => ({
      x: newCenterX + (px - newCenterX) * Math.cos(rotationRadians) - (py - newCenterY) * Math.sin(rotationRadians),
      y: newCenterY + (px - newCenterX) * Math.sin(rotationRadians) + (py - newCenterY) * Math.cos(rotationRadians)
    })

    switch (anchorName) {
      case 'top': {
        const pos = rotatePoint(newCenterX, newCenterY - radiusY)
        anchor.position({ x: pos.x, y: pos.y })
        break
      }
      case 'bottom': {
        const pos = rotatePoint(newCenterX, newCenterY + radiusY)
        anchor.position({ x: pos.x, y: pos.y })
        break
      }
      case 'left': {
        const pos = rotatePoint(newCenterX - radiusX, newCenterY)
        anchor.position({ x: pos.x, y: pos.y })
        break
      }
      case 'right': {
        const pos = rotatePoint(newCenterX + radiusX, newCenterY)
        anchor.position({ x: pos.x, y: pos.y })
        break
      }
    }
  } else {
    // For non-rotated ellipse, use simple position calculation
    switch (anchorName) {
      case 'top':
        anchor.position({ x: newCenterX, y: newCenterY - radiusY })
        break
      case 'bottom':
        anchor.position({ x: newCenterX, y: newCenterY + radiusY })
        break
      case 'left':
        anchor.position({ x: newCenterX - radiusX, y: newCenterY })
        break
      case 'right':
        anchor.position({ x: newCenterX + radiusX, y: newCenterY })
        break
    }
  }

  updateEllipseLabelPosition(label, ellipse)
  layer.batchDraw()
}
function updateEllipseAnchorPosition(anchors, ellipse, taxonomyId) {
  // Update all anchor positions relative to the ellipse's new size
  // Use .x() and .y() methods directly like the reference implementation
  anchors.topAnchor.x(ellipse.x())
  anchors.topAnchor.y(ellipse.y() - ellipse.radiusY())

  anchors.bottomAnchor.x(ellipse.x())
  anchors.bottomAnchor.y(ellipse.y() + ellipse.radiusY())

  anchors.leftAnchor.x(ellipse.x() - ellipse.radiusX())
  anchors.leftAnchor.y(ellipse.y())

  anchors.rightAnchor.x(ellipse.x() + ellipse.radiusX())
  anchors.rightAnchor.y(ellipse.y())
  const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}label`)
  updateEllipseLabelPosition(label, ellipse)

  const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)
  const leftRightValue = calculateMeasurementDistance(
    [
      taxonomyCoordinates.value[taxonomyId].anchors.leftAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.leftAnchor.y() / imageSize.height,
      taxonomyCoordinates.value[taxonomyId].anchors.rightAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.rightAnchor.y() / imageSize.height,
    ],
    newTaxonomyInCESession.value.metadata.width,
    newTaxonomyInCESession.value.metadata.height,
    newTaxonomyInCESession.value.metadata.pixelResolution,
  )
  taxonomyCoordinates.value[taxonomyId].leftRightValue = leftRightValue

  const topBottomValue = calculateMeasurementDistance(
    [
      taxonomyCoordinates.value[taxonomyId].anchors.topAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.topAnchor.y() / imageSize.height,
      taxonomyCoordinates.value[taxonomyId].anchors.bottomAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.bottomAnchor.y() / imageSize.height,
    ],
    newTaxonomyInCESession.value.metadata.width,
    newTaxonomyInCESession.value.metadata.height,
    newTaxonomyInCESession.value.metadata.pixelResolution,
  )
  taxonomyCoordinates.value[taxonomyId].topBottomValue = topBottomValue

  const circumference = calculateEllipseCircumference(leftRightValue, topBottomValue)
  taxonomyCoordinates.value[taxonomyId].circumference = circumference

  layer.batchDraw()
}

function updateEllipseLabelPosition(label, ellipse) {
  if (!label || !ellipse)
    return

  // Position the label at the center of the ellipse.
  // Use measured bounds instead of label.width()/height() because text metrics can change
  // during zoom (fontSize updates) and cause visible drift if we center using stale values.
  const bounds = label.getClientRect({ skipTransform: true })
  label.x(ellipse.x() - bounds.width / 2)
  label.y(ellipse.y() - bounds.height / 2)
}

function updateEllipseRotation(anchor, taxonomyId, x, y) {
  if (!taxonomyCoordinates.value[taxonomyId]) return

  const ellipseData = taxonomyCoordinates.value[taxonomyId]
  const ellipse = ellipseData.ellipse
  const stage = ellipse.getStage()

  if (!stage) return

  // Convert screen coordinates (x, y) to stage coordinates
  const transform = stage.getAbsoluteTransform().copy().invert()
  const stagePoint = transform.point({ x, y })

  // Get ellipse center in stage coordinates
  const centerX = ellipse.x()
  const centerY = ellipse.y()

  // Calculate the angle from the center of the ellipse to the mouse position
  const angleRadians = Math.atan2(
    stagePoint.y - centerY,
    stagePoint.x - centerX
  ) + Math.PI / 2

  // Apply rotation
  const rotationDegrees = angleRadians * 180 / Math.PI
  ellipse.rotation(rotationDegrees)

  // Store rotation
  ellipseData.rotationDegrees = rotationDegrees

  // Update anchor positions to follow the rotation
  updateEllipseAnchorPositionWithRotation(ellipseData.anchors, ellipse, taxonomyId)

  // Update label position
  const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}label`)
  if (label) {
    updateEllipseLabelPosition(label, ellipse)
  }

  layer.batchDraw()
}

function updateEllipseAnchorPositionWithRotation(anchors, ellipse, taxonomyId) {
  // Update anchor positions accounting for rotation
  const rotationAngleRadians = ellipse.rotation() * Math.PI / 180
  const centerX = ellipse.x()
  const centerY = ellipse.y()
  const radiusX = ellipse.radiusX()
  const radiusY = ellipse.radiusY()

  // Helper function to rotate a point around the center
  const rotatePointAroundCenter = (px, py) => {
    const dx = px - centerX
    const dy = py - centerY
    return {
      x: centerX + dx * Math.cos(rotationAngleRadians) - dy * Math.sin(rotationAngleRadians),
      y: centerY + dx * Math.sin(rotationAngleRadians) + dy * Math.cos(rotationAngleRadians)
    }
  }

  // Calculate positions before rotation
  const topPos = rotatePointAroundCenter(centerX, centerY - radiusY)
  const bottomPos = rotatePointAroundCenter(centerX, centerY + radiusY)
  const leftPos = rotatePointAroundCenter(centerX - radiusX, centerY)
  const rightPos = rotatePointAroundCenter(centerX + radiusX, centerY)

  // Update anchor positions using .x() and .y() methods directly like the reference
  anchors.topAnchor.x(topPos.x)
  anchors.topAnchor.y(topPos.y)
  anchors.bottomAnchor.x(bottomPos.x)
  anchors.bottomAnchor.y(bottomPos.y)
  anchors.leftAnchor.x(leftPos.x)
  anchors.leftAnchor.y(leftPos.y)
  anchors.rightAnchor.x(rightPos.x)
  anchors.rightAnchor.y(rightPos.y)

  // Update label position
  const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}label`)
  if (label) {
    updateEllipseLabelPosition(label, ellipse)
  }

  // Calculate measurements (leftRightValue, topBottomValue, circumference)
  // This ensures measurements are updated when ellipse is rotated
  const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)
  const leftRightValue = calculateMeasurementDistance(
    [
      taxonomyCoordinates.value[taxonomyId].anchors.leftAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.leftAnchor.y() / imageSize.height,
      taxonomyCoordinates.value[taxonomyId].anchors.rightAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.rightAnchor.y() / imageSize.height,
    ],
    newTaxonomyInCESession.value.metadata.width,
    newTaxonomyInCESession.value.metadata.height,
    newTaxonomyInCESession.value.metadata.pixelResolution,
  )
  taxonomyCoordinates.value[taxonomyId].leftRightValue = leftRightValue

  const topBottomValue = calculateMeasurementDistance(
    [
      taxonomyCoordinates.value[taxonomyId].anchors.topAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.topAnchor.y() / imageSize.height,
      taxonomyCoordinates.value[taxonomyId].anchors.bottomAnchor.x() / imageSize.width,
      taxonomyCoordinates.value[taxonomyId].anchors.bottomAnchor.y() / imageSize.height,
    ],
    newTaxonomyInCESession.value.metadata.width,
    newTaxonomyInCESession.value.metadata.height,
    newTaxonomyInCESession.value.metadata.pixelResolution,
  )
  taxonomyCoordinates.value[taxonomyId].topBottomValue = topBottomValue

  const circumference = calculateEllipseCircumference(leftRightValue, topBottomValue)
  taxonomyCoordinates.value[taxonomyId].circumference = circumference

  layer.batchDraw()
}

function startEllipse(clickX: number, clickY: number, taxonomyId: string, taxonomyName: string,abbreviation: string, taxonomyType: string, colorCode: string, index: number | null = null, radiusX: number | null = null, radiusY: number | null = null, isStored = false, hide = false, parentId: any, typesInTaxonomyId: any, taxonomiesAnnotationsInDLSessionsId: any) {
  // CRITICAL FIX: Check if annotation doesn't exist OR if Konva nodes were destroyed (stage was recreated)
  const existingAnnotation = taxonomyCoordinates.value[taxonomyId]
  const needsRecreation = !existingAnnotation || (existingAnnotation.type === 'Ellipse' && !existingAnnotation.ellipse)

  if (needsRecreation) {
    // If annotation exists but nodes are missing, clear it first to recreate properly
    if (existingAnnotation && !existingAnnotation.ellipse) {
      delete taxonomyCoordinates.value[taxonomyId]
    }
    // For a new ellipse being drawn, clickX/clickY represents the TOP-CENTER anchor
    // For a stored ellipse being loaded, clickX/clickY represents the CENTER
    const scaledText = getScaledSize(14)
    const scaledStrokeWidth = getScaledSize(2);

    // Determine center position:
    // - If isStored or radiusY is provided, clickX/clickY is the center
    // - If new drawing (not stored, no radiusY), clickX/clickY is the top-center anchor
    const isNewDrawing = !isStored && radiusY === null
    const centerY = isNewDrawing ? clickY : clickY
    const centerX = clickX

    const initialRadiusX = radiusX != null ? radiusX : 0
    const initialRadiusY = radiusY != null ? radiusY : 0

    // Create anchors for the ellipse at their proper positions
    const topAnchor = createEllipseAnchor(centerX, centerY - initialRadiusY, 'top', taxonomyId, colorCode)
    const bottomAnchor = createEllipseAnchor(centerX, centerY + initialRadiusY, 'bottom', taxonomyId, colorCode)
    const leftAnchor = createEllipseAnchor(centerX - initialRadiusX, centerY, 'left', taxonomyId, colorCode)
    const rightAnchor = createEllipseAnchor(centerX + initialRadiusX, centerY, 'right', taxonomyId, colorCode)

    // Update label to use abbreviation
    const label = new Konva.Text({
      x: centerX,
      y: centerY,
      text: abbreviation,
      fontSize: scaledText,
      fill: colorCode,
      id: `${taxonomyId}label`,
    })

    // Start a new ellipse
    taxonomyCoordinates.value[taxonomyId] = {
      id: taxonomyId,
      name: taxonomyName,
      abbreviation: abbreviation,
      index: index != null ? index : taxonomyIndex.value,
      type: taxonomyType,
      ellipse: new Konva.Ellipse({
        x: centerX,
        y: centerY,
        radiusX: initialRadiusX,
        radiusY: initialRadiusY,
        stroke: colorCode,
        strokeWidth: scaledStrokeWidth,
        dash: [getScaledSize(2), getScaledSize(2)],
        draggable: true, // ✅ DRAGGABLE for repositioning with left-click
      }),
      anchors: { topAnchor, bottomAnchor, leftAnchor, rightAnchor },
      // Fixed point for drawing phase - stores the exact click position
      // This point will stay FIXED on the ellipse edge during drawing
      fixedPoint: { x: clickX, y: clickY },
      // Anchor type determined by initial drag direction (null until first significant move)
      fixedAnchorType: null as 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | null,
      completed: false,
      isStored,
      parentId,
      typesInTaxonomyId,
      taxonomiesAnnotationsInDLSessionsId,
      colorCode,
      rotationDegrees: 0, // Initialize rotation
    }
    // Update label position to be centered in the ellipse
    updateEllipseLabelPosition(label, taxonomyCoordinates.value[taxonomyId].ellipse)

    // Variables to track rotation mode
    let isRotating = false
    let rotationStartAngle = 0
    let initialRotation = 0

    // Prevent context menu on right-click
    taxonomyCoordinates.value[taxonomyId].ellipse.on('contextmenu', (e) => {
      e.evt.preventDefault()
      e.evt.stopPropagation() // Stop event from bubbling to container
      // Hide label menu if it's visible
      if (labelMenu.visible) {
        labelMenu.visible = false
      }
    })

    // Use mouse events for rotation-only control with right-click
    taxonomyCoordinates.value[taxonomyId].ellipse.on('mousedown', (e) => {
      if (isLocked({ id: taxonomyId })) {
        return
      }

      // Only respond if RIGHT mouse button is clicked (button === 2)
      if (e.evt.button === 2) {
        isRotating = true
        e.evt.preventDefault() // Prevent context menu
        e.evt.stopPropagation() // Stop event from bubbling to container
        
        // Hide label menu if it's visible when rotation starts
        if (labelMenu.visible) {
          labelMenu.visible = false
        }

        // Stop normal dragging for rotation
        taxonomyCoordinates.value[taxonomyId].ellipse.stopDrag()

        const stage = taxonomyCoordinates.value[taxonomyId].ellipse.getStage()
        if (stage) {
          const pointerPos = stage.getPointerPosition()
          if (pointerPos) {
            const ellipse = taxonomyCoordinates.value[taxonomyId].ellipse
            const centerX = ellipse.x()
            const centerY = ellipse.y()

            // Calculate initial angle
            rotationStartAngle = Math.atan2(
              pointerPos.y - centerY,
              pointerPos.x - centerX
            ) * 180 / Math.PI

            initialRotation = ellipse.rotation() || 0
          }
        }

        captureAnnotationSnapshot(taxonomyId, true)
      }
    })

    taxonomyCoordinates.value[taxonomyId].ellipse.on('mousemove', (e) => {
      if (isLocked({ id: taxonomyId })) {
        return
      }

      // During rotation, check if right button is still pressed
      if (isRotating && e.evt.buttons === 2) {
        e.evt.stopPropagation() // Prevent event from bubbling during rotation
        const stage = taxonomyCoordinates.value[taxonomyId].ellipse.getStage()
        if (stage) {
          const pointerPos = stage.getPointerPosition()
          if (pointerPos) {
            const ellipse = taxonomyCoordinates.value[taxonomyId].ellipse
            const centerX = ellipse.x()
            const centerY = ellipse.y()

            // Calculate current angle
            const currentAngle = Math.atan2(
              pointerPos.y - centerY,
              pointerPos.x - centerX
            ) * 180 / Math.PI

            // Calculate rotation delta
            const rotationDelta = currentAngle - rotationStartAngle
            const newRotation = initialRotation + rotationDelta

            // Apply rotation
            ellipse.rotation(newRotation)
            taxonomyCoordinates.value[taxonomyId].rotationDegrees = newRotation

            // Update anchor positions
            updateEllipseAnchorPositionWithRotation(
              taxonomyCoordinates.value[taxonomyId].anchors,
              ellipse,
              taxonomyId
            )

            // Update label
            const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}label`)
            if (label) {
              updateEllipseLabelPosition(label, ellipse)
            }

            layer.batchDraw()
          }
        }
      }
    })

    taxonomyCoordinates.value[taxonomyId].ellipse.on('mouseup', () => {
      if (isLocked({ id: taxonomyId })) {
        return
      }

      if (isRotating) {
        captureAnnotationSnapshot(taxonomyId, false)
        isRotating = false
      }
    })

    // Also handle mouse leaving the ellipse while rotating
    taxonomyCoordinates.value[taxonomyId].ellipse.on('mouseleave', () => {
      if (isRotating) {
        captureAnnotationSnapshot(taxonomyId, false)
        isRotating = false
      }
    })

    // LEFT-CLICK DRAG handlers for repositioning
    taxonomyCoordinates.value[taxonomyId].ellipse.on('dragstart', (e) => {
      if (isLocked({ id: taxonomyId })) {
        taxonomyCoordinates.value[taxonomyId].ellipse.stopDrag()
        return
      }

      // Only allow left-click drag (not right-click)
      if (e.evt.button === 2) {
        taxonomyCoordinates.value[taxonomyId].ellipse.stopDrag()
        return
      }

      captureAnnotationSnapshot(taxonomyId, true)
    })

    taxonomyCoordinates.value[taxonomyId].ellipse.on('dragmove', () => {
      if (isLocked({ id: taxonomyId })) {
        taxonomyCoordinates.value[taxonomyId].ellipse.stopDrag()
        return
      }

      // Update label position
      updateEllipseLabelPosition(label, taxonomyCoordinates.value[taxonomyId].ellipse)

      // Update all crossbar positions to follow the ellipse
      const ellipse = taxonomyCoordinates.value[taxonomyId].ellipse
      const rotation = ellipse.rotation() || 0

      if (rotation !== 0) {
        updateEllipseAnchorPositionWithRotation(taxonomyCoordinates.value[taxonomyId].anchors, ellipse, taxonomyId)
      } else {
        updateEllipseAnchorPosition(taxonomyCoordinates.value[taxonomyId].anchors, ellipse, taxonomyId)
      }
    })

    taxonomyCoordinates.value[taxonomyId].ellipse.on('dragend', () => {
      if (isLocked({ id: taxonomyId })) {
        return
      }

      // Final update of positions
      const ellipse = taxonomyCoordinates.value[taxonomyId].ellipse
      const rotation = ellipse.rotation() || 0

      if (rotation !== 0) {
        updateEllipseAnchorPositionWithRotation(taxonomyCoordinates.value[taxonomyId].anchors, ellipse, taxonomyId)
      } else {
        updateEllipseAnchorPosition(taxonomyCoordinates.value[taxonomyId].anchors, ellipse, taxonomyId)
      }

      captureAnnotationSnapshot(taxonomyId, false)
    })

    const group = new Konva.Group({
      id: `${taxonomyId}group`,
    })
    group.setAttr('isClick', false)

    // Update click handler to use abbreviation
    label.on('click', () => {
      const index = isClickedItems.value.indexOf(taxonomyId)
      if (index !== -1) {
        isClickedItems.value.splice(index, 1)
        label.fontStyle('')
        label.textDecoration('')
      }
      else {
        isClickedItems.value.push(taxonomyId)
        label.fontStyle('italic bold')
        label.textDecoration('underline')
      }
      layer!.batchDraw()
    })

    const isClicked = isClickedItems.value.includes(taxonomyId)
    label.fontStyle(isClicked ? 'italic bold' : 'normal')
    label.textDecoration(isClicked ? 'underline' : '')

    // Add elements to group
    group.add(taxonomyCoordinates.value[taxonomyId].ellipse)
    group.add(label)
    group.add(topAnchor)
    group.add(bottomAnchor)
    group.add(leftAnchor)
    group.add(rightAnchor)

    const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)
    const leftRightValue = calculateMeasurementDistance(
      [
        taxonomyCoordinates.value[taxonomyId].anchors.leftAnchor.x() / imageSize.width,
        taxonomyCoordinates.value[taxonomyId].anchors.leftAnchor.y() / imageSize.height,
        taxonomyCoordinates.value[taxonomyId].anchors.rightAnchor.x() / imageSize.width,
        taxonomyCoordinates.value[taxonomyId].anchors.rightAnchor.y() / imageSize.height,
      ],
      newTaxonomyInCESession.value.metadata.width,
      newTaxonomyInCESession.value.metadata.height,
      newTaxonomyInCESession.value.metadata.pixelResolution,
    )
    taxonomyCoordinates.value[taxonomyId].leftRightValue = leftRightValue

    const topBottomValue = calculateMeasurementDistance(
      [
        taxonomyCoordinates.value[taxonomyId].anchors.topAnchor.x() / imageSize.width,
        taxonomyCoordinates.value[taxonomyId].anchors.topAnchor.y() / imageSize.height,
        taxonomyCoordinates.value[taxonomyId].anchors.bottomAnchor.x() / imageSize.width,
        taxonomyCoordinates.value[taxonomyId].anchors.bottomAnchor.y() / imageSize.height,
      ],
      newTaxonomyInCESession.value.metadata.width,
      newTaxonomyInCESession.value.metadata.height,
      newTaxonomyInCESession.value.metadata.pixelResolution,
    )
    taxonomyCoordinates.value[taxonomyId].topBottomValue = topBottomValue

    const circumference = calculateEllipseCircumference(leftRightValue, topBottomValue)
    taxonomyCoordinates.value[taxonomyId].circumference = circumference

    layer.add(group)
    layer.batchDraw()

    if (hide)
      completeEllipse(clickX, clickY, taxonomyId, taxonomyName, abbreviation, taxonomyType)
  }
}

function updateEllipseSize(clickX: number, clickY: number, taxonomyId: string, taxonomyName: string, taxonomyType: string, index: number | null = null) {
  if (!taxonomyCoordinates.value[taxonomyId])
    return

  const ellipseData = taxonomyCoordinates.value[taxonomyId]
  const ellipse = ellipseData.ellipse
  const fixedPoint = ellipseData.fixedPoint

  if (!fixedPoint) {
    // Fallback to old behavior if fixedPoint is not set (shouldn't happen for new drawings)
    ellipse.radiusX(Math.abs(clickX - ellipse.x()))
    ellipse.radiusY(Math.abs(clickY - ellipse.y()))
  }
  else {
    // FIXED ANCHOR APPROACH:
    // The clicked point (fixedPoint) stays FIXED on the ellipse edge
    // Based on drag direction, we determine which anchor type fixedPoint represents
    // The geometry is calculated so fixedPoint remains exactly on the ellipse

    const dx = clickX - fixedPoint.x
    const dy = clickY - fixedPoint.y

    // Detect anchor type on first significant movement (only once)
    // Threshold ensures we have enough movement to determine direction
    if (!ellipseData.fixedAnchorType && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      // Determine which anchor type based on PRIMARY drag direction
      if (Math.abs(dy) >= Math.abs(dx)) {
        // Primarily vertical movement
        ellipseData.fixedAnchorType = dy > 0 ? 'TOP' : 'BOTTOM'
      }
      else {
        // Primarily horizontal movement
        ellipseData.fixedAnchorType = dx > 0 ? 'LEFT' : 'RIGHT'
      }
    }

    // Calculate geometry based on fixed anchor type
    // The key: fixedPoint stays exactly on the ellipse at the specified anchor position
    let centerX = fixedPoint.x
    let centerY = fixedPoint.y
    let radiusX = 0
    let radiusY = 0

    switch (ellipseData.fixedAnchorType) {
      case 'TOP':
        // fixedPoint is TOP anchor - stays at (fixedPoint.x, fixedPoint.y)
        // centerX = fixedPoint.x (TOP is at center X)
        // TOP is at (centerX, centerY - radiusY), so:
        //   centerY - radiusY = fixedPoint.y
        //   centerY = fixedPoint.y + radiusY
        // BOTTOM is at mouseY, so:
        //   centerY + radiusY = clickY
        //   fixedPoint.y + 2*radiusY = clickY
        //   radiusY = (clickY - fixedPoint.y) / 2
        radiusY = Math.abs(clickY - fixedPoint.y) / 2
        centerX = fixedPoint.x
        centerY = fixedPoint.y + (clickY > fixedPoint.y ? radiusY : -radiusY)
        // Horizontal radius based on deviation from center
        radiusX = Math.abs(clickX - fixedPoint.x)
        break

      case 'BOTTOM':
        // fixedPoint is BOTTOM anchor
        radiusY = Math.abs(fixedPoint.y - clickY) / 2
        centerX = fixedPoint.x
        centerY = fixedPoint.y + (clickY < fixedPoint.y ? radiusY : -radiusY)
        radiusX = Math.abs(clickX - fixedPoint.x)
        break

      case 'LEFT':
        // fixedPoint is LEFT anchor
        radiusX = Math.abs(clickX - fixedPoint.x) / 2
        centerY = fixedPoint.y
        centerX = fixedPoint.x + (clickX > fixedPoint.x ? radiusX : -radiusX)
        radiusY = Math.abs(clickY - fixedPoint.y)
        break

      case 'RIGHT':
        // fixedPoint is RIGHT anchor
        radiusX = Math.abs(fixedPoint.x - clickX) / 2
        centerY = fixedPoint.y
        centerX = fixedPoint.x + (clickX < fixedPoint.x ? radiusX : -radiusX)
        radiusY = Math.abs(clickY - fixedPoint.y)
        break

      default:
        // Before anchor type is determined, show preview with midpoint approach
        centerX = (fixedPoint.x + clickX) / 2
        centerY = (fixedPoint.y + clickY) / 2
        radiusX = Math.abs(clickX - fixedPoint.x) / 2
        radiusY = Math.abs(clickY - fixedPoint.y) / 2
        break
    }

    // Ensure minimum radii for visibility
    radiusX = Math.max(radiusX, 0)
    radiusY = Math.max(radiusY, 0)

    // Update ellipse geometry (single source of truth)
    ellipse.x(centerX)
    ellipse.y(centerY)
    ellipse.radiusX(radiusX)
    ellipse.radiusY(radiusY)

    // Derive anchor positions from ellipse geometry (never set directly)
    const anchors = ellipseData.anchors
    if (anchors) {
      anchors.topAnchor.position({ x: centerX, y: centerY - radiusY })
      anchors.bottomAnchor.position({ x: centerX, y: centerY + radiusY })
      anchors.leftAnchor.position({ x: centerX - radiusX, y: centerY })
      anchors.rightAnchor.position({ x: centerX + radiusX, y: centerY })
    }

    // Update label position
    const label = layer!.findOne(g => g.attrs.id === `${taxonomyId}label`)
    if (label)
      updateEllipseLabelPosition(label, ellipse)
  }

  layer.batchDraw()
}


function completeEllipse(clickX: number, clickY: number, taxonomyId: string, taxonomyName: string, abbreviation: string, taxonomyType: string, index: number | null = null) {
  if (taxonomyCoordinates.value[taxonomyId]) {
    const ellipseData = taxonomyCoordinates.value[taxonomyId]
    const ellipseNode = ellipseData.ellipse as Konva.Ellipse

    // EDGE CASE: Check if user just clicked without dragging (minimum size threshold)
    const minSize = 5 // minimum pixels to consider it a valid shape
    if (ellipseNode.radiusX() < minSize && ellipseNode.radiusY() < minSize) {
      // User clicked without significant drag - remove the incomplete ellipse
      const group = layer?.findOne(g => g.attrs.id === `${taxonomyId}group`)
      if (group) {
        group.destroy()
      }
      delete taxonomyCoordinates.value[taxonomyId]
      layer.batchDraw()
      return
    }

    // Complete the ellipse
    updateEllipseAnchorPosition(taxonomyCoordinates.value[taxonomyId].anchors, taxonomyCoordinates.value[taxonomyId].ellipse, taxonomyId)

    const anchors = ellipseData.anchors

    if (ellipseNode && anchors?.leftAnchor && anchors?.rightAnchor && anchors?.topAnchor && anchors?.bottomAnchor) {
      const recalculatedCenterX = (anchors.leftAnchor.x() + anchors.rightAnchor.x()) / 2
      const recalculatedCenterY = (anchors.topAnchor.y() + anchors.bottomAnchor.y()) / 2
      const recalculatedRadiusX = Math.abs(anchors.rightAnchor.x() - anchors.leftAnchor.x()) / 2
      const recalculatedRadiusY = Math.abs(anchors.bottomAnchor.y() - anchors.topAnchor.y()) / 2

      ellipseNode.position({ x: recalculatedCenterX, y: recalculatedCenterY })
      ellipseNode.radiusX(recalculatedRadiusX)
      ellipseNode.radiusY(recalculatedRadiusY)

      const labelNode = layer?.findOne(`#${taxonomyId}label`) as Konva.Text | null
      if (labelNode)
        updateEllipseLabelPosition(labelNode, ellipseNode)

    }

    layer.batchDraw()
    taxonomyCoordinates.value[taxonomyId].completed = true

    // Clear the drawing phase properties as they're only needed during initial drawing
    delete taxonomyCoordinates.value[taxonomyId].fixedPoint
    delete taxonomyCoordinates.value[taxonomyId].fixedAnchorType

    if (!isReplayingHistory && !taxonomyCoordinates.value[taxonomyId].isStored) {
      recordAnnotationCreation({
        id: taxonomyId,
        type: taxonomyType,
        name: taxonomyName,
        abbreviation,
        colorCode: taxonomyCoordinates.value[taxonomyId].colorCode,
        index: taxonomyCoordinates.value[taxonomyId].index ?? null,
        parentId: taxonomyCoordinates.value[taxonomyId].parentId,
        typesInTaxonomyId: taxonomyCoordinates.value[taxonomyId].typesInTaxonomyId,
        taxonomiesAnnotationsInDLSessionsId: taxonomyCoordinates.value[taxonomyId].taxonomiesAnnotationsInDLSessionsId,
        isStored: taxonomyCoordinates.value[taxonomyId].isStored,
        taxonomyMetrics: {
          x: taxonomyCoordinates.value[taxonomyId].ellipse.x(),
          y: taxonomyCoordinates.value[taxonomyId].ellipse.y(),
          radiusX: taxonomyCoordinates.value[taxonomyId].ellipse.radiusX(),
          radiusY: taxonomyCoordinates.value[taxonomyId].ellipse.radiusY(),
          rotationDegrees: taxonomyCoordinates.value[taxonomyId].rotationDegrees || 0,
          leftRightValue: taxonomyCoordinates.value[taxonomyId].leftRightValue,
          topBottomValue: taxonomyCoordinates.value[taxonomyId].topBottomValue,
          circumference: taxonomyCoordinates.value[taxonomyId].circumference,
        },
      })
    }

    // Initialize lock state for new annotation (unlocked/unhidden)
    // This ensures new annotations are always unlocked even if all existing ones are locked
    if (!taxonomyCoordinates.value[taxonomyId].isStored) {
      // Find the item from fetchTaxonomies to get groupItems
      let foundItem: any = null
      let foundGroupItems: any[] = []
      fetchTaxonomies.value.forEach((taxonomy) => {
        const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies
        if (typesInTaxonomies && Array.isArray(typesInTaxonomies)) {
          const item = typesInTaxonomies.find((t: any) => t.id === taxonomyId)
          if (item) {
            foundItem = item
            foundGroupItems = typesInTaxonomies
          }
        }
      })
      initializeNewAnnotationLockState(taxonomyId, foundItem || { id: taxonomyId, parentId: taxonomyCoordinates.value[taxonomyId].parentId }, foundGroupItems.length > 0 ? foundGroupItems : [])
    }
  }
}

// Angle Supporting Functions
let currentAnglePoints = ref([])

function drawTemporaryLine(startPoint, lineId, colorCode) {
  const scaledStrokeWidth = getScaledSize(2)
  const tempLine = new Konva.Line({
    points: [startPoint.x, startPoint.y, startPoint.x, startPoint.y],
    stroke: colorCode,
    strokeWidth:scaledStrokeWidth,
    dash: [getScaledSize(3),getScaledSize(3)],
    lineCap: 'round',
    id: lineId,
  })
  layer.add(tempLine)
}

function finalizeAngle(taxonomyId: string, taxonomyName: string,abbreviation: string, taxonomyType: string, colorCode: string, index: number | null = null, isStored = false, parentId: any, typesInTaxonomyId: any,taxonomiesAnnotationsInDLSessionsId:any) {
  layer.findOne('#tempLine1').destroy()
  layer.findOne('#tempLine2').destroy()

  const angle = calculateAndDrawAngle(currentAnglePoints.value, taxonomyId, taxonomyName,abbreviation, colorCode)

  taxonomyCoordinates.value[taxonomyId] = {
    id: taxonomyId,
    name: taxonomyName,
    abbreviation: abbreviation,
    index: index != null ? index : taxonomyIndex.value,
    type: taxonomyType,
    angle,
    isStored,
    parentId,
    typesInTaxonomyId,
    taxonomiesAnnotationsInDLSessionsId,
    colorCode,
  }


  if (index == null)
    taxonomyIndex.value += 1

  currentAnglePoints.value = []

  if (!isReplayingHistory && !isStored) {
    recordAnnotationCreation({
      id: taxonomyId,
      type: taxonomyType,
      name: taxonomyName,
      abbreviation,
      colorCode,
      index: taxonomyCoordinates.value[taxonomyId].index ?? null,
      parentId,
      typesInTaxonomyId,
      taxonomiesAnnotationsInDLSessionsId,
      isStored,
      taxonomyMetrics: {
        vertex: { ...angle.vertex },
        armPoint1: { ...angle.armPoint1 },
        armPoint2: { ...angle.armPoint2 },
        angleValue: angle.angleValue,
      },
    })
  }

  // Initialize lock state for new annotation (unlocked/unhidden)
  // This ensures new annotations are always unlocked even if all existing ones are locked
  if (!isStored) {
    // Find the item from fetchTaxonomies to get groupItems
    let foundItem: any = null
    let foundGroupItems: any[] = []
    fetchTaxonomies.value.forEach((taxonomy) => {
      const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies
      if (typesInTaxonomies && Array.isArray(typesInTaxonomies)) {
        const item = typesInTaxonomies.find((t: any) => t.id === taxonomyId)
        if (item) {
          foundItem = item
          foundGroupItems = typesInTaxonomies
        }
      }
    })
    initializeNewAnnotationLockState(taxonomyId, foundItem || { id: taxonomyId, parentId }, foundGroupItems.length > 0 ? foundGroupItems : [])
  }
}

function calculateAndDrawAngle(points, taxonomyId, taxonomyName,abbreviation, colorCode) {
  const scaledStrokeWidth = getScaledSize(2)
  const scaledText = getScaledSize(14)
  const vertex =  currentAnglePoints.value[0]
  const armPoint1 = currentAnglePoints.value[1]
  const armPoint2 = currentAnglePoints.value[2]



  const draggableVertex = createDraggablePoint(vertex.x, vertex.y, `${taxonomyId}vertex`, taxonomyId, taxonomyName, updateAngle)
  const draggableArmPoint1 = createDraggablePoint(armPoint1.x, armPoint1.y, `${taxonomyId}armPoint1`, taxonomyId, taxonomyName, updateAngle)
  const draggableArmPoint2 = createDraggablePoint(armPoint2.x, armPoint2.y, `${taxonomyId}armPoint2`, taxonomyId, taxonomyName, updateAngle)

  const angleValue = calculateAngleBetweenPoints(vertex, armPoint1, armPoint2)

  // Draw the first arm of the angle
  const line1 = new Konva.Line({
    id: `${taxonomyId}angleline1`,
    points: [vertex.x, vertex.y, armPoint1.x, armPoint1.y],
    stroke: colorCode,
    strokeWidth:scaledStrokeWidth,
    lineCap: 'round',
    name: 'angleLine',
  })

  // Draw the second arm of the angle
  const line2 = new Konva.Line({
    id: `${taxonomyId}angleline2`,
    points: [vertex.x, vertex.y, armPoint2.x, armPoint2.y],
    stroke: colorCode,
    strokeWidth:scaledStrokeWidth,
    lineCap: 'round',
    name: 'angleLine',
  })

  // Calculate Bisector Point of Angle
  // const bisectorPoint = calculateBisectorPoint(vertex, armPoint1, armPoint2);

  // Create a text label for the angle
  const angleText = new Konva.Text({
    id: `${taxonomyId}angletext`,
    x: vertex.x,
    y: vertex.y + 20,
    text: `${abbreviation} - ${angleValue.toFixed(1)}°`,
    fontSize:  scaledText,
    fill: colorCode,
  })



  const group = new Konva.Group({
    id: `${taxonomyId}group`,
  })
  group.setAttr('isClick', false)

  // Set up angleText click event to show or hide the box
  angleText.on('click', () => {
    const index = isClickedItems.value.indexOf(taxonomyId)
    if (index !== -1) {
      isClickedItems.value.splice(index, 1)
      angleText.fontStyle('')
      angleText.textDecoration('')
    }
    else {
      isClickedItems.value.push(taxonomyId)
      angleText.fontStyle('italic bold')
      angleText.textDecoration('underline')
    }
    layer!.batchDraw()
  })
  const isClicked = isClickedItems.value.includes(taxonomyId)
  angleText.fontStyle(isClicked ? 'italic bold' : 'normal')
  angleText.textDecoration(isClicked ? 'underline' : '')

  group.add(line1)
  group.add(line2)
  group.add(angleText)
  group.add(draggableVertex)
  group.add(draggableArmPoint1)
  group.add(draggableArmPoint2)

  layer.add(group)
  layer.batchDraw()

  return { vertex, armPoint1, armPoint2, angleValue, line1, line2, angleText }
}

function calculateAngleBetweenPoints(vertex, arm2, arm1) {
  // Calculate the vectors
  const vector1 = { x: arm1.x - vertex.x, y: arm1.y - vertex.y }
  const vector2 = { x: arm2.x - vertex.x, y: arm2.y - vertex.y }

  // Calculate the dot product
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y

  // Calculate the magnitudes of the vectors
  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y)
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y)

  // Calculate the angle in radians
  const angleRadians = Math.acos(dotProduct / (magnitude1 * magnitude2))

  // Calculate the cross product to determine the orientation
  const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x

  // Convert to degrees
  let angleDegrees = angleRadians * (180 / Math.PI)

  // Adjust for angles greater than 180 degrees
  if (crossProduct < 0)
    angleDegrees = 360 - angleDegrees

  return angleDegrees
}

function createDraggablePoint(x, y, id, taxonomyId, taxonomyName, onDragMove) {
  const scaledStrokeWidth = getScaledSize(2)
  const scaledRadius = getScaledSize(5);
  const point = new Konva.Circle({
    x,
    y,
    id,
    radius: scaledRadius,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth:scaledStrokeWidth ,
    draggable: true,
  })

  point.on('dragstart', () => {
    if (isLocked({ id: taxonomyId })) {
      point.stopDrag()
      return
    }
    // Capture the state before dragging starts
    captureAnnotationSnapshot(taxonomyId, true)
  })

  point.on('dragmove', () => {
    if (isLocked({ id: taxonomyId })) {
      point.stopDrag()
      return
    }
    onDragMove(point, taxonomyId, taxonomyName)
    layer.batchDraw()
  })

  point.on('dragend', () => {
    if (isLocked({ id: taxonomyId })) {
      return
    }
    onDragMove(point, taxonomyId, taxonomyName)
    captureAnnotationSnapshot(taxonomyId, false)
  })

  return point
}

function updateAngle(point, taxonomyId, taxonomyName) {
  // Update line positions
  const line1 = layer!.findOne(g => g.attrs.id === `${taxonomyId}angleline1`)
  const line2 = layer!.findOne(g => g.attrs.id === `${taxonomyId}angleline2`)
  const vertex = layer!.findOne(g => g.attrs.id === `${taxonomyId}vertex`)
  const armPoint1 = layer!.findOne(g => g.attrs.id === `${taxonomyId}armPoint1`)
  const armPoint2 = layer!.findOne(g => g.attrs.id === `${taxonomyId}armPoint2`)
  const angleText = layer!.findOne(g => g.attrs.id === `${taxonomyId}angletext`)

  line1.points([vertex.x(), vertex.y(), armPoint1.x(), armPoint1.y()])
  line2.points([vertex.x(), vertex.y(), armPoint2.x(), armPoint2.y()])

  // Update angle value and label position if needed
  const angleValue = calculateAngleBetweenPoints(vertex.position(), armPoint1.position(), armPoint2.position())
  // Get abbreviation from taxonomyCoordinates, fallback to name if not available
  const abbreviation = taxonomyCoordinates.value[taxonomyId]?.abbreviation || taxonomyName
  // const bisectorPoint = calculateBisectorPoint(vertex.position(), armPoint1.position(), armPoint2.position());
  angleText.position({ x: vertex.x(), y: vertex.y() + 20 })
  angleText.text(`${abbreviation} - ${angleValue.toFixed(1)}°`)

  taxonomyCoordinates.value[taxonomyId].angle.angleValue = angleValue

  taxonomyCoordinates.value[taxonomyId].angle.vertex.x = vertex.x()
  taxonomyCoordinates.value[taxonomyId].angle.vertex.y = vertex.y()

  taxonomyCoordinates.value[taxonomyId].angle.armPoint1.x = armPoint1.x()
  taxonomyCoordinates.value[taxonomyId].angle.armPoint1.y = armPoint1.y()

  taxonomyCoordinates.value[taxonomyId].angle.armPoint2.x = armPoint2.x()
  taxonomyCoordinates.value[taxonomyId].angle.armPoint2.y = armPoint2.y()
}

function calculateBisectorPoint(vertex, armPoint1, armPoint2) {
  // Calculate unit vectors for the arms
  const v1 = { x: armPoint1.x - vertex.x, y: armPoint1.y - vertex.y }
  const v2 = { x: armPoint2.x - vertex.x, y: armPoint2.y - vertex.y }
  const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
  const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
  const unitV1 = { x: v1.x / magnitude1, y: v1.y / magnitude1 }
  const unitV2 = { x: v2.x / magnitude2, y: v2.y / magnitude2 }

  // Calculate the bisector vector
  const bisector = { x: unitV1.x + unitV2.x, y: unitV1.y + unitV2.y }
  const bisectorMagnitude = Math.sqrt(bisector.x * bisector.x + bisector.y * bisector.y)
  const unitBisector = { x: bisector.x / bisectorMagnitude, y: bisector.y / bisectorMagnitude }

  // Offset the text along the bisector
  const offset = 150 // Adjust as needed
  return { x: vertex.x + unitBisector.x * offset, y: vertex.y + unitBisector.y * offset }
}

async function submitTaxonomyMapping() {
  const data: UpdateTaxonomyDataInput = {
    dLSessionId: route.params.id.toString(),
    extractedResourceId: currentImage.value!.id,
    taxonomies: [],
  }

  const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)

  // CRITICAL FIX: Synchronize ALL bounding box coordinates from current anchor/rect positions
  // IMPORTANT: Use position() not getAbsolutePosition() to get base stage coordinates
  // getAbsolutePosition() includes zoom transforms which causes coordinate drift when zoomed
  for (const key in taxonomyCoordinates.value) {
    const value = taxonomyCoordinates.value[key]
    if (
      value
      && (value.type === 'Bounding Box' || value.type === 'Non-Rotational Bounding Box')
      && value.rect
      && value.anchors
      && value.anchors.topLeft
      && value.anchors.bottomRight
    ) {
      try {
        const topLeftPos = value.anchors.topLeft.position()
        const bottomRightPos = value.anchors.bottomRight.position()

        if (!value.start)
          value.start = { x: 0, y: 0 }
        if (!value.end)
          value.end = { x: 0, y: 0 }
        if (!value.center)
          value.center = { x: 0, y: 0 }

        value.start.x = Math.min(topLeftPos.x, bottomRightPos.x)
        value.start.y = Math.min(topLeftPos.y, bottomRightPos.y)
        value.end.x = Math.max(topLeftPos.x, bottomRightPos.x)
        value.end.y = Math.max(topLeftPos.y, bottomRightPos.y)

        // Keep center consistent with save logic (derived from start/end)
        value.center.x = (value.start.x + value.end.x) / 2
        value.center.y = (value.start.y + value.end.y) / 2

        value.width = value.rect.width()
        value.height = value.rect.height()
      }
      catch {
        // no-op: best-effort sync before saving
      }
    }
  }

  const tmpTaxonomyCoordinates = JSON.parse(JSON.stringify(taxonomyCoordinates.value))

  // Validate that we have taxonomy coordinates to save
  if (!tmpTaxonomyCoordinates || Object.keys(tmpTaxonomyCoordinates).length === 0) {
    notification.warning({ content: 'No annotations to save', duration: 3000 })
    return
  }

  for (const key in taxonomyCoordinates.value) {
    const value = taxonomyCoordinates.value[key]
    const tmpValue = tmpTaxonomyCoordinates[key]

    // Validate that the value exists and has required properties
    if (!value || !tmpValue) {
      continue
    }

    if (value.type == 'Landmark' || value.type == 'Crossbar') {
      // Validate required properties for Landmark/Crossbar
      if (value.x === undefined || value.y === undefined || value.x === null || value.y === null) {
        continue
      }

      const tmp = getRelativePosition(value.x, value.y, imageSize.width, imageSize.height)
      tmpValue.x = tmp[0]
      tmpValue.y = tmp[1]
      tmpValue.type = value.type

      // FIX 9: Include rotation data for crossbars (when changeAppearance is true)
      if (value.rotation !== undefined && value.rotation !== null && value.changeAppearance) {
        tmpValue.rotation = value.rotation
      }
    }

    if (value.type == 'Measurement') {
      // Validate required properties for Measurement
      if (!value.start || !value.end ||
          value.start.x === undefined || value.start.y === undefined ||
          value.end.x === undefined || value.end.y === undefined) {
        continue
      }

      const tmp1 = getRelativePosition(value.start.x, value.start.y, imageSize.width, imageSize.height)
      tmpValue.start.x = tmp1[0]
      tmpValue.start.y = tmp1[1]
      const tmp2 = getRelativePosition(value.end.x, value.end.y, imageSize.width, imageSize.height)
      tmpValue.end.x = tmp2[0]
      tmpValue.end.y = tmp2[1]
      delete tmpValue.id
      tmpValue.type = 'Measurement'
    }

    if (value.type == 'Bounding Box' || value.type == 'Non-Rotational Bounding Box') {
      // Validate required properties for Bounding Box and Non-Rotational Bounding Box
      if (!value.start || !value.end || !value.rect ||
          value.start.x === undefined || value.start.y === undefined ||
          value.end.x === undefined || value.end.y === undefined) {
        continue
      }
      
      const tmp1 = getRelativePosition(value.start.x, value.start.y, imageSize.width, imageSize.height)
      tmpValue.start.x = tmp1[0]
      tmpValue.start.y = tmp1[1]
      const tmp2 = getRelativePosition(value.end.x, value.end.y, imageSize.width, imageSize.height)
      tmpValue.end.x = tmp2[0]
      tmpValue.end.y = tmp2[1]
      
      // FIX: Calculate center from start and end coordinates instead of rect.x/y
      // This ensures the center is always correct regardless of rect position
      const centerX = (value.start.x + value.end.x) / 2
      const centerY = (value.start.y + value.end.y) / 2
      const tmp3 = getRelativePosition(centerX, centerY, imageSize.width, imageSize.height)
      tmpValue.center.x = tmp3[0]
      tmpValue.center.y = tmp3[1]
      
      // Compare old method (rect.x/y) vs new method (calculated) to verify consistency
      const oldCenterFromRect = getRelativePosition(value.rect.x(), value.rect.y(), imageSize.width, imageSize.height)
      
      const tmp4 = getRelativePosition(value.rect.width(), value.rect.height(), imageSize.width, imageSize.height)
      tmpValue.width = tmp4[0]
      tmpValue.height = tmp4[1]
      // For Non-Rotational Bounding Box, always set rotationDegrees to 0
      tmpValue.rotationDegrees = value.type === 'Non-Rotational Bounding Box' 
        ? 0 
        : value.rect.rotation()
      delete tmpValue.id
      delete tmpValue.rect
      delete tmpValue.anchors
      tmpValue.type = value.type
      tmpValue.type = value.type
    }


    if (value.type == 'Ellipse') {
      // Validate required properties for Ellipse
      if (!value.ellipse) {
        continue
      }

      const ellipse = value.ellipse
      const tmp1 = getRelativePosition(ellipse.x(), ellipse.y(), imageSize.width, imageSize.height)
      tmpValue.x = tmp1[0]
      tmpValue.y = tmp1[1]
      const tmp2 = getRelativePosition(ellipse.radiusX(), ellipse.radiusY(), imageSize.width, imageSize.height)
      tmpValue.radiusX = tmp2[0]
      tmpValue.radiusY = tmp2[1]
      // BUG FIX 1: Save rotation for ellipse (similar to bounding box)
      tmpValue.rotationDegrees = value.rotationDegrees || ellipse.rotation() || 0
      delete tmpValue.id
      delete tmpValue.ellipse
      delete tmpValue.completed
      delete tmpValue.anchors
      tmpValue.type = 'Ellipse'
    }

    if (value.type == 'Angle') {
      // Validate required properties for Angle
      if (!value.angle || !value.angle.vertex || !value.angle.armPoint1 || !value.angle.armPoint2) {
        continue
      }

      const angle = value.angle
      const vertex = layer.findOne(`#${value.id}vertex`)
      const armPoint1 = layer.findOne(`#${value.id}armPoint1`)
      const armPoint2 = layer.findOne(`#${value.id}armPoint2`)
      const tmp1 = getRelativePosition(angle.vertex.x, angle.vertex.y, imageSize.width, imageSize.height)
      tmpValue.vertex = { x: tmp1[0], y: tmp1[1] }
      const tmp2 = getRelativePosition(angle.armPoint1.x, angle.armPoint1.y, imageSize.width, imageSize.height)
      tmpValue.armPoint1 = { x: tmp2[0], y: tmp2[1] }
      const tmp3 = getRelativePosition(angle.armPoint2.x, angle.armPoint2.y, imageSize.width, imageSize.height)
      tmpValue.armPoint2 = { x: tmp3[0], y: tmp3[1] }
      delete tmpValue.angle
      delete tmpValue.id
      tmpValue.type = 'Angle'
    }
    // tmpValue["brightness"] = annotationVisualization.brightness;
    // tmpValue["contrast"] = annotationVisualization.contrast;

    data.taxonomies.push({
      taxonomyTypeId: tmpValue.parentId ? tmpValue.parentId : key,
      isChild: !!tmpValue.parentId,
      taxonomyData: tmpValue,
      taxonomiesAnnotationsInDLSessionsId: tmpValue.taxonomiesAnnotationsInDLSessionsId ||
        fetchTaxonomies.value?.taxonomy?.typesInTaxonomies?.find(
          t => t.id === tmpValue.parentId
        )?.taxonomiesAnnotationsInDLSessionsId

    })
  }

  if (fetchTaxonomies.value && Array.isArray(fetchTaxonomies.value)) {
    const sessionId = route.params.id.toString()
    const currentImageId = currentImage.value?.id

    // Extract all valid child taxonomy data with their parent type info
    const childTaxonomyEntries = fetchTaxonomies.value
      .flatMap(item => {
        const typesInTaxonomies = item?.taxonomy?.typesInTaxonomies
        if (!Array.isArray(typesInTaxonomies)) return []

        return typesInTaxonomies
          .filter(val => val?.id && Array.isArray(val.ChildTaxonomy))
          .flatMap(val => {
            const childTaxonomies = val.ChildTaxonomy || []

            return childTaxonomies
              .filter(child => Array.isArray(child?.ChildTaxonomyDataInDLSessions) && child.ChildTaxonomyDataInDLSessions.length > 0)
              .flatMap(child => {
                const childDataArray = child.ChildTaxonomyDataInDLSessions || []

                return childDataArray
                  .filter(childData => {
                    // Validate childData has required properties
                    if (!childData?.id || !childData.extractedResourceId || !childData.dLSessionId) {
                      return false
                    }

                    // Validate taxonomyType exists
                    if (!childData.taxonomyType?.name) {
                      return false
                    }

                    // Only include if not already in taxonomyCoordinates and matches current image/session
                    return !taxonomyCoordinates.value[childData.id]
                      && childData.extractedResourceId === currentImageId
                      && childData.dLSessionId === sessionId
                  })
                  .map(childData => ({
                    childData,
                    parentType: val
                  }))
              })
          })
      })

    // Add valid child taxonomies to data.taxonomies
    childTaxonomyEntries.forEach(({ childData, parentType }) => {
      data.taxonomies.push({
        taxonomyTypeId: parentType.id,
        taxonomiesAnnotationsInDLSessionsId: parentType.taxonomiesAnnotationsInDLSessionsId,
        isChild: true,
        taxonomyData: {
          unAnnotated: true,
          name: childData.name,
          type: childData.taxonomyType.name,
          parentId: parentType.id,
          typesInTaxonomyId: parentType.id,
          extractedResourceId: childData.extractedResourceId,
          dLSessionId: childData.dLSessionId,
        },
      })
    })
  }

  try {
    // IMPORTANT FIX: Delete pending deletions from database before saving new annotations
    // This handles the case where user clicked "Change the older one" - we need to delete old ones now
    if (pendingDeletionIds.value.length > 0) {
      try {
        const deleteData: DeleteSingleTaxonomyDataInput = {
          dLSessionId: route.params.id.toString(),
          extractedResourceId: currentImage.value!.id,
          taxonomyId: pendingDeletionIds.value,
        }
        await $client.dLSession.deleteSingleTaxonomyData.mutate(deleteData)
        // Clear pending deletions after successful deletion
        pendingDeletionIds.value = []
      } catch (deleteError) {
        console.error('Error deleting pending annotations:', deleteError)
        // Continue with save even if deletion fails
      }
    }
    
    await $client.dLSession.updateTaxonomyData.mutate(data)
    notification.success({ content: 'Saved Successfully', duration: 5000 })
    // Mark that annotations have been saved in this session
    hasSavedAnnotationsInCurrentSession.value = true
    // Clear undo/redo stacks after successful save
    undoStack.value = []
    redoStack.value = []
    markupUndoStack.value = []
    markupRedoStack.value = []
    markupGridUndoStack.value = []
    markupGridRedoStack.value = []
    // Reset initial state after save - current state is now the baseline
    initialUndoStackLength.value = 0
    initialMarkupUndoStackLength.value = 0
    initialMarkupGridUndoStackLength.value = 0
    // Mark all saved annotations as stored - mutate existing objects, don't recreate
    Object.keys(taxonomyCoordinates.value).forEach(key => {
      if (taxonomyCoordinates.value[key]) {
        taxonomyCoordinates.value[key].isStored = true
      }
    })
    unhideAllTaxonomies()
    unlockAllTaxonomies()
    // Fully clear canvas/state before reloading from server to avoid duplicates
    clearCanvasAndState()
    await getTaxonomyData(currentImage.value!.id, ++latestRequestId)
    selectedTaxonomyType.value = {}

  }
  catch (error: any) {
    console.log('error', error)
    notification.error({ content: 'Error in Submitting', duration: 5000 })
  }
}

function unhideAllTaxonomies() {
      // Reset all visibility states after saving
    selectedItems.value = []
    selectedGroups.value = []

    // Reset all Konva groups to visible
    if (layer) {
      layer.find('Group').forEach((group: Konva.Group) => {
        if (group.id().includes('group')) {
          group.visible(true)
          group.opacity(1)
        }
      })
      layer.batchDraw()
    }

    // Reset the visibility states map
    visibilityStates.clear()
    initialVisibilitySet.value = false
}

function unlockAllTaxonomies() {
  lockedItems.value = []
  lockedGroups.value = []

  if (layer) {
    Object.keys(taxonomyCoordinates.value).forEach((taxonomyId) => {
      setAnnotationDraggable(taxonomyId, true)
    })
    layer.batchDraw()
  }

  lockStates.clear()
  initialLockSet.value = false
}

async function deleteTaxonomyMarking(type: object) {
  // Only delete the specific annotation, not its children
  const taxonomyId = type.id

  // Remove the annotation group from canvas
  const group = layer!.findOne(g => g.attrs.id === `${taxonomyId}group`)
  if (group)
    group.remove()

  if (taxonomyCoordinates.value[taxonomyId]?.isStored === false) {
    // Delete from local state only
    if (taxonomyCoordinates.value[taxonomyId])
      delete taxonomyCoordinates.value[taxonomyId]

    // For local-only deletions, clean up related states
    removeAnnotationById(taxonomyId)

    // Remove any entries from undo/redo stacks for deleted annotation
    // This ensures the deletion is not tracked in undo/redo history
    redoStack.value = redoStack.value.filter((entry: AnnotationHistoryEntry) => entry.id !== taxonomyId)
    undoStack.value = undoStack.value.filter((entry: AnnotationHistoryEntry) => entry.id !== taxonomyId)

    // Clear selectedTaxonomyType if it matches the deleted one to prevent redrawing on canvas click
    if (selectedTaxonomyType.value.id === taxonomyId) {
      selectedTaxonomyType.value = {}
    }
  }
  else {
    // Delete from server
    const data: DeleteSingleTaxonomyDataInput = {
      dLSessionId: route.params.id.toString(),
      extractedResourceId: currentImage.value!.id,
      taxonomyId: [taxonomyId], // Only delete this specific annotation
    }
    try {
      await $client.dLSession.deleteSingleTaxonomyData.mutate(data)
      notification.success({ content: 'Deleted Successfully', duration: 3000 })

      // Remove from local state without full refresh
      if (taxonomyCoordinates.value[taxonomyId]) {
        delete taxonomyCoordinates.value[taxonomyId]
      }

      // Clean up related states
      removeAnnotationById(taxonomyId)

      // Remove any entries from undo/redo stacks for deleted annotation
      redoStack.value = redoStack.value.filter((entry: AnnotationHistoryEntry) => entry.id !== taxonomyId)
      undoStack.value = undoStack.value.filter((entry: AnnotationHistoryEntry) => entry.id !== taxonomyId)

      // Clear selectedTaxonomyType if it matches the deleted one to prevent redrawing on canvas click
      if (selectedTaxonomyType.value.id === taxonomyId) {
        selectedTaxonomyType.value = {}
      }

      // Redraw layer to reflect changes
      if (layer) {
        layer.batchDraw()
      }

    }
    catch (error: any) {
      notification.error({ content: 'Error in Submitting', duration: 5000 })
    }
  }
}

// Function to find taxonomy data by ID from fetchTaxonomies
function findTaxonomyDataById(id: string): any {
  if (!fetchTaxonomies.value || !Array.isArray(fetchTaxonomies.value)) {
    return null
  }

  for (const taxonomy of fetchTaxonomies.value) {
    // Check parent items
    const parentItem = taxonomy.taxonomy?.typesInTaxonomies?.find((item: any) => item.id === id)
    if (parentItem) {
      return parentItem
    }

    // Check child items
    for (const item of taxonomy.taxonomy?.typesInTaxonomies || []) {
      if (item.ChildTaxonomy) {
        for (const child of item.ChildTaxonomy) {
          const childData = child.ChildTaxonomyDataInDLSessions?.find((childData: any) => childData.id === id)
          if (childData) {
            return childData
          }
        }
      }
    }
  }
  return null
}
// Function to delete only underlined (clicked) annotation marks
async function deleteSelectedAnnotationMarks() {
  // Underlined items are tracked in isClickedItems
  const clickedItemIds = (isClickedItems.value || []).filter((id: string) => !!taxonomyCoordinates.value[id])

  if (clickedItemIds.length === 0) {
    showDeleteConfirmationModal.value = false
    return
  }

  const idsToDelete: string[] = []
  const storedIds: string[] = []
  const unstoredIds: string[] = []

  // Only delete the clicked parent items, not their children (matching manual deletion behavior)
  for (const selectedId of clickedItemIds) {
    // Only include the parent ID, not child IDs
    idsToDelete.push(selectedId)

    // Categorize by stored/unstored
    if (taxonomyCoordinates.value[selectedId]?.isStored === false || taxonomyCoordinates.value[selectedId]?.isStored === undefined) {
      unstoredIds.push(selectedId)
    } else {
      storedIds.push(selectedId)
    }

  }

  // Delete unstored items from local state only
  if (unstoredIds.length > 0) {
    unstoredIds.forEach((id) => {
      const group = layer!.findOne(g => g.attrs.id === `${id}group`)
      if (group) {
        group.remove()
      }
      if (taxonomyCoordinates.value[id]) {
        delete taxonomyCoordinates.value[id]
      }
    })

    // Remove underline state for deleted items
    isClickedItems.value = (isClickedItems.value || []).filter((id: string) => !unstoredIds.includes(id))

    // Remove any entries from undo/redo stacks for deleted annotations
    redoStack.value = redoStack.value.filter((entry: AnnotationHistoryEntry) => !unstoredIds.includes(entry.id))
    undoStack.value = undoStack.value.filter((entry: AnnotationHistoryEntry) => !unstoredIds.includes(entry.id))

    layer!.batchDraw()
  }

  // Delete stored items from server
  if (storedIds.length > 0) {
    const extractedResourceId = currentImage.value?.id || props.resourceData.id
    const data: DeleteSingleTaxonomyDataInput = {
      dLSessionId: route.params.id.toString(),
      extractedResourceId: extractedResourceId,
      taxonomyId: storedIds,
    }
    try {
      await $client.dLSession.deleteSingleTaxonomyData.mutate(data)
      notification.success({
        content: `${idsToDelete.length} annotation mark(s) deleted successfully`,
        duration: 3000
      })

      // Remove from local state without full refresh
      storedIds.forEach((id) => {
        if (taxonomyCoordinates.value[id]) {
          delete taxonomyCoordinates.value[id]
        }
        // Clean up related states for each deleted item
        removeAnnotationById(id)
      })

      // Remove any entries from undo/redo stacks for deleted annotations
      redoStack.value = redoStack.value.filter((entry: AnnotationHistoryEntry) => !storedIds.includes(entry.id))
      undoStack.value = undoStack.value.filter((entry: AnnotationHistoryEntry) => !storedIds.includes(entry.id))

      // Remove underline state for deleted items
      isClickedItems.value = (isClickedItems.value || []).filter((id: string) => !idsToDelete.includes(id))

      // Clear selectedTaxonomyType if it matches any deleted item to prevent redrawing on canvas click
      if (idsToDelete.includes(selectedTaxonomyType.value.id)) {
        selectedTaxonomyType.value = {}
      }

      // Redraw layer to reflect changes
      if (layer) {
        layer.batchDraw()
      }

    }
    catch (error: any) {
      notification.error({ content: 'Error in deleting annotation marks', duration: 5000 })
    }
  } else if (unstoredIds.length === 0) {
    // No items to delete (shouldn't happen, but handle gracefully)
    notification.success({
      content: `${idsToDelete.length} annotation mark(s) deleted successfully`,
      duration: 3000
    })
  }

  // For unstored items, also clear selectedTaxonomyType if it matches any deleted item
  if (unstoredIds.length > 0 && unstoredIds.includes(selectedTaxonomyType.value.id)) {
    selectedTaxonomyType.value = {}
  }

  // Close modal
  isClickedItems.value = []
  selectedItems.value = []
  showDeleteConfirmationModal.value = false
}

function getChildTypeIds(type: any): any {
  if (!Array.isArray(type))
    return []

  return type.reduce((accumulator, item) => {
    const childIds = item.ChildTaxonomyDataInDLSessions.filter((child: any) => child.extractedResourceId === currentImage.value.id).map((child: any) => child.id)
    return accumulator.concat(childIds)
  }, [] as string[])
}

function getUnAnnotatedIds(type: any): any {
  if (!Array.isArray(type))
    return []

  return type.filter(item => item.ChildTaxonomyDataInDLSessions.length === 0).map(item => item.id)
}

async function deleteAllTaxonomyMarking(types: object) {
  let errorCount = 0
  const finalData = []
  for (const type of types.taxonomy.typesInTaxonomies) {
    const idsToDelete = [type.id, ...getChildTypeIds(type?.ChildTaxonomy)]
    idsToDelete.forEach((id) => {
      // const group = layer.findOne(`#${id}group`);
      const group = layer!.findOne(g => g.attrs.id === `${id}group`)

      if (group)
        group.remove()
    })

    for (const typeId of idsToDelete) {
      if (taxonomyCoordinates.value && taxonomyCoordinates.value.hasOwnProperty(typeId)) {
        if (!taxonomyCoordinates.value[typeId].isStored) {
          if (Object.keys(taxonomyCoordinates.value).includes(typeId))
            delete taxonomyCoordinates.value[typeId]
        }
        else {
          const data: DeleteSingleTaxonomyDataInput = {
            dLSessionId: route.params.id.toString(),
            extractedResourceId: props.resourceData.id,
            taxonomyId: typeId,
          }

          finalData.push(data)
          if (Object.keys(taxonomyCoordinates.value).includes(typeId))
            delete taxonomyCoordinates.value[typeId]
        }
      }
    }
  }
  // Clear the entire undo/redo stack when deleting all annotations
  // This ensures the deletions are not tracked in undo/redo history
  // and since all annotations are deleted, there's nothing to undo/redo anyway
  redoStack.value = []
  undoStack.value = []

  try {
    if (!finalData.length)
      return

    const data = {
      dLSessionId: finalData[0].dLSessionId,
      extractedResourceId: finalData[0].extractedResourceId,
      taxonomyId: finalData.map(d => d.taxonomyId),
    }
    await $client.dLSession.deleteSingleTaxonomyData.mutate(data);
    
    // Clean up all deleted items from local state without full refresh
    const allDeletedIds = finalData.map(d => d.taxonomyId).flat()
    allDeletedIds.forEach((id) => {
      removeAnnotationById(id)
    })

    // Clear selectedTaxonomyType if it matches any deleted item
    if (allDeletedIds.includes(selectedTaxonomyType.value.id)) {
      selectedTaxonomyType.value = {}
    }

    // Redraw layer to reflect changes
    if (layer) {
      layer.batchDraw()
    }
  }
  catch (error) {
    errorCount++
  }
  if (errorCount === 0)
    notification.success({ content: 'All Taxonomies deleted successfully', duration: 3000 })
  else
    notification.error({ content: 'Error in deleting all taxonomies', duration: 5000 })
}

async function copyExtractedResourcesId(resourceId: string) {
  try {
    await navigator.clipboard.writeText(resourceId)
    notification.success({ content: 'ID Copied to Clipboard', duration: 1000 })
  }
  catch (err) {
    notification.error({ content: 'Unable to copy to clipboard', duration: 1000 })
  }
}

const selectedImage = ref(null)
const flipCount = ref(0)

async function rotateImage(type: string, reset?: boolean) {
  const image: any = type == 'main' ? gridContainer.value : annotationContainer.value
  if (!image)
    return

  const currentRotation = (image.dataset.rotation || 0) % 360
  const newRotation = currentRotation + 90
  if (type !== 'main') {
    const isRotated = newRotation === 90 || newRotation === 270
    image.style.aspectRatio = isRotated ? '1' : 'auto'
    image.style.width = isRotated ? '55%' : '70%'
  }

  image.style.transform = `rotate(${reset ? 0 : newRotation}deg)`
  image.dataset.rotation = newRotation
}

async function flipImage(type: string, reset?: boolean) {
  const image: any = type == 'main' ? gridContainer.value : annotationContainer.value
  if (!image)
    return

  const currentScaleX = (image.dataset?.flipX || 1)
  const newScaleX = currentScaleX === 1 ? -1 : 1
  if (type !== 'main')
    image.style.width = '70%'

  image.style.transform = `scaleX(${reset ? 1 : newScaleX})`
  image.dataset.flipX = newScaleX
  flipCount.value++

  if (flipCount.value >= 2 || reset) {
    flipCount.value = 0
    image.dataset.flipX = ''
  }
}

// Define a type for a point
function calculateMeasurementDistance(
  points: Array<number>,
  width: number,
  height: number,
  pixelResolution: number,
) {
  const a = (points[0] - points[2]) * width
  const b = (points[1] - points[3]) * height
  const c = Math.sqrt(a * a + b * b)
  return c * pixelResolution
}

function calculateEllipseCircumference(leftRightMM: number, topBottomMM: number) {
  const a = leftRightMM / 2
  const b = topBottomMM / 2
  const circumference = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))
  return circumference
}
let selectedItems = ref([])
let selectedGroups = ref([])
let lockedGroups = ref([])
// Computed property for underlined (clicked) annotation marks count
const clickedAnnotationMarksCount = computed(() => {
  return (isClickedItems.value || []).filter((id: string) => !!taxonomyCoordinates.value[id]).length
})

function isSelected(item) {
  return selectedItems.value.includes(item.id)
}

function isLocked(item) {
  return lockedItems.value.includes(item.id)
}

function isGroupSelected(groupName) {
  return selectedGroups.value.includes(groupName)
}

function isGroupLocked(groupName) {
  return lockedGroups.value.includes(groupName)
}

async function removeDuplicate(id) {
  if (id in taxonomyCoordinates.value)
    delete taxonomyCoordinates.value[id]
}

async function drawEllipse(drawValue, colorCode, hide?: boolean, parentId?: any, typesInTaxonomyId?: any) {
  const ellipse = drawValue.ellipse
  drawValue.x = ellipse.x()
  drawValue.y = ellipse.y()
  drawValue.radiusX = ellipse.radiusX()
  drawValue.radiusY = ellipse.radiusY()
  startEllipse(
    drawValue.x,
    drawValue.y,
    drawValue.id,
    drawValue.name,
    drawValue.abbreviation, // Add abbreviation parameter
    drawValue.type,
    colorCode,
    drawValue.index,
    drawValue.radiusX,
    drawValue.radiusY,
    true,
    hide,
    parentId,
    typesInTaxonomyId
  )
}

async function drawMeasurement(drawValue, colorCode, parentId?, typesInTaxonomyId?) {
  addMeasurementPoint(drawValue.start.x, drawValue.start.y, drawValue, drawValue.id, drawValue.name,drawValue.abbreviation, drawValue.type, colorCode, drawValue.index, drawValue.isStored, parentId, typesInTaxonomyId)
  addMeasurementPoint(drawValue.end.x, drawValue.end.y, drawValue, drawValue.id, drawValue.name,drawValue.abbreviation, drawValue.type, colorCode, drawValue.index, drawValue.isStored, parentId, typesInTaxonomyId)
}

async function drawAngle(drawValue, colorCode, parentId?: any, typesInTaxonomyId?: any) {
  currentAnglePoints.value = [
    { x: drawValue.angle.vertex.x, y: drawValue.angle.vertex.y },
    { x: drawValue.angle.armPoint1.x, y: drawValue.angle.armPoint1.y },
    { x: drawValue.angle.armPoint2.x, y: drawValue.angle.armPoint2.y },
  ]
  drawTemporaryLine({ x: drawValue.angle.vertex.x, y: drawValue.angle.vertex.y }, 'tempLine1')
  drawTemporaryLine({ x: drawValue.angle.armPoint1.x, y: drawValue.angle.armPoint1.y }, 'tempLine2')
  finalizeAngle(drawValue.id, drawValue.name,drawValue.abbreviation, drawValue.type, colorCode, drawValue.index, true, parentId, typesInTaxonomyId)
}

// Add a type for managing visibility state
interface VisibilityState {
  visible: boolean
  group: Konva.Group | null
  parentId?: string // Track parent relationship
}

// Add a type for managing lock state
interface LockState {
  locked: boolean
  group: Konva.Group | null
  parentId?: string // Track parent relationship
}

// Create a map to track visibility states
const visibilityStates = reactive(new Map<string, VisibilityState>())
const initialVisibilitySet = ref(false)

// Create a map to track lock states
const lockStates = reactive(new Map<string, LockState>())
const initialLockSet = ref(false)
let lockedItems = ref([])
/**
 * Toggles visibility of taxonomy items using opacity/visible properties
 */
async function toggleSelectedItem(item: any, groupItems: any[], parentData?: any) {
  const idsToToggle = [
    item.id,
    ...getChildTypeIds(item.ChildTaxonomy),
    ...getUnAnnotatedIds(item.ChildTaxonomy),
  ]

  const isParentToggle = !item.parentId

  // Initialize visibility states if not already done
  if (!initialVisibilitySet.value) {
    idsToToggle.forEach((id) => {
      const group = layer!.findOne(g => g.attrs.id === `${id}group`) as Konva.Group
      if (group) {
        visibilityStates.set(id, {
          visible: true, // Set initial visibility to true
          group,
          parentId: item.parentId || null,
        })
        group.visible(true)
        group.opacity(1)
      }
    })
    initialVisibilitySet.value = true
  }

  // Get current visibility state of the toggled item
  const currentState = visibilityStates.get(item.id)
  const newVisibilityState = currentState ? !currentState.visible : false

  idsToToggle.forEach((id) => {
    const group = layer!.findOne(g => g.attrs.id === `${id}group`) as Konva.Group
    if (!group)
      return

    // Ensure state exists
    if (!visibilityStates.has(id)) {
      visibilityStates.set(id, {
        visible: true,
        group,
        parentId: item.parentId || null,
      })
    }

    const state = visibilityStates.get(id)!

    // Update visibility based on parent/child relationship
    if (isParentToggle || id === item.id) {
      state.visible = newVisibilityState
      group.visible(newVisibilityState)
      group.opacity(newVisibilityState ? 1 : 0)

      // Update selected items array
      const selectedIndex = selectedItems.value.indexOf(id)
      if (newVisibilityState && selectedIndex !== -1) {
        selectedItems.value.splice(selectedIndex, 1)

        const drawValue = taxonomyCoordinates.value[id]
        if (drawValue)
          updateAppearance(drawValue, item, parentData)
      }
      else if (!newVisibilityState && selectedIndex === -1) {
        selectedItems.value.push(id)
      }
    }
  })

  updateGroupSelectionState(item, groupItems)
  layer!.batchDraw()
}

/**
 * Toggles lock state of taxonomy items to prevent editing/moving
 * Only locks the specific annotation, not its children
 */
async function toggleLockedItem(item: any, groupItems: any[], parentData?: any) {
  // Only toggle lock for the specific item, not its children
  const taxonomyId = item.id

  // Get the group for this specific annotation
  const group = layer!.findOne(g => g.attrs.id === `${taxonomyId}group`) as Konva.Group
  if (!group)
    return

  // Ensure state exists
  if (!lockStates.has(taxonomyId)) {
    lockStates.set(taxonomyId, {
      locked: false, // Set initial lock state to false (unlocked)
      group,
      parentId: item.parentId || null,
    })
    // Ensure annotation is draggable initially
    setAnnotationDraggable(taxonomyId, true)
  }

  // Get current lock state of the toggled item
  const currentState = lockStates.get(taxonomyId)!
  const newLockState = !currentState.locked

  // Update lock state only for this specific annotation
  currentState.locked = newLockState

  // Set draggable based on lock state
  setAnnotationDraggable(taxonomyId, !newLockState)

  // Update locked items array
  const lockedIndex = lockedItems.value.indexOf(taxonomyId)
  if (newLockState && lockedIndex === -1) {
    lockedItems.value.push(taxonomyId)
  }
  else if (!newLockState && lockedIndex !== -1) {
    lockedItems.value.splice(lockedIndex, 1)
  }

  // Update the specific group's lock state
  updateGroupLockStateCheck(item, groupItems)
  const updatedGroupKeys = new Set<string>()
  fetchTaxonomies.value.forEach((taxonomy) => {
    const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies
    if (typesInTaxonomies && Array.isArray(typesInTaxonomies) && typesInTaxonomies.length > 0) {
      const groupKey = typesInTaxonomies.map((t: any) => t.id).sort().join(',')

      if (!updatedGroupKeys.has(groupKey)) {
        const firstItem = typesInTaxonomies[0]
        if (firstItem) {
          updateGroupLockStateCheck(firstItem, typesInTaxonomies)
          updatedGroupKeys.add(groupKey)
        }
      }
    }
  })

  layer!.batchDraw()
}

function setAnnotationDraggable(taxonomyId: string, draggable: boolean) {
  const drawValue = taxonomyCoordinates.value[taxonomyId]
  if (!drawValue) return

  const group = layer!.findOne(g => g.attrs.id === `${taxonomyId}group`) as Konva.Group
  if (!group) return

  const shouldListen = draggable

  // Set listening and draggable on main group
  group.listening(shouldListen)

  // Type flags for special behavior
  const isAngle = drawValue.type === 'Angle'
  const isMeasurement = drawValue.type === 'Measurement'
  const isBoundingBox = drawValue.type === 'Bounding Box' || drawValue.type === 'Non-Rotational Bounding Box'
  const isEllipse = drawValue.type === 'Ellipse'

  // Special handling for Angle: Only individual points should be draggable, NOT the group
  // The group should NOT be draggable to avoid conflicts with individual point dragging
  if (isAngle) {
    group.draggable(false)  // Angle group should never be draggable
  }
  // Special handling for Measurement: parent group should NOT be draggable
  // to avoid stealing drag events from the endpoint crosshairs. Only the
  // crosshair groups and their rotation anchors should be draggable.
  else if (isMeasurement) {
    group.draggable(false)
  }
  // CRITICAL: Bounding Box & Ellipse must NEVER be draggable at the group level.
  // Their geometry persistence depends on rect/anchors/ellipse drag handlers mutating taxonomyCoordinates.
  // If the group is draggable, users can move the visual shape without triggering those handlers,
  // causing the "old position saved on 2nd cycle" bug.
  else if (isBoundingBox || isEllipse) {
    group.draggable(false)
  }
  else {
    group.draggable(draggable)
  }

  // Special handling for Landmark and Crossbar: Only the group should be draggable
  // Children (circle, crosshair, label) should NOT be draggable independently
  // This ensures dragging any part moves the entire annotation together
  const isLandmarkOrCrossbar = drawValue.type === 'Landmark' || drawValue.type === 'Crossbar'

  // Deep recursive function to set listening on ALL nested nodes
  // This ensures we catch every shape, including deeply nested ones
  const setNodeProperties = (node: any) => {
    if (!node) return

    // Skip Text nodes - keep them listening for unlock clicks but never draggable
    if (node instanceof Konva.Text) {
      node.listening(true)
      node.draggable(false)  // Explicitly ensure labels are never draggable
      return
    }

    // For landmarks and crossbars, skip making children draggable
    // Only the group should be draggable, not individual shapes
    if (isLandmarkOrCrossbar) {
      // Keep rotation anchor draggable for crossbars (it has name 'rotation')
      if (node.name() === 'rotation') {
        node.listening(shouldListen)
        node.draggable(draggable)
      } else {
        // All other children (circle, crosshair, lines) should NOT be draggable
        node.listening(shouldListen)
        node.draggable(false)  // Children move with the group, not independently
      }
    } else if (isAngle) {
      // Special handling for Angle: Only the draggable points should be draggable
      // Lines and text should NOT be draggable (they update via updateAngle function)
      node.listening(shouldListen)

      // Check if this is a draggable point (vertex, armPoint1, or armPoint2)
      const nodeId = node.id()
      const isDraggablePoint = nodeId && (
        nodeId.includes('vertex') ||
        nodeId.includes('armPoint1') ||
        nodeId.includes('armPoint2')
      )

      // Only draggable points (Circles with specific IDs) should be draggable
      if (isDraggablePoint && node instanceof Konva.Circle) {
        node.draggable(draggable)
      } else {
        // Lines (with name 'angleLine') and other shapes should NOT be draggable
        node.draggable(false)
      }
    } else if (isMeasurement) {
      // Measurement: Only crosshair groups (start/end) and their rotation anchors
      // should be draggable. The parent group, line, and label should not be
      // directly draggable; they move when endpoints move.
      node.listening(shouldListen)

      const nodeId = typeof node.id === 'function' ? node.id() : ''
      const isCrosshairGroup =
        node instanceof Konva.Group &&
        typeof nodeId === 'string' &&
        (nodeId.endsWith('_start') || nodeId.endsWith('_end'))

      const isRotationAnchor =
        typeof node.name === 'function' &&
        node.name() === 'rotation'

      if (isCrosshairGroup || isRotationAnchor) {
        node.draggable(draggable)
      } else {
        node.draggable(false)
      }
    } else {
      // For other annotation types (Bounding Box, Ellipse, etc.), set normally
      node.listening(shouldListen)

      // Set draggable on shapes and groups
      if (node instanceof Konva.Shape || node instanceof Konva.Group) {
        node.draggable(draggable)
      }
    }

    // Recursively handle ALL children - this is critical for deep nesting
    if (node instanceof Konva.Group && node.getChildren) {
      node.getChildren().forEach((child: any) => {
        setNodeProperties(child)
      })
    }
  }

  // Handle direct references from drawValue (more efficient than find)
  // These are the main draggable shapes stored in taxonomyCoordinates
  if (drawValue.rect) {
    drawValue.rect.draggable(draggable)
    drawValue.rect.listening(shouldListen)
  }

  if (drawValue.ellipse) {
    drawValue.ellipse.draggable(draggable)
    drawValue.ellipse.listening(shouldListen)
  }

  // Handle anchors directly from drawValue.anchors object
  if (drawValue.anchors) {
    Object.values(drawValue.anchors).forEach((anchor: any) => {
      if (anchor) {
        anchor.draggable(draggable)
        anchor.listening(shouldListen)
      }
    })
  }

  // Apply properties recursively to ALL children with deep traversal
  // This ensures we catch EVERY shape, including deeply nested ones
  // The recursive function handles all other shapes (circles, lines, nested groups, etc.)
  group.getChildren().forEach((child: any) => {
    setNodeProperties(child)
  })

  // Ensure Text labels are always listening for unlock clicks but never draggable
  group.find('Text').forEach((text: Konva.Text) => {
    text.listening(true)
    text.draggable(false)  // Explicitly ensure labels are never draggable
  })

  // For landmarks and crossbars, ensure circle and crosshair are not draggable
  if (isLandmarkOrCrossbar) {
    // Find circle (regular landmark)
    group.find('.landmark').forEach((circle: any) => {
      circle.draggable(false)
      circle.listening(shouldListen)
    })
    // Find crosshair group (crossbar)
    group.find('.measurementCrosshair').forEach((line: any) => {
      line.draggable(false)
      line.listening(shouldListen)
    })
    // Find crosshair group itself
    const crosshairGroup = group.findOne((node: any) => node.id() === taxonomyId)
    if (crosshairGroup && crosshairGroup instanceof Konva.Group) {
      crosshairGroup.draggable(false)
      crosshairGroup.listening(shouldListen)
    }
  }

  // For Angle annotations, ensure lines are not draggable
  if (isAngle) {
    // Find angle lines by their IDs
    const line1 = group.findOne(`#${taxonomyId}angleline1`)
    const line2 = group.findOne(`#${taxonomyId}angleline2`)
    if (line1) {
      line1.draggable(false)
      line1.listening(shouldListen)
    }
    if (line2) {
      line2.draggable(false)
      line2.listening(shouldListen)
    }
  }

  layer!.batchDraw()
}

/**
 * Updates the appearance of an item based on its type
 */
function updateAppearance(drawValue: any, item: any, parentData?: any) {

  const colorCode = item.colorCode
                   || item.typesInTaxonomy?.colorCode
                   || parentData?.colorCode
                   || item.taxonomiesAnnotationsInDLSessions.annotation.colorCode

  const group = visibilityStates.get(drawValue.id)?.group
  if (!group)
    return

  // Update appearance based on type without redrawing
  switch (drawValue.type) {
    case 'Landmark':
      updateLandmarkAppearance(group, colorCode)
      break
    case 'Crossbar':
      updateLandmarkAppearance(group, colorCode)
      break
    case 'Measurement':
      updateMeasurementAppearance(group, colorCode)
      break
    case 'Bounding Box':
    case 'Non-Rotational Bounding Box':
      updateBoundingBoxAppearance(group, colorCode)
      break
    case 'Ellipse':
      updateEllipseAppearance(group, colorCode)
      break
    case 'Angle':
      updateAngleAppearance(group, colorCode)
      break
  }
}

/**
 * Updates group selection state
 */
function updateGroupSelectionState(item: any, groupItems: any[]) {
  const groupItemIds = groupItems.map(item => item.id)
  const childTypeIds = groupItems.flatMap(item => getChildTypeIds(item.ChildTaxonomy))
  const allGroupItemIds = [
    ...groupItemIds,
    ...childTypeIds,
    ...getUnAnnotatedIds(item.ChildTaxonomy),
  ]

  const filteredTaxonomy = Object.fromEntries(
    Object.entries(taxonomyCoordinates.value)
      .filter(([key, _]) => allGroupItemIds.includes(key)),
  )

  const allSelected = Object.keys(filteredTaxonomy)
    .every(parentId => selectedItems.value.includes(parentId))

  const groupIndex = selectedGroups.value.indexOf(groupItems)

  if (allSelected && groupIndex === -1)
    selectedGroups.value.push(groupItems)
  else if (!allSelected && groupIndex !== -1)
    selectedGroups.value.splice(groupIndex, 1)
}

/**
 * Initializes lock state for a new annotation and updates group lock state if needed
 * Ensures new annotations are always unlocked/unhidden, even if all existing annotations are locked
 * Updates ALL group lock states to ensure overall lock icon reflects correct state
 */
function initializeNewAnnotationLockState(taxonomyId: string, item?: any, groupItems?: any[]) {
  // Get the group for this annotation
  const group = layer!.findOne(g => g.attrs.id === `${taxonomyId}group`) as Konva.Group
  if (!group) return

  // CRITICAL: Initialize lock state as unlocked for new annotation
  // This must happen BEFORE any group state updates
  if (!lockStates.has(taxonomyId)) {
    lockStates.set(taxonomyId, {
      locked: false,
      group,
      parentId: item?.parentId || null,
    })
    setAnnotationDraggable(taxonomyId, true)
  } else {
    // Ensure it's unlocked even if state exists (defensive check)
    const state = lockStates.get(taxonomyId)!
    state.locked = false
    setAnnotationDraggable(taxonomyId, true)
  }

  // CRITICAL: Remove from locked items array if present
  // This ensures the new annotation is not considered locked
  const lockedIndex = lockedItems.value.indexOf(taxonomyId)
  if (lockedIndex !== -1) {
    lockedItems.value.splice(lockedIndex, 1)
  }

  // Initialize visibility state as visible (unhidden) for new annotation
  if (!visibilityStates.has(taxonomyId)) {
    visibilityStates.set(taxonomyId, {
      visible: true,
      group,
      parentId: item?.parentId || null,
    })
    group.visible(true)
    group.opacity(1)
  } else {
    // Ensure it's visible even if state exists
    const visibilityState = visibilityStates.get(taxonomyId)!
    visibilityState.visible = true
    group.visible(true)
    group.opacity(1)
  }

  // CRITICAL: Update ALL group lock states to ensure overall lock icon is correct
  // When a new unlocked annotation is added, we need to re-check ALL groups
  // because the overall lock icon state depends on whether ALL groups are locked
  const updatedGroupKeys = new Set<string>()

  fetchTaxonomies.value.forEach((taxonomy) => {
    const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies
    if (typesInTaxonomies && Array.isArray(typesInTaxonomies) && typesInTaxonomies.length > 0) {
      // Use a unique identifier to avoid processing the same group multiple times
      const groupKey = typesInTaxonomies.map((t: any) => t.id).sort().join(',')

      // Only process each group once
      if (!updatedGroupKeys.has(groupKey)) {
        const firstItem = typesInTaxonomies[0]
        if (firstItem) {
          // Update group lock state check - this will remove group from lockedGroups
          // if not all annotations in the group are locked
          updateGroupLockStateCheck(firstItem, typesInTaxonomies)
          updateGroupSelectionState(firstItem, typesInTaxonomies)
          updatedGroupKeys.add(groupKey)
        }
      }
    }
  })

  layer!.batchDraw()
}

/**
 * Updates group lock state based on individual item lock states
 */
function updateGroupLockStateCheck(item: any, groupItems: any[]) {
  const groupItemIds = groupItems.map(item => item.id)
  const childTypeIds = groupItems.flatMap(item => getChildTypeIds(item.ChildTaxonomy))
  const allGroupItemIds = [
    ...groupItemIds,
    ...childTypeIds,
    ...getUnAnnotatedIds(item.ChildTaxonomy),
  ]

  const filteredTaxonomy = Object.fromEntries(
    Object.entries(taxonomyCoordinates.value)
      .filter(([key, _]) => allGroupItemIds.includes(key)),
  )

  // CRITICAL FIX: If group has no annotations, it should not be considered locked
  // Array.every() returns true for empty arrays, which incorrectly marks empty groups as locked
  const taxonomyKeys = Object.keys(filteredTaxonomy)
  const allLocked = taxonomyKeys.length > 0 && 
    taxonomyKeys.every(parentId => lockedItems.value.includes(parentId))

  const groupIndex = lockedGroups.value.indexOf(groupItems)

  if (allLocked && groupIndex === -1)
    lockedGroups.value.push(groupItems)
  else if (!allLocked && groupIndex !== -1)
    lockedGroups.value.splice(groupIndex, 1)
}

// Helper functions for updating appearances
function updateLandmarkAppearance(group: Konva.Group, colorCode: string) {
  const circle = group.findOne('Circle')
  if (circle)
    circle.stroke(colorCode)
}

function updateMeasurementAppearance(group: Konva.Group, colorCode: string) {
  const line = group.findOne('Line')
  if (line)
    line.stroke(colorCode)
}

async function toggleGroupSelected(groupName) {
  if (!initialVisibilitySet.value) {
    // Initialize visibility states for all items in the group
    groupName.forEach((item) => {
      const idsToInitialize = [
        item.id,
        ...getChildTypeIds(item.ChildTaxonomy),
        ...getUnAnnotatedIds(item.ChildTaxonomy),
      ]

      idsToInitialize.forEach((id) => {
        const group = layer!.findOne(g => g.attrs.id === `${id}group`) as Konva.Group
        if (group) {
          visibilityStates.set(id, {
            visible: true,
            group,
            parentId: item.id !== id ? item.id : null,
          })
          group.visible(true)
          group.opacity(1)
        }
      })
    })
    initialVisibilitySet.value = true
  }

  const groupIndex = selectedGroups.value.indexOf(groupName)
  const newVisibilityState = groupIndex === -1

  if (!newVisibilityState) {
    // Show all items
    selectedGroups.value.splice(groupIndex, 1)
    selectedItems.value = selectedItems.value.filter((value) => {
      const allIds = groupName.flatMap(item => [
        item.id,
        ...getChildTypeIds(item.ChildTaxonomy),
        ...getUnAnnotatedIds(item.ChildTaxonomy),
      ])
      return !allIds.includes(value)
    })

    groupName.forEach(updateGroupVisibility(true))
  }
  else {
    // Hide all items
    selectedGroups.value.push(groupName)
    const newSelectedItems = groupName.flatMap(item => [
      item.id,
      ...getChildTypeIds(item.ChildTaxonomy),
      ...getUnAnnotatedIds(item.ChildTaxonomy),
    ]).filter(id => !selectedItems.value.includes(id))
    selectedItems.value.push(...newSelectedItems)

    groupName.forEach(updateGroupVisibility(false))
  }

  layer!.batchDraw()
}

function updateGroupVisibility(isVisible: boolean) {
  return (item: any) => {
    // Update main item
    const mainGroup = layer!.findOne(g => g.attrs.id === `${item.id}group`)
    if (mainGroup) {
      mainGroup.visible(isVisible)
      mainGroup.opacity(isVisible ? 1 : 0)
      if (visibilityStates.has(item.id))
        visibilityStates.get(item.id)!.visible = isVisible
    }

    // Update child items
    if (item.ChildTaxonomy) {
      item.ChildTaxonomy.forEach((child: any) => {
        const childId = child.ChildTaxonomyDataInDLSessions[0]?.id || child.id
        const childGroup = layer!.findOne(g => g.attrs.id === `${childId}group`)
        if (childGroup) {
          childGroup.visible(isVisible)
          childGroup.opacity(isVisible ? 1 : 0)
          if (visibilityStates.has(childId))
            visibilityStates.get(childId)!.visible = isVisible
        }
      })
    }
  }
}

function updateGroupLockState(isLocked: boolean) {
  return (item: any) => {
    const mainGroup = layer!.findOne(g => g.attrs.id === `${item.id}group`)
    if (mainGroup) {
      if (!lockStates.has(item.id)) {
        lockStates.set(item.id, {
          locked: false,
          group: mainGroup,
          parentId: item.parentId || null,
        })
        setAnnotationDraggable(item.id, true)
      }

      const state = lockStates.get(item.id)!
      state.locked = isLocked
      setAnnotationDraggable(item.id, !isLocked)

      const lockedIndex = lockedItems.value.indexOf(item.id)
      if (isLocked && lockedIndex === -1) {
        lockedItems.value.push(item.id)
      }
      else if (!isLocked && lockedIndex !== -1) {
        lockedItems.value.splice(lockedIndex, 1)
      }
    }

    if (item.ChildTaxonomy) {
      item.ChildTaxonomy.forEach((child: any) => {
        const childId = child.ChildTaxonomyDataInDLSessions[0]?.id || child.id
        const childGroup = layer!.findOne(g => g.attrs.id === `${childId}group`)
        if (childGroup) {
          // Ensure state exists
          if (!lockStates.has(childId)) {
            lockStates.set(childId, {
              locked: false,
              group: childGroup,
              parentId: item.id,
            })
            setAnnotationDraggable(childId, true)
          }

          const childState = lockStates.get(childId)!
          childState.locked = isLocked
          setAnnotationDraggable(childId, !isLocked)

          const childLockedIndex = lockedItems.value.indexOf(childId)
          if (isLocked && childLockedIndex === -1) {
            lockedItems.value.push(childId)
          }
          else if (!isLocked && childLockedIndex !== -1) {
            lockedItems.value.splice(childLockedIndex, 1)
          }
        }
      })
    }
  }
}

async function toggleGroupLocked(groupName: any[]) {
  if (!initialLockSet.value) {
    groupName.forEach((item) => {
      const idsToInitialize = [
        item.id,
        ...getChildTypeIds(item.ChildTaxonomy),
        ...getUnAnnotatedIds(item.ChildTaxonomy),
      ]

      idsToInitialize.forEach((id) => {
        const group = layer!.findOne(g => g.attrs.id === `${id}group`) as Konva.Group
        if (group) {
          lockStates.set(id, {
            locked: false,
            group,
            parentId: item.id !== id ? item.id : null,
          })
          setAnnotationDraggable(id, true)
        }
      })
    })
    initialLockSet.value = true
  }

  const groupIndex = lockedGroups.value.indexOf(groupName)
  const newLockState = groupIndex === -1

  if (!newLockState) {
    // Unlock all items
    lockedGroups.value.splice(groupIndex, 1)
    lockedItems.value = lockedItems.value.filter((value) => {
      const allIds = groupName.flatMap(item => [
        item.id,
        ...getChildTypeIds(item.ChildTaxonomy),
        ...getUnAnnotatedIds(item.ChildTaxonomy),
      ])
      return !allIds.includes(value)
    })

    groupName.forEach(updateGroupLockState(false))
  }
  else {
    lockedGroups.value.push(groupName)
    const newLockedItems = groupName.flatMap(item => [
      item.id,
      ...getChildTypeIds(item.ChildTaxonomy),
      ...getUnAnnotatedIds(item.ChildTaxonomy),
    ]).filter(id => !lockedItems.value.includes(id))
    lockedItems.value.push(...newLockedItems)

    groupName.forEach(updateGroupLockState(true))
  }

  layer!.batchDraw()
}



function navigateToNextImage() {
  if (!props.totalResourceData || props.totalResourceData.length === 0)
    return
  currentIndex.value = (currentIndex.value + 1) % props.totalResourceData.length
  emit('activeChoosenImage', currentImage.value)
  selectedItems.value = []
  selectedGroups.value = []
  isClickedItems.value = []
  Object.keys(taxonomyOpen).forEach(key => {
    taxonomyOpen[key] = true
  })
  openTaxonomyMappingModel(currentImage.value)
}

function navigateToPreviousImage() {
  if (!props.totalResourceData || props.totalResourceData.length === 0)
    return
  currentIndex.value = (currentIndex.value - 1 + props.totalResourceData.length) % props.totalResourceData.length
  emit('activeChoosenImage', currentImage.value)
  selectedItems.value = []
  selectedGroups.value = []
  isClickedItems.value = []
  Object.keys(taxonomyOpen).forEach(key => {
    taxonomyOpen[key] = true
  })
  openTaxonomyMappingModel(currentImage.value)
}

function nextImage() {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true
    pendingAction.value = navigateToNextImage
  } else {
    navigateToNextImage()
  }
}

function previousImage() {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true
    pendingAction.value = navigateToPreviousImage
  } else {
    navigateToPreviousImage()
  }
}


function isPreviousButtonDisabled() {
  return currentIndex.value === 0
}
function isNextButtonDisabled() {
  return currentIndex.value === (props.totalResourceData ? props.totalResourceData?.length - 1 : 0)
}

function handleCopyAnnotationClick() {
  // Check if there are any unsaved annotations (isStored === false or undefined)
  const hasUnsavedAnnotations = Object.values(taxonomyCoordinates.value).some(
    (data: any) => data && (data.isStored === false || data.isStored === undefined)
  )
  
  if (hasUnsavedAnnotations) {
    notification.warning({ 
      content: 'Cannot copy annotations: Please save your annotations first before copying to another image.', 
      duration: 5000 
    })
    return
  }
  
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true
    pendingAction.value = () => {
      showCopyAnnotationModal.value = true
    }
  } else {
    showCopyAnnotationModal.value = true
  }
}

function copyToPreviousImage() {
  if (isPreviousButtonDisabled()) {
    notification.warning({ content: 'No previous image available', duration: 3000 })
    return
  }
 
  pendingCopyAction.value = 'previous'
  navigateToPreviousImageForCopy()
  showCopyAnnotationModal.value = false
}

function copyToNextImage() {
  if (isNextButtonDisabled()) {
    notification.warning({ content: 'No next image available', duration: 3000 })
    return
  }
 
  pendingCopyAction.value = 'next'
  navigateToNextImageForCopy()
  showCopyAnnotationModal.value = false
}

async function navigateToPreviousImageForCopy() {
  if (!props.totalResourceData || props.totalResourceData.length === 0)
    return
  const previousIndex = (currentIndex.value - 1 + props.totalResourceData.length) % props.totalResourceData.length
  await copyAnnotationsToImageIndex(previousIndex)
}

async function navigateToNextImageForCopy() {
  if (!props.totalResourceData || props.totalResourceData.length === 0)
    return
  // Capture the current index before any state changes to ensure we calculate correctly
  const sourceIndex = currentIndex.value
  // Calculate next index - ensure we don't go beyond the array bounds
  if (sourceIndex >= props.totalResourceData.length - 1) {
    notification.warning({ content: 'No next image available', duration: 3000 })
    return
  }
  const nextIndex = sourceIndex + 1
  await copyAnnotationsToImageIndex(nextIndex)
}

async function copyAnnotationsToImageIndex(targetIndex: number) {
  if (!props.totalResourceData || !currentImage.value) {
    notification.error({ content: 'Unable to copy annotations', duration: 3000 })
    return
  }

  if (targetIndex < 0 || targetIndex >= props.totalResourceData.length) {
    notification.error({ content: 'Invalid target image index', duration: 3000 })
    return
  }

  // Build annotation entries from current taxonomyCoordinates - ONLY include saved annotations
  const annotationEntries: AnnotationHistoryEntry[] = []
  const unsavedAnnotationCount: number[] = []
  
  for (const [taxonomyId, data] of Object.entries(taxonomyCoordinates.value)) {
    // Only copy annotations that are saved (isStored === true)
    if (data && data.isStored === true) {
      const entry = buildHistoryEntryFromTaxonomy(taxonomyId)
      if (entry) {
        annotationEntries.push(entry)
      }
    } else if (data && (data.isStored === false || data.isStored === undefined)) {
      // Track unsaved annotations
      unsavedAnnotationCount.push(1)
    }
  }
  
  // Check if there are unsaved annotations and prevent copying
  if (unsavedAnnotationCount.length > 0) {
    notification.warning({ 
      content: `Cannot copy annotations: Please save your annotations first. You have ${unsavedAnnotationCount.length} unsaved annotation(s).`, 
      duration: 5000 
    })
    pendingCopyAction.value = null
    showCopyAnnotationModal.value = false
    return
  }
  
  if (annotationEntries.length === 0) {
    notification.warning({ content: 'No saved annotations to copy', duration: 3000 })
    pendingCopyAction.value = null
    return
  }

  // Navigate to target image
  currentIndex.value = targetIndex
  emit('activeChoosenImage', currentImage.value)
  
  // Close copy annotation popover when navigating to new image
  showCopyAnnotationModal.value = false
  
  // Clear current selections
  selectedItems.value = []
  selectedGroups.value = []
  isClickedItems.value = []
  
  // Reset taxonomy open states
  Object.keys(taxonomyOpen).forEach(key => {
    taxonomyOpen[key] = true
  })
  
  // Reset saved annotations flag since copied annotations are not saved yet
  hasSavedAnnotationsInCurrentSession.value = false

  // Open taxonomy mapping modal for target image
  await openTaxonomyMappingModel(currentImage.value)

  // Robustly wait for existing annotations (if any) to be loaded for the target image.
  // On some environments (e.g. macOS / Safari) the previous fixed timeout wasn't always
  // enough, causing the confirmation modal to never appear even when annotations existed.
  const hasExistingAnnotations = await waitForExistingAnnotations()
  
  if (hasExistingAnnotations) {
    // Show confirmation modal and store entries for later use
    pendingCopyTargetIndex.value = targetIndex
    pendingCopyAnnotationEntries.value = annotationEntries
    showCopyAnnotationConfirmationModal.value = true
    return
  }

  // Proceed with copying if no existing annotations
  await proceedWithCopy(annotationEntries, targetIndex)
}

// Helper: wait until existing annotations (if any) are loaded into taxonomyCoordinates
// for the currently active image, with a bounded timeout to avoid hanging the UI.
async function waitForExistingAnnotations(maxWaitMs = 5000, checkIntervalMs = 200): Promise<boolean> {
  const start = Date.now()

  while (Date.now() - start < maxWaitMs) {
    await nextTick()

    if (Object.keys(taxonomyCoordinates.value).length > 0) {
      return true
    }

    await new Promise(resolve => setTimeout(resolve, checkIntervalMs))
  }

  // One last check in case annotations arrived just as we exited the loop
  return Object.keys(taxonomyCoordinates.value).length > 0
}

// Helper function to clean up fetchTaxonomies for current image
function cleanupFetchTaxonomiesForCurrentImage() {
  if (!fetchTaxonomies.value || !Array.isArray(fetchTaxonomies.value)) {
    return
  }

  const currentImageId = currentImage.value?.id
  const currentSessionId = route.params.id.toString()

  if (!currentImageId) {
    return
  }

  // Clean up child taxonomy entries for the current image
  for (const taxonomy of fetchTaxonomies.value) {
    const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies || []
    
    for (const parentType of typesInTaxonomies) {
      if (!parentType.ChildTaxonomy || !Array.isArray(parentType.ChildTaxonomy)) {
        continue
      }

      // Remove child taxonomy entries that match current image and session
      parentType.ChildTaxonomy = parentType.ChildTaxonomy.filter((child: any) => {
        // Keep children that don't match current image/session
        if (child.extractedResourceId !== currentImageId || child.dLSessionId !== currentSessionId) {
          return true
        }

        // For children matching current image/session, remove their session data
        // that matches current image, but keep the child if it has other session data
        if (child.ChildTaxonomyDataInDLSessions && Array.isArray(child.ChildTaxonomyDataInDLSessions)) {
          child.ChildTaxonomyDataInDLSessions = child.ChildTaxonomyDataInDLSessions.filter((session: any) => {
            return session.extractedResourceId !== currentImageId || session.dLSessionId !== currentSessionId
          })
          
          // If no session data remains, remove the child taxonomy entry
          return child.ChildTaxonomyDataInDLSessions.length > 0
        }

        // If no session data array, remove the child
        return false
      })
    }
  }
}

// Helper function to update fetchTaxonomies with copied child annotations
function updateFetchTaxonomiesWithCopiedChildren(copiedEntries: AnnotationHistoryEntry[]) {
  if (!fetchTaxonomies.value || !Array.isArray(fetchTaxonomies.value)) {
    return
  }

  // Process each copied entry
  for (const entry of copiedEntries) {
    // Check if this is a child annotation
    const isChildAnnotation = entry.parentId || 
      (entry.taxonomiesAnnotationsInDLSessionsId && 
       entry.typesInTaxonomyId && 
       entry.taxonomiesAnnotationsInDLSessionsId !== entry.typesInTaxonomyId)
    
    if (!isChildAnnotation) {
      continue // Skip parent annotations, only process children
    }

    // Find the parent in fetchTaxonomies
    const parentId = entry.typesInTaxonomyId || entry.parentId
    if (!parentId) {
      continue
    }

    // Check if annotation exists in taxonomyCoordinates (must exist to be displayed)
    const annotationData = taxonomyCoordinates.value[entry.id]
    if (!annotationData) {
      continue // Skip if annotation doesn't exist in coordinates
    }

    // Search through fetchTaxonomies to find the parent
    for (const taxonomy of fetchTaxonomies.value) {
      const typesInTaxonomies = taxonomy.taxonomy?.typesInTaxonomies || []
      const parentType = typesInTaxonomies.find((type: any) => type.id === parentId)
      
      if (!parentType) {
        continue
      }

      // Initialize ChildTaxonomy array if it doesn't exist
      if (!parentType.ChildTaxonomy) {
        parentType.ChildTaxonomy = []
      }

      // First, check if session data with this ID already exists anywhere in the parent's children
      let existingSessionData: any = null
      
      for (const child of parentType.ChildTaxonomy) {
        if (child.ChildTaxonomyDataInDLSessions) {
          const session = child.ChildTaxonomyDataInDLSessions.find((s: any) => s.id === entry.id)
          if (session) {
            existingSessionData = session
            break
          }
        }
      }

      // If session data already exists, skip adding duplicate
      if (existingSessionData) {
        continue
      }

      // Each child annotation should have its own child taxonomy entry
      // Check if a child taxonomy with this session ID already exists
      let childTaxonomy = parentType.ChildTaxonomy.find((child: any) => {
        return child.ChildTaxonomyDataInDLSessions?.some((s: any) => s.id === entry.id)
      })

      if (!childTaxonomy) {
        // Create new child taxonomy entry for this specific child annotation
        // Each child (AC1, AC2, etc.) gets its own child taxonomy entry
        // Use the actual name from taxonomyCoordinates to ensure we preserve AC1, AC2, etc.
        const actualName = annotationData.name || entry.name
        const actualAbbreviation = annotationData.abbreviation || entry.abbreviation
        const childTaxonomyId = `${parentId}_${entry.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        childTaxonomy = {
          id: childTaxonomyId,
          name: actualName, // Use actual name from taxonomyCoordinates (AC1, AC2, etc.)
          abbreviation: actualAbbreviation,
          colorCode: annotationData.colorCode || entry.colorCode,
          extractedResourceId: currentImage.value?.id,
          dLSessionId: route.params.id.toString(),
          typesInTaxonomyId: parentId,
          ChildTaxonomyDataInDLSessions: [],
        }
        parentType.ChildTaxonomy.push(childTaxonomy)
      }

      // Ensure ChildTaxonomyDataInDLSessions array exists
      if (!childTaxonomy.ChildTaxonomyDataInDLSessions) {
        childTaxonomy.ChildTaxonomyDataInDLSessions = []
      }

      // Check if session data with this ID already exists in this child taxonomy
      const sessionExists = childTaxonomy.ChildTaxonomyDataInDLSessions.some((s: any) => s.id === entry.id)
      if (sessionExists) {
        continue // Skip if already exists
      }

      // Add session data only if it doesn't exist
      // Use the annotation data from taxonomyCoordinates to get the actual name (AC1, AC2, etc.)
      // This ensures we preserve the exact name from the original annotation
      const actualName = annotationData.name || entry.name
      const actualAbbreviation = annotationData.abbreviation || entry.abbreviation
      
      const sessionData = {
        id: entry.id,
        name: actualName, // Use the actual name from taxonomyCoordinates (AC1, AC2, etc.)
        abbreviation: actualAbbreviation,
        colorCode: annotationData.colorCode || entry.colorCode,
        taxonomyData: {
          name: actualName, // Preserve the actual name
          abbreviation: actualAbbreviation,
          type: entry.type,
        },
        taxonomyType: {
          name: entry.type,
          parentId: entry.parentId,
          typesInTaxonomyId: parentId,
        },
        extractedResourceId: currentImage.value?.id,
        dLSessionId: route.params.id.toString(),
        typesInTaxonomyId: parentId,
        taxonomiesAnnotationsInDLSessionsId: entry.taxonomiesAnnotationsInDLSessionsId,
      }
      childTaxonomy.ChildTaxonomyDataInDLSessions.push(sessionData)
      
      // Also update the child taxonomy name to match the actual name if it's different
      // This ensures the child taxonomy entry displays the correct name (AC1, AC2, etc.)
      if (childTaxonomy.name !== actualName) {
        childTaxonomy.name = actualName
        childTaxonomy.abbreviation = actualAbbreviation
      }
    }
  }
}

// Helper function to proceed with copying annotations
async function proceedWithCopy(annotationEntries: AnnotationHistoryEntry[], targetIndex: number, clearExisting: boolean = false) {
  // Clear existing annotations if requested
  if (clearExisting) {
    await discardAllAnnotations()
    // Wait a bit for cleanup to complete
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Copy annotations by restoring them with new IDs
  isReplayingHistory = true // Prevent undo stack recording during copy
  const copiedEntries: AnnotationHistoryEntry[] = []
  
  for (const entry of annotationEntries) {
    // Determine the correct ID to use for the copied annotation
    // For child annotations: use taxonomiesAnnotationsInDLSessionsId (matches session.id in checkbox)
    // For parent annotations: use typesInTaxonomyId or taxonomiesAnnotationsInDLSessionsId
    let taxonomyTypeId: string
    
    // Check if this is a child annotation by checking if:
    // 1. parentId exists, OR
    // 2. taxonomiesAnnotationsInDLSessionsId exists and is different from typesInTaxonomyId
    //    (this handles cases where parentId might not be set but it's still a child)
    const isChildAnnotation = entry.parentId || 
      (entry.taxonomiesAnnotationsInDLSessionsId && 
       entry.typesInTaxonomyId && 
       entry.taxonomiesAnnotationsInDLSessionsId !== entry.typesInTaxonomyId)
    
    if (isChildAnnotation) {
      // Child annotation: prioritize taxonomiesAnnotationsInDLSessionsId
      // This matches session.id from ChildTaxonomyDataInDLSessions used by the checkbox
      taxonomyTypeId = entry.taxonomiesAnnotationsInDLSessionsId || entry.id
    } else {
      // Parent annotation: use typesInTaxonomyId or taxonomiesAnnotationsInDLSessionsId
      taxonomyTypeId = entry.typesInTaxonomyId || entry.taxonomiesAnnotationsInDLSessionsId || entry.id
    }
    
    // Generate new ID only if we need to avoid conflicts with existing annotations
    let newId = taxonomyTypeId
    if (taxonomyCoordinates.value[taxonomyTypeId]) {
      // If annotation already exists with this ID, generate a unique one
      newId = `${taxonomyTypeId}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    const copiedEntry: AnnotationHistoryEntry = {
      ...entry,
      id: newId,
      isStored: false, // Mark as new/unstored annotation
    }
    
    // Restore annotation with new ID
    restoreAnnotation(copiedEntry)
    copiedEntries.push(copiedEntry)
  }
  isReplayingHistory = false

  // Update fetchTaxonomies structure with copied children so they appear in the annotation list
  updateFetchTaxonomiesWithCopiedChildren(copiedEntries)

  // IMPORTANT: Add batch entry to undo stack for copied annotations
  // This allows Ctrl+Z to undo all copied annotations at once
  if (copiedEntries.length > 0) {
    const batchEntry: AnnotationHistoryEntry = {
      id: `batch_copy_${Date.now()}`,
      type: 'Batch',
      name: 'Copied Annotations',
      abbreviation: 'BATCH',
      colorCode: '#000000',
      index: null,
      isStored: false,
      isBatchOperation: true,
      batchEntries: [...copiedEntries], // Store all copied entries
      taxonomyMetrics: {}
    }
    undoStack.value.push(batchEntry)
    redoStack.value = [] // Clear redo stack when new action is performed
  }

  // Ensure hasSavedAnnotationsInCurrentSession remains false after copying unsaved annotations
  // This is critical to prevent the copy button from being enabled before saving
  hasSavedAnnotationsInCurrentSession.value = false

  pendingCopyAction.value = null
  showCopyAnnotationConfirmationModal.value = false
  pendingCopyTargetIndex.value = null
  pendingCopyAnnotationEntries.value = null
  notification.success({ content: `Annotations copied to image ${targetIndex + 1}`, duration: 3000 })
}

// Handle "Keep it" button - cancel copy operation
function handleKeepExistingAnnotations() {
  showCopyAnnotationConfirmationModal.value = false
  pendingCopyTargetIndex.value = null
  pendingCopyAnnotationEntries.value = null
  pendingCopyAction.value = null
  notification.info({ content: 'Copy operation cancelled', duration: 3000 })
}

// Handle "Change the older one" button - clear existing and copy
async function handleReplaceExistingAnnotations() {
  if (pendingCopyTargetIndex.value === null || !pendingCopyAnnotationEntries.value) {
    showCopyAnnotationConfirmationModal.value = false
    return
  }

  const targetIndex = pendingCopyTargetIndex.value
  const annotationEntries = pendingCopyAnnotationEntries.value
  
  // IMPORTANT FIX: Store annotation IDs that need to be deleted on save, but DON'T delete from database yet
  // This allows discarding to restore the old annotations
  const savedAnnotationIds: string[] = []
  for (const [taxonomyId, data] of Object.entries(taxonomyCoordinates.value)) {
    // Only track annotations that are saved (isStored === true)
    if (data && data.isStored === true) {
      savedAnnotationIds.push(taxonomyId)
    }
  }
  
  // Track these IDs for deletion when user saves (not now)
  pendingDeletionIds.value = [...savedAnnotationIds]
  
  // Clear all annotation groups from the layer (local only, not from database)
  if (layer) {
    const allGroups = layer.find('Group').filter((g: any) => g.attrs.id && g.attrs.id.endsWith('group'))
    allGroups.forEach((group: any) => group.destroy())
    layer.batchDraw()
  }
  
  // Clear taxonomyCoordinates to prepare for new annotations
  taxonomyCoordinates.value = {}
  
  // Clean up fetchTaxonomies structure for current image to prevent duplicates
  cleanupFetchTaxonomiesForCurrentImage()
  
  // Reset taxonomyIndex
  taxonomyIndex.value = 0
  
  // Clear undo/redo stacks
  redoStack.value = []
  undoStack.value = []
  
  // Wait a bit for cleanup to complete
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Proceed with copying new annotations
  await proceedWithCopy(annotationEntries, targetIndex, false) // false because we already cleared
}

// WHEN SENDING FOR QC
async function submitManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  const extractedResources: { id: string; status: ExtractedResourceStatus; isFinalApproval: boolean; isReSubmit: boolean }[] = []
  selectedResources.forEach((resource) => {
    extractedResources.push({ id: resource.id, status: selectedStatus, labelIds: resource.labelIds, isFinalApproval: resource.isFinalApproval, isReSubmit: !!(((selectedStatus === 'ACCEPTED' || selectedStatus === 'IN_REVIEW') && (resource.status === 'REJECTED'))) })
  })
  try {
    await $client.dLSession.submitManyExtractedResources.mutate({
      dLSessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources,
    })
    // Wait for popconfirm to close before refreshing
    await nextTick()
    emit('refreshDataGrid')
  }
  catch (error: any) {
    if (error.message)
      notification.error({ content: error.message, duration: 5000 })
    else
      notification.error({ content: 'An unknown error occurred', duration: 5000 })
  }
}

// Check for unsaved changes before sending to QC
function handleSendToQC(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  if (hasUnsavedChanges.value) {
    // Show unsaved changes confirmation before sending to QC
    showUnsavedChangesBeforeQCModal.value = true
    pendingQCAction.value = () => {
      submitManyExtractedResources(selectedResources, selectedStatus)
    }
  } else {
    // No unsaved changes, proceed directly
    submitManyExtractedResources(selectedResources, selectedStatus)
  }
}

// WHEN SENDING FOR REJECT
async function rejectManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  if (isRejecting.value) return // Prevent double clicks
  isRejecting.value = true
  const extractedResources: { id: string; status: ExtractedResourceStatus; isFinalApproval: boolean; isReSubmit: boolean }[] = []
  selectedResources.forEach((resource) => {
    extractedResources.push({ id: resource.id, status: selectedStatus, labelIds: resource.labelIds, isFinalApproval: resource.isFinalApproval, isReSubmit: !!(((selectedStatus === 'ACCEPTED' || selectedStatus === 'IN_REVIEW') && (resource.status === 'REJECTED'))) })
  })
  try {
    await $client.dLSession.rejectManyExtractedResources.mutate({
      dLSessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources,
    })
    notification.success({ content: `Successfully rejected Image`, duration: 2000 })
    // Emit refresh event to update the grid and preview with new status
    emit('refreshDataGrid')
    // Mark that accept/reject was performed and close the modal (if modal is open)
    if (showTaxonomyMappingModal.value) {
      wasAcceptRejectPerformed.value = true
      onAfterLeaveTaxonomyModal()
    }
  } catch (error: any) {
    notification.error({ content: `Error in rejecting Image: ${error.message || 'Unknown error'}`, duration: 2000 })
  } finally {
    isRejecting.value = false
  }
}

// WHEN SENDING FOR ACCEPT
async function acceptManyExtractedResources(selectedResources: Array<ExtractedResourceLong>, selectedStatus: ExtractedResourceStatus) {
  // Prevent multiple clicks
  if (isAccepting.value) {
    return
  }
  
  isAccepting.value = true
  const extractedResources: { id: string; status: ExtractedResourceStatus; isFinalApproval: boolean; isReSubmit: boolean }[] = []
  selectedResources.forEach((resource) => {
    extractedResources.push({ id: resource.id, status: selectedStatus, labelIds: resource.labelIds, isFinalApproval: resource.isFinalApproval, isReSubmit: !!(((selectedStatus === 'ACCEPTED' || selectedStatus === 'IN_REVIEW') && (resource.status === 'REJECTED'))) })
  })
  
  // Check if this is the last image before accepting
  const isLastImage = isNextButtonDisabled()
  
  try {
    await $client.dLSession.acceptManyExtractedResources.mutate({
      dLSessionId: route.params.id != null ? route.params.id.toString() : '',
      extractedResources,
    })
    notification.success({ content: `Successfully accepted Image`, duration: 2000 })
    emit('refreshDataGrid')
    // Emit refresh event to update the grid and preview with new status
    
    // Mark that accept/reject was performed and close the modal (if modal is open)
    if (showTaxonomyMappingModal.value) {
      wasAcceptRejectPerformed.value = true
      onAfterLeaveTaxonomyModal()
    }
  } catch (error: any) {
    notification.error({ content: `Error in accepting Image: ${error.message || 'Unknown error'}`, duration: 2000 })
  } finally {
    isAccepting.value = false
  }
}

async function hideAndShowBasedOnKey() {
  fetchTaxonomies!.value.forEach((taxonomy) => {
    const typesInTaxonomies = taxonomy!.taxonomy!.typesInTaxonomies
    toggleGroupSelected(typesInTaxonomies)
    // typesInTaxonomies.forEach((item: any) => {
    // const groupIndex = selectedGroups.value.indexOf(item.id);

    // if (groupIndex !== -1) {
    // selectedGroups.value.splice(groupIndex, 1);
    // selectedItems.value = selectedItems.value.filter(value => !typesInTaxonomies.map(e => e.id).includes(value));

    // const drawValue = taxonomyCoordinates.value[item.id];
    // const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio);

    // if (drawValue && drawValue.type === 'Landmark') {
    //   addLandmark(drawValue.x, drawValue.y, item.id, drawValue.name, drawValue.type, item.colorCode);
    // }

    // if (drawValue && drawValue.type == 'Measurement') {
    //   removeDuplicate(drawValue.id);
    //   drawMeasurement(drawValue, item.colorCode);
    // }

    // if (drawValue && drawValue.type == 'Bounding Box') {
    //   removeDuplicate(drawValue.id);
    //   startBoundingBox(drawValue.start.x, drawValue.start.y, drawValue.id, drawValue.name, drawValue.type, item.colorCode, drawValue.index, undefined, true);
    //   startBoundingBox(drawValue.end.x, drawValue.end.y, drawValue.id, drawValue.name, drawValue.type, item.colorCode, drawValue.index, drawValue, true);
    //   setTimeout(() => {
    //     updateAnchorPositions(taxonomyCoordinates.value[drawValue.id].anchors, taxonomyCoordinates.value[drawValue.id].rect, drawValue.id);
    //   }, 100);
    // }

    // if (drawValue && drawValue.type == 'Ellipse') {
    //   removeDuplicate(drawValue.id);
    //   drawEllipse(drawValue, item.colorCode);
    // }

    // if (drawValue && drawValue.type == 'Angle') {
    //   removeDuplicate(drawValue.id);
    //   drawAngle(drawValue, item.colorCode);
    // }
    // toggleGroupSelected(taxonomy!.taxonomy!.typesInTaxonomies)
    // } else {
    // selectedGroups.value.push(item.id);
    // selectedItems.value = [
    //   ...selectedItems.value,
    //   ...typesInTaxonomies.map(e => e.id).filter(item => !selectedItems.value.includes(item))
    // ];

    // const group = layer.findOne(`#${item.id}group`);
    // if (group) {
    //   group.remove();
    //   toggleGroupSelected(taxonomy!.taxonomy!.typesInTaxonomies)
    // }
    // }
  // });
  })
}

function handleClick1() {
  const isMac = process.client && /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
  const modKey = isMac ? 'Cmd' : 'Ctrl'
  notification.create({
    title: 'Shortcut keys',
    description: '',
    content: `The following are available shortcut keys:
1. Select a landmark point and press H to hide the selected landmark.
2. Shift + H to hide all the landmark points in the image.
3. Shift + Left click and move the mouse up and down to adjust the brightness.
4. Shift + Left click and move the mouse Left and right to adjust the contrast.
5. ${modKey} + R to reset the brightness and contrast.
6. ${modKey} + S to save the image.
7. L to lock/unlock the currently selected annotation(s) (inside modal).
8. ${modKey} + L to lock/unlock all annotations (inside modal).
9. Shift + L to lock and unlock image manipulations.
10. ${modKey} + Right Arrow for navigating the next image.
11. ${modKey} + Left Arrow for navigating the previous image.
12. ${modKey} + Z to undo the last action.
13. ${modKey} + Y or ${modKey} + Shift + Z to redo the last action.
14. ${modKey} + Shift + Right Arrow to copy annotations to the next image.
15. ${modKey} + Shift + Left Arrow to copy annotations to the previous image.
16. Backspace to delete the selected label(s).
17. Select the annotation and press Backspace to delete the selected annotation(s).`,
  })
}

const filteredChildTaxonomy = computed(() => {
  return (val: any) => {


    const filtered = val.ChildTaxonomy.filter(
      (child: any) =>{

      return child.extractedResourceId === currentImage.value.id
        && child.dLSessionId === route.params.id.toString();
    } )

    // Sort the filtered array by actual annotation instance name or index
    return filtered.sort((a: any, b: any) => {
      // Get the actual annotation name from ChildTaxonomyDataInDLSessions or taxonomyCoordinates
      const getAnnotationName = (child: any): string => {
        // First try to get from ChildTaxonomyDataInDLSessions
        if (child.ChildTaxonomyDataInDLSessions && child.ChildTaxonomyDataInDLSessions.length > 0) {
          const sessionData = child.ChildTaxonomyDataInDLSessions[0]
          if (sessionData?.taxonomyData?.name) {
            return sessionData.taxonomyData.name
          }
          if (sessionData?.id && taxonomyCoordinates.value[sessionData.id]?.name) {
            return taxonomyCoordinates.value[sessionData.id].name
          }
        }
        // Fallback to child.name or use index if available
        if (child.name) {
          return child.name
        }
        // Last resort: use index if available
        if (child.index !== undefined) {
          return `item${child.index}`
        }
        return ''
      }

      const aName = getAnnotationName(a)
      const bName = getAnnotationName(b)

      // Extract text and number parts from names (allow underscores and other characters in the text part)
      // Pattern: any characters followed by digits at the end
      const aMatches = aName.match(/^(.+?)(\d+)$/)
      const bMatches = bName.match(/^(.+?)(\d+)$/)

      if (aMatches && bMatches) {
        const [, aText, aNum] = aMatches
        const [, bText, bNum] = bMatches

        // If text parts are the same, compare numbers numerically
        if (aText === bText) {
          return parseInt(aNum, 10) - parseInt(bNum, 10) // Numeric sorting
        }

        // If text parts are different, compare text
        return aText.localeCompare(bText)
      }

      // Fallback: try to compare by index if available
      if (a.index !== undefined && b.index !== undefined) {
        return a.index - b.index
      }

      // Fallback to regular string comparison if pattern doesn't match
      return aName.localeCompare(bName)
    })
  }
})
const childIndex = ref(0)
async function addChildElement(val: any) {
  // Initialize ChildTaxonomy array if not exists
  if (!val.ChildTaxonomy)
    val.ChildTaxonomy = []

  // Filter existing children for current image and session
  const existingChildren = val.ChildTaxonomy.filter(child =>
    child.extractedResourceId === currentImage.value.id
    && child.dLSessionId === route.params.id.toString(),
  )

  // Helper function to extract index from name or abbreviation
  const extractIndex = (childStr: string, parentStr: string) => {
    if (!childStr || !parentStr)
      return 0

    if (childStr.startsWith(parentStr)) {
      const suffix = childStr.slice(parentStr.length)
      return suffix ? parseInt(suffix, 10) : 0
    }
    return 0
  }

  // Find highest existing index among children and their session data
  const highestIndex = existingChildren.reduce((max, child) => {
    if (child.ChildTaxonomyDataInDLSessions?.length > 0) {
      const maxChildIndex = child.ChildTaxonomyDataInDLSessions.reduce((childMax, data) => {
        // Check both name and abbreviation indices
        const nameIndex = extractIndex(data.taxonomyData?.name || '', val.name)
        const abbrIndex = extractIndex(data.taxonomyData?.abbreviation || '', val.abbreviation)
        // Take the highest index found in either name or abbreviation
        const currentIndex = Math.max(nameIndex, abbrIndex)
        return currentIndex > childMax ? currentIndex : childMax
      }, 0)
      return maxChildIndex > max ? maxChildIndex : max
    }
    else {
      const mainNameIndex = extractIndex(child.name, val.name)
      const mainAbbrIndex = extractIndex(child.abbreviation, val.abbreviation)
      const mainIndex = Math.max(mainNameIndex, mainAbbrIndex)
      return mainIndex > max ? mainIndex : max
    }
  }, 0)

  // Generate new child index and names
  childIndex.value = highestIndex + 1
  let newChildName = `${val.name.trim()}${childIndex.value}`
  let newChildAbbreviation = val.abbreviation ? `${val.abbreviation}${childIndex.value}` : undefined
  let newChildId = `${val.id}${val.name.trim()}${childIndex.value}${val.taxonomyType.name}`

  // Ensure uniqueness of child name, abbreviation, and ID
  while (
    existingChildren.some(child =>
      child.ChildTaxonomyDataInDLSessions.some(data =>
        data.id === newChildId ||
        (newChildAbbreviation && data.taxonomyData?.abbreviation === newChildAbbreviation)
      ),
    )
  ) {
    childIndex.value++
    newChildName = `${val.name}${childIndex.value}`
    if (newChildAbbreviation)
      newChildAbbreviation = `${val.abbreviation}${childIndex.value}`
    newChildId = `${val.id}${val.name}${childIndex.value}${val.taxonomyType.name}`
  }

  // Create new child taxonomy object
  const newChildTaxonomy = {
    id: newChildId,
    name: newChildName,
    abbreviation: newChildAbbreviation,
    colorCode: val.colorCode,
    extractedResourceId: currentImage.value.id,
    dLSessionId: route.params.id.toString(),
    typesInTaxonomyId: val.id,
    ChildTaxonomyDataInDLSessions: [],
  }

  // Add new child to parent's ChildTaxonomy array
  val.ChildTaxonomy.push(newChildTaxonomy)

  // Create and add session-specific data for the new child
  const newChildData = {
    id: newChildId,
    name: newChildName,
    abbreviation: newChildAbbreviation,
    colorCode: val.colorCode,
    taxonomyData: {
      name: newChildName,
      abbreviation: newChildAbbreviation,
    },
    taxonomyType: {
      ...val.taxonomyType,
      parentId: newChildName,
      typesInTaxonomyId: val.id,
      changeAppearance:val.changeAppearance
    },
    extractedResourceId: currentImage.value.id,
    dLSessionId: route.params.id.toString(),
    typesInTaxonomyId: val.id,
    taxonomiesAnnotationsInDLSessionsId: val.taxonomiesAnnotationsInDLSessionsId,
  }

  // Add session data to new child
  newChildTaxonomy.ChildTaxonomyDataInDLSessions.push(newChildData)

  // Reset child index for next use
  childIndex.value = 0
}

async function deleteChildTaxonomy(type: any, val: any) {
  val.ChildTaxonomy = val.ChildTaxonomy.filter(
    (data: any) => data.id !== type.id,
  )

  const idsToDelete = [type.id, ...getChildTypeIds(type), ...getUnAnnotatedIds(type.ChildTaxonomy)]
  const isChildDelete = [type.childTaxonomyId ? type.childTaxonomyId : type.id]
  if (selectedTaxonomyType.value?.id === type.id) {
    selectedTaxonomyType.value = {}
  }
  idsToDelete.forEach((id) => {
    const group = layer!.findOne(g => g.attrs.id === `${id}group`)
    if (group)
      group.remove()
  })

  if (taxonomyCoordinates.value[type.id]?.isStored === false || taxonomyCoordinates.value[type.id]?.isStored === undefined) {
    idsToDelete.forEach((id) => {
      if (taxonomyCoordinates.value[id])
        delete taxonomyCoordinates.value[id]
    })
  }

  if (taxonomyCoordinates.value[type.id]?.isStored === true || type.ChildTaxonomyDataInDLSessions?.length == 0) {
    const data: DeleteSingleTaxonomyDataInput = {
      dLSessionId: route.params.id.toString(),
      extractedResourceId: currentImage.value!.id,
      taxonomyId: isChildDelete,
    }
    try {
      await $client.dLSession.deleteChildTaxonomyData.mutate(data)
      fetchTaxonomyMasters();
      notification.success({ content: 'Deleted Successfully', duration: 3000 })
    }
    catch (error: any) {
      notification.error({ content: 'Error in Submitting', duration: 5000 })
    }
    idsToDelete.forEach((id) => {
      if (taxonomyCoordinates.value[id])
        delete taxonomyCoordinates.value[id]
    })
  }

  // Remove any entries from undo/redo stacks for deleted annotations
  // This ensures the deletion is not tracked in undo/redo history
  redoStack.value = redoStack.value.filter(entry => !idsToDelete.includes(entry.id))
  undoStack.value = undoStack.value.filter(entry => !idsToDelete.includes(entry.id))
}

const hasTaxonomyCoordinates = computed(() => {
  const hasMainTaxonomies = Object.keys(taxonomyCoordinates.value).length > 0;

  const hasChildTaxonomies = Array.isArray(fetchTaxonomies.value) && fetchTaxonomies.value.some(item =>
    item.taxonomy.typesInTaxonomies.some(val =>
      val.ChildTaxonomy && val.ChildTaxonomy.some(child =>
        child.extractedResourceId == currentImage.value.id && child.dLSessionId == route.params.id.toString()
      )
    )
  );

  return hasMainTaxonomies || hasChildTaxonomies;
});

const hasSavedAnnotations = computed(() => {
  // Force reactivity by accessing the value and current image
  const coords = taxonomyCoordinates.value
  const currentImg = currentImage.value
  const sessionFlag = hasSavedAnnotationsInCurrentSession.value
  const allAnnotations = Object.keys(coords)
  
  // If no annotations exist, button must be disabled
  if (allAnnotations.length === 0) {
    return false
  }
  
  // Verify that annotations actually exist and are valid
  // Filter out any undefined/null annotations
  const validAnnotations = allAnnotations.filter(key => {
    const annotation = coords[key]
    return annotation && annotation.type // Ensure annotation has required properties
  })
  
  // If no valid annotations, button must be disabled
  if (validAnnotations.length === 0) {
    return false
  }
  
  // Only enable button if there are saved annotations (isStored === true)
  // This prevents copying unsaved/temporary annotations
  const savedAnnotations = validAnnotations.filter(key => {
    const annotation = coords[key]
    return annotation && annotation.isStored === true
  })
  
  return savedAnnotations.length > 0
});

// Watch taxonomyCoordinates changes to update button state reliably
// This ensures the button state updates even if the setTimeout checks miss timing
watch(
  () => {
    // Force reactivity by accessing the object and its keys
    const coords = taxonomyCoordinates.value
    const currentImg = currentImage.value
    return {
      count: Object.keys(coords).length,
      imageId: currentImg?.id,
      // Also track a hash of annotation IDs to detect changes
      annotationIds: Object.keys(coords).sort().join(',')
    }
  },
  (newVal, oldVal) => {
    // Only check if count changed and we have a current image
    if (newVal.count !== oldVal?.count && newVal.imageId) {
      // Use nextTick and a small delay to ensure annotations are fully added
      nextTick(() => {
        setTimeout(() => {
          const allAnnotations = Object.keys(taxonomyCoordinates.value);
          if (allAnnotations.length > 0) {
            const validAnnotations = allAnnotations.filter(key => {
              const annotation = taxonomyCoordinates.value[key];
              return annotation && annotation.type;
            });
            
            if (validAnnotations.length > 0) {
              hasSavedAnnotationsInCurrentSession.value = true;
            } else {
              hasSavedAnnotationsInCurrentSession.value = false;
            }
          } else {
            hasSavedAnnotationsInCurrentSession.value = false;
          }
        }, 50); // Small delay to ensure annotations are fully processed
      });
    }
  },
  { immediate: false, deep: false }
);

/**
 * Updates the appearance of a bounding box
 * @param group - The Konva group containing the bounding box elements
 * @param colorCode - The new color to apply
 */
function updateBoundingBoxAppearance(group: Konva.Group, colorCode: string) {
  // Update rectangle
  const rect = group.findOne('Rect')
  if (rect) {
    rect.stroke(colorCode)
    rect.strokeWidth(2)
  }

  // Update anchors
  const anchors = group.find('.anchor')
  anchors.forEach((anchor: Konva.Rect) => {
    anchor.fill(colorCode)
    anchor.stroke(colorCode)
  })

  // Update text label if exists
  const text = group.findOne('Text')
  if (text)
    text.fill(colorCode)

  // Update transformer if exists
  const transformer = group.findOne('Transformer')
  if (transformer) {
    transformer.borderStroke(colorCode)
    transformer.anchorStroke(colorCode)
    transformer.anchorFill(colorCode)
  }

  // Optional: Update any additional visual elements
  const additionalShapes = group.find('.additional-shape')
  additionalShapes.forEach((shape: Konva.Shape) => {
    shape.stroke(colorCode)
    if (shape.getClassName() === 'Circle')
      shape.fill(colorCode)
  })

  // Update custom attributes
  group.setAttr('boundingBoxColor', colorCode)
}

// Optional: Add event handlers if needed
function addBoundingBoxEventHandlers(group: Konva.Group, colorCode: string) {
  group.on('mouseenter', () => {
    const rect = group.findOne('Rect')
    if (rect) {
      rect.strokeWidth(3)
      layer?.batchDraw()
    }
  })

  group.on('mouseleave', () => {
    const rect = group.findOne('Rect')
    if (rect) {
      rect.strokeWidth(2)
      layer?.batchDraw()
    }
  })

  // Add drag handlers if needed
  group.on('dragmove', () => {
    const rect = group.findOne('Rect')
    const anchors = group.find('.anchor')
    if (rect && anchors) {
      updateAnchorPositions(anchors, rect, group.id())
      layer?.batchDraw()
    }
  })
}

// Optional: Add resize handling
function handleBoundingBoxResize(group: Konva.Group, newWidth: number, newHeight: number) {
  const rect = group.findOne('Rect')
  if (rect) {
    rect.width(newWidth)
    rect.height(newHeight)

    const anchors = group.find('.anchor')
    if (anchors)
      updateAnchorPositions(anchors, rect, group.id())

    // Update stored coordinates
    const id = group.id()
    if (taxonomyCoordinates.value[id]) {
      taxonomyCoordinates.value[id].width = newWidth
      taxonomyCoordinates.value[id].height = newHeight
    }

    layer?.batchDraw()
  }
}

function updateEllipseAppearance(group: Konva.Group, colorCode: string) {
  // Update main ellipse
  const ellipse = group.findOne('Ellipse')
  if (ellipse) {
    ellipse.stroke(colorCode)
    ellipse.strokeWidth(2)
  }

  // Update anchors
  const anchors = group.find('Circle')
  anchors.forEach((anchor: Konva.Circle) => {
    if (anchor.id().includes('Anchor')) {
      anchor.stroke('#666')
      anchor.fill('#ddd')
    }
  })

  // Update text label
  const text = group.findOne('Text')
  if (text)
    text.fill(colorCode)

  // Update custom attributes
  group.setAttr('ellipseColor', colorCode)
}

function updateAngleAppearance(group: Konva.Group, colorCode: string) {
  // Update angle lines
  const lines = group.find('Line')
  lines.forEach((line: Konva.Line) => {
    line.stroke(colorCode)
    line.strokeWidth(2)
  })

  // Update vertex and arm points
  const points = group.find('Circle')
  points.forEach((point: Konva.Circle) => {
    if (point.id().includes('vertex') || point.id().includes('armPoint')) {
      point.stroke('#666')
      point.fill('#ddd')
    }
  })

  // Update angle text
  const text = group.findOne('Text')
  if (text)
    text.fill(colorCode)

  // Update custom attributes
  group.setAttr('angleColor', colorCode)
}

function isCheckboxChecked(childId: string, parentId: string) {
  const hasAnnotation = Object.keys(taxonomyCoordinates.value).includes(childId)
  return hasAnnotation
}

function onAfterLeaveTaxonomyModal() {
  showMarkupPopover.value = false
  showTaxonomyMappingModal.value = false
  selectedItems.value = []
  selectedGroups.value = []
  isLock.value = false
  isClickedItems.value = []
  Object.keys(taxonomyOpen).forEach(key => {
    taxonomyOpen[key] = true
  })
  undoStack.value = []
  redoStack.value = []
  markupUndoStack.value = []
  markupRedoStack.value = []
  markupGridUndoStack.value = []
  markupGridRedoStack.value = []
  initialUndoStackLength.value = 0
  initialMarkupUndoStackLength.value = 0
  initialMarkupGridUndoStackLength.value = 0
  // Unlock and unhide all annotations when closing annotation window
  unlockAllTaxonomies()
  unhideAllTaxonomies()
  // Reset initial state when modal is closed

  // Reconnect grid ResizeObserver if grid is still active
  if (gridContainer.value && markupGridStage && gridImageLayer && !gridResizeObserver) {
    gridResizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect

          // Ensure minimum dimensions
          const finalWidth = Math.max(width, 300)
          const finalHeight = Math.max(height, 200)

          markupGridStage.width(finalWidth)
          markupGridStage.height(finalHeight)

          const imageSize = calculateSize(finalWidth, finalHeight, imageAspectRatio)
          const konvaImage = gridImageLayer.getChildren().find(child => child instanceof Konva.Image)
          if (konvaImage) {
            konvaImage.setAttrs(imageSize)
          }

          gridImageLayer.batchDraw()
        }
      }, 100)
    })

    gridResizeObserver.observe(gridContainer.value)
  }
}

const showTaxonomyCloseModal = ref(false)
const showUnsavedChangesModal = ref(false)
const showUnsavedChangesBeforeQCModal = ref(false)
const showCopyAnnotationModal = ref(false)
const showCopyAnnotationConfirmationModal = ref(false)
const pendingCopyTargetIndex = ref<number | null>(null)
const pendingCopyAnnotationEntries = ref<AnnotationHistoryEntry[] | null>(null)
const pendingAction = ref<(() => void) | null>(null)
const pendingQCAction = ref<(() => void) | null>(null)
const pendingCopyAction = ref<'previous' | 'next' | null>(null)
const pendingLabelEvent = ref<MouseEvent | null>(null)
const hasSavedAnnotationsInCurrentSession = ref(false)
// Track annotation IDs that need to be deleted from database on save (when user chose "Change the older one")
const pendingDeletionIds = ref<string[]>([])

// Track initial state of undo stacks to detect actual changes
const initialUndoStackLength = ref(0)
const initialMarkupUndoStackLength = ref(0)
const initialMarkupGridUndoStackLength = ref(0)

// Check if there are unsaved annotation changes
const hasUnsavedChanges = computed(() => {
  // Check if any annotation is not stored
  const hasUnsavedAnnotations = Object.keys(taxonomyCoordinates.value).some(key => {
    const annotation = taxonomyCoordinates.value[key]
    return annotation && annotation.isStored === false
  })

  // Check if undo stacks have grown beyond initial state (indicating actual user changes)
  // Only consider it as unsaved changes if the current state differs from initial state
  const hasUndoHistory = undoStack.value.length > initialUndoStackLength.value ||
                         markupUndoStack.value.length > initialMarkupUndoStackLength.value ||
                         markupGridUndoStack.value.length > initialMarkupGridUndoStackLength.value

  return hasUnsavedAnnotations || hasUndoHistory
})

function onCloseTaxonomyModal() {
  if (hasUnsavedChanges.value) {
    // Show unsaved changes confirmation
    showUnsavedChangesModal.value = true
    pendingAction.value = () => {
      onAfterLeaveTaxonomyModal()
    }
  } else {
    // No unsaved changes, trigger the popconfirm
    triggerPopconfirm()
  }
}

async function handleSaveAndClose() {
  // Store the pending action and label event before doing anything
  const actionToExecute = pendingAction.value
  const labelEvent = pendingLabelEvent.value
  pendingAction.value = null
  pendingLabelEvent.value = null

  // Close the unsaved changes modal first to avoid DOM conflicts
  showUnsavedChangesModal.value = false

  // Wait for DOM to update after closing modal
  await nextTick()
  await nextTick()

  // Save the annotations after modal is closed
  const hasAnnotationsToSave = Object.keys(taxonomyCoordinates.value).length > 0

  if (hasAnnotationsToSave) {
    await submitTaxonomyMapping()
    // Wait for save to complete and DOM to update
    await nextTick()
  }

  // If there's a pending label event, save labels after saving annotations
  if (labelEvent) {
    await executeSaveExtractedResourcesLabels(labelEvent)
  }

  // Add a sufficient delay to ensure modal closing animation completes and DOM is fully stable
  // This prevents the "Cannot read properties of null (reading 'parentNode')" error
  setTimeout(() => {
    // Execute pending action after modal is fully closed and DOM is stable
    // Only execute if it's not a label action (label action already executed above)
    if (actionToExecute && !labelEvent) {
      try {
        actionToExecute()
      } catch (error) {
        // Retry once after a longer delay if there's an error
        setTimeout(() => {
          if (actionToExecute) {
            actionToExecute()
          }
        }, 300)
      }
    }
  }, 500)
}

function handleCancelClose() {
  // Just cancel - don't proceed
  showUnsavedChangesModal.value = false
  pendingAction.value = null
  pendingLabelEvent.value = null
}

async function handleDiscardAndClose() {
  // Store the pending action and label event before doing anything
  const actionToExecute = pendingAction.value
  const labelEvent = pendingLabelEvent.value
  pendingAction.value = null
  pendingLabelEvent.value = null

  // Close the unsaved changes modal first
  showUnsavedChangesModal.value = false

  // Wait for DOM to update after closing modal
  await nextTick()
  await nextTick()

  // Remove all annotations (discard them)
  await discardAllAnnotations()

  // If there's a pending label event, save labels after discarding annotations
  if (labelEvent) {
    await executeSaveExtractedResourcesLabels(labelEvent)
  }

  // Add a delay to ensure DOM is stable before executing action
  setTimeout(() => {
    // Execute pending action only if it's not a label action (label action already executed above)
    if (actionToExecute && !labelEvent) {
      try {
        actionToExecute()
      } catch (error) {
        // Retry once after a longer delay if there's an error
        setTimeout(() => {
          if (actionToExecute) {
            actionToExecute()
          }
        }, 300)
      }
    }
  }, 500)
}

// Helper function to clear canvas and state without reloading
function clearCanvasAndState() {
  // Remove all annotations from the layer
  if (layer) {
    layer.find('Group').forEach((group: Konva.Group) => {
      if (group.id().includes('group')) {
        group.destroy()
      }
    })
    layer.batchDraw()
  }

  // Clear all annotation data
  taxonomyCoordinates.value = {}

  // Clear undo/redo stacks
  undoStack.value = []
  redoStack.value = []
  markupUndoStack.value = []
  markupRedoStack.value = []
  markupGridUndoStack.value = []
  markupGridRedoStack.value = []

  // Reset initial state
  initialUndoStackLength.value = 0
  initialMarkupUndoStackLength.value = 0
  initialMarkupGridUndoStackLength.value = 0

  // Clear other state
  selectedItems.value = []
  selectedGroups.value = []
  isClickedItems.value = []
  lockedItems.value = []
  lockedGroups.value = []
  visibilityStates.clear()
  lockStates.clear()
  dragStartStates.clear()

  // Clear markup if visible
  if (markupGroup && markupLayer) {
    markupGroup.destroyChildren()
    markupLayer.batchDraw()
  }
  if (markupGridGroup && markupGridLayer) {
    markupGridGroup.destroyChildren()
    markupGridLayer.batchDraw()
  }
  
  // Clear pending deletions
  pendingDeletionIds.value = []
}

// Helper function to discard all annotations
async function discardAllAnnotations() {
  // Clear canvas and state
  clearCanvasAndState()
  
  // IMPORTANT FIX: Reload saved annotations from server to restore the saved state
  // This ensures that when discarding, we restore the original saved annotations
  // instead of just clearing everything (which would lose saved annotations)
  // This also restores annotations that were "changed" but not yet saved
  try {
    const resourceId = currentImage.value?.id || props.resourceData.id
    await getTaxonomyData(resourceId, ++latestRequestId)
  } catch (error) {
    console.error('Error restoring saved annotations after discard:', error)
    // If restore fails, at least we've cleared the unsaved changes
  }
}

// Handle save and send to QC
async function handleSaveAndSendToQC() {
  // Store the pending QC action
  const actionToExecute = pendingQCAction.value
  pendingQCAction.value = null

  // Close the modal first
  showUnsavedChangesBeforeQCModal.value = false

  // Wait for DOM to update
  await nextTick()
  await nextTick()

  // Save the annotations
  const hasAnnotationsToSave = Object.keys(taxonomyCoordinates.value).length > 0

  if (hasAnnotationsToSave) {
    await submitTaxonomyMapping()
    await nextTick()
  }

  // Execute the QC action after save
  setTimeout(() => {
    if (actionToExecute) {
      try {
        actionToExecute()
      } catch (error) {
        setTimeout(() => {
          if (actionToExecute) {
            actionToExecute()
          }
        }, 300)
      }
    }
  }, 500)
}

// Handle discard and send to QC
async function handleDiscardAndSendToQC() {
  // Store the pending QC action
  const actionToExecute = pendingQCAction.value
  pendingQCAction.value = null

  // Close the modal first
  showUnsavedChangesBeforeQCModal.value = false

  // Wait for DOM to update
  await nextTick()
  await nextTick()

  // Discard all annotations
  await discardAllAnnotations()

  // Execute the QC action after discard
  setTimeout(() => {
    if (actionToExecute) {
      try {
        actionToExecute()
      } catch (error) {
        setTimeout(() => {
          if (actionToExecute) {
            actionToExecute()
          }
        }, 300)
      }
    }
  }, 500)
}

// Handle cancel send to QC
function handleCancelSendToQC() {
  showUnsavedChangesBeforeQCModal.value = false
  pendingQCAction.value = null
}

// For Annotation Markup
const savedMarkupData = ref()
const isDrawing = ref(false)
const markerColor = ref('#000000')
const markerThickness = ref(5)
const showMarkupPopover = ref<boolean>(false)
const isEraser = ref<boolean>(false)
let lastLine: Konva.Line | null = null
let markupGroup: Konva.Group
let markupLayer: Konva.Layer

function markupHandleMouseDown() {
  if (!showMarkupPopover.value)
    return

  if (canSaveTaxonomyAtApprovalLevel.value)
    return

  isDrawing.value = true
  const pos: any = stage.getPointerPosition()

  lastLine = new Konva.Line({
    stroke: isEraser.value ? '#ffffff' : markerColor.value,
    strokeWidth: markerThickness.value,
    globalCompositeOperation: isEraser.value ? 'destination-out' : 'source-over',
    points: [pos.x + (isEraser.value ? 10 : 0), pos.y + 20],
    lineCap: 'round',
    lineJoin: 'round',
  })

  markupGroup.add(lastLine)
}

function markupHandleMouseEnter() {
  mouseEnterAnnotate.value = true
  if (!showMarkupPopover.value)
    return

  if (cursorSmallAnnotate.value && cursorBigAnnotate.value && annotationContainer.value) {
    if (eraserModeLabel.value === 'Eraser Mode')
      cursorSmallAnnotate.value.style.opacity = '1'
    else
      cursorBigAnnotate.value.style.opacity = '1'

    annotationContainer.value.style.cursor = 'none'
  }
}

function markupHandleMouseLeave() {
  mouseEnterAnnotate.value = false
  if (cursorSmallAnnotate.value)
    cursorSmallAnnotate.value.style.opacity = '0'
  else if (cursorBigAnnotate.value && annotationContainer.value)
    cursorBigAnnotate.value.style.opacity = '0'

  if (annotationContainer.value)
    annotationContainer.value.style.cursor = 'default'
}

function markupHandleMouseMove() {
  if (!showMarkupPopover.value)
    return

  const pos: any = stage.getPointerPosition()
  if (!pos)
    return

  const mouseX = pos.x
  const mouseY = pos.y
  lastMousePositionAnnotate.value = { x: mouseX, y: mouseY }
  if (eraserModeLabel.value === 'Eraser Mode' && cursorSmallAnnotate.value)
    cursorSmallAnnotate.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  else if (cursorBigAnnotate.value)
    cursorBigAnnotate.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`

  if (cursorSmallAnnotate.value && eraserModeLabel.value === 'Eraser Mode')
    cursorSmallAnnotate.value.style.opacity = '1'
  else if (cursorBigAnnotate.value && annotationContainer.value)
    cursorBigAnnotate.value.style.opacity = '1'

  if (annotationContainer.value)
    annotationContainer.value.style.cursor = 'none'

  if (!isDrawing.value || !lastLine)
    return

  const newPoints = lastLine.points().concat([pos.x + (eraserModeLabel.value === 'Eraser Mode' ? 0 : 10), pos.y + 20])
  lastLine.points(newPoints)
  markupLayer.batchDraw()
}

function recordMarkupHistory(line: Konva.Line | null) {
  if (!line)
    return

  markupUndoStack.value.push(line.toJSON())
  markupRedoStack.value = []
}

async function undoMarkupStroke() {
  if (!markupGroup || !markupLayer)
    return

  if (!markupUndoStack.value.length)
    return

  const serialized = markupUndoStack.value.pop()
  if (!serialized)
    return

  const children = markupGroup.getChildren()
  if (children.length) {
    children[children.length - 1].destroy()
    markupLayer.batchDraw()
  }

  markupRedoStack.value.push(serialized)
  await saveMarkup()
}

async function redoMarkupStroke() {
  if (!markupGroup || !markupLayer)
    return

  if (!markupRedoStack.value.length)
    return

  const serialized = markupRedoStack.value.pop()
  if (!serialized)
    return

  const node = Konva.Node.create(serialized) as Konva.Line
  markupGroup.add(node)
  markupUndoStack.value.push(serialized)
  markupLayer.batchDraw()
  await saveMarkup()
}

async function markupHandleMouseUp() {
  if (!showMarkupPopover.value)
    return

  if (cursorSmallAnnotate.value && eraserModeLabel.value === 'Eraser Mode')
    cursorSmallAnnotate.value.style.opacity = '1'
  else if (cursorBigAnnotate.value && annotationContainer.value)
    cursorBigAnnotate.value.style.opacity = '1'

  if (annotationContainer.value)
    annotationContainer.value.style.cursor = 'none'

  if (!lastLine)
    return

  isDrawing.value = false
  await saveMarkup()
  recordMarkupHistory(lastLine)
  lastLine = null
}

async function saveMarkup() {
  const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)

  const markupGroupClone = markupGroup.clone()

  // Normalize the points in the markup group
  markupGroupClone.getChildren().forEach((line) => {
    const points = line.points()
    const normalizedPoints = []

    // Normalize each point based on the image dimensions
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i] / imageSize.width // Normalize X coordinate
      const y = points[i + 1] / imageSize.height // Normalize Y coordinate
      normalizedPoints.push(x, y)
    }
    line.points(normalizedPoints) // Update the line points with normalized values
  })

  const json = markupGroupClone.toJSON()

  const markupData: any = {
    dLSessionId: route.params.id.toString(),
    extractedResourceId: currentImage.value!.id,
    markupData: json,
  }
  await $client.dLSession.updateMarkupData.mutate(markupData)
}

function loadSavedMarkup(data: any) {
  const imageSize = calculateSize(stage.width(), stage.height(), imageAspectRatio)
  if (data) {
    const newMarkupGroup = Konva.Node.create(data)

    // Scale the points back to actual image size
    newMarkupGroup.getChildren().forEach((line) => {
      const points = line.points()
      const denormalizedPoints = []

      // Denormalize each point based on the current image size
      for (let i = 0; i < points.length; i += 2) {
        const x = points[i] * imageSize.width // Scale X coordinate to current image width
        const y = points[i + 1] * imageSize.height // Scale Y coordinate to current image height
        denormalizedPoints.push(x, y)
      }
      line.points(denormalizedPoints) // Update the line points with denormalized values
    })

    markupGroup.add(...newMarkupGroup.getChildren())
    markupLayer.batchDraw()
    markupUndoStack.value = markupGroup.getChildren().map(child => child.toJSON())
    markupRedoStack.value = []
    // Set initial state after loading saved data
    initialMarkupUndoStackLength.value = markupUndoStack.value.length
  }
  else if (markupGroup && markupLayer) {
    markupGroup.destroyChildren()
    markupLayer.draw()
    markupUndoStack.value = []
    markupRedoStack.value = []
    initialMarkupUndoStackLength.value = 0
  }
}

function toggleEraserMode() {
  if (canSaveTaxonomyAtApprovalLevel.value) return;
  isEraser.value = !isEraser.value
}
const eraserModeLabel = computed(() => (isEraser.value ? 'Marker Mode' : 'Eraser Mode'))

function clearCanvas() {
  markupGroup.destroyChildren()
  markupLayer.draw()
  if (!showMarkupPopover.value)
    return

  isDrawing.value = false
  saveMarkup()
  markupUndoStack.value = []
  markupRedoStack.value = []
  initialMarkupUndoStackLength.value = 0
}

function togglePopover() {
  showMarkupPopover.value = !showMarkupPopover.value
  if (showMarkupPopover.value) {
    isEraser.value = false // Always start in marker mode when opening
    stage.draggable(false)

    // Initialize markup layers if they don't exist
    if (!markupLayer) {
      markupLayer = new Konva.Layer()
      stage.add(markupLayer)
    }

    if (!markupGroup) {
      markupGroup = new Konva.Group()
      markupLayer.add(markupGroup)
    }

    const requestData: GetMarkupDataInput = {
      dLSessionId: route.params.id.toString(),
      extractedResourceId: props.resourceData.id,
    }
    $client.dLSession.getMarkupData.useQuery(requestData, {
      transform: (response) => {
        loadSavedMarkup(response!.markupData)
      },
    })

    markupGroup.visible(true)
    markupLayerAdded()

    // Add mouse event listeners to stage for markup functionality
    stage.on('mousedown', markupHandleMouseDown)
    stage.on('mousemove', markupHandleMouseMove)
    stage.on('mouseup', markupHandleMouseUp)
    stage.on('mouseenter', markupHandleMouseEnter)
    stage.on('mouseleave', markupHandleMouseLeave)
  }
  else {
    stage.draggable(true)
    if (markupGroup) {
      markupGroup.visible(false)
    }

    // Remove mouse event listeners
    stage.off('mousedown', markupHandleMouseDown)
    stage.off('mousemove', markupHandleMouseMove)
    stage.off('mouseup', markupHandleMouseUp)
    stage.off('mouseenter', markupHandleMouseEnter)
    stage.off('mouseleave', markupHandleMouseLeave)
  }
}

const canUndo = computed(() => {
  if (showMarkupPopover.value)
    return markupUndoStack.value.length > 0
  if (showMarkupPopoverGrid.value)
    return markupGridUndoStack.value.length > 0
  return annotationCanUndo.value
})

const canRedo = computed(() => {
  if (showMarkupPopover.value)
    return markupRedoStack.value.length > 0
  if (showMarkupPopoverGrid.value)
    return markupGridRedoStack.value.length > 0
  return annotationCanRedo.value
})

async function handleUndoAction() {
  if (showMarkupPopover.value) {
    await undoMarkupStroke()
    return
  }
  if (showMarkupPopoverGrid.value) {
    await undoMarkupGridStroke()
    return
  }
  if (showTaxonomyMappingModal.value && annotationCanUndo.value)
    undoLastAnnotation()
}

async function handleRedoAction() {
  if (showMarkupPopover.value) {
    await redoMarkupStroke()
    return
  }
  if (showMarkupPopoverGrid.value) {
    await redoMarkupGridStroke()
    return
  }
  if (showTaxonomyMappingModal.value && annotationCanRedo.value)
    redoLastAnnotation()
}


const markupGridPreviewContainer = ref<HTMLDivElement | null>(null)
let markupGridPreviewStage: Konva.Stage
let markupGridPreviewPreviewLayer: Konva.Layer
let gridPreviewLine: any

function markupGridPreviewLayerAdded() {
  nextTick(() => {
    if (!markupGridPreviewContainer.value)
      return

    markupGridPreviewStage = new Konva.Stage({
      container: markupGridPreviewContainer.value,
      width: markupGridPreviewContainer.value.offsetWidth,
      height: 20,
    })
    markupGridPreviewPreviewLayer = new Konva.Layer()
    markupGridPreviewStage.add(markupGridPreviewPreviewLayer)

    gridPreviewLine = new Konva.Line({
      points: [0, 10, 40, 0, 80, 10, 120, 15, 160, 10, 200, 0, 240, 10],
      stroke: 'red',
      strokeWidth: markerThicknessGrid.value ? markerThicknessGrid.value : 5,
      lineCap: 'round',
      lineJoin: 'round',
      bezier: true,
    })

    markupGridPreviewPreviewLayer.add(gridPreviewLine)
    markupGridPreviewPreviewLayer.batchDraw()
  })
}

watch(markerThicknessGrid, (newValue) => {
  if (gridPreviewLine) {
    gridPreviewLine.strokeWidth(newValue)
    markupGridPreviewPreviewLayer.batchDraw()
  }
}, {
  immediate: true,
})

const markupPreviewContainer = ref<HTMLDivElement | null>(null)
let markupPreviewStage: Konva.Stage
let markupPreviewLayer: Konva.Layer
let previewLine: any

function markupLayerAdded() {
  nextTick(() => {
    if (!markupPreviewContainer.value)
      return

    markupPreviewStage = new Konva.Stage({
      container: markupPreviewContainer.value,
      width: markupPreviewContainer.value.offsetWidth,
      height: 20,
    })
    markupPreviewLayer = new Konva.Layer()
    markupPreviewStage.add(markupPreviewLayer)

    previewLine = new Konva.Line({
      points: [0, 10, 40, 0, 80, 10, 120, 15, 160, 10, 200, 0, 240, 10],
      stroke: 'red',
      strokeWidth: markerThickness.value ? markerThickness.value : 5,
      lineCap: 'round',
      lineJoin: 'round',
      bezier: true,
    })

    markupPreviewLayer.add(previewLine)
    markupPreviewLayer.batchDraw()
  })
}

watch(markerThickness, (newValue) => {
  if (previewLine) {
    previewLine.strokeWidth(newValue)
    markupPreviewLayer.batchDraw()
  }
}, {
  immediate: true,
})

const zoomFactor = ref(1) // Start with a default zoom level of 1
const zoomStep = 0.5 // Define how much you want to zoom in or out with each click
const maxZoom = 5 // Define maximum zoom level
const minZoom = 1 // Define minimum zoom level

// function zoomOut(type = 'grid',useMousePosition: boolean = false) {
//   if (zoomFactor.value > minZoom) {
//     zoomFactor.value -= zoomStep
//     if (type == 'annotation') {
//       // Add draggable toggle here too for consistency
//       const drag = zoomFactor.value !== 1
//       stage.draggable(drag)
//       updateAnnotationStageScale(useMousePosition)
//       updateControlPoints(zoomFactor.value)
//     } else {
//       // Add draggable toggle for grid stage
//       const drag = zoomFactor.value !== 1
//       markupGridStage.draggable(drag)
//       updateGridStageScale(useMousePosition)
//     }
//   }
// }

// function zoomIn(type = 'grid',useMousePosition: boolean = false) {
//   if (zoomFactor.value < maxZoom) {
//     zoomFactor.value += zoomStep
//     if (type == 'annotation') {
//       const drag = zoomFactor.value !== 1
//       stage.draggable(drag)
//       updateAnnotationStageScale(useMousePosition)
//       updateControlPoints(zoomFactor.value)
//     } else {
//       // Add draggable toggle for grid stage
//       const drag = zoomFactor.value !== 1
//       markupGridStage.draggable(drag)
//       updateGridStageScale(useMousePosition)
//     }
//   }
// }

function zoomOut(type = 'grid',useMousePosition: boolean = false) {
  if (zoomFactor.value > minZoom) {
    zoomFactor.value -= zoomStep
    if (type == 'annotation') {
      // Add draggable toggle here too for consistency
      const drag = zoomFactor.value !== 1
      stage.draggable(drag)
      updateAnnotationStageScale(useMousePosition)
      updateControlPoints(zoomFactor.value)

      // ADDED: Recalculate bounding box positions after zoom
      Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
        const taxonomy = taxonomyCoordinates.value[taxonomyId]
        if ((taxonomy.type === 'Bounding Box' || taxonomy.type === 'Non-Rotational Bounding Box') && taxonomy.anchors && taxonomy.rect) {
          updateAnchorPositions(taxonomy.anchors, taxonomy.rect, taxonomyId)
        }
      })
    } else {
      // Add draggable toggle for grid stage
      const drag = zoomFactor.value !== 1
      markupGridStage.draggable(drag)
      updateGridStageScale(useMousePosition)
    }
  }
}

function zoomIn(type = 'grid',useMousePosition: boolean = false) {
  if (zoomFactor.value < maxZoom) {
    zoomFactor.value += zoomStep
    if (type == 'annotation') {
      const drag = zoomFactor.value !== 1
      stage.draggable(drag)
      updateAnnotationStageScale(useMousePosition)
      updateControlPoints(zoomFactor.value)

      // ADDED: Recalculate bounding box positions after zoom
      Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
        const taxonomy = taxonomyCoordinates.value[taxonomyId]
        if (taxonomy.type === 'Bounding Box' && taxonomy.anchors && taxonomy.rect) {
          updateAnchorPositions(taxonomy.anchors, taxonomy.rect, taxonomyId)
        }
      })
      
      // ADDED: Recalculate ellipse anchor positions after zoom (similar to bounding boxes)
      Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
        const taxonomy = taxonomyCoordinates.value[taxonomyId]
        if (taxonomy.type === 'Ellipse' && taxonomy.anchors && taxonomy.ellipse) {
          if (taxonomy.rotationDegrees && taxonomy.rotationDegrees !== 0) {
            updateEllipseAnchorPositionWithRotation(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
          } else {
            updateEllipseAnchorPosition(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
          }
        }
      })
    } else {
      // Add draggable toggle for grid stage
      const drag = zoomFactor.value !== 1
      markupGridStage.draggable(drag)
      updateGridStageScale(useMousePosition)
    }
  }
}

// Function to update the stage scale

function resetZoom(type = 'grid') {
  zoomFactor.value = 1
  if (type == 'annotation') {
    stage.draggable(false)
    updateAnnotationStageScale()
    updateControlPoints(zoomFactor.value)

    // ADDED: Recalculate bounding box positions after zoom reset
    Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
      const taxonomy = taxonomyCoordinates.value[taxonomyId]
      if ((taxonomy.type === 'Bounding Box' || taxonomy.type === 'Non-Rotational Bounding Box') && taxonomy.anchors && taxonomy.rect) {
        updateAnchorPositions(taxonomy.anchors, taxonomy.rect, taxonomyId)
      }
    })
    
    // ADDED: Recalculate ellipse anchor positions after zoom reset (similar to bounding boxes)
    Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
      const taxonomy = taxonomyCoordinates.value[taxonomyId]
      if (taxonomy.type === 'Ellipse' && taxonomy.anchors && taxonomy.ellipse) {
        if (taxonomy.rotationDegrees && taxonomy.rotationDegrees !== 0) {
          updateEllipseAnchorPositionWithRotation(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
        } else {
          updateEllipseAnchorPosition(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
        }
      }
    })
  } else {
    markupGridStage.draggable(false)
    updateGridStageScale()
  }
}

function updateGridStageScale(useMousePosition: boolean = false) {
  const stage = markupGridStage

  if (useMousePosition) {
    // Mouse-based zoom for Ctrl + Scroll
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    stage.scale({ x: zoomFactor.value, y: zoomFactor.value })

    const newPos = {
      x: pointer.x - mousePointTo.x * zoomFactor.value,
      y: pointer.y - mousePointTo.y * zoomFactor.value,
    }

    stage.position(newPos)
  } else {
    // Center-based zoom for icon clicks
    stage.scale({ x: zoomFactor.value, y: zoomFactor.value })

    const newPos = {
      x: stage.width() / 2 - (stage.width() / 2) * zoomFactor.value,
      y: stage.height() / 2 - (stage.height() / 2) * zoomFactor.value,
    }
    stage.position(newPos)
  }

  limitPan(stage)
  stage.batchDraw()
}


function updateAnnotationStageScale(useMousePosition: boolean = false) {
  if (useMousePosition) {
    // Mouse-based zoom for Ctrl + Scroll
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    stage.scale({ x: zoomFactor.value, y: zoomFactor.value })

    const newPos = {
      x: pointer.x - mousePointTo.x * zoomFactor.value,
      y: pointer.y - mousePointTo.y * zoomFactor.value,
    }

    stage.position(newPos)
  } else {
    // Center-based zoom for icon clicks
    stage.scale({ x: zoomFactor.value, y: zoomFactor.value })

    const newPos = {
      x: stage.width() / 2 - (stage.width() / 2) * zoomFactor.value,
      y: stage.height() / 2 - (stage.height() / 2) * zoomFactor.value,
    }
    stage.position(newPos)
  }

  // Clamp the position after zoom
  const bounded = getBoundedPosition(stage, stage.position());
  stage.position(bounded);

  limitPan(stage)

  // ADDED: Recalculate all bounding box anchor positions after zoom change
  Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
    const taxonomy = taxonomyCoordinates.value[taxonomyId]
    if (taxonomy.type === 'Bounding Box' && taxonomy.anchors && taxonomy.rect) {
      updateAnchorPositions(taxonomy.anchors, taxonomy.rect, taxonomyId)
    }
  })

  // ADDED: Recalculate all ellipse anchor positions after zoom change (similar to bounding boxes)
  Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
    const taxonomy = taxonomyCoordinates.value[taxonomyId]
    if (taxonomy.type === 'Ellipse' && taxonomy.anchors && taxonomy.ellipse) {
      if (taxonomy.rotationDegrees && taxonomy.rotationDegrees !== 0) {
        updateEllipseAnchorPositionWithRotation(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
      } else {
        updateEllipseAnchorPosition(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
      }
    }
  })

  stage.batchDraw()
}


function limitPan(stageToPan: Konva.Stage) {
  const scale = stageToPan.scaleX() // Assuming the scaleX and scaleY are the same for uniform zoom
  const stageWidth = stageToPan.width()
  const stageHeight = stageToPan.height()
  const imageWidth = stageToPan.width() * scale
  const imageHeight = stageToPan.height() * scale
  const position = stageToPan.position()

  const minX = Math.min(0, stageWidth - imageWidth) // Minimum X position limit
  const maxX = 0 // Maximum X position limit
  const minY = Math.min(0, stageHeight - imageHeight) // Minimum Y position limit
  const maxY = 0 // Maximum Y position limit

  const newX = Math.max(minX, Math.min(position.x, maxX))
  const newY = Math.max(minY, Math.min(position.y, maxY))

  stageToPan.position({ x: newX, y: newY })
  stageToPan.batchDraw()
}

// Update control points based on zoom level

function updateControlPoints(newZoom: number) {
  if (!stage) return;

  // Validate zoom factor
  if (typeof newZoom !== 'number' || newZoom <= 0 || newZoom > 10) {
    return;
  }

  // ✅ Use getScaledSize for ALL elements - consistent scaling
  const safeStrokeWidth = getScaledSize(initialControlStroke);
  const safeAnchorRadius = getScaledSize(initialAnchorRadius);
  const safeCrosshairSize = getScaledSize(initialCrosshairSize);
  const safeRotatingAnchorRadius = getScaledSize(initialRotatingAnchorRadius);
  const safeFontSize = getScaledSize(14);
  const safeLineDash = [getScaledSize(10), getScaledSize(5)];
  const safeEllipseDash = [getScaledSize(2), getScaledSize(2)];
  const safeAngleLineDash = [getScaledSize(2), getScaledSize(2)];

  // Update all circles (landmarks, anchors, etc)
  stage.find('Circle').forEach((circle: Konva.Circle) => {
    if (circle.hasName('rotation')) {
      const parent = circle.getParent();

      if (parent && parent.getClassName() === 'Group') {
        const rotation = parent.rotation();
        const rotationRadians = (rotation * Math.PI) / 180;

        const scaledCrosshairSize = getScaledSize(10);
        const scaledOffset = getScaledSize(15);
        const anchorDistance = scaledCrosshairSize + scaledOffset;

        const newAnchorX = Math.sin(rotationRadians) * anchorDistance;
        const newAnchorY = -Math.cos(rotationRadians) * anchorDistance;

        circle.position({
          x: newAnchorX,
          y: newAnchorY
        });
      }

      circle.radius(safeRotatingAnchorRadius);
      circle.strokeWidth(safeStrokeWidth);
    } else {
      circle.radius(safeAnchorRadius);
      circle.strokeWidth(safeStrokeWidth);
    }
  });

  // Update rectangles (bounding boxes)
  stage.find('Rect').forEach((rect: Konva.Rect) => {
    rect.strokeWidth(safeStrokeWidth);
    if (rect.hasName('anchor') || rect.hasName('control')) {
      const newSize = safeAnchorRadius * 2;
      rect.width(newSize);
      rect.height(newSize);
      rect.offsetX(newSize / 2);
      rect.offsetY(newSize / 2);
    }
  });

  // Update line sizes
  stage.find('Line').forEach((line: Konva.Line) => {
    line.strokeWidth(safeStrokeWidth);
    if (line.hasName('measurementCrosshair')) {
      const size = safeCrosshairSize;
      if (Math.abs(line.points()[1] - line.points()[3]) < 0.001) {
        line.points([-size/2, 0, size/2, 0]);
      } else {
        line.points([0, -size/2, 0, size/2]);
      }
    }
    else if (line.hasName('measurementLine')) {
      line.strokeWidth(safeStrokeWidth);
      if (line.dash()) {
        line.dash(safeLineDash);
      }
    }
    else if (line.hasName('angleLine')) {
      line.strokeWidth(safeStrokeWidth);
      if (line.dash()) {
        line.dash(safeAngleLineDash);
      }
    }
    else {
      line.strokeWidth(safeStrokeWidth);
    }
  });

  // Update ellipse sizes
  stage.find('Ellipse').forEach((ellipse: Konva.Ellipse) => {
    ellipse.strokeWidth(safeStrokeWidth);
    if (ellipse.dash()) {
      ellipse.dash(safeEllipseDash);
    }
  });

  // Update text labels
  stage.find('Text').forEach((text: Konva.Text) => {
    text.fontSize(safeFontSize);

    if (text.hasName('landMark')){
      text.x(-10 / newZoom)
      text.y(20 / newZoom)
    }

    if (text.id().includes('Text')) {
      const taxonomyId = text.id().replace('Text', '');
      const taxonomy = taxonomyCoordinates.value[taxonomyId];
      if (taxonomy && (taxonomy.type === 'Bounding Box' || taxonomy.type === 'Non-Rotational Bounding Box') && taxonomy.rect) {
        updateBBLabelPosition(text, taxonomy.rect);
      }
    }

    // Keep ellipse abbreviation label centered after zoom/font-size changes.
    // Without this, the label can "drift" because text metrics update with fontSize.
    if (text.id().endsWith('label')) {
      const taxonomyId = text.id().slice(0, -'label'.length)
      const taxonomy = taxonomyCoordinates.value[taxonomyId]
      if (taxonomy && taxonomy.type === 'Ellipse' && taxonomy.ellipse) {
        updateEllipseLabelPosition(text, taxonomy.ellipse)
      }
    }
  });

  // Recalculate bounding box positions
  Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
    const taxonomy = taxonomyCoordinates.value[taxonomyId]
    if ((taxonomy.type === 'Bounding Box' || taxonomy.type === 'Non-Rotational Bounding Box') && taxonomy.anchors && taxonomy.rect) {
      updateAnchorPositions(taxonomy.anchors, taxonomy.rect, taxonomyId)
    }
  })

  // Recalculate ellipse anchor positions (similar to bounding boxes)
  Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
    const taxonomy = taxonomyCoordinates.value[taxonomyId]
    if (taxonomy.type === 'Ellipse' && taxonomy.anchors && taxonomy.ellipse) {
      // Update anchor positions based on rotation state
      if (taxonomy.rotationDegrees && taxonomy.rotationDegrees !== 0) {
        updateEllipseAnchorPositionWithRotation(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
      } else {
        updateEllipseAnchorPosition(taxonomy.anchors, taxonomy.ellipse, taxonomyId)
      }
      
      // Update ellipse anchor visual sizes to maintain constant appearance (like bounding box anchors)
      const scaledCrossSize = getScaledSize(5)
      const scaledStrokeWidth = getScaledSize(2)
      
      if (taxonomy.anchors.topAnchor) {
        updateEllipseAnchorSize(taxonomy.anchors.topAnchor, scaledCrossSize, scaledStrokeWidth)
      }
      if (taxonomy.anchors.bottomAnchor) {
        updateEllipseAnchorSize(taxonomy.anchors.bottomAnchor, scaledCrossSize, scaledStrokeWidth)
      }
      if (taxonomy.anchors.leftAnchor) {
        updateEllipseAnchorSize(taxonomy.anchors.leftAnchor, scaledCrossSize, scaledStrokeWidth)
      }
      if (taxonomy.anchors.rightAnchor) {
        updateEllipseAnchorSize(taxonomy.anchors.rightAnchor, scaledCrossSize, scaledStrokeWidth)
      }
    }
  })

  stage.batchDraw();

  // Konva sometimes updates Text metrics (width/height) on the next frame after fontSize changes.
  // That can cause ellipse labels to "drift" when zooming. Do a post-draw recenter using latest bounds.
  globalThis.requestAnimationFrame?.(() => {
    try {
      Object.keys(taxonomyCoordinates.value).forEach((taxonomyId) => {
        const taxonomy = taxonomyCoordinates.value[taxonomyId]
        if (!taxonomy || taxonomy.type !== 'Ellipse' || !taxonomy.ellipse)
          return

        const labelNode = layer?.findOne((node: any) => node?.getClassName?.() === 'Text' && node?.id?.() === `${taxonomyId}label`) as Konva.Text | null
        if (labelNode)
          updateEllipseLabelPosition(labelNode, taxonomy.ellipse)
      })
      stage.batchDraw()
    }
    catch {
      // no-op: best-effort UI positioning
    }
  })
}
// Updata the scaled size
function getScaledSize(baseSize) {
  // Add minimum constraint to ensure elements remain visible at high zoom levels
  return Math.max(baseSize / zoomFactor.value, 0.5);
}
// Ctrl/Cmd + Scroll to zoom in/out relative to mouse position.
function handleWheel(event: WheelEvent) {
  // Support both Ctrl (Windows/Linux) and Cmd (Mac/iOS) keys
  if (!event.ctrlKey && !event.metaKey) return
  event.preventDefault()
  const isAnnotationView = showTaxonomyMappingModal.value

  if (isAnnotationView && isLock.value) return
  if (!isAnnotationView && isVisualizationLock.value) return

  if (event.deltaY > 0)
    zoomOut(isAnnotationView ? 'annotation' : 'grid',true)
   else
    zoomIn(isAnnotationView ? 'annotation' : 'grid',true)
}
const handleEscPress = () => {
  if (hasUnsavedChanges.value) {
    showUnsavedChangesModal.value = true
    pendingAction.value = () => {
      onAfterLeaveTaxonomyModal()
    }
  } else {
    triggerPopconfirm()
  }
}
const popconfirmRef = ref(null)
const triggerPopconfirm = () => {
  // Check if there are unsaved changes
  if (hasUnsavedChanges.value) {
    // Show unsaved changes confirmation
    showUnsavedChangesModal.value = true
    pendingAction.value = () => {
      onAfterLeaveTaxonomyModal()
    }
  } else {
    // No unsaved changes, trigger the popconfirm
    popconfirmRef.value?.setShow(true)
  }
}

function updateCrossbarRotation(anchor, landmark, crosshair, x, y, taxonomyId) {
  const stage = crosshair.getStage();
  const transform = stage.getAbsoluteTransform().copy().invert();
  const scale = stage.scaleX();

  // Transform coordinates
  const stagePoint = transform.point({x, y});
  const centerPoint = transform.point(crosshair.getAbsolutePosition());

  // Calculate angle from center to mouse position
  let angleRadians = Math.atan2(
    (stagePoint.y - centerPoint.y) / scale,
    (stagePoint.x - centerPoint.x) / scale
  );

  // Convert to degrees and normalize to 0-360 range
  let angleDegrees = (angleRadians * 180 / Math.PI + 90) % 360;  // Add 90 to align with vertical
  if (angleDegrees < 0) angleDegrees += 360;

  // Get current rotation normalized to 0-360
  let currentRotation = crosshair.rotation() % 360;
  if (currentRotation < 0) currentRotation += 360;

  // Calculate shortest rotation path
  let diff = angleDegrees - currentRotation;
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }

  // Apply smooth rotation with rate limiting
  const smoothFactor = 0.8;
  const maxRotationDelta = 15;
  const clampedDiff = Math.max(Math.min(diff * smoothFactor, maxRotationDelta), -maxRotationDelta);

  let finalRotation = currentRotation + clampedDiff;

  // Normalize to 0-360
  finalRotation = finalRotation % 360;
  if (finalRotation < 0) finalRotation += 360;

  // Apply rotation to crosshair
  crosshair.rotation(finalRotation);

  // FIX 5: Update the rotation anchor position to follow the rotation
  const rotationRadians = (finalRotation * Math.PI) / 180;
  const scaledCrosshairSize = getScaledSize(10);
  const scaledOffset = getScaledSize(15);
  const anchorDistance = scaledCrosshairSize + scaledOffset;

  // Calculate new anchor position
  const newAnchorX = Math.sin(rotationRadians) * anchorDistance;
  const newAnchorY = -Math.cos(rotationRadians) * anchorDistance;

  // Update anchor position
  anchor.position({
    x: newAnchorX,
    y: newAnchorY
  });

  // Update stored rotation value
  if (taxonomyCoordinates.value[taxonomyId]) {
    taxonomyCoordinates.value[taxonomyId].rotation = finalRotation;
  }
}
const renderTaxonomyType = (val) => {
    if (val.taxonomyType.name === "Landmark") {
      return val.changeAppearance ? "Crossbar" : "Landmark";
    }
    return val.taxonomyType.name;
  };

/**
 * Toggle sort order for a specific taxonomy/group
 * Cycles through: asc -> desc -> annotated -> asc
 * @param taxonomyIndex - The index of the taxonomy/group to toggle sort order for
 */
const toggleSortOrder = (taxonomyIndex: number) => {
  const currentOrder = sortOrderMap.value.get(taxonomyIndex) || 'asc';
  let newOrder: 'asc' | 'desc' | 'annotated';
  
  // Cycle through: asc -> desc -> annotated -> asc
  if (currentOrder === 'asc') {
    newOrder = 'desc';
  } else if (currentOrder === 'desc') {
    newOrder = 'annotated';
  } else {
    newOrder = 'asc';
  }
  
  sortOrderMap.value.set(taxonomyIndex, newOrder);
  // Clear manual order for this specific taxonomy when toggling sort - user wants to sort by name instead
  manualOrderMap.value.delete(taxonomyIndex);
  // Also clear database order for this taxonomy so it uses name-based sorting instead of saved order
  const taxonomies = Array.isArray(fetchTaxonomies.value) ? fetchTaxonomies.value : [fetchTaxonomies.value];
  const taxonomy = taxonomies[taxonomyIndex];
  if (taxonomy?.taxonomy?.id) {
    databaseOrderMap.value.delete(taxonomy.taxonomy.id);
  }
};

/**
 * Get sort order for a specific taxonomy/group
 * @param taxonomyIndex - The index of the taxonomy/group
 * @returns The sort order for the group ('asc', 'desc', or 'annotated'), defaults to 'asc'
 */
const getSortOrder = (taxonomyIndex: number): 'asc' | 'desc' | 'annotated' => {
  return sortOrderMap.value.get(taxonomyIndex) || 'asc';
};

// Track manual order for each taxonomy (by index) - for in-memory reordering
const manualOrderMap = ref<Map<number, string[]>>(new Map());

// Sort taxonomy items by database order, manual order, or name
const getSortedTaxonomyItems = (items: any[], taxonomyIndex?: number) => {
  // Always return an array, even if items is invalid
  if (!items || !Array.isArray(items)) return [];
  
  // Get taxonomyId from taxonomyIndex
  let taxonomyId: string | undefined;
  if (taxonomyIndex !== undefined) {
    const taxonomies = Array.isArray(fetchTaxonomies.value) ? fetchTaxonomies.value : [fetchTaxonomies.value];
    const taxonomy = taxonomies[taxonomyIndex];
    taxonomyId = taxonomy?.taxonomy?.id;
  }
  
  // Priority 1: Use manual order (in-memory reordering during current session)
  if (taxonomyIndex !== undefined) {
    const manualOrder = manualOrderMap.value.get(taxonomyIndex);
    if (manualOrder && manualOrder.length === items.length) {
      // Verify all IDs still exist
      const itemIds = items.map((item: any) => item.id);
      const allIdsExist = manualOrder.every(id => itemIds.includes(id));
      
      if (allIdsExist) {
        // Return items in manual order
        return manualOrder.map(id => items.find((item: any) => item.id === id)).filter(Boolean);
      } else {
        // Clean up invalid manual order
        manualOrderMap.value.delete(taxonomyIndex);
      }
    }
  }
  
  // Priority 2: Use database order (persistent ordering - user-specific and session-specific)
  if (taxonomyId) {
    const databaseOrder = databaseOrderMap.value.get(taxonomyId);
    if (databaseOrder && databaseOrder.length > 0) {
      // Map database order (taxonomiesAnnotationsInDLSessionsId) to items
      const orderedItems: any[] = [];
      const remainingItems = [...items];
      
      // First, add items in database order
      for (const annotationId of databaseOrder) {
        const item = remainingItems.find((item: any) => item.taxonomiesAnnotationsInDLSessionsId === annotationId);
        if (item) {
          orderedItems.push(item);
          // Remove from remaining items
          const index = remainingItems.indexOf(item);
          if (index > -1) {
            remainingItems.splice(index, 1);
          }
        }
      }
      
      // Add any remaining items that weren't in the database order
      if (orderedItems.length > 0 && remainingItems.length > 0) {
        // Sort remaining items by name and append
        const sortedRemaining = remainingItems.sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        orderedItems.push(...sortedRemaining);
        return orderedItems;
      } else if (orderedItems.length > 0) {
        return orderedItems;
      }
    }
  }
  
  // Priority 3: Default to name sorting using the specific group's sort order
  const groupSortOrder = taxonomyIndex !== undefined ? getSortOrder(taxonomyIndex) : 'asc';
  
  // Helper function to check if an annotation is annotated
  const isAnnotated = (item: any): boolean => {
    // Check if item has ChildTaxonomyDataInDLSessions with data
    if (item.ChildTaxonomyDataInDLSessions && item.ChildTaxonomyDataInDLSessions.length > 0) {
      const sessionData = item.ChildTaxonomyDataInDLSessions[0];
      // Check if it has taxonomyData or exists in taxonomyCoordinates
      if (sessionData?.taxonomyData || (sessionData?.id && taxonomyCoordinates.value[sessionData.id])) {
        return true;
      }
    }
    // Also check by taxonomiesAnnotationsInDLSessionsId
    if (item.taxonomiesAnnotationsInDLSessionsId && taxonomyCoordinates.value[item.taxonomiesAnnotationsInDLSessionsId]) {
      return true;
    }
    return false;
  };
  
  const sorted = [...items].sort((a, b) => {
    // If sort order is 'annotated', sort by annotation status first, then by name
    if (groupSortOrder === 'annotated') {
      const aAnnotated = isAnnotated(a);
      const bAnnotated = isAnnotated(b);
      
      // Annotated items come first
      if (aAnnotated && !bAnnotated) return -1;
      if (!aAnnotated && bAnnotated) return 1;
      
      // If both have same annotation status, sort by name
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    }
    
    // For 'asc' and 'desc', sort by name
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    
    if (groupSortOrder === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
  
  return sorted;
};

const handleTaxonomyReorder = async (taxonomyIndex: number, event: { oldIndex: number; newIndex: number; item: any }) => {
  const { oldIndex, newIndex } = event;
  
  if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
    return;
  }
  
  // Handle both array and object cases for fetchTaxonomies
  let taxonomy: any = null;
  if (Array.isArray(fetchTaxonomies.value)) {
    taxonomy = fetchTaxonomies.value[taxonomyIndex];
  } else if (fetchTaxonomies.value && typeof fetchTaxonomies.value === 'object') {
    // If it's an object, get values as array
    const taxonomiesArray = Object.values(fetchTaxonomies.value);
    taxonomy = taxonomiesArray[taxonomyIndex];
  }
  
  if (!taxonomy || !taxonomy.taxonomy?.typesInTaxonomies) {
    return;
  }
  
  const items = taxonomy.taxonomy.typesInTaxonomies;
  const sessionId = route.params.id.toString();
  
  // Reorder the array
  const [movedItem] = items.splice(oldIndex, 1);
  items.splice(newIndex, 0, movedItem);
  
  // Update manual order map (for immediate UI update)
  const newOrder = items.map((item: any) => item.id);
  manualOrderMap.value.set(taxonomyIndex, newOrder);
  
  // Collect all annotation orders from all taxonomies
  // Include taxonomyId, taxonomyOrder, and groupId for each annotation
  const allOrders: Array<{ annotationId: string; order: number; taxonomyId?: string; taxonomyOrder?: number; groupId?: number }> = [];
  const taxonomies = Array.isArray(fetchTaxonomies.value) ? fetchTaxonomies.value : [fetchTaxonomies.value];
  
  // Track global order across all taxonomies
  let globalOrder = 1;
  
  taxonomies.forEach((tax: any, idx: number) => {
    if (tax?.taxonomy?.typesInTaxonomies && tax?.taxonomy?.id) {
      const taxonomyId = tax.taxonomy.id;
      const taxonomyItems = tax.taxonomy.typesInTaxonomies;
      const groupId = idx + 1; // Group ID based on taxonomy index (1, 2, ...)
      taxonomyItems.forEach((item: any, itemIndex: number) => {
        if (item.taxonomiesAnnotationsInDLSessionsId) {
          allOrders.push({
            annotationId: item.taxonomiesAnnotationsInDLSessionsId,
            order: globalOrder++, // Global order across all taxonomies
            taxonomyId: taxonomyId, // Taxonomy ID for this annotation
            groupId: groupId, // Group ID (1, 2, ...) based on taxonomy index
          });
        }
      });
    }
  });
  
  // Save all annotation orders to database
  if (allOrders.length > 0) {
    try {
      await $client.dLSession.saveAllAnnotationOrders.mutate({
        dLSessionId: sessionId,
        orders: allOrders,
      });
      
      // Update database order map for all taxonomies using sorted items (preserves manual order)
      taxonomies.forEach((tax: any, idx: number) => {
        if (tax?.taxonomy?.id && tax?.taxonomy?.typesInTaxonomies) {
          // Use sorted taxonomy items to preserve manual/database ordering
          const sortedItems = getSortedTaxonomyItems(tax.taxonomy.typesInTaxonomies, idx);
          const annotationIds = sortedItems
            .map((item: any) => item.taxonomiesAnnotationsInDLSessionsId)
            .filter(Boolean);
          databaseOrderMap.value.set(tax.taxonomy.id, annotationIds);
        }
      });
    } catch (error) {
      // Error saving to database - manual order will still work for this session
      console.error('Error saving annotation order:', error);
    }
  }
};

/**
 * Handle reordering of taxonomy groups (entire taxonomies)
 * Updates UI state and saves groupId (in taxonomyOrder column) for all annotations
 * This function is called automatically when a group is dragged and dropped
 * The changes are immediately saved to the database
 * @param event - Contains oldIndex and newIndex for the reordered taxonomy group
 */
const handleTaxonomyGroupReorder = async (event: { oldIndex: number; newIndex: number; item: any }) => {
  const { oldIndex, newIndex } = event;
  
  // Validate indices
  if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
    return;
  }
  
  // Ensure fetchTaxonomies is an array - convert if needed
  if (!Array.isArray(fetchTaxonomies.value)) {
    if (fetchTaxonomies.value && typeof fetchTaxonomies.value === 'object') {
      fetchTaxonomies.value = Object.values(fetchTaxonomies.value);
    } else {
      return;
    }
  }
  
  if (fetchTaxonomies.value.length === 0) {
    return;
  }
  
  // Store the moved taxonomy before splicing
  const movedTaxonomy = fetchTaxonomies.value[oldIndex];
  
  // Create a new array reference to ensure Vue reactivity
  const newTaxonomiesArray = [...fetchTaxonomies.value];
  newTaxonomiesArray.splice(oldIndex, 1);
  newTaxonomiesArray.splice(newIndex, 0, movedTaxonomy);
  
  // Update fetchTaxonomies with the new array - this ensures reactivity
  fetchTaxonomies.value = newTaxonomiesArray;
  
  // Force reactivity update - ensure Vue detects the change
  await nextTick();
  
  // Update taxonomyOpen state to match new order
  // Note: taxonomyOpen is a reactive object, not a ref, so we access it directly
  const newTaxonomyOpen: Record<number, boolean> = {};
  const currentTaxonomyOpen = taxonomyOpen || {};
  
  newTaxonomiesArray.forEach((_, newIdx) => {
    // Preserve open state from old index if it exists
    const oldState = currentTaxonomyOpen[oldIndex];
    if (newIdx === newIndex) {
      newTaxonomyOpen[newIdx] = oldState ?? false;
    } else if (newIdx < newIndex && newIdx < oldIndex) {
      newTaxonomyOpen[newIdx] = currentTaxonomyOpen[newIdx] ?? false;
    } else if (newIdx > newIndex && newIdx > oldIndex) {
      newTaxonomyOpen[newIdx] = currentTaxonomyOpen[newIdx] ?? false;
    } else if (newIdx < newIndex && newIdx >= oldIndex) {
      newTaxonomyOpen[newIdx] = currentTaxonomyOpen[newIdx + 1] ?? false;
    } else if (newIdx > newIndex && newIdx <= oldIndex) {
      newTaxonomyOpen[newIdx] = currentTaxonomyOpen[newIdx - 1] ?? false;
    }
  });
  
  // Update the reactive object by clearing and setting new values
  Object.keys(taxonomyOpen).forEach(key => delete taxonomyOpen[key as any]);
  Object.assign(taxonomyOpen, newTaxonomyOpen);
  
  // Recalculate and save all annotation orders with updated groupIds (stored in taxonomyOrder)
  const sessionId = route.params.id.toString();
  const allOrders: Array<{ annotationId: string; order: number; taxonomyId?: string; taxonomyOrder?: number; groupId?: number }> = [];
  
  // Track global order across all taxonomies
  let globalOrder = 1;
  
  newTaxonomiesArray.forEach((tax: any, idx: number) => {
    if (tax?.taxonomy?.typesInTaxonomies && tax?.taxonomy?.id) {
      const taxonomyId = tax.taxonomy.id;
      // Use sorted taxonomy items to get the correct order (respects manual/database ordering)
      const taxonomyItems = getSortedTaxonomyItems(tax.taxonomy.typesInTaxonomies, idx);
      
      // Safety check: ensure taxonomyItems is an array
      if (!Array.isArray(taxonomyItems) || taxonomyItems.length === 0) {
        return; // Skip this taxonomy if no items
      }
      
      const groupId = idx + 1; // New groupId based on new taxonomy index (1, 2, ...)
      taxonomyItems.forEach((item: any, itemIndex: number) => {
        if (item?.taxonomiesAnnotationsInDLSessionsId) {
          allOrders.push({
            annotationId: item.taxonomiesAnnotationsInDLSessionsId,
            order: globalOrder++, // Global order across all taxonomies
            taxonomyId: taxonomyId, // Taxonomy ID for this annotation
            groupId: groupId, // Group ID (will be saved in taxonomyOrder column)
          });
        }
      });
    }
  });
  
  // ALWAYS save to database when group is reordered
  // This API call MUST trigger whenever a group is dragged and dropped
  if (allOrders.length > 0) {
    try {
      // This API call saves the group order change to the database
      const result = await $client.dLSession.saveAllAnnotationOrders.mutate({
        dLSessionId: sessionId,
        orders: allOrders,
      });
      
      
      // Update database order map for all taxonomies using sorted items (preserves manual order)
      newTaxonomiesArray.forEach((tax: any, idx: number) => {
        if (tax?.taxonomy?.id && tax?.taxonomy?.typesInTaxonomies) {
          // Use sorted taxonomy items to preserve manual/database ordering
          const sortedItems = getSortedTaxonomyItems(tax.taxonomy.typesInTaxonomies, idx);
          const annotationIds = sortedItems
            .map((item: any) => item.taxonomiesAnnotationsInDLSessionsId)
            .filter(Boolean);
          databaseOrderMap.value.set(tax.taxonomy.id, annotationIds);
        }
      });
      
      // Clear manual order map since group indices have changed
      // The order is now saved in the database, so we can rely on databaseOrderMap
      manualOrderMap.value.clear();
    } catch (error) {
      // Error saving to database - show error but don't revert UI
      throw error; // Re-throw to help with debugging
    }
  }
};

  // Toggle functions
const toggleTaxonomyOpen = async (index) => {
  // Store current scroll position
  const scrollContainer = document.querySelector('.taxonomy-scroll-container')
  const scrollTop = scrollContainer?.scrollTop || 0

  // Store annotation container position
  const annotationPos = annotationContainer.value?.getBoundingClientRect()

  taxonomyOpen[index] = !taxonomyOpen[index]

  // Restore scroll position after DOM update
  await nextTick()
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollTop
  }

  // Ensure annotation container hasn't moved
  if (annotationContainer.value && annotationPos) {
    const currentPos = annotationContainer.value.getBoundingClientRect()
    if (currentPos.left !== annotationPos.left || currentPos.top !== annotationPos.top) {
      // Force position restoration if needed
      annotationContainer.value.style.position = 'relative'
      annotationContainer.value.style.left = '0'
      annotationContainer.value.style.top = '0'
    }
  }
}


// Improved accordion transition for element entering (opening)
function startTransition(el) {
  // Start with 0 height
  el.style.height = '0';
  el.style.overflow = 'hidden';
  // Use cubic-bezier for more natural easing
  el.style.transition = 'height 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
  // Add opacity transition for a fade-in effect
  el.style.opacity = '0';
  el.style.transitionProperty = 'height, opacity';

  // Force a reflow before changing properties
  void el.offsetHeight;

  // Animate to full height and full opacity
  el.style.height = `${el.scrollHeight}px`;
  el.style.opacity = '1';
}

// Improved closing transition
function startLeaveTransition(el) {
  // Store the current height before collapsing
  const height = el.scrollHeight;
  el.style.height = `${height}px`;
  el.style.overflow = 'hidden';
  el.style.opacity = '1';
  el.style.transition = 'height 0.3s cubic-bezier(0.55, 0, 0.75, 0.25), opacity 0.25s ease';

  // Force reflow
  void el.offsetHeight;

  // Collapse and fade out
  el.style.height = '0';
  el.style.opacity = '0';
}

// Clean up after transition completes
function endTransition(el) {

  el.style.height = '';
  el.style.overflow = '';
  el.style.transition = '';
  el.style.opacity = '';
  el.style.transitionProperty = '';
}

const allTaxonomiesOpen = computed(() => {
  if (!fetchTaxonomies.value || fetchTaxonomies.value.length === 0) {
    return false;
  }

  // Check if all taxonomies are open
  return Object.keys(taxonomyOpen).length === fetchTaxonomies.value.length &&
         Object.values(taxonomyOpen).every(isOpen => isOpen === true);
});

// Function to toggle all taxonomies
function toggleAllTaxonomies() {
  const newState = !allTaxonomiesOpen.value;

  // Store current scroll position
  const scrollContainer = document.querySelector('.taxonomy-scroll-container')
  const scrollTop = scrollContainer?.scrollTop || 0

  // Store annotation container position
  const annotationPos = annotationContainer.value?.getBoundingClientRect()

  if (fetchTaxonomies.value) {
    fetchTaxonomies.value.forEach((_, index) => {
      taxonomyOpen[index] = newState;
    });
  }

  // Use nextTick to wait for DOM updates
  nextTick(() => {
    // Restore scroll position
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollTop
    }

    // Ensure annotation container hasn't moved
    if (annotationContainer.value && annotationPos) {
      const currentPos = annotationContainer.value.getBoundingClientRect()
      if (currentPos.left !== annotationPos.left || currentPos.top !== annotationPos.top) {
        // Force position restoration if needed
        annotationContainer.value.style.position = 'relative'
        annotationContainer.value.style.left = '0'
        annotationContainer.value.style.top = '0'
      }
    }
  })
}

// If you need to ensure the taxonomyOpen reactive object is initialized properly,
// make sure this is done when fetchTaxonomies changes:
watch(() => fetchTaxonomies.value, (newTaxonomies) => {
  if (newTaxonomies && newTaxonomies.length) {
    newTaxonomies.forEach((_, index) => {
      if (taxonomyOpen[index] === undefined) {
        taxonomyOpen[index] = true;
      }
    });
  }
}, { immediate: true });

// --- Add after other top-level functions, before <template> ---

function setupDisplayChangeDetection() {
  // Using matchMedia for display changes
  const mediaQuery = window.matchMedia('(width)')
  mediaQuery.addEventListener('change', () => {
    refreshAnnotationData()
  })

  // Add resize event listener with debounce
  let resizeTimeout: ReturnType<typeof setTimeout>;
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const widthChange = Math.abs(lastWidth - window.innerWidth)
      const heightChange = Math.abs(lastHeight - window.innerHeight)
      if (widthChange > 100 || heightChange > 100) {
        refreshAnnotationData()
      }
      lastWidth = window.innerWidth
      lastHeight = window.innerHeight
    }, 250)
  })
}

async function refreshAnnotationData() {
  if (showTaxonomyMappingModal.value && currentImage.value) {
    const currentZoom = zoomFactor.value
    await openTaxonomyMappingModel(currentImage.value)
    if (currentZoom !== 1) {
      zoomFactor.value = currentZoom
      updateAnnotationStageScale()
      updateControlPoints(currentZoom)
    }
  }
}

// ADDED: Recalculate bounding box positions after zoom reset with nextTick wrapper
nextTick(() => {
  Object.keys(taxonomyCoordinates.value).forEach(taxonomyId => {
    const taxonomy = taxonomyCoordinates.value[taxonomyId]
    if (taxonomy.type === 'Bounding Box' && taxonomy.anchors && taxonomy.rect) {
      updateAnchorPositions(taxonomy.anchors, taxonomy.rect, taxonomyId)
    }
  })
})
</script>

<template>
  <div class="flex flex-col">
    <div
      ref="parentContainerGrid"
      class="relative"
      :style="{ filter: `brightness(${visualization.brightness}) contrast(${visualization.contrast}) ${isImageInverted ? 'grayscale(100%) invert(100%)' : ''}` }"
    >
      <img
        ref="selectedImage"
        draggable="false"
        :src="resourceData?.fullPath"
        :alt="resourceData?.id ? `Medical scan, resource ID ${resourceData.id}` : 'Medical scan'"
        class="object-contain w-full h-auto bg-black border border-black"
        :style="{
          visibility: 'hidden',
          filter: `brightness(${visualization.brightness}) contrast(${visualization.contrast}) ${isImageInverted ? 'grayscale(100%) invert(100%)' : ''}`,
          aspectRatio: `1`,
        }"
      >
      <div ref="gridContainer" class="absolute top-0 left-0 w-full h-full bg-black" />
      <svg
        v-if="eraserModeLabelGrid === 'Eraser Mode' && showMarkupPopoverGrid && mouseEnterGrid"
        ref="cursorSmallGrid"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" class="absolute top-0 left-0 w-full h-full cursor pencil-icon-svg mb-[10px]"
        :style="{ opacity: 0 }"
      >
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 20h4L18.5 9.5a1.5 1.5 0 0 0-4-4L4 16v4" />
          <path d="M13.5 6.5l4 4" />
        </g>
      </svg>
      <svg
        v-if="eraserModeLabelGrid === 'Marker Mode' && showMarkupPopoverGrid && mouseEnterGrid"
        ref="cursorBigGrid"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute top-0 left-0 w-full h-full cursor eraser-icon-svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
        :style="{ opacity: 0 }"
      >
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 19H8l-4-4a1 1 0 0 1 0-1.41l10-10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9 9" />
          <path d="M18 12.3L11.7 6" />
        </g>
      </svg>
    </div>
    <div class="flex flex-col items-center justify-start w-full gap-2 mb-4">
      <div class="flex justify-center px-1 mt-1 gap-1">
        <div class="w-20 flex justify-center items-center">
          <NButton
            v-if="!isVisualizationLock"
            size="small"
            data-testid="dl-visualization-lock-button"
            @click="isVisualizationLock = !isVisualizationLock"
          >
            Lock
          </NButton>
          <NButton
            v-else
            size="small"
            data-testid="dl-visualization-unlock-button"
            @click="isVisualizationLock = !isVisualizationLock"
          >
            Unlock
          </NButton>
        </div>
        <div class="flex flex-row items-center justify-center px-0 mt-1 gap-x-[0.4rem]">
          <NButton
            data-testid="dl-annotation-button"
            @click="openTaxonomyMappingModel(resourceData)"
          >
            Annotation
          </NButton>
          <NCheckbox
            data-testid="dl-invert-color-checkbox"
            v-model:checked="isImageInverted"
            :disabled="isVisualizationLock"
          >
            Invert Color
          </NCheckbox>
        </div>
        <div class="flex flex-row justify-center items-center px-0 mt-1 gap-2">
          <NTooltip trigger="hover">
            <template #trigger>
              <Icon name="ph:magnifying-glass-plus" :class="`${isVisualizationLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl  text-neutral-500 hover:text-neutral-300 outline-0`" @click="!isVisualizationLock ? zoomIn() : ''" />
            </template>
            Zoom in
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <Icon name="ph:magnifying-glass-minus" :class="`${isVisualizationLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-neutral-500 hover:text-neutral-300 outline-0`" @click="!isVisualizationLock ? zoomOut() : ''" />
            </template>
            Zoom out
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <Icon name="ph:arrow-clockwise" :class="`${isVisualizationLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-neutral-500 hover:text-neutral-300 outline-0`" @click="!isVisualizationLock ? resetZoom() : ''" />
            </template>
            Reset zoom
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <Icon name="ph:arrows-clockwise" :class="`${isVisualizationLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-neutral-500 hover:text-neutral-300 outline-0`" @click="!isVisualizationLock ? rotateImage('main') : ''" />
            </template>
            Rotate clockwise
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <svg style="width:24px;height:24px" :class="`${isVisualizationLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-neutral-500 hover:text-neutral-300 outline-0`" viewBox="0 0 24 24" @click="!isVisualizationLock ? flipImage('main') : ''">
                <path
                  d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"
                  fill="currentColor"
                />
              </svg>
            </template>
            Flip
          </NTooltip>
        </div>
        <div class="flex flex-row justify-center items-center">
          <NPopover trigger="manual" :show="showMarkupPopoverGrid" placement="bottom" :disabled="canSaveTaxonomyAtApprovalLevel">
            <template #trigger>
              <Icon name="ph:pencil" class="flex-none text-xl text-neutral-500 cursor-pointer outline-none" @click="togglePopoverGrid" />
            </template>
            <div class="flex items-center gap-2 w-full">
              <div class="flex flex-col gap-1">
                <div ref="markupGridPreviewContainer" class="w-full" />
                <div class="flex flex-row items-center gap-2">
                  <label class="w-[20px]" for="thickness-grid">{{ markerThicknessGrid }}</label>
                  <input id="thickness-grid" v-model="markerThicknessGrid" type="range" min="1" max="30">
                </div>
              </div>
              <div class="w-[6rem] flex flex-row gap-2 items-center">
                <NColorPicker v-model:value="markerColorGrid" class="mx-2" :show-alpha="false" />
              </div>
              <div class="w-[110px]">
                <NButton
                  :disabled="canSaveTaxonomyAtApprovalLevel || isVisualizationLock"
                  data-testid="dl-marker-mode-toggle-button"
                  @click="toggleEraserModeGrid"
                >
                  {{ eraserModeLabelGrid }}
                </NButton>
              </div>
              <div>
                <NPopconfirm
                  positive-text="Yes"
                  negative-text="No"
                  @positive-click="clearCanvasGrid"
                >
                  <template #trigger>
                    <button>Clear</button>
                  </template>
                  Are you sure you want to clear?
                </NPopconfirm>
              </div>
            </div>
          </NPopover>
        </div>
      </div>
      <div class="inline-flex items-center justify-center w-full gap-4 px-2">
        <div class="inline-flex items-center justify-start w-full gap-2">
          <Icon name="ph:sun-bold" class="flex-none text-xl text-neutral-500" />
          <p>
            {{ visualization.brightness }}
          </p>
          <input
            v-model="visualization.brightness"
            :disabled="isVisualizationLock" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
            min="0"
          >
          <Icon
            name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-500"
            @click="!isVisualizationLock ? visualization.brightness = 1 : ''"
          />
        </div>
        <div class="inline-flex items-center justify-start w-full gap-2">
          <Icon name="ph:circle-half-tilt-bold" class="flex-none text-xl text-neutral-500" />
          <p class="flex-none">
            {{ visualization.contrast }}
          </p>
          <input
            v-model="visualization.contrast"
            :disabled="isVisualizationLock" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
            min="0"
          >
          <Icon
            name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-500"
            @click="!isVisualizationLock ? visualization.contrast = 1 : ''"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-between items-center p-2">
      <h5
        :class="[
          resourceData.status === 'PENDING' ? 'text-neutral-500' : '',
          resourceData.status === 'IN_REVIEW' ? 'text-warning-500' : '',
          resourceData.status === 'ACCEPTED' ? 'text-confirm-500' : '',
          resourceData.status === 'REJECTED' ? 'text-error-500' : '',
        ]"
      >
        {{ resourceData.status }} STATUS
      </h5>
      <h5 class="text-neutral-400 text-sm">
        {{ formatTime(timeSpent) }}
      </h5>
    </div>
    <span class="p-2 text-sm italic break-all">
      {{ resourceData.id }}
      <Icon
        name="ph:copy" class="text-2xl ml-[5px] outline-[0px] cursor-pointer text-neutral-500 hover:text-neutral-200"
        @click="copyExtractedResourcesId(resourceData.id)"
      />
    </span>
    <div class="flex flex-col p-2">
      <NInput
        v-model:value="inputText"
        type="textarea"
        placeholder="Comment"
        class="text-[15px]"
        @update:value="handleInput"
      />
    </div>

    <NModal
      v-model:show="showTaxonomyMappingModal"
      :mask-closable="false"
      @mask-click="triggerPopconfirm"
      :close-on-esc="false"
      :on-esc="triggerPopconfirm"
    >
      <NCard
        class="w-[95%]"
        title=""
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        >
        <template #header-extra>
  <div class="flex items-center gap-4">
    <NButton
      quaternary
      type="info"
      size="small"
      @click="toggleAllTaxonomies"
      style="width: 100px;"
    >
      {{ allTaxonomiesOpen ? 'Collapse All' : 'Expand All' }}
    </NButton>
    <Icon
      name="ph-info"
      class="cursor-pointer text-primary-500 text-[24px]"
      @click="handleClick1"
    />
    <NPopconfirm
      v-if="!hasUnsavedChanges"
      ref="popconfirmRef"
      positive-text="Yes"
      negative-text="No"
      @positive-click="onAfterLeaveTaxonomyModal"
    >
      <template #trigger>
        <Icon
          name="ph:x"
          class="cursor-pointer text-gray-500 text-[24px]"
        />
      </template>
      Are you sure you want to close?
    </NPopconfirm>
    <Icon
      v-else
      name="ph:x"
      class="cursor-pointer text-gray-500 text-[24px]"
      @click="onCloseTaxonomyModal"
    />
  </div>
</template>
        <template #header>
          <div v-if="props.resourceData" class="w-full">
            <div v-if="props.stage === 'ACTIVITY'" class="inline-flex items-center justify-around w-full px-8">
              <NButton
                v-if="props.resourceData && props.resourceData.status != 'IN_REVIEW' && props.resourceData.status != 'ACCEPTED' && (props.resourceData.status == 'PENDING' || (props.resourceData.approvalLevel == null && props.resourceData.isReSubmitApprover == true && props.resourceData.status == 'REJECTED'))"
                :strong="true"
                :secondary="true"
                type="primary"
                size="small"
                @click="handleSendToQC([props.resourceData], 'IN_REVIEW')"
              >
                Send Selected for QC
              </NButton>
            </div>

            <div v-if="props.stage === 'QUALITY_CONTROLLER'" class="inline-flex items-center justify-center gap-[10px] w-full px-8 py-2">
              <NButton
                v-if="props.resourceData.status !== 'ACCEPTED'"
                :strong="true"
                :secondary="true"
                type="error"
                size="small"
                :disabled="
                  isRejecting || isAccepting ||
                  (props!.resourceData
                    && (
                      (props!.resourceData.isNextApprover == false && props!.resourceData.isReSubmitApprover == false)
                      || (props!.resourceData.isNextApprover == true && props!.resourceData.isReSubmitApprover == true)
                    ))
                "
                :loading="isRejecting"
                @click="rejectManyExtractedResources([props.resourceData], 'REJECTED')"
              >
                Reject
              </NButton>
              <NButton
                v-if="props.resourceData.status !== 'ACCEPTED'"
                :strong="true"
                :secondary="true"
                type="success"
                size="small"
                :disabled="
                  isAccepting || isRejecting ||
                  (props!.resourceData
                    && (
                      (props!.resourceData.isNextApprover == false && props!.resourceData.isReSubmitApprover == false)
                      || (props!.resourceData.isNextApprover == true && props!.resourceData.isReSubmitApprover == true)
                    ))
                "
                :loading="isAccepting"
                @click="acceptManyExtractedResources([props.resourceData], 'ACCEPTED')"
              >
                Accept
              </NButton>
            </div>
          </div>
        </template>
              <NForm
        :model="newTaxonomyInCESession"
        label-placement="left"
        require-mark-placement="right-hanging"
        size="medium"
        label-width="auto"
      >
        <div class="modal-content-wrapper">
          <!-- Image Panel with Fixed Dimensions -->
          <NFormItem class="image-panel">
            <div class="image-container-wrapper">
              <div
              ref="annotationContainer"
              class="relative h-[100%] w-[70%]"
              :style="{
                minWidth: '300px',
                minHeight: '200px',
                maxWidth: '100%',
                maxHeight: '100%',
                position: 'relative',
                filter: `brightness(${annotationVisualization.brightness}) contrast(${annotationVisualization.contrast}) ${isImageAnnotationInverted ? 'grayscale(100%) invert(100%)' : ''}`
              }"
                @mousemove="handleMouseMove"
                @click="handleClick"
                @mouseup="handleMouseUp"
                @mousedown="handleMouseDown"
                @contextmenu="showLabelMenu"
              >
                <div ref="konvaContainer" class="konva-container" />
                <!-- Status indicator and SVG overlays remain the same -->
                <h5
                  class="absolute top-0 left-0"
                  :class="[
                    props.resourceData.status === 'PENDING' ? 'text-neutral-500' : '',
                    props.resourceData.status === 'IN_REVIEW' ? 'text-yellow-500' : '',
                    props.resourceData.status === 'ACCEPTED' ? 'text-confirm-500' : '',
                    props.resourceData.status === 'REJECTED' ? 'text-error-500' : '',
                  ]"
                >
                  {{ props.resourceData.status }} {{ props.resourceData.status === 'IN_REVIEW' ? `L${String(props.resourceData.approvalLevel)}` : '' }} {{ props.resourceData.status === 'REJECTED' ? `L${String(props.resourceData.approvalLevel + 1)}` : '' }}
                </h5>
                <h5
                  class="absolute top-0 right-0 text-neutral-400 text-xs"
                >
                  {{ formatTime(timeSpent) }}
                </h5>
                <svg
                  v-if="eraserModeLabel === 'Eraser Mode' && showMarkupPopover && mouseEnterAnnotate"
                  ref="cursorSmallAnnotate"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="absolute top-0 bottom-[10px] left-[0px]  w-full h-full cursor pencil-icon-svg mb-[10px]"
                  :style="{ opacity: 0 }"
                >
                  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 20h4L18.5 9.5a1.5 1.5 0 0 0-4-4L4 16v4" />
                    <path d="M13.5 6.5l4 4" />
                  </g>
                </svg>
                <svg
                  v-if="eraserModeLabel === 'Marker Mode' && showMarkupPopover && mouseEnterAnnotate"
                  ref="cursorBigAnnotate"
                  xmlns="http://www.w3.org/2000/svg"
                  class="absolute top-0 left-0 w-full h-full cursor eraser-icon-svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                  :style="{ opacity: 0 }"
                >
                  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 19H8l-4-4a1 1 0 0 1 0-1.41l10-10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9 9" />
                    <path d="M18 12.3L11.7 6" />
                  </g>
                </svg>
              </div>
            </div>
          <div v-if="currentImage" class="product-name flex flex-row justify-start h-[30px] gap-1 flex-wrap absolute bottom-0">
              <p
                v-for="labelId in currentImage!.labelIds"
                :key="labelId"
                class="p-1 font-semibold text-black rounded-b-md"
                :style="`background: ${props.labelColors[labelId] ? props.labelColors[labelId] : 'rgb(115 115 115)'};pointer-events: none`"
              >
                {{ props.labels.find(label => label.id === labelId)?.abbreviation }}
              </p>
            </div>
          </NFormItem>
          <NFormItem class="taxonomy-panel">
            <div class="taxonomy-scroll-container">
              <DraggableList
                :items="taxonomiesArray"
                list-id="taxonomy-groups"
                list-class="w-full"
                item-class="mb-5"
                handle=".taxonomy-group-drag-handle"
                :get-item-key="(item, index) => item?.taxonomy?.id || index"
                @reorder="handleTaxonomyGroupReorder"
              >
                <template #default="{ item, index }">
                  <div class="mb-5">
    <!-- Taxonomy Header (Clickable to toggle) -->
    <div
      class="w-full mb-2 text-[20px] flex items-center gap-3 cursor-pointer"
      @click="toggleTaxonomyOpen(index)"
    >
    <div class="flex items-center gap-2">
      <!-- Drag Handle for Taxonomy Group -->
      <span 
        class="taxonomy-group-drag-handle text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing inline-flex items-center p-1 rounded hover:bg-gray-100 transition-colors select-none"
        title="Click and drag to reorder taxonomy groups"
        @mousedown.stop.prevent
        @touchstart.stop.prevent
        @click.stop.prevent
      >
        <Icon 
          name="ph:dots-six-vertical" 
          class="text-lg pointer-events-none" 
        />
      </span>
  <Icon :name="taxonomyOpen[index] ? 'ph:caret-down-bold' : 'ph:caret-right-bold'" />
{{ item.taxonomy.name }}
</div>
      <Icon 
        :name="getSortOrder(index) === 'asc' ? 'ph:sort-ascending' : 'ph:sort-descending'" 
        class="text-base cursor-pointer hover:text-blue-400 ml-2" 
        @click.stop="toggleSortOrder(index)" 
        :title="getSortOrder(index) === 'asc' ? 'Sort Descending' : getSortOrder(index) === 'desc' ? 'Sort by Annotated' : 'Sort Ascending'"
      />
      <template v-if="Object.keys(taxonomyCoordinates).length">
        <Icon v-show="isGroupSelected(item.taxonomy.typesInTaxonomies)" :class="`text-base ${!isGroupSelected(item.taxonomy.typesInTaxonomies) ? 'cursor-pointer hover:text-yellow-300' : ''}`" name="ph:eye" @click.stop="toggleGroupSelected(item.taxonomy.typesInTaxonomies)" />
        <Icon v-show="!isGroupSelected(item.taxonomy.typesInTaxonomies)" :class="`text-base ${isGroupSelected(item.taxonomy.typesInTaxonomies) ? 'cursor-pointer text-yellow-300' : ''}`" name="ph:eye-slash" @click.stop="toggleGroupSelected(item.taxonomy.typesInTaxonomies)" />
        <Icon v-show="!isGroupLocked(item.taxonomy.typesInTaxonomies)" :class="`text-base ${isGroupLocked(item.taxonomy.typesInTaxonomies) ? 'text-blue-500' : 'hover:text-blue-400 cursor-pointer'}`" name="ph:lock-open" @click.stop="toggleGroupLocked(item.taxonomy.typesInTaxonomies)" />
        <Icon v-show="isGroupLocked(item.taxonomy.typesInTaxonomies)" :class="`text-base ${!isGroupLocked(item.taxonomy.typesInTaxonomies) ? 'hover:text-blue-400' : 'text-blue-500 cursor-pointer'}`" name="ph:lock" @click.stop="toggleGroupLocked(item.taxonomy.typesInTaxonomies)" />
      </template>
      <NPopconfirm
        v-if="Object.keys(taxonomyCoordinates).length"
        :disabled="canSaveTaxonomyAtApprovalLevel"
        positive-text="Yes"
        negative-text="No"
        @positive-click="deleteAllTaxonomyMarking(item)"
      >
        <template #trigger>
          <Icon name="ph:trash" :class="`text-base ${canSaveTaxonomyAtApprovalLevel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`" @click.stop />
        </template>
        Are you sure you want to delete all Taxonomies annotated?
      </NPopconfirm>
    </div>

    <!-- Taxonomy Content (Collapsible) -->
    <transition
      name="smooth-collapse"
      @enter="startTransition"
      @after-enter="endTransition"
      @before-leave="startLeaveTransition"
      @after-leave="endTransition"
    >
      <DraggableList
        v-if="taxonomyOpen[index]"
        :items="getSortedTaxonomyItems(item.taxonomy.typesInTaxonomies, index)"
        :list-id="index"
        list-class="taxonomy-content"
        item-class="flex mb-2 items-center justify-between cursor-pointer"
        handle=".drag-handle"
        @reorder="(event) => handleTaxonomyReorder(index, event)"
      >
        <template #default="{ item: val, index: idx }">
          <div>
            <div class="flex items-center gap-3">
              <!-- Drag Handle -->
              <span 
                class="drag-handle text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing inline-flex items-center p-1 rounded hover:bg-gray-100 transition-colors select-none"
                title="Click and drag to reorder"
                @mousedown.stop.prevent
                @touchstart.stop.prevent
                @click.stop.prevent
              >
                <Icon 
                  name="ph:dots-six-vertical" 
                  class="text-lg pointer-events-none" 
                />
              </span>
              <NPopconfirm
                v-if="Object.keys(taxonomyCoordinates).includes(val.id) && !isSelected(val)"
                :disabled="canSaveTaxonomyAtApprovalLevel"
                positive-text="Yes"
                negative-text="No"
                @positive-click="deleteTaxonomyMarking(val)"
              >
                <template #trigger>
                  <Icon name="ph:trash" :class="`text-base ${canSaveTaxonomyAtApprovalLevel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`" @click.stop />
                </template>
                Are you sure you want to delete?
              </NPopconfirm>
              <Icon v-else class="text-base" />
              <template v-if="Object.keys(taxonomyCoordinates).includes(val.id)">
                <Icon v-show="isSelected(val)" :class="`text-base ${!isSelected(val) ? 'hover:text-yellow-300' : ''} cursor-pointer`" name="ph:eye" @click.stop="toggleSelectedItem(val, item.taxonomy.typesInTaxonomies)" />
                <Icon v-show="!isSelected(val)" :class="`text-base ${isSelected(val) ? 'text-yellow-300' : ''} cursor-pointer`" name="ph:eye-slash" @click.stop="toggleSelectedItem(val, item.taxonomy.typesInTaxonomies)" />
                <Icon v-show="!isLocked(val)" :class="`text-base ${isLocked(val) ? 'text-blue-500' : 'hover:text-blue-400'} cursor-pointer`" name="ph:lock-open" @click.stop="toggleLockedItem(val, item.taxonomy.typesInTaxonomies)" />
                <Icon v-show="isLocked(val)" :class="`text-base ${!isLocked(val) ? 'hover:text-blue-400' : 'text-blue-500'} cursor-pointer`" name="ph:lock" @click.stop="toggleLockedItem(val, item.taxonomy.typesInTaxonomies)" />
              </template>
              <template v-if="!Object.keys(taxonomyCoordinates).includes(val.id)">
                <Icon class="text-base" />
              </template>
              <NCheckbox class="entityChecbox flex flex-row items-center justify-center" :checked="isCheckboxChecked(val.id, item.taxonomy.typesInTaxonomies[0].id)">
                <NButton :class="`${val.id == selectedTaxonomyType.id ? '!text-yellow-300' : ''} text-sm`" :strong="true" :secondary="true" :type="val.id == selectedTaxonomyType.id ? 'primary' : 'default'" size="small" @click.stop="saveLastType(val, false, undefined, item.taxonomy.typesInTaxonomies)">
                           {{ val.name }} - {{renderTaxonomyType(val) }}
                          </NButton>
                <Icon name="ph:plus" class="text-base cursor-pointer text-green-500 ml-2" @click.stop="addChildElement(val)" />
                </NCheckbox>
            </div>

            <!-- Sub-item values section -->
            <div>
              <ul v-if="Object.keys(taxonomyCoordinates).includes(val.id) && val.taxonomyType.name == 'Measurement'" class="list-disc text-[13px] ml-20">
                <li>{{ taxonomyCoordinates[val.id].value }}</li>
              </ul>
              <ul v-if="Object.keys(taxonomyCoordinates).includes(val.id) && Object.keys(taxonomyCoordinates[val.id]).includes('angle') && val.taxonomyType.name == 'Angle'" class="list-disc text-[13px] ml-20">
                <li>{{ `${taxonomyCoordinates[val.id].angle.angleValue.toFixed(1)}°` }}</li>
              </ul>
              <ul v-if="Object.keys(taxonomyCoordinates).includes(val.id) && Object.keys(taxonomyCoordinates[val.id]).includes('leftRightValue') && val.taxonomyType.name == 'Ellipse'" class="list-disc flex flex-col text-[13px] ml-20">
                <li>Left_Right - {{ taxonomyCoordinates[val.id].leftRightValue.toFixed(2) }} mm</li>
                <li>Top_Bottom - {{ taxonomyCoordinates[val.id].topBottomValue.toFixed(2) }} mm</li>
                <li>Circumference - {{ taxonomyCoordinates[val.id].circumference.toFixed(2) }} mm</li>
              </ul>
            </div>
            <div v-if="filteredChildTaxonomy(val).length" class="ml-[55px] mt-3">
              <ul class="list-disc text-[13px]">
                <li v-for="(child, childIndex) in filteredChildTaxonomy(val)" :key="childIndex" class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-3">
                    <template v-if="child.ChildTaxonomyDataInDLSessions && child.ChildTaxonomyDataInDLSessions.length">
                      <template v-for="(session, sessionIndex) in child.ChildTaxonomyDataInDLSessions" :key="sessionIndex">
                        <div class="flex flex-col gap-[10px]">
                          <div class="flex gap-[10px] items-center">
                            <NPopconfirm
                              v-if="Object.keys(taxonomyCoordinates).includes(child.ChildTaxonomyDataInDLSessions[0]?.id) && !isSelected(child?.ChildTaxonomyDataInDLSessions[0])"
                              :disabled="canSaveTaxonomyAtApprovalLevel"
                              positive-text="Yes"
                              negative-text="No"
                              @positive-click="deleteTaxonomyMarking(child?.ChildTaxonomyDataInDLSessions[0])"
                            >
                              <template #trigger>
                                <Icon name="ph:trash" :class="`text-base ${canSaveTaxonomyAtApprovalLevel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`" @click.stop />
                              </template>
                              Are you sure you want to delete?
                            </NPopconfirm>
                            <Icon v-else class="text-base" />
                            <template v-if="Object.keys(taxonomyCoordinates).includes(session.id)">
                              <Icon v-show="isSelected(session)" :class="`text-base ${!isSelected(session) ? 'hover:text-yellow-300' : ''} cursor-pointer`" name="ph:eye" @click.stop="toggleSelectedItem(session, filteredChildTaxonomy(val))" />
                              <Icon v-show="!isSelected(session)" :class="`text-base ${isSelected(session) ? 'text-yellow-300' : ''} cursor-pointer`" name="ph:eye-slash" @click.stop="toggleSelectedItem(session, filteredChildTaxonomy(val))" />
                              <Icon v-show="!isLocked(session)" :class="`text-base ${isLocked(session) ? 'text-blue-500' : 'hover:text-blue-400'} cursor-pointer`" name="ph:lock-open" @click.stop="toggleLockedItem(session, filteredChildTaxonomy(val))" />
                              <Icon v-show="isLocked(session)" :class="`text-base ${!isLocked(session) ? 'hover:text-blue-400' : 'text-blue-500'} cursor-pointer`" name="ph:lock" @click.stop="toggleLockedItem(session, filteredChildTaxonomy(val))" />
                            </template>
                            <Icon v-else class="text-base" />
                            <NCheckbox class="flex flex-row items-center justify-center" :checked="isCheckboxChecked(session.id, val.id)">
                              <NButton :class="`${session?.id == selectedTaxonomyType?.id ? '!text-yellow-300' : ''} text-sm`" :strong="true" :secondary="true" :type="session?.id === selectedTaxonomyType?.id ? 'primary' : 'default'" size="small" @click.stop="saveLastType(session, true, val, filteredChildTaxonomy(val))">
                                {{ child.name }}
                              </NButton>
                            </NCheckbox>
                            <NPopconfirm :disabled="canSaveTaxonomyAtApprovalLevel" positive-text="Yes" negative-text="No" @positive-click="deleteChildTaxonomy(session, val)">
                              <template #trigger>
                                <Icon name="ph:x" :class="`text-base ${canSaveTaxonomyAtApprovalLevel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`" @click.stop />
                              </template>
                              Are you sure you want to delete entity? You will not be able to add this entity level back.
                            </NPopconfirm>
                          </div>
                          <!-- Session details section -->
                          <div>
                            <ul v-if="Object.keys(taxonomyCoordinates).includes(session.id) && taxonomyCoordinates[session.id]?.value" class="list-disc text-[13px] ml-[65px]">
                              <li>{{ taxonomyCoordinates[session.id]?.value }}</li>
                            </ul>
                            <ul v-if="Object.keys(taxonomyCoordinates).includes(session.id) && Object.keys(taxonomyCoordinates[session.id]).includes('angle') && taxonomyCoordinates[session.id]?.angle?.angleValue" class="list-disc text-[13px] ml-[40px]">
                              <li>{{ `${taxonomyCoordinates[session.id]?.angle?.angleValue.toFixed(1)}°` }}</li>
                            </ul>
                            <ul v-if="Object.keys(taxonomyCoordinates).includes(session.id) && Object.keys(taxonomyCoordinates[session.id]).includes('leftRightValue') && taxonomyCoordinates[session.id]?.leftRightValue" class="list-disc text-[13px] ml-[40px]">
                              <li title="Left_Right">
                                LR - {{ taxonomyCoordinates[session.id]?.leftRightValue.toFixed(2) }} mm
                              </li>
                              <li title="Top_Bottom">
                                TB - {{ taxonomyCoordinates[session.id]?.topBottomValue.toFixed(2) }} mm
                              </li>
                              <li title="Circumference">
                                CF - {{ taxonomyCoordinates[session.id]?.circumference.toFixed(2) }} mm
                              </li>
                            </ul>
                          </div>
                        </div>
                      </template>
                    </template>

                    <!-- Handle Case Where No Sessions Are Available -->
                    <template v-else>
                      <div class="flex flex-col gap-[10px]">
                        <div class="flex gap-[10px] items-center">
                          <NPopconfirm
                            v-if="Object.keys(taxonomyCoordinates).includes(child.id) && !isSelected(child)"
                            :disabled="canSaveTaxonomyAtApprovalLevel"
                            positive-text="Yes"
                            negative-text="No"
                            @positive-click="deleteTaxonomyMarking(child)"
                          >
                            <template #trigger>
                              <Icon name="ph:trash" :class="`text-base ${canSaveTaxonomyAtApprovalLevel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`" @click.stop />
                            </template>
                            Are you sure you want to delete?
                          </NPopconfirm>
                          <Icon v-else class="text-base" />
                          <template v-if="Object.keys(taxonomyCoordinates).includes(child.id)">
                            <Icon v-show="isSelected(child)" :class="`text-base ${!isSelected(child) ? 'hover:text-yellow-300' : ''} cursor-pointer`" name="ph:eye" @click.stop="toggleSelectedItem(child, filteredChildTaxonomy(val))" />
                            <Icon v-show="!isSelected(child)" :class="`text-base ${isSelected(child) ? 'text-yellow-300' : ''} cursor-pointer`" name="ph:eye-slash" @click.stop="toggleSelectedItem(child, filteredChildTaxonomy(val))" />
                            <Icon v-show="!isLocked(child)" :class="`text-base ${isLocked(child) ? 'text-blue-500' : 'hover:text-blue-400'} cursor-pointer`" name="ph:lock-open" @click.stop="toggleLockedItem(child, filteredChildTaxonomy(val))" />
                            <Icon v-show="isLocked(child)" :class="`text-base ${!isLocked(child) ? 'hover:text-blue-400' : 'text-blue-500'} cursor-pointer`" name="ph:lock" @click.stop="toggleLockedItem(child, filteredChildTaxonomy(val))" />
                          </template>
                          <template v-if="!Object.keys(taxonomyCoordinates).includes(child.id)">
                            <Icon class="text-base" />
                          </template>
                          <NCheckbox class="flex flex-row items-center justify-center" :checked="isCheckboxChecked(child.id, val.id)">
                            <NButton :class="`${child?.id === selectedTaxonomyType?.id ? '!text-yellow-300' : ''} text-sm`" :strong="true" :secondary="true" :type="child?.id === selectedTaxonomyType?.id ? 'primary' : 'default'" size="small" @click.stop="saveLastType(child, true, val, filteredChildTaxonomy(val))">

                                        {{ child.name }}

                                </NButton>
                          </NCheckbox>
                          <NPopconfirm :disabled="canSaveTaxonomyAtApprovalLevel" positive-text="Yes" negative-text="No" @positive-click="deleteChildTaxonomy(child, val)">
                            <template #trigger>
                              <Icon name="ph:x" :class="`text-base ${canSaveTaxonomyAtApprovalLevel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`" @click.stop />
                            </template>
                            Are you sure you want to delete entity? You will not be able to add this entity level back.
                          </NPopconfirm>
                        </div>
                        <!-- Child details section -->
                        <div>
                          <ul v-if="Object.keys(taxonomyCoordinates).includes(child.id) && taxonomyCoordinates[child.id]?.value" class="list-disc text-[13px] ml-[65px]">
                            <li>{{ taxonomyCoordinates[child.id]?.value }}</li>
                          </ul>
                          <ul v-if="Object.keys(taxonomyCoordinates).includes(child.id) && Object.keys(taxonomyCoordinates[child.id]).includes('angle') && taxonomyCoordinates[child.id]?.angle?.angleValue" class="list-disc text-[13px] ml-[40px]">
                            <li>{{ `${taxonomyCoordinates[child.id]?.angle?.angleValue.toFixed(1)}°` }}</li>
                          </ul>
                          <ul v-if="Object.keys(taxonomyCoordinates).includes(child.id) && Object.keys(taxonomyCoordinates[child.id]).includes('leftRightValue') && taxonomyCoordinates[child.id]?.leftRightValue" class="list-disc text-[13px] ml-[40px]">
                            <li title="Left_Right">
                              LR - {{ taxonomyCoordinates[child.id]?.leftRightValue.toFixed(2) }} mm
                            </li>
                            <li title="Top_Bottom">
                              TB - {{ taxonomyCoordinates[child.id]?.topBottomValue.toFixed(2) }} mm
                            </li>
                            <li title="Circumference">
                              CF - {{ taxonomyCoordinates[child.id]?.circumference.toFixed(2) }} mm
                            </li>
                          </ul>
                        </div>
                      </div>
                    </template>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </DraggableList>
    </transition>
                  </div>
                </template>
              </DraggableList>
            </div>
  </NFormItem>
          </div>
        </NForm>
        <template #footer>
          <div class="flex flex-row items-center justify-start">
            <!-- <div class="flex flex-col items-center justify-start w-full gap-2 mb-4">
              <div class="flex justify-center px-4 mt-1 gap-x-5">
                <div class="flex flex-row items-center justify-center px-4 mt-1 gap-x-5">
                  <NCheckbox v-model:checked="filterSettings.isGrayscale">
                    Invert Color
                  </NCheckbox>
                </div>
              </div>
              <div class="inline-flex items-center justify-center w-full gap-4 px-2">
                <div class="inline-flex items-center justify-start w-full gap-2">
                  <Icon name="ph:sun-bold" class="flex-none text-xl text-neutral-500" />
                  <p>
                    {{ visualization.brightness }}
                  </p>
                  <input
                    v-model="visualization.brightness" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
                    min="0"
                  >
                  <Icon
                    name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-500"
                    @click="visualization.brightness = 1"
                  />
                </div>
                <div class="inline-flex items-center justify-start w-full gap-2">
                  <Icon name="ph:circle-half-tilt-bold" class="flex-none text-xl text-neutral-500" />
                  <p class="flex-none">
                    {{ visualization.contrast }}
                  </p>
                  <input
                    v-model="visualization.contrast" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
                    min="0"
                  >
                  <Icon
                    name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-500"
                    @click="visualization.contrast = 1"
                  />
                </div>
              </div>
            </div> -->
            <div class="flex gap-[16px] w-[20%]">
              <button
                :disabled="isPreviousButtonDisabled()" class="min-w-[120px] flex items-center justify-center no-wrap h-[40px] py-[10px] px-[5px] rounded-[8px] bg-[#3A3D40] shadow-[#00000025]" :class="[isPreviousButtonDisabled() ? 'cursor-not-allowed' : '']" @click="previousImage()"
              >
                <h3 class="text-[13px] text-[#FFFFFF] font-400">
                  Previous Image
                </h3>
              </button>
              <button
                :disabled="isNextButtonDisabled()" class="min-w-[120px] flex items-center justify-center no-wrap h-[40px] py-[10px] px-[5px] rounded-[8px] bg-[#3A3D40] shadow-[#00000025]" :class="[isNextButtonDisabled() ? 'cursor-not-allowed' : '']" @click="nextImage()"
              >
                <h3 class="text-[13px] text-[#FFFFFF] font-400">
                  Next Image
                </h3>
              </button>
            </div>
            <div class="flex flex-row px-4 gap-2 mt-2 w-[15%]">
              <NTooltip trigger="hover">
                <template #trigger>
                  <Icon name="ph:magnifying-glass-plus" :class="`${isLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-neutral-300 hover:text-neutral-300 outline-0`" @click="!isLock ? zoomIn('annotation') : ''" />
                </template>
                Zoom in
              </NTooltip>
              <NTooltip trigger="hover">
                <template #trigger>
                  <Icon name="ph:magnifying-glass-minus" :class="`${isLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl  text-neutral-300 hover:text-neutral-300 outline-0`" @click="!isLock ? zoomOut('annotation') : ''" />
                </template>
                Zoom out
              </NTooltip>
              <NTooltip trigger="hover">
                <template #trigger>
                  <Icon name="ph:arrow-clockwise" :class="`${isLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-neutral-300 hover:text-neutral-300 outline-0`" @click="!isLock ? resetZoom('annotation') : ''" />
                </template>
                Reset zoom
              </NTooltip>
              <NTooltip trigger="hover">
                <template #trigger>
                  <Icon name="ph:arrows-clockwise" :class="`${isLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-neutral-300 hover:text-neutral-100 outline-0`" @click="!isLock ? rotateImage('annotation') : ''" />
                </template>
                Rotate clockwise
              </NTooltip>
              <NTooltip trigger="hover">
                <template #trigger>
                  <Icon
                    name="ph:arrow-u-up-left"
                    :class="`${isLock || !canUndo ? 'cursor-not-allowed text-neutral-500' : 'cursor-pointer text-neutral-300 hover:text-neutral-100'} text-2xl outline-0`"
                    @click="(!isLock && canUndo) ? handleUndoAction() : ''"
                  />
                </template>
                Undo
              </NTooltip>
              <NTooltip trigger="hover">
                <template #trigger>
                  <Icon
                    name="ph:arrow-u-up-right"
                    :class="`${isLock || !canRedo ? 'cursor-not-allowed text-neutral-500' : 'cursor-pointer text-neutral-300 hover:text-neutral-100'} text-2xl outline-0`"
                    @click="(!isLock && canRedo) ? handleRedoAction() : ''"
                  />
                </template>
                Redo
              </NTooltip>
              <NTooltip trigger="hover">
                <template #trigger>
                  <svg style="width:24px;height:24px" :class="`${isLock ? 'cursor-not-allowed' : 'cursor-pointer'} text-neutral-300 hover:text-neutral-300 outline-0`" viewBox="0 0 24 24" @click="!isLock ? flipImage('annotation') : ''">
                    <path
                      d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
                Flip
              </NTooltip>
            </div>
            <div class="flex flex-row mt-2 pr-1">
              <NPopover trigger="manual" :show="showMarkupPopover" :disabled="canSaveTaxonomyAtApprovalLevel">
                <template #trigger>
                  <Icon name="ph:pencil" class="flex-none text-xl text-neutral-300 hover:text-neutral-100 cursor-pointer outline-none" @click="togglePopover" />
                </template>
                <div class="flex items-center gap-2">
                  <div class="flex flex-col gap-[5px]">
                    <div ref="markupPreviewContainer" />
                    <div class="flex flex-row items-center gap-[5px]">
                      <label class="w-[20px]" for="thickness-annotation">{{ markerThickness }}</label>
                      <input id="thickness-annotation" v-model="markerThickness" type="range" min="1" max="30">
                    </div>
                  </div>
                  <div class="w-[6rem] flex flex-row gap-2 items-center">
                    <NColorPicker v-model:value="markerColor" class="mx-2" :show-alpha="false" />
                  </div>
                  <div class="w-[110px]">
                    <NButton :disabled="canSaveTaxonomyAtApprovalLevel" @click="toggleEraserMode">
                      {{ eraserModeLabel }}
                    </NButton>
                  </div>
                  <div>
                    <NPopconfirm
                      positive-text="Yes"
                      negative-text="No"
                      @positive-click="clearCanvas"
                    >
                      <template #trigger>
                        <button>Clear</button>
                      </template>
                      Are you sure you want to clear?
                    </NPopconfirm>
                  </div>
                </div>
              </NPopover>
            </div>
            <div class="w-20 flex justify-center">
              <NButton v-if="!isLock" size="small" @click="isLock = !isLock">
                Lock
              </NButton>
              <NButton v-else size="small" @click="isLock = !isLock">
                Unlock
              </NButton>
            </div>
            <div class="inline-flex items-center justify-center w-[45%] gap-4 px-2 whitespace-nowrap">
              <div class="inline-flex items-center justify-start w-full gap-2">
                <Icon name="ph:sun-bold" class="flex-none text-xl text-neutral-300" />
                <p>
                  {{ annotationVisualization.brightness }}
                </p>
                <input
                  v-model="annotationVisualization.brightness"
                  :disabled="isLock" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
                  min="0"
                >
                <Icon
                  name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-300 hover:text-neutral-100"
                  @click="!isLock ? annotationVisualization.brightness = 1 : ''"
                />
              </div>
              <div class="inline-flex items-center justify-start w-full gap-2">
                <Icon name="ph:circle-half-tilt-bold" class="flex-none text-xl text-neutral-300 hover:text-neutral-100" />
                <p class="flex-none">
                  {{ annotationVisualization.contrast }}
                </p>
                <input
                  v-model="annotationVisualization.contrast"
                  :disabled="isLock" type="range" class="w-full cursor-pointer" :max="2" step="0.01"
                  min="0"
                >
                <Icon
                  name="ph:arrow-clockwise-bold" class="flex-none text-xl cursor-pointer text-neutral-300 hover:text-neutral-100"
                  @click="!isLock ? annotationVisualization.contrast = 1 : ''"
                />
              </div>
            </div>
            <div class="flex flex-row items-center justify-center gap-x-5 w-[10%]">
              <NCheckbox v-model:checked="isImageAnnotationInverted" :disabled="isLock">
                Invert Color
              </NCheckbox>
            </div>
            <div class="inline-flex items-center justify-end gap-2 w-[20%]">
              <!-- <NButton strong type="error" @click="showTaxonomyMappingModal = false;selectedItems = []; selectedGroups = [];isLock = false; isClickedItems = [];showMarkupPopover = false;">
                Cancel
              </NButton> -->
              <NPopover 
                trigger="manual" 
                :show="showCopyAnnotationModal" 
                @update:show="(val) => showCopyAnnotationModal = val"
                placement="top"
                :style="{ padding: '16px' }"
              >
                <template #trigger>
                  <NButton strong type="primary" :disabled="!hasSavedAnnotations" @click="handleCopyAnnotationClick">
                    Copy Annotation
                  </NButton>
                </template>
                <div class="flex flex-col gap-3 min-w-[300px]">
                  <p class="text-center text-white font-medium mb-2">Select an image to copy annotations to:</p>
                  <div class="flex gap-[16px] justify-center items-center">
                    <button
                      :disabled="isPreviousButtonDisabled()" 
                      class="min-w-[120px] flex items-center justify-center no-wrap h-[40px] py-[10px] px-[5px] rounded-[8px] bg-[#3A3D40] shadow-[#00000025]" 
                      :class="[isPreviousButtonDisabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']" 
                      @click="copyToPreviousImage()"
                    >
                      <h3 class="text-[13px] text-[#FFFFFF] font-400">
                        Previous Image
                      </h3>
                    </button>
                    <button
                      :disabled="isNextButtonDisabled()" 
                      class="min-w-[120px] flex items-center justify-center no-wrap h-[40px] py-[10px] px-[5px] rounded-[8px] bg-[#3A3D40] shadow-[#00000025]" 
                      :class="[isNextButtonDisabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']" 
                      @click="copyToNextImage()"
                    >
                      <h3 class="text-[13px] text-[#FFFFFF] font-400">
                        Next Image
                      </h3>
                    </button>
                  </div>
                </div>
              </NPopover>
              <NButton strong type="success" :disabled=" !hasTaxonomyCoordinates || canSaveTaxonomyAtApprovalLevel" @click="selectedItems = [];selectedGroups = [];submitTaxonomyMapping()">
                  Save
                </NButton>
            </div>
          </div>
        </template>
      </NCard>
    </NModal>

    <!-- Delete Confirmation Modal -->
    <NModal
      v-model:show="showDeleteConfirmationModal"
      :mask-closable="false"
      :close-on-esc="true"
      data-testid="dl-delete-annotation-modal"
    >
      <NCard
        class="w-[500px]"
        title="Delete Annotation Marks"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
      >
        <div class="mb-4">
          <p>Are you sure you want to delete {{ clickedAnnotationMarksCount }} annotation mark(s)?</p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <NButton
              data-testid="dl-delete-annotation-no-button"
              strong
              ghost
              class="!bg-transparent !border !border-gray-500 !text-gray-300 hover:!bg-transparent hover:!border-[#3da8ff] hover:!text-[#3da8ff]"
              @click="showDeleteConfirmationModal = false"
            >
              No
            </NButton>
            <NButton
              data-testid="dl-delete-annotation-yes-button"
              strong
              ghost
              class="!bg-transparent !border !border-gray-500 !text-gray-300 hover:!bg-transparent hover:!border-[#3da8ff] hover:!text-[#3da8ff] focus:!bg-transparent focus:!border-[#3da8ff] focus:!text-[#3da8ff] active:!bg-transparent active:!border-[#3da8ff] active:!text-[#3da8ff] transition-colors"
              autofocus
              @click="deleteSelectedAnnotationMarks"
            >
              Yes
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>

    <!-- Unsaved Changes Confirmation Modal -->
    <NModal
      v-model:show="showUnsavedChangesModal"
      :mask-closable="false"
      :close-on-esc="true"
      data-testid="dl-unsaved-changes-modal"
    >
      <NCard
        class="w-[500px]"
        title="Unsaved Changes"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="handleCancelClose"
      >
        <div class="mb-4">
          <p>You have unsaved annotation changes. Do you want to save before closing?</p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <NButton
              data-testid="dl-unsaved-discard-button"
              strong
              ghost
              class="!bg-transparent !border !border-gray-500 !text-gray-300 hover:!bg-transparent hover:!border-[#3da8ff] hover:!text-[#3da8ff]"
              @click="handleDiscardAndClose"
            >
              Discard
            </NButton>
            <NButton
              data-testid="dl-unsaved-save-button"
              strong
              type="primary"
              class="!bg-[#3da8ff] !border-[#3da8ff] !text-white hover:!bg-[#2d8fdf] hover:!border-[#2d8fdf] focus:!bg-[#3da8ff] focus:!border-[#3da8ff] active:!bg-[#2d8fdf] active:!border-[#2d8fdf] transition-colors"
              autofocus
              @click="handleSaveAndClose"
              :disabled="canSaveTaxonomyAtApprovalLevel"
            >
              Save
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>

    <!-- Label Menu Popup (Right-click on image) - exactly like grid page -->
    <Teleport to="body">
      <div
        v-if="labelMenu.visible && labelMenu.resources.length"
        ref="labelMenuEl"
        :style="{
          top: `${labelMenu.y}px`,
          left: `${labelMenu.x}px`,
          zIndex: 10000,
        }"
        class="flex flex-col justify-between fixed h-[250px] w-[250px] gap-y-4 px-2 py-2 bg-neutral-800 rounded shadow-lg"
        data-testid="dl-label-menu"
      >
      <!-- Search Input -->
      <div class="flex-shrink-0">
        <NInput
          data-testid="dl-label-menu-search-input"
          v-model:value="labelMenuSearchQuery"
          placeholder="Search label"
          clearable
          size="small"
        >
          <template #prefix>
            <svg
              viewBox="0 0 1024 1024"
              fill="currentColor"
              style="width: 14px; height: 14px; color: #8c8c8c"
            >
              <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
            </svg>
          </template>
        </NInput>
      </div>
      <!-- Labels List -->
      <div class="flex flex-col flex-1 overflow-auto gap-y-2">
        <div v-for="label in filteredLabels" :key="label.id" class="inline-flex items-center justify-start w-full gap-1 select-none">
          <SessionDLLabelCheckbox :status="getLabelCheckedStatus(labelMenu.resources, label.id)" @click="handleLabelStatusChange(label)" />
          <p class="text-white text-sm">{{ label.name }}</p>
        </div>
      </div>
      <NButton 
        data-testid="dl-label-menu-apply-button"
        :strong="true" 
        type="primary" 
        @click="saveExtractedResourcesLabels"
      >
        APPLY
      </NButton>
      </div>
    </Teleport>

    <!-- Unsaved Changes Before Send to QC Confirmation Modal -->
    <NModal
      v-model:show="showUnsavedChangesBeforeQCModal"
      :mask-closable="false"
      :close-on-esc="true"
      data-testid="dl-unsaved-before-qc-modal"
    >
      <NCard
        class="w-[500px]"
        title="Unsaved Changes"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="handleCancelSendToQC"
      >
        <div class="mb-4">
          <p>You have unsaved annotation changes. Do you want to save and send to QC or don't save and send to QC?</p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <NButton
              data-testid="dl-unsaved-before-qc-dont-save-button"
              strong
              ghost
              class="!bg-transparent !border !border-gray-500 !text-gray-300 hover:!bg-transparent hover:!border-[#3da8ff] hover:!text-[#3da8ff]"
              @click="handleDiscardAndSendToQC"
            >
              Don't Save and Send to QC
            </NButton>
            <NButton
              data-testid="dl-unsaved-before-qc-save-button"
              strong
              type="primary"
              class="!bg-[#3da8ff] !border-[#3da8ff] !text-white hover:!bg-[#2d8fdf] hover:!border-[#2d8fdf] focus:!bg-[#3da8ff] focus:!border-[#3da8ff] active:!bg-[#2d8fdf] active:!border-[#2d8fdf] transition-colors"
              autofocus
              @click="handleSaveAndSendToQC"
            >
              Save and Send to QC
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>

    <!-- Copy Annotation Confirmation Modal -->
    <NModal
      v-model:show="showCopyAnnotationConfirmationModal"
      :mask-closable="false"
      :close-on-esc="true"
      data-testid="dl-copy-annotation-modal"
    >
      <NCard
        class="w-[500px]"
        title="Existing Annotations Found"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="handleKeepExistingAnnotations"
      >
        <div class="mb-4">
          <p>This image already has annotations. What would you like to do?</p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <NButton
              data-testid="dl-copy-annotation-cancel-button"
              strong
              ghost
              class="!bg-transparent !border !border-gray-500 !text-gray-300 hover:!bg-transparent hover:!border-[#3da8ff] hover:!text-[#3da8ff]"
              @click="handleKeepExistingAnnotations"
            >
              Cancel
            </NButton>
            <NButton
              data-testid="dl-copy-annotation-replace-button"
              strong
              type="primary"
              class="!bg-[#3da8ff] !border-[#3da8ff] !text-white hover:!bg-[#2d8fdf] hover:!border-[#2d8fdf] focus:!bg-[#3da8ff] focus:!border-[#3da8ff] active:!bg-[#2d8fdf] active:!border-[#2d8fdf] transition-colors"
              autofocus
              @click="handleReplaceExistingAnnotations"
            >
              Replace
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>

    <!-- Remove Labels Confirmation Modal -->
    <NModal
      v-model:show="showRemoveLabelsConfirmationModal"
      :mask-closable="false"
      :close-on-esc="true"
    >
      <NCard
        class="w-[500px]"
        title="Remove Labels"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
      >
        <div class="mb-5">
          <p v-if="resourcesToRemoveLabels.length > 0">
            Are you sure you want to remove the {{ resourcesToRemoveLabels.length }} selected {{ resourcesToRemoveLabels.length === 1 ? 'image' : 'image`s' }} from those {{ uniqueLabelCount }} {{ uniqueLabelCount === 1 ? 'label' : 'label`s' }} ?
          </p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <NButton
              strong
              type="error"
              @click="showRemoveLabelsConfirmationModal = false"
            >
              No
            </NButton>
            <NButton
              strong
              type="success"
              autofocus
              @click="removeLabelsFromResource"
            >
              Yes
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>

  </div>
</template>

<style scoped>
/* Keep your existing styles */
.entityChecbox :deep(.n-checkbox__label) {
  display: flex;
  align-items: center;
}
.pencil-icon-svg {
  width: 24px;
  height: 24px;
  color: white;
  z-index: 10;
  border-radius: 50%;
}
.eraser-icon-svg {
  width: 24px;
  height: 24px;
  color: white;
  z-index: 10;
  border-radius: 50%;
}

/* Add these new styles to fix the layout */
.modal-content-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 75vh;
  gap: 40px; /* Changed from gap-10 */
  position: relative;
}

.image-panel {
  flex: 0 0 75%; /* Fixed width - won't change */
  position: relative;
  overflow: hidden;
}

.taxonomy-panel {
  flex: 0 0 22%; /* Fixed width - won't change */
  position: relative;
  overflow: hidden;
}

.image-container-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.konva-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Smooth transitions without layout shift */
.smooth-collapse-enter-active {
  transition: height 0.3s cubic-bezier(0.25, 1, 0.5, 1),
              opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
}
.smooth-collapse-leave-active {
  transition: height 0.3s cubic-bezier(0.55, 0, 0.75, 0.25),
              opacity 0.25s ease;
  overflow: hidden;
}
.smooth-collapse-enter-from,
.smooth-collapse-leave-to {
  height: 0;
  opacity: 0;
}

/* Ensure taxonomy content doesn't affect layout */
.taxonomy-content {
  width: 100%;
  overflow: visible;
}

.taxonomy-scroll-container {
  height: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
  position: relative;
}
</style>