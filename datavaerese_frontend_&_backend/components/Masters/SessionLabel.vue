<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { SessionLabel } from '@prisma/client'
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, NColorPicker, useNotification, type FormInst, type FormRules } from 'naive-ui'
import { h } from 'vue'
import type { SessionLabelCreateManyInput } from '~/server/trpc/routers/sessionLabel'
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
const searchQuery = ref('')
const loading = ref(false)
const data = ref<any>(null)
const totalDataCount = ref(0)
const isHandlingSearch = ref(false)

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<SessionLabel>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: '30%',
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
          'data-testid': `session-label-name-input-${index}`,
        })
        : row.name
    },
  },
  {
    key: 'description',
    title: 'Description',
    width: '40%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.description || false,
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NInput, {
          value: row.description,
          onUpdateValue(v: string) {
            data.value!.data[index].description = v
          },
          'data-testid': `session-label-description-input-${index}`,
        })
        : row.description
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
          backgroundColor: row.colorCode || 'rgb(200, 200, 200)',
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          display: 'inline-block'
        }
      })
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '15%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: SessionLabel) => {
      return new Date(row.createdAt).toLocaleString()
    },
  },
  {
    key: 'actions',
    width: '20%',
    title: 'Actions',
    render(row, index) {
      return h('div', { 
        class: 'inline-flex items-center gap-2',
        'data-testid': `session-label-actions-row-${index}`,
      }, [
        canUpdateSessionLabel.value ? 
          h(
            NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `session-label-edit-button-${index}`,
              onClick: () => {
                showSubmit.value = false
                const selectedData = data?.value.data?.find((e: SessionLabel) => e.id === row.id)
                if (selectedData) {
                  const sessionLabelData = {
                    id: row.id,
                    name: selectedData.name,
                    description: selectedData.description,
                    colorCode: selectedData.colorCode || 'rgb(200, 200, 200)',
                  }
                  newSessionLabel.value = sessionLabelData
                  // Store original values for comparison
                  originalSessionLabel.value = JSON.parse(JSON.stringify(sessionLabelData))
                  // Clear validation errors and touched state when editing
                  nameError.value = ''
                  nameTouched.value = false
                }
              },
            },
            { default: () => 'Edit' }
          ) : null,
        canDeleteSessionLabel.value ?
          h(
            NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              type: 'error',
              'data-testid': `session-label-delete-button-${index}`,
              onClick: async () => {
                await handleDeleteClick(row)
              },
            },
            { default: () => 'Delete' }
          ) : null,
      ])
    },
  },
])

async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchSessionLabels()
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
    await fetchSessionLabels()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchSessionLabels()
  },
})

const sortStates = ref<DataTableSortState[]>([
  {
    columnKey: 'createdAt',
    sorter: true,
    order: 'descend',
  },
])

const sortKeyMapOrder = computed(() => sortStates.value.reduce((result: Record<string, any>, { columnKey, order }) => {
  result[columnKey] = order
  return result
}, {}))

