<script setup lang="ts">
import type { Annotation } from '@prisma/client'
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, NColorPicker, useNotification } from 'naive-ui'
import type { AnnotationCreateManyInput } from '../trpc/routes/annotation'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import SearchComponent from '~/components/searchBarMasters.vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useErrorFormatter } from '~/composables/useErrorFormatter'


definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { $client } = useNuxtApp()
const router = useRouter()
const notification = useNotification()
const { formatErrorMessage } = useErrorFormatter()
const { data: taxonomyTypesData } = await $client.taxonomy.taxonomyTypeList.useQuery({})
const searchQuery = ref('')
const loading = ref(false)
const data = ref<any>(null)
const totalDataCount = ref(0)
const isHandlingSearch = ref(false)

// Validation state
const nameError = ref('')
const abbreviationError = ref('')
const taxonomyTypeError = ref('')
const colorError = ref('')
const nameTouched = ref(false)
const abbreviationTouched = ref(false)
const taxonomyTypeTouched = ref(false)
const colorTouched = ref(false)

// Use centralized validation utilities
const { validateRequired, validateUppercaseOnly } = useFormValidation()

// Validation regex pattern - allows uppercase letters, numbers, underscores, and hyphens
const validationPattern = /^[A-Z0-9_-]+$/

// Validation functions
function validateName(value: string) {
  // Check required
  const requiredError = validateRequired(value, 'Name')
  if (requiredError) {
    nameError.value = requiredError
    return false
  }
  
  // Check uppercase only pattern
  const patternError = validateUppercaseOnly(value, 'Name')
  if (patternError) {
    nameError.value = patternError
    return false
  }
  
  nameError.value = ''
  return true
}

function validateAbbreviation(value: string | undefined) {
  // Check required
  const requiredError = validateRequired(value, 'Abbreviation')
  if (requiredError) {
    abbreviationError.value = requiredError
    return false
  }
  
  // Check uppercase only pattern
  const patternError = validateUppercaseOnly(value!, 'Abbreviation')
  if (patternError) {
    abbreviationError.value = patternError
    return false
  }
  
  abbreviationError.value = ''
  return true
}

function validateTaxonomyType(value: string | null | undefined) {
  const requiredError = validateRequired(value, 'Taxonomy Type')
  if (requiredError) {
    taxonomyTypeError.value = requiredError
    return false
  }
  taxonomyTypeError.value = ''
  return true
}

function validateColor(value: string | undefined) {
  const requiredError = validateRequired(value, 'Color')
  if (requiredError) {
    colorError.value = requiredError
    return false
  }
  colorError.value = ''
  return true
}

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<Annotation>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: '25%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.name || false,
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NInput, {
          value: row.name,
          onUpdateValue(v: string) {
            data.value!.data[index].name = v
          },
          'data-testid': `annotation-name-input-${index}`,
        })
        : row.name
    },
  },
  {
    key: 'taxonomyTypeId',
    title: 'Taxonomy Type',
    width: '25%',
    ellipsis: true,
    render(row) {
      const taxonomyType = taxonomyTypesData.value?.find(
        (type) => type.id === row.taxonomyTypeId
      )
      return taxonomyType?.name || '-'
    },
  },
  {
    key: 'abbreviation',
    title: 'Abbreviation',
    width: '25%',
    ellipsis: true,
    render(row) {
      return row.abbreviation || '-'
    },
  },
  {
    key: 'colorCode',
    title: 'Color',
    width: '10%',
    ellipsis: true,
    render(row) {
      return h('div', {
        style: {
          backgroundColor: row.colorCode || 'rgb(0,0,0)',
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }
      })
    },
  },
  {
    key: 'updatedAt',
    title: 'Updated at',
    width: '15%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.updatedAt || false,
    render: (row: Annotation) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '15%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: Annotation) => {
      return row.createdAt.toLocaleString()
    },
  },
  {
    key: 'actions',
    width: '20%',
    title: 'Actions',
    render(row, index) {
      return h(
        'div',
        {
          class: 'inline-flex items-center gap-2',
          'data-testid': `annotation-actions-row-${index}`,
        },
        canUpdateAnnotation.value ? 
          h(
            NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `annotation-edit-button-${index}`,
              onClick: () => {
                showSubmit.value = false
                const selectedData = data?.value.data?.find((e) => e.id === row.id)
                if (selectedData) {
                  const annotationData = {
                    id: row.id,
                    name: selectedData.name,
                    abbreviation: selectedData.abbreviation,
                    taxonomyTypeId: selectedData.taxonomyTypeId,
                    colorCode: selectedData.colorCode || 'rgb(0,0,0)',
                  }
                  newAnnotation.value = annotationData
                  // Store original values for comparison
                  originalAnnotation.value = { ...annotationData }
                  // Clear validation errors and touched state when editing
                  nameError.value = ''
                  abbreviationError.value = ''
                  taxonomyTypeError.value = ''
                  colorError.value = ''
                  nameTouched.value = false
                  abbreviationTouched.value = false
                  taxonomyTypeTouched.value = false
                  colorTouched.value = false
                }
              },
            },
            { default: () => 'Edit' }
          ) : null,
      )
    },
  },
])

