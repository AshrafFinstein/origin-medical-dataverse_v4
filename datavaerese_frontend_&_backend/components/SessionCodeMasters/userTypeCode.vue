<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { UserTypeCode } from '@prisma/client'
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
const { formatErrorMessage } = useErrorFormatter()
const route = useRoute()
const searchQuery = ref('')
const loading = ref(false)
const data = ref<any>(null)
const totalDataCount = ref(0)
const isHandlingSearch = ref(false)

// Validation state
const userTypeCodeErrors = ref<string[]>([])
const userTypeCodeTouched = ref<boolean[]>([])

// Use centralized validation utilities
const { validateRequired, validatePattern } = useFormValidation()

// Validation regex pattern - allows letters, numbers, underscores, and hyphens only
const validationPattern = /^[A-Za-z0-9_-]+$/

// Validation function
function validateUserTypeCode(value: string | undefined, index: number) {
  // Check required
  const requiredError = validateRequired(value, 'User Type Code')
  if (requiredError) {
    userTypeCodeErrors.value[index] = requiredError
    return false
  }
  
  // Check pattern
  const patternError = validatePattern(value!, 'User Type Code', validationPattern)
  if (patternError) {
    userTypeCodeErrors.value[index] = patternError
    return false
  }
  
  userTypeCodeErrors.value[index] = ''
  return true
}


// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<UserTypeCode>>(() => [
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
          placeholder: 'Enter User Type Code',
          'data-testid': `user-type-code-name-input-${index}`,
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
    render: (row: UserTypeCode) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: UserTypeCode) => {
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
        'data-testid': `user-type-code-actions-row-${index}`,
      }, [ canUpdateUserTypeCode.value ?
        editedRow.value?.id !== row.id
          ? h(NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `user-type-code-edit-button-${index}`,
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
                  'data-testid': `user-type-code-update-button-${index}`,
                  onClick: () => updateRow(row),
                  disabled: !row.name || (row.name === originalEditedRow.value?.name),
                },
                { default: () => 'Update' }),
              h(NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  'data-testid': `user-type-code-cancel-button-${index}`,
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
    await fetchUserTypeCodes()
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
    await fetchUserTypeCodes()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchUserTypeCodes()
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


// LIST User Type Codes
async function fetchUserTypeCodes({
  params = {
    page: pagination.page,
    perPage: pagination.pageSize,
    sort: sortStates.value,
  },
  resetPage = false,
}: {
  params?: {
    page: number
    perPage: number
    sort: DataTableSortState[]
  },
  resetPage?: boolean
} = {}) {
  if (resetPage) {
    pagination.page = 1;
    params.page = 1;
  }
  
  loading.value = true
  try {
    const response = await $client.sessionCodes.userTypeCode.query({
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
      content: 'Failed to fetch user type codes',
      duration: 5000,
    })
  } finally {
    loading.value = false
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
      fetchUserTypeCodes()
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
    await fetchUserTypeCodes()
  } finally {
    // Reset flag after a short delay to allow watcher to complete
    setTimeout(() => {
      isHandlingSearch.value = false
    }, 100)
  }
}

// CREATE User Type Code
const newUserTypeCode = ref<any>(null)
const isCreatingUserTypeCode = computed(() => !!newUserTypeCode.value)

// Computed property to check if form is valid and can be submitted
const isFormValid = computed(() => {
  if (!newUserTypeCode.value || newUserTypeCode.value.length === 0) {
    return false
  }
  
  // Check if all fields are filled and valid
  return newUserTypeCode.value.every((item: any, index: number) => {
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

async function createUserTypeCode() {
  if (newUserTypeCode.value) {
    // Mark all fields as touched and validate
    let isValid = true
    newUserTypeCode.value.forEach((_: any, index: number) => {
      userTypeCodeTouched.value[index] = true
      if (!validateUserTypeCode(_.name, index)) {
        isValid = false
      }
    })
    
    if (!isValid) {
      return
    }
    
    try {
      await $client.sessionCodes.createUserTypeCode.mutate(newUserTypeCode.value)
      notification.success({ content: `User Type Code Created Successfully`, duration: 5000 })
      newUserTypeCode.value = null
      userTypeCodeErrors.value = []
      userTypeCodeTouched.value = []
      await fetchUserTypeCodes()
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

// UPDATE User Type Code
const editedRow = ref<UserTypeCode | null>(null)
const originalEditedRow = ref<UserTypeCode | null>(null)
async function updateRow(row: UserTypeCode) {
  try {
    const { createdAt, updatedAt, ...filteredRow } = row;
    await $client.sessionCodes.updateUserTypeCode.mutate(filteredRow)
    notification.success({ content: `User Type Code Updated Successfully`, duration: 5000 })
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
    await fetchUserTypeCodes()
  }
}

watch(data, () => {
  if (data.value?.metadata.totalCount)
    pagination.pageCount = Math.ceil(data.value?.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})

const canCreateUserTypeCode = ref<boolean>(false);
const canReadUserTypeCode = ref<boolean>(false);
const canUpdateUserTypeCode = ref<boolean>(false);

async function checkAbilities() {
  canCreateUserTypeCode.value = await defineAbilitiesFor(Module.SessionCodes, Action.CREATE);
  canReadUserTypeCode.value = await defineAbilitiesFor(Module.SessionCodes, Action.READ);
  canUpdateUserTypeCode.value = await defineAbilitiesFor(Module.SessionCodes, Action.UPDATE);
}

onMounted(() => {
  checkAbilities();
  fetchUserTypeCodes(); // Fetch data on mount
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
          <h2>User Type Code</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="handleSearch"
            placeholder="Search"
          />
          <NButton
            v-if="canCreateUserTypeCode"
            data-testid="user-type-code-create-button"
            strong secondary type="primary" @click="newUserTypeCode = [{ name: '' }]; userTypeCodeErrors = ['']; userTypeCodeTouched = [false]"
          >
            Create User Type Code
          </NButton>
        </div>
      </div>
      <NDataTable
        v-if="canReadUserTypeCode"
        data-testid="user-type-code-table"
        ref="table"
        :key="(row: UserTypeCode) => row.id"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
    <NModal
      v-if="newUserTypeCode"
      v-model:show="isCreatingUserTypeCode"
      data-testid="user-type-code-create-modal"
    >
      <NCard
        class="w-[600px]"
        :title="`Create a User Type Code`"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="newUserTypeCode = null; userTypeCodeErrors = []; userTypeCodeTouched = []"
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
            :model="newUserTypeCode"
            label-placement="left"
            require-mark-placement="right-hanging"
            size="medium"
            label-width="auto"
          >
            <NFormItem label="User Type Code" required path="userTypeCode" class="mb-0">
              <div class="flex flex-col w-full gap-2">
                <div v-for="(_, index) in newUserTypeCode" :key="index" class="flex flex-col gap-1">
                  <div class="inline-flex items-center gap-2">
                    <div class="flex flex-row gap-2 w-[100%]">
                      <NInput 
                        :data-testid="`user-type-code-create-input-${index}`"
                        v-model:value="_.name" 
                        :placeholder="`Enter User Type Code`"
                        :status="userTypeCodeTouched[index] && userTypeCodeErrors[index] ? 'error' : undefined"
                        @input="userTypeCodeTouched[index] = true; validateUserTypeCode(_.name, index)"
                        @blur="userTypeCodeTouched[index] = true; validateUserTypeCode(_.name, index)"
                      />
                    </div>
                    <Icon
                      name="ph:minus-circle"
                      class="flex-none text-primary-500 hover:text-primary-300 cursor-pointer"
                      @click="newUserTypeCode.splice(index, 1); userTypeCodeErrors.splice(index, 1); userTypeCodeTouched.splice(index, 1)"
                    />
                  </div>
                  <div 
                    v-if="userTypeCodeTouched[index] && userTypeCodeErrors[index]" 
                    class="text-red-500 text-xs"
                    style="margin-top: 4px; display: block; margin-bottom: 0; height: 20px; line-height: 1.2;"
                  >
                    {{ userTypeCodeErrors[index] }}
                  </div>
                  <div 
                    v-else
                    style="height: 20px;"
                  ></div>
                </div>
                <div 
                  data-testid="user-type-code-add-code-button"
                  v-if="newUserTypeCode && newUserTypeCode.length <= 4" style="width: fit-content;"
                  class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-300 text-sm cursor-pointer"
                  @click="newUserTypeCode.push({ name: '' }); userTypeCodeErrors.push(''); userTypeCodeTouched.push(false)"
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
            <NButton data-testid="user-type-code-create-cancel-button" strong type="error" @click="newUserTypeCode = null; userTypeCodeErrors = []; userTypeCodeTouched = []">
              Cancel
            </NButton>
            <NButton data-testid="user-type-code-create-submit-button" strong type="success" @click="createUserTypeCode" :disabled="!isFormValid">
              Submit
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>