// LIST SessionLabels
async function fetchSessionLabels({
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
  await $client.sessionLabel.list.query({
    search: searchQuery.value,
    limit: params.perPage,
    offset: (params.page - 1) * (params.perPage || pagination.pageSize),
    sort: params.sort.map(({ columnKey, order }) => ({
      [columnKey]: order === 'ascend' ? 'asc' : 'desc',
    })),
  }).then((response) => {
    data.value = response
    const totalCount = typeof response.metadata.totalCount === 'number' ? response.metadata.totalCount : 0
    pagination.pageCount = Math.ceil(totalCount / pagination.pageSize)
    totalDataCount.value = totalCount
    loading.value = false
  }).catch((error) => {
    console.log(error)
    loading.value = false
  })
}

// CREATE SessionLabel
const newSessionLabel = ref<SessionLabelCreateManyInput & { id?: string } | null>(null)
const originalSessionLabel = ref<SessionLabelCreateManyInput & { id?: string } | null>(null)
const showSubmit = ref<boolean>(false)
const isCreatingSessionLabel = computed(() => !!newSessionLabel.value)
const editedRow = ref<SessionLabel | null>(null)

// Validation state
const nameError = ref('')
const nameTouched = ref(false)

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const formValidationErrors = ref<Record<string, string[]>>({})

// Use centralized validation utilities
const { validateRequired, validatePattern, getErrorMessage } = useFormValidation()

// Validation regex pattern - allows letters, numbers, underscore, and hyphen only
const validationPattern = /^[A-Za-z0-9_-]+$/

// Validation function
function validateName(value: string) {
  // Check required
  const requiredError = validateRequired(value, 'Name')
  if (requiredError) {
    nameError.value = requiredError
    return false
  }
  
  // Check pattern
  const patternError = validatePattern(value, 'Name', validationPattern)
  if (patternError) {
    nameError.value = patternError
    return false
  }
  
  nameError.value = ''
  return true
}

const formRules: FormRules = {
  name: [
    { 
      required: true, 
      message: getErrorMessage('Name', 'required'), 
      trigger: ['input', 'blur']
    },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: getErrorMessage('Name', 'invalidCharacters'),
      trigger: ['input', 'blur']
    },
    {
      validator: (rule, value: string) => {
        if (!value) return true // Let required rule handle empty values
        
        // Check for case-insensitive duplicate
        const normalizedValue = value.trim().toLowerCase()
        const existingLabel = data.value?.data?.find((label: SessionLabel) => {
          // When updating, exclude the current item
          if (newSessionLabel.value?.id && label.id === newSessionLabel.value.id) {
            return false
          }
          return label.name.toLowerCase() === normalizedValue
        })
        
        if (existingLabel) {
          return new Error(`A session label with the name "${existingLabel.name}" already exists`)
        }
        return true
      },
      trigger: ['input', 'blur']
    }
  ],
}

async function createSessionLabel() {
  if (newSessionLabel.value) {
    // Mark field as touched when submitting
    nameTouched.value = true
    
    // Validate before submitting
    const isNameValid = validateName(newSessionLabel.value.name)
    
    if (!isNameValid) {
      return
    }
    
    try {
      isSubmitting.value = true
      await formRef.value?.validate()
      await $client.sessionLabel.createSessionLabel.mutate(newSessionLabel.value)
      notification.success({ content: 'Session Label Created Successfully', duration: 5000 })
      newSessionLabel.value = null
      originalSessionLabel.value = null
      nameError.value = ''
      nameTouched.value = false
      await fetchSessionLabels()
    }
    catch (error: any) {
      // Validation errors are shown inline
      if (error.message === 'Form validation failed' || error.message?.includes('validation')) {
        // Do nothing, errors handled inline
        return
      }
      notification.create({
        title: 'Error',
        type: 'error',
        content: formatErrorMessage(error),
        duration: 5000,
        closable: true,
      })
    } finally {
      isSubmitting.value = false
    }
  }
}

// UPDATE SessionLabel
async function updateSessionLabel(sessionLabel: any) {
  try {
    isSubmitting.value = true
    await formRef.value?.validate()
    const { createdAt, deletedAt, ...updateData } = sessionLabel

    await $client.sessionLabel.updateSessionLabel.mutate(updateData)
    notification.success({ content: 'Session Label Updated Successfully', duration: 5000 })
    newSessionLabel.value = null
    originalSessionLabel.value = null
    nameError.value = ''
    nameTouched.value = false
    await fetchSessionLabels()
  }
  catch (error: any) {
    // Validation errors are shown inline
    if (error.message === 'Form validation failed' || error.message?.includes('validation')) {
      // Do nothing, errors handled inline
      return
    }
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error),
      duration: 5000,
      closable: true,
    })
  } finally {
    isSubmitting.value = false
  }
}

// DELETE SessionLabel
const showDeleteModal = ref(false)
const pendingDeleteSessionLabel = ref<SessionLabel | null>(null)
const deleteUsageCount = ref<number>(0)
const isFetchingDeleteCount = ref(false)

