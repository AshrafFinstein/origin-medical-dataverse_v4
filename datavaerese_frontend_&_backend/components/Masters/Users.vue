<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { NButton, NDataTable, useNotification, NSelect, NModal, NCard, NForm, NFormItem, NInput } from 'naive-ui'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import SearchComponent from '~/components/searchBarMasters.vue'
import { useErrorFormatter } from '~/composables/useErrorFormatter'

definePageMeta({
  layout: 'default',
})
const route = useRoute()

interface rowData {
  id : string,
  name: string,
  roleId?: string,
  userRoles : userRoles[],
}

interface userRoles {
  id : string,
  name: string,
}

interface userRoleResult {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string;
}

const { $client } = useNuxtApp()
const notification = useNotification()
const loading = ref(false)
const searchQuery = ref('')

// Get Role List
const userRoleResult = await $client.rolePermission.roleList.useQuery();

function renderUserRoles(row: rowData, userRoleResult: userRoleResult[]) {
  if (!row.userRoles || row.userRoles.length === 0) {
    return h('div',{
      style: {margin: '0px 0px 0px 15px ' }
    },'-'
    );
  }
  const matchedRoles = row.userRoles.map((role: userRoles) => userRoleResult.find((master: userRoleResult) => master.id === role.id)).filter(Boolean); 

  if (matchedRoles.length === 0) {
    return h('div',{
      style: {margin: '0px 0px 0px 15px ' }
    },'-'
    );
  }

  return h(
    'ul',
    matchedRoles.map((role: any) =>
      h('li', {
        style: { listStyleType: 'circle',margin: '0px 0px 0px 15px ' }
      }, role.name)
    )
  );
}

const newRolePermission = ref<null>(null)
const isCreatingRolePermission = computed(() => !!newRolePermission.value)

async function openEditModal(data: any) {
  newRolePermission.value = {
    permissions:  data.viewPermissions ? data.viewPermissions: []
  } 
}

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<rowData>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.name || false,
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id ? row.name : row.name;
    },
  },
  {
  key: 'roleName',
  title: 'Role',
  width: '20%',
  sorter: false,
  sortOrder: sortKeyMapOrder.value.roleName || false,
  ellipsis: true,
  render(row, index) {
    return editedRow.value?.id === row.id 
      ? h(NSelect, {
          class: 'inline-flex items-center gap-2 min-w-[200px]',
          multiple: true,
          placeholder: 'Select User Role',
          options: Object.values(userRoleResult.data.value!).map(key => ({
            label: key.name,
            value: key.id,
          })),
          value: row.userRoles.map((e: userRoles) => e.id),
          onUpdateValue: (value: any) => {
            row.userRoles = value.map((val: any) => {
              return userRoleResult.data.value!.find(role => role.id === val);
            });
            row.roleId = value;
          },
        })
      : h('div', [renderUserRoles(row, userRoleResult.data.value)]);
  }
},
  {
    key: 'actions',
    title: 'Actions',
    width: '20%',
    render(row, index) {
      return h('div', {
        class: 'inline-flex items-center gap-2',
        'data-testid': `user-actions-row-${index}`,
      }, [ canUpdateUser.value ?
        editedRow.value?.id !== row.id
          ?[ h(NButton, {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `user-edit-button-${index}`,
              onClick: () => {
                // Deep copy the row including userRoles array to preserve original state
                originalEditedRow.value = { 
                  ...row, 
                  userRoles: row.userRoles ? row.userRoles.map((role: userRoles) => ({ ...role })) : []
                };
                editedRow.value = { ...row };
              },
            }, { default: () => 'Edit' }),
              h('a', {
                href: '#',
                'data-testid': `user-view-permissions-link-${index}`,
                onClick: (e) => {
                  e.preventDefault();
                  openEditModal(row);
                },
                class: 'text-blue-500 underline ml-[20px]',
              }, 'View Permissions')]
          : [
              h(NButton, {
                strong: true,
                type: 'success',
                size: 'small',
                'data-testid': `user-update-button-${index}`,
                onClick: () => updateRow(row),
                disabled: JSON.stringify(row.userRoles?.map((r: userRoles) => r.id).sort()) === 
                         JSON.stringify(originalEditedRow.value?.userRoles?.map((r: userRoles) => r.id).sort()),
              }, { default: () => 'Update' }),
              h(NButton, {
                strong: true,
                type: 'error',
                size: 'small',
                'data-testid': `user-cancel-button-${index}`,
                onClick: () => {
                  // Restore the row from originalEditedRow
                  if (originalEditedRow.value) {
                    // Find and restore the row in filteredUserRoleListData
                    const filteredIndex = filteredUserRoleListData.value.findIndex((item: rowData) => item.id === originalEditedRow.value!.id);
                    if (filteredIndex !== -1) {
                      filteredUserRoleListData.value[filteredIndex] = {
                        ...originalEditedRow.value,
                        userRoles: originalEditedRow.value.userRoles ? originalEditedRow.value.userRoles.map((role: userRoles) => ({ ...role })) : []
                      };
                    }
                    
                    // Find and restore the row in userRoleListData
                    const listIndex = userRoleListData.value.findIndex((item: rowData) => item.id === originalEditedRow.value!.id);
                    if (listIndex !== -1) {
                      userRoleListData.value[listIndex] = {
                        ...originalEditedRow.value,
                        userRoles: originalEditedRow.value.userRoles ? originalEditedRow.value.userRoles.map((role: userRoles) => ({ ...role })) : []
                      };
                    }
                  }
                  
                  // Clear the edit state
                  editedRow.value = null;
                  originalEditedRow.value = null;
                },
              }, { default: () => 'Cancel' }),
            ]  : '-'
      ]);
    },
  },
]);