async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchAnnotations()
  }
}

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  onChange: async (page: number) => {
    pagination.page = page
    await fetchAnnotations()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchAnnotations()
  },
})

const sortStates = ref<DataTableSortState[]>([
  {
    columnKey: 'updatedAt',
    sorter: true,
    order: 'descend',
  },
])

const sortKeyMapOrder = computed(() => sortStates.value.reduce((result: Record<string, any>, { columnKey, order }) => {
  result[columnKey] = order
  return result
}, {}))

// LIST ANNOTATIONS
async function fetchAnnotations({
  params = {
    page: pagination.page,
    perPage: pagination.pageSize,
    sort: sortStates.value,
  },
}: {
  params?: {
    page: number
    perPage: number
    sort: DataTableSortState[]
  }
} = {}) {
  loading.value = true
  await $client.annotation.list.query({
    search: searchQuery.value,
    limit: params.perPage,
    offset: (params.page - 1) * params.perPage,
    sort: params.sort.map(({ columnKey, order }) => ({
      [columnKey]: order === 'ascend' ? 'asc' : 'desc',
    })),
  }).then((response) => {
    data.value = response
    pagination.pageCount = Math.ceil(response.metadata.totalCount / pagination.pageSize)
    totalDataCount.value = response.metadata.totalCount
    loading.value = false
  }).catch((error) => {
    console.log(error)
    loading.value = false
  })
}


// Update the form section to use the taxonomyTypesData
const modalFormSection = computed(() => {
  if (!taxonomyTypesData.value) return []
  
  return Object.values(taxonomyTypesData.value).map((type) => ({
    label: type.name,
    value: type.id,
  }))
})


// CREATE ANNOTATION
const newAnnotation = ref<AnnotationCreateManyInput | null>(null)
const showSubmit = ref<boolean>(false)
const isCreatingAnnotation = computed(() => !!newAnnotation.value)
const editedRow = ref<Annotation | null>(null)
const originalAnnotation = ref<AnnotationCreateManyInput | null>(null)

// Check if there are changes in the form
const hasChanges = computed(() => {
  if (!newAnnotation.value || !originalAnnotation.value || showSubmit.value) {
    return false
  }
  
  return (
    newAnnotation.value.name !== originalAnnotation.value.name ||
    newAnnotation.value.abbreviation !== originalAnnotation.value.abbreviation ||
    newAnnotation.value.taxonomyTypeId !== originalAnnotation.value.taxonomyTypeId ||
    newAnnotation.value.colorCode !== originalAnnotation.value.colorCode
  )
})

