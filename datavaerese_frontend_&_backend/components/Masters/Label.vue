<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { Label } from '@prisma/client'
import type { DataTableColumns, DataTableSortState  } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, useNotification, type FormInst, type FormRules } from 'naive-ui'
import type { LabelCreateSingleInput } from '~/server/trpc/routers/label'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import SearchComponent from '~/components/searchBarMasters.vue'
import { useFormValidation } from '~/composables/useFormValidation'


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

// Validation state
const nameError = ref('')
const abbreviationError = ref('')
const nameTouched = ref(false)
const abbreviationTouched = ref(false)

// Use centralized validation utilities
const { validateRequired, validatePattern } = useFormValidation()

// Validation regex pattern - allows letters, numbers, underscore, and hyphen only
const validationPattern = /^[A-Za-z0-9_-]+$/

// Validation regex pattern for abbreviation - allows uppercase and lowercase letters, hyphens, and underscores
const abbreviationPattern = /^[A-Za-z0-9_-]+$/

// Function to filter input to only allow valid characters (letters, numbers, underscore, hyphen)
function filterInput(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '')
}

// Function to filter abbreviation input to allow letters (uppercase and lowercase), hyphens, and underscores
function filterAbbreviationInput(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '')
}

// Validation functions
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
async function exportLabels() {
  try {
    loading.value = true
    
    const config = useRuntimeConfig()
    const res = await fetch(`${config.public.API_URL}/api/labels/download-all`)
    
    if (!res.ok) {
      throw new Error(`Failed to download labels: ${res.statusText}`)
    }
    
    // Get the filename from Content-Disposition header or use default
    const contentDisposition = res.headers.get('Content-Disposition')
    let downloadFileName = 'labels_data.xlsx'
    
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
      content: `Labels data exported successfully as ${downloadFileName}`,
      duration: 3000,
      closable: true
    })
  } catch (error: any) {
    console.error('Error exporting labels:', error)
    notification.error({
      title: 'Export Failed',
      content: formatErrorMessage(error) || 'Failed to export labels data',
      duration: 5000,
      closable: true
    })
  } finally {
    loading.value = false
  }
}

function validateAbbreviation(value: string | undefined) {
  // Check required
  const requiredError = validateRequired(value, 'Abbreviation')
  if (requiredError) {
    abbreviationError.value = requiredError
    return false
  }
  
  // Check pattern - letters (uppercase and lowercase), numbers, hyphens, and underscores allowed
  const patternError = validatePattern(value!, 'Abbreviation', abbreviationPattern)
  if (patternError) {
    // Check if the value contains spaces for a more specific error message
    if (value && value.includes(' ')) {
      abbreviationError.value = 'Spaces are not allowed'
    } else {
      abbreviationError.value = 'Abbreviation can only contain letters (uppercase and lowercase), numbers, hyphens, and underscores. Spaces are not allowed'
    }
    return false
  }
  
  abbreviationError.value = ''
  return true
}

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<Label>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: '20%',
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
          placeholder: 'Enter Label Name',
          'data-testid': `label-name-input-${index}`,
        })
        : row.name
    },
  },
  {
    key: 'updatedAt',
    title: 'Updated at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.updatedAt || false,
    render: (row: Label) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: Label) => {
      return row.createdAt.toLocaleString()
    },
  },
  {
    key: 'abbreviation',
    title: 'Abbreviation',
    width: '20%',
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NInput, {
          value: row.abbreviation,
          onUpdateValue(v: string) {
            data.value!.data[index].abbreviation = v
          },
          placeholder: 'Enter Abbreviation',
          'data-testid': `label-abbreviation-input-${index}`,
        })
        : row.abbreviation
      },
    },
    {
    key: 'actions',
    title: 'Actions',
    width: '20%',
    render(row, index) {
      return h('div', {
        class: 'inline-flex items-center gap-2',
        'data-testid': `label-actions-row-${index}`,
      }, [
        canUpdateLabel.value ? 
        editedRow.value?.id !== row.id
          ? h(NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `label-edit-button-${index}`,
              onClick: () => {
                originalEditedRow.value = Object.assign({}, row)
                editedRow.value = Object.assign({}, row)
              },
            },
            { default: () => 'Edit' })
          : [
              h(NButton,
                {
                  strong: true,
                  type: 'success',
                  size: 'small',
                  'data-testid': `label-update-button-${index}`,
                  onClick: () => updateRow(row),
                  disabled: !row.name || !row.abbreviation || (row.name === originalEditedRow.value?.name && row.abbreviation === originalEditedRow.value?.abbreviation),
                },
                { default: () => 'Update' }),
              h(NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  'data-testid': `label-cancel-button-${index}`,
                  onClick: () => {
                    data.value!.data[index] = { ...originalEditedRow.value! };
                    editedRow.value = null
                    originalEditedRow.value = null
                  },
                },
                { default: () => 'Cancel' }),
            ] : null
      ])
    },
    }
]);

