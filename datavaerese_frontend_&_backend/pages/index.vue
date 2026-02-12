<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { Epic } from '@prisma/client'
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { NBadge, NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, useNotification } from 'naive-ui'
import type { CreateEpicInput } from '~~/types/Epic'
import type { User } from '@auth0/auth0-spa-js'
import { DateTime } from 'luxon';
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import { onMounted } from 'vue'
import { useErrorFormatter } from '~/composables/useErrorFormatter'
import { h } from 'vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { $client } = useNuxtApp()
const router = useRouter()
const notification = useNotification()
const { formatErrorMessage } = useErrorFormatter()
const user = useState<User>('user')
const searchQuery = ref('')

interface ModuleActionMapping {
  moduleId: string;
  actionId: string;
}

interface PermissionData {
  ModuleId: string;
  ActionId: string[];
}

// User Role Permission
const  rolePermission  = await  $client.rolePermission.getRolePermission.query()

function transformData(data: { ModuleActionMapping: ModuleActionMapping }[]): PermissionData[] {
  const grouped = data.reduce((acc, current) => {
    const { moduleId, actionId } = current.ModuleActionMapping;
    if (!acc[moduleId]) {
      acc[moduleId] = [];
    }
    acc[moduleId].push(actionId);
    return acc;
  }, {} as { [key: string]: string[] });

  return Object.keys(grouped).map(moduleId => ({
    ModuleId: moduleId,
    ActionId: grouped[moduleId]
  }));
}

if (typeof window !== 'undefined') {
  const rolePermissionData = rolePermission;

  if (rolePermissionData) {
    const permissionData = transformData(rolePermissionData);
    localStorage.setItem('permission', JSON.stringify(permissionData));
  } else {
    localStorage.setItem('permission', JSON.stringify([]));
  }
}

// Show login success toast after component is mounted
onMounted(() => {
  if (typeof window !== 'undefined' && rolePermission && route.query.login === 'success') {
    // Add delay to ensure notification provider is ready
    setTimeout(() => {
      notification.success({
        title: 'Success',
        content: 'Logged in successfully.',
        duration: 3000,
        closable: true
      })
    }, 500)
    // Remove query parameter from URL
    const newQuery = { ...route.query }
    delete newQuery.login
    router.replace({ query: newQuery })
  }
})

