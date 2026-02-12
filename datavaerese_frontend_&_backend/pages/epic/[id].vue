<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { Project } from '@prisma/client'
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, useNotification, NCheckbox, NBreadcrumb, NBreadcrumbItem } from 'naive-ui'
import type { CreateProjectInput, ProjectWithUsers } from '~~/types'
import type { User } from '@auth0/auth0-spa-js'
import { DateTime } from 'luxon';
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import { useErrorFormatter } from '~/composables/useErrorFormatter'

definePageMeta({
  layout: 'default',
})

const { $client } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const notification = useNotification()
const { formatErrorMessage } = useErrorFormatter()

const showDeletionConfirmation = ref(false);
const confirmationDetails = ref<any>(null);
const pendingUpdatePayload = ref<any>(null);

const user = useState<User>('user')
const searchQuery = ref('')
// Deleting Project
const isDeleteProject = ref<null>(null)
const isDeletingProject = computed(() => !!isDeleteProject.value)
async function deleteProject() {
  if (isDeleteProject.value) {
    try {
      const deletedAt = DateTime.now()
      var input = {
          id : isDeleteProject.value,
          deletedAt
      }
      await $client.project.delete.mutate(input)
      isDeleteProject.value = null
      notification.success({title: 'Success',content: 'Project deleted successfully.',duration: 1000,closable: true})
      await refresh()
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

const showMoreAssignees = ref<boolean[]>([]);
function showMoreClickAssignees(val: boolean, index: number) {
  showMoreAssignees.value[index] = val;
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

// Group USERS
const { data: groupUsers, error: fetchGroupUsersError } = await $client.userGroup.list.useQuery();
if (fetchGroupUsersError.value) {
  notification.error({
    title: 'Error',
    content: fetchGroupUsersError.value.message,
    duration: 5000,
    closable: true,
  })
}
const userOptions = computed(() => {
  if (users.value === null && groupUsers.value === null) {
    return [];
  }
  const userOptions = users.value ? users.value.map(user => ({
    label: user.name ?? '',
    value: user.user_id ?? '',
  })) : [];
  const groupUserOptions = groupUsers.value ? groupUsers?.value.data?.map((groupUser: any) => ({
    label: groupUser.groupName ?? '',
    value: groupUser.id ?? '',
  })) : [];
  return [...userOptions, ...groupUserOptions];
});

const selectedArrayDuplicate = []

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<ProjectWithUsers>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: '15%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.name || false,
    ellipsis: false,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NInput, {
          value: row.name,
          onUpdateValue(v: string) {
            data.value!.data[index].name = v
          },
          placeholder: 'Enter Project Name',
          'data-testid': `project-name-input-${index}`,
        })
        : row.name
    },
  },
  {
    key: 'updatedAt',
    title: 'Updated at',
    width: '15%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.updatedAt || false,
    render: (row: Project) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '15%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: Project) => {
      return row.createdAt.toLocaleString()
    },
  },
  {
    key: 'description',
    title: 'Description',
    width: '15%',
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NInput, {
          value: row.description,
          onUpdateValue(v: string) {
            data.value!.data[index].description = v
          },
          placeholder: 'Enter Description',
          'data-testid': `project-description-input-${index}`,
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
          placeholder: 'Select Assignees',
          options: userOptions.value,
          value: row.users.map(user => user.userId),
          filterable: true,
          keyboard: true,
          'data-testid': `project-assignees-select-${index}`,
          onSearch: (event) => handleSearch(event),
          onUpdateValue(v: string[]) {
            data.value!.data[index].users = v.map(userId => ({
              projectId: row.id,
              userId,
              userRole: 'NORMAL',
            }))
          },
        })
        : h(
          'div',
          [
            h(
            'ul',
              userOptions.value
                .filter(user =>
                  (showMoreAssignees.value[index] ? row.users : row.users.slice(0,5)).map(rowUser => rowUser.userId).includes(user.value)
                )
                .map(({ value, label }) =>
                  h('li', { key: value, style: { listStyleType: 'circle' } }, label)
                )
            ),
            h(
              'ul',
              row.users.length > 5
                ? h(
                    'div',
                    [
                      h(
                        'span',
                        {
                          'data-testid': `project-assignees-more-button-${index}`,
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
    render(row, index) {
      return h('div', {
        class: 'inline-flex items-center gap-2',
        'data-testid': `project-actions-row-${index}`,
      }, [
        canUpdateProject.value ?
        editedRow.value?.id !== row.id
          ? h(NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `project-edit-button-${index}`,
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
                  'data-testid': `project-update-button-${index}`,
                  onClick: () => updateRow(row),
                  disabled: !row.name || 
                    (row.name === originalEditedRow.value?.name && 
                     row.description === originalEditedRow.value?.description &&
                     JSON.stringify(row.users?.map((u: any) => u.userId).sort()) === 
                     JSON.stringify(originalEditedRow.value?.users?.map((u: any) => u.userId).sort())),
                },
                { default: () => 'Update' }),
              h(NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  'data-testid': `project-cancel-button-${index}`,
                  onClick: () => {
                    data.value!.data[index] = { ...originalEditedRow.value! }
                    editedRow.value = null
                    originalEditedRow.value = null
                  },
                },
                { default: () => 'Cancel' }),
            ] : null,
        h(NButton,
          {
            strong: true,
            secondary: true,
            type: 'primary',
            size: 'small',
            'data-testid': `project-go-button-${index}`,
            onClick: () => router.push({
              path: `/project/${row.id}`,
            }),
          },
          { default: () => 'Go' }),
           canDeleteProject.value ?
          h(NButton,
          {
            strong: true,
            secondary: true,
            type: 'error',
            size: 'small',
            'data-testid': `project-delete-button-${index}`,
            onClick: () => isDeleteProject.value = row.id 
          },
          { default: () => 'Delete' }) : '',
      ])
    },
  },
])
const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  onChange: async (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})
const sortStates = ref<DataTableSortState[]>([
  {
    columnKey: 'name',
    sorter: true,
    order: 'ascend',
  },
])
const sortKeyMapOrder = computed(() => sortStates.value.reduce((result: Record<string, any>, { columnKey, order }) => {
  result[columnKey] = order
  return result
}, {}))
async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!pending.value) {
    sortStates.value = [].concat(sorters as any)
    await refresh()
  }
}