async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchLabels()
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
    await fetchLabels()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchLabels()
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

async function fetchLabels({
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
  await $client.label.list.query({
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

// CREATE LABEL
const newLabel = ref<LabelCreateSingleInput | null>(null)
const isCreatingLabel = computed(() => !!newLabel.value)

const formRef = ref<FormInst | null>(null)

const formRules: FormRules = {
  name: [{ required: true,        message: 'Label name is required',  trigger: ['input', 'blur'],},],
  abbreviation: [{ required: true, message: 'Abbreviation is required.', trigger: ['input', 'blur'],}, ],
}
async function createLabel() {
  if (newLabel.value) {
    // Mark all fields as touched when submitting
    nameTouched.value = true
    abbreviationTouched.value = true
    
    // Validate before submitting
    const isNameValid = validateName(newLabel.value.name)
    const isAbbreviationValid = validateAbbreviation(newLabel.value.abbreviation)
    
    if (!isNameValid || !isAbbreviationValid) {
      return
    }
    
    try {
      await formRef.value?.validate()
      await $client.label.create.mutate(newLabel.value)
      notification.success({ content: `Label Created Successfully`, duration: 5000 })
      newLabel.value = null
      nameError.value = ''
      abbreviationError.value = ''
      nameTouched.value = false
      abbreviationTouched.value = false
      await fetchLabels()
    }
    catch (error: any) {
      // Validation errors are shown inline
      if (error.message === 'Form validation failed') {
        // Do nothing, errors handled inline
      } else if (error.message && (error.message.includes('Unique constraint failed') || error.message.includes('already exists'))) {
        notification.create({ title: 'Error', type: 'error', content: 'Label name or Abbreviation is already exists.', duration: 5000, closable: true })
      } else {
        notification.create({ title: 'Error', type: 'error', content: formatErrorMessage(error), duration: 5000, closable: true })
      }
    }
  }
}

// UPDATE LABEL
const editedRow = ref<Label | null>(null)
const originalEditedRow = ref<Label | null>(null)
async function updateRow(row: Label) {
  if (!row.name) {
    notification.create({title: 'Error',type: 'error',content: 'Label name is required.',duration: 5000,closable: true,})
    return
  }
  if (!row.abbreviation) {
    notification.create({title: 'Error',type: 'error',content: 'Label Abbreviation is required.',duration: 5000,closable: true,})
    return
  }
  try {
    const { createdAt, updatedAt, ...filteredRow } = row;
    await $client.label.update.mutate(filteredRow)
    notification.success({ content: `Label name and Abbreviation Updated Successfully`, duration: 5000 })
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
  finally {
    editedRow.value = null
    await fetchLabels()
  }
}

const canCreateLabel = ref<boolean>(false);
const canUpdateLabel = ref<boolean>(false);
const canDownloadLabelData = ref<boolean>(false);
async function checkAbilities() {
  canCreateLabel.value = await defineAbilitiesFor(Module.Label, Action.CREATE);
  canUpdateLabel.value = await defineAbilitiesFor(Module.Label, Action.UPDATE);
  canDownloadLabelData.value = await defineAbilitiesFor(Module.Label, Action.Export);
}

onMounted(() => {
  checkAbilities();
  fetchLabels(); // Fetch data when component is mounted
});

watch(route, () => {
  checkAbilities();
});

watch(searchQuery, (newValue) => {
  if (newValue === '') {
    pagination.page = 1
    // Reset sorting to default (updatedAt descending)
    sortStates.value = [
      {
        columnKey: 'updatedAt',
        sorter: true,
        order: 'descend',
      },
    ]
    fetchLabels();
  }
})

// Handle search with pagination reset
async function handleSearch() {
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
  await fetchLabels()
}

// Helper functions for modal actions
function openCreateModal() {
  newLabel.value = {
    name: '',
    abbreviation: ''
  }
  nameError.value = ''
  abbreviationError.value = ''
  nameTouched.value = false
  abbreviationTouched.value = false
}

function closeModal() {
  newLabel.value = null
  nameError.value = ''
  abbreviationError.value = ''
  nameTouched.value = false
  abbreviationTouched.value = false
}
</script>

<template>
  <div>
    <div>
      <div class="inline-flex w-full justify-between items-center px-2 py-4">
        <div class="inline-flex items-center gap-2">
          <h2>Label</h2>
        </div>
        <div class="flex space-x-4">
          <!-- Search component with on-search event handler -->
          <SearchComponent
            v-model="searchQuery"
            :on-search="handleSearch"
            placeholder="Search"
          />
        <NButton
          v-if="canCreateLabel"
          data-testid="label-create-button"
          strong secondary type="primary" @click="openCreateModal"
        >
          Create Label
        </NButton>
        <NButton v-if="canDownloadLabelData"
          data-testid="label-export-button"
          strong secondary type="primary" @click="exportLabels"
        >
          Export Labels
        </NButton>
        </div>
      </div>
      <NDataTable
        data-testid="label-table"
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
      v-if="newLabel"
      v-model:show="isCreatingLabel"
      data-testid="label-create-modal"
    >
      <NCard
        class="w-[600px]"
        :title="`Create Label`"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="closeModal"
        :style="{ 
          height: 'auto',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
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
            :model="newLabel"
            :rules="formRules"
            label-placement="left"
            require-mark-placement="right-hanging"
            size="medium"
            label-width="auto"
          >
            <NFormItem label="Name" path="name" :validation-status="nameTouched && nameError ? 'error' : undefined" class="mb-4">
                <NInput 
                  data-testid="label-create-name-input"
                  v-model:value="newLabel.name" 
                  placeholder="Enter Label Name"
                  @input="nameTouched = true; if (newLabel) validateName(newLabel.name)"
                  @blur="nameTouched = true; if (newLabel) validateName(newLabel.name)"
                />
                <template v-if="nameTouched && nameError" #feedback>
                  <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ nameError }}</span>
                </template>
            </NFormItem>
            
            <NFormItem  label="Abbreviation" path="abbreviation" :validation-status="abbreviationTouched && abbreviationError ? 'error' : undefined" class="mb-0">
              <NInput 
                data-testid="label-create-abbreviation-input"
                v-model:value="newLabel.abbreviation" 
                placeholder="Enter Abbreviation"
                @input="abbreviationTouched = true; if (newLabel) validateAbbreviation(newLabel.abbreviation)"
                @blur="abbreviationTouched = true; if (newLabel) validateAbbreviation(newLabel.abbreviation)"
              />
              <template v-if="abbreviationTouched && abbreviationError" #feedback>
                <span class="text-red-500 text-xs" style="margin-top: 4px; display: block;">{{ abbreviationError }}</span>
              </template>
            </NFormItem>
          </NForm>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="label-create-cancel-button" strong type="error" @click="closeModal">
              Cancel
            </NButton>
            <NButton data-testid="label-create-submit-button" strong type="success" @click="createLabel" :disabled="!newLabel.name || !newLabel.abbreviation || !!nameError || !!abbreviationError">
              Submit
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>