// Deleting Epic
const isDeleteEpic = ref<null>(null)
const isDeletingEpic = computed(() => !!isDeleteEpic.value)
async function deleteEpic() {
  if (isDeleteEpic.value) {
    try {
      const deletedAt = DateTime.now()
      var input = {
          id : isDeleteEpic.value,
          deletedAt
      }
      await $client.epic.delete.mutate(input)
      isDeleteEpic.value = null
      notification.success({title: 'Success',content: 'Epic deleted successfully.',duration: 1000,closable: true})
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

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<Epic>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: '15%',
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
          placeholder: 'Enter Epic Name',
          'data-testid': `epic-name-input-${index}`,
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
    render: (row: Epic) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '15%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: Epic) => {
      return row.createdAt.toLocaleString()
    },
  },
  {
    key: 'description',
    title: 'Description',
    width: '30%',
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NInput, {
          value: row.description,
          onUpdateValue(v: string) {
            data.value!.data[index].description = v
          },
          placeholder: 'Enter Description',
          'data-testid': `epic-description-input-${index}`,
        })
        : row.description
    },
  },
  {
    key: 'actions',
    title: 'Actions',
    render(row, index) {
      return h('div', {
        class: 'inline-flex items-center gap-2',
        'data-testid': `epic-actions-row-${index}`,
      }, [
        canUpdateEpic.value ? 
        editedRow.value?.id !== row.id
          ? h(NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `epic-edit-button-${index}`,
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
                  'data-testid': `epic-update-button-${index}`,
                  onClick: () => updateRow(row),
                  disabled: !row.name || 
                    (row.name === originalEditedRow.value?.name && 
                     row.description === originalEditedRow.value?.description),
                },
                { default: () => 'Update' }),
              h(NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  'data-testid': `epic-cancel-button-${index}`,
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
            'data-testid': `epic-go-button-${index}`,
            onClick: () => router.push({
              path: `/epic/${row.id}`,
            }),
          },
          { default: () => 'Go' }),
          canDeleteEpic.value ?
          h(NButton,
          {
            strong: true,
            secondary: true,
            type: 'error',
            size: 'small',
            'data-testid': `epic-delete-button-${index}`,
            onClick: () => isDeleteEpic.value = row.id
          },
          { default: () => 'Delete' }) : '',
      ])
    },
  },
])
async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!pending.value) {
    sortStates.value = [].concat(sorters as any)
    await refresh()
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
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
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

// LIST EPICs
const { data, refresh, pending } = await useAsyncData(() => $client.epic.list.query({
  limit: pagination.pageSize,
  offset: (pagination.page - 1) * pagination.pageSize,
  sort: sortStates.value.map(({ columnKey, order }) => ({
    [columnKey]: order === 'ascend' ? 'asc' : 'desc',
  })),
}), {
  watch: [pagination],
})
watch(data, () => {
  if (data.value?.metadata.totalCount)
    pagination.pageCount = Math.ceil(data.value.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})

// UPDATE EPIC
const editedRow = ref<Epic | null>(null)
const originalEditedRow = ref<Epic | null>(null)
async function updateRow(row: Epic) {
  try {
    await $client.epic.update.mutate(row)
    notification.success({
      title: 'Success',
      content: 'Epic updated successfully.',
      duration: 3000,
      closable: true
    })
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
    await refresh()
  }
}

// CREATE EPIC
const newEpic = ref<CreateEpicInput | null>(null)
const isCreatingEpic = computed(() => !!newEpic.value)

// Validation state
const nameError = ref('')
const nameTouched = ref(false)

// Validation function for epic name
function validateEpicName(value: string | undefined) {
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

async function createEpic() {
  if (newEpic.value) {
    // Mark field as touched when submitting
    nameTouched.value = true
    
    // Validate before creating
    const isNameValid = validateEpicName(newEpic.value.name)
    
    if (!isNameValid) {
      return
    }
    
    try {
      await $client.epic.create.mutate(newEpic.value)
      notification.success({
        title: 'Success',
        content: 'Epic created successfully.',
        duration: 3000,
        closable: true
      })
      newEpic.value = null
      nameError.value = ''
      nameTouched.value = false
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
            'data-testid': `search-epic-link-${index}`,
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
              'data-testid': `search-project-link-${index}`,
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
              'data-testid': `search-session-link-${index}`,
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

const canCreateEpic = ref<boolean>(false);
const canReadEpic = ref<boolean>(false);
const canUpdateEpic = ref<boolean>(false);
const canDeleteEpic = ref<boolean>(false);
const canViewDeleteSessionRequests = ref<boolean>(false);
const canDeleteSession = ref<boolean>(false);

async function checkAbilities() {
  canCreateEpic.value = await defineAbilitiesFor(Module.EPIC, Action.CREATE);
  canReadEpic.value = await defineAbilitiesFor(Module.EPIC, Action.READ);
  canUpdateEpic.value = await defineAbilitiesFor(Module.EPIC, Action.UPDATE);
  canDeleteEpic.value = await defineAbilitiesFor(Module.EPIC, Action.DELETE);
  canViewDeleteSessionRequests.value = await defineAbilitiesFor(Module.Session, "10");
  canDeleteSession.value = await defineAbilitiesFor(Module.Session, Action.DELETE);
}

onMounted(() => {
  checkAbilities();
  fetchDeleteSessionRequests()
});

watch(route, () => {
  checkAbilities();
});

// Delete Session Requests functionality
interface DeleteSessionRequest {
  id: string
  dLSessionId: string
  dLSession?: {
    id: string
    name: string
  }
  requestedBy: string
  requestedByUser?: {
    email?: string
    name?: string
  }
  reason: string
  rejectionReason?: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
}

const showDeleteSessionRequestsModal = ref(false)
const deleteSessionRequests = ref<DeleteSessionRequest[]>([])
const deleteSessionRequestsLoading = ref(false)

// Rejecting Delete Session Request
const isRejectingRequest = ref<string | null>(null)
const rejectRequestId = ref<string | null>(null)
const rejectRequestSessionName = ref<string>('')
const rejectRequestReason = ref<string>('')
const showRejectDialog = computed(() => !!isRejectingRequest.value)

/**
 * Fetch delete session requests for all epics
 */
async function fetchDeleteSessionRequests() {
  deleteSessionRequestsLoading.value = true
  try {
    // Fetch all delete session requests
    const allRequests = await $client.deleteSessionRequest.findMany.query({})
    
    // Filter out APPROVED and REJECTED requests - only show PENDING and CANCELLED
    const requests = allRequests.filter(req => 
      req.status === 'PENDING' || req.status === 'CANCELLED'
    )
    
    // Get unique session IDs from filtered requests
    const sessionIds = [...new Set(requests.map(r => r.dLSessionId))]
    
    // Fetch session details individually (dLSession.one doesn't require projectId)
    let sessionDetailsMap: Record<string, { name: string; projectId?: string; epicId?: string }> = {}
    if (sessionIds.length > 0) {
      // Fetch sessions in parallel batches to avoid overwhelming the server
      const batchSize = 10
      for (let i = 0; i < sessionIds.length; i += batchSize) {
        const batch = sessionIds.slice(i, i + batchSize)
        const sessionPromises = batch.map(async (sessionId) => {
          try {
            const session = await $client.dLSession.one.query(sessionId)
            return { id: sessionId, session }
          } catch (error) {
            console.error(`Error fetching session ${sessionId}:`, error)
            return { id: sessionId, session: null }
          }
        })
        
        const sessionResults = await Promise.all(sessionPromises)
        sessionResults.forEach(({ id, session }) => {
          if (session) {
            sessionDetailsMap[id] = {
              name: session.name || 'Unknown Session',
              projectId: session.projectId,
              epicId: session.project?.epic?.id
            }
          } else {
            sessionDetailsMap[id] = {
              name: 'Unknown Session',
              projectId: undefined,
              epicId: undefined
            }
          }
        })
      }
    }

    // Fetch user details for requestedBy
    const userIds = [
      ...new Set([
        ...requests.map(r => r.requestedBy)
      ])
    ]

    let userDetailsMap: Record<string, { email?: string; name?: string }> = {}
    if (userIds.length > 0) {
      try {
        const users = await $client.auth0.listUsers.query({
          searchQuery: {
            userIds: userIds
          }
        })
        userDetailsMap = users.reduce((acc: Record<string, { email?: string; name?: string }>, user: any) => {
          acc[user.user_id] = {
            email: user.email,
            name: user.name
          }
          return acc
        }, {})
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }

    // Combine data
    deleteSessionRequests.value = requests.map(req => ({
      ...req,
      requestedByUser: userDetailsMap[req.requestedBy] || {},
      dLSession: sessionDetailsMap[req.dLSessionId] ? {
        id: req.dLSessionId,
        name: sessionDetailsMap[req.dLSessionId].name
      } : undefined
    }))
  } catch (error: any) {
    console.error('Error fetching delete session requests:', error)
    notification.error({
      title: 'Error',
      content: error.message || 'Failed to fetch delete session requests',
      duration: 5000,
      closable: true,
    })
  } finally {
    deleteSessionRequestsLoading.value = false
  }
}

/**
 * Handle approve delete session request
 */
async function handleApproveRequest(requestId: string) {
  try {
    await $client.deleteSessionRequest.approve.mutate(requestId)
    notification.success({
      title: 'Success',
      content: 'Delete session request approved. Session has been deleted.',
      duration: 5000,
      closable: true,
    })
    // Refresh the list
    await fetchDeleteSessionRequests()
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Failed to approve delete session request',
      duration: 5000,
      closable: true,
    })
  }
}

/**
 * Handle reject delete session request - opens dialog first
 */
function handleRejectRequest(requestId: string) {
  const request = deleteSessionRequests.value.find(r => r.id === requestId)
  if (request) {
    rejectRequestId.value = requestId
    rejectRequestSessionName.value = request.dLSession?.name || 'Unknown Session'
    rejectRequestReason.value = ''
    isRejectingRequest.value = requestId
  }
}

/**
 * Confirm rejection of delete session request
 */
async function confirmRejectRequest() {
  if (!rejectRequestId.value) {
    return
  }

  try {
    await $client.deleteSessionRequest.reject.mutate({
      id: rejectRequestId.value,
      rejectionReason: rejectRequestReason.value.trim() || undefined,
    })
    
    notification.success({
      title: 'Success',
      content: 'Delete session request rejected.',
      duration: 5000,
      closable: true,
    })
    
    // Close dialog and reset state
    isRejectingRequest.value = null
    rejectRequestId.value = null
    rejectRequestSessionName.value = ''
    rejectRequestReason.value = ''
    
    // Refresh the list
    await fetchDeleteSessionRequests()
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Failed to reject delete session request',
      duration: 5000,
      closable: true,
    })
  }
}

/**
 * Cancel rejection dialog
 */
function cancelRejectRequest() {
  isRejectingRequest.value = null
  rejectRequestId.value = null
  rejectRequestSessionName.value = ''
  rejectRequestReason.value = ''
}

/**
 * Open delete session requests modal
 */
function openDeleteSessionRequestsModal() {
  showDeleteSessionRequestsModal.value = true
  fetchDeleteSessionRequests()
}

/**
 * Close delete session requests modal
 */
function closeDeleteSessionRequestsModal() {
  showDeleteSessionRequestsModal.value = false
  deleteSessionRequests.value = []
  fetchDeleteSessionRequests()
}

const deleteSessionRequestColumns = computed<DataTableColumns<DeleteSessionRequest>>(() => [
  {
    key: 'dLSession',
    title: 'Session Name',
    width: '15%',
    render(row) {
      return row.dLSession?.name || 'Unknown Session'
    }
  },
  {
    key: 'requestedBy',
    title: 'Requested By',
    width: '15%',
    render(row) {
      const user = row.requestedByUser
      // Prioritize name over email, fallback to email if name not available
      return user?.name || user?.email || row.requestedBy
    }
  },
  {
    key: 'reason',
    title: 'Reason',
    width: '20%',
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'rejectionReason',
    title: 'Rejection Reason',
    width: '20%',
    render(row) {
      // Only show rejection reason for REJECTED status
      if (row.status === 'REJECTED') {
        if (row.rejectionReason) {
          return h('div', {
            style: {
              color: '#F87777',
              fontStyle: 'italic'
            }
          }, row.rejectionReason)
        } else {
          return h('span', {
            style: {
              color: '#999',
              fontStyle: 'italic'
            }
          }, 'No reason provided')
        }
      }
      return h('span', { style: { color: '#999' } }, '-')
    },
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'status',
    title: 'Status',
    width: '10%',
    render(row) {
      const statusColors: Record<string, string> = {
        PENDING: '#F2C97D',
        APPROVED: '#4CAF50',
        REJECTED: '#F87777',
        CANCELLED: '#999999'
      }
      return h('span', {
        style: {
          padding: '4px 12px',
          borderRadius: '4px',
          backgroundColor: statusColors[row.status] || '#999999',
          color: '#fff',
          fontSize: '12px',
          fontWeight: '500'
        }
      }, row.status)
    }
  },
  {
    key: 'createdAt',
    title: 'Created At',
    width: '12%',
    render(row) {
      return new Date(row.createdAt).toLocaleString()
    }
  },
  {
    key: 'updatedAt',
    title: 'Updated At',
    width: '12%',
    render(row) {
      return new Date(row.updatedAt).toLocaleString()
    }
  },
  {
    key: 'actions',
    title: 'Actions',
    width: '15%',
    render(row, index) {
      // Only show approve/reject buttons if user has permission beyond view-only (Action 10)
      // Users with only Action 10 can only view, not approve/reject
      const isPending = row.status === 'PENDING'
      const canApproveReject = canDeleteSession.value // Users with DELETE permission can approve/reject

      if (!isPending) {
        return h('span', { style: { color: '#999' } }, '-')
      }

      // If user only has view permission (Action 10) but not DELETE permission, hide actions
      if (!canApproveReject) {
        return h('span', { style: { color: '#999' } }, 'View Only')
      }

      return h('div', {
        class: 'inline-flex items-center gap-2',
      }, [
        h(NButton, {
          strong: true,
          type: 'success',
          size: 'small',
          'data-testid': `delete-request-approve-button-${index}`,
          onClick: () => handleApproveRequest(row.id),
        }, { default: () => 'Approve' }),
        h(NButton, {
          strong: true,
          type: 'error',
          size: 'small',
          'data-testid': `delete-request-reject-button-${index}`,
          onClick: () => handleRejectRequest(row.id),
        }, { default: () => 'Reject' }),
      ])
    }
  }
]);

</script>

<template>
  <div>
    <div class="px-10 pb-4">
      <div class="inline-flex w-full justify-between items-center px-2 py-4">
        <h2>Epic</h2>
          <div class="inline-flex items-center gap-9">
            <NButton
              data-testid="epic-search-button"
              strong secondary type="primary" @click="isAnalysingSession = !isAnalysingSession">
              Epic / Project / Session Search
            </NButton>
            <NBadge v-if="canViewDeleteSessionRequests" :value="deleteSessionRequests.length" :show-zero="false">
              <NButton
                data-testid="epic-delete-session-requests-button"
                strong secondary type="primary" @click="openDeleteSessionRequestsModal">
                Delete Session Requests
              </NButton>
            </NBadge>
            <NButton
              v-if="canCreateEpic"
              data-testid="epic-create-button"
              strong secondary type="primary" @click="newEpic = {
                name: '',
                description: '',
              }; nameError = ''; nameTouched = false;"
            >
              Create Epic
            </NButton>
          </div>
      </div>
      <NDataTable
        v-if="canReadEpic"
        data-testid="epic-table"
        ref="table"
        :key="(row: Epic) => row.id"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="pending"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
    <NModal
      v-if="newEpic"
      v-model:show="isCreatingEpic"
      data-testid="epic-create-modal"
    >
      <NCard
        class="w-[80vh]"
        title="Create Epic"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="newEpic = null; nameError = ''; nameTouched = false;"
      >
        <NForm
          :model="newEpic"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
          <NFormItem label="Name" path="name" required :validation-status="nameTouched && nameError ? 'error' : undefined">
            <NInput 
              data-testid="epic-create-name-input"
              v-model:value="newEpic.name" 
              placeholder="Give the new epic a name"
              @input="nameTouched = true; validateEpicName(newEpic.name)"
              @blur="nameTouched = true; validateEpicName(newEpic.name)"
            />
            <template v-if="nameTouched && nameError" #feedback>
              <span class="text-red-500 text-sm">{{ nameError }}</span>
            </template>
          </NFormItem>
          <NFormItem label="Description" path="description">
            <NInput
              data-testid="epic-create-description-input"
              v-model:value="newEpic.description" placeholder="Provide a description" type="textarea" :autosize="{
                minRows: 2,
                maxRows: 4,
              }"
            />
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="epic-create-cancel-button" strong type="error" @click="newEpic = null; nameError = ''; nameTouched = false;">
              Cancel
            </NButton>
            <NButton 
              data-testid="epic-create-submit-button"
              strong 
              type="success" 
              @click="createEpic"
              :disabled="!!nameError || !newEpic.name"
            >
              Submit
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>

    <NModal
      v-if="isDeleteEpic"
      v-model:show="isDeletingEpic"
      data-testid="epic-delete-modal"
    >
      <NCard
        class="w-[80vh]"
        title="Confirm Delete Epic"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="isDeleteEpic = null"
      >
        <NForm
          :model="isDeleteEpic"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
        <div class="flex">
            <p class="text-neutral-300">
              Are you sure you want to delete this epic?
            </p>
        </div>

        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="epic-delete-cancel-button" strong type="error" @click="isDeleteEpic = null">
              No
            </NButton>
            <NButton data-testid="epic-delete-confirm-button" strong type="success" @click="deleteEpic">
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
      data-testid="epic-search-modal"
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
          <NInput data-testid="epic-search-input" class="mx-[20px]" placeholder="Search" v-model:value="searchQuery"/>
          <NButton data-testid="epic-search-submit-button" strong type="success" @click="analysisSession({})"> Search </NButton>
        </NFormItem>
        <NDataTable
          data-testid="epic-search-results-table"
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
    <NModal
      v-model:show="showDeleteSessionRequestsModal"
      :mask-closable="true"
      @close="closeDeleteSessionRequestsModal"
      data-testid="delete-session-requests-modal"
    >
      <NCard
        class="w-[90vw]"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="closeDeleteSessionRequestsModal"
        title="Delete Session Requests"
      > 
        <NDataTable
          data-testid="delete-session-requests-table"
          :columns="deleteSessionRequestColumns"
          :data="deleteSessionRequests"
          :loading="deleteSessionRequestsLoading"
          :pagination="false"
        />
      </NCard>
    </NModal>
    <NModal
      v-model:show="showRejectDialog"
      data-testid="reject-delete-request-modal"
    >
      <NCard
        class="w-[80vh]"
        title="Reject Delete Session Request"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="cancelRejectRequest"
      >
        <NForm
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
          <NFormItem label="Session Name">
            <NInput
              data-testid="reject-request-session-name-input"
              :value="rejectRequestSessionName"
              disabled
              placeholder="Session name"
            />
          </NFormItem>
          <NFormItem label="Rejection Reason">
            <NInput
              data-testid="reject-request-reason-input"
              v-model:value="rejectRequestReason"
              type="textarea"
              placeholder="Enter reason for rejection (optional)"
              :rows="4"
              :maxlength="500"
              show-count
            />
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="reject-request-cancel-button" strong type="default" @click="cancelRejectRequest">
              Cancel
            </NButton>
            <NButton data-testid="reject-request-confirm-button" strong type="error" @click="confirmRejectRequest">
              Reject Request
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>