// LIST PROJECTS
const { data, refresh, pending } = await useAsyncData(() => $client.project.list.query({
  limit: pagination.pageSize,
  offset: (pagination.page - 1) * pagination.pageSize,
  sort: sortStates.value.map(({ columnKey, order }) => ({
    [columnKey]: order === 'ascend' ? 'asc' : 'desc',
  })),
  filter: { epicId: route.params.id != null ? route.params.id.toString() : '' },
}), {
  watch: [pagination],
})
watch(data, (newData) => {
  if (newData?.metadata.totalCount)
    pagination.pageCount = Math.ceil(newData.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})
const epicName = data.value?.epicName ? data.value.epicName.name : 'Unknown'

// UPDATE PROJECT
const editedRow = ref<ProjectWithUsers | null>(null)
const originalEditedRow = ref<ProjectWithUsers | null>(null)
async function updateRow(row: Project) {
  try {
    const formattedRow = {
      ...row,
      confirmUserRemoval: false,
      users: row.users.map(user => ({
        userId: user.userId,
        projectId: row.id,
        userRole: user.userRole || 'NORMAL',
      }))
    };
    
    const response = await $client.project.update.mutate(formattedRow)
    
    if(response?.confirmUserRemoval) {
      // Store the payload for later use
      pendingUpdatePayload.value = formattedRow;
      // Set the confirmation details
      confirmationDetails.value = response;
      // Show the modal
      showDeletionConfirmation.value = true;
    } else {
      handleUpdateSuccess();
    }
  }
  catch (error: any) {
    handleUpdateError(error);
  }
}

// CREATE PROJECT
const newProject = ref<CreateProjectInput | null>(null)
const isCreatingProject = computed(() => !!newProject.value)

// Validation state
const nameError = ref('')
const nameTouched = ref(false)
const usersError = ref('')
const usersTouched = ref(false)

// Validation function for project name
function validateProjectName(value: string | undefined) {
  if (!value) {
    nameError.value = 'Name is required'
    return false
  }
  
  // Check if name starts with a space (leading space not allowed)
  if (value.trimStart() !== value) {
    nameError.value = 'Name cannot start with a space'
    return false
  }
  
  // All other characters are allowed, including spaces in between and at the end
  nameError.value = ''
  return true
}

// Validation function for users/assignees
function validateUsers(users: any[] | undefined) {
  if (!users || users.length === 0) {
    usersError.value = 'At least one assignee is required'
    return false
  }
  
  usersError.value = ''
  return true
}

async function createProject() {
  if (newProject.value) {
    // Mark fields as touched when submitting
    nameTouched.value = true
    usersTouched.value = true
    
    // Validate before creating
    const isNameValid = validateProjectName(newProject.value.name)
    const isUsersValid = validateUsers(newProject.value.users)
    
    if (!isNameValid || !isUsersValid) {
      return
    }
    
    try {
      await $client.project.create.mutate(newProject.value)
      notification.success({
        title: 'Success',
        content: 'Project created successfully.',
        duration: 5000,
        closable: true,
      })
      newProject.value = null
      nameError.value = ''
      nameTouched.value = false
      usersError.value = ''
      usersTouched.value = false
      await refresh()
    }
    catch (error: any) {
      notification.error({
        title: 'Error',
        content: formatErrorMessage(error),
        duration: 5000,
        closable: true,
      })
    }
  }
}

async function handleSearch (e?:any) {
  if (!e.length) {
    selectedArrayDuplicate.value = users.value
    return
  }
  let queryEmails = e.split(',').map(email => email.trim());

  selectedArrayDuplicate.value = await users.value.filter((item:any) => {
    return queryEmails.some(queryEmail => item.email.toLowerCase().includes(queryEmail.toLowerCase()));
  })
}

async function handleEnterKeyEdit(e?: any,index: number,projectId: number) {
   if(projectId){
    // Only add the first filtered result when Enter is pressed
    if (selectedArrayDuplicate.value && selectedArrayDuplicate.value.length > 0) {
      const firstItem = selectedArrayDuplicate.value[0];
      var obj = {
        projectId : projectId,
        userId : firstItem.user_id,
        userRole : "NORMAL"
      }
      const isPresent: boolean = data.value!.data[index].users.some(project => 
          project.userId === obj.userId && project.userRole === obj.userRole
      );
      if (!isPresent) {
        data.value!.data[index].users.push(obj)
      }
    }
  }
}

async function handleEnterKey() {
  // Only add the first filtered result when Enter is pressed
  if (selectedArrayDuplicate.value && selectedArrayDuplicate.value.length > 0) {
    const firstItem = selectedArrayDuplicate.value[0];
    var obj = {
      userId : firstItem.user_id,
      userRole : "NORMAL"
    }
    const isPresent: boolean = newProject.value.users.some(project => 
        project.userId === obj.userId && project.userRole === obj.userRole
    );
    if (!isPresent) {
      newProject.value.users.push(obj)
      selectedAssigneesCount.value = newProject.value.users.length;
      assigneesIndeterminate.value = selectedAssigneesCount.value == 0 ? 
        false : 
        userOptions.value.length == selectedAssigneesCount.value ? 
          false : 
          true;
      selectAllAssignees.value = selectedAssigneesCount.value == 0 ? 
        false : 
        '';
      usersTouched.value = true;
      validateUsers(newProject.value.users);
    }
  }
}

const selectAllAssignees = ref<Boolean>(false)
const assigneesIndeterminate =  ref<Boolean>(false)
const selectedAssigneesCount = ref(0)

async function handleSelectAllAssignees() {
  if (selectAllAssignees.value) {
    // Get all user IDs from userOptions
    const allUserIds = userOptions.value.map(option => option.value);
    
    // Add all users to newProject
    newProject.value!.users = allUserIds.map(userId => ({
      userId,
      userRole: 'NORMAL' as const,
    }));
    
    selectedAssigneesCount.value = allUserIds.length;
    assigneesIndeterminate.value = false;
    usersTouched.value = true;
    validateUsers(newProject.value.users);
  } else {
    newProject.value!.users = [];
    selectedAssigneesCount.value = 0;
    assigneesIndeterminate.value = false;
    selectAllAssignees.value = false;
    usersTouched.value = true;
    validateUsers(newProject.value.users);
  }
}

function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

const isAnalysingSession = ref<boolean>(false)
const analysisData = ref([])
const analysisLoading = ref(false)
const totalDataCount = ref(0)

const analyseSortKeyMapOrder = computed(() => analysisSortStates.value.reduce((result: Record<string, any>, { columnKey, order }) => {
 result[columnKey] = order
 return result
}, {}))

function openCloseAnalysisModal() {
  if (isAnalysingSession.value == false) {
    analysisData.value = []
    searchQuery.value = ''
  }
}

async function handleAnalyseSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!analysisLoading.value) {
    analysisSortStates.value = [].concat(sorters as any)
    await analysisSession({})
  }
}