async function handleDeleteClick(sessionLabel: SessionLabel) {
  try {
    isFetchingDeleteCount.value = true
    pendingDeleteSessionLabel.value = sessionLabel
    
    // Fetch usage count
    const usageData = await $client.sessionLabel.getUsageCount.query(sessionLabel.id)
    deleteUsageCount.value = usageData.count || 0
    
    showDeleteModal.value = true
  } catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error) || 'Failed to fetch usage count',
      duration: 5000,
      closable: true,
    })
  } finally {
    isFetchingDeleteCount.value = false
  }
}

async function confirmDelete() {
  if (!pendingDeleteSessionLabel.value) return
  
  try {
    await $client.sessionLabel.deleteSessionLabel.mutate({
      id: pendingDeleteSessionLabel.value.id
    })
    
    notification.success({ 
      content: 'Session Label Deleted Successfully', 
      duration: 5000 
    })
    
    showDeleteModal.value = false
    pendingDeleteSessionLabel.value = null
    deleteUsageCount.value = 0
    await fetchSessionLabels()
  } catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error) || 'Failed to delete session label',
      duration: 5000,
      closable: true,
    })
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  pendingDeleteSessionLabel.value = null
  deleteUsageCount.value = 0
}

// Watch for empty search - reset state and fetch when manually cleared
watch(searchQuery, (newValue, oldValue) => {
  if (newValue === '' && oldValue !== '' && !isHandlingSearch.value) {
    // Only trigger if search was actually cleared (had a value before) and not already handling search
    pagination.page = 1
    // Reset sorting to default (createdAt descending)
    sortStates.value = [
      {
        columnKey: 'createdAt',
        sorter: true,
        order: 'descend',
      },
    ]
    // Use nextTick to ensure state is updated, then fetch
    nextTick(() => {
      fetchSessionLabels()
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
          columnKey: 'createdAt',
          sorter: true,
          order: 'descend',
        },
      ]
    }
    await fetchSessionLabels()
  } finally {
    // Reset flag after a short delay to allow watcher to complete
    setTimeout(() => {
      isHandlingSearch.value = false
    }, 100)
  }
}

const canCreateSessionLabel = ref<boolean>(false)
const canUpdateSessionLabel = ref<boolean>(false)
const canDeleteSessionLabel = ref<boolean>(false)

// Computed property to check if form is valid
const isFormValid = computed(() => {
  if (!newSessionLabel.value) return false
  
  // Check if name exists and matches pattern
  const name = newSessionLabel.value.name || ''
  if (!name.trim()) return false
  
  // Check pattern: only letters, numbers, underscores, and hyphens
  const namePattern = /^[a-zA-Z0-9_-]+$/
  if (!namePattern.test(name)) return false
  
  // Check for case-insensitive duplicate
  const normalizedName = name.trim().toLowerCase()
  const existingLabel = data.value?.data?.find((label: SessionLabel) => {
    // When updating, exclude the current item
    if (newSessionLabel.value?.id && label.id === newSessionLabel.value.id) {
      return false
    }
    return label.name.toLowerCase() === normalizedName
  })
  
  if (existingLabel) return false
  
  return true
})

// Computed property to check if there are changes when editing
const hasChanges = computed(() => {
  if (!newSessionLabel.value || !originalSessionLabel.value) return false
  if (showSubmit.value) return true // Always allow changes when creating
  
  // Compare current values with original values
  return (
    newSessionLabel.value.name !== originalSessionLabel.value.name ||
    newSessionLabel.value.description !== originalSessionLabel.value.description ||
    newSessionLabel.value.colorCode !== originalSessionLabel.value.colorCode
  )
})

function checkAbilities() {
  canCreateSessionLabel.value = defineAbilitiesFor(Module.SessionLabel, Action.CREATE)
  canUpdateSessionLabel.value = defineAbilitiesFor(Module.SessionLabel, Action.UPDATE)
  canDeleteSessionLabel.value = defineAbilitiesFor(Module.SessionLabel, Action.DELETE)
}