async function createAnnotation() {
  if (newAnnotation.value) {
    // Mark all fields as touched when submitting
    nameTouched.value = true
    abbreviationTouched.value = true
    taxonomyTypeTouched.value = true
    colorTouched.value = true
    
    // Validate before saving
    const isNameValid = validateName(newAnnotation.value.name)
    const isAbbreviationValid = validateAbbreviation(newAnnotation.value.abbreviation)
    const isTaxonomyTypeValid = validateTaxonomyType(newAnnotation.value.taxonomyTypeId)
    const isColorValid = validateColor(newAnnotation.value.colorCode)
    
    if (!isNameValid || !isAbbreviationValid || !isTaxonomyTypeValid || !isColorValid) {
      return
    }
    
    try {
      await $client.annotation.createAnnotation.mutate(newAnnotation.value)
      notification.success({ content: 'Annotation Created Successfully', duration: 5000 })
      newAnnotation.value = null
      originalAnnotation.value = null
      nameTouched.value = false
      abbreviationTouched.value = false
      taxonomyTypeTouched.value = false
      colorTouched.value = false
      await fetchAnnotations()
    }
    catch (error: any) {
      notification.create({
        title: 'Error',
        type: 'error',
        content: formatErrorMessage(error),
        duration: 5000,
        closable: true,
      })
    }
  }
}

// DELETE ANNOTATION
async function deleteAnnotation(row: Annotation) {
  try {
    await $client.annotation.deleteAnnotation.mutate({
      id: row.id
    })
    notification.success({ content: 'Annotation Deleted Successfully', duration: 5000 })
    await fetchAnnotations()
  }
  catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error),
      duration: 5000,
      closable: true,
    })
  }
}

// UPDATE ANNOTATION
async function updateAnnotation(annotation: any) {
  try {
    // Mark all fields as touched when submitting
    nameTouched.value = true
    abbreviationTouched.value = true
    taxonomyTypeTouched.value = true
    colorTouched.value = true
    
    // Validate before updating
    const isNameValid = validateName(annotation.name)
    const isAbbreviationValid = validateAbbreviation(annotation.abbreviation)
    const isTaxonomyTypeValid = validateTaxonomyType(annotation.taxonomyTypeId)
    const isColorValid = validateColor(annotation.colorCode)
    
    if (!isNameValid || !isAbbreviationValid || !isTaxonomyTypeValid || !isColorValid) {
      return // Don't proceed if validation fails
    }
    
    const { createdAt, updatedAt, ...updateData } = annotation

    await $client.annotation.updateAnnotation.mutate(updateData)
    notification.success({ content: 'Annotation Updated Successfully', duration: 5000 })
    newAnnotation.value = null
    originalAnnotation.value = null
    nameTouched.value = false
    abbreviationTouched.value = false
    taxonomyTypeTouched.value = false
    colorTouched.value = false
    await fetchAnnotations()
  }
  catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error),
      duration: 5000,
      closable: true,
    })
  }
}

// Watch for empty search - reset state and fetch when manually cleared
watch(searchQuery, (newValue, oldValue) => {
  if (newValue === '' && oldValue !== '' && !isHandlingSearch.value) {
    // Only trigger if search was actually cleared (had a value before) and not already handling search
    pagination.page = 1
    // Reset sorting to default (updatedAt descending)
    sortStates.value = [
      {
        columnKey: 'updatedAt',
        sorter: true,
        order: 'descend',
      },
    ]
    // Use nextTick to ensure state is updated, then fetch
    nextTick(() => {
      fetchAnnotations()
    })
  }
})

// Handle search with pagination reset
async function handleSearch() {
  // Prevent double fetching
  if (isHandlingSearch.value) return
  isHandlingSearch.value = true
  
  try {
    // Use nextTick to ensure searchQuery.value is updated before checking
    await nextTick()
    pagination.page = 1
    // Reset sorting to default when search is cleared
    if (!searchQuery.value || searchQuery.value.trim() === '') {
      sortStates.value = [
        {
          columnKey: 'updatedAt',
          sorter: true,
          order: 'descend',
        },
      ]
    }
    await fetchAnnotations()
  } finally {
    // Reset flag after a short delay to allow watcher to complete
    setTimeout(() => {
      isHandlingSearch.value = false
    }, 100)
  }
}

