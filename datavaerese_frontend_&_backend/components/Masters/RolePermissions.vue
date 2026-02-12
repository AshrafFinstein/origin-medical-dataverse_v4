<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { UserRoles } from '@prisma/client'
import type { DataTableColumns, DataTableSortState  } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, useNotification, NCheckbox, NSelect } from 'naive-ui'
import { RolePermissionCreateSingleInput, RolePermissionUpdateSingleInput } from '~/server/trpc/routers/rolePermission'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import SearchComponent from '~/components/searchBarMasters.vue'
import { useErrorFormatter } from '~/composables/useErrorFormatter'


definePageMeta({
  layout: 'default',
})

interface Permission {
  id: number;
  name: string;
  checked: boolean;
}

interface PermissionModule {
  id: number;
  name: string;
  checked: boolean;
  indeterminate: boolean;
  Permissions: Permission[];
}

const { $client } = useNuxtApp()
const notification = useNotification()
const { formatErrorMessage } = useErrorFormatter()
const route = useRoute()
const searchQuery = ref('')
const loading = ref(false)
const data = ref<any>(null)
const totalDataCount = ref(0)

// Validation state for role name
const nameError = ref('')
const nameTouched = ref(false)

// Validation regex pattern - allows letters (uppercase and lowercase), numbers, spaces, underscores, and hyphens
const validationPattern = /^[A-Za-z0-9_ -]+$/

// Validation function for role name
function validateRoleName(value: string | undefined) {
  if (!value) {
    nameError.value = 'Role name is required'
    return false
  }
  
  if (!validationPattern.test(value)) {
    // Check for special characters other than underscore, hyphen, and space
    if (/[^A-Za-z0-9_ -]/.test(value)) {
      nameError.value = 'Only letters, numbers, underscore (_), and hyphen (-) are allowed'
      return false
    }
    
    nameError.value = 'Only letters, numbers, spaces, underscores, and hyphens are allowed'
    return false
  }
  
  nameError.value = ''
  return true
}


// TABLE
const table = ref(null)
const formatDate = (date: Date) => date.toLocaleString();

const renderNameCell = (row: UserRoles, index: number) => {
  if (editedRow.value?.id === row.id) {
    return h(NInput, {
      value: row.name,
      onUpdateValue(v: string) {
        data.value!.data[index].name = v;
      },
    });
  }
  return row.name;
}

const renderActionCell = (row: UserRoles, index: number) => {
  const isEditing = editedRow.value?.id === row.id;

  return h('div', { 
    class: 'inline-flex items-center gap-2',
    'data-testid': `role-permission-actions-row-${index}`,
  }, [ canUpdateUserRoles.value ?
    isEditing
      ? [
          h(NButton, {
            strong: true,
            type: 'success',
            size: 'small',
            'data-testid': `role-permission-submit-button-${index}`,
            onClick: () => {},
          }, { default: () => 'Submit' }),
          h(NButton, {
            strong: true,
            type: 'error',
            size: 'small',
            'data-testid': `role-permission-cancel-button-${index}`,
            onClick: () => {
              data.value!.data[index] = { ...editedRow.value! };
              editedRow.value = null;
            },
          }, { default: () => 'Cancel' }),
        ]
      : h(NButton, {
          strong: true,
          tertiary: false,
          size: 'small',
          'data-testid': `role-permission-edit-button-${index}`,
          onClick: () => openEditModal(row.id),
        }, { default: () => 'Edit' }) : '-'
  ]);
}

const columns = computed<DataTableColumns<UserRoles>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.name || false,
    ellipsis: true,
    render: renderNameCell,
  },
  {
    key: 'updatedAt',
    title: 'Updated at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.updatedAt || false,
    render: (row: UserRoles) => formatDate(row.updatedAt),
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: UserRoles) => formatDate(row.createdAt),
  },
  {
    key: 'actions',
    title: 'Actions',
    width: '20%',
    render: renderActionCell,
  },
])


async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchRolePermissions()
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
    await fetchRolePermissions()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchRolePermissions()
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