const analyseColumns = computed<DataTableColumns<any>>(() => [
  {
    key: 'name',
    title: 'Epic Name',
    width: '40%',
    sorter: true,
    ellipsis: false,
    sortOrder: analyseSortKeyMapOrder.value.name || false,
    render(row, index) {
      return h('div', {
        class: 'inline-flex items-center gap-2',
      }, [
        h('p',
          {
            class: 'text-blue-500 text-[14px] underline cursor-pointer',
            onClick: () => router.push({
              path: `/epic/${row.id}`,
            }),
          },
          { default: () => `${row.name}` })
      ])
    }
  },
  {
    key: 'projectName',
    title: 'Project Name',
    width: '40%',
    sorter: true,
    sortOrder: analyseSortKeyMapOrder.value.projectName || false,
      render(row, index) {
        return h('div', {
          class: 'inline-flex items-center gap-2',
        }, [
          h('p',
            {
              class: 'text-blue-500 text-[14px] underline cursor-pointer',
              onClick: () => router.push({
                path: `/project/${row.projectId}`,
              }),
            },
            { default: () => `${row.projectName}` })
        ])
      }
  },
  {
    key: 'sessionName',
    title: 'Session Name',
    width: '40%',
    sorter: true,
    sortOrder: analyseSortKeyMapOrder.value.sessionName || false,
      render(row, index) {
        return h('div', {
          class: 'inline-flex items-center gap-2',
        }, [
          h('p',
            {
              class: 'text-blue-500 text-[14px] underline cursor-pointer',
              onClick: () => router.push({
                path: `/data-labelling/${row.sessionId}`,
              }),
            },
            { default: () => `${row.sessionName}` })
        ])
      }
  },
])

const analysisPagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  onChange: (page: number) => {
    analysisPagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    analysisPagination.pageSize = pageSize
    analysisPagination.page = 1
  }
})

const analysisSortStates = ref<DataTableSortState[]>([
  {
    columnKey: 'name',
    sorter: true,
    order: 'ascend',
  }
])
 
async function analysisSession({
  params = {
    // page: analysisPagination.page,
    // perPage: analysisPagination.pageSize,
    sort: analysisSortStates.value,
  },
}: {
  params?: {
    // page: number
    // perPage: number
    sort: DataTableSortState[]
  }
}) {

  analysisLoading.value = true
  analysisData.value = []
  totalDataCount.value = 0

  await $client.epic.searchList.query({
    search:searchQuery.value,
    // limit: params.perPage,
    // offset: (params.page - 1) * params.perPage,
    sort: params.sort.map(({ columnKey, order }) => ({
      [columnKey]: order === 'ascend' ? 'asc' : 'desc',
    })),
  }).then((response: any) => {
    if (response.data.length > 0) {
      analysisData.value = response.data
      // analysisPagination.pageCount = Math.ceil(Number(response.metadata.totalCount) / analysisPagination.pageSize)
      totalDataCount.value = response.data.length 
    } else{
      analysisData.value = []
      // analysisPagination.pageCount = 1
    }
    analysisLoading.value = false
  }).catch((error: any) => {
    console.log(error)
  })
}

