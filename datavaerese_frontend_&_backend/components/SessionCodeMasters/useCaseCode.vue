<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { UseCaseCode } from '@prisma/client'
import type { DataTableColumns, DataTableSortState  } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, useNotification } from 'naive-ui'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import SearchComponent from '~/components/searchBarMasters.vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useErrorFormatter } from '~/composables/useErrorFormatter'


definePageMeta({
  layout: 'default',
})

const { $client } = useNuxtApp()
const router = useRouter()
const notification = useNotification()
const route = useRoute()
const searchQuery = ref('')
const loading = ref(false)
const data = ref<any>(null)
const totalDataCount = ref(0)
const isHandlingSearch = ref(false)
const { formatErrorMessage } = useErrorFormatter()

// Validation state
const useCaseCodeErrors = ref<string[]>([])
const useCaseCodeTouched = ref<boolean[]>([])

// Use centralized validation utilities
const { validateRequired, validatePattern } = useFormValidation()

// Validation regex pattern - allows letters, numbers, underscores, and hyphens only
const validationPattern = /^[A-Za-z0-9_-]+$/

// Validation function
function validateUseCaseCode(value: string | undefined, index: number) {
  // Check required
  const requiredError = validateRequired(value, 'Use Case Code')
  if (requiredError) {
    useCaseCodeErrors.value[index] = requiredError
    return false
  }
  
  // Check pattern
  const patternError = validatePattern(value!, 'Use Case Code', validationPattern)
  if (patternError) {
    useCaseCodeErrors.value[index] = patternError
    return false
  }
  
  useCaseCodeErrors.value[index] = ''
  return true
}


// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<UseCaseCode>>(() => [
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
          placeholder: 'Enter Use Case Code',
          'data-testid': `use-case-code-name-input-${index}`,
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
    render: (row: UseCaseCode) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: UseCaseCode) => {
      return row.createdAt.toLocaleString()
    },
  },
    {
    key: 'actions',
    title: 'Actions',
    width: '20%',
    render(row, index) {
      return h('div', {
        class: 'inline-flex items-center gap-2',
        'data-testid': `use-case-code-actions-row-${index}`,
      }, [ canUpdateUseCaseCode.value ?
        editedRow.value?.id !== row.id
          ? h(NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `use-case-code-edit-button-${index}`,
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
                  'data-testid': `use-case-code-update-button-${index}`,
                  onClick: () => updateRow(row),
                  disabled: !row.name || (row.name === originalEditedRow.value?.name),
                },
                { default: () => 'Update' }), 
              h(NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  'data-testid': `use-case-code-cancel-button-${index}`,
                  onClick: () => {
                    data.value!.data[index] = { ...originalEditedRow.value! };
                    editedRow.value = null
                    originalEditedRow.value = null
                  },
                },
                { default: () => 'Cancel' }),
            ] : '-'
      ])
    },
    }
]);

async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchUseCaseCodes()
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
    await fetchUseCaseCodes()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchUseCaseCodes()
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


// LIST Use Case code
async function fetchUseCaseCodes({
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
  try {
    const response = await $client.sessionCodes.useCaseCode.query({
      search: searchQuery.value,
      limit: params.perPage,
      offset: (params.page - 1) * params.perPage,
      sort: params.sort.map(({ columnKey, order }) => ({
        [columnKey]: order === 'ascend' ? 'asc' : 'desc',
      })),
    })
    
    data.value = response
    pagination.pageCount = Math.ceil(response.metadata.totalCount / pagination.pageSize)
    totalDataCount.value = response.metadata.totalCount
  } catch (error) {
    console.log(error)
    notification.error({
      title: 'Error',
      content: 'Failed to fetch use case codes',
      duration: 5000,
    })
  } finally {
    loading.value = false
  }
}

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
    await fetchUseCaseCodes()
  } finally {
    // Reset flag after a short delay to allow watcher to complete
    setTimeout(() => {
      isHandlingSearch.value = false
    }, 100)
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
      fetchUseCaseCodes()
    })
  }
})

// CREATE Use Case Code
const newUseCaseCode = ref<any>(null)
const isCreatingUseCaseCode = computed(() => !!newUseCaseCode.value)

// Computed property to check if form is valid and can be submitted
const isFormValid = computed(() => {
  if (!newUseCaseCode.value || newUseCaseCode.value.length === 0) {
    return false
  }
  
  // Check if all fields are filled and valid
  return newUseCaseCode.value.every((item: any, index: number) => {
    const value = item.name?.trim()
    // Field must be filled
    if (!value || value.length === 0) {
      return false
    }
    // Field must pass validation pattern
    if (!validationPattern.test(value)) {
      return false
    }
    return true
  })
})

