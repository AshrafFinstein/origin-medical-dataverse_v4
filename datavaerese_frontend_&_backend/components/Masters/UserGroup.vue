<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui';
import { NButton, NCard, NCheckbox, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, useNotification } from 'naive-ui';
import { type UserGroupCreateSingleInput } from '~/server/trpc/routers/userGroup';
import type { UserGroup } from '@prisma/client'
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
const selectedArrayDuplicate = ref<[] | null>([])
const searchQuery = ref('')
const loading = ref(false)
const data = ref<any>(null)
const totalDataCount = ref(0)
const isHandlingSearch = ref(false)

// Validation state
const groupNameError = ref('')
const assigneesError = ref('')
const groupNameTouched = ref(false)
const assigneesTouched = ref(false)

// Use centralized validation utilities
const { validateRequired, validatePattern, validateAtLeastOne } = useFormValidation()

// Validation regex pattern - allows letters, numbers, underscores, and hyphens only
const validationPattern = /^[A-Za-z0-9_-]+$/

// Function to filter input to only allow valid characters
function filterInput(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '')
}

// Validation functions
function validateGroupName(value: string | undefined) {
  // Check required
  const requiredError = validateRequired(value, 'Group Name')
  if (requiredError) {
    groupNameError.value = requiredError
    return false
  }
  
  // Check pattern
  const patternError = validatePattern(value!, 'Group Name', validationPattern)
  if (patternError) {
    groupNameError.value = patternError
    return false
  }
  
  groupNameError.value = ''
  return true
}

function validateAssignees(users: any[] | undefined) {
  const error = validateAtLeastOne(users, 'Assignee')
  if (error) {
    assigneesError.value = error
    return false
  }
  
  assigneesError.value = ''
  return true
}

// LIST USERS
const { data: users, error: fetchUsersError } = await $client.auth0.listUsers.useQuery()
if (fetchUsersError.value) {
  notification.error({
    title: 'Error',
    content: fetchUsersError.value.message,
    duration: 5000,
    closable: true,
  })
}