const canCreateProject = ref<boolean>(false);
const canReadProject = ref<boolean>(false);
const canUpdateProject = ref<boolean>(false);
const canDeleteProject = ref<boolean>(false);

async function checkAbilities() {
  canCreateProject.value = await defineAbilitiesFor(Module.Project, Action.CREATE);
  canReadProject.value = await defineAbilitiesFor(Module.Project, Action.READ);
  canUpdateProject.value = await defineAbilitiesFor(Module.Project, Action.UPDATE);
  canDeleteProject.value = await defineAbilitiesFor(Module.Project, Action.DELETE);
}

onMounted(() => {
  checkAbilities();
});

watch(route, () => {
  checkAbilities();
});

// Handle modal confirmation
async function handleConfirm() {
  try {
    if (pendingUpdatePayload.value) {
      // Call updateRow with the stored payload and confirmation flag
      await updateRowWithConfirmation(pendingUpdatePayload.value);
    }
  } catch (error: any) {
    handleUpdateError(error);
  } finally {
    closeModal();
  }
}

// Handle modal cancellation
function handleCancel() {
  notification.info({
    title: 'Update Cancelled',
    content: 'Project update was cancelled.',
    duration: 3000,
    closable: true,
  });
  closeModal();
}

// Close modal and reset state
function closeModal() {
  showDeletionConfirmation.value = false;
  confirmationDetails.value = null;
  pendingUpdatePayload.value = null;
}

// Handle successful update
function handleUpdateSuccess() {
  notification.success({
    title: 'Success',
    content: 'Project updated successfully.',
    duration: 1000,
    closable: true,
  });
  
  editedRow.value = null;
  originalEditedRow.value = null;
  refresh();
}

// Handle update error
function handleUpdateError(error: any) {
  console.error('Update error:', error);
  notification.error({
    title: 'Error',
    content: formatErrorMessage(error),
    duration: 5000,
    closable: true,
  });
}

// New function to call updateRow with confirmation
async function updateRowWithConfirmation(payload: any) {
  try {
    // Add confirmation flag to the payload
    const confirmedPayload = {
      ...payload,
      confirmUserRemoval: true
    };
    
    const response = await $client.project.update.mutate(confirmedPayload);
    
    if (response?.requiresConfirmation) {
      // This shouldn't happen with confirmation flag, but handle it
      notification.warning({
        title: 'Warning',
        content: 'Confirmation still required. Please try again.',
        duration: 3000,
        closable: true,
      });
    } else {
      handleUpdateSuccess();
    }
  } catch (error: any) {
    handleUpdateError(error);
  }
}

</script>