async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchUserRoles()
  }
}

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  onChange: async (page: number) => {
    pagination.page = page;
    applyFilters();
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    applyFilters();
  },
});

const sortStates = ref<DataTableSortState[]>([
  {
    columnKey: 'name',
    sorter: true,
    order: 'ascend',
  },
]);

const sortKeyMapOrder = computed(() => sortStates.value.reduce((result: Record<string, any>, { columnKey, order }) => {
  result[columnKey] = order;
  return result;
}, {}));

// User List data and filtering
const data = ref<any>(null);
const userData = ref<any[]>([]);
const userRoleListData = ref<rowData[]>([]);
const filteredUserRoleListData = ref<rowData[]>([]);

// LIST USERS
const { data: users, error: fetchUsersError } = await $client.auth0.listUsers.useQuery();

if (fetchUsersError.value) {
  notification.error({
    title: 'Error',
    content: fetchUsersError.value.message,
    duration: 5000,
    closable: true,
  });
}

// Fetch user role mapping data
async function fetchUserRoles() {
  loading.value = true;
  try {
    const response = await $client.rolePermission.userRoleMappinglist.query({
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
      sort: sortStates.value.map(({ columnKey, order }) => ({
        [columnKey]: order === 'ascend' ? 'asc' : 'desc',
      })),
    });
    
    data.value = response;
    updateUserRoleListData();
    applyFilters();
  } catch (error) {
    console.error("Error fetching user roles:", error);
    notification.error({
      title: 'Error',
      content: 'Failed to fetch user roles',
      duration: 5000,
    });
  } finally {
    loading.value = false;
  }
}

function updateUserRoleListData() {
  if (users.value && data.value) {
    userRoleListData.value = users.value.map((item: { user_id: string; email: string }) => {
      const roleMapping = data.value.find((e: any) => e.userId === item.user_id);
      const permissions = data.value.find((e: any) => e.userId === item.user_id)?.viewPermissions;
      return {
        id: item.user_id,
        name: item.email,
        userRoles: roleMapping ? roleMapping.UserRoles : [],
        viewPermissions: permissions ? permissions : [],
      };
    });
    applyFilters();
  }
}