onMounted(() => {
  checkAbilities()
  fetchSessionLabels() // Fetch data on mount
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
          <h2>Session Label</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="handleSearch"
            placeholder="Search"
          />
        <NButton
          v-if="canCreateSessionLabel"
          data-testid="session-label-create-button"
          strong secondary type="primary" @click="showSubmit=true;newSessionLabel = {
            name: '',
            description: '',
            colorCode: 'rgb(200, 200, 200)',
          }; nameError = ''; nameTouched = false;"
        >
          Create Session Label
        </NButton>
      </div>
      </div>
      <NDataTable
        data-testid="session-label-table"
        ref="table"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
    <NModal
      v-if="newSessionLabel"
      v-model:show="isCreatingSessionLabel"
      data-testid="session-label-create-modal"
    >
      <NCard
        class="w-[600px]"
        :title="showSubmit ? 'Create Session Label' : 'Update Session Label'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="newSessionLabel = null; originalSessionLabel = null; nameError = ''; nameTouched = false;"
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
            ref="formRef"
            :model="newSessionLabel"
            :rules="formRules"
            label-placement="left"
            require-mark-placement="right-hanging"
            size="medium"
            label-width="auto"
          >
            <NFormItem label="Name" path="name" :validation-status="nameTouched && nameError ? 'error' : undefined" class="mb-4">
              <NInput 
                data-testid="session-label-create-name-input"
                v-model:value="newSessionLabel.name" 
                placeholder="Enter session label name"
                @input="nameTouched = true; if (newSessionLabel) validateName(newSessionLabel.name)"
                @blur="nameTouched = true; if (newSessionLabel) validateName(newSessionLabel.name)"
              />
              <template v-if="nameTouched && nameError" #feedback>
                <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ nameError }}</span>
              </template>
            </NFormItem>
            <NFormItem label="Description" path="description" class="mb-4">
              <NInput 
                data-testid="session-label-create-description-input"
                v-model:value="newSessionLabel.description" 
                placeholder="Enter description" 
              />
            </NFormItem>
            <NFormItem label="Color" path="colorCode" class="mb-0">
              <NColorPicker data-testid="session-label-create-color-picker" v-model:value="newSessionLabel.colorCode" :show-alpha="false" />
            </NFormItem>
          </NForm>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="session-label-create-cancel-button" strong type="error" @click="newSessionLabel = null; originalSessionLabel = null; nameError = ''; nameTouched = false;">
              Cancel
            </NButton>
            <NButton
              data-testid="session-label-create-submit-button"
              strong
              type="success"
              v-if="showSubmit"
              :disabled="isSubmitting || !isFormValid || !!nameError || !newSessionLabel?.name"
              :loading="isSubmitting"
              @click="createSessionLabel"
            >
              Submit
            </NButton>
            <NButton
              data-testid="session-label-update-button"
              v-if="!showSubmit"
              strong
              type="success"
              :disabled="isSubmitting || !isFormValid || !hasChanges || !!nameError || !newSessionLabel?.name"
              :loading="isSubmitting"
              @click="updateSessionLabel(newSessionLabel)"
            >
              Update
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
    
    <!-- Delete Confirmation Modal -->
    <NModal v-model:show="showDeleteModal">
      <NCard
        class="w-[600px]"
        title="Confirm Session Label Deletion"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="cancelDelete"
      >
        <div v-if="isFetchingDeleteCount" class="text-center py-4">
          Loading usage information...
        </div>
        <div v-else class="whitespace-pre-line">
          <h4 class="font-semibold mb-4">The following session label has related records that will be deleted:</h4>
          <div class="mt-4">
            <div class="font-semibold mb-2">
              {{ pendingDeleteSessionLabel?.name || 'Unknown' }}:
            </div>
            <div class="ml-4">
              <div>Total related records: {{ deleteUsageCount }}</div>
              <div>DL Sessions: {{ deleteUsageCount }}</div>
            </div>
          </div>
          <div class="mt-4 font-medium">
            Do you want to proceed?
          </div>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton strong type="error" @click="cancelDelete">
              Cancel
            </NButton>
            <NButton 
              strong 
              type="success" 
              @click="confirmDelete"
              :disabled="isFetchingDeleteCount"
            >
              Yes, Delete
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>