const permissionData: any = ref([]);
const isEdit = ref<boolean>(false)
const choosenValue = ref()
const originalRolePermission = ref<{ name: string; permissions: Array<{ moduleId: number; actionId: number }> } | null>(null)

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

const actionOrder = [
  'Create',
  'View',
  'Update',
  'Delete',
  'View All',
  'Analyse',
  'Lock',
  'Upload JSON',
  'Download JSON',
  'Download as Version'
];

async function getModuleValue(){
  try {
    const response = await $client.rolePermission.findModuleActions.mutate();
    const moduleMap = new Map<string, any>();
    response.forEach((item: any) => {
      const moduleName = item.Modules.name;
      if (!moduleMap.has(moduleName)) {
        moduleMap.set(moduleName, {
          id: parseInt(item.Modules.id),
          name: moduleName,
          checked: false,
          indeterminate: false,
          Permissions: [],
        });
      }
      moduleMap.get(moduleName).Permissions.push({
        id: parseInt(item.Actions.id),
        name: item.Actions.name,
        checked: false,
      });
    });
    
    // Sort modules by moduleOrder
    const newPermissions = Array.from(moduleMap.values()).sort(
      (a, b) => moduleOrder.indexOf(a.name) - moduleOrder.indexOf(b.name)
    );
    
    // Sort permissions within each module by actionOrder
    newPermissions.forEach((module) => {
      module.Permissions.sort((a: Permission, b: Permission) => {
        const indexA = actionOrder.indexOf(a.name);
        const indexB = actionOrder.indexOf(b.name);
        // If action not in order list, put it at the end
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    });
    
    permissionData.value = newPermissions;
  } catch (error) {
    console.error('Failed to get module values:', error);
  }
}

// LIST Role Permission
async function fetchRolePermissions({
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
    const response = await $client.rolePermission.list.query({
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
      content: 'Failed to fetch role permissions',
      duration: 5000,
    })
  } finally {
    loading.value = false
  }
}

// Watch for empty search
watch(searchQuery, (newValue) => {
  // Only refresh when search is cleared (becomes empty)
  if (newValue === '') {
    fetchRolePermissions({ resetPage: true })
  }
})

// CREATE Role Permission
const newRolePermission = ref<RolePermissionCreateSingleInput | RolePermissionUpdateSingleInput | null>(null)
const isCreatingRolePermission = computed(() => !!newRolePermission.value)
async function createRolePermission() {
  if (newRolePermission.value) {
    // Mark field as touched when submitting
    nameTouched.value = true
    
    // Validate before creating
    const isNameValid = validateRoleName(newRolePermission.value.name)
    
    if (!isNameValid) {
      return
    }
    
    try {
      newRolePermission.value.permissions = selectedPermissions.value
      
      await $client.rolePermission.create.mutate(newRolePermission.value)
      notification.success({ content: `User Role Created Successfully`, duration: 5000 })
      newRolePermission.value = null
      nameError.value = ''
      nameTouched.value = false
      resetPermissionData();
      await fetchRolePermissions()
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

// UPDATE Role Permission
const editedRow = ref<UserRoles | null>(null)
async function updateRolePermission() {
  try {
    if (newRolePermission.value) {
      // Mark field as touched when submitting
      nameTouched.value = true
      
      // Validate before updating
      const isNameValid = validateRoleName(newRolePermission.value.name)
      
      if (!isNameValid) {
        return
      }
      
      newRolePermission.value.id = choosenValue.value
      newRolePermission.value.permissions = selectedPermissions.value
        
      await $client.rolePermission.update.mutate(newRolePermission.value)
      notification.success({ content: `User Role Updated Successfully`, duration: 5000 })
      newRolePermission.value = null
      originalRolePermission.value = null
      nameError.value = ''
      nameTouched.value = false
      isEdit.value = false
      resetPermissionData();
      await fetchRolePermissions()
    }
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
    originalRolePermission.value = null
    isEdit.value = false
    await fetchRolePermissions()
  }
}


watch(data, () => {
  if (data.value?.metadata.totalCount)
    pagination.pageCount = Math.ceil(data.value.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})


const toggleParentCheckbox = (module: PermissionModule) => {
  module.Permissions.forEach((permission) => {
    permission.checked = module.checked;
  });
};

const updateParentCheckboxState = (module: PermissionModule) => {
  const allChecked = module.Permissions.every((permission) => permission.checked);
  const noneChecked = module.Permissions.every((permission) => !permission.checked);

  module.checked = allChecked;
  module.indeterminate = !allChecked && !noneChecked;
};

watch(
  permissionData,
  (newData) => {
    newData.forEach((module: PermissionModule) => updateParentCheckboxState(module));
  },
  { deep: true }
);

const selectedPermissions = computed(() =>
  permissionData.value.flatMap((module: PermissionModule) =>
    module.Permissions
      .filter((permission) => permission.checked)
      .map((permission) => ({
        moduleId: module.id,
        actionId: permission.id,
      }))
  )
);

// Check if there are changes in the form
const hasChanges = computed(() => {
  if (!newRolePermission.value || !originalRolePermission.value || !isEdit.value) {
    return false
  }
  
  // Compare role name
  if (newRolePermission.value.name !== originalRolePermission.value.name) {
    return true
  }
  
  // Compare permissions
  const currentPermissions = [...selectedPermissions.value].sort((a: { moduleId: number; actionId: number }, b: { moduleId: number; actionId: number }) => {
    if (a.moduleId !== b.moduleId) return a.moduleId - b.moduleId
    return a.actionId - b.actionId
  })
  
  const originalPermissions = [...originalRolePermission.value.permissions].sort((a: { moduleId: number; actionId: number }, b: { moduleId: number; actionId: number }) => {
    if (a.moduleId !== b.moduleId) return a.moduleId - b.moduleId
    return a.actionId - b.actionId
  })
  
  // Compare lengths
  if (currentPermissions.length !== originalPermissions.length) {
    return true
  }
  
  // Compare each permission
  for (let i = 0; i < currentPermissions.length; i++) {
    if (currentPermissions[i].moduleId !== originalPermissions[i].moduleId ||
        currentPermissions[i].actionId !== originalPermissions[i].actionId) {
      return true
    }
  }
  
  return false
})

const resetPermissionData = () => {
  permissionData.value.forEach((module: PermissionModule) => {
    module.checked = false;
    module.indeterminate = false;
    module.Permissions.forEach((permission: Permission) => {
      permission.checked = false;
    });
  });
};

async function openEditModal(id: string) {
  isEdit.value = true

  await $client.rolePermission.findSinglevalue.mutate({roleId: String(id),})
  .then((response) => {
    const fetchedData : any = response;
    
    choosenValue.value = fetchedData[0].id
    resetPermissionData();
    
    // Clear validation errors and touched state when editing
    nameError.value = ''
    nameTouched.value = false

    fetchedData[0].RoleModuleActionMapping.forEach((item: any) => {
      const module = permissionData.value.find((m: any) => m.id === parseInt(item.ModuleActionMapping.Modules.id));

      if (module) {
        const permission = module.Permissions.find((p: any) => p.id === parseInt(item.ModuleActionMapping.Actions.id));

        if (permission) {
          permission.checked = true;
        }

        module.indeterminate = module.Permissions.some((p: any) => p.checked) && module.Permissions.some((p: any) => !p.checked);
        module.checked = module.Permissions.every((p: any) => p.checked);
      }
    });

    newRolePermission.value = {
      name: fetchedData[0].name,
      permissions:  permissionData.value
    }
    
    // Store original values for comparison after all permissions are set
    // Collect current selected permissions after they've been set up
    const currentSelectedPermissions = permissionData.value.flatMap((module: PermissionModule) =>
      module.Permissions
        .filter((permission) => permission.checked)
        .map((permission) => ({
          moduleId: module.id,
          actionId: permission.id,
        }))
    )
    
    originalRolePermission.value = {
      name: fetchedData[0].name,
      permissions: JSON.parse(JSON.stringify(currentSelectedPermissions))
    }
    
  }).catch((error) => {
    console.log('error',error);
  })
}

const canCreateUserRoles = ref<boolean>(false);
const canReadUserRoles = ref<boolean>(false);
const canUpdateUserRoles = ref<boolean>(false);

async function checkAbilities() {
  canCreateUserRoles.value = await defineAbilitiesFor(Module.UserRoles, Action.CREATE);
  canReadUserRoles.value = await defineAbilitiesFor(Module.UserRoles, Action.READ);
  canUpdateUserRoles.value = await defineAbilitiesFor(Module.UserRoles, Action.UPDATE);
}

onMounted(() => {
  checkAbilities();
  getModuleValue();
  fetchRolePermissions();
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
          <h2>User Roles</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="() => fetchRolePermissions({ resetPage: true })"
            placeholder="Search"
          />
          <NButton
            v-if="canCreateUserRoles"
            data-testid="role-permission-create-button"
            strong secondary type="primary" @click="isEdit = false;newRolePermission = {
              name: '',
              permissions: []
            }; nameError = ''; nameTouched = false; originalRolePermission = null; isEdit = false;"
          >
            Create a User Role
          </NButton>
        </div>
      </div>
      <NDataTable
        v-if="canReadUserRoles"
        data-testid="role-permission-table"
        ref="table"
        :key="(row: UserRoles) => row.id"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>

    <!-- Create Role Permission Modal -->
    <NModal
      v-if="newRolePermission"
      v-model:show="isCreatingRolePermission"
      data-testid="role-permission-create-modal"
    >
      <NCard
        class="w-[fit-content]"
        :title="isEdit ? 'Update User Role' : 'Create a User Role'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="resetPermissionData();newRolePermission = null; originalRolePermission = null; nameError = ''; nameTouched = false; isEdit = false;"
      >
        <NForm
          :model="newRolePermission"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
          <NFormItem label="Role Name" required path="name" :validation-status="nameTouched && nameError ? 'error' : undefined">
              <NInput 
                data-testid="role-permission-create-name-input"
                v-model:value="newRolePermission.name" 
                :placeholder="`Give the new Role a name`"
                @input="nameTouched = true; validateRoleName(newRolePermission.name)"
                @blur="nameTouched = true; validateRoleName(newRolePermission.name)"
              />
          </NFormItem>
          <div v-if="nameTouched && nameError" class="text-red-500 text-sm mb-4 mt-[-12px] ml-[120px]">{{ nameError }}</div>
          <NFormItem label="Permissions" path="permissions">
            <div class="flex flex-col w-full">
              <div 
                class="flex flex-col my-[5px] border-[1px] border-[#555]"
                v-for="(item) in permissionData" :key="item.id"
              >
                <!-- Module header with checkbox -->
                <div class="w-full px-[10px] flex items-center h-[40px] bg-[#555]">
                  <NCheckbox
                    v-model:checked="item.checked"
                    :indeterminate="item.indeterminate"
                    @update:checked="toggleParentCheckbox(item)"
                    class="whitespace-nowrap"
                  >
                    {{ item.name }}
                  </NCheckbox>
                </div>
                <!-- Permissions in single line with commas -->
                <div class="w-full flex flex-row items-center px-[10px] py-[8px] overflow-x-auto">
                  <template v-for="(permission, index) in item.Permissions" :key="permission.id">
                    <NCheckbox
                      v-model:checked="permission.checked"
                      class="flex-shrink-0 whitespace-nowrap"
                    >
                      {{ permission.name }}
                    </NCheckbox>
                    <span v-if="index < item.Permissions.length - 1" class="text-[#999] mx-1 flex-shrink-0"></span>
                  </template>
                </div>
              </div>
            </div>
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="role-permission-create-cancel-button" strong type="error" @click="resetPermissionData();newRolePermission = null; originalRolePermission = null; nameError = ''; nameTouched = false; isEdit = false;">
              Cancel
            </NButton>
            <NButton 
              data-testid="role-permission-create-submit-button"
              v-if="!isEdit" 
              strong 
              type="success" 
              @click="createRolePermission"
              :disabled="!!nameError || !newRolePermission.name"
            >
              Submit
            </NButton>
            <NButton 
              data-testid="role-permission-update-button"
              v-if="isEdit" 
              strong 
              type="success" 
              @click="updateRolePermission"
              :disabled="!!nameError || !newRolePermission.name || !hasChanges"
            >
              Update
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>