// Apply filters and sorting
function applyFilters() {
  // Filter by search query
  let filtered = [...userRoleListData.value];
  
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search)
    );
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    for (const key in sortKeyMapOrder.value) {
      if (sortKeyMapOrder.value[key] === 'ascend') {
        if (a[key] > b[key]) return 1;
        if (a[key] < b[key]) return -1;
      } else if (sortKeyMapOrder.value[key] === 'descend') {
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
      }
    }
    return 0;
  });

  // Update pagination
  pagination.pageCount = Math.ceil(filtered.length / pagination.pageSize);
  
  // Apply pagination
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  
  filteredUserRoleListData.value = filtered.slice(start, end);
}

// Handle search
function handleSearch() {
  pagination.page = 1;
  applyFilters();
}

// Watch for empty search
watch(searchQuery, (newValue) => {
  if (newValue === '') {
    applyFilters();
  }
});

// UPDATE LABEL
const editedRow = ref<rowData | null>(null)
const originalEditedRow = ref<rowData | null>(null)
async function updateRow(row: rowData) {
  try {
    const payload: any = {
      userId: row.id,
      roleId: row.roleId
    }
    await $client.rolePermission.updateUserRoleMappinglist.mutate(payload)
    notification.success({ content: `Role Updated Successfully`, duration: 5000 })
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
    await fetchUserRoles()
  }
}

watch([users, data], () => {
  updateUserRoleListData();
}, { immediate: true });

const canReadUser = ref<boolean>(false);
const canUpdateUser = ref<boolean>(false);

async function checkAbilities() {
  canReadUser.value = await defineAbilitiesFor(Module.UserRoles, Action.READ);
  canUpdateUser.value = await defineAbilitiesFor(Module.UserRoles, Action.UPDATE);
}

onMounted(() => {
  checkAbilities();
  fetchUserRoles();
});

watch(route, () => {
  checkAbilities();
});

const moduleOrder = [
  'Epic',
  'Project',
  'Session',
  'Label',
  'Annotation',
  'Structure Group',
  'Users',
  'User Roles',
  'User Group',
  'Session Codes',
  'Session Label',
  'JSON'
];

const sortedPermissions = computed(() => {
  if (!newRolePermission.value?.permissions) return [];
  return [...newRolePermission.value.permissions].sort(
    (a, b) => moduleOrder.indexOf(a.Module.name) - moduleOrder.indexOf(b.Module.name)
  );
});

</script>

<template>
  <div>
    <div>
      <div class="inline-flex w-full justify-between items-center px-2 py-4">
        <div class="inline-flex w-full items-center justify-between">
          <h2>Users</h2>
          <div class="inline-flex w-[300px] items-center">
            <SearchComponent
              v-model="searchQuery"
              :on-search="handleSearch"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
      <NDataTable
        v-if="canReadUser"
        data-testid="user-table"
        ref="table"
        :key="(row: rowData) => row.id"
        remote
        :columns="columns"
        :data="filteredUserRoleListData"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
     <!-- View Role Permission Modal -->
    <NModal
      v-if="newRolePermission"
      v-model:show="isCreatingRolePermission"
      data-testid="user-view-permissions-modal"
    >
      <NCard
        class="w-[80vh]"
        :title="`Permissions`"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="newRolePermission = null"
      >
        <NForm
          :model="newRolePermission"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
          <NFormItem path="permissions">
            <div class="flex flex-col w-[100%]" v-if="newRolePermission.permissions.length">
              <div  class="flex flex-col mt-[10px] lg:items-start lg:justify-between" v-for="(item) in sortedPermissions"   :key="item.Module.id">
                <p class="lg:w-1/4 text-[18px] whitespace-nowrap">
                  {{ item.Module.name }}
                </p>
                <div class="flex flex-row ml-[40px] mt-[10px] flex-wrap lg:mt-0 lg:w-3/4">
                  <ul class="mt-[10px] flex flex-wrap gap-2 w-[100%]">
                    <li v-for="(action) in item.Actions" :key="action.id" class="mt-2 list-disc mr-[10px]">
                      {{ action.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="newRolePermission.permissions.length == 0">
              No Permission Granted
            </div>
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="user-view-permissions-cancel-button" strong type="error" @click="newRolePermission = null">
              Cancel
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>