<template>
  <div>
    <!-- Fixed breadcrumb and title header -->
    <div class="fixed top-[72px] left-0 right-0 bg-neutral-900 z-40">
      <div class="px-10 pt-4">
        <NBreadcrumb separator=">">
          <NBreadcrumbItem data-testid="project-breadcrumb-home" @click="router.push('../')">
            Home
          </NBreadcrumbItem>
            <NBreadcrumbItem>
              {{epicName ?  epicName : 'Unknown'}}
            </NBreadcrumbItem>
          </NBreadcrumb>
      </div>
      <div class="inline-flex w-full justify-between items-center px-12 py-4">
        <div class="inline-flex items-center gap-2">
          <Icon
            data-testid="project-back-button"
            name="ph:caret-left"
            class="text-2xl text-primary-500 hover:text-primary-300 cursor-pointer"
            @click="router.push('/')"
          />
          <p class="text-2xl"> Project</p>
        </div>
        <div class="inline-flex items-center gap-9  ">
          <NButton
            data-testid="project-search-button"
            strong secondary type="primary" @click="isAnalysingSession = !isAnalysingSession">
            Epic / Project / Session Search
          </NButton>
          <NButton
           v-if="canCreateProject"
           data-testid="project-create-button"
           strong secondary type="primary" @click="newProject = {
           name: '',
           description: '',
           epicId: route.params.id.toString(),
           users: [],
            };
            selectAllAssignees = false;
            assigneesIndeterminate = false;
            selectedAssigneesCount = 0;
            nameError = '';
            nameTouched = false;
            usersError = '';
            usersTouched = false;"
          >
            Create Project
          </NButton>
        </div>
      </div>
    </div>
    <!-- Content area with padding for fixed header -->
    <div class="px-10 pb-4" style="padding-top: 110px;">
      <NDataTable
        v-if="canReadProject"
        data-testid="project-table"
        ref="table" :key="(row: Project) => row.id" remote :columns="columns" :data="data?.data" :loading="pending"
        :pagination="pagination" @update:sorter="handleSorterChange"
      />
    </div>
    <NModal v-if="newProject" v-model:show="isCreatingProject" data-testid="project-create-modal">
      <NCard class="w-[80vh]" title="Create Project" :bordered="false" role="dialog" aria-modal="true" closable  @close="newProject = null; nameError = ''; nameTouched = false; usersError = ''; usersTouched = false;">
        <NForm
          :model="newProject" label-placement="left" require-mark-placement="right-hanging" size="medium"
          label-width="auto"
        >
          <NFormItem label="Name" path="name" required :validation-status="nameTouched && nameError ? 'error' : undefined">
            <NInput 
              data-testid="project-create-name-input"
              v-model:value="newProject.name" 
              placeholder="Give the new project a name"
              @input="nameTouched = true; validateProjectName(newProject.name)"
              @blur="nameTouched = true; validateProjectName(newProject.name)"
            />
            <template v-if="nameTouched && nameError" #feedback>
              <span class="text-red-500 text-sm">{{ nameError }}</span>
            </template>
          </NFormItem>
          <NFormItem label="Description" path="description">
            <NInput
              data-testid="project-create-description-input"
              v-model:value="newProject.description" placeholder="Provide a description" type="textarea"
              :autosize="{
                minRows: 2,
                maxRows: 4,
              }"
            />
          </NFormItem>
          <NFormItem label="Assignees" path="users" required :validation-status="usersTouched && usersError ? 'error' : undefined" style='align-items:center'>
            <div class="w-full flex flex-col">
            <div class="flex justify-end mb-1">
              <NCheckbox data-testid="project-create-select-all-assignees" v-model:checked="selectAllAssignees" :indeterminate="assigneesIndeterminate" @update:checked="handleSelectAllAssignees"> {{ selectedAssigneesCount  > 0  ? 'Deselect All' : 'Select All'}} </NCheckbox>
            </div>
            <NSelect
              data-testid="project-create-assignees-select"
              :value="newProject.users.map(user => user.userId)"
              :options="userOptions"
              multiple
              filterable
              placeholder="Select Assignees"
              @search="handleSearch"
              @update:value="(v: string[]) => {
                newProject!.users = v.map(userId => ({
                  userId,
                  userRole: 'NORMAL',
                }))
                selectedAssigneesCount = v.length
                assigneesIndeterminate = selectedAssigneesCount == 0 ?  false : userOptions.length == selectedAssigneesCount ? false : true
                selectAllAssignees = selectedAssigneesCount == 0 ? false : ''
                usersTouched = true
                validateUsers(newProject.users)
              }"
              @blur="usersTouched = true; validateUsers(newProject.users)"
            />
            <span v-if="selectedAssigneesCount" class="text-primary-600 mt-2">{{selectedAssigneesCount}}  {{ selectedAssigneesCount == 1 ? 'Assignee' : 'Assignees' }} Selected</span>
          </div>
          <template v-if="usersTouched && usersError" #feedback>
            <span class="text-red-500 text-sm">{{ usersError }}</span>
          </template>
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="project-create-cancel-button" strong type="error" @click="newProject = null; nameError = ''; nameTouched = false; usersError = ''; usersTouched = false;">
              Cancel
            </NButton>
            <NButton 
              data-testid="project-create-submit-button"
              strong 
              type="success" 
              @click="createProject"
              :disabled="!!nameError || !!usersError || !newProject.name || !newProject.users || newProject.users.length === 0"
            >
              Submit
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>

    <NModal
      v-if="isDeleteProject"
      v-model:show="isDeletingProject"
      data-testid="project-delete-modal"
    >
      <NCard
        class="w-[80vh]"
        title="Confirm Delete Project"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="isDeleteProject = null"
      >
        <NForm
          :model="isDeleteProject"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
        <div class="flex">
            <p class="text-neutral-300">
              Are you sure you want to delete this Project?
            </p>
        </div>

        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="project-delete-cancel-button" strong type="error" @click="isDeleteProject = null">
              No
            </NButton>
            <NButton data-testid="project-delete-confirm-button" strong type="success" @click="deleteProject">
              Yes
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
    <NModal
      v-model:show="isAnalysingSession"
      :mask-closable="true"
      :on-after-leave="openCloseAnalysisModal"
      data-testid="project-search-modal"
    >
      <NCard
        class="w-[80vw]"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="isAnalysingSession = !isAnalysingSession"
        title="Search Epic / Project / Session"
      > 
        <NFormItem class="w-[50vw]" label="" path="name">
          <p class="ml-[20px] font-[500] whitespace-nowrap">Enter Epic / Project / Session name</p>
          <NInput data-testid="project-search-input" class="mx-[20px]" placeholder="Search" v-model:value="searchQuery" />
          <NButton data-testid="project-search-submit-button" strong type="success" @click="analysisSession({})"> Search </NButton>
        </NFormItem>
        <NDataTable
          data-testid="project-search-results-table"
          ref="table"
          :key="(row: any) => row.id"
          :columns="analyseColumns"
          :data="analysisData"
          :loading="analysisLoading"
          :pagination="analysisPagination"
          size="small"
          @update:sorter="handleAnalyseSorterChange"
          />
      </NCard>
    </NModal>
    <NModal v-model:show="showDeletionConfirmation" data-testid="project-user-removal-modal">
  <NCard
    class="w-[600px]"
    title="Confirm User Removal"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
    closable
    @close="handleCancel"
  >
    <div class="whitespace-pre-line">
      <h4>The following users will be removed from the Project / Session:</h4>
      <div class="mt-4">
        <div v-if="confirmationDetails?.userSessionCounts" class="mt-2">
          <div v-for="userCount in confirmationDetails?.userSessionCounts" :key="userCount.id" class="mt-1">
            <div class="text-sm">
              <span class="font-medium">{{ userCount?.name }}</span>
              <span class="text-gray-500">({{ userCount?.sessionCount }} sessions)</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 font-medium">Do you want to proceed?</div>
    </div>
    <template #footer>
      <div class="inline-flex items-center justify-end gap-2 w-full">
        <NButton data-testid="project-user-removal-cancel-button" strong type="error" @click="handleCancel">
          Cancel
        </NButton>
        <NButton data-testid="project-user-removal-confirm-button" strong type="success" @click="handleConfirm">
          Yes, Remove
        </NButton>
      </div>
    </template>
  </NCard>
</NModal>
  </div>
</template>