const userOptions = computed(() => {
  if (users.value === null) return []
  
  // Deduplicate users by user_id to avoid duplicates
  const seenUserIds = new Set<string>()
  return users.value
    .filter((user: any) => {
      const userId = user.user_id ?? ''
      if (userId && !seenUserIds.has(userId)) {
        seenUserIds.add(userId)
        return true
      }
      return false
    })
    .map((user: any) => ({
      label: user.name ?? '',
      value: user.user_id ?? '',
    }))
})

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<any>>(() => [
  {
    key: 'groupName',
    title: 'Group Name',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.groupName || false,
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NInput, {
          value: row.groupName,
          onUpdateValue(v: string) {
            data.value!.data[index].groupName = v
          },
          placeholder: 'Enter Group Name',
          'data-testid': `user-group-name-input-${index}`,
        })
        : row.groupName
    },
  },
  {
    key: 'updatedAt',
    title: 'Updated at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.updatedAt || false,
    render: (row: UserGroup) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: UserGroup) => {
      return row.createdAt.toLocaleString()
    },
  },
  {
    key: 'description',
    title: 'Description',
    width: '20%',
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
          placeholder: 'Enter Description',
          'data-testid': `user-group-description-input-${index}`,
        })
        : row.description
      },
    },
    {
    key: 'users',
    title: 'Assignees',
    width: '20%',
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NSelect, {
          multiple: true,
          options: userOptions.value,
          value: row?.usersInGroup?.map((user: any) => user.userId),
          filterable: true,
          keyboard: true,
          placeholder: 'Select Assignees',
          'data-testid': `user-group-assignees-select-${index}`,
          onKeydown: (event: any) => {
            if (event?.key === 'Enter') {
              handleEnterKeyEdit(event, index, row.id)
            }
          },
          onSearch: (event) => handleSearch(event),
          onUpdateValue(v: string[]) {
            data.value!.data[index].usersInGroup = v.map(userId => ({
              userId,
              userRole:'NORMAL'
            }))
          },
        })
        : h(
          'div',
          [
            h(
            'ul',
              (() => {
                // Get unique userIds from usersInGroup to avoid duplicates
                const userIdsToShow = showMoreAssignees.value[index] 
                  ? row?.usersInGroup 
                  : row?.usersInGroup?.slice(0, 5)
                const uniqueUserIds = [...new Set(userIdsToShow?.map((rowUser: any) => rowUser.userId) || [])]
                
                // Filter and deduplicate users by userId
                const seenUserIds = new Set<string>()
                return userOptions.value
                  .filter(user => {
                    if (uniqueUserIds.includes(user.value) && !seenUserIds.has(user.value)) {
                      seenUserIds.add(user.value)
                      return true
                    }
                    return false
                  })
                  .map(({ value, label }) =>
                    h('li', { key: value, style: { listStyleType: 'circle' } }, label)
                  )
              })()
            ),
            h(
              'ul',
              row?.usersInGroup?.length > 5
                ? h(
                    'div',
                    [
                      h(
                        'span',
                        {
                          'data-testid': `user-group-assignees-more-button-${index}`,
                          onClick: () => showMoreClickAssignees(!showMoreAssignees.value[index], index),
                          style: { cursor: 'pointer', color: '#1890ff' },
                        },
                        showMoreAssignees.value[index] ? '...Less' : '...More'
                      )
                    ]
                  ) : null
            )
          ]
        )
    },
    },
    {
    key: 'actions',
    title: 'Actions',
    width: '20%',
    render(row, index) {
      return h('div', {
        class: 'inline-flex items-center gap-2',
        'data-testid': `user-group-actions-row-${index}`,
      }, [
        canUpdateUserGroup.value ? 
        editedRow.value?.id !== row.id
          ? h(NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `user-group-edit-button-${index}`,
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
                  'data-testid': `user-group-update-button-${index}`,
                  onClick: () => updateRow(row),
                  disabled: !row.groupName || 
                    (row.groupName === originalEditedRow.value?.groupName && 
                     row.description === originalEditedRow.value?.description &&
                     JSON.stringify(row.usersInGroup?.map((u: any) => u.userId).sort()) === 
                     JSON.stringify(originalEditedRow.value?.usersInGroup?.map((u: any) => u.userId).sort())),
                },
                { default: () => 'Update' }),
              h(NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  'data-testid': `user-group-cancel-button-${index}`,
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

const showMoreAssignees = ref<boolean[]>([]);
function showMoreClickAssignees(val: boolean, index: number) {
  showMoreAssignees.value[index] = val;
}

async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchUserGroups()
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
    await fetchUserGroups()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchUserGroups()
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


// LIST User Group
async function fetchUserGroups({
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
    const response = await $client.userGroup.list.query({
      limit: params.perPage,
      offset: (params.page - 1) * params.perPage,
      sort: params.sort.map(({ columnKey, order }) => ({
        [columnKey]: order === 'ascend' ? 'asc' : 'desc',
      })),
      search: searchQuery.value,
    })
    
    data.value = response
    pagination.pageCount = Math.ceil(response.metadata.totalCount / pagination.pageSize)
    totalDataCount.value = response.metadata.totalCount
  } catch (error) {
    console.log(error)
    notification.error({
      title: 'Error',
      content: 'Failed to fetch user groups',
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
      fetchUserGroups()
    })
  }
})

// Handle table search with pagination reset
async function handleTableSearch() {
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
    await fetchUserGroups()
  } finally {
    // Reset flag after a short delay to allow watcher to complete
    setTimeout(() => {
      isHandlingSearch.value = false
    }, 100)
  }
}

// CREATE User Group
const newUserGroup = ref<UserGroupCreateSingleInput | null>(null)
const isCreatingUserGroup = computed(() => !!newUserGroup.value)
async function createUserGroup() {
  if (newUserGroup.value) {
    // Mark all fields as touched when submitting
    groupNameTouched.value = true
    assigneesTouched.value = true
    
    // Validate before saving
    const isGroupNameValid = validateGroupName(newUserGroup.value.groupName)
    const isAssigneesValid = validateAssignees(newUserGroup.value.users)
    
    if (!isGroupNameValid || !isAssigneesValid) {
      return
    }
    
    try {
      await $client.userGroup.create.mutate(newUserGroup.value)
      notification.success({ content: `User Group Created Successfully`, duration: 5000 })
      newUserGroup.value = null;
      selectedAssigneesCount.value = 0;
      selectAllAssignees.value = false;
      assigneesIndeterminate.value = false;
      groupNameError.value = ''
      assigneesError.value = ''
      groupNameTouched.value = false
      assigneesTouched.value = false
      await fetchUserGroups()
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


// UPDATE User Group
const editedRow = ref<UserGroup | null>(null)
const originalEditedRow = ref<UserGroup | null>(null)
async function updateRow(row: UserGroup) {
  // Validate before updating
  const isGroupNameValid = validateGroupName(row.groupName)
  const isAssigneesValid = validateAssignees(row.usersInGroup)
  
  if (!isGroupNameValid || !isAssigneesValid) {
    if (!isGroupNameValid) {
      notification.create({
        title: 'Error',
        type: 'error',
        content: groupNameError.value,
        duration: 5000,
        closable: true,
      })
    }
    if (!isAssigneesValid) {
      notification.create({
        title: 'Error',
        type: 'error',
        content: assigneesError.value,
        duration: 5000,
        closable: true,
      })
    }
    return
  }
  
  try {
    const { createdAt, updatedAt, ...filteredRow } = row;
    await $client.userGroup.update.mutate(filteredRow)
    notification.success({ content: `User Group Updated Successfully`, duration: 5000 })
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
    groupNameError.value = ''
    assigneesError.value = ''
    await fetchUserGroups()
  }
}

watch(data, () => {
  if (data.value?.metadata.totalCount)
    pagination.pageCount = Math.ceil(data.value.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})

async function handleSearch(e?: any) {
  if (!e.length) {
    selectedArrayDuplicate.value = users.value
    return
  }
  let queryEmails = e.split(',').map(email => email.trim());

  selectedArrayDuplicate.value = await users.value.filter((item: any) => {
    return queryEmails.some(queryEmail => item.email.toLowerCase().includes(queryEmail.toLowerCase()));
  })
}

async function handleEnterKeyEdit(e?: any, index: number, projectId: number) {
  if (projectId) {
    selectedArrayDuplicate.value!.forEach((item: any) => {
      var obj = {
        userId: item.user_id,
        userRole: "NORMAL"
      }
      
      if (data.value?.data[index]?.usersInGroup) {
        const isPresent: boolean = data.value.data[index].usersInGroup.some((project: any) => 
            project.userId === obj.userId && project.userRole === obj.userRole
        );
        if (!isPresent) {
          data.value.data[index].usersInGroup.push(obj)
        }
      }
    })
  }
}

async function handleEnterKey() {
  if (newUserGroup.value && newUserGroup.value.users) {
    selectedArrayDuplicate.value!.forEach((item: any) => {
      var obj = {
        userId: item.user_id,
        userRole: "NORMAL"
      }
      const isPresent: boolean = newUserGroup.value!.users.some(project => 
          project.userId === obj.userId && project.userRole === obj.userRole
      );
      if (!isPresent) {
        newUserGroup.value!.users.push(obj)
        selectedAssigneesCount.value = newUserGroup.value!.users.length;
      }
    })
  }
}

const selectAllAssignees = ref<Boolean>(false)
const assigneesIndeterminate = ref<Boolean>(false)
const selectedAssigneesCount = ref(0)

async function handleSelectAllAssignees() {
  if (!newUserGroup.value || !newUserGroup.value.users) return;
  
  if (selectAllAssignees.value) {
    const allValues = userOptions.value.map(option => option.value);
    let val = allValues.map(userId => ({ userId }));
    let selectedValues = users.value!.filter(item2 => val.some(item1 => item1.userId === item2.user_id))
    .map(filteredItem => filteredItem.email)

    selectedAssigneesCount.value = selectedValues.length
    await handleSearch(selectedValues.toString().replace(/['\[\]]/g, ''))
    await handleEnterKey()
  } else {
    newUserGroup.value!.users = []
    selectedAssigneesCount.value = 0
    assigneesIndeterminate.value = false
    selectAllAssignees.value = false
  }
  // Trigger validation when select all changes
  assigneesTouched.value = true
  if (newUserGroup.value) {
    validateAssignees(newUserGroup.value.users)
  }
}

const canCreateUserGroup = ref<boolean>(false);
const canUpdateUserGroup = ref<boolean>(false);

async function checkAbilities() {
  canCreateUserGroup.value = await defineAbilitiesFor(Module.UserGroup, Action.CREATE);
  canUpdateUserGroup.value = await defineAbilitiesFor(Module.UserGroup, Action.UPDATE);
}

onMounted(() => {
  checkAbilities();
  fetchUserGroups(); // Fetch data on mount
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
          <h2>User Group</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="handleTableSearch"
            placeholder="Search"
          />
          <NButton
            v-if="canCreateUserGroup"
            data-testid="user-group-create-button"
            strong secondary type="primary" @click="newUserGroup = {
              groupName: '',
              description: '',
              users: [],
            }; groupNameError = ''; assigneesError = ''; groupNameTouched = false; assigneesTouched = false; selectedAssigneesCount = 0; selectAllAssignees = false; assigneesIndeterminate = false;"
          >
            Create User Group
          </NButton>
        </div>
      </div>
      <NDataTable
        data-testid="user-group-table"
        ref="table"
        :key="(row: UserGroup) => row.id"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
    <NModal
      v-if="newUserGroup"
      v-model:show="isCreatingUserGroup"
      data-testid="user-group-create-modal"
    >
      <NCard
        class="w-[600px]"
        :title="`Create User Group`"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="newUserGroup = null; groupNameError = ''; assigneesError = ''; groupNameTouched = false; assigneesTouched = false; selectAllAssignees = false; assigneesIndeterminate = false; selectedAssigneesCount = 0;"
        :style="{ 
          maxHeight: '90vh',
          width: '800px',
          display: 'flex',
          flexDirection: 'column',
        }"
      >
        <div :style="{ 
          overflowY: 'auto', 
          overflowX: 'hidden',
          flex: '1 1 auto', 
          minHeight: 0,
          maxHeight: 'calc(90vh - 180px)'
        }">
          <NForm
            :model="newUserGroup"
            label-placement="left"
            require-mark-placement="right-hanging"
            size="medium"
            label-width="140"
          >
            <NFormItem label="Group Name" required path="groupname" :validation-status="groupNameTouched && groupNameError ? 'error' : undefined" class="mb-4">
                <NInput 
                  data-testid="user-group-create-name-input"
                  v-model:value="newUserGroup.groupName" 
                  :placeholder="`Give the new Group a name`"
                  @input="groupNameTouched = true; validateGroupName(newUserGroup.groupName)"
                  @blur="groupNameTouched = true; if (newUserGroup) validateGroupName(newUserGroup.groupName)"
                />
                <template v-if="groupNameTouched && groupNameError" #feedback>
                  <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ groupNameError }}</span>
                </template>
            </NFormItem>
          
          <NFormItem  label="Description" path="description" class="mb-4">
            <NInput
              data-testid="user-group-create-description-input"
              v-model:value="newUserGroup.description" placeholder="Provide a description" type="textarea"
              :autosize="{
                minRows: 2,
                maxRows: 4,
              }"
            />
          </NFormItem>
          <NFormItem label="Assignees" required path="users" :validation-status="assigneesTouched && assigneesError ? 'error' : undefined" class="mb-0" :style="{ alignItems: 'flex-start' }">
            <div class="w-full flex flex-col">
            <div class="flex justify-end mb-2 -mt-6">
              <NCheckbox data-testid="user-group-create-select-all-assignees" v-model:checked="selectAllAssignees" :indeterminate="assigneesIndeterminate" @update:checked="handleSelectAllAssignees"> {{ selectedAssigneesCount  > 0  ? 'Deselect All' : 'Select All'}} </NCheckbox>
            </div>
            <NSelect
              data-testid="user-group-create-assignees-select"
              :value="newUserGroup.users.map(user => user.userId)"
              :options="userOptions"
              multiple
              filterable
              placeholder="Select Assignees"
              @search="handleSearch"
              @keyup.enter="handleEnterKey"
              @blur="assigneesTouched = true; if (newUserGroup) validateAssignees(newUserGroup.users)"
              @update:value="(v: string[]) => {
                newUserGroup!.users = v.map(userId => ({
                  userId,
                  userRole: 'NORMAL',
                }))
                selectedAssigneesCount = v.length
                assigneesIndeterminate = selectedAssigneesCount == 0 ?  false : userOptions.length == selectedAssigneesCount ? false : true
                selectAllAssignees = selectedAssigneesCount == 0 ? false : ''
                assigneesTouched = true
                if (assigneesTouched) {
                  validateAssignees(newUserGroup.users)
                }
              }"
            />
            <span v-if="selectedAssigneesCount" class="text-primary-600 mt-2">{{selectedAssigneesCount}}  {{ selectedAssigneesCount == 1 ? 'Assignee' : 'Assignees' }} Selected</span>
          </div>
          <template v-if="assigneesTouched && assigneesError" #feedback>
            <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ assigneesError }}</span>
          </template>
          </NFormItem>
        </NForm>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="user-group-create-cancel-button" strong type="error" @click="newUserGroup = null; groupNameError = ''; assigneesError = ''; groupNameTouched = false; assigneesTouched = false;">
              Cancel
            </NButton>
            <NButton 
              data-testid="user-group-create-submit-button"
              strong 
              type="success" 
              @click="createUserGroup"
              :disabled="!!groupNameError || !!assigneesError || !newUserGroup.groupName || !newUserGroup.users || newUserGroup.users.length === 0"
            >
              Submit
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>