async function createUseCaseCode() {
  if (newUseCaseCode.value) {
    // Mark all fields as touched and validate
    let isValid = true
    newUseCaseCode.value.forEach((_: any, index: number) => {
      useCaseCodeTouched.value[index] = true
      if (!validateUseCaseCode(_.name, index)) {
        isValid = false
      }
    })
    
    if (!isValid) {
      return
    }
    
    try {
      await $client.sessionCodes.createUseCaseCode.mutate(newUseCaseCode.value)
      notification.success({ content: `Use Case Code Created Successfully`, duration: 5000 })
      newUseCaseCode.value = null
      useCaseCodeErrors.value = []
      useCaseCodeTouched.value = []
      await fetchUseCaseCodes()
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

// UPDATE Use Case Code
const editedRow = ref<UseCaseCode | null>(null)
const originalEditedRow = ref<UseCaseCode | null>(null)
async function updateRow(row: UseCaseCode) {
  try {
    const { createdAt, updatedAt, ...filteredRow } = row;
    await $client.sessionCodes.updateUseCaseCode.mutate(filteredRow)
    notification.success({ content: `Use Case Code Updated Successfully`, duration: 5000 })
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
    originalEditedRow.value = null
    await fetchUseCaseCodes()
  }
}

watch(data, () => {
  if (data.value?.metadata.totalCount)
    pagination.pageCount = Math.ceil(data.value.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})

const canCreateUseCaseCode = ref<boolean>(false);
const canReadUseCaseCode = ref<boolean>(false);
const canUpdateUseCaseCode = ref<boolean>(false);

async function checkAbilities() {
  canCreateUseCaseCode.value = await defineAbilitiesFor(Module.SessionCodes, Action.CREATE);
  canReadUseCaseCode.value = await defineAbilitiesFor(Module.SessionCodes, Action.READ);
  canUpdateUseCaseCode.value = await defineAbilitiesFor(Module.SessionCodes, Action.UPDATE);
}

onMounted(() => {
  checkAbilities();
  fetchUseCaseCodes(); // Fetch data on mount
});

watch(route, () => {
  checkAbilities();
});


</script>

<template>
  <div>
    <div>
      <div class="inline-flex w-full justify-between items-center px-2 py-4">
        <div class="inline-flex items-center gap-2">
          <h2>Use Case Code</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="handleSearch"
            placeholder="Search"
          />
        <NButton
          v-if="canCreateUseCaseCode"
          data-testid="use-case-code-create-button"
          strong secondary type="primary" @click="newUseCaseCode = [{ name: '' }]; useCaseCodeErrors = ['']; useCaseCodeTouched = [false]"
        >
          Create a Use Case Code
        </NButton>
        </div>
      </div>
      <NDataTable
        v-if="canReadUseCaseCode"
        data-testid="use-case-code-table"
        ref="table"
        :key="(row: UseCaseCode) => row.id"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
    <NModal
      v-if="newUseCaseCode"
      v-model:show="isCreatingUseCaseCode"
      data-testid="use-case-code-create-modal"
    >
      <NCard
        class="w-[600px]"
        :title="`Create a Use Case Code`"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="newUseCaseCode = null; useCaseCodeErrors = []; useCaseCodeTouched = []"
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
            :model="newUseCaseCode"
            label-placement="left"
            require-mark-placement="right-hanging"
            size="medium"
            label-width="auto"
          >
            <NFormItem label="Use Case Code" required path="projectCode" class="mb-0">
              <div class="flex flex-col w-full gap-2">
                <div v-for="(_, index) in newUseCaseCode" :key="index" class="flex flex-col gap-1">
                  <div class="inline-flex items-center gap-2">
                    <div class="flex flex-row gap-2 w-[100%]">
                      <NInput 
                        :data-testid="`use-case-code-create-input-${index}`"
                        v-model:value="_.name" 
                        :placeholder="`Enter Use Case Code`"
                        :status="useCaseCodeTouched[index] && useCaseCodeErrors[index] ? 'error' : undefined"
                        @input="useCaseCodeTouched[index] = true; validateUseCaseCode(_.name, index)"
                        @blur="useCaseCodeTouched[index] = true; validateUseCaseCode(_.name, index)"
                      />
                    </div>
                    <Icon
                      name="ph:minus-circle"
                      class="flex-none text-primary-500 hover:text-primary-300 cursor-pointer"
                      @click="newUseCaseCode.splice(index, 1); useCaseCodeErrors.splice(index, 1); useCaseCodeTouched.splice(index, 1)"
                    />
                  </div>
                  <div 
                    v-if="useCaseCodeTouched[index] && useCaseCodeErrors[index]" 
                    class="text-red-500 text-xs"
                    style="margin-top: 4px; display: block; margin-bottom: 0; height: 20px; line-height: 1.2;"
                  >
                    {{ useCaseCodeErrors[index] }}
                  </div>
                  <div 
                    v-else
                    style="height: 20px;"
                  ></div>
                </div>
                <div 
                  data-testid="use-case-code-add-code-button"
                  v-if="newUseCaseCode!.length <= 4" style="width: fit-content;"
                  class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-300 text-sm cursor-pointer"
                  @click="newUseCaseCode.push({ name: '' }); useCaseCodeErrors.push(''); useCaseCodeTouched.push(false)"
                >
                  <Icon
                    name="ph:plus-circle"
                    class="flex-none"
                  />
                  <span>Add Code</span>
                </div>
              </div>
            </NFormItem>
          </NForm>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="use-case-code-create-cancel-button" strong type="error" @click="newUseCaseCode = null; useCaseCodeErrors = []; useCaseCodeTouched = []">
              Cancel
            </NButton>
            <NButton data-testid="use-case-code-create-submit-button" strong type="success" @click="createUseCaseCode" :disabled="!isFormValid">
              Submit
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>