const canCreateAnnotation = ref<boolean>(false)
const canUpdateAnnotation = ref<boolean>(false)
const canDeleteAnnotation = ref<boolean>(false)
const canExportAnnotationData = ref<boolean>(false)

async function exportAnnotations() {
  try {
    loading.value = true
    
    const config = useRuntimeConfig()
    const res = await fetch(`${config.public.API_URL}/api/annotations/download-all`)
    
    if (!res.ok) {
      throw new Error(`Failed to download annotations: ${res.statusText}`)
    }
    
    // Get the filename from Content-Disposition header or use default
    const contentDisposition = res.headers.get('Content-Disposition')
    let downloadFileName = 'taxonomy_data.xlsx'
    
    if (contentDisposition) {
      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const fileNameMatch = fileNameRegex.exec(contentDisposition)
      if (fileNameMatch?.[1]) {
        downloadFileName = fileNameMatch[1].replaceAll(/['"]/g, '')
      }
    }
    
    // Get the blob from response
    const blob = await res.blob()
    
    // Create download link and trigger download
    const url = globalThis.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = decodeURIComponent(downloadFileName)
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    link.remove()
    globalThis.URL.revokeObjectURL(url)
    
    notification.success({
      title: 'Export Successful',
      content: `Annotations data exported successfully as ${downloadFileName}`,
      duration: 3000,
      closable: true
    })
  } catch (error: any) {
    console.error('Error exporting annotations:', error)
    notification.error({
      title: 'Export Failed',
      content: formatErrorMessage(error) || 'Failed to export annotations data',
      duration: 5000,
      closable: true
    })
  } finally {
    loading.value = false
  }
}

async function checkAbilities() {
  canCreateAnnotation.value = await defineAbilitiesFor(Module.Annotation, Action.CREATE)
  canUpdateAnnotation.value = await defineAbilitiesFor(Module.Annotation, Action.UPDATE)
  canDeleteAnnotation.value = await defineAbilitiesFor(Module.Annotation, Action.DELETE)
  canExportAnnotationData.value = await defineAbilitiesFor(Module.Annotation, Action.Export)

}

onMounted(() => {
  checkAbilities()
  fetchAnnotations() // Fetch data on mount
})

watch(route, () => {
  checkAbilities()
})
</script>

<template>
  <div>
    <div>
      <div class="inline-flex w-full justify-between items-center px-2 py-4">
        <div class="inline-flex items-center gap-2">
          <h2>Annotations</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="handleSearch"
            placeholder="Search"
          />
        <NButton
          v-if="canCreateAnnotation"
          data-testid="annotation-create-button"
          strong secondary type="primary" @click="showSubmit=true;newAnnotation = {
            name: '',
            abbreviation: '',
            taxonomyTypeId:null,
            colorCode: 'rgb(247, 232, 10)',
          };originalAnnotation=null;nameError='';abbreviationError='';taxonomyTypeError='';colorError='';nameTouched=false;abbreviationTouched=false;taxonomyTypeTouched=false;colorTouched=false;"
        >
          Create Annotation
        </NButton>
        <NButton v-if="canExportAnnotationData"
          data-testid="annotation-export-button"
          strong secondary type="primary" @click="exportAnnotations"
        >
          Export Annotations
        </NButton>
      </div>
      </div>
      <NDataTable
        data-testid="annotation-table"
        ref="table"
        :key="(row: Annotation) => row.id"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
    <NModal
      v-if="newAnnotation"
      v-model:show="isCreatingAnnotation"
      data-testid="annotation-create-modal"
    >
      <NCard
        class="w-[600px]"
        :title="showSubmit ? 'Create Annotation' : 'Update Annotation'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="newAnnotation = null; originalAnnotation = null; nameTouched = false; abbreviationTouched = false; taxonomyTypeTouched = false; colorTouched = false; nameError = ''; abbreviationError = ''; taxonomyTypeError = ''; colorError = '';"
        :style="{ 
          height: 'auto',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }"
      >
        <div :style="{ 
          overflowY: 'auto', 
          flex: '1 1 auto', 
          minHeight: 0,
          maxHeight: 'calc(90vh - 120px)'
        }">
          <NForm
            :model="newAnnotation"
            label-placement="left"
            require-mark-placement="right-hanging"
            size="medium"
            label-width="auto"
          >
            <NFormItem label="Name" path="name" required :validation-status="nameTouched && nameError ? 'error' : undefined" class="mb-4">
              <NInput 
                data-testid="annotation-create-name-input"
                v-model:value="newAnnotation.name" 
                placeholder="Enter annotation name " 
                @input="nameTouched = true; validateName(newAnnotation.name)"
                @blur="nameTouched = true; validateName(newAnnotation.name)"
              />
              <template v-if="nameTouched && nameError" #feedback>
                <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ nameError }}</span>
              </template>
            </NFormItem>
            
            <NFormItem label="Abbreviation" path="abbreviation" required :validation-status="abbreviationTouched && abbreviationError ? 'error' : undefined" class="mb-4">
              <NInput 
                data-testid="annotation-create-abbreviation-input"
                v-model:value="newAnnotation.abbreviation" 
                placeholder="Enter abbreviation " 
                @input="abbreviationTouched = true; validateAbbreviation(newAnnotation.abbreviation)"
                @blur="abbreviationTouched = true; validateAbbreviation(newAnnotation.abbreviation)"
              />
              <template v-if="abbreviationTouched && abbreviationError" #feedback>
                <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ abbreviationError }}</span>
              </template>
            </NFormItem>
            
            <NFormItem label="Taxonomy Type" required :validation-status="taxonomyTypeTouched && taxonomyTypeError ? 'error' : undefined" class="mb-4">
              <NSelect
                data-testid="annotation-create-taxonomy-type-select"
                v-model:value="newAnnotation.taxonomyTypeId"
                filterable 
                :options="modalFormSection"
                placeholder="Select taxonomy type"
                @update:value="validateTaxonomyType(newAnnotation.taxonomyTypeId)"
                @blur="taxonomyTypeTouched = true; validateTaxonomyType(newAnnotation.taxonomyTypeId)"
              />
              <template v-if="taxonomyTypeTouched && taxonomyTypeError" #feedback>
                <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ taxonomyTypeError }}</span>
              </template>
            </NFormItem>
            
            <NFormItem label="Color" path="colorCode"  :validation-status="colorTouched && colorError ? 'error' : undefined" class="mb-0">
              <NColorPicker 
                data-testid="annotation-create-color-picker"
                v-model:value="newAnnotation.colorCode" 
                :show-alpha="false"
                @update:value="colorTouched = true; validateColor(newAnnotation.colorCode)"
              />
              <template v-if="colorTouched && colorError" #feedback>
                <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ colorError }}</span>
              </template>
            </NFormItem>
          </NForm>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="annotation-create-cancel-button" strong type="error" @click="newAnnotation = null; originalAnnotation = null; nameTouched = false; abbreviationTouched = false; taxonomyTypeTouched = false; colorTouched = false; nameError = ''; abbreviationError = ''; taxonomyTypeError = ''; colorError = '';">
              Cancel
            </NButton>
            <NButton
              data-testid="annotation-create-submit-button"
              strong
              type="success"
              v-if="showSubmit"
              @click="createAnnotation"
              :disabled="!!nameError || !!abbreviationError || !!taxonomyTypeError || !!colorError || !newAnnotation.name || !newAnnotation.abbreviation || !newAnnotation.taxonomyTypeId || !newAnnotation.colorCode"
            >
              Submit
            </NButton>
            <NButton
              data-testid="annotation-update-button"
              v-if="!showSubmit"
              strong
              type="success"
              @click="updateAnnotation(newAnnotation)"
              :disabled="!!nameError || !!abbreviationError || !!taxonomyTypeError || !!colorError || !newAnnotation.name || !newAnnotation.abbreviation || !newAnnotation.taxonomyTypeId || !newAnnotation.colorCode || !hasChanges"
            >
              Update
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>