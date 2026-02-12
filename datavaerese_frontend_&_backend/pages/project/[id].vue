<script setup lang="ts">
import type { Label, UsersInCESessions, UsersInDLSessions, UsersInRASessions, Taxonomy, StructureGroups, SessionUserRole } from '@prisma/client'
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NInputNumber, NModal, NSelect, NTab, NTabs, useNotification, NIcon, NCheckbox, NBreadcrumb, NBreadcrumbItem, NDropdown,NPopover,NDivider, NUpload, NUploadDragger, NTooltip, type UploadInst, type UploadFileInfo, type FormInst, type FormRules } from 'naive-ui'
import type { CESessionWithUsers, CreateCESessionInput, CreateDLSessionInput, DLSessionWithUsers, RASessionWithUsers, ProjectImageSearchInput, GetPageProjectImageSearchInput, IGenerateSessionCode } from '~~/types'
import type { User } from '@auth0/auth0-spa-js'
import { DateTime } from 'luxon';
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import { useErrorFormatter } from '~/composables/useErrorFormatter'
import type { ErrorWithCode, ExtractedResource, PreparedFileData, FileUploadResult, DuplicateCheckResponse } from '~/types/error'
import { h } from 'vue'
import { useFormValidation } from '~/composables/useFormValidation'

// Update the TaxonomyAnnotation interface to match the expected structure
interface TaxonomyAnnotation {
  id: string;
  name: string;
  typeInTaxonomyId?: string;
  taxonomyTypeId?: string;
  taxonomyTypeName?: string;
}

interface TaxonomyLevel {
  selectedTaxonomy: string | null;
  selectedTaxonomyId:  string | null 
  selectedTaxonomies: string[];     // IDs of selected annotations
  selectedLandmarks: string[];      // IDs of selected landmarks
}


interface TRPCError {
  data?: {
    code?: string
    message?: string
    httpStatus?: number
  }
  message?: string
}


definePageMeta({
  layout: 'default',
})

type Session = DLSessionWithUsers | CESessionWithUsers | RASessionWithUsers

const { $client } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const notification = useNotification()
const { formatErrorMessage } = useErrorFormatter()

const user = useState<User>('user')
const searchQuery = ref('')

// Auto create session
const projectCode = ref();
const subProjectCode = ref();
const useCaseCode = ref();
const anatomyPlaneCode = ref();
const centerCode = ref();
const userTypeCode = ref();
const imageCount = ref();
const setCode = ref();
const projectCodeList = ref<IGenerateSessionCode[]>([])
const subProjectCodeList = ref<IGenerateSessionCode[]>([])
const anatomyPlaneCodeList = ref<IGenerateSessionCode[]>([])
const centerCodeList = ref<IGenerateSessionCode[]>([])
const userTypeCodeList = ref<IGenerateSessionCode[]>([])
const useCaseCodeList = ref<IGenerateSessionCode[]>([])
const selectAutoGenerateSessionName = ref<Boolean>(false)

// Add ref for all annotations
const allAnnotations = ref<TaxonomyAnnotation[]>([]);
const isFetchingAllAnnotations = ref(false);
const hasLoadedAllAnnotations = ref(false);

// Track selected annotations across taxonomy groups
const selectedAnnotationsMap = ref(new Map<string, {
  taxonomyId: string;      // Name of the taxonomy group where annotation is selected
  taxonomyName: string;    // Name of the taxonomy group (for display)
  annotationName: string;  // Name of the annotation (for display)
}>());

// Initialize taxonomyLevels
const taxonomyLevels = ref<TaxonomyLevel[]>([{ 
  selectedTaxonomy: null,
  selectedTaxonomies: [],
  selectedLandmarks: []
}]);

// Deleting Session
const isDeleteSession = ref<null>(null)
const deleteSessionName = ref<string>('')
const deleteSessionReason = ref<string>('')
const isDeletingSession = computed(() => !!isDeleteSession.value)

// Lock/Unlock Session
const lockStatusFilter = ref<'all' | 'locked' | 'unlocked'>('all')
const showLockStatusFilterModal = ref(false)
const showLockUnlockModal = ref(false)
const lockUnlockSessionId = ref<string | null>(null)
const lockUnlockAction = ref<'lock' | 'unlock'>('lock')
const lockUnlockReason = ref('')
const lockUnlockReasonError = ref('')
const isSubmittingLockUnlock = ref(false)

async function deleteSession() {
  if (isDeleteSession.value) {
    try {
      const deletedAt = DateTime.now()
      var input = {
          id : isDeleteSession.value,
          deletedAt
      }
      await $client[activeTab.value].delete.mutate(input)
      isDeleteSession.value = null
      deleteSessionName.value = ''
      deleteSessionReason.value = ''
      notification.success({title: 'Success',content: 'Session deleted successfully.',duration: 11000,closable: true})
      await fetchSessions({})
    }
    catch (error: any) {
      notification.create({
        title: 'Error',
        type: 'error',
        content: error.message,
        duration: 5000,
        closable: true,
      })
    }
  }
}

/**
 * Request approval for session deletion
 * Saves the delete session request to the database
 */
async function requestApproval() {
  if (isDeleteSession.value && deleteSessionReason.value.trim()) {
    try {
      // Only allow delete session requests for DL Sessions
      if (activeTab.value !== 'dLSession') {
        notification.warning({
          title: 'Warning',
          content: 'Delete session requests are only available for Data Labelling Sessions.',
          duration: 5000,
          closable: true,
        })
        return
      }

      await $client.deleteSessionRequest.create.mutate({
        dLSessionId: isDeleteSession.value,
        reason: deleteSessionReason.value.trim(),
      })

      notification.success({
        title: 'Success',
        content: 'Delete session request submitted successfully. It will be reviewed by the assigned approver.',
        duration: 5000,
        closable: true,
      })
      
      isDeleteSession.value = null
      deleteSessionName.value = ''
      deleteSessionReason.value = ''
      await fetchSessions({})
    }
    catch (error: any) {
      notification.create({
        title: 'Error',
        type: 'error',
        content: error.message || 'Failed to submit delete session request. Please try again.',
        duration: 5000,
        closable: true,
      })
    }
  } else {
    notification.warning({
      title: 'Warning',
      content: 'Please provide a reason for the approval request.',
      duration: 3000,
      closable: true,
    })
  }
}

async function cancelRequest() {
  if (isDeleteSession.value) {
    try {
      // TODO: Implement cancel request API call
      notification.info({
        title: 'Info',
        content: 'Request cancelled.',
        duration: 3000,
        closable: true,
      })
      isDeleteSession.value = null
      deleteSessionName.value = ''
      deleteSessionReason.value = ''
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

const isAnalysisSession = ref<String>('')
const isAnalysingSession = ref<boolean>(false)
const analysisData = ref([])
const activesessionName = ref<String>('')
const analysisLoading = ref(true)
const analysisActiveTab = ref('label')

type AnalysisFilterKeys = 'name' | 'extractedresourcecount';

interface AnalysisFilters {
  name: string[];
  extractedresourcecount: string[];
}

interface FilterDropdownVisible {
  name: boolean;
  extractedresourcecount: boolean;
}

interface FilterSearchQueries {
  name: string;
  extractedresourcecount: string;
}

const createInitialObject = <T>(defaultValue: T): Record<AnalysisFilterKeys, T> => ({
  name: defaultValue,
  extractedresourcecount: defaultValue,
});

const analysisFilters = ref<AnalysisFilters>(createInitialObject<string[]>([]));
const filterDropdownVisible = ref<FilterDropdownVisible>(createInitialObject<boolean>(false));
const filterSearchQueries = ref<FilterSearchQueries>(createInitialObject<string>(''));
const filterOptions = ref<AnalysisFilters>(createInitialObject<string[]>([]));
const tempFilterSelections = ref<AnalysisFilters>(createInitialObject<string[]>([]));

// Cache for filter options to avoid refetching on every dropdown open
// Key: `${analysisActiveTab.value}-${isAnalysisSession.value}`
const filterOptionsCache = ref<Map<string, AnalysisFilters>>(new Map());
const filterOptionsCacheTimestamp = ref<Map<string, number>>(new Map());
const FILTER_OPTIONS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

// Session Labels Filter State
const sessionLabelsFilter = ref<string[]>([]); // Applied filter (sessionLabel IDs)
const tempSessionLabelsSelections = ref<string[]>([]); // Temporary selections in dropdown
const sessionLabelsFilterOptions = ref<Array<{ id: string; name: string }>>([]); // Available options
const sessionLabelsFilterSearchQuery = ref<string>(''); // Search query in filter dropdown
const sessionLabelsFilterDropdownVisible = ref<boolean>(false); // Dropdown visibility

// Session Status Filter State
const sessionStatusFilter = ref<string[]>([]); // Applied filter (sessionStatus IDs)
const tempSessionStatusSelections = ref<string[]>([]); // Temporary selections in dropdown
const sessionStatusFilterOptions = ref<Array<{ id: string; name: string }>>([]); // Available options
const sessionStatusFilterSearchQuery = ref<string>(''); // Search query in filter dropdown
const sessionStatusFilterDropdownVisible = ref<boolean>(false); // Dropdown visibility

// Group USERS
const { data: groupUsers, error: fetchGroupUsersError } = await $client.userGroup.list.useQuery()
if (fetchGroupUsersError.value) {
  notification.error({
    title: 'Error',
    content: fetchGroupUsersError.value.message,
    duration: 5000,
    closable: true,
  })
}

async function analysisSession({
  params = {
    page: analysisPagination.page,
    perPage: analysisPagination.pageSize,
    sort: analysisSortStates.value,
  },
}: {
  params?: {
    page: number
    perPage: number
    sort: DataTableSortState[]
  }
}) {

  analysisLoading.value = true
  analysisData.value = []
  totalDataCount.value = 0

  if (!isAnalysisSession.value) {
    analysisLoading.value = false
    return
  }

  const endpointMap = {
    label: 'labelsAnalyseData',
    status: 'statusAnalyseData',
    annotation: 'annotationAnalyseData'
  }
  const endpoint = endpointMap[analysisActiveTab.value as keyof typeof endpointMap] || 'labelsAnalyseData'

  try {
    const response = await ($client[activeTab.value] as any)[endpoint].query({
      limit: params.perPage,
      offset: (params.page - 1) * params.perPage,
      sort: params.sort.map(({ columnKey, order }) => ({
        [columnKey === 'extractedresourcecount' ? 'count' : columnKey]: order === 'ascend' ? 'asc' : 'desc'
      })),
      filter: {
        projectId: route.params.id != null ? route.params.id.toString() : '',
        dLSessionId: isAnalysisSession.value ? isAnalysisSession.value : '',
        name: analysisFilters.value.name.length > 0 ? analysisFilters.value.name : undefined,
        extractedresourcecount: analysisFilters.value.extractedresourcecount.length > 0 ? analysisFilters.value.extractedresourcecount : undefined,
      },
    })

    let dataArray: any[] = []
    let totalCount = 0

    if (response && response.data && Array.isArray(response.data) && response.data.length >= 2) {
      dataArray = response.data[0] || []
      const countResult = response.data[1]
      if (Array.isArray(countResult)) {
        // Defensive: if count is array of objs with "count"
        totalCount = countResult.length > 0 && countResult[0]?.count
          ? Number(countResult[0].count)
          : 0
      } else if (typeof countResult === 'number') {
        totalCount = countResult
      }
    }

    const processedAnalysisData = (Array.isArray(dataArray) ? dataArray : []).map((item: any) => {
      const annotationName = Array.isArray(item.name) 
        ? item.name.filter(Boolean).join(', ') 
        : (item.name || '');
      const parentNameRaw = Array.isArray(item.parentAnnotationName)
        ? item.parentAnnotationName.join(', ')
        : (item.parentAnnotationName ?? null);
      const childNameRaw = Array.isArray(item.childTaxonomyName)
        ? item.childTaxonomyName.join(', ')
        : (item.childTaxonomyName ?? null);

      const extractedCountSource = item.extractedresourcecount ?? item.extractedResourceCount ?? item.extracted_resource_count ?? '0';
      const extractedresourcecount = Number.parseInt(String(extractedCountSource ?? '0'), 10) || 0;

      const childCountSource = item.childTaxonomyCount ?? item.childtaxonomycount ?? item.child_taxonomy_count ?? '0';
      const childTaxonomyCount = Number.parseInt(String(childCountSource ?? '0'), 10) || 0;

      return {
        name: annotationName,
        parentAnnotationName: parentNameRaw,
        childTaxonomyName: childNameRaw,
        childTaxonomyCount,
        isChild: Boolean(item.isChild),
        extractedresourcecount
      };
    });

    analysisData.value = processedAnalysisData;

    analysisPagination.pageCount = totalCount > 0
      ? Math.ceil(totalCount / analysisPagination.pageSize)
      : 1
    totalDataCount.value = totalCount

    // Update filter options from backend response (if available)
    // Backend now returns filterOptions with all distinct values from entire session
    // Also update cache for performance
    if (response && response.filterOptions) {
      const cacheKey = `${analysisActiveTab.value}-${isAnalysisSession.value}`
      const options = {
        name: Array.isArray(response.filterOptions.name) ? response.filterOptions.name : [],
        extractedresourcecount: Array.isArray(response.filterOptions.extractedresourcecount) 
          ? response.filterOptions.extractedresourcecount 
          : []
      }
      
      // Update cache
      filterOptionsCache.value.set(cacheKey, options)
      filterOptionsCacheTimestamp.value.set(cacheKey, Date.now())
      
      filterOptions.value = options
    }

  } catch (error: any) {
    console.error('Error in analysisSession:', error)
    analysisData.value = []
    analysisPagination.pageCount = 1
    totalDataCount.value = 0
    filterOptions.value = {
      name: [],
      extractedresourcecount: []
    }
    notification.error({
      title: 'Error',
      content: error?.message || 'Failed to fetch analysis data',
      duration: 5000,
      closable: true,
    })
  } finally {
    analysisLoading.value = false
  }
}

// LIST USERS
const { data: users, error: fetchUsersError } = await $client.auth0.listUsers.useQuery()
const { data: project, error: fetchProjectError } = await $client.project.one.useQuery(route.params.id.toString())
const epicName = project.value?.epic?.name
const projectName = project.value?.name
if (fetchUsersError.value) {
  notification.error({
    title: 'Error',
    content: fetchUsersError.value.message,
    duration: 5000,
    closable: true,
  })
}
if (fetchProjectError.value) {
  notification.error({
    title: 'Error',
    content: fetchProjectError.value.message,
    duration: 5000,
    closable: true,
  })
}
const totalUserOptions = computed(() => {
  if (users.value === null && groupUsers.value === null && project.value === null) {
    return [];
  }

  const userOpts = users.value ? users.value.map((user: User) => ({
    label: user.name ?? '',
    value: user.user_id ?? '',
    _type: 'user' as const,
  })) : [];

  const groupUserOpts = enrichedProjectGroups.value ? enrichedProjectGroups.value.map((group: EnrichedUserGroup) => {
    const members = group.users.map((u: UserDetail) => u.userId)
    return {
      label: group.groupName ?? '',
      value: group.id ?? '',
      _type: 'group' as const,
      _members: members,
    }
  }) : [];

  return [...userOpts, ...groupUserOpts];
});

const userOptions = computed(() => totalUserOptions.value === null
  ? []
  : totalUserOptions.value
    .filter((user: any) => project.value!.users.map((projectUser: any) => projectUser.userId).includes(user.value ?? ''))
    .map((user: any) => ({
      label: user.label ?? '',
      value: user.value ?? '',
      _type: user._type || 'user',
      ...(user._members ? { _members: user._members } : {}),
    })))

// Separate individual users from groups in project
const projectIndividualUsers = computed((): ProjectUser[] => {
  if (!project.value?.users) {
    return []
  }
  const individualUsers = project.value.users.filter((user: ProjectUser) => 
    user.userId && user.userId.includes('auth0|')
  )
  return individualUsers
})

// Extract group IDs from project
const projectUserGroups = computed((): string[] => {
  if (!project.value?.users) {
    return []
  }
  const groupIds = project.value.users
    .filter((user: ProjectUser) => user.userId && !user.userId.includes('auth0|'))
    .map((user: ProjectUser) => user.userId)
  return groupIds
})

// Match project groups with full group details from userGroup.list
const projectGroupsWithDetails = computed((): UserGroupDetail[] => {
  if (!groupUsers.value?.data || !projectUserGroups.value) {
    return []
  }
  
  const matchedGroups = groupUsers.value.data
    .filter((group: { id: string; groupName: string; description?: string; usersInGroup?: UserInGroup[] }) => 
      projectUserGroups.value.includes(group.id)
    )
    .map((group: { id: string; groupName: string; description?: string; usersInGroup?: UserInGroup[] }) => ({
      id: group.id,
      groupName: group.groupName,
      description: group.description,
      usersInGroup: group.usersInGroup || []
    }))
  
  return matchedGroups
})

// Get all user IDs from groups
const groupUserIds = computed((): string[] => {
  const userIds = projectGroupsWithDetails.value.flatMap((group: UserGroupDetail) => 
    group.usersInGroup.map((userInGroup: UserInGroup) => userInGroup.userId)
  )
  return userIds
})

// Match group users with auth0 users to get full details
const groupUsersWithDetails = computed((): UserDetail[] => {
  if (!users.value || !groupUserIds.value) {
    return []
  }
  
  const matchedUsers = users.value
    .filter((user: User) => groupUserIds.value.includes(user.user_id))
    .map((user: User) => ({
      userId: user.user_id,
      name: user.name || '',
      email: user.email || ''
    }))
  
  return matchedUsers
})

// Individual users in project (show all individually assigned users, even if they're also in groups)
const individualUsersInProject = computed((): UserDetail[] => {
  if (!users.value || !projectIndividualUsers.value) {
    return []
  }
  
  const projectUserIds = projectIndividualUsers.value.map((u: ProjectUser) => u.userId)
  
  // Show all individually assigned users - they can also appear in groups
  const individualUsers = users.value
    .filter((user: User) => projectUserIds.includes(user.user_id))
    .map((user: User) => ({
      userId: user.user_id,
      name: user.name || '',
      email: user.email || ''
    }))
  
  return individualUsers
})

// Final structure for groups with user details
const enrichedProjectGroups = computed((): EnrichedUserGroup[] => {
  const enrichedGroups = projectGroupsWithDetails.value.map((group: UserGroupDetail) => {
    const groupUserDetails = groupUsersWithDetails.value.filter((user: UserDetail) =>
      group.usersInGroup.some((uig: UserInGroup) => uig.userId === user.userId)
    )
    
    return {
      id: group.id,
      groupName: group.groupName,
      description: group.description,
      users: groupUserDetails
    }
  })
  
  return enrichedGroups
})

// Helper: Get all user IDs from a group
const getGroupMemberIds = (groupId: string): string[] => {
  if (!groupId || !groupUsers.value?.data) return []
  
  const group = groupUsers.value.data.find((g: UserGroupDetail) => g.id === groupId)
  if (!group || !group.usersInGroup) return []
  
  return group.usersInGroup
    .filter((u: UserInGroup) => u && u.userId)
    .map((u: UserInGroup) => u.userId)
}

// Track expanded groups for dropdowns
const expandedGroups = ref<Set<string>>(new Set())

// Cache for options to prevent unnecessary re-renders and scroll resets
const assigneesOptionsCache = ref<any[]>([])
const reviewersOptionsCache = ref<any[]>([])
const lastAssigneesStructureKey = ref<string>('')
const lastReviewersStructureKey = ref<string>('')

// Helper to create structure key (only changes when structure changes, not selections)
const getOptionsStructureKey = (category: 'assignees' | 'reviewers'): string => {
  const expandedGroupsKey = Array.from(expandedGroups.value).sort().join(',')
  const userOptionsKey = userOptions.value?.map((o: any) => o.value).sort().join(',') || ''
  return `${category}-${expandedGroupsKey}-${userOptionsKey}`
}

// Helper to update disabled states in place (preserves all existing logic)
const updateDisabledStatesInPlace = (category: 'assignees' | 'reviewers') => {
  const options = category === 'assignees' ? assigneesOptionsCache.value : reviewersOptionsCache.value
  if (!options || options.length === 0) return
  
  // Get selected user IDs and group IDs for this category (same logic as getOptionsForCategoryInternal)
  const getSelectedUserIds = (): string[] => {
    if (category === 'assignees') {
      return (newSession.value?.users || [])
        .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY')
        .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
        .filter((id: string) => id && id.includes('auth0|'))
    } else if (category === 'reviewers') {
      return (newSession.value?.users || [])
        .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
        .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
        .filter((id: string) => id && id.includes('auth0|'))
    }
    return []
  }
  
  const getSelectedGroupIds = (): string[] => {
    if (category === 'assignees') {
      return (newSession.value?.users || [])
        .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY')
        .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
        .filter((id: string) => id && !id.includes('auth0|'))
    } else if (category === 'reviewers') {
      return (newSession.value?.users || [])
        .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
        .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
        .filter((id: string) => id && !id.includes('auth0|'))
    }
    return []
  }
  
  const selectedUserIds = getSelectedUserIds()
  const selectedGroupIds = getSelectedGroupIds()
  
  // Update disabled states for each option (preserving exact logic from getOptionsForCategoryInternal)
  options.forEach((option: any) => {
    if (!option) return
    
    // Individual user (not from group)
    if (option._type === 'user' && !option._fromGroup) {
      // Check if user is a member of any selected group in THIS category
      const isUserInSelectedGroups = selectedGroupIds.some((groupId: string) => {
        const memberIds = getGroupMemberIds(groupId)
        return memberIds.includes(option.value)
      })
      
      // Check cross-level validation (same logic as before)
      const isDisabledByCrossLevel = isOptionDisabled(option.value, category)
      
      option.disabled = Boolean(isUserInSelectedGroups || isDisabledByCrossLevel)
    }
    // Group
    else if (option._type === 'group') {
      // Check cross-level validation for group (same logic as before)
      const isGroupDisabledByCrossLevel = isOptionDisabled(option.value, category)
      option.disabled = Boolean(isGroupDisabledByCrossLevel)
    }
    // Group member (nested)
    else if (option._fromGroup) {
      const memberId = option.value.split('::')[0]
      const isMemberSelected = selectedUserIds.includes(memberId)
      const groupId = option._fromGroup
      const isGroupSelected = selectedGroupIds.includes(groupId)
      
      // CRITICAL: Check if user is selected as individual FIRST (same logic as before)
      let isDisabled = false
      
      // PRIORITY 1: If user is selected as individual, disable them in groups
      if (isMemberSelected) {
        isDisabled = true
      }
      // PRIORITY 2: If group is selected, disable members (can't select again)
      else if (isGroupSelected) {
        isDisabled = true
      }
      // PRIORITY 3: Check cross-level conflicts
      else {
        const isDisabledByCrossLevel = isOptionDisabled(memberId, category)
        isDisabled = isDisabledByCrossLevel
      }
      
      option.disabled = Boolean(isDisabled)
    }
  })
}

const toggleGroupExpansion = (groupId: string, event?: Event): void => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  
  const newSet = new Set(expandedGroups.value)
  if (newSet.has(groupId)) {
    newSet.delete(groupId)
  } else {
    newSet.add(groupId)
  }
  expandedGroups.value = newSet
}

// Find label for any user ID or group ID
const findLabelForId = (id: string): string => {
  if (!id) return ''
  
  // Strip any suffix (for nested member format like "userId::groupId")
  const cleanId = id.split('::')[0]
  
  // Try to find as individual user
  if (cleanId.includes('auth0')) {
    const userOpt = users.value?.find((u: User) => u.user_id === cleanId)
    if (userOpt) {
      return userOpt.name || userOpt.email || cleanId
    }
  }
  
  // Try to find as group
  const group = enrichedProjectGroups.value.find((g: EnrichedUserGroup) => g.id === cleanId)
  if (group) {
    return group.groupName
  }
  
  return cleanId
}


// Render function for dropdown labels (shows expand/collapse icons for groups)
const renderDropdownLabel = (option: { _type?: string; value: string; label: string; _fromGroup?: string }) => {
  if (!option) return ''
  
  // GROUP: Show with expand/collapse icon
  if (option._type === 'group') {
    const isExpanded = expandedGroups.value.has(option.value)
    return h('div', {
      class: 'flex items-center gap-1',
      style: { width: '100%' }
    }, [
      h(NIcon, {
        size: '20',
        class: 'cursor-pointer text-white hover:text-gray-200 flex-none',
        onClick: (e: Event) => {
          e.stopPropagation()
          e.preventDefault()
          toggleGroupExpansion(option.value, e)
        }
      }, {
        default: () => h('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'currentColor'
        }, [
          h('path', {
            d: isExpanded 
              ? 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' // Down arrow
              : 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' // Right arrow
          })
        ])
      }),
      h('span', option.label || findLabelForId(option.value))
    ])
  }
  
  // GROUP MEMBER (nested): Show indented
  if (option._fromGroup) {
    return h('span', { 
      style: { paddingLeft: '24px' } 
    }, option.label || findLabelForId(option.value))
  }
  
  // INDIVIDUAL USER: Show label directly
  return option.label || findLabelForId(option.value)
}

// Render function for approval dropdown labels (NO expand/collapse - only groups and individual users)
const renderDropdownLabelForApproval = (option: { _type?: string; value: string; label: string; _fromGroup?: string }) => {
  if (!option) return ''
  
  // GROUP: Show label directly without expand/collapse icon
  if (option._type === 'group') {
    return option.label || findLabelForId(option.value)
  }
  
  // GROUP MEMBER should not appear in approval options, but handle it just in case
  if (option._fromGroup) {
    return option.label || findLabelForId(option.value)
  }
  
  // INDIVIDUAL USER: Show label directly
  return option.label || findLabelForId(option.value)
}

// Render function for selected tags
const renderUserTag = ({ option, handleClose }: { option: { value: string }; handleClose: () => void }) => {
  const optionValue = option?.value || ''
  if (!optionValue) return null
  
  // Skip suffixed values (nested members like "userId::groupId")
  // Return invisible element with class instead of null to prevent empty wrapper divs
  if (optionValue.includes('::')) {
    return h('span', {
      class: 'hidden-tag-helper',
      style: {
        display: 'none',
        width: 0,
        height: 0,
        margin: 0,
        padding: 0,
        visibility: 'hidden'
      }
    })
  }
  
  // ALWAYS lookup label from source data
  const label = findLabelForId(optionValue)
  
  return h('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0 6px',
      fontSize: '14px',
      backgroundColor: 'rgb(66 66 71 / 0%)',
      border: '1px solid rgb(240 240 240 / 42%)',
      marginRight: '4px'
    }
  }, [
    h('span', label),
    h('div', {
      class: 'n-base-close n-base-close--absolute n-tag_close',
      style: { marginLeft: '4px', cursor: 'pointer' },
      onClick: (e: Event) => {
        e.stopPropagation()
        handleClose?.()
      }
    }, [
      h('i', [
        h('svg', {
          viewBox: '0 0 16 16',
          fill: 'currentColor',
          width: '80%',
          height: '80%'
        }, [
          h('path', {
            d: 'M12.854 3.146a.5.5 0 0 0-.708 0L8 7.293 3.854 3.146a.5.5 0 1 0-.708.708L7.293 8l-4.147 4.146a.5.5 0 0 0 .708.708L8 8.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8l4.147-4.146a.5.5 0 0 0 0-.708z'
          })
        ])
      ])
    ])
  ])
}

// ============================================
// PHASE 4: CROSS-LEVEL VALIDATION
// ============================================

// Track selected users across all categories for restriction logic
const selectedUsersByCategory = computed(() => {
  const result: {
    assignees: Set<string>;
    reviewers: Set<string>;
    approvalLevels: Set<string>[];
  } = {
    assignees: new Set(),
    reviewers: new Set(),
    approvalLevels: [],
  };

  if (!newSession.value) return result;

  // Get assignees (individual users and group members)
  const assigneeUserIds = (newSession.value.users || [])
    .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY')
    .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId);
  
  assigneeUserIds.forEach((id: string) => {
    if (id.includes('auth0|')) {
      // Individual user
      result.assignees.add(id);
    } else {
      // Group - add all members
      getGroupMemberIds(id).forEach(memberId => result.assignees.add(memberId));
    }
  });

  // Get reviewers (individual users and group members)
  const reviewerUserIds = (newSession.value.users || [])
    .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
    .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId);
  
  reviewerUserIds.forEach((id: string) => {
    if (id.includes('auth0|')) {
      // Individual user
      result.reviewers.add(id);
    } else {
      // Group - add all members
      getGroupMemberIds(id).forEach(memberId => result.reviewers.add(memberId));
    }
  });

  // Get approval level users
  if (newSession.value.approval && Array.isArray(newSession.value.approval)) {
    result.approvalLevels = newSession.value.approval.map((level: any) => {
      const levelSet = new Set<string>();
      if (Array.isArray(level) && level.length > 0) {
        // Process all users/groups in this level
        level.forEach((id: string) => {
          if (id) {
            if (id.includes('auth0|')) {
              // Individual user
              levelSet.add(id);
            } else {
              // Group - add all members
              getGroupMemberIds(id).forEach(memberId => levelSet.add(memberId));
            }
          }
        });
      }
      return levelSet;
    });
  }

  return result;
});

// Helper: Check if an option should be disabled for a specific category
const isOptionDisabled = (optionValue: string, category: 'assignees' | 'reviewers' | 'approval', approvalLevelIndex?: number): boolean => {
  const selected = selectedUsersByCategory.value;
  
  // Check if this is a user ID (auth0 format) - handle directly
  if (optionValue && optionValue.includes('auth0|')) {
    const userId = optionValue;
    
    // Check if user is already selected in another category
    if (category === 'assignees') {
      // If user is already an assignee, they should be enabled (to allow deselection)
      if (selected.assignees.has(userId)) return false;
      
      return selected.reviewers.has(userId) || 
             selected.approvalLevels.some(level => level.has(userId));
    } else if (category === 'reviewers') {
      // If user is already a reviewer, they should be enabled (to allow deselection)
      if (selected.reviewers.has(userId)) return false;
      
      return selected.assignees.has(userId) || 
             selected.approvalLevels.some(level => level.has(userId));
    } else if (category === 'approval' && approvalLevelIndex !== undefined) {
      // If user is already in this approval level, they should be enabled (to allow deselection)
      if (selected.approvalLevels[approvalLevelIndex]?.has(userId)) return false;

      // CRITICAL: User must be a reviewer to be in approval level
      if (!selected.reviewers.has(userId)) {
        return true; // Disable if user is not a reviewer
      }
      // User can't be in assignees or other approval levels
      return selected.assignees.has(userId) || 
             selected.approvalLevels.some((level, idx) => idx !== approvalLevelIndex && level.has(userId));
    }
  }
  
  // For groups, find the option and check members
  const option = userOptions.value.find((o: any) => o.value === optionValue);
  if (!option) {
    return false;
  }

  if (option._type === 'group') {
    const groupId = optionValue;
    const memberIds = getGroupMemberIds(groupId);
    
    // Check if group is already selected in this category - if so, enable it (allow deselection)
    if (category === 'assignees') {
      const isGroupSelectedAsAssignee = (newSession.value?.users || []).some(
        (u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY' && u.userId === groupId
      );
      if (isGroupSelectedAsAssignee) return false;
      
      // Check if ANY member is individually selected in THIS category (assignees)
      // If so, disable the group to prevent duplicate selection
      const hasIndividuallySelectedMembers = memberIds.some(memberId => 
        selected.assignees.has(memberId)
      );
      if (hasIndividuallySelectedMembers) return true;
      
      // If ANY member is in Reviewers/Approval, the group should be disabled
      return memberIds.some(memberId => 
        selected.reviewers.has(memberId) || 
        selected.approvalLevels.some(level => level.has(memberId))
      );
    } else if (category === 'reviewers') {
      const isGroupSelectedAsReviewer = (newSession.value?.users || []).some(
        (u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER' && u.userId === groupId
      );
      if (isGroupSelectedAsReviewer) return false;
      
      // Check if ANY member is individually selected in THIS category (reviewers)
      // If so, disable the group to prevent duplicate selection
      const hasIndividuallySelectedMembers = memberIds.some(memberId => 
        selected.reviewers.has(memberId)
      );
      if (hasIndividuallySelectedMembers) return true;
      
      return memberIds.some(memberId => 
        selected.assignees.has(memberId) || 
        selected.approvalLevels.some(level => level.has(memberId))
      );
    } else if (category === 'approval' && approvalLevelIndex !== undefined) {
      // Check if ANY member is individually selected in THIS approval level
      // If so, disable the group to prevent duplicate selection
      const hasIndividuallySelectedMembers = memberIds.some(memberId => 
        selected.approvalLevels[approvalLevelIndex]?.has(memberId)
      );
      if (hasIndividuallySelectedMembers) return true;
      
      // Group members must be reviewers to be in approval level
      return memberIds.some(memberId => {
        // Disable if member is not a reviewer
        if (!selected.reviewers.has(memberId)) {
          return true;
        }
        return selected.assignees.has(memberId) || 
               selected.approvalLevels.some((level, idx) => idx !== approvalLevelIndex && level.has(memberId));
      });
    }
  }

  return false;
};

// Validate cross-level user assignments
// Returns error message if conflicts exist, null otherwise
const validateCrossLevelAssignments = (): string | null => {
  const selected = selectedUsersByCategory.value;
  
  // Check for users in both assignees and reviewers
  const assigneesSet = selected.assignees;
  const reviewersSet = selected.reviewers;
  const conflicts: string[] = [];
  
  // Find users in both assignees and reviewers
  assigneesSet.forEach(userId => {
    if (reviewersSet.has(userId)) {
      const userName = findLabelForId(userId);
      conflicts.push(`${userName} is assigned as both Assignee and Reviewer`);
    }
  });
  
  // Find users in assignees and approval levels
  assigneesSet.forEach(userId => {
    selected.approvalLevels.forEach((level, index) => {
      if (level.has(userId)) {
        const userName = findLabelForId(userId);
        conflicts.push(`${userName} is assigned as both Assignee and in Approval Level ${index + 1}`);
      }
    });
  });
  
  // Find users in reviewers and approval levels (this is allowed, but check for duplicates across approval levels)
  selected.approvalLevels.forEach((level, index) => {
    level.forEach(userId => {
      // Check if user is in multiple approval levels
      selected.approvalLevels.forEach((otherLevel, otherIndex) => {
        if (otherIndex !== index && otherLevel.has(userId)) {
          const userName = findLabelForId(userId);
          if (!conflicts.some(c => c.includes(userName) && c.includes('Approval Level'))) {
            conflicts.push(`${userName} is assigned to multiple Approval Levels (Level ${index + 1} and Level ${otherIndex + 1})`);
          }
        }
      });
    });
  });
  
  if (conflicts.length > 0) {
    return `User assignment conflicts detected:\n${conflicts.join('\n')}\n\nPlease resolve these conflicts before saving.`;
  }
  
  return null;
};

// Internal function to get options for a specific category with groups and members
const getOptionsForCategoryInternal = (category: 'assignees' | 'reviewers') => {
  if (!userOptions.value || !Array.isArray(userOptions.value) || userOptions.value.length === 0) {
    return []
  }
  
  try {
    // Get selected user IDs and group IDs for this category
    const getSelectedUserIds = (): string[] => {
      if (category === 'assignees') {
        return (newSession.value?.users || [])
          .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY')
          .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
          .filter((id: string) => id && id.includes('auth0|'))
      } else if (category === 'reviewers') {
        return (newSession.value?.users || [])
          .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
          .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
          .filter((id: string) => id && id.includes('auth0|'))
      }
      return []
    }
    
    const getSelectedGroupIds = (): string[] => {
      if (category === 'assignees') {
        return (newSession.value?.users || [])
          .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY')
          .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
          .filter((id: string) => id && !id.includes('auth0|'))
      } else if (category === 'reviewers') {
        return (newSession.value?.users || [])
          .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
          .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
          .filter((id: string) => id && !id.includes('auth0|'))
      }
      return []
    }
    
    const selectedUserIds = getSelectedUserIds()
    const selectedGroupIds = getSelectedGroupIds()
    
    const allOptions: any[] = []
    
    // Separate individual users and groups
    const individualUsers: any[] = []
    const groups: any[] = []
    
    userOptions.value.forEach((option: any) => {
      if (!option || !option.value || !option.label) return
      
      if (option._type === 'group' && Array.isArray(option._members)) {
        groups.push(option)
      } else {
        individualUsers.push(option)
      }
    })
    
    // STEP 1: Add individual users (not in any group)
    individualUsers.forEach((option: any) => {
      // Check if user is a member of any selected group in THIS category
      const isUserInSelectedGroups = selectedGroupIds.some((groupId: string) => {
        const memberIds = getGroupMemberIds(groupId)
        return memberIds.includes(option.value)
      })
      
      // Check cross-level validation
      const isDisabledByCrossLevel = isOptionDisabled(option.value, category)
      
      allOptions.push({
        label: String(option.label || findLabelForId(option.value) || ''),
        value: String(option.value || ''),
        disabled: Boolean(isUserInSelectedGroups || isDisabledByCrossLevel),
        _type: 'user',
      })
    })
    
    // STEP 2: Add groups
    groups.forEach((groupOption: any) => {
      const memberIds = Array.isArray(groupOption._members) ? groupOption._members : []
      const isGroupSelected = selectedGroupIds.includes(groupOption.value)
      const isExpanded = expandedGroups.value.has(groupOption.value)
      
      // Check cross-level validation for group
      const isGroupDisabledByCrossLevel = isOptionDisabled(groupOption.value, category)
      
      // Add group as selectable option
        allOptions.push({
          label: String(groupOption.label || findLabelForId(groupOption.value) || ''),
          value: String(groupOption.value || ''),
        disabled: Boolean(isGroupDisabledByCrossLevel),
          _type: 'group',
          _members: memberIds,
          _expanded: isExpanded,
      })
        
      // Add group members if expanded
        if (isExpanded) {
          memberIds.forEach((memberId: string) => {
            const memberOption = totalUserOptions.value.find((opt: any) => 
            opt.value === memberId && (opt._type === 'user' || !opt._type)
          )
            
            if (memberOption) {
            const isMemberSelected = selectedUserIds.includes(memberId)
            
            // CRITICAL FIX: Check if user is selected as individual FIRST
            // If user is selected as individual, they should be disabled in groups
            let isDisabled = false
            
            // PRIORITY 1: If user is selected as individual, disable them in groups
            if (isMemberSelected) {
              isDisabled = true
            }
            // PRIORITY 2: If group is selected, disable members (can't select again)
            else if (isGroupSelected) {
              isDisabled = true
            }
            // PRIORITY 3: Check cross-level conflicts
            else {
              const isDisabledByCrossLevel = isOptionDisabled(memberId, category)
              isDisabled = isDisabledByCrossLevel
            }
            
              allOptions.push({
                label: String(memberOption.label || findLabelForId(memberId) || ''),
              value: `${memberId}::${groupOption.value}`, // Suffix to ensure unique key
                disabled: Boolean(isDisabled),
                _type: 'user',
              _fromGroup: groupOption.value,
                _groupName: String(groupOption.label || findLabelForId(groupOption.value) || ''),
            })
          }
        })
      }
    })
    
    return allOptions
  } catch (error) {
    return []
  }
}

// Computed properties for each category's options
const assigneesOptions = computed(() => {
  try {
    const structureKey = getOptionsStructureKey('assignees')
    
    // Only recreate if structure changed (expanded groups, user list)
    if (lastAssigneesStructureKey.value !== structureKey || assigneesOptionsCache.value.length === 0) {
      const result = getOptionsForCategoryInternal('assignees')
      assigneesOptionsCache.value = result
      lastAssigneesStructureKey.value = structureKey
    } else {
      // Structure unchanged - just update disabled states in place (preserves scroll)
      updateDisabledStatesInPlace('assignees')
    }
    
    return assigneesOptionsCache.value
  } catch (error) {
    return []
  }
})

const reviewersOptions = computed(() => {
  try {
    const structureKey = getOptionsStructureKey('reviewers')
    
    // Only recreate if structure changed (expanded groups, user list)
    if (lastReviewersStructureKey.value !== structureKey || reviewersOptionsCache.value.length === 0) {
      const result = getOptionsForCategoryInternal('reviewers')
      reviewersOptionsCache.value = result
      lastReviewersStructureKey.value = structureKey
    } else {
      // Structure unchanged - just update disabled states in place (preserves scroll)
      updateDisabledStatesInPlace('reviewers')
    }
    
    return reviewersOptionsCache.value
  } catch (error) {
    return []
  }
})

// Computed property for Assignees dropdown value
const assigneesValue = computed(() => {
  try {
    if (!newSession.value || !newSession.value.users || !Array.isArray(newSession.value.users)) {
      return []
    }
    
    const result: string[] = []
    const processedGroups = new Set<string>()
    
    // Get all assigned IDs
    const assignedIds = newSession.value.users
      .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY' && u.userId)
      .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => String(u.userId))
    
    // First, identify which groups are selected
    const selectedGroupIds = assignedIds.filter((id: string) => !id.includes('auth0|'))
    
    // Get all member IDs of selected groups
    const selectedGroupMemberIds = new Set<string>()
    selectedGroupIds.forEach((groupId: string) => {
      const memberIds = getGroupMemberIds(groupId)
      memberIds.forEach(memberId => selectedGroupMemberIds.add(memberId))
    })
    
    assignedIds.forEach(id => {
      if (id.includes('auth0|')) {
        // Individual user - only add if they're NOT part of a selected group
        if (!selectedGroupMemberIds.has(id)) {
          result.push(id)
          // Add suffixed format for checkbox state in expanded groups, but ONLY if:
          // 1. User is individually selected (not via group)
          // 2. User is a member of a group that is NOT selected
          // This ensures checkbox shows as checked when group is expanded
          if (userOptions.value) {
            userOptions.value.forEach((opt: any) => {
            if (opt._type === 'group' && opt._members && opt._members.includes(id)) {
                // Only add if this group is NOT already selected (to avoid duplicates and deselection issues)
                if (!selectedGroupIds.includes(opt.value)) {
                  result.push(`${id}::${opt.value}`)
            }
              }
            })
          }
        }
      } else {
        // Group - when entire group is selected, only show group name, not individual members
        if (!processedGroups.has(id)) {
          processedGroups.add(id)
          result.push(id) // Add group ID only (for display)
          // Add suffixed format for checkbox state in dropdown, but NOT plain member IDs for display
          const memberIds = getGroupMemberIds(id)
          memberIds.forEach(memberId => {
            if (memberId) {
              // Only add suffixed format for checkbox state, not plain memberId for display
              result.push(`${memberId}::${id}`)
            }
          })
        }
      }
    })
    
    // Filter out any values with '::' to prevent empty wrapper divs in NSelect
    // These suffixed values are only for internal checkbox state, not for display
    return result.filter((id: string) => !id.includes('::'))
  } catch (error) {
    return []
  }
})

// Computed property for Reviewers dropdown value
const reviewersValue = computed(() => {
  try {
    if (!newSession.value || !newSession.value.users || !Array.isArray(newSession.value.users)) {
      return []
    }
    
    const result: string[] = []
    const processedGroups = new Set<string>()
    
    // Get all assigned IDs
    const assignedIds = newSession.value.users
      .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER' && u.userId)
      .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => String(u.userId))
    
    // First, identify which groups are selected
    const selectedGroupIds = assignedIds.filter((id: string) => !id.includes('auth0|'))
    
    // Get all member IDs of selected groups
    const selectedGroupMemberIds = new Set<string>()
    selectedGroupIds.forEach((groupId: string) => {
      const memberIds = getGroupMemberIds(groupId)
      memberIds.forEach(memberId => selectedGroupMemberIds.add(memberId))
    })
    
    assignedIds.forEach(id => {
      if (id.includes('auth0|')) {
        // Individual user - only add if they're NOT part of a selected group
        if (!selectedGroupMemberIds.has(id)) {
          result.push(id)
          // Add suffixed format for checkbox state in expanded groups, but ONLY if:
          // 1. User is individually selected (not via group)
          // 2. User is a member of a group that is NOT selected
          // This ensures checkbox shows as checked when group is expanded
          if (userOptions.value) {
            userOptions.value.forEach((opt: any) => {
            if (opt._type === 'group' && opt._members && opt._members.includes(id)) {
                // Only add if this group is NOT already selected (to avoid duplicates and deselection issues)
                if (!selectedGroupIds.includes(opt.value)) {
                  result.push(`${id}::${opt.value}`)
            }
              }
            })
          }
        }
      } else {
        // Group - when entire group is selected, only show group name, not individual members
        if (!processedGroups.has(id)) {
          processedGroups.add(id)
          result.push(id) // Add group ID only (for display)
          // Add suffixed format for checkbox state in dropdown, but NOT plain member IDs for display
          const memberIds = getGroupMemberIds(id)
          memberIds.forEach(memberId => {
            if (memberId) {
              // Only add suffixed format for checkbox state, not plain memberId for display
              result.push(`${memberId}::${id}`)
            }
          })
        }
      }
    })
    
    // Filter out any values with '::' to prevent empty wrapper divs in NSelect
    // These suffixed values are only for internal checkbox state, not for display
    return result.filter((id: string) => !id.includes('::'))
  } catch (error) {
    return []
  }
})

// Handle assignees update
const handleAssigneesUpdate = (v: string[]) => {
  if (!newSession.value) return
  
  // FIX FOR ISSUE #1: Individual User Deselection
  // Strategy: When a plain userId is removed, also remove any related userId::groupId formats
  // This ensures that clicking X on a tag truly deselects the user
  
  // Step 1: Collect all plain userIds (individually selected users) from the NEW array
  const plainUserIdsInNewArray = new Set<string>()
  v.forEach((id: string) => {
    if (id && !id.includes('::') && id.includes('auth0|')) {
      plainUserIdsInNewArray.add(id)
    }
  })
  
  // Step 2: Get currently selected plain userIds (before update)
  const currentlySelectedPlainUserIds = new Set<string>()
  const currentAssignees = (newSession.value.users || [])
    .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => 
      u && u.userRole === 'ACTIVITY' && u.userId && u.userId.includes('auth0|')
    )
    .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
  currentAssignees.forEach((id: string) => {
    currentlySelectedPlainUserIds.add(id)
  })
  
  // Step 3: Identify which plain userIds were removed (were selected before, not in new array)
  // CRITICAL: If a plain userId was removed (clicked X), we must NOT process any suffixed formats for that userId
  const removedPlainUserIds = new Set<string>()
  currentlySelectedPlainUserIds.forEach((userId: string) => {
    if (!plainUserIdsInNewArray.has(userId)) {
      removedPlainUserIds.add(userId)
    }
  })
  
  // Step 4: Track group IDs in the new array and identify removed groups
  // FIX FOR GROUP DESELECTION: When a group is removed (clicked X), ignore all userId::groupId formats for that group
  const groupIdsInNewArray = new Set<string>()
  v.forEach((id: string) => {
    if (id && !id.includes('::') && !id.includes('auth0|')) {
      groupIdsInNewArray.add(id)
    }
  })
  
  // Get currently selected group IDs (before update)
  const currentlySelectedGroupIds = new Set<string>()
  const currentGroupAssignees = (newSession.value.users || [])
    .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => 
      u && u.userRole === 'ACTIVITY' && u.userId && !u.userId.includes('auth0|')
    )
    .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
  currentGroupAssignees.forEach((groupId: string) => {
    currentlySelectedGroupIds.add(groupId)
  })
  
  // Identify which groups were removed
  const removedGroupIds = new Set<string>()
  currentlySelectedGroupIds.forEach((groupId: string) => {
    if (!groupIdsInNewArray.has(groupId)) {
      removedGroupIds.add(groupId)
    }
  })
  
  // CRITICAL FIX: When a group is removed, also remove all its individual members
  // unless they were selected individually (not via the group)
  const memberIdsFromRemovedGroups = new Set<string>()
  removedGroupIds.forEach((groupId: string) => {
    const memberIds = getGroupMemberIds(groupId)
    memberIds.forEach((memberId: string) => {
      // Only add to removal list if member is NOT individually selected
      // (i.e., they were only selected via the group)
      if (!plainUserIdsInNewArray.has(memberId)) {
        memberIdsFromRemovedGroups.add(memberId)
      }
    })
  })
  
  const cleanValues = new Set<string>()
  v.forEach((id: string) => {
    if (!id) return
    
    if (id.includes('::')) {
      // Extract userId and groupId from userId::groupId format
      const [userId, groupId] = id.split('::')
      // CRITICAL: Block if:
      // 1. User was individually selected and then removed (clicked X), OR
      // 2. Group was removed (clicked X on group tag), OR
      // 3. User is a member of a removed group and wasn't individually selected
      if (userId && groupId) {
        const wasUserRemoved = removedPlainUserIds.has(userId)
        const wasGroupRemoved = removedGroupIds.has(groupId)
        const wasMemberOfRemovedGroup = memberIdsFromRemovedGroups.has(userId)
        
        if (!wasUserRemoved && !wasGroupRemoved && !wasMemberOfRemovedGroup) {
          // Neither user nor group was removed - allow selection
          cleanValues.add(userId)
        }
        // If any condition is true, skip it (user/group was deselected via X)
      }
    } else {
      // Direct userId or groupId
      // CRITICAL: If this is a userId that's a member of a removed group, don't add it
      if (id.includes('auth0|')) {
        // It's a user ID - check if it's a member of a removed group
        if (!memberIdsFromRemovedGroups.has(id)) {
          cleanValues.add(id)
        }
      } else {
        // It's a group ID - add it
        cleanValues.add(id)
      }
    }
  })
  
  const uniqueValues = Array.from(cleanValues)
  
  newSession.value.users = [
    ...(newSession.value.users as UsersInDLSessions[] | UsersInCESessions[] | UsersInRASessions[])
      .filter((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userRole !== 'ACTIVITY'),
    ...uniqueValues.map((userId: string) => ({
      userId,
      userRole: 'ACTIVITY' as SessionUserRole,
    })),
  ]
  
  selectedAssigneesCount.value = uniqueValues.length
  const totalSelectableUsers = individualUsersInProject.value.length + groupUserIds.value.length
  assigneesIndeterminate.value = selectedAssigneesCount.value === 0 ? false : totalSelectableUsers === selectedAssigneesCount.value ? false : true
  selectAllAssignees.value = selectedAssigneesCount.value === 0 ? false : ''
}

// Handle reviewers update
const handleReviewersUpdate = (v: string[]) => {
  if (!newSession.value) return
  
  const plainUserIdsInNewArray = new Set<string>()
  v.forEach((id: string) => {
    if (id && !id.includes('::') && id.includes('auth0|')) {
      plainUserIdsInNewArray.add(id)
    }
  })
  
  // Step 2: Get currently selected plain userIds (before update)
  const currentlySelectedPlainUserIds = new Set<string>()
  const currentReviewers = (newSession.value.users || [])
    .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => 
      u && u.userRole === 'QUALITY_CONTROLLER' && u.userId && u.userId.includes('auth0|')
    )
    .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
  currentReviewers.forEach((id: string) => {
    currentlySelectedPlainUserIds.add(id)
  })
  
  // Step 3: Identify which plain userIds were removed (were selected before, not in new array)
  // CRITICAL: If a plain userId was removed (clicked X), we must NOT process any suffixed formats for that userId
  const removedPlainUserIds = new Set<string>()
  currentlySelectedPlainUserIds.forEach((userId: string) => {
    if (!plainUserIdsInNewArray.has(userId)) {
      removedPlainUserIds.add(userId)
    }
  })
  
  // Step 4: Track group IDs in the new array and identify removed groups
  // FIX FOR GROUP DESELECTION: When a group is removed (clicked X), ignore all userId::groupId formats for that group
  const groupIdsInNewArray = new Set<string>()
  v.forEach((id: string) => {
    if (id && !id.includes('::') && !id.includes('auth0|')) {
      groupIdsInNewArray.add(id)
    }
  })
  
  // Get currently selected group IDs (before update)
  const currentlySelectedGroupIds = new Set<string>()
  const currentGroupAssignees = (newSession.value.users || [])
    .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => 
      u && u.userRole === 'ACTIVITY' && u.userId && !u.userId.includes('auth0|')
    )
    .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
  currentGroupAssignees.forEach((groupId: string) => {
    currentlySelectedGroupIds.add(groupId)
  })
  
  // Get currently selected group IDs for reviewers (before update)
  const currentlySelectedGroupIdsForReviewers = new Set<string>()
  const currentGroupReviewers = (newSession.value.users || [])
    .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => 
      u && u.userRole === 'QUALITY_CONTROLLER' && u.userId && !u.userId.includes('auth0|')
    )
    .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
  currentGroupReviewers.forEach((groupId: string) => {
    currentlySelectedGroupIdsForReviewers.add(groupId)
  })
  
  // Identify which groups were removed
  const removedGroupIds = new Set<string>()
  currentlySelectedGroupIdsForReviewers.forEach((groupId: string) => {
    if (!groupIdsInNewArray.has(groupId)) {
      removedGroupIds.add(groupId)
    }
  })
  
  // CRITICAL FIX: When a group is removed, also remove all its individual members
  // unless they were selected individually (not via the group)
  const memberIdsFromRemovedGroups = new Set<string>()
  removedGroupIds.forEach((groupId: string) => {
    const memberIds = getGroupMemberIds(groupId)
    memberIds.forEach((memberId: string) => {
      // Only add to removal list if member is NOT individually selected
      // (i.e., they were only selected via the group)
      if (!plainUserIdsInNewArray.has(memberId)) {
        memberIdsFromRemovedGroups.add(memberId)
      }
    })
  })
  
  const cleanValues = new Set<string>()
  v.forEach((id: string) => {
    if (!id) return
    
    if (id.includes('::')) {
      // Extract userId and groupId from userId::groupId format
      const [userId, groupId] = id.split('::')
      // CRITICAL: Block if:
      // 1. User was individually selected and then removed (clicked X), OR
      // 2. Group was removed (clicked X on group tag), OR
      // 3. User is a member of a removed group and wasn't individually selected
      if (userId && groupId) {
        const wasUserRemoved = removedPlainUserIds.has(userId)
        const wasGroupRemoved = removedGroupIds.has(groupId)
        const wasMemberOfRemovedGroup = memberIdsFromRemovedGroups.has(userId)
        
        if (!wasUserRemoved && !wasGroupRemoved && !wasMemberOfRemovedGroup) {
          // Neither user nor group was removed - allow selection
          cleanValues.add(userId)
        }
        // If any condition is true, skip it (user/group was deselected via X)
      }
      } else {
      // Direct userId or groupId
      // CRITICAL: If this is a userId that's a member of a removed group, don't add it
      if (id.includes('auth0|')) {
        // It's a user ID - check if it's a member of a removed group
        if (!memberIdsFromRemovedGroups.has(id)) {
          cleanValues.add(id)
        }
      } else {
        // It's a group ID - add it
        cleanValues.add(id)
      }
    }
  })
  
  const uniqueValues = Array.from(cleanValues)
  
  // CRITICAL: Calculate count correctly - only count groups and individual users (not group members)
  // Separate groups and individual users
  const groupIds = uniqueValues.filter((id: string) => !id.includes('auth0|'))
  const individualUserIds = uniqueValues.filter((id: string) => id.includes('auth0|'))
  
  // Get all member IDs of selected groups - these should NOT be counted separately
  const selectedGroupMemberIds = new Set<string>()
  groupIds.forEach((groupId: string) => {
    const memberIds = getGroupMemberIds(groupId)
    memberIds.forEach((memberId: string) => selectedGroupMemberIds.add(memberId))
  })
  
  // Count only groups and individual users that are NOT members of selected groups
  selectedReviewersCount.value = calculateReviewerCount(uniqueValues)
  
  newSession.value.users = [
    ...(newSession.value.users as UsersInDLSessions[] | UsersInCESessions[] | UsersInRASessions[])
      .filter((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userRole !== 'QUALITY_CONTROLLER'),
    ...uniqueValues.map((userId: string) => ({
      userId,
      userRole: 'QUALITY_CONTROLLER' as SessionUserRole,
    })),
  ]
  const totalSelectableUsers = individualUsersInProject.value.length + groupUserIds.value.length
  reviewersIndeterminate.value = selectedReviewersCount.value === 0 ? false : totalSelectableUsers === selectedReviewersCount.value ? false : true
  selectAllReviewers.value = selectedReviewersCount.value === 0 ? false : ''
  updateApprovedSelectOptions(uniqueValues)
}

// Get approval options for a specific level
// Only shows users/groups that are selected as reviewers
const getApprovalOptionsForLevel = (index: number): any[] => {
  try {
    if (!newSession.value?.users || !userOptions.value) {
      return []
    }
    
    // Get all reviewer IDs (individual users and groups)
    const reviewerIds = (newSession.value.users || [])
      .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
      .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
      .filter((id: string) => id)
    
    if (reviewerIds.length === 0) {
      return []
    }
    
    // Separate into individual users and groups
    const selectedIndividualUserIds = reviewerIds.filter((id: string) => id.includes('auth0|'))
    const selectedGroupIds = reviewerIds.filter((id: string) => !id.includes('auth0|'))
    
    // CRITICAL: Get all member IDs of selected groups - these should NOT appear as individual options
    const selectedGroupMemberIds = new Set<string>()
    selectedGroupIds.forEach((groupId: string) => {
      const memberIds = getGroupMemberIds(groupId)
      memberIds.forEach((memberId: string) => selectedGroupMemberIds.add(memberId))
    })
    
    const allOptions: any[] = []
    
    // Get currently selected values in this approval level
    const currentApprovalLevel = newSession.value.approval && Array.isArray(newSession.value.approval[index])
      ? newSession.value.approval[index]
      : []
    const selectedGroupIdsInThisLevel = currentApprovalLevel.filter((id: string) => id && !id.includes('auth0|'))
    
    // STEP 1: Add groups that are selected in Reviewers
    // NOTE: For approval field, we only show groups and individual users - NO expansion/collapse
    selectedGroupIds.forEach((groupId: string) => {
      const groupOption = userOptions.value.find((opt: any) => opt.value === groupId && opt._type === 'group')
      if (groupOption) {
        // Check if this group is selected in the current approval level
        const isGroupSelectedInThisLevel = selectedGroupIdsInThisLevel.includes(groupId)
        
        // Check cross-level validation for group
        const isGroupDisabled = isOptionDisabled(groupOption.value, 'approval', index)
        
        // Add group as a selectable option (NO expansion - just the group itself)
        allOptions.push({
          label: String(groupOption.label || findLabelForId(groupOption.value) || ''),
          value: String(groupOption.value || ''),
          disabled: Boolean(isGroupDisabled),
          _type: 'group',
        })
      }
    })
    
    // STEP 2: Add individual users that are selected in Reviewers
    // CRITICAL: Exclude users that are members of selected groups - only show users selected individually
    selectedIndividualUserIds.forEach((userId: string) => {
      // Skip if this user is a member of a selected group
      if (selectedGroupMemberIds.has(userId)) {
        return
      }
      
      const userOption = userOptions.value.find((opt: any) => 
        opt && opt.value === userId && (opt._type === 'user' || !opt._type)
      )
      
      if (userOption) {
        // Check cross-level validation
        const isDisabled = isOptionDisabled(userId, 'approval', index)
            
            allOptions.push({
          label: String(userOption.label || findLabelForId(userId) || ''),
          value: String(userId || ''),
              disabled: Boolean(isDisabled),
              _type: 'user',
        })
      } else {
        // Fallback: if not found in userOptions, try totalUserOptions
        const totalOption = totalUserOptions.value.find((opt: any) => opt && opt.value === userId)
        if (totalOption) {
          // Check cross-level validation
          const isDisabled = isOptionDisabled(userId, 'approval', index)
          
          allOptions.push({
            label: String(totalOption.label || findLabelForId(userId) || ''),
            value: String(userId || ''),
            disabled: Boolean(isDisabled),
            _type: 'user',
          })
        }
      }
    })
    
    return allOptions
  } catch (error) {
    return []
  }
}

// Computed property that returns approval options indexed by level
const approvalOptionsByLevel = computed(() => {
  try {
    if (!newSession.value?.approval || !Array.isArray(newSession.value.approval)) {
      return {}
    }
    
    const optionsMap: Record<number, any[]> = {}
    newSession.value.approval.forEach((_, index) => {
      const result = getApprovalOptionsForLevel(index)
      optionsMap[index] = Array.isArray(result) ? result : []
    })
    
    return optionsMap
  } catch (error) {
    return {}
  }
})

// Function to get approval options for a specific level
const getApprovalOptions = (index: number): any[] => {
  try {
    const optionsMap = approvalOptionsByLevel.value
    if (!optionsMap || typeof optionsMap !== 'object') {
      return []
    }
    
    const options = optionsMap[index]
    return Array.isArray(options) ? options : []
  } catch (error) {
    return []
  }
}

// Computed property for Approval Level dropdown values
// When entire group is selected, only show group name, not individual members
const approvalValues = computed(() => {
  try {
    if (!newSession.value?.approval || !Array.isArray(newSession.value.approval)) {
      return {}
    }
    
    const valuesMap: Record<number, string[]> = {}
    newSession.value.approval.forEach((level, index) => {
      if (!Array.isArray(level)) {
        valuesMap[index] = []
        return
      }
      
      const result: string[] = []
      const processedGroups = new Set<string>()
      
      // First, identify which groups are selected in this level
      const selectedGroupIdsInLevel = level.filter((id: string) => id && typeof id === 'string' && !id.includes('auth0|'))
      
      // Get all member IDs of selected groups
      const selectedGroupMemberIds = new Set<string>()
      selectedGroupIdsInLevel.forEach((groupId: string) => {
        const memberIds = getGroupMemberIds(groupId)
        memberIds.forEach(memberId => selectedGroupMemberIds.add(memberId))
      })
      
      level.forEach((id: string) => {
        if (!id || typeof id !== 'string') return
        
        if (id.includes('auth0|')) {
          // Individual user - only add if they're NOT part of a selected group
          if (!selectedGroupMemberIds.has(id)) {
            result.push(id)
            // Add suffixed format for checkbox state if user is in a group
            userOptions.value.forEach((opt: any) => {
              if (opt._type === 'group' && opt._members && opt._members.includes(id)) {
                result.push(`${id}::${opt.value}`)
              }
            })
          }
        } else {
          // Group - when entire group is selected, only show group name
          if (!processedGroups.has(id)) {
            processedGroups.add(id)
            result.push(id) // Add group ID only
            // Add suffixed format for checkbox state, but NOT plain member IDs
            const memberIds = getGroupMemberIds(id)
            memberIds.forEach(memberId => {
              if (memberId) {
                result.push(`${memberId}::${id}`) // For checkbox state only
              }
            })
          }
        }
      })
      
      valuesMap[index] = result
    })
    
    return valuesMap
  } catch (error) {
    return {}
  }
})

// Handle approval level update
const handleApprovalUpdate = (index: number, v: string[]) => {
  if (!newSession.value || !newSession.value.approval) return
  
  // For approval levels, values are already simple userIds (no :: format)
  // Just filter out any empty or invalid values
  const cleanValues = v.filter((id: string) => id && typeof id === 'string' && id.trim() !== '')
  
  // Ensure approval array exists and has enough elements
  if (!Array.isArray(newSession.value.approval)) {
    newSession.value.approval = []
  }
  
  // Ensure the index exists
  while (newSession.value.approval.length <= index) {
    newSession.value.approval.push([])
  }
  
  // Update the approval level with clean values
  newSession.value.approval[index] = cleanValues
}

// TABS
/**
 * Tabs array
 */
const tabs = computed(() => {
  return [
    {
      key: 'dLSession',
      name: 'Data Labelling Session',
    },
    {
      key: 'cESession',
      name: 'Clinical Evaluation Session',
    },
  ]
})

const activeTab = ref<'dLSession' | 'cESession'>('dLSession')
const activeTabName = computed(() => tabs.value.find(tab => tab.key === activeTab.value)?.name)

// NOTE: `activeTab` side-effects are handled by a single watcher later (with `immediate: true`)
// to avoid duplicate API calls.

const showMoreAssignees = ref<boolean[]>([]);
function showMoreClickAssignees(val: boolean, index: number) {
  showMoreAssignees.value[index] = val;
}

const showMoreReviewer = ref<boolean[]>([]);
function showMoreClickReviewer(val: boolean, index: number) {
  showMoreReviewer.value[index] = val;
}

const selectedAssigneesCount = ref(0)
const selectedReviewersCount = ref(0)

// Helper function to calculate reviewer count correctly
// Only counts groups and individual users (not group members)
const calculateReviewerCount = (reviewerIds: string[]): number => {
  if (!reviewerIds || reviewerIds.length === 0) return 0
  
  // Separate groups and individual users
  const groupIds = reviewerIds.filter((id: string) => id && !id.includes('auth0|'))
  const individualUserIds = reviewerIds.filter((id: string) => id && id.includes('auth0|'))
  
  // Get all member IDs of selected groups - these should NOT be counted separately
  const selectedGroupMemberIds = new Set<string>()
  groupIds.forEach((groupId: string) => {
    const memberIds = getGroupMemberIds(groupId)
    memberIds.forEach((memberId: string) => selectedGroupMemberIds.add(memberId))
  })
  
  // Count only groups and individual users that are NOT members of selected groups
  const individualUsersNotInGroups = individualUserIds.filter((userId: string) => !selectedGroupMemberIds.has(userId))
  return groupIds.length + individualUsersNotInGroups.length
}
// TABLE
const data = ref<Session[]>([])
const originalUnfilteredData = ref<Session[]>([]) // Store original data before filtering for filter options extraction
const table = ref(null)
const singleDLSession = ref(null)
const taxonomiesInSession = ref(null)
const approvalLevelUsers = ref(null)
const labelsInSession = ref(null)
const structuresInSession = ref(null)

// Helper function to get session lock status
// This function finds the most recent active lock/unlock activity (deletedAt is null)
function getSessionLockStatus(row: any): { isLocked: boolean; reason: string | null } {
  if (activeTab.value !== 'dLSession') {
    return { isLocked: false, reason: null }
  }
  
  // Filter to only active records (deletedAt is null)
  // Note: Repository now filters at database level (where: deletedAt: null), 
  // but we double-check here for safety and to handle any edge cases
  const lockHistoryArray = (row.dLSessionLockHistory || []).filter((record: any) => 
    record.deletedAt === null || record.deletedAt === undefined
  )
  
  if (lockHistoryArray.length === 0) {
    return { isLocked: false, reason: null }
  }
  
  // Find the record with the most recent activity (either lockedAt or unlockedAt)
  // When we unlock, we UPDATE the existing record, so unlockedAt is more recent than lockedAt
  let mostRecentRecord = lockHistoryArray[0]
  let mostRecentTimestamp = mostRecentRecord.lockedAt ? new Date(mostRecentRecord.lockedAt).getTime() : 0
  
  for (const record of lockHistoryArray) {
    // Get the most recent timestamp for this record (either lockedAt or unlockedAt)
    const lockedTime = record.lockedAt ? new Date(record.lockedAt).getTime() : 0
    const unlockedTime = record.unlockedAt ? new Date(record.unlockedAt).getTime() : 0
    const recordMostRecentTime = Math.max(lockedTime, unlockedTime)
    
    if (recordMostRecentTime > mostRecentTimestamp) {
      mostRecentTimestamp = recordMostRecentTime
      mostRecentRecord = record
    }
  }
  
  const isLocked = mostRecentRecord.isLocked ?? false
  
  // Get lock reason: check if deletedAt is null, then return lockReason, else return null
  const lockReason = mostRecentRecord.deletedAt === null 
    ? mostRecentRecord.lockReason 
    : null

  // Get unlock reason: check if deletedAt is null, then return unlockReason, else return null
  const unlockReason = mostRecentRecord.deletedAt === null 
    ? mostRecentRecord.unlockReason 
    : null
  
  const reason = isLocked ? lockReason : unlockReason
  
  return {
    isLocked,
    reason
  }
}

// Delete Session Requests data (for pending/rejected maps only)
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

/**
 * Map of session IDs to pending delete session requests
 * Used to quickly check if a session has a pending delete request
 */
const pendingDeleteRequestsMap = ref<Map<string, DeleteSessionRequest>>(new Map())

/**
 * Map of session IDs to rejected delete session requests
 * Used to show rejection reason in tooltip for rejected rows
 */
const rejectedDeleteRequestsMap = ref<Map<string, DeleteSessionRequest>>(new Map())

// Helper function to get menu options for actions dropdown
const getActionsMenuOptions = (row: Session) => {
  const menuOptions: any[] = []
  const lockStatus = getSessionLockStatus(row)
  const isLocked = lockStatus.isLocked && activeTab.value === 'dLSession'
  
  if (canDeleteSession.value) {
    menuOptions.push({
      label: 'Delete',
      key: 'delete',
      disabled: isLocked,
      renderLabel: () => h('span', {
        class: 'delete-menu-item',
        style: {
          color: isLocked ? '#999' : '#F87777',
          opacity: isLocked ? 0.5 : 1
        }
      }, 'Delete')
    })
  }
  
  if (activeTab.value === 'dLSession' && canAnalyseSession.value) {
    menuOptions.push({
      label: 'Analysis',
      key: 'analysis',
      renderLabel: () => h('span', {
        class: 'analysis-menu-item',
        style: {
          color: '#F2C97D'
        }
      }, 'Analysis')
    })
  }
  
  return { menuOptions, row }
}

const columns = computed<DataTableColumns<Session>>(() => [
  {
    key: 'name',
    title: 'Name',
    width: 200,
    fixed: 'left',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.name || false,
    render(row, index) {
      if (editedRow.value?.id === row.id) {
        return h(NInput, {
          value: row.name,
          onUpdateValue(v: string) {
            data.value[index].name = v
          },
        })
      }

      return h('div', {
        style: {
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          width: '100%'
        }
      }, row.name)
    },
  },
  {
    key: 'updatedAt',
    title: 'Updated at',
    width: '10%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.updatedAt || false,
    render: (row: Session) => {
      return row.updatedAt.toLocaleString()
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
              data.value[index].description = v
            },
          })
        : row.description
    },
  },
  {
    key: 'users',
    title: 'Assignees',
    width: '15%',
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NSelect, {
            multiple: true,
            options: userOptions.value,
            value: (row.users as any)
              .filter((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userRole === 'ACTIVITY')
              .map((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userId),
            onUpdateValue(v: string[]) {
              data.value[index].users = [
                ...(data.value[index].users as any).filter((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userRole !== 'ACTIVITY'),
                ...v.map(userId => ({
                  dLSessionId: row.id,
                  userId,
                  userRole: 'ACTIVITY',
                })),
              ]
            },
          })
        : h(
            'div',
            [
              h(
                'ul',
                { style: { listStylePosition: 'inside', paddingLeft: '0', margin: '0' } },
                (() => {
                  // Get all assignee userIds from row.users
                  const assigneeUserIds = (row.users as any)
                    .filter((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userRole === 'ACTIVITY')
                    .map((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userId)
                  
                  // Separate groups and individual users
                  const groupIds = assigneeUserIds.filter((id: string) => !id.includes('auth0|'))
                  const individualUserIds = assigneeUserIds.filter((id: string) => id.includes('auth0|'))
                  
                  // Get all member IDs of selected groups
                  const selectedGroupMemberIds = new Set<string>()
                  groupIds.forEach((groupId: string) => {
                    const memberIds = getGroupMemberIds(groupId)
                    memberIds.forEach((memberId: string) => selectedGroupMemberIds.add(memberId))
                  })
                  
                  // Build display list: groups first, then individual users (excluding those in selected groups)
                  const displayItems: { id: string; label: string }[] = []
                  
                  // Add groups
                  groupIds.forEach((groupId: string) => {
                    displayItems.push({
                      id: groupId,
                      label: findLabelForId(groupId)
                    })
                  })
                  
                  // Add individual users that are NOT members of selected groups
                  individualUserIds.forEach((userId: string) => {
                    if (!selectedGroupMemberIds.has(userId)) {
                      displayItems.push({
                        id: userId,
                        label: findLabelForId(userId)
                      })
                    }
                  })
                  
                  // Slice based on showMore
                  const displayList = showMoreAssignees.value[index] 
                    ? displayItems 
                    : displayItems.slice(0, 5)
                  
                  // Map to list items
                  return displayList.map((item: { id: string; label: string }) => {
                    return h('li', {
                      key: item.id,
                      style: { listStyleType: 'circle' },
                    }, item.label)
                  })
                })()
              ),
              (() => {
                // Count assignees correctly (groups + individual users, not group members)
                const assigneeUserIds = (row.users as any)
                  .filter((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userRole === 'ACTIVITY')
                  .map((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userId)
                
                const groupIds = assigneeUserIds.filter((id: string) => !id.includes('auth0|'))
                const individualUserIds = assigneeUserIds.filter((id: string) => id.includes('auth0|'))
                
                // Get all member IDs of selected groups
                const selectedGroupMemberIds = new Set<string>()
                groupIds.forEach((groupId: string) => {
                  const memberIds = getGroupMemberIds(groupId)
                  memberIds.forEach((memberId: string) => selectedGroupMemberIds.add(memberId))
                })
                
                // Count only groups and individual users (not group members)
                const individualUsersNotInGroups = individualUserIds.filter((userId: string) => !selectedGroupMemberIds.has(userId))
                const totalCount = groupIds.length + individualUsersNotInGroups.length
                
                return totalCount > 5
                  ? h(
                      'div',
                      [
                        h(
                          'span',
                          {
                            onClick: () => showMoreClickAssignees(!showMoreAssignees.value[index], index),
                            style: { cursor: 'pointer', color: '#1890ff' },
                          },
                          showMoreAssignees.value[index] ? '...Less' : '...More'
                        ),
                      ]
                    )
                  : null
              })()
            ]
          )
    },
  },
  {
    key: 'users',
    title: 'Reviewers',
    width: '15%',
    ellipsis: true,
    render(row, index) {
      return editedRow.value?.id === row.id
        ? h(NSelect, {
            multiple: true,
            options: userOptions.value,
            value: (row.users as any)
              .filter((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userRole === 'QUALITY_CONTROLLER')
              .map((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userId),
            onUpdateValue(v: string[]) {
              data.value[index].users = [
                ...(data.value[index].users as any).filter((user: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => user.userRole !== 'QUALITY_CONTROLLER'),
                ...v.map(userId => ({
                  dLSessionId: row.id,
                  userId,
                  userRole: 'QUALITY_CONTROLLER',
                })),
              ]
            },
          })
        : h(
            'div',
            [
              h(
                'ul',
                { style: { listStylePosition: 'inside', paddingLeft: '0', margin: '0' } },
                (() => {
                  // Get all reviewer userIds from row.users
                  const reviewerUserIds = (row.users as any)
                    .filter((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userRole === 'QUALITY_CONTROLLER')
                    .map((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userId)
                  
                  // Separate groups and individual users
                  const groupIds = reviewerUserIds.filter((id: string) => !id.includes('auth0|'))
                  const individualUserIds = reviewerUserIds.filter((id: string) => id.includes('auth0|'))
                  
                  // Get all member IDs of selected groups
                  const selectedGroupMemberIds = new Set<string>()
                  groupIds.forEach((groupId: string) => {
                    const memberIds = getGroupMemberIds(groupId)
                    memberIds.forEach((memberId: string) => selectedGroupMemberIds.add(memberId))
                  })
                  
                  // Build display list: groups first, then individual users (excluding those in selected groups)
                  const displayItems: { id: string; label: string }[] = []
                  
                  // Add groups
                  groupIds.forEach((groupId: string) => {
                    displayItems.push({
                      id: groupId,
                      label: findLabelForId(groupId)
                    })
                  })
                  
                  // Add individual users that are NOT members of selected groups
                  individualUserIds.forEach((userId: string) => {
                    if (!selectedGroupMemberIds.has(userId)) {
                      displayItems.push({
                        id: userId,
                        label: findLabelForId(userId)
                      })
                    }
                  })
                  
                  // Slice based on showMore
                  const displayList = showMoreReviewer.value[index] 
                    ? displayItems 
                    : displayItems.slice(0, 5)
                  
                  // Map to list items
                  return displayList.map((item: { id: string; label: string }) => {
                    return h('li', {
                      key: item.id,
                      style: { listStyleType: 'circle' },
                    }, item.label)
                  })
                })()
              ),
              (() => {
                // Count reviewers correctly (groups + individual users, not group members)
                const reviewerUserIds = (row.users as any)
                  .filter((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userRole === 'QUALITY_CONTROLLER')
                  .map((rowUser: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => rowUser.userId)
                
                const groupIds = reviewerUserIds.filter((id: string) => !id.includes('auth0|'))
                const individualUserIds = reviewerUserIds.filter((id: string) => id.includes('auth0|'))
                
                // Get all member IDs of selected groups
                const selectedGroupMemberIds = new Set<string>()
                groupIds.forEach((groupId: string) => {
                  const memberIds = getGroupMemberIds(groupId)
                  memberIds.forEach((memberId: string) => selectedGroupMemberIds.add(memberId))
                })
                
                // Count only groups and individual users (not group members)
                const individualUsersNotInGroups = individualUserIds.filter((userId: string) => !selectedGroupMemberIds.has(userId))
                const totalCount = groupIds.length + individualUsersNotInGroups.length
                
                return totalCount > 5
                  ? h(
                      'div',
                      [
                        h(
                          'span',
                          {
                            onClick: () => showMoreClickReviewer(!showMoreReviewer.value[index], index),
                            style: { cursor: 'pointer', color: '#1890ff' },
                          },
                          showMoreReviewer.value[index] ? '...Less' : '...More'
                        ),
                      ]
                    )
                  : null
              })()
            ]
          )
    },
  },
  {
    key: 'sessionLabels',
    title: () => {
      return h('div', { class: 'flex items-center justify-between w-full' }, [
        h('span', 'Session Labels'),
        h(NPopover, {
          key: `filter-popover-sessionLabels-${sessionLabelsFilter.value.length}`,
          trigger: 'click',
          show: sessionLabelsFilterDropdownVisible.value,
          'onUpdate:show': (val: boolean) => {
            if (val) {
              openSessionLabelsFilterDropdown()
            } else {
              closeSessionLabelsFilterDropdown()
            }
          },
          placement: 'bottom-start',
          style: { padding: '0' }
        }, {
          trigger: () => {
            const isFilterActive = sessionLabelsFilter.value.length > 0
            const iconColor = isFilterActive ? '#1890ff' : '#8c8c8c'
            return h(NIcon, {
              key: `filter-icon-sessionLabels-${isFilterActive ? 'active' : 'inactive'}-${sessionLabelsFilter.value.length}`,
              size: '16',
              style: {
                cursor: 'pointer',
                color: iconColor,
                marginLeft: '4px',
                transition: 'color 0.2s ease'
              },
              class: isFilterActive ? 'filter-icon-active' : 'filter-icon-inactive',
              onClick: (e: Event) => {
                e.stopPropagation()
                openSessionLabelsFilterDropdown()
              }
            }, {
              default: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: iconColor,
                style: { 
                  width: '16px', 
                  height: '16px',
                  color: iconColor
                }
              }, [
                h('path', {
                  d: 'M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z',
                  fill: iconColor
                })
              ])
            })
          },
          default: () => h('div', {
            class: 'filter-dropdown',
            style: {
              width: '240px',
              padding: '8px',
              backgroundColor: 'rgb(45 43 50 / 0%)'
            }
          }, [
            // Search input
            h(NInput, {
              value: sessionLabelsFilterSearchQuery.value,
              'onUpdate:value': (val: string) => {
                sessionLabelsFilterSearchQuery.value = val
              },
              placeholder: 'Search in filters',
              clearable: true,
              style: { marginBottom: '8px' }
            }, {
              prefix: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: 'currentColor',
                style: { width: '14px', height: '14px', color: '#8c8c8c' }
              }, [
                h('path', {
                  d: 'M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'
                })
              ])
            }),
            // Select all checkbox
            h('div', {
              style: {
                padding: '4px 0',
                marginBottom: '4px'
              }
            }, [
              h(NCheckbox, {
                checked: isSessionLabelSelectAllChecked(),
                indeterminate: isSessionLabelSelectAllIndeterminate(),
                'onUpdate:checked': () => {
                  toggleSessionLabelSelectAll()
                }
              }, {
                default: () => h('span', { style: { marginLeft: '8px', color: '#76BAF6' } }, `Select All - ${getFilteredSessionLabelsOptions().length}`)
              })
            ]),
            // Checkbox list
            h('div', {
              class: 'filter-scroll-container',
              style: {
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '8px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }
            }, getFilteredSessionLabelsOptions().map((option) => 
              h('div', {
                key: option.id,
                style: {
                  padding: '4px 0',
                  cursor: 'pointer'
                }
              }, [
                h(NCheckbox, {
                  checked: isSessionLabelOptionSelected(option.id),
                  'onUpdate:checked': () => toggleSessionLabelOption(option.id)
                }, {
                  default: () => h('span', { style: { marginLeft: '8px' } }, option.name)
                })
              ])
            )),
            // Buttons
            h(NDivider, { style: { margin: '8px 0' } }),
            h('div', {
              class: 'flex justify-end gap-2'
            }, [
              h(NButton, {
                size: 'small',
                secondary: true,
                onClick: () => clearSessionLabelsFilter()
              }, { default: () => 'Clear' }),
              h(NButton, {
                size: 'small',
                type: 'primary',
                onClick: () => confirmSessionLabelsFilter()
              }, { default: () => 'Confirm' })
            ])
          ])
        })
      ])
    },
    width: '11%',
    ellipsis: true,
    render(row, index) {
      // Only show for DL Sessions
      if (activeTab.value !== 'dLSession') {
        return h('span', { style: { color: '#999' } }, '-')
      }
      
      const sessionLabels = (row as any).sessionLabels || []
      
      if (!Array.isArray(sessionLabels) || sessionLabels.length === 0) {
        return h('span', { style: { color: '#999', fontStyle: 'italic' } }, 'No labels')
      }
      
      // Extract session label data with colors
      const labelData = sessionLabels.map((sl: any) => {
        return {
          name: sl.sessionLabel?.name || sl.name || 'Unknown',
          color: sl.sessionLabel?.colorCode || sl.colorCode || 'rgb(200, 200, 200)'
        }
      })
      
      // Display as colored tags
      return h('div', {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'center'
        }
      }, labelData.map((label: any, idx: number) => {
        return h('span', {
          key: idx,
          style: {
            display: 'inline-block',
            padding: '2px 8px',
            backgroundColor: label.color,
            borderRadius: '4px',
            fontSize: '12px',
            color: '#333',
            fontWeight: '500'
          }
        }, label.name)
      }))
    },
  },
  {
    key: 'sessionStatus',
    title: () => {
      return h('div', { class: 'flex items-center justify-between w-full' }, [
        h('span', 'Session Status'),
        h(NPopover, {
          key: `filter-popover-sessionStatus-${sessionStatusFilter.value.length}`,
          trigger: 'click',
          show: sessionStatusFilterDropdownVisible.value,
          'onUpdate:show': (val: boolean) => {
            if (val) {
              openSessionStatusFilterDropdown()
            } else {
              closeSessionStatusFilterDropdown()
            }
          },
          placement: 'bottom-start',
          style: { padding: '0' }
        }, {
          trigger: () => {
            const isFilterActive = sessionStatusFilter.value.length > 0
            const iconColor = isFilterActive ? '#1890ff' : '#8c8c8c'
            return h(NIcon, {
              key: `filter-icon-sessionStatus-${isFilterActive ? 'active' : 'inactive'}-${sessionStatusFilter.value.length}`,
              size: '16',
              style: {
                cursor: 'pointer',
                color: iconColor,
                marginLeft: '4px',
                transition: 'color 0.2s ease'
              },
              class: isFilterActive ? 'filter-icon-active' : 'filter-icon-inactive',
              onClick: (e: Event) => {
                e.stopPropagation()
                openSessionStatusFilterDropdown()
              }
            }, {
              default: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: iconColor,
                style: { 
                  width: '16px', 
                  height: '16px',
                  color: iconColor
                }
              }, [
                h('path', {
                  d: 'M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z',
                  fill: iconColor
                })
              ])
            })
          },
          default: () => h('div', {
            class: 'filter-dropdown',
            style: {
              width: '240px',
              padding: '8px',
              backgroundColor: 'rgb(45 43 50 / 0%)'
            }
          }, [
            // Search input
            h(NInput, {
              value: sessionStatusFilterSearchQuery.value,
              'onUpdate:value': (val: string) => {
                sessionStatusFilterSearchQuery.value = val
              },
              placeholder: 'Search in filters',
              clearable: true,
              style: { marginBottom: '8px' }
            }, {
              prefix: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: 'currentColor',
                style: { width: '14px', height: '14px', color: '#8c8c8c' }
              }, [
                h('path', {
                  d: 'M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'
                })
              ])
            }),
            // Select all checkbox
            h('div', {
              style: {
                padding: '4px 0',
                marginBottom: '4px'
              }
            }, [
              h(NCheckbox, {
                checked: isSessionStatusSelectAllChecked(),
                indeterminate: isSessionStatusSelectAllIndeterminate(),
                'onUpdate:checked': () => {
                  toggleSessionStatusSelectAll()
                }
              }, {
                default: () => h('span', { style: { marginLeft: '8px', color: '#76BAF6' } }, `Select All - ${getFilteredSessionStatusOptions().length}`)
              })
            ]),
            // Checkbox list
            h('div', {
              class: 'filter-scroll-container',
              style: {
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '8px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }
            }, getFilteredSessionStatusOptions().map((option) => 
              h('div', {
                key: option.id,
                style: {
                  padding: '4px 0',
                  cursor: 'pointer'
                }
              }, [
                h(NCheckbox, {
                  checked: isSessionStatusOptionSelected(option.id),
                  'onUpdate:checked': () => toggleSessionStatusOption(option.id)
                }, {
                  default: () => h('span', { style: { marginLeft: '8px' } }, option.name)
                })
              ])
            )),
            // Buttons
            h(NDivider, { style: { margin: '8px 0' } }),
            h('div', {
              class: 'flex justify-end gap-2'
            }, [
              h(NButton, {
                size: 'small',
                secondary: true,
                onClick: () => clearSessionStatusFilter()
              }, { default: () => 'Clear' }),
              h(NButton, {
                size: 'small',
                type: 'primary',
                onClick: () => confirmSessionStatusFilter()
              }, { default: () => 'Confirm' })
            ])
          ])
        })
      ])
    },
    width: 150,
    ellipsis: true,
    align: 'center',
    render(row, index) {
      // Only show for DL Sessions
      if (activeTab.value !== 'dLSession') {
        return h('span', { style: { color: '#999', textAlign: 'center', display: 'block' } }, '-')
      }
      
      const sessionStatuses = (row as any).sessionStatusInDLSessions || []
      
      if (!Array.isArray(sessionStatuses) || sessionStatuses.length === 0) {
        return h('span', { style: { color: '#999', fontStyle: 'italic', textAlign: 'center', display: 'block' } }, 'No status')
      }
      
      // Find the active session status
      const activeStatus = sessionStatuses.find((ss: any) => ss.isActive === true)
      
      if (!activeStatus || !activeStatus.sessionStatus) {
        return h('span', { style: { color: '#999', fontStyle: 'italic', textAlign: 'center', display: 'block' } }, 'No status')
      }
      
      const statusData = {
        name: activeStatus.sessionStatus?.name || 'Unknown',
        color: activeStatus.sessionStatus?.colorCode || 'rgb(200, 200, 200)'
      }
      
      // Display as colored tag with fixed width and centered text
      return h('span', {
        style: {
          display: 'inline-block',
          width: '120px',
          padding: '2px 8px',
          backgroundColor: statusData.color,
          borderRadius: '4px',
          fontSize: '12px',
          color: '#333',
          fontWeight: '500',
          textAlign: 'center'
        }
      }, statusData.name)
    },
  },
  {
    key: 'actions',
    title: 'Actions',
    width: 280,
    render(row, index) {
      const lockStatus = getSessionLockStatus(row)
      const isLocked = lockStatus.isLocked && activeTab.value === 'dLSession'
      // Check if this session has a pending delete request (only for DL Sessions)
      const isDisabled = activeTab.value === 'dLSession' && hasPendingDeleteRequest(row.id)
      
      return h('div', {
        class: 'inline-flex items-center gap-2',
      }, [
        canUpdateSession.value ? 
        editedRow.value?.id !== row.id
          ? h(NButton, {
  strong: true,
  tertiary: false,
  size: 'small',
  disabled: isLocked || isDisabled,
  ...(!(isLocked || isDisabled) ? {
    onClick: async () => {
      // Double-check using current reactive values before proceeding
      const currentLockStatus = getSessionLockStatus(row)
      const currentIsLocked = currentLockStatus.isLocked && activeTab.value === 'dLSession'
      const currentIsDisabled = activeTab.value === 'dLSession' && hasPendingDeleteRequest(row.id)
      if (currentIsLocked || currentIsDisabled) return
      
      try {
      resetSessionModal();
      await fetchSessionData(row.id);
      // Fetch uploaded JSON files and check for pending images for this session
      if (activeTab.value === 'dLSession') {
        await Promise.all([
          fetchUploadedJsonFiles(row.id),
          checkPendingImages(row.id)
        ]);
      }
      showSubmit.value = false;
      
      if (singleDLSession.value.length > 0) {
        const selectedData = singleDLSession.value[0];
        
        selectedAssigneesCount.value = selectedData.users.filter((user) => user.userRole == 'ACTIVITY').length;
        const reviewerIds = selectedData.users
          .filter((user) => user.userRole == 'QUALITY_CONTROLLER')
          .map((user) => user.userId)
        selectedReviewersCount.value = calculateReviewerCount(reviewerIds)
        
        assigneesIndeterminate.value = selectedAssigneesCount.value == 0 ? 
          false : 
          userOptions.length == selectedAssigneesCount.value ? 
            false : 
            true;
        
        selectAllAssignees.value = selectedAssigneesCount.value == 0 ? 
          false : 
          '';
        
        reviewersIndeterminate.value = selectedReviewersCount.value == 0 ? 
          false : 
          userOptions.length == selectedReviewersCount.value ? 
            false : 
            true;
        
        selectAllReviewers.value = selectedReviewersCount.value == 0 ? 
          false : 
          '';
        
        await updateApprovedSelectOptions(
          selectedData.users
            .filter((user) => user.userRole == 'QUALITY_CONTROLLER')
            .map((e) => e.userId)
        );
      }
      
      // Capture initial form state after ALL data is loaded and processed
      // Use multiple nextTick calls to ensure all reactive updates are complete
      await nextTick();
      await nextTick();
      captureInitialFormState();
    } catch (error) {
      console.error('Error initializing edit form:', error);
    }
    }
  } : {})
}, { 
  default: () => 'Edit' 
})
          : [
              h(NButton,
                {
                  strong: true,
                  type: 'success',
                  size: 'small',
                  disabled: isDisabled,
                  onClick: () => updateRow(row),
                },
                { default: () => 'Submit' }),
              h(NButton,
                {
                  strong: true,
                  type: 'error',
                  size: 'small',
                  disabled: isDisabled,
                  onClick: () => {
                    data.value[index] = editedRow.value!
                    editedRow.value = null
                  },
                },
                { default: () => 'Cancel' }),
            ] : null,
            [
              h(NTooltip, {
                trigger: 'hover'
              }, {
                default: () => 'Duplicate',
                trigger: () => h(NIcon, {
                  size: '20', 
                  style: isDisabled ? 'margin-left: 5px;cursor: not-allowed; opacity: 0.5;' : 'margin-left: 5px;cursor: pointer',
                  onClick: () => {
                    if (!isDisabled) duplicateSession(row)
                  }
                }, [
                  h('svg', { viewBox: '0 0 512 512' }, [
                    h('path', {
                      d: "M395.88 80A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80z",
                      fill: "currentColor"
                    }),
                    h('path', {
                      d: "M408 112H184a72 72 0 0 0-72 72v224a72 72 0 0 0 72 72h224a72 72 0 0 0 72-72V184a72 72 0 0 0-72-72zm-32.45 200H312v63.55c0 8.61-6.62 16-15.23 16.43A16 16 0 0 1 280 376v-64h-63.55c-8.61 0-16-6.62-16.43-15.23A16 16 0 0 1 216 280h64v-63.55c0-8.61 6.62-16 15.23-16.43A16 16 0 0 1 312 216v64h64a16 16 0 0 1 16 16.77c-.42 8.61-7.84 15.23-16.45 15.23z",
                      fill: "currentColor"
                    }),
                  ]),
                ])
              })
            ],
        h(NButton,
          {
            strong: true,
            secondary: true,
            type: 'primary',
            size: 'small',
            disabled: isLocked || isDisabled,
            onClick: () => {
              let sessionPath = ''
              switch (activeTab.value) {
                case 'dLSession': {
                  sessionPath = `/data-labelling/${row.id}`
                  break
                }
                case 'cESession': {
                  sessionPath = `/clinical-evaluation/${row.id}`
                  break
                }
                // case 'rASession': {
                //   sessionPath = `/report-analysis/${row.id}`
                //   break
                // }
              }
              if (sessionPath) {
                router.push({
                  path: sessionPath,
                })
              }
            },
          },
          { default: () => 'Go' }),
          (() => {
            const { menuOptions, row: sessionRow } = getActionsMenuOptions(row);
            if (menuOptions.length === 0) return null;
            
            return h(NDropdown, {
              trigger: 'click',
              options: menuOptions,
              disabled: isDisabled,
              onSelect: async (key: string) => {
                if (isDisabled) return
                if (key === 'delete') {
                  isDeleteSession.value = sessionRow.id;
                  deleteSessionName.value = sessionRow.name || '';
                  deleteSessionReason.value = '';
                } else if (key === 'analysis') {
                  try {
                    isAnalysisSession.value = sessionRow.id ? sessionRow.id : '';
                    isAnalysingSession.value = !isAnalysingSession.value;
                    activesessionName.value = sessionRow.name ? sessionRow.name : '';
                    await analysisSession({});
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            }, {
              default: () => h(NButton, {
                strong: true,
                secondary: true,
                size: 'small',
                disabled: isDisabled,
                class: 'ellipsis-button',
                style: 'padding: 0 8px;'
              }, {
              default: () => h(NIcon, {
                size: '20',
                style: isDisabled ? 'cursor: not-allowed; opacity: 0.5;' : 'cursor: pointer;'
              }, {
                default: () => h('svg', { 
                  viewBox: '0 0 24 24', 
                  fill: 'currentColor', 
                  width: '20', 
                  height: '20',
                  style: 'display: block;'
                }, [
                  h('circle', { cx: '12', cy: '5', r: '1.5' }),
                  h('circle', { cx: '12', cy: '12', r: '1.5' }),
                  h('circle', { cx: '12', cy: '19', r: '1.5' })
                ])
              })
              })
            })
          })(),
          // Lock/Unlock Icon - Permission-based visibility and interaction
          // REQUIREMENTS:
          // - Only users with Lock permission see enabled icons
          // - Users without Lock permission: No icon (unless session is locked, then disabled Lock icon, no tooltip)
          // - Tooltips only visible to users with Lock permission
          (() => {
            // Step 1: Only show for DL Sessions
            if (activeTab.value !== 'dLSession') {
              return null
            }
            
            // Step 2: Get lock history - source of truth for lock state
            const lockHistory = (row as any).dLSessionLockHistory?.[0]
            const isLocked = lockHistory?.isLocked ?? false
            const lockReason = lockHistory?.lockReason
            const unlockReason = lockHistory?.unlockReason
            
            // Step 3: Check session status - support "completed" and "re-opened"/"re-open"
            const sessionStatuses = (row as any).sessionStatusInDLSessions || []
            const activeStatus = sessionStatuses.find((ss: any) => ss.isActive === true)
            const statusName = activeStatus?.sessionStatus?.name?.toLowerCase() || ''
            const isCompleted = statusName === 'completed'
            const isReOpened = statusName === 're-opened' || statusName === 're-open'
            
            // Step 4: Only show icon for completed or re-opened sessions
            if (!isCompleted && !isReOpened) {
              return null
            }
            
            // Step 5: Check Lock permission (required for enabled icons and tooltips)
            const hasLockPermission = defineAbilitiesFor(Module.Session, Action.Lock)
            
            // Step 6: Permission-based visibility logic
            // - Users WITH Lock permission: See enabled icons for all states
            // - Users WITHOUT Lock permission: Only see disabled Lock icon if session is locked (read-only)
            const showEnabledIcon = hasLockPermission && isCompleted
            const showDisabledLockIcon = !hasLockPermission && isCompleted && isLocked  // Exception: locked session, read-only
            
            // Step 7: Determine icon states
            // - Completed + not locked + has permission: Show unlock icon (enabled) -> clicking locks
            // - Completed + locked + has permission: Show lock icon (enabled) -> clicking unlocks
            // - Re-opened + has permission: Show unlock icon (disabled)
            // - Completed + locked + no permission: Show lock icon (disabled, read-only)
            const showUnlockIconVisual = isCompleted && !isLocked && showEnabledIcon
            const showLockIconVisual = isCompleted && isLocked && (showEnabledIcon || showDisabledLockIcon)
            const showReOpenedUnlockIcon = isReOpened && hasLockPermission
            
            // Step 8: Don't show icon if no permission and session is not locked
            if (!showUnlockIconVisual && !showLockIconVisual && !showReOpenedUnlockIcon) {
              return null
            }
            
            // Step 9: Icon SVG definitions
            const unlockIconSvg = h('svg', { 
              viewBox: '0 0 24 24', 
              fill: 'currentColor', 
              width: '20', 
              height: '20' 
            }, [
              h('path', { 
                d: 'M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-5h-1V6c0-2.76-2.24-5-5-5-2.76 0-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6z' 
              })
            ])
            
            const lockIconSvg = h('svg', { 
              viewBox: '0 0 24 24', 
              fill: 'currentColor', 
              width: '20', 
              height: '20' 
            }, [
              h('path', { 
                d: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' 
              })
            ])
            
            // Step 10: Determine which icon to show and its state
            const currentIconSvg = showReOpenedUnlockIcon ? unlockIconSvg : (showUnlockIconVisual ? unlockIconSvg : lockIconSvg)
            const isEnabled = showReOpenedUnlockIcon ? false : (showUnlockIconVisual || (showLockIconVisual && showEnabledIcon))
            const actionType = showReOpenedUnlockIcon ? null : (showUnlockIconVisual ? 'lock' : 'unlock')
            
            // Step 11: Tooltip logic - ONLY for users with Lock permission
            // - Show reason if exists and user has Lock permission
            // - No tooltip for users without Lock permission (even if reason exists)
            let currentReason: string | null = null
            let currentState: string = ''
            
            if (hasLockPermission) {
              // Only show tooltip if user has Lock permission
              if (showReOpenedUnlockIcon) {
                currentReason = unlockReason
                currentState = 'unlocked'
              } else if (showUnlockIconVisual) {
                currentReason = unlockReason
                currentState = 'unlocked'
              } else if (showLockIconVisual) {
                currentReason = lockReason
                currentState = 'locked'
              }
            }
            // If no Lock permission, currentReason stays null (no tooltip)
            
            // Step 12: Tooltip text - only if reason exists AND user has permission
            const tooltipText = (currentReason && hasLockPermission)
              ? `Session is ${currentState}. Reason: ${currentReason}`
              : null
            const showTooltip = !!tooltipText
            
            // Step 13: Create icon element
            const iconElement = h(NIcon, {
              size: '20',
              style: {
                cursor: isEnabled ? 'pointer' : 'not-allowed',
                color: isEnabled ? '#51CF66' : '#999',
                opacity: isEnabled ? 1 : 0.5,
                marginLeft: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle'
              },
              onClick: () => {
                // Step 14: Only allow click for enabled icons (users with Lock permission)
                if (isEnabled && !showReOpenedUnlockIcon) {
                  lockUnlockSessionId.value = row.id
                  lockUnlockAction.value = showUnlockIconVisual ? 'lock' : 'unlock'
                  lockUnlockReason.value = ''
                  lockUnlockReasonError.value = ''
                  lockUnlockReasonTouched.value = false
                  showLockUnlockModal.value = true
                }
              }
            }, {
              default: () => currentIconSvg
            })
            
            // Step 15: Wrap with tooltip only if user has Lock permission and reason exists
            if (showTooltip && hasLockPermission) {
              return h(NTooltip, {
                trigger: 'hover',
                placement: 'top',
                style: {
                  backgroundColor: '#666',
                  color: '#FFD700',
                  border: '1px solid #fff',
                  padding: '8px',
                  borderRadius: '4px'
                }
              }, {
                default: () => tooltipText,
                trigger: () => iconElement
              })
            }
            
            return iconElement
          })(),
      ])
    },
  },
])

const analyseColumns = computed<DataTableColumns<any>>(() => {
  // Explicitly track analysisFilters to ensure reactivity
  // Access the reactive values to establish dependency tracking
  const _nameFilterLength = analysisFilters.value.name.length
  const _countFilterLength = analysisFilters.value.extractedresourcecount.length
  return [
  {
    key: 'name',
    title: () => {
      const columnTitle = analysisActiveTab.value === 'label' ? 'Label Name' : analysisActiveTab.value === 'status' ? 'Status Name' : 'Annotation Name'
      return h('div', { class: 'flex items-center justify-between w-full' }, [
        h('span', columnTitle),
        h(NPopover, {
          key: `filter-popover-name-${_nameFilterLength}`,
          trigger: 'click',
          show: filterDropdownVisible.value.name,
          'onUpdate:show': (val: boolean) => {
            if (val) {
              openFilterDropdown('name')
            } else {
              closeFilterDropdown('name')
            }
          },
          placement: 'bottom-start',
          style: { padding: '0' }
        }, {
          trigger: () => {
            // Access reactive value directly inside trigger for real-time updates
            const isFilterActive = analysisFilters.value.name.length > 0
            const iconColor = isFilterActive ? '#1890ff' : '#8c8c8c'
            return h(NIcon, {
              key: `filter-icon-name-${isFilterActive ? 'active' : 'inactive'}-${analysisFilters.value.name.length}`,
              size: '16',
              style: {
                cursor: 'pointer',
                color: iconColor,
                marginLeft: '4px',
                transition: 'color 0.2s ease'
              },
              class: isFilterActive ? 'filter-icon-active' : 'filter-icon-inactive',
              onClick: (e: Event) => {
                e.stopPropagation()
                openFilterDropdown('name')
              }
            }, {
              default: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: iconColor,
                style: { 
                  width: '16px', 
                  height: '16px',
                  color: iconColor
                }
              }, [
                h('path', {
                  d: 'M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z',
                  fill: iconColor
                })
              ])
            })
          },
          default: () => h('div', {
            class: 'filter-dropdown',
            style: {
              width: '240px',
              padding: '8px',
              backgroundColor: 'rgb(45 43 50 / 0%)'
            }
          }, [
            // Search input
            h(NInput, {
              value: filterSearchQueries.value.name,
              'onUpdate:value': (val: string) => {
                filterSearchQueries.value.name = val
              },
              placeholder: 'Search in filters',
              clearable: true,
              style: { marginBottom: '8px' }
            }, {
              prefix: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: 'currentColor',
                style: { width: '14px', height: '14px', color: '#8c8c8c' }
              }, [
                h('path', {
                  d: 'M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'
                })
              ])
            }),
                    // Select all checkbox
                    h('div', {
                      style: {
                        padding: '4px 0',
                        marginBottom: '4px'
                      }
                    }, [
                      h(NCheckbox, {
                        checked: isSelectAllChecked('name'),
                        indeterminate: isSelectAllIndeterminate('name'),
                        'onUpdate:checked': () => {
                          // Best practice: When indeterminate (showing "-"), clicking should SELECT all
                          // When all selected, clicking should DESELECT all
                          // toggleSelectAll handles this logic correctly
                          toggleSelectAll('name')
                        }
                      }, {
                        default: () => h('span', { style: { marginLeft: '8px', color: '#76BAF6' } }, `Select All - ${getFilteredOptions('name').length}`)
                      })
                    ]),
            // Checkbox list
            h('div', {
              class: 'filter-scroll-container',
              style: {
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '8px',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none' /* IE and Edge */
              }
            }, getFilteredOptions('name').map((option) => 
              h('div', {
                key: option,
                style: {
                  padding: '4px 0',
                  cursor: 'pointer'
                },
                        // Only the checkbox will toggle selection to avoid double-toggle
              }, [
                h(NCheckbox, {
                  checked: isFilterOptionSelected('name', option),
                  'onUpdate:checked': () => toggleFilterOption('name', option)
                }, {
                  default: () => h('span', { style: { marginLeft: '8px' } }, option)
                })
              ])
            )),
            // Buttons
            h(NDivider, { style: { margin: '8px 0' } }),
            h('div', {
              class: 'flex justify-end gap-2'
            }, [
              h(NButton, {
                size: 'small',
                secondary: true,
                onClick: () => clearFilter('name')
              }, { default: () => 'Clear' }),
              h(NButton, {
                size: 'small',
                type: 'primary',
                onClick: () => confirmFilter('name')
              }, { default: () => 'Confirm' })
            ])
          ])
        })
      ])
    },
    width: '40%',
    sorter: true,
    ellipsis: false,
    sortOrder: analyseSortKeyMapOrder.value.name || false,
    render: (row: any) => {
      if (Array.isArray(row.name)) {
        return row.name.join(', ');
      }
      return row.name || '';
    },
  },
  {
    key: 'extractedresourcecount',
    title: () => {
      return h('div', { class: 'flex items-center justify-between w-full' }, [
        h('span', 'Count'),
        h(NPopover, {
          key: `filter-popover-count-${_countFilterLength}`,
          trigger: 'click',
          show: filterDropdownVisible.value.extractedresourcecount,
          'onUpdate:show': (val: boolean) => {
            if (val) {
              openFilterDropdown('extractedresourcecount')
            } else {
              closeFilterDropdown('extractedresourcecount')
            }
          },
          placement: 'bottom-start',
          style: { padding: '0' }
        }, {
          trigger: () => {
            // Access reactive value directly inside trigger for real-time updates
            const isFilterActive = analysisFilters.value.extractedresourcecount.length > 0
            const iconColor = isFilterActive ? '#1890ff' : '#8c8c8c'
            return h(NIcon, {
              key: `filter-icon-count-${isFilterActive ? 'active' : 'inactive'}-${analysisFilters.value.extractedresourcecount.length}`,
              size: '16',
              style: {
                cursor: 'pointer',
                color: iconColor,
                marginLeft: '4px',
                transition: 'color 0.2s ease'
              },
              class: isFilterActive ? 'filter-icon-active' : 'filter-icon-inactive',
              onClick: (e: Event) => {
                e.stopPropagation()
                openFilterDropdown('extractedresourcecount')
              }
            }, {
              default: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: iconColor,
                style: { 
                  width: '16px', 
                  height: '16px',
                  color: iconColor
                }
              }, [
                h('path', {
                  d: 'M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z',
                  fill: iconColor
                })
              ])
            })
          },
          default: () => h('div', {
            class: 'filter-dropdown',
            style: {
              width: '240px',
              padding: '8px',
              backgroundColor: 'rgb(45 43 50 / 0%)'
            }
          }, [
            // Search input
            h(NInput, {
              value: filterSearchQueries.value.extractedresourcecount,
              'onUpdate:value': (val: string) => {
                filterSearchQueries.value.extractedresourcecount = val
              },
              placeholder: 'Search in filters',
              clearable: true,
              style: { marginBottom: '8px' }
            }, {
              prefix: () => h('svg', {
                viewBox: '0 0 1024 1024',
                fill: 'currentColor',
                style: { width: '14px', height: '14px', color: '#8c8c8c' }
              }, [
                h('path', {
                  d: 'M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'
                })
              ])
            }),
                    // Select all checkbox
                    h('div', {
                      style: {
                        padding: '4px 0',
                        marginBottom: '4px'
                      }
                    }, [
                      h(NCheckbox, {
                        checked: isSelectAllChecked('extractedresourcecount'),
                        indeterminate: isSelectAllIndeterminate('extractedresourcecount'),
                        'onUpdate:checked': () => {
                          toggleSelectAll('extractedresourcecount')
                        }
                      }, {
                        default: () => h('span', { style: { marginLeft: '8px',  color: '#76BAF6' } }, `Select All - ${getFilteredOptions('extractedresourcecount').length}`)
                      })
                    ]),
            // Checkbox list
            h('div', {
              class: 'filter-scroll-container',
              style: {
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '8px',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none' /* IE and Edge */
              }
            }, getFilteredOptions('extractedresourcecount').map((option) => 
              h('div', {
                key: option,
                style: {
                  padding: '4px 0',
                  cursor: 'pointer'
                },
                        // Only the checkbox will toggle selection to avoid double-toggle
              }, [
                h(NCheckbox, {
                  checked: isFilterOptionSelected('extractedresourcecount', option),
                  'onUpdate:checked': () => toggleFilterOption('extractedresourcecount', option)
                }, {
                  default: () => h('span', { style: { marginLeft: '8px' } }, option)
                })
              ])
            )),
            // Buttons
            h(NDivider, { style: { margin: '8px 0' } }),
            h('div', {
              class: 'flex justify-end gap-2'
            }, [
              h(NButton, {
                size: 'small',
                secondary: true,
                onClick: () => clearFilter('extractedresourcecount')
              }, { default: () => 'Clear' }),
              h(NButton, {
                size: 'small',
                type: 'primary',
                onClick: () => confirmFilter('extractedresourcecount')
              }, { default: () => 'Confirm' })
            ])
          ])
        })
      ])
    },
    width: '40%',
    sorter: true,
    sortOrder: analyseSortKeyMapOrder.value.extractedresourcecount || false,
    render: (row: any) => { 
      return row.extractedresourcecount || 0;
    },
  },
  ]
})

// Computed key to force DataTable re-render when filters change
const analysisTableKey = computed(() => {
  return `analysis-table-${analysisFilters.value.name.length}-${analysisFilters.value.extractedresourcecount.length}-${analysisActiveTab.value}`
})

const analysisPagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  onChange: async (page: number) => {
    analysisPagination.page = page
    await analysisSession({})
  },
  onUpdatePageSize: async (pageSize: number) => {
    analysisPagination.pageSize = pageSize
    analysisPagination.page = 1
    await analysisSession({})
  },
})

const analysisSortStates = ref<DataTableSortState[]>([
  {
    columnKey: 'name',
    sorter: true,
    order: 'ascend',
  }
])

const analyseSortKeyMapOrder = computed(() => {
  const result: Record<string, 'descend' | 'ascend' | false> = {
    name: false,
    extractedresourcecount: false
  };
  
  analysisSortStates.value.forEach(({ columnKey, order }) => {
    result[columnKey] = order;
  });
  
  return result;
});

async function handleAnalyseSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (analysisLoading.value) return;

  // Convert single sorter to array for consistent handling  
  const sorterArray = Array.isArray(sorters) ? sorters : sorters ? [sorters] : [];

  if (sorterArray.length === 0) {
    // Default to name ascending if no sorters
    analysisSortStates.value = [{
      columnKey: 'name',
      sorter: true,
      order: 'ascend'
    }];
  } else {
    const newSorter = sorterArray[0];
    const currentState = analysisSortStates.value[0];

    // Toggle between ascend and descend only
    if (currentState && currentState.columnKey === newSorter.columnKey) {
      // If same column, just toggle the order
      analysisSortStates.value = [{
        columnKey: currentState.columnKey,
        sorter: true,
        order: currentState.order === 'ascend' ? 'descend' : 'ascend'
      }];
    } else {
      // New column selected, start with ascending
      analysisSortStates.value = [{
        columnKey: newSorter.columnKey,
        sorter: true,
        order: 'ascend'
      }];
    }
  }
  await analysisSession({});
}

function openCloseAnalysisModal() {
  if (!isAnalysingSession.value) {
    isAnalysisSession.value = ''
    activesessionName.value = ''
    isTabChanging.value = false
    filterOptionsCache.value.clear()
    filterOptionsCacheTimestamp.value.clear()
  }
  analysisActiveTab.value = 'label'
  analysisSortStates.value = [{ columnKey: 'name', sorter: true, order: 'ascend' }]
  // Reset all filter related state
  const filterDefaults = { name: [], extractedresourcecount: [] }
  const filterTextDefaults = { name: '', extractedresourcecount: '' }
  const filterBoolDefaults = { name: false, extractedresourcecount: false }
  filterOptions.value = { ...filterDefaults }
  analysisFilters.value = { ...filterDefaults }
  filterSearchQueries.value = { ...filterTextDefaults }
  tempFilterSelections.value = { ...filterDefaults }
  filterDropdownVisible.value = { ...filterBoolDefaults }
  analysisPagination.page = 1
}

function updateFilterOptions(data: any[]) {
  // Defensive: always initialize clean
  filterOptions.value = { name: [], extractedresourcecount: [] }
  if (!Array.isArray(data) || data.length === 0) return

  const nameSet = new Set<string>()
  const countSet = new Set<string>()
  for (const item of data) {
    if (!item) continue
    const name = Array.isArray(item.name) ? item.name.join(', ') : (item.name || '')
    if (name.trim()) nameSet.add(name.trim())

    let count = item.extractedresourcecount ?? item.extractedResourceCount ?? '0'
    if (count !== null && count !== undefined) {
      countSet.add(String(count))
    }
  }
  filterOptions.value.name = Array.from(nameSet).sort()
  filterOptions.value.extractedresourcecount = Array.from(countSet).sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0))
}

async function fetchAllFilterOptions(forceRefresh = false) {
  if (!isAnalysisSession.value) {
    filterOptions.value = { name: [], extractedresourcecount: [] }
    return
  }

  const cacheKey = `${analysisActiveTab.value}-${isAnalysisSession.value}`
  const cachedData = filterOptionsCache.value.get(cacheKey)
  const cacheTimestamp = filterOptionsCacheTimestamp.value.get(cacheKey) || 0
  const now = Date.now()

  if (!forceRefresh && cachedData && (now - cacheTimestamp) < FILTER_OPTIONS_CACHE_TTL) {
    filterOptions.value = cachedData
    return
  }

  const endpointMap = {
    label: 'labelsAnalyseData',
    status: 'statusAnalyseData',
    annotation: 'annotationAnalyseData'
  }
  const endpoint = endpointMap[analysisActiveTab.value as keyof typeof endpointMap] || 'labelsAnalyseData'

  try {
    const response = await ($client[activeTab.value] as any)[endpoint].query({
      limit: 1,
      offset: 0,
      sort: [{ name: 'asc' }],
      filter: {
        projectId: route.params.id != null ? route.params.id.toString() : '',
        dLSessionId: isAnalysisSession.value ? isAnalysisSession.value : '',
      },
    })

    if (response && response.filterOptions) {
      const options = {
        name: Array.isArray(response.filterOptions.name) ? response.filterOptions.name : [],
        extractedresourcecount: Array.isArray(response.filterOptions.extractedresourcecount) 
          ? response.filterOptions.extractedresourcecount 
          : []
      }
      
      filterOptionsCache.value.set(cacheKey, options)
      filterOptionsCacheTimestamp.value.set(cacheKey, now)
      
      filterOptions.value = options
    } else {
      const emptyOptions = { name: [], extractedresourcecount: [] }
      filterOptionsCache.value.set(cacheKey, emptyOptions)
      filterOptionsCacheTimestamp.value.set(cacheKey, now)
      filterOptions.value = emptyOptions
    }
  } catch (error: any) {
    console.error('Error fetching all filter options:', error)
    if (cachedData) {
      filterOptions.value = cachedData
    } else {
      filterOptions.value = { name: [], extractedresourcecount: [] }
    }
  }
}

async function openFilterDropdown(columnKey: 'name' | 'extractedresourcecount') {
  filterDropdownVisible.value[columnKey] = true
  tempFilterSelections.value[columnKey] = [...analysisFilters.value[columnKey]]
  await fetchAllFilterOptions()
}

function closeFilterDropdown(columnKey: 'name' | 'extractedresourcecount') {
  filterDropdownVisible.value[columnKey] = false
  tempFilterSelections.value[columnKey] = [...analysisFilters.value[columnKey]]
  filterSearchQueries.value[columnKey] = ''
}

async function confirmFilter(columnKey: 'name' | 'extractedresourcecount') {
  try {
    const filterCount = tempFilterSelections.value[columnKey].length
    analysisFilters.value[columnKey] = [...tempFilterSelections.value[columnKey]]
    filterDropdownVisible.value[columnKey] = false
    filterSearchQueries.value[columnKey] = ''
    analysisPagination.page = 1
    await analysisSession({})
  } catch (error: any) {
    console.error('Error confirming filter:', error)
    notification.error({
      title: 'Error',
      content: 'Failed to apply filter',
      duration: 3000,
      closable: true,
    })
  }
}

function clearFilter(columnKey: 'name' | 'extractedresourcecount') {
  tempFilterSelections.value[columnKey] = []
  filterSearchQueries.value[columnKey] = ''
}

async function resetFilter(columnKey: 'name' | 'extractedresourcecount') {
  try {
    analysisFilters.value[columnKey] = []
    tempFilterSelections.value[columnKey] = []
    filterSearchQueries.value[columnKey] = ''
    filterDropdownVisible.value[columnKey] = false
    analysisPagination.page = 1
    await analysisSession({})
  } catch (error: any) {
    console.error('Error resetting filter:', error)
    notification.error({
      title: 'Error',
      content: 'Failed to reset filter',
      duration: 3000,
      closable: true,
    })
  }
}

function getFilteredOptions(columnKey: 'name' | 'extractedresourcecount'): string[] {
  const search = filterSearchQueries.value[columnKey].toLowerCase().trim()
  const options = filterOptions.value[columnKey] || []
  
  if (!search) {
    return options
  }
  
  if (!Array.isArray(options) || options.length === 0) {
    return []
  }

  const MAX_FILTER_RESULTS = 1000
  const filtered: string[] = []
  
  for (let i = 0; i < options.length && filtered.length < MAX_FILTER_RESULTS; i++) {
    const option = options[i]
    if (option && typeof option === 'string' && option.toLowerCase().includes(search)) {
      filtered.push(option)
    }
  }
  
  return filtered
}

function isSelectAllChecked(columnKey: 'name' | 'extractedresourcecount'): boolean {
  const options = getFilteredOptions(columnKey)
  if (!options.length) return false
  const selections = tempFilterSelections.value[columnKey]
  return options.every(option => selections.includes(option))
}

function isSelectAllIndeterminate(columnKey: 'name' | 'extractedresourcecount'): boolean {
  const options = getFilteredOptions(columnKey)
  if (!options.length) return false
  const selections = tempFilterSelections.value[columnKey]
  const selectedCount = options.filter(option => selections.includes(option)).length
  return selectedCount > 0 && selectedCount < options.length
}


function toggleSelectAll(columnKey: 'name' | 'extractedresourcecount') {
  const options = getFilteredOptions(columnKey)
  if (!options.length) return
  
  const currentSelections = new Set(tempFilterSelections.value[columnKey])
  const allFilteredSelected = options.every(opt => currentSelections.has(opt))
  const someFilteredSelected = options.some(opt => currentSelections.has(opt))
  
  const isIndeterminate = someFilteredSelected && !allFilteredSelected
  
  if (allFilteredSelected) {
    options.forEach(opt => currentSelections.delete(opt))
  } else {
    options.forEach(opt => currentSelections.add(opt))
  }
  
  tempFilterSelections.value[columnKey] = Array.from(currentSelections)
}

function toggleFilterOption(columnKey: 'name' | 'extractedresourcecount', value: string) {
  const arr = tempFilterSelections.value[columnKey]
  const idx = arr.indexOf(value)
  if (idx > -1) arr.splice(idx, 1)
  else arr.push(value)
}

function isFilterOptionSelected(columnKey: 'name' | 'extractedresourcecount', value: string): boolean {
  return tempFilterSelections.value[columnKey].includes(value)
}

function hasActiveFilter(columnKey: 'name' | 'extractedresourcecount'): boolean {
  const isActive = analysisFilters.value[columnKey].length > 0
  return isActive
}

// Session Labels Filter Functions
async function openSessionLabelsFilterDropdown() {
  sessionLabelsFilterDropdownVisible.value = true
  tempSessionLabelsSelections.value = [...sessionLabelsFilter.value]
  await fetchSessionLabelsFilterOptions()
}

function closeSessionLabelsFilterDropdown() {
  sessionLabelsFilterDropdownVisible.value = false
  tempSessionLabelsSelections.value = [...sessionLabelsFilter.value]
  sessionLabelsFilterSearchQuery.value = ''
}

async function confirmSessionLabelsFilter() {
  try {
    sessionLabelsFilter.value = [...tempSessionLabelsSelections.value]
    sessionLabelsFilterDropdownVisible.value = false
    sessionLabelsFilterSearchQuery.value = ''
    pagination.page = 1
    await fetchSessions({})
  } catch (error: any) {
    console.error('Error confirming session labels filter:', error)
    notification.error({
      title: 'Error',
      content: 'Failed to apply filter',
      duration: 3000,
      closable: true,
    })
  }
}

function clearSessionLabelsFilter() {
  tempSessionLabelsSelections.value = []
  sessionLabelsFilterSearchQuery.value = ''
}

async function resetSessionLabelsFilter() {
  try {
    sessionLabelsFilter.value = []
    tempSessionLabelsSelections.value = []
    sessionLabelsFilterSearchQuery.value = ''
    sessionLabelsFilterDropdownVisible.value = false
    pagination.page = 1
    await fetchSessions({})
  } catch (error: any) {
    console.error('Error resetting session labels filter:', error)
    notification.error({
      title: 'Error',
      content: 'Failed to reset filter',
      duration: 3000,
      closable: true,
    })
  }
}

function getFilteredSessionLabelsOptions(): Array<{ id: string; name: string }> {
  const search = sessionLabelsFilterSearchQuery.value.toLowerCase().trim()
  const options = sessionLabelsFilterOptions.value || []
  
  if (!search) {
    return options
  }
  
  if (!Array.isArray(options) || options.length === 0) {
    return []
  }

  return options.filter(option => 
    option && option.name && 
    option.name.toLowerCase().includes(search)
  )
}

function isSessionLabelSelectAllChecked(): boolean {
  const options = getFilteredSessionLabelsOptions()
  if (!options.length) return false
  const selections = tempSessionLabelsSelections.value
  return options.every(option => selections.includes(option.id))
}

function isSessionLabelSelectAllIndeterminate(): boolean {
  const options = getFilteredSessionLabelsOptions()
  if (!options.length) return false
  const selections = tempSessionLabelsSelections.value
  const selectedCount = options.filter(option => selections.includes(option.id)).length
  return selectedCount > 0 && selectedCount < options.length
}

function toggleSessionLabelSelectAll() {
  const options = getFilteredSessionLabelsOptions()
  if (!options.length) return
  
  const currentSelections = new Set(tempSessionLabelsSelections.value)
  const allFilteredSelected = options.every(opt => currentSelections.has(opt.id))
  
  if (allFilteredSelected) {
    options.forEach(opt => currentSelections.delete(opt.id))
  } else {
    options.forEach(opt => currentSelections.add(opt.id))
  }
  
  tempSessionLabelsSelections.value = Array.from(currentSelections)
}

function toggleSessionLabelOption(labelId: string) {
  const arr = tempSessionLabelsSelections.value
  const idx = arr.indexOf(labelId)
  if (idx > -1) arr.splice(idx, 1)
  else arr.push(labelId)
}

function isSessionLabelOptionSelected(labelId: string): boolean {
  return tempSessionLabelsSelections.value.includes(labelId)
}

/**
 * Extract unique session labels from the current project's sessions
 * Only shows labels that are actually used in the project's sessions
 * Always uses originalUnfilteredData to ensure all options remain available even when filters are applied
 * @param sessionsData - Optional array of sessions to extract from. If not provided, uses originalUnfilteredData.value
 */
function fetchSessionLabelsFilterOptions(sessionsData?: any[]) {
  try {
    // Extract unique session labels from loaded sessions data
    // IMPORTANT: Use originalUnfilteredData to ensure all options remain visible even when filters are applied
    const labelMap = new Map<string, { id: string; name: string }>()
    const sourceData = sessionsData || originalUnfilteredData.value
    
    if (Array.isArray(sourceData) && sourceData.length > 0) {
      sourceData.forEach((session: any) => {
        const sessionLabels = session.sessionLabels || []
        if (Array.isArray(sessionLabels) && sessionLabels.length > 0) {
          sessionLabels.forEach((sl: any) => {
            const labelId = sl.sessionLabel?.id || sl.sessionLabelId || sl.id
            const labelName = sl.sessionLabel?.name || sl.name
            
            if (labelId && labelName && !labelMap.has(labelId)) {
              labelMap.set(labelId, {
                id: labelId,
                name: labelName
              })
            }
          })
        }
      })
    }
    
    // Convert map to array and sort by name
    sessionLabelsFilterOptions.value = Array.from(labelMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
    
  } catch (error) {
    console.error('Error extracting session labels filter options:', error)
    sessionLabelsFilterOptions.value = []
  }
}

/**
 * Alias for backward compatibility - extracts from response.data (all sessions before filtering)
 */
function fetchSessionLabelsFilterOptionsFromData(sessionsData: any[]) {
  fetchSessionLabelsFilterOptions(sessionsData)
}

// Session Status Filter Functions
async function openSessionStatusFilterDropdown() {
  sessionStatusFilterDropdownVisible.value = true
  tempSessionStatusSelections.value = [...sessionStatusFilter.value]
  fetchSessionStatusFilterOptions()
}

function closeSessionStatusFilterDropdown() {
  sessionStatusFilterDropdownVisible.value = false
  tempSessionStatusSelections.value = [...sessionStatusFilter.value]
  sessionStatusFilterSearchQuery.value = ''
}

async function confirmSessionStatusFilter() {
  try {
    sessionStatusFilter.value = [...tempSessionStatusSelections.value]
    sessionStatusFilterDropdownVisible.value = false
    sessionStatusFilterSearchQuery.value = ''
    pagination.page = 1
    await fetchSessions({})
  } catch (error: any) {
    console.error('Error confirming session status filter:', error)
    notification.error({
      title: 'Error',
      content: 'Failed to apply filter',
      duration: 3000,
      closable: true,
    })
  }
}

function clearSessionStatusFilter() {
  tempSessionStatusSelections.value = []
  sessionStatusFilterSearchQuery.value = ''
}

async function resetSessionStatusFilter() {
  try {
    sessionStatusFilter.value = []
    tempSessionStatusSelections.value = []
    sessionStatusFilterSearchQuery.value = ''
    sessionStatusFilterDropdownVisible.value = false
    pagination.page = 1
    await fetchSessions({})
  } catch (error: any) {
    console.error('Error resetting session status filter:', error)
    notification.error({
      title: 'Error',
      content: 'Failed to reset filter',
      duration: 3000,
      closable: true,
    })
  }
}

function getFilteredSessionStatusOptions(): Array<{ id: string; name: string }> {
  const search = sessionStatusFilterSearchQuery.value.toLowerCase().trim()
  const options = sessionStatusFilterOptions.value || []
  
  if (!search) {
    return options
  }
  
  if (!Array.isArray(options) || options.length === 0) {
    return []
  }

  return options.filter(option => 
    option && option.name && 
    option.name.toLowerCase().includes(search)
  )
}

function isSessionStatusSelectAllChecked(): boolean {
  const options = getFilteredSessionStatusOptions()
  if (!options.length) return false
  const selections = tempSessionStatusSelections.value
  return options.every(option => selections.includes(option.id))
}

function isSessionStatusSelectAllIndeterminate(): boolean {
  const options = getFilteredSessionStatusOptions()
  if (!options.length) return false
  const selections = tempSessionStatusSelections.value
  const selectedCount = options.filter(option => selections.includes(option.id)).length
  return selectedCount > 0 && selectedCount < options.length
}

function toggleSessionStatusSelectAll() {
  const options = getFilteredSessionStatusOptions()
  if (!options.length) return
  
  const currentSelections = new Set(tempSessionStatusSelections.value)
  const allFilteredSelected = options.every(opt => currentSelections.has(opt.id))
  
  if (allFilteredSelected) {
    options.forEach(opt => currentSelections.delete(opt.id))
  } else {
    options.forEach(opt => currentSelections.add(opt.id))
  }
  
  tempSessionStatusSelections.value = Array.from(currentSelections)
}

function toggleSessionStatusOption(statusId: string) {
  const arr = tempSessionStatusSelections.value
  const idx = arr.indexOf(statusId)
  if (idx > -1) arr.splice(idx, 1)
  else arr.push(statusId)
}

function isSessionStatusOptionSelected(statusId: string): boolean {
  return tempSessionStatusSelections.value.includes(statusId)
}

/**
 * Extract unique session statuses from the current project's sessions
 * Only shows statuses that are actually used in the project's sessions
 * Always uses originalUnfilteredData to ensure all options remain available even when filters are applied
 * @param sessionsData - Optional array of sessions to extract from. If not provided, uses originalUnfilteredData.value
 */
function fetchSessionStatusFilterOptions(sessionsData?: any[]) {
  try {
    // Extract unique session statuses from loaded sessions data
    // IMPORTANT: Use originalUnfilteredData to ensure all options remain visible even when filters are applied
    const statusMap = new Map<string, { id: string; name: string }>()
    const sourceData = sessionsData || originalUnfilteredData.value
    
    if (Array.isArray(sourceData) && sourceData.length > 0) {
      sourceData.forEach((session: any) => {
        const sessionStatuses = session.sessionStatusInDLSessions || []
        if (Array.isArray(sessionStatuses) && sessionStatuses.length > 0) {
          // Find the active session status
          const activeStatus = sessionStatuses.find((ss: any) => ss.isActive === true)
          
          if (activeStatus && activeStatus.sessionStatus) {
            const statusId = activeStatus.sessionStatus?.id || activeStatus.sessionStatusId
            const statusName = activeStatus.sessionStatus?.name
            
            if (statusId && statusName && !statusMap.has(statusId)) {
              statusMap.set(statusId, {
                id: statusId,
                name: statusName
              })
            }
          }
        }
      })
    }
    
    // Convert map to array and sort by name
    sessionStatusFilterOptions.value = Array.from(statusMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
    
  } catch (error) {
    console.error('Error extracting session status filter options:', error)
    sessionStatusFilterOptions.value = []
  }
}

/**
 * Alias for backward compatibility - extracts from response.data (all sessions before filtering)
 */
function fetchSessionStatusFilterOptionsFromData(sessionsData: any[]) {
  fetchSessionStatusFilterOptions(sessionsData)
}

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  onChange: async (page: number) => {
    pagination.page = page
    await fetchSessions({})
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchSessions({})
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
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchSessions({})
  }
}

const imageId = ref('')
const showModalRef = ref<boolean>(false)
const imageSearchTableData = ref([])

watch(imageId, async () => {
  if (imageId.value) {
    await fetchImageSearchResults()
  }
}, {
  immediate: true,
})

async function fetchImageSearchResults() {
  const input = ref<ProjectImageSearchInput>({
    imageId: imageId.value,
    projectId: route.params.id != null ? route.params.id.toString() : ''
  })
  await $client[activeTab.value].projectImageSearch.query(input.value).then((response) => {
    imageSearchTableData.value = response
  })
}

async function navigateToSession(row: any) {
  const input = ref<GetPageProjectImageSearchInput>({
    imageId: imageId.value,
    projectId: route.params.id != null ? route.params.id.toString() : '',
    dLSessionId: row.dLSessionId
  })
  await $client[activeTab.value].getPageForProjectImageSearch.query(input.value).then((response) => {
    if (response.length > 0) {
      router.push({
        path: `/${activeTab.value === 'dLSession' ? 'data-labelling' : 'clinical-evaluation'}/${activeTab.value === 'dLSession' ? row.dLSessionId : row.cESessionId}`,
        query: {
          page: response[0].pagenumber,
          imageIndex: response[0].imageindex
        }
      })
    }
  })
}

const imageSearchTableColumns = computed<DataTableColumns<Session>>(() => [
  {
    key: 'name',
    title: 'Session Name',
    width: '30%',
    sorter: true,
    ellipsis: true
  },
  {
    key: 'patientId',
    title: 'Patient Id',
    width: '30%',
    sorter: true
  },
  {
    key: 'status',
    title: 'Stage',
    width: '10%',
    sorter: true,
  },
  {
    key: 'pagenumber',
    title: 'Page',
    width: '10%',
    render(row, index) {
      // Check if this session has a pending delete request (only for DL Sessions)
      const isDisabled = activeTab.value === 'dLSession' && hasPendingDeleteRequest(row.dLSessionId || row.id)
      
      return h('div', {
        class: 'inline-flex items-center gap-2',
      }, [
        h(NButton,
          {
            strong: true,
            secondary: true,
            type: 'primary',
            size: 'small',
            disabled: isDisabled,
            onClick: () => {
              if (isDisabled) return
              navigateToSession(row)
            },
          },
          { default: () => 'Go' }
        )
      ])
    }
  }
]);


function openCloseImageSearchModal() {
  if (showModalRef.value == false) {
    imageId.value = ''
    imageSearchTableData.value = []
  }
}

// LIST SESSIONS
async function fetchSessions({
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
}) {
  loading.value = true
  await $client[activeTab.value].list.query({
    search:searchQuery.value,
    limit: params.perPage,
    offset: (params.page - 1) * params.perPage,
    sort: params.sort.map(({ columnKey, order }) => ({
      [columnKey]: order === 'ascend' ? 'asc' : 'desc',
    })),
    filter: { projectId: route.params.id != null ? route.params.id.toString() : '' },
  }).then(async (response) => {
    // Store original unfiltered data BEFORE any filtering
    // This ensures filter options always show all available options, even when filters are applied
    originalUnfilteredData.value = response.data || []

    let filteredData = response.data

    // Client-side filters are only relevant for DL Sessions
    if (activeTab.value === 'dLSession') {
      // Filter by lock status if needed
      if (lockStatusFilter.value !== 'all') {
        filteredData = filteredData.filter((session: any) => {
          const lockHistory = session.dLSessionLockHistory?.[0]
          const isLocked = lockHistory?.isLocked ?? false

          if (lockStatusFilter.value === 'locked') {
            return isLocked
          } else if (lockStatusFilter.value === 'unlocked') {
            return !isLocked
          }

          return true
        })
      }

      // Filter by session labels if needed
      if (sessionLabelsFilter.value.length > 0) {
        filteredData = filteredData.filter((session: any) => {
          const sessionLabels = session.sessionLabels || []
          if (!Array.isArray(sessionLabels) || sessionLabels.length === 0) {
            return false // No labels means it doesn't match any filter
          }

          // Get all sessionLabel IDs from this session
          const sessionLabelIds = sessionLabels
            .map((sl: any) => sl.sessionLabel?.id || sl.sessionLabelId || sl.id)
            .filter((id: any) => id !== undefined && id !== null && id !== '')

          // Check if any of the session's labels match the filter
          return sessionLabelIds.some((id: string) => sessionLabelsFilter.value.includes(id))
        })
      }

      // Filter by session status if needed
      if (sessionStatusFilter.value.length > 0) {
        filteredData = filteredData.filter((session: any) => {
          const sessionStatuses = session.sessionStatusInDLSessions || []
          if (!Array.isArray(sessionStatuses) || sessionStatuses.length === 0) {
            return false // No status means it doesn't match any filter
          }

          // Find the active session status
          const activeStatus = sessionStatuses.find((ss: any) => ss.isActive === true)

          if (!activeStatus || !activeStatus.sessionStatus) {
            return false // No active status means it doesn't match
          }

          // Get the sessionStatus ID
          const statusId = activeStatus.sessionStatus?.id || activeStatus.sessionStatusId

          // Check if the session's active status matches the filter
          return statusId && sessionStatusFilter.value.includes(statusId)
        })
      }

      // Update filter options from original unfiltered data (keeps options stable even when filters are applied)
      fetchSessionLabelsFilterOptions()
      fetchSessionStatusFilterOptions()
    }

    data.value = filteredData
    pagination.pageCount = Math.ceil(response.metadata.totalCount / pagination.pageSize)
    totalDataCount.value = response.metadata.totalCount
    loading.value = false
    fetchLabels()
    fetchSessionLabels()
    // fetchTaxonomies()
    fetchSessionStatus()
    fetchAutoSessionCodes()
    fetchStructureGroups()
    fetchAllAnnotations()

    // Note: We intentionally DO NOT fetch delete-session requests here.
    // Delete Session Requests API calls should occur only when that tab is active.
    
    // Fetch pending delete requests for DL Sessions to maintain disabled state
    if (activeTab.value === 'dLSession') {
      await fetchPendingDeleteRequestsForSessions()
    }
  }).catch((error) => {
    console.log(error)
  })
}


/**
 * Fetch pending delete session requests for sessions in the current project
 * This is used to disable rows in the Data Labelling Session table
 */
async function fetchPendingDeleteRequestsForSessions() {
  try {
    // Fetch all delete session requests
    const requests = await $client.deleteSessionRequest.findMany.query({})
    
    // Get all DL sessions for this project to get their IDs
    const projectSessions = await $client.dLSession.list.query({
      search: '',
      limit: 1000,
      offset: 0,
      sort: [],
      filter: { projectId: route.params.id != null ? route.params.id.toString() : '' },
    })

    const projectSessionIds = projectSessions.data.map(s => s.id)
    
    // Filter requests that belong to this project's sessions
    const projectRequests = requests.filter(req => 
      projectSessionIds.includes(req.dLSessionId)
    )

    // Update the map with pending requests
    pendingDeleteRequestsMap.value.clear()
    projectRequests
      .filter(req => req.status === 'PENDING')
      .forEach(req => {
        pendingDeleteRequestsMap.value.set(req.dLSessionId, req)
      })

    // Update the map with rejected requests (for tooltip display)
    rejectedDeleteRequestsMap.value.clear()
    projectRequests
      .filter(req => req.status === 'REJECTED')
      .forEach(req => {
        rejectedDeleteRequestsMap.value.set(req.dLSessionId, req)
      })
  } catch (error: any) {
    console.error('Error fetching pending delete session requests:', error)
    // Don't show notification for this as it's a background operation
  }
}

/**
 * Check if a session has a pending delete request
 * @param sessionId - The ID of the session to check
 * @returns true if the session has a pending delete request, false otherwise
 */
function hasPendingDeleteRequest(sessionId: string): boolean {
  return pendingDeleteRequestsMap.value.has(sessionId)
}

/**
 * Get rejected delete session request for a session
 * @param sessionId - The ID of the session to check
 * @returns The rejected delete session request if exists, null otherwise
 */
function getRejectedDeleteRequest(sessionId: string): DeleteSessionRequest | null {
  return rejectedDeleteRequestsMap.value.get(sessionId) || null
}




  // Function to fetch all annotations from the database
async function fetchAllAnnotations() {
  if (hasLoadedAllAnnotations.value || isFetchingAllAnnotations.value) return
  isFetchingAllAnnotations.value = true;
  try {
    const response = await $client.annotation.fetchAllAnnotations.query();
    if (response && response.annotations) {
      allAnnotations.value = response.annotations;
    }
  } catch (error) {
    console.error('Error fetching all annotations:', error);
    notification.error({
      title: 'Error',
      content: 'Failed to fetch annotations.',
      duration: 5000
    });
  } finally {
    isFetchingAllAnnotations.value = false;
    hasLoadedAllAnnotations.value = true;
  }
}

// Validate taxonomy name to ensure it's unique within the session
function validateTaxonomyName(level: TaxonomyLevel, index: number) {
  if (!level.selectedTaxonomy) return;
  
  // Trim whitespace and normalize case for comparison
  const normalizedName = level.selectedTaxonomy.trim();
  if (normalizedName === '') {
    level.selectedTaxonomy = null;
    return;
  }
  
  // Update with the trimmed value
  level.selectedTaxonomy = normalizedName;
  
  // Check for duplicates (case-insensitive)
  const isDuplicate = taxonomyLevels.value.some((otherLevel, otherIndex) => 
    otherIndex !== index && 
    otherLevel.selectedTaxonomy && 
    otherLevel.selectedTaxonomy.toLowerCase() === normalizedName.toLowerCase()
  );
  
  if (isDuplicate) {
    notification.warning({
      title: 'Duplicate Taxonomy',
      content: `The taxonomy name "${normalizedName}" already exists in this session.`,
      duration: 3000
    });
    level.selectedTaxonomy = null;
    
    // Clear any selected annotations and landmarks
    level.selectedTaxonomies = [];
    level.selectedLandmarks = [];
  }
}

async function fetchSessionData(dLSessionId: string) {
  loading.value = true;
  try { 
    const response = await $client[activeTab.value].fetchSessionData.query({
      filter: { 
        projectId: route.params.id?.toString() || '', 
        dLSessionId: dLSessionId || '' 
      },
    });
    // Basic session data
    singleDLSession.value = response.data;
    
    // Store labels data for reference
    labelsInSession.value = response.labels 
      ? response.labels.map(item => item.label)  
      : [];

    // Handle approval levels data (supports grouped or flat shapes)
    const ua = response.userApproval || [];
    let approvalLevels: string[][] = [];
    
    if (ua.length && (ua[0]?.users !== undefined || ua[0]?.group !== undefined)) {
      // New grouped format: { approvalLevel, group: {id}, users: [{id}] }
      const maxLevel = Math.max(...ua.map((a: any) => a.approvalLevel || 0), 0);
      
      if (maxLevel > 0) {
        // Create array with maxLevel slots (index 0 = level 1, index 1 = level 2, etc.)
      approvalLevels = Array.from({ length: maxLevel }, (_, index) => {
        const level = index + 1;
        const itemsAtLevel = (ua as any[]).filter(a => a.approvalLevel === level);
        const ids: string[] = [];
          
        itemsAtLevel.forEach((item: any) => {
            // Add group ID if exists (entire group selected at this level)
            if (item.group?.id) {
              ids.push(item.group.id);
            }
            // Add individual user IDs (from split groups or individual selections)
            if (Array.isArray(item.users) && item.users.length > 0) {
              item.users.forEach((u: any) => {
                if (u?.id) {
                  ids.push(u.id);
                }
              });
            }
          });
          
        return ids;
        });
      }
    } else if (ua.length > 0) {
      // Legacy flat format: { approvalLevel, userGroupId, toUserId }
      const userApprovalData = ua;
      const maxLevel = Math.max(...userApprovalData.map((approval: any) => approval.approvalLevel || 0), 0);
      
      if (maxLevel > 0) {
        approvalLevels = Array.from({ length: maxLevel }, (_, index) => {
          const level = index + 1;
        return (userApprovalData as any[])
            .filter(approval => approval.approvalLevel === level)
            .map(approval => approval.userGroupId || approval.toUserId)
            .filter((id: any) => id); // Filter out null/undefined
        });
      }
    }

    // Set approval levels - ensure we always have at least an empty array for level 1
    // This ensures the UI can display approval level fields correctly
    // if (approvalLevels.length === 0) {
    //   approvalLevels = [[]];
    // }
    
    // CRITICAL FIX: Ensure array indices match approval levels (index 0 = level 1, index 1 = level 2, etc.)
    // If we have levels 2 and 3 but not level 1, we need to pad with empty arrays
    // This is already handled by Array.from({ length: maxLevel }) above, which creates the correct structure
    // Note: approvalLevels should be empty array [] when no levels exist, not [[]], to match Create Session behavior
    approvalLevelUsers.value = approvalLevels;

    // Initialize grouped taxonomies
    let formattedTaxonomies = [];

    // Process taxonomy data if exists
    if (response.taxonomy && response.taxonomy.length > 0) {      
      const uniqueTaxonomyIds = [...new Set(response.taxonomy.map(t => t.taxonomyId))];

      // Group taxonomies with their annotations
      const groupedTaxonomies = response.taxonomy.reduce((acc, item) => {
        const taxonomyId = item.taxonomyId;
        
        if (!acc[taxonomyId]) {
          acc[taxonomyId] = {
            taxonomyId: taxonomyId,
            taxonomyName: item.taxonomy.name,
            annotations: [],
            landmarks: []
          };
         
        }

        if (item.annotation) {
          acc[taxonomyId].annotations.push({
            id: item.annotation.id,
            name: item.annotation.name,
            taxonomyTypeName: item.annotation.taxonomyType?.name
          });

          // Add to landmarks if changeAppearance is true
          if (item.changeAppearance) {
            acc[taxonomyId].landmarks.push({
              id: item.annotation.id,
              name: item.annotation.name,
              taxonomyTypeName: item.annotation.taxonomyType?.name
            });
          }
        }

        return acc;
      }, {});

      // Map to taxonomy levels with proper landmark structure
      taxonomyLevels.value = Object.values(groupedTaxonomies).map(group => {
        const mappedLevel = {
          selectedTaxonomy: group.taxonomyName,
          selectedTaxonomyId:group.taxonomyId,
          selectedTaxonomies: group.annotations.map(a => a.id),
          selectedLandmarks: group.landmarks.map(l => l.id)
        };
        return mappedLevel;
      });

      // Store raw data for reference
      taxonomiesInSession.value = response.taxonomy;

      // Update the selectedTaxonomyAnnotations map
      Object.values(groupedTaxonomies).forEach(group => {
        selectedTaxonomyAnnotations.value.set(group.taxonomyId, group.annotations);
      });

      // Force update of the reactive map
      selectedTaxonomyAnnotations.value = new Map(selectedTaxonomyAnnotations.value);

      // Format taxonomies for newSession
      formattedTaxonomies = Object.values(groupedTaxonomies).map(tax => ({
        taxonomyId: tax.taxonomyId,
        annotations: tax.annotations.map(a => a.id),
        changeAppearance: tax.landmarks || []
      }));
    } else {

      // For sessions without taxonomy, set at least one empty level so user can add taxonomy
      // This ensures taxonomy fields remain visible during updates
      taxonomyLevels.value = [{
        selectedTaxonomy: null,
        selectedTaxonomyId: null,
        selectedTaxonomies: [],
        selectedLandmarks: []
      }];
      taxonomiesInSession.value = [];
      selectedTaxonomyAnnotations.value.clear();
      selectedAnnotationsMap.value.clear();
      
      // Reset select all states
      selectAllChecked.value = [false];
      selectAllIndeterminate.value = [false];
      selectAllLandmarksChecked.value = [false];
      landmarkIndeterminate.value = [false];
    }

    // Update newSession with all data
    if (singleDLSession.value.length > 0) {
      const selectedData = singleDLSession.value[0];
      
      selectedAssigneesCount.value = selectedData.users.filter((user) => user.userRole == 'ACTIVITY').length;
      selectedReviewersCount.value = selectedData.users.filter((user) => user.userRole == 'QUALITY_CONTROLLER').length;
      
      assigneesIndeterminate.value = selectedAssigneesCount.value == 0 ? 
        false : 
        userOptions.length == selectedAssigneesCount.value ? 
          false : 
          true;
      
      selectAllAssignees.value = selectedAssigneesCount.value == 0 ? 
        false : 
        '';
      
      reviewersIndeterminate.value = selectedReviewersCount.value == 0 ? 
        false : 
        userOptions.length == selectedReviewersCount.value ? 
          false : 
          true;
      
      selectAllReviewers.value = selectedReviewersCount.value == 0 ? 
        false : 
        '';

      await updateApprovedSelectOptions(
        selectedData.users
          .filter((user) => user.userRole == 'QUALITY_CONTROLLER')
          .map((e) => e.userId)
      );

      // Handle SOP data - this should now be correctly formatted from the backend
      // But we'll add a safety check just in case
      const formattedSop = Array.isArray(selectedData.sop) 
        ? selectedData.sop.map(item => {
            // If it's already a properly formatted object, use it
            if (typeof item === 'object' && item !== null && 'name' in item && 'sopLink' in item) {
              return item;
            }
            
            // If it's a string, try parsing it
            if (typeof item === 'string') {
              try {
                const parsed = JSON.parse(item);
                if (parsed && typeof parsed === 'object') {
                  return { 
                    name: parsed.name || parsed.docName || '',
                    sopLink: parsed.sopLink || parsed.link || ''
                  };
                }
                return { name: item, sopLink: '' };
              } catch (e) {
                return { name: item, sopLink: '' };
              }
            }
            
            // If it's an object with different properties
            if (typeof item === 'object' && item !== null) {
              return { 
                name: item.name || item.docName || '',
                sopLink: item.sopLink || item.link || ''
              };
            }
            
            // Default case
            return { name: '', sopLink: '' };
          })
        : [{ name: '', sopLink: '' }]; // Ensure we have at least one SOP item

      newSession.value = {
        id: selectedData.id,
        name: selectedData.name,
        description: selectedData.description,
        priority: 1,
        sop: formattedSop,
        projectId: route.params.id.toString(),
        users: selectedData.users.filter((user) => user.userRole),
        approval: approvalLevels.length > 0 ? approvalLevels : [], // Empty array when no approval levels exist (matches Create Session behavior)
        labelIds: labelsInSession.value ? labelsInSession.value.map(label => label.id) : [],
        sessionLabelIds: selectedData.sessionLabels && Array.isArray(selectedData.sessionLabels) ? 
          selectedData.sessionLabels.map((sl: any) => {
            const id = sl.sessionLabel?.id || sl.sessionLabelId || sl.id;
            return id;
          }).filter((id: any) => id !== undefined && id !== null) : 
          [],
        sessionStatusId: selectedData.sessionStatusInDLSessions && Array.isArray(selectedData.sessionStatusInDLSessions) ? 
          (() => {
            const activeStatus = selectedData.sessionStatusInDLSessions.find((ss: any) => ss.isActive === true);
            return activeStatus?.sessionStatusId || activeStatus?.sessionStatus?.id || undefined;
          })() : 
          undefined,
        taxonomies: formattedTaxonomies,
        structures: structuresInSession.value ? structuresInSession.value.map((structure) => structure.id) : []
      };

      // Handle auto-generated session name format
      if (newSession.value?.name.split('_').length == 8) {
        selectAutoGenerateSessionName.value = true;
        const nameParts = newSession.value.name.split('_');
        projectCode.value = nameParts[0];
        subProjectCode.value = nameParts[1];
        useCaseCode.value = nameParts[2];
        anatomyPlaneCode.value = nameParts[3];
        centerCode.value = nameParts[4];
        userTypeCode.value = nameParts[5];
        imageCount.value = parseInt(nameParts[6], 10) || null;
        setCode.value = nameParts[7];
      } else {
        selectAutoGenerateSessionName.value = false;
        projectCode.value = null;
        subProjectCode.value = null;
        useCaseCode.value = null;
        anatomyPlaneCode.value = null;
        centerCode.value = null;
        userTypeCode.value = null;
        imageCount.value = null;
        setCode.value = null;
      }
    }

  } catch (error: unknown) {
    console.error('Error in fetchSessionData:', error);
    const errorMessage = formatErrorMessage(error)
    notification.error({
      title: 'Error',
      content: `Failed to fetch session data: ${errorMessage}`,
      duration: 5000,
      closable: true,
    });
  } finally {
    loading.value = false;
  }
}

const totalDataCount = ref(0)

const loading = ref(true)
watch(activeTab, async () => {
  // Reset session labels filter when tab changes
  sessionLabelsFilter.value = []
  tempSessionLabelsSelections.value = []
  sessionLabelsFilterSearchQuery.value = ''
  sessionLabelsFilterDropdownVisible.value = false
  
  // Reset session status filter when tab changes
  sessionStatusFilter.value = []
  tempSessionStatusSelections.value = []
  sessionStatusFilterSearchQuery.value = ''
  sessionStatusFilterDropdownVisible.value = false
  
  // Reset original unfiltered data when tab changes
  originalUnfilteredData.value = []
  
  searchQuery.value = ''
  await fetchSessions({})
}, {
  immediate: true,
})

watch(searchQuery, async (newValue, oldValue) => {
  // Trigger fetch when search is cleared (becomes empty from a non-empty state)
  if (newValue === '' && oldValue && oldValue !== '') {
    await fetchSessions({})
  }
})

// Function to get annotation options for the select component
function getAnnotationOptions(taxonomyGroupName: string | null, currentLevel?: TaxonomyLevel) {
  if (!taxonomyGroupName) return [];
  
  // Return all annotations but mark those already selected in other taxonomies as disabled
  return allAnnotations.value.map(annotation => {
    // Check if this annotation is already selected in another taxonomy
    const existingSelection = selectedAnnotationsMap.value.get(annotation.id);
    const isSelectedInOtherLevel = existingSelection && 
                                  existingSelection.taxonomyId !== taxonomyGroupName;

    return {
      label: annotation.name,
      value: annotation.id,
      type: annotation.taxonomyTypeName,
      disabled: isSelectedInOtherLevel,
      description: isSelectedInOtherLevel ? `Used in ${existingSelection?.taxonomyName}` : undefined
    };
  });
}

// Function to get landmark annotation options (similar logic as before)
function getLandmarkAnnotationOptions(taxonomyGroupName: string | null, currentLevel?: TaxonomyLevel) {
  if (!taxonomyGroupName || !currentLevel) return [];
  
  // Filter to show only LANDMARK type annotations that are already selected as regular annotations
  return allAnnotations.value.filter(annotation => {
    const isLandmark = annotation.taxonomyTypeName?.toLowerCase() === 'landmark';
    const isParentSelected = currentLevel.selectedTaxonomies.includes(annotation.id);
    return isLandmark && isParentSelected;
  }).map(annotation => ({
    label: annotation.name,
    value: annotation.id,
    type: annotation.taxonomyTypeName
  }));
}

// UPDATE SESSION
const editedRow = ref<Session | null>(null)
const showDeletionConfirmation = ref(false);
const confirmationDetails = ref<any[]>([]);
const pendingUpdatePayload = ref<any>(null);

// Track initial form state for change detection
const initialFormState = ref<{
  newSession: any | null;
  taxonomyLevels: TaxonomyLevel[];
  sessionFiles: UploadFileInfo[];
} | null>(null);

// Function to capture initial form state
function captureInitialFormState() {
  if (!newSession.value) {
    // Don't capture if newSession is not set yet
    return;
  }
  
  // Deep clone all form data to avoid reference issues
  initialFormState.value = {
    newSession: JSON.parse(JSON.stringify(newSession.value)),
    taxonomyLevels: JSON.parse(JSON.stringify(taxonomyLevels.value)),
    sessionFiles: JSON.parse(JSON.stringify(sessionFiles.value.map(f => ({
      id: f.id,
      name: f.name,
      status: f.status,
      file: f.file ? {
        name: f.file.name,
        size: f.file.size,
        type: f.file.type
      } : null
    }))))
  };
}

// Function to reset initial form state
function resetInitialFormState() {
  initialFormState.value = null;
}

// Computed property to check if form has changes
const hasFormChanges = computed(() => {
  // If no initial state captured, assume no changes (for new sessions)
  if (!initialFormState.value) {
    return false;
  }
  
  // Compare newSession
  const currentSession = newSession.value;
  const initialSession = initialFormState.value.newSession;
  
  if (!currentSession || !initialSession) {
    return false;
  }
  
  // Compare basic fields
  if (currentSession.name !== initialSession.name ||
      currentSession.description !== initialSession.description ||
      currentSession.priority !== initialSession.priority) {
    return true;
  }
  
  // Compare SOP array
  const currentSop = JSON.stringify(currentSession.sop || []);
  const initialSop = JSON.stringify(initialSession.sop || []);
  if (currentSop !== initialSop) {
    return true;
  }
  
  // Compare users array
  const currentUsers = JSON.stringify((currentSession.users || []).map((u: any) => ({ userId: u.userId, userRole: u.userRole })).sort((a: any, b: any) => a.userId.localeCompare(b.userId)));
  const initialUsers = JSON.stringify((initialSession.users || []).map((u: any) => ({ userId: u.userId, userRole: u.userRole })).sort((a: any, b: any) => a.userId.localeCompare(b.userId)));
  if (currentUsers !== initialUsers) {
    return true;
  }
  
  // Compare labelIds
  const currentLabelIds = JSON.stringify((currentSession.labelIds || []).sort());
  const initialLabelIds = JSON.stringify((initialSession.labelIds || []).sort());
  if (currentLabelIds !== initialLabelIds) {
    return true;
  }
  
  // Compare sessionLabelIds
  const currentSessionLabelIds = JSON.stringify((currentSession.sessionLabelIds || []).sort());
  const initialSessionLabelIds = JSON.stringify((initialSession.sessionLabelIds || []).sort());
  if (currentSessionLabelIds !== initialSessionLabelIds) {
    return true;
  }
  
  // Compare sessionStatusId
  const currentSessionStatusId = currentSession.sessionStatusId || null;
  const initialSessionStatusId = initialSession.sessionStatusId || null;
  if (currentSessionStatusId !== initialSessionStatusId) {
    return true;
  }
  
  // Compare approval levels
  const normalizeApprovalLevel = (level: any) => {
    if (!Array.isArray(level)) return [];
    // Handle both string arrays (initial state) and object arrays (after update)
    const normalized = level
      .map((item: any) => {
        // If it's a string (userId), convert to object format
        if (typeof item === 'string' && item.trim() !== '') {
          return { userId: item.trim(), userRole: 'QUALITY_CONTROLLER' };
        }
        // If it's an object with userId, use it
        if (item && typeof item === 'object' && item.userId) {
          return { userId: String(item.userId).trim(), userRole: item.userRole || 'QUALITY_CONTROLLER' };
        }
        // Filter out invalid entries
        return null;
      })
      .filter((item: any) => item !== null && item.userId)
      .sort((a: any, b: any) => {
        if (!a?.userId || !b?.userId) return 0;
        return String(a.userId).localeCompare(String(b.userId));
      });
    return normalized;
  };
  
  // Normalize both current and initial approval arrays
  const currentApprovalArray = (currentSession.approval || []).map(normalizeApprovalLevel);
  const initialApprovalArray = (initialSession.approval || []).map(normalizeApprovalLevel);
  
  // Compare lengths first
  if (currentApprovalArray.length !== initialApprovalArray.length) {
    return true;
  }
  
  // Compare each level
  const currentApproval = JSON.stringify(currentApprovalArray);
  const initialApproval = JSON.stringify(initialApprovalArray);
  if (currentApproval !== initialApproval) {
    return true;
  }
  
  // Compare taxonomyLevels
  const currentTaxonomyLevels = JSON.stringify(taxonomyLevels.value);
  const initialTaxonomyLevels = JSON.stringify(initialFormState.value.taxonomyLevels);
  if (currentTaxonomyLevels !== initialTaxonomyLevels) {
    return true;
  }
  
  // Compare sessionFiles (by file name and size)
  const currentFiles = JSON.stringify(sessionFiles.value.map(f => ({ name: f.file?.name, size: f.file?.size })).sort((a, b) => (a.name || '').localeCompare(b.name || '')));
  const initialFiles = JSON.stringify(initialFormState.value.sessionFiles.map(f => ({ name: f.file?.name, size: f.file?.size })).sort((a, b) => (a.name || '').localeCompare(b.name || '')));
  if (currentFiles !== initialFiles) {
    return true;
  }
  
  return false;
});

async function updateRow(row: Session) {
  try {
    // Mark name field as touched and validate
    nameTouched.value = true
    const isNameValid = validateName(newSession.value?.name)
    if (!isNameValid) {
      return
    }
    
    // Validate form using Naive UI form validation
    try {
      await formRef.value?.validate()
    } catch (error) {
      // Form validation failed
      return
    }
    
    // Validate taxonomy names are unique
    const taxonomyNames = taxonomyLevels.value
      .filter(level => level.selectedTaxonomy)
      .map(level => level.selectedTaxonomy!.toLowerCase());
    
    const uniqueTaxonomyNames = new Set(taxonomyNames);
    if (uniqueTaxonomyNames.size !== taxonomyNames.length) {
      notification.error({
        title: 'Error',
        content: 'There are duplicate taxonomy group names. Please ensure all taxonomy names are unique.',
        duration: 5000,
        closable: true,
      });
      return;
    }

      const hasEmptyFields = newSession.value.sop.some(sop => !sop.name.trim() || !sop.sopLink.trim());
      if (hasEmptyFields) {
        notification.error({
          title: 'Error',
          content: 'Please ensure all Reference Names and Links are filled.',
          duration: 5000,
          closable: true,
        });
        return;
      }
    
    // Validate cross-level user assignments (no user should be in multiple roles)
    const validationError = validateCrossLevelAssignments();
    if (validationError) {
      notification.error({
        title: 'Validation Error',
        content: validationError,
        duration: 5000,
        closable: true,
      });
      return;
    }
    
    // Get all landmark selections across taxonomy levels
    // Note: Landmarks are actually handled via changeAppearance in taxonomies array
    const landmarkSelections = taxonomyLevels.value
      .filter(level => 
        level.selectedTaxonomy && 
        typeof level.selectedTaxonomy === 'string' &&
        level.selectedTaxonomyId &&
        typeof level.selectedTaxonomyId === 'string' &&
        level.selectedLandmarks?.length > 0
      )
      .map(level => ({
        taxonomyId: level.selectedTaxonomyId as string,
        landmarkIds: level.selectedLandmarks
      }));

    const formattedTaxonomies = taxonomyLevels.value
      .filter(level => 
        level.selectedTaxonomy && 
        typeof level.selectedTaxonomy === 'string' &&
        level.selectedTaxonomies?.length > 0
      )
      .map(level => {
        // Build taxonomy object conditionally - only include taxonomyId if it's not null
        const taxonomyObj: any = {
          taxonomyName: level.selectedTaxonomy as string, // Include the name
          annotations: level.selectedTaxonomies,
          // Map selected landmarks to have changeAppearance true
          changeAppearance: level.selectedLandmarks || []
        };
        
        // Only include taxonomyId if it exists (not null)
        if (level.selectedTaxonomyId) {
          taxonomyObj.taxonomyId = level.selectedTaxonomyId;
        }
        
        return taxonomyObj;
      });

    const formattedApproval = row.approval?.map(level => 
      Array.isArray(level) ? level : []
    ) || [];

    // Format SOP data as array of objects with name and sopLink properties
    const formattedSop = Array.isArray(row.sop) 
      ? row.sop.map(item => {
          // If it's a string, try to parse it into an object
          if (typeof item === 'string') {
            try {
              const parsed = JSON.parse(item);
              if (parsed && typeof parsed === 'object') {
                return { 
                  name: parsed.name || '',
                  sopLink: parsed.sopLink || ''
                };
              }
              return { name: item, sopLink: '' };
            } catch (e) {
              return { name: item, sopLink: '' };
            }
          }
          
          // If it's already an object, ensure it has the right properties
          return {
            name: item.name || '',
            sopLink: item.sopLink || ''
          };
        }) 
      : [];

    // Get sessionLabelIds from newSession if editing, otherwise from row
    // Ensure we always have a valid array and filter out undefined/null values
    let sessionLabelIds: string[] = [];
    
    if (newSession.value?.sessionLabelIds && Array.isArray(newSession.value.sessionLabelIds)) {
      // Use sessionLabelIds from newSession, filtering out any invalid values
      sessionLabelIds = newSession.value.sessionLabelIds.filter((id: any) => id !== undefined && id !== null && id !== '');
    } else if (row.sessionLabels && Array.isArray(row.sessionLabels)) {
      // Fallback to mapping from row.sessionLabels
      sessionLabelIds = row.sessionLabels
        .map((sl: any) => sl.sessionLabel?.id || sl.sessionLabelId || sl.id)
        .filter((id: any) => id !== undefined && id !== null && id !== '');
    }
    
    const updatePayload = {
      id: row.id,
      name: row.name,
      description: row.description,
      priority: row.priority,
      sop: formattedSop, // This is now an array of objects with name and sopLink properties
      projectId: row.projectId,
      taxonomies: formattedTaxonomies,
      approval: formattedApproval,
      labelIds: row.labelIds?.length ? row.labelIds : [],
      sessionLabelIds: sessionLabelIds,
      sessionStatusId: newSession.value?.sessionStatusId || undefined,
      users: row.users.filter(Boolean),
      landmarkSelections: landmarkSelections
    };
    

    // Prepare file data in parallel while session is being updated
    let preparedFilesData: Array<{ file: File, filename: string, extractedResources: any[] }> = [];
    const filePreparationPromise = sessionFiles.value.length > 0 && activeTab.value === 'dLSession' && row.id
      ? prepareFilesData(sessionFiles.value)
      : Promise.resolve([]);

    // Update session and prepare files in parallel
    const [result, filesData] = await Promise.all([
      $client[activeTab.value].update.mutate(updatePayload),
      filePreparationPromise
    ]);

    preparedFilesData = filesData;

    // Check if confirmation is required
    if (result.requiresConfirmation && result.taxonomyConfirmation) {
      // Store the payload for later use
      pendingUpdatePayload.value = updatePayload;
      // Set the confirmation details
      confirmationDetails.value = result.taxonomyConfirmation;
      // Show the modal
      showDeletionConfirmation.value = true;
    } else {
      // ✅ Handle file upload with proper error handling
      let fileUploadSucceeded = true;
      
      if (preparedFilesData.length > 0 && row.id) {
        try {
          // Run duplication check and upload in parallel
          // Pass suppressSuccessMessage: true to prevent duplicate messages (we'll show it here)
          const uploadResult = await checkAndUploadFilesParallel(preparedFilesData, row.id, true);
          
          // If upload is pending (waiting for confirmation), don't proceed further
          if ((uploadResult as any).pending) {
            return;
          }
          
          // ✅ Check if upload actually succeeded (at least one file linked)
          if (uploadResult.totalLinked === 0 && preparedFilesData.length > 0) {
            // All files failed to upload - don't show success or close modal
            fileUploadSucceeded = false;
            // Error notifications are already shown by processFileUploads
            return; // ✅ Exit early - don't show success or close modal
          }
          
          // Refresh uploaded files list
          await fetchUploadedJsonFiles(row.id);
          
          // Show file upload success message if files were uploaded (only once here)
          showFileUploadSuccessMessage(uploadResult);
          
          // Navigate to session preview page after successful upload (only if files were uploaded)
          if (activeTab.value === 'dLSession' && uploadResult.totalLinked > 0) {
            router.push(`/data-labelling/${row.id}`);
            handleUpdateSuccess(); // Show success before navigation
            return; // Exit early to prevent form reset
          }
        } catch (fileError: any) {
          // ✅ File upload error occurred - don't show success or close modal
          fileUploadSucceeded = false;
          console.error('File upload error:', fileError);
          return; // ✅ Exit early - don't show success or close modal
        }
      }
      
      // ✅ Only show success if no file upload or file upload succeeded
      if (fileUploadSucceeded) {
        handleUpdateSuccess();
      }
    }
  } catch (error: any) {
    handleUpdateError(error);
  }
}

// Handle modal confirmation
async function handleConfirm() {
  try {
    if (pendingUpdatePayload.value) {
      await $client[activeTab.value].update.mutate({
        ...pendingUpdatePayload.value,
        confirmTaxonomyDeletion: true
      });
      
      let fileUploadSucceeded = true;
      
      // Handle file upload if files are selected (only after session is updated)
      if (sessionFiles.value.length > 0 && pendingUpdatePayload.value.id) {
        try {
          // Prepare files data first
          const preparedFilesData = await prepareFilesData(sessionFiles.value);
          
          if (preparedFilesData.length > 0) {
            // Use parallel version for upload
            // Pass suppressSuccessMessage: true to prevent duplicate messages (we'll show it here)
            const uploadResult = await checkAndUploadFilesParallel(preparedFilesData, pendingUpdatePayload.value.id, true);
            
            // If upload is pending (waiting for confirmation), don't proceed further
            if ((uploadResult as any).pending) {
              return; // Wait for user confirmation
            }
            
            // ✅ Check if upload actually succeeded (at least one file linked)
            if (uploadResult.totalLinked === 0 && preparedFilesData.length > 0) {
              // All files failed to upload - don't show success or close modal
              fileUploadSucceeded = false;
              // Error notifications are already shown by processFileUploads
              return; // ✅ Exit early - don't show success or close modal
            } else {
              // At least one file succeeded
              fileUploadSucceeded = true;
              
              // Refresh uploaded files list
              await fetchUploadedJsonFiles(pendingUpdatePayload.value.id);
              
              // Show file upload success message if files were uploaded (only once here)
              showFileUploadSuccessMessage(uploadResult);
              
              // Navigate to session preview page after successful upload (only if files were uploaded)
              if (activeTab.value === 'dLSession' && uploadResult.totalLinked > 0) {
                router.push(`/data-labelling/${pendingUpdatePayload.value.id}`);
                handleUpdateSuccess();
                closeModal();
                return; // Exit early to prevent form reset
              }
            }
          }
        } catch (fileError: any) {
          // ✅ File upload error occurred - don't show success or close modal
          fileUploadSucceeded = false;
          // Error notification is already shown in checkAndUploadFiles/processFileUploads
          console.error('File upload error:', fileError);
          return; // ✅ Exit early - don't show success or close modal
        }
      }
      
      // ✅ Only show success and close modal if file upload succeeded (or no files to upload)
      if (fileUploadSucceeded) {
        handleUpdateSuccess();
        closeModal();
      }
      // If fileUploadSucceeded is false, we've already returned above, so we won't reach here
    }
  } catch (error: any) {
    handleUpdateError(error);
  }
}

// Handle modal cancellation
function handleCancel() {
  notification.info({
    title: 'Update Cancelled',
    content: 'Session update was cancelled.',
    duration: 3000,
    closable: true,
  });
  closeModal();
}

// Close modal and reset state
function closeModal() {
  showDeletionConfirmation.value = false;
  confirmationDetails.value = [];
  pendingUpdatePayload.value = null;
  resetInitialFormState();
  if (tempTaxonomyLevels.value.length > 0) {
    // Restore last removed values
    taxonomyLevels.value.push(tempTaxonomyLevels.value.pop()!)
    selectAllChecked.value.push(tempSelectAllChecked.value.pop()!)
    selectAllIndeterminate.value.push(tempSelectAllIndeterminate.value.pop()!)
    selectAllLandmarksChecked.value.push(tempSelectAllLandmarksChecked.value.pop()!)
    tempLandmarkIndeterminate.value.push(tempLandmarkIndeterminate.value.pop()!)
  }
}

// Handle successful update
async function handleUpdateSuccess() {
      notification.success({
    title: 'Success',
    content: 'Session updated successfully.',
    duration: 11000, 
    closable: true,
  });
  
  // Re-capture the current state as the new initial state after successful update
  // Use nextTick to ensure all form values are updated
  await nextTick();
  captureInitialFormState();
  
  // Reset form values
  projectCode.value = null;
  subProjectCode.value = null;
  useCaseCode.value = null;
  anatomyPlaneCode.value = null;
  centerCode.value = null;
  userTypeCode.value = null;
  imageCount.value = null;
  setCode.value = null;
  
  // Reset validation states
  nameTouched.value = false
  nameDirty.value = false
  nameError.value = ''
  formRef.value?.restoreValidation()
  
  // Reset file upload
  sessionFiles.value = [];
  sessionFileInfo.value = null;
  uploadedJsonFiles.value = [];
  hasPendingImages.value = false;
  if (sessionUploadRef.value) {
    sessionUploadRef.value.clear();
  }
  
  newSession.value = null;
  fetchSessions({});
}

// // Handle update error
// function handleUpdateError(error: unknown) {
//   console.error('Update error:', error);
//   notification.error({
//     title: 'Error',
//     content: formatErrorMessage(error),
//     duration: 5000,
//     closable: true,
//   });
// }

function handleUpdateError(error: TRPCError | null | undefined): void {  
  if (!error) return
  
  // Handle specific error codes
  if (error.data?.code === 'FORBIDDEN') {
    notification.error({
      title: 'Error',
      content: 'Session is locked',
      duration: 5000,
      closable: true,
    })
    return
  }
  
  // Handle all other errors with user-friendly messages
  const errorMessage = formatErrorMessage(error)
  notification.error({
    title: 'Error',
    content: errorMessage,
    duration: 5000,
    closable: true,
  })
}

const selectAllAssignees = ref<Boolean>(false)
const selectAllReviewers = ref<Boolean>(false)
const assigneesIndeterminate =  ref<Boolean>(false)
const reviewersIndeterminate =  ref<Boolean>(false)

async function duplicateSession(row: Session) {
  try {
    await fetchSessionData(row.id);
    showSubmit.value = true;
    // Reset validation states
    nameTouched.value = false
    nameDirty.value = false
    nameError.value = ''
    formRef.value?.restoreValidation()
    
    // Reset file upload state - new session won't have pending images or uploaded files
    hasPendingImages.value = false;
    uploadedJsonFiles.value = [];
    sessionFiles.value = [];
    if (sessionUploadRef.value) {
      sessionUploadRef.value.clear();
    }
    
    if (singleDLSession.value.length > 0) {
      const selectedData = singleDLSession.value[0];
      
      selectedAssigneesCount.value = selectedData.users.filter((user) => user.userRole == 'ACTIVITY').length;
      selectedReviewersCount.value = selectedData.users.filter((user) => user.userRole == 'QUALITY_CONTROLLER').length;
      
      assigneesIndeterminate.value = selectedAssigneesCount.value == 0 ?  
        false : 
        userOptions.length == selectedAssigneesCount.value ? 
          false : 
          true;
      
      selectAllAssignees.value = selectedAssigneesCount.value == 0 ? 
        false : 
        '';
      
      reviewersIndeterminate.value = selectedReviewersCount.value == 0 ?  
        false : 
        userOptions.length == selectedReviewersCount.value ? 
          false : 
          true;
      
      selectAllReviewers.value = selectedReviewersCount.value == 0 ? 
        false : 
        '';
      
      await updateApprovedSelectOptions(
        selectedData.users
          .filter((user) => user.userRole == 'QUALITY_CONTROLLER')
          .map((e) => e.userId)
      );
      
      // IMPROVED SOP HANDLING for duplicateSession
      // Process SOP data to ensure proper format
      const formattedSop = Array.isArray(selectedData.sop) 
        ? selectedData.sop.map(item => {
            // Check if item is already in the expected format
            if (typeof item === 'object' && item !== null && 'name' in item && 'sopLink' in item) {
              return item;
            }
            
            // If it's a string, try parsing it as JSON
            if (typeof item === 'string') {
              try {
                const parsed = JSON.parse(item);
                if (parsed && typeof parsed === 'object') {
                  return { 
                    name: parsed.name || parsed.docName || '',
                    sopLink: parsed.sopLink || parsed.link || ''
                  };
                }
                return { name: item, sopLink: '' };
              } catch (e) {
                return { name: item, sopLink: '' };
              }
            }
            
            // If it's an object with different properties
            if (typeof item === 'object' && item !== null) {
              return { 
                name: item.name || item.docName || '',
                sopLink: item.sopLink || item.link || ''
              };
            }
            
            // Default empty object if none of the above
            return { name: '', sopLink: '' };
          })
        : [{ name: '', sopLink: '' }]; // Ensure we have at least one SOP item
      
      // Map session labels correctly - handle nested structure
      const mappedSessionLabelIds = selectedData.sessionLabels && Array.isArray(selectedData.sessionLabels) ? 
        selectedData.sessionLabels.map((sl: any) => {
          const id = sl.sessionLabel?.id || sl.sessionLabelId || sl.id;
          return id;
        }).filter((id: any) => id !== undefined && id !== null) : 
        [];
      
      newSession.value = {
        id: selectedData.id,
        name: selectedData.name,
        description: selectedData.description,
        priority: 1,
        sop: formattedSop,
        projectId: route.params.id.toString(),
        users: selectedData.users.filter((user) => user.userRole),
        approval: approvalLevelUsers.value && approvalLevelUsers.value.length ? approvalLevelUsers.value : [],
        labelIds: labelsInSession.value ? labelsInSession.value.map((label) => label.id) : [],
        sessionLabelIds: mappedSessionLabelIds,
        taxonomies: taxonomiesInSession.value ? taxonomiesInSession.value.map((taxonomy) => taxonomy.id) : [{}],
        structures: structuresInSession.value ? structuresInSession.value.map((structure) => structure.id) : [],
      };
      
      // Remove any CE-specific IDs that shouldn't be duplicated
      if (newSession.value?.users) {
        newSession.value.users.forEach((item) => {
          delete item.cESessionId;
        });
      }
      
      // Handle auto-generated session name format
      if (newSession.value?.name.split('_').length == 8) {
        selectAutoGenerateSessionName.value = true;
        const nameParts = newSession.value.name.split('_');
        projectCode.value = nameParts[0];
        subProjectCode.value = nameParts[1];
        useCaseCode.value = nameParts[2];
        anatomyPlaneCode.value = nameParts[3];
        centerCode.value = nameParts[4];
        userTypeCode.value = nameParts[5];
        imageCount.value = parseInt(nameParts[6], 10) || null;
        setCode.value = nameParts[7];
      } else {
        selectAutoGenerateSessionName.value = false;
        projectCode.value = null;
        subProjectCode.value = null;
        useCaseCode.value = null;
        anatomyPlaneCode.value = null;
        centerCode.value = null;
        userTypeCode.value = null;
        imageCount.value = null;
        setCode.value = null;
      }

      // Ensure taxonomyLevels always has at least one empty object for UI
      if (!taxonomyLevels.value || taxonomyLevels.value.length === 0) {
        taxonomyLevels.value = [{
          selectedTaxonomy: null,
          selectedTaxonomyId: null,
          selectedTaxonomies: [],
          selectedLandmarks: []
        }];
      }
    }
  }
  catch (error: unknown) {
    console.error('Error duplicating session:', error);
    const errorMessage = formatErrorMessage(error)
    notification.error({
      title: 'Error',
      content: `Error duplicating session: ${errorMessage}`,
      duration: 5000,
      closable: true,
    });
  }
}

// CREATE SESSION
const newSession = ref<CreateDLSessionInput | CreateCESessionInput | null>(null)
const showSubmit = ref<null>(null)
const isCreatingSession = computed(() => !!newSession.value)

// Function to initialize new session form
function initializeNewSession() {
  try {
    showSubmit.value = true;
    
    // Reset validation states
    nameTouched.value = false;
    nameDirty.value = false;
    nameError.value = '';
    
    // Initialize session based on active tab
    if (activeTab.value === 'dLSession') {
      newSession.value = {
        name: '',
        description: '',
        priority: 1,
        sop: [],
        projectId: route.params.id.toString(),
        users: [],
        labelIds: [],
        sessionLabelIds: [],
        sessionStatusId: undefined,
        approval: [],
        taxonomies: [],
      } as CreateDLSessionInput;
    } else {
      // For CESession, sop is array of strings
      newSession.value = {
        name: '',
        description: '',
        priority: 1,
        sop: [],
        projectId: route.params.id.toString(),
        users: [],
        approval: [],
        structures: [],
      } as CreateCESessionInput;
    }
    
    // Reset all form-related refs
    approvalOptions.value = [];
    selectedAssigneesCount.value = 0;
    selectedReviewersCount.value = 0;
    selectAllAssignees.value = false;
    selectAllReviewers.value = false;
    assigneesIndeterminate.value = false;
    reviewersIndeterminate.value = false;
    selectAutoGenerateSessionName.value = false;
    viewAllAssignees.value = false;
    viewAllReviewers.value = false;
    projectCode.value = null;
    subProjectCode.value = null;
    useCaseCode.value = null;
    anatomyPlaneCode.value = null;
    centerCode.value = null;
    userTypeCode.value = null;
    imageCount.value = null;
    setCode.value = null;
    
    // Initialize taxonomy levels (only for DL sessions)
    if (activeTab.value === 'dLSession') {
      taxonomyLevels.value = [{
        selectedTaxonomy: null,
        selectedTaxonomyId: null,
        selectedTaxonomies: [],
        selectedLandmarks: []
      }];
    }
    
  } catch (error: any) {
    console.error('Error in initializeNewSession:', error);
    notification.error({
      title: 'Error',
      content: error?.message || 'Failed to initialize session form',
      duration: 5000,
      closable: true,
    });
  }
}

// Form validation
const formRef = ref<FormInst | null>(null)
const nameTouched = ref(false)
const nameDirty = ref(false)
const nameError = ref('')

const formRules: FormRules = {
  name: [
    { 
      required: true, 
      message: 'Name is required', 
      trigger: ['input', 'blur'] 
    }
  ]
}

// Validation function for name
function validateName(value: string | undefined) {
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

// Computed property for form validity
const isFormValid = computed(() => {
  if (!newSession.value) return false
  // Check if name is valid (not empty after trim)
  const isNameValid = newSession.value.name && newSession.value.name.trim() !== '' && !nameError.value
  return isNameValid
})

async function createSession() {
  if (newSession.value) {
    // Mark name field as touched
    nameTouched.value = true
    
    // Validate name field
    const isNameValid = validateName(newSession.value.name)
    if (!isNameValid) {
      return
    }
    
    // Validate form using Naive UI form validation
    try {
      await formRef.value?.validate()
    } catch (error) {
      // Form validation failed
      return
    }
    
    try {
      // Validate taxonomy names are unique
      const taxonomyNames = taxonomyLevels.value
        .filter(level => level.selectedTaxonomy)
        .map(level => level.selectedTaxonomy!.toLowerCase());
      
      const uniqueTaxonomyNames = new Set(taxonomyNames);
      if (uniqueTaxonomyNames.size !== taxonomyNames.length) {
        notification.error({
          title: 'Error',
          content: 'There are duplicate taxonomy group names. Please ensure all taxonomy names are unique.',
          duration: 5000,
          closable: true,
        });
        return;
      }

      const hasEmptyFields = newSession.value.sop.some(sop => !sop.name.trim() || !sop.sopLink.trim());
      if (hasEmptyFields) {
        notification.error({
          title: 'Error',
          content: 'Please ensure all Reference Names and Links are filled.',
          duration: 5000,
          closable: true,
        });
        return;
      }
      
      // Validate cross-level user assignments (no user should be in multiple roles)
      const validationError = validateCrossLevelAssignments();
      if (validationError) {
        notification.error({
          title: 'Validation Error',
          content: validationError,
          duration: 5000,
          closable: true,
        });
        return;
      }
      
      // Get landmark selections across taxonomy levels
      // Note: Landmarks are actually handled via changeAppearance in taxonomies array
      const landmarkSelections = taxonomyLevels.value
        .filter(level => 
          level.selectedTaxonomy && 
          typeof level.selectedTaxonomy === 'string' &&
          level.selectedLandmarks?.length > 0
        )
        .map(level => ({
          // Use selectedTaxonomyId if available, otherwise use selectedTaxonomy (name)
          taxonomyId: level.selectedTaxonomyId || level.selectedTaxonomy,
          landmarkIds: level.selectedLandmarks
        }));

      // Process taxonomies with landmark appearances
      const processedTaxonomies = taxonomyLevels.value
        .filter(level => 
          level.selectedTaxonomy && 
          typeof level.selectedTaxonomy === 'string' &&
          level.selectedTaxonomies?.length > 0
        ) 
        .map(level => ({
          // Use selectedTaxonomyId if available (existing taxonomy), otherwise use selectedTaxonomy (new taxonomy)
          taxonomyId: level.selectedTaxonomyId || level.selectedTaxonomy,
          taxonomyName: level.selectedTaxonomy, // Include the name for the backend
          annotations: level.selectedTaxonomies,
          changeAppearance: level.selectedLandmarks || []
        }));

      // Format SOP data as objects, not strings
      const formattedSop = Array.isArray(newSession.value.sop) 
        ? newSession.value.sop
            .filter(item => {
              // Filter out empty entries
              if (typeof item === 'object' && (!item.name && !item.sopLink)) {
                return false;
              }
              return true;
            })
            .map(item => {
              // If it's a string, try to parse it to an object
              if (typeof item === 'string') {
                try {
                  return JSON.parse(item);
                } catch (e) {
                  return { name: item, sopLink: '' };
                }
              }
              // Keep as object (don't stringify)
              return {
                name: item.name || '',
                sopLink: item.sopLink || ''
              };
            })
        : [];
      
      // Create base session data
      let baseSessionData = {
        ...newSession.value,
        sop: formattedSop,
        taxonomies: processedTaxonomies,
        landmarkSelections: landmarkSelections
      };

      // Add masterValue if auto-generate is enabled
      let dataForAddSession;
      if(selectAutoGenerateSessionName.value) {
        const masterValue = {
          projectCode: projectCodeList.value.some(d => d.name === projectCode.value) ? '' : projectCode.value,
          subProjectCode: subProjectCodeList.value.some(d => d.name === subProjectCode.value) ? '' : subProjectCode.value,
          useCaseCode: useCaseCodeList.value.some(d => d.name === useCaseCode.value) ? '' : useCaseCode.value,
          anatomyPlaneCode: anatomyPlaneCodeList.value.some(d => d.name === anatomyPlaneCode.value) ? '' : anatomyPlaneCode.value,
          centerCode: centerCodeList.value.some(d => d.name === centerCode.value) ? '' : centerCode.value,
          userTypeCode: userTypeCodeList.value.some(d => d.name === userTypeCode.value) ? '' : userTypeCode.value,
        };
        dataForAddSession = {
          ...baseSessionData,
          masterValue
        };
      } else {
        dataForAddSession = baseSessionData;
      }

      // Remove taxonomy-related fields for CE Session
      if (activeTab.value == 'cESession') {
        delete dataForAddSession.labelIds;
        delete dataForAddSession.taxonomies;
      }

      // Prepare file data in parallel while session is being created
      let preparedFilesData: PreparedFileData[] = [];
      const filePreparationPromise = sessionFiles.value.length > 0 && activeTab.value === 'dLSession'
        ? prepareFilesData(sessionFiles.value)
        : Promise.resolve([]);

      // Create the session and prepare files in parallel
      const [createdSession, filesData] = await Promise.all([
        $client[activeTab.value].create.mutate(dataForAddSession),
        filePreparationPromise
      ]);

      preparedFilesData = filesData;
      
      // Handle file upload if files are selected (only after session is created)
      if (preparedFilesData.length > 0 && createdSession?.id) {
        try {
          // Run duplication check and upload in parallel
          // Pass suppressSuccessMessage: true to prevent duplicate messages (we'll show it here)
          const uploadResult = await checkAndUploadFilesParallel(preparedFilesData, createdSession.id, true);
          
          // If upload is pending (waiting for confirmation), don't proceed further
          if ((uploadResult as any).pending) {
            return; // Wait for user confirmation
          }
          
          // Refresh uploaded files list
          await fetchUploadedJsonFiles(createdSession.id);
          
          // Show file upload success message if files were uploaded (only once here)
          showFileUploadSuccessMessage(uploadResult);
          
          // Navigate to session preview page after successful upload (only if files were uploaded)
          if (activeTab.value === 'dLSession' && uploadResult.totalLinked > 0) {
            router.push(`/data-labelling/${createdSession.id}`);
            return; // Exit early to prevent form reset
          }
        } catch (fileError) {
          // File upload error is already handled in checkAndUploadFilesParallel function
        }
      } 

      // Reset form
      newSession.value = null;
      await fetchSessions({});
      
      // Reset all form fields
      projectCode.value = null;
      subProjectCode.value = null;
      useCaseCode.value = null;
      anatomyPlaneCode.value = null;
      centerCode.value = null;
      userTypeCode.value = null;
      imageCount.value = null;
      setCode.value = null;
      
      // Reset validation states
      nameTouched.value = false
      nameDirty.value = false
      nameError.value = ''
      formRef.value?.restoreValidation()
      
      // Reset file upload
      sessionFiles.value = [];
      sessionFileInfo.value = null;
      if (sessionUploadRef.value) {
        sessionUploadRef.value.clear();
      }

      notification.success({
        title: 'Success',
        content: 'Session created successfully.',
        duration: 5000, 
        closable: true
      });
    }
    catch (error: unknown) {
      console.error('Error creating session:', error);
      const errorMessage = formatErrorMessage(error)
      notification.error({
        title: 'Error',
        content: `Error creating session: ${errorMessage}`,
        duration: 5000,
        closable: true,
      });
    }
  }
}

const labels = ref<Label[]>([])
const filteredLabels = ref<Label[]>([])
const isFetchingLabels = ref(false)
const hasLoadedLabels = ref(false)
async function fetchLabels() {
  if (hasLoadedLabels.value || isFetchingLabels.value) return
  isFetchingLabels.value = true
  try {
    const response = await $client.label.list.query({ sort: [{ name: 'asc' }] });
    
    if (response.data && Array.isArray(response.data)) {
      labels.value = response.data.map(label => ({
        id: label.id,
        name: label.name || 'Unnamed Label',
        // Add any other needed label properties
      }));
    } else {
      labels.value = [];
    }
    
    filteredLabels.value = labels.value;
    
  } catch (error) {
    labels.value = [];
    filteredLabels.value = [];
  } finally {
    isFetchingLabels.value = false;
    hasLoadedLabels.value = true;
  }
}

// FILTER LABELS
const selectedLabelArrayDuplicate = []

async function handleSearch(e?: any) {
  if (!e || !e.length) {
    filteredLabels.value = labels.value;
    return;
  }
  isFetchingLabels.value = true;
  try {
    const queryLabels = e.split(',').map(label => label.trim().toLowerCase());
    
    filteredLabels.value = labels.value.filter((item: any) => 
      item && item.name && queryLabels.some(queryLabel => 
        item.name.toLowerCase().includes(queryLabel)
      )
    );
  } catch (error) {
    filteredLabels.value = labels.value;
  } finally {
    isFetchingLabels.value = false;
  }
}

async function handleLabelEnterKey() {
  const uniqueLabels = selectedLabelArrayDuplicate?.value?.filter((item) => {
    return !newSession.value.labelIds.some((id) => id === item.id);
  });

  if(uniqueLabels){
    newSession.value.labelIds.push(...uniqueLabels.map((item) => item.id));
    newSession.value.labelIds = [...new Set(newSession.value.labelIds)];
  }
}

// Session Labels - for inline dropdown in table
const sessionLabels = ref<Array<{ id: string; name: string; description: string }>>([])
const isFetchingSessionLabels = ref(false)
const hasLoadedSessionLabels = ref(false)

// Session Status - for inline dropdown in table
const sessionStatusOptions = ref<Array<{ id: string; name: string; description: string }>>([])

async function fetchSessionLabels() {
  if (hasLoadedSessionLabels.value || isFetchingSessionLabels.value) return
  isFetchingSessionLabels.value = true
  try {
    const response = await $client.sessionLabel.list.query({ sort: [{ name: 'asc' }] });
    if (response && response.data && Array.isArray(response.data)) {
      sessionLabels.value = response.data.map((sessionLabel: any) => ({
        id: sessionLabel.id,
        name: sessionLabel.name || 'Unnamed Session Label',
        description: sessionLabel.description || ''
      }));
      
      // Also populate filter options
      sessionLabelsFilterOptions.value = response.data.map((sessionLabel: any) => ({
        id: sessionLabel.id,
        name: sessionLabel.name || 'Unnamed Session Label'
      }));
    } else {
      sessionLabels.value = [];
      sessionLabelsFilterOptions.value = [];
    }
  } catch (error) {
    sessionLabels.value = [];
    sessionLabelsFilterOptions.value = [];
  } finally {
    isFetchingSessionLabels.value = false;
    hasLoadedSessionLabels.value = true;
  }
}

const hasLoadedSessionStatus = ref(false)
async function fetchSessionStatus() {
  if (hasLoadedSessionStatus.value) return
  try {
    const response = await $client.dLSession.getAllSessionStatus.query();
    if (response && response.data && Array.isArray(response.data)) {
      // Filter out "locked" and "re-opened" statuses from dropdown
      sessionStatusOptions.value = response.data
        .filter((status: any) => {
          const statusName = status.name?.toLowerCase() || ''
          return statusName !== 'locked' && statusName !== 're-opened'
        })
        .map((status: any) => ({
          id: status.id,
          name: status.name || 'Unnamed Status',
          description: status.description || ''
        }));
      
      // Also populate filter options (include all statuses for filter)
      sessionStatusFilterOptions.value = response.data.map((status: any) => ({
        id: status.id,
        name: status.name || 'Unnamed Status'
      }));
    } else {
      sessionStatusOptions.value = [];
      sessionStatusFilterOptions.value = [];
    }
  } catch (error) {
    console.error('Error fetching session status:', error);
    sessionStatusOptions.value = [];
    sessionStatusFilterOptions.value = [];
  } finally {
    hasLoadedSessionStatus.value = true
  }
}

// Computed property to check if we're creating a new session (not editing)
const isCreatingNewSession = computed(() => {
  if (!newSession.value) return false;
  // If session doesn't have 'id' property or id is undefined/null, it's a new session
  return !('id' in newSession.value) || !newSession.value.id;
});

// Computed property for session status options with "Complete" disabled during creation
const sessionStatusOptionsForForm = computed(() => {
  return sessionStatusOptions.value.map(ss => {
    const statusName = ss.name.toLowerCase().trim();
    const isReopen = statusName === 're-open' || statusName === 'reopen';
    const isCompleted = statusName === 'completed';
    
    // Re-open is always disabled (both during creation and editing)
    // Completed is only disabled during creation
    const isDisabled = isReopen || (isCreatingNewSession.value && isCompleted);
    
    return {
      label: ss.name,
      value: ss.id,
      disabled: isDisabled
    };
  });
});

// LIST TAXONOMY
const taxonomy = ref<Taxonomy[]>([])
const filteredTaxonomys = ref<Taxonomy[]>([])

const structuredGroups = ref<StructureGroups[]>([])
const filteredStructuredGroups = ref<StructureGroups[]>([])

const isFetchingTaxonomy = ref(false)
const isFetchingStructureGroups = ref(false)
const hasLoadedStructureGroups = ref(false)

// async function fetchTaxonomies() {
//   isFetchingTaxonomy.value = true
//   await $client.taxonomy.list.query({ sort: [{ name: 'asc' }] }).then((response) => {
//     taxonomy.value = response.data
//   }).catch((error) => {
//     console.error(error)
//   })
//   filteredTaxonomys.value = taxonomy.value
//   isFetchingTaxonomy.value = false
// }

async function fetchStructureGroups() {
  if (hasLoadedStructureGroups.value || isFetchingStructureGroups.value) return
  isFetchingStructureGroups.value = true
  await $client.structures.list.query({ sort: [{ name: 'asc' }] }).then((response) => {
    structuredGroups.value = response.data
  }).catch((error) => {
  })
  filteredStructuredGroups.value = structuredGroups.value
  isFetchingStructureGroups.value = false
  hasLoadedStructureGroups.value = true
}

// FILTER TAXONOMY
async function handleStructureGroupSearch (query: string) {
  if (!query.length) {
    filteredTaxonomys.value = taxonomy.value
    return
  }
  isFetchingTaxonomy.value = true
  filteredTaxonomys.value = await taxonomy.value.filter(
    (item) => ~item.name.toLowerCase().indexOf(query.toLowerCase())
  )
  isFetchingTaxonomy.value = false
}

// FILTER TAXONOMY
async function handleTaxonomySearch (query: string) {
  if (!query.length) {
    filteredTaxonomys.value = taxonomy.value
    return
  }
  isFetchingTaxonomy.value = true
  filteredTaxonomys.value = await taxonomy.value.filter(
    (item) => ~item.name.toLowerCase().indexOf(query.toLowerCase())
  )
  isFetchingTaxonomy.value = false
}

const selectedArrayDuplicate = []

async function handleSearchAssignees (e?:any) {
  if (!e.length) {
    selectedArrayDuplicate.value = users.value
    return
  }
  let queryEmails = e.split(',').map(email => email.trim());

  selectedArrayDuplicate.value = await users.value.filter((item:any) => {
    return queryEmails.some(queryEmail => item.email.toLowerCase() == queryEmail.toLowerCase());
  })
}


async function handleEnterKey(type: string) {
  selectedArrayDuplicate.value.forEach((item)=>{
    var obj = {
      userId : item.user_id,
      userRole : type == "Assignees" ? "ACTIVITY" : 'QUALITY_CONTROLLER'
    }
    const isPresent: boolean = newSession.value.users.some(project => 
        project.userId === obj.userId && project.userRole === obj.userRole
    );
    if (!isPresent) {
      newSession.value.users.push(obj)
      const targetCountProp = type === 'Assignees' ? 'selectedAssigneesCount' : 'selectedReviewersCount';
      [targetCountProp].value = newSession.value.users.length;
    }
  })
}

const selectedApprovalUsers =  [];
const approvalOptions =  ref([]);

async function updateApprovedSelectOptions(selectedValues) {
  selectedApprovalUsers.length = 0;
  selectedValues.forEach((item) => {
    if (!selectedApprovalUsers.includes(item)) {
      selectedApprovalUsers.push(item);
    }
  })

  if (newSession?.value?.approval) {
    for (let i = 0; i < newSession.value.approval.length; i++) {
      if (newSession.value.approval[i]?.length) {
        newSession.value.approval[i] = newSession.value.approval[i].filter(value => selectedValues.includes(value));
      }
    }
  }
  approvalOptions.value = selectedApprovalUsers.length ? 
                          userOptions.value.filter(item => selectedApprovalUsers.includes(item.value)) :
                          userOptions.value.filter(userOption => {
    const dlSessionUsers = singleDLSession.value ? singleDLSession.value[0]?.users : [];
    return dlSessionUsers.some(session =>
      session.userId === userOption.value && session.userRole === 'QUALITY_CONTROLLER'
    );
  })

}

async function handleSelectAllAssignees() {
  if (selectAllAssignees.value ) {
    // Get all reviewers to check cross-field validation
    const reviewerUserIds = new Set<string>()
    const reviewerIds = (newSession.value?.users || [])
      .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
      .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
    
    // Collect all reviewer user IDs (individual users and group members)
    reviewerIds.forEach((id: string) => {
      if (id.includes('auth0|')) {
        // Individual user
        reviewerUserIds.add(id)
      } else {
        // Group - add all members
        const memberIds = getGroupMemberIds(id)
        memberIds.forEach((memberId: string) => reviewerUserIds.add(memberId))
      }
    })
    
    // VALIDATION: Check if any individual group members are currently selected in assignees
    const currentAssigneeIds = (newSession.value?.users || [])
      .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY')
      .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
    
    const selectedGroupIds = currentAssigneeIds.filter((id: string) => !id.includes('auth0|'))
    const selectedIndividualUserIds = currentAssigneeIds.filter((id: string) => id.includes('auth0|'))
    
    // Check if any individually selected users are members of groups that are NOT selected
    let hasIndividuallySelectedGroupMembers = false
    selectedIndividualUserIds.forEach((userId: string) => {
      userOptions.value.forEach((groupOption: any) => {
        if (groupOption._type === 'group' && groupOption._members && Array.isArray(groupOption._members)) {
          // If user is a member of a group AND that group is NOT selected
          if (groupOption._members.includes(userId) && !selectedGroupIds.includes(groupOption.value)) {
            hasIndividuallySelectedGroupMembers = true
          }
        }
      })
    })
    
    const allSelectableValues: string[] = []
    
    if (hasIndividuallySelectedGroupMembers) {
      // MODE 1: Only select individual users (respecting individual selection pattern)
      // Exclude users that are already in Reviewers
      userOptions.value.forEach((option: any) => {
        if (!option || !option.value) return
        
        // Select all individual users (both group members and non-group members)
        // BUT exclude those already in Reviewers
        if (option._type !== 'group' && option.value.includes('auth0|')) {
          if (!reviewerUserIds.has(option.value)) {
            allSelectableValues.push(option.value)
          }
        }
      })
    } else {
      // MODE 2: Select groups + individual users, but handle groups with members in Reviewers
      userOptions.value.forEach((option: any) => {
        if (!option || !option.value) return
        
        if (option._type === 'group') {
          // Check if this group has any members already in Reviewers
          const groupMemberIds = option._members && Array.isArray(option._members) 
            ? option._members 
            : getGroupMemberIds(option.value)
          
          const membersInReviewers = groupMemberIds.filter((memberId: string) => reviewerUserIds.has(memberId))
          
          if (membersInReviewers.length > 0) {
            // Group has some members in Reviewers - select remaining members individually
            const remainingMembers = groupMemberIds.filter((memberId: string) => !reviewerUserIds.has(memberId))
            remainingMembers.forEach((memberId: string) => {
              if (!allSelectableValues.includes(memberId)) {
                allSelectableValues.push(memberId)
              }
            })
          } else {
            // Group has no members in Reviewers - select entire group
            allSelectableValues.push(option.value)
          }
        } else if (option._type !== 'group' && option.value.includes('auth0|')) {
          // Individual user - check if they're a member of any group
          let isMemberOfGroup = false
          let isInGroupWithReviewers = false
          
          userOptions.value.forEach((groupOption: any) => {
            if (groupOption._type === 'group' && groupOption._members && Array.isArray(groupOption._members)) {
              if (groupOption._members.includes(option.value)) {
                isMemberOfGroup = true
                // Check if this group has any members in Reviewers
                const groupMemberIds = groupOption._members
                const hasMembersInReviewers = groupMemberIds.some((memberId: string) => reviewerUserIds.has(memberId))
                if (hasMembersInReviewers) {
                  isInGroupWithReviewers = true
                }
              }
            }
          })
          
          // Only add individual users that:
          // 1. Are NOT members of any group, OR
          // 2. Are members of groups that have NO members in Reviewers (group will be selected instead)
          // 3. Are NOT already in Reviewers
          if (!reviewerUserIds.has(option.value)) {
            if (!isMemberOfGroup || (isMemberOfGroup && !isInGroupWithReviewers)) {
              // If user is in a group with no reviewers, the group will be selected, so don't add individual
              if (!isMemberOfGroup) {
                allSelectableValues.push(option.value)
              }
            }
          }
        }
      })
    }
    
    // Update assignees by calling handleAssigneesUpdate directly
    await handleAssigneesUpdate(allSelectableValues)
  } else {
    newSession.value.users = newSession.value.users.filter((users)=> users.userRole != "ACTIVITY")
    selectedAssigneesCount.value = 0
    assigneesIndeterminate.value = false
    selectAllAssignees.value = false
  }
}

async function handleSelectAllReviewers() {
  if (selectAllReviewers.value ) {
    // Get all assignees to check cross-field validation
    const assigneeUserIds = new Set<string>()
    const assigneeIds = (newSession.value?.users || [])
      .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'ACTIVITY')
      .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
    
    // Collect all assignee user IDs (individual users and group members)
    assigneeIds.forEach((id: string) => {
      if (id.includes('auth0|')) {
        // Individual user
        assigneeUserIds.add(id)
      } else {
        // Group - add all members
        const memberIds = getGroupMemberIds(id)
        memberIds.forEach((memberId: string) => assigneeUserIds.add(memberId))
      }
    })
    
    // VALIDATION: Check if any individual group members are currently selected in reviewers
    const currentReviewerIds = (newSession.value?.users || [])
      .filter((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u && u.userRole === 'QUALITY_CONTROLLER')
      .map((u: UsersInDLSessions | UsersInCESessions | UsersInRASessions) => u.userId)
    
    const selectedGroupIds = currentReviewerIds.filter((id: string) => !id.includes('auth0|'))
    const selectedIndividualUserIds = currentReviewerIds.filter((id: string) => id.includes('auth0|'))
    
    // Check if any individually selected users are members of groups that are NOT selected
    let hasIndividuallySelectedGroupMembers = false
    selectedIndividualUserIds.forEach((userId: string) => {
      userOptions.value.forEach((groupOption: any) => {
        if (groupOption._type === 'group' && groupOption._members && Array.isArray(groupOption._members)) {
          // If user is a member of a group AND that group is NOT selected
          if (groupOption._members.includes(userId) && !selectedGroupIds.includes(groupOption.value)) {
            hasIndividuallySelectedGroupMembers = true
          }
        }
      })
    })
    
    const allSelectableValues: string[] = []
    
    if (hasIndividuallySelectedGroupMembers) {
      // MODE 1: Only select individual users (respecting individual selection pattern)
      // Exclude users that are already in Assignees
      userOptions.value.forEach((option: any) => {
        if (!option || !option.value) return
        
        // Select all individual users (both group members and non-group members)
        // BUT exclude those already in Assignees
        if (option._type !== 'group' && option.value.includes('auth0|')) {
          if (!assigneeUserIds.has(option.value)) {
            allSelectableValues.push(option.value)
          }
        }
      })
    } else {
      // MODE 2: Select groups + individual users, but handle groups with members in Assignees
      userOptions.value.forEach((option: any) => {
        if (!option || !option.value) return
        
        if (option._type === 'group') {
          // Check if this group has any members already in Assignees
          const groupMemberIds = option._members && Array.isArray(option._members) 
            ? option._members 
            : getGroupMemberIds(option.value)
          
          const membersInAssignees = groupMemberIds.filter((memberId: string) => assigneeUserIds.has(memberId))
          
          if (membersInAssignees.length > 0) {
            // Group has some members in Assignees - select remaining members individually
            const remainingMembers = groupMemberIds.filter((memberId: string) => !assigneeUserIds.has(memberId))
            remainingMembers.forEach((memberId: string) => {
              if (!allSelectableValues.includes(memberId)) {
                allSelectableValues.push(memberId)
              }
            })
          } else {
            // Group has no members in Assignees - select entire group
            allSelectableValues.push(option.value)
          }
        } else if (option._type !== 'group' && option.value.includes('auth0|')) {
          // Individual user - check if they're a member of any group
          let isMemberOfGroup = false
          let isInGroupWithAssignees = false
          
          userOptions.value.forEach((groupOption: any) => {
            if (groupOption._type === 'group' && groupOption._members && Array.isArray(groupOption._members)) {
              if (groupOption._members.includes(option.value)) {
                isMemberOfGroup = true
                // Check if this group has any members in Assignees
                const groupMemberIds = groupOption._members
                const hasMembersInAssignees = groupMemberIds.some((memberId: string) => assigneeUserIds.has(memberId))
                if (hasMembersInAssignees) {
                  isInGroupWithAssignees = true
                }
              }
            }
          })
          
          // Only add individual users that:
          // 1. Are NOT members of any group, OR
          // 2. Are members of groups that have NO members in Assignees (group will be selected instead)
          // 3. Are NOT already in Assignees
          if (!assigneeUserIds.has(option.value)) {
            if (!isMemberOfGroup || (isMemberOfGroup && !isInGroupWithAssignees)) {
              // If user is in a group with no assignees, the group will be selected, so don't add individual
              if (!isMemberOfGroup) {
                allSelectableValues.push(option.value)
              }
            }
          }
        }
      })
    }
    
    // Update reviewers by calling handleReviewersUpdate directly
    await handleReviewersUpdate(allSelectableValues)
  } else {
    newSession.value.users = newSession.value.users.filter((users)=> users.userRole != "QUALITY_CONTROLLER")
    selectedReviewersCount.value = 0
    reviewersIndeterminate.value = false
    selectAllReviewers.value = false
    newSession.value.approval = []
    approvalOptions.value = [];
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

// Label CSV file Upload
const fileInput = ref<HTMLInputElement | null>(null);

// Session file upload - Multiple files support
const sessionUploadRef = ref<UploadInst | null>(null);
const sessionFileInfo = ref<UploadFileInfo | null>(null);
const sessionFiles = ref<UploadFileInfo[]>([]);
const uploadedJsonFiles = ref<Array<{ id: string; filename: string; createdAt: Date }>>([]);
const isFetchingUploadedFiles = ref(false);

// Upload mode: 'local' for local file upload, 's3' for S3 upload
const uploadMode = ref<'local' | 's3'>('local');

// S3 Modal reactive variables
const isPushToS3Modal = ref<boolean>(false);
const s3ModalMode = ref<'push' | 'upload'>('upload');
const s3Config = ref({
  s3Key: '',
});

// Watch sessionFiles to ensure empty files and non-JSON files are never in the list
watch(sessionFiles, (newFiles) => {
  const validFiles = newFiles.filter((fileInfo) => {
    if (!fileInfo.file) return false;
    
    // Filter out empty files
    if (fileInfo.file.size === 0) {
      notification.error({
        title: 'Empty File',
        content: `File "${fileInfo.file.name}" is empty and has been removed.`,
        duration: 3000,
        closable: true
      });
      return false;
    }
    
    // Filter out non-JSON files
    const fileName = fileInfo.file.name.toLowerCase();
    const fileType = fileInfo.file.type;
    const isJson = fileName.endsWith('.json') || fileType === 'application/json';
    
    if (!isJson) {
      notification.error({
        title: 'Invalid File Type',
        content: `File "${fileInfo.file.name}" is not a JSON file and has been removed. Only JSON files are allowed.`,
        duration: 3000,
        closable: true
      });
      return false;
    }
    
    return true;
  });
  
  // Only update if we filtered out any invalid files
  if (validFiles.length !== newFiles.length) {
    sessionFiles.value = validFiles;
    sessionFileInfo.value = validFiles.length > 0 ? validFiles[validFiles.length - 1] : null;
  }
}, { deep: true, immediate: true });
const hasPendingImages = ref<boolean>(false);
const isCheckingPendingImages = ref<boolean>(false);

// Duplicate confirmation state
const showDuplicateConfirmationModal = ref<boolean>(false);
const duplicateInfo = ref<{ 
  filesWithDuplicates: Array<{ filename: string, totalImages: number, duplicateCount: number }>, 
  totalDuplicates: number, 
  totalImages: number 
} | null>(null);
const pendingUploadFiles = ref<Array<{ file: File, filename: string, extractedResources: ExtractedResource[], fileType: string, buffer: ArrayBuffer, base64: string }>>([]);
const pendingUploadSessionId = ref<string | null>(null);

// Check if session has pending images
async function checkPendingImages(sessionId: string) {
  if (!sessionId || activeTab.value !== 'dLSession') {
    hasPendingImages.value = false;
    return;
  }
  
  isCheckingPendingImages.value = true;
  try {
    // Query for pending images count
    const response = await $client.dLSession.listExtractedResourcesTotalCount.query({
      filter: {
        dLSessionId: sessionId,
        status: 'PENDING',
      },
      limit: 1,
      offset: 0,
      sort: [],
    });
    
    hasPendingImages.value = (response.totalCount || 0) > 0;
  } catch (error) {
    hasPendingImages.value = false;
  } finally {
    isCheckingPendingImages.value = false;
  }
}

// Fetch uploaded JSON files for a session
async function fetchUploadedJsonFiles(sessionId: string) {
  if (!sessionId || activeTab.value !== 'dLSession') {
    uploadedJsonFiles.value = [];
    return;
  }
  
  isFetchingUploadedFiles.value = true;
  try {
    // Use the one endpoint which should include relations - it expects a string UUID directly
    const session = await $client.dLSession.one.query(sessionId);
    
    if (session && (session as any).dLSessionJsons) {
      // Backend already returns files sorted in descending order by createdAt (newest first)
      uploadedJsonFiles.value = (session as any).dLSessionJsons.map((json: any) => ({
        id: json.id,
        filename: json.filename,
        createdAt: new Date(json.createdAt)
      }));
    } else {
      uploadedJsonFiles.value = [];
    }
  } catch (error) {
    console.error('Error fetching uploaded JSON files:', error);
    uploadedJsonFiles.value = [];
  } finally {
    isFetchingUploadedFiles.value = false;
  }
}

// Display all files - CSS will handle showing only 3 with scrollbar if needed
const displayedUploadedFiles = computed(() => {
  return uploadedJsonFiles.value;
})

// Validate file before it's added to the upload list
function beforeUploadFile(data: { file: File; fileList: UploadFileInfo[] }) {
  const file = data.file;
  if (!file) {
    return false;
  }
  
  // Check if file is empty (0 bytes)
  if (file.size === 0) {
    notification.error({
      title: 'Empty File',
      content: `File "${file.name}" is empty. Please upload a file with content.`,
      duration: 3000,
      closable: true
    });
    return false; // Reject the file - prevents it from being added to the list
  }
  
  const fileName = file.name.toLowerCase();
  const fileType = file.type;
  
  // Check if file is JSON by extension or MIME type
  const isJson = fileName.endsWith('.json') || fileType === 'application/json';
  
  if (!isJson) {
    notification.error({
      title: 'Invalid File Type',
      content: `File "${file.name}" is not a JSON file. Only JSON files are allowed.`,
      duration: 3000,
      closable: true
    });
    return false; // Reject the file - prevents it from being added to the list
  }
  
  return true; // Accept the file
}

async function handleSessionFileChange(data: { fileList: UploadFileInfo[] }) {
  const fileList = data.fileList || [];
  
  // First, immediately filter out files that are clearly invalid (empty size, no file object, non-JSON)
  const filesToRemoveImmediately: string[] = [];
  const initialValidFiles = fileList.filter((fileInfo) => {
    if (!fileInfo.file) {
      if (fileInfo.id) filesToRemoveImmediately.push(fileInfo.id);
      return false;
    }
    // Immediately reject empty files
    if (fileInfo.file.size === 0) {
      notification.error({
        title: 'Empty File',
        content: `File "${fileInfo.file.name}" is empty. Please upload a file with content.`,
        duration: 3000,
        closable: true
      });
      if (fileInfo.id) filesToRemoveImmediately.push(fileInfo.id);
      return false;
    }
    
    // Immediately reject non-JSON files
    const fileName = fileInfo.file.name.toLowerCase();
    const fileType = fileInfo.file.type;
    const isJson = fileName.endsWith('.json') || fileType === 'application/json';
    
    if (!isJson) {
      notification.error({
        title: 'Invalid File Type',
        content: `File "${fileInfo.file.name}" is not a JSON file. Only JSON files are allowed.`,
        duration: 3000,
        closable: true
      });
      if (fileInfo.id) filesToRemoveImmediately.push(fileInfo.id);
      return false;
    }
    
    return true;
  });
  
  // If we filtered out any files, update the list immediately to prevent them from showing
  // Since we're using v-model:file-list, updating sessionFiles.value will update the component
  // Update synchronously to prevent non-JSON files from appearing
  if (initialValidFiles.length !== fileList.length) {
    sessionFiles.value = initialValidFiles;
  }
  
  // Filter out any non-JSON files and validate JSON content
  const validJsonFiles: UploadFileInfo[] = [];
  const filesToRemove: string[] = [];
  
  for (const fileInfo of initialValidFiles) {
    if (!fileInfo.file) continue;
    
    const fileName = fileInfo.file.name.toLowerCase();
    const fileType = fileInfo.file.type;
    
    // Check if file is JSON by extension or MIME type
    const isJson = fileName.endsWith('.json') || fileType === 'application/json';
    
    if (!isJson) {
      // Mark non-JSON files for removal
      notification.warning({
        title: 'Invalid File Type',
        content: `File "${fileInfo.file.name}" has been removed. Only JSON files are allowed.`,
        duration: 3000,
        closable: true
      });
      
      if (fileInfo.id) {
        filesToRemove.push(fileInfo.id);
      }
      continue;
    }
    
    // Validate JSON file content (check if empty)
    try {
      const fileContent = await readFileContent(fileInfo.file);
      
      // Check if file is empty (no content or only whitespace)
      if (!fileContent || !fileContent.trim()) {
        notification.error({
          title: 'Empty File',
          content: `File "${fileInfo.file.name}" is empty. Please upload a file with content.`,
          duration: 3000,
          closable: true
        });
        
        if (fileInfo.id) {
          filesToRemove.push(fileInfo.id);
        }
        continue;
      }
      
      // Try to parse JSON to check if it's valid
      const result = JSON.parse(fileContent);
      
      // Check if parsed JSON is empty (null, empty object, or empty array)
      if (result === null || 
          (typeof result === 'object' && Object.keys(result).length === 0 && !Array.isArray(result)) ||
          (Array.isArray(result) && result.length === 0)) {
        notification.error({
          title: 'Empty JSON',
          content: `File "${fileInfo.file.name}" contains empty JSON. Please upload a file with valid data.`,
          duration: 3000,
          closable: true
        });
        
        if (fileInfo.id) {
          filesToRemove.push(fileInfo.id);
        }
        continue;
      }
      
      // Check if extractedResources exists and is not empty
      const formattedData = result.extractedResources ? 
        result : 
        {
          extractedResources: Array.isArray(result) ? result : [result]
        };
      
      if (!formattedData.extractedResources || 
          (Array.isArray(formattedData.extractedResources) && formattedData.extractedResources.length === 0)) {
        notification.error({
          title: 'No Data',
          content: `File "${fileInfo.file.name}" does not contain any extracted resources. Please upload a file with data.`,
          duration: 3000,
          closable: true
        });
        
        if (fileInfo.id) {
          filesToRemove.push(fileInfo.id);
        }
        continue;
      }

      // Validate JSON structure (legacy keys, taxonomyData, labels format)
      const validationError = validateExtractedResourcesStructure(formattedData.extractedResources, fileInfo.file.name);
      if (validationError) {
        notification.error({
          title: 'Invalid JSON Structure',
          content: validationError,
          duration: 5000,
          closable: true,
        });
        
        if (fileInfo.id) {
          filesToRemove.push(fileInfo.id);
        }
        continue;
      }
      
      // File is valid, add to list
      validJsonFiles.push(fileInfo);
    } catch (parseError: any) {
      notification.error({
        title: 'Invalid JSON',
        content: `File "${fileInfo.file.name}" contains invalid JSON: ${parseError.message || 'Parse error'}`,
        duration: 3000,
        closable: true
      });
      
      if (fileInfo.id) {
        filesToRemove.push(fileInfo.id);
      }
      continue;
    }
  }
  
  // Invalid files are already filtered out in validJsonFiles, so we just update the list
  
  // Filter out any files that might have been missed (double-check for empty files)
  const finalValidFiles = validJsonFiles.filter((fileInfo) => {
    if (!fileInfo.file) return false;
    // Ensure file is not empty
    if (fileInfo.file.size === 0) return false;
    return true;
  });
  
  // Update the file list to only include valid JSON files (no empty files)
  // Only update if the list has actually changed to prevent infinite loops
  if (JSON.stringify(sessionFiles.value.map(f => f.id)) !== JSON.stringify(finalValidFiles.map(f => f.id))) {
    sessionFiles.value = finalValidFiles;
    sessionFileInfo.value = finalValidFiles.length > 0 ? finalValidFiles[finalValidFiles.length - 1] : null;
  }
}

// Helper function to read file content
function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File is null or undefined'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          resolve(event.target.result as string)
        } else {
          reject(new Error('Failed to read file: No result from FileReader'))
        }
      } catch (error: any) {
        reject(new Error(`Error processing file: ${error.message}`))
      }
    }
    
    reader.onerror = (error) => {
      reject(new Error(`FileReader error: ${error.type || 'Unknown error'}`))
    }
    
    reader.onabort = () => {
      reject(new Error('File reading was aborted'))
    }
    
    try {
      reader.readAsText(file)
    } catch (error: any) {
      reject(new Error(`Error starting file read: ${error.message}`))
    }
  })
}

// Function to read file as buffer (binary) and return buffer with file type
function readFileAsBuffer(file: File): Promise<{ buffer: ArrayBuffer; fileType: string; base64: string }> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File is null or undefined'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        if (event.target?.result instanceof ArrayBuffer) {
          // Convert ArrayBuffer to base64 for transmission
          const bytes = new Uint8Array(event.target.result)
          const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
          const base64 = btoa(binary)
          
          resolve({
            buffer: event.target.result,
            fileType: file.type || 'application/octet-stream',
            base64: base64
          })
        } else {
          reject(new Error('Failed to read file: Result is not an ArrayBuffer'))
        }
      } catch (error: any) {
        reject(new Error(`Error processing file: ${error.message}`))
      }
    }
    
    reader.onerror = (error) => {
      reject(new Error(`FileReader error: ${error.type || 'Unknown error'}`))
    }
    
    reader.onabort = () => {
      reject(new Error('File reading was aborted'))
    }
    
    try {
      reader.readAsArrayBuffer(file)
    } catch (error: any) {
      reject(new Error(`Error starting file read: ${error.message}`))
    }
  })
}


function showFileUploadSuccessMessage(uploadResult: { totalLinked: number; totalSkipped: number; uploadedFilesList: Array<{ filename: string; count: number }> }) {
  // Only show success message if files were uploaded
  if (uploadResult.totalLinked > 0 && uploadResult.uploadedFilesList && uploadResult.uploadedFilesList.length > 0) {
    let successMessage = 'The File Extracted Successfully .\n'
    
    uploadResult.uploadedFilesList.forEach((fileInfo, index) => {
      if (index > 0) {
        successMessage += '\n'
      }
      successMessage += ` • File Name : ${fileInfo.filename} and Linked ${fileInfo.count} resource${fileInfo.count === 1 ? '' : 's'}.\n`
    })
    
    if (uploadResult.totalSkipped > 0) {
      const duplicateText = uploadResult.totalSkipped === 1 ? 'image' : 'image\'s'
      successMessage += `Then ${uploadResult.totalSkipped} duplicate's ${duplicateText} are skipped .`
    }
    
    notification.success({ 
      content: successMessage,
      duration: 11000, 
      closable: true,
    })
  }
}

// Check for duplicates and show confirmation if needed
// Type definitions for file data
type PreparedFileData = {
  file: File;
  filename: string;
  extractedResources: any[];
};

// Helper: Validate filename
function validateFilename(filename: string): boolean {
  const trimmed = filename.trim();
  if (!trimmed || trimmed.startsWith('.')) {
    notification.error({
      title: 'Error',
      content: `Filename cannot be empty: ${filename}`,
      duration: 5000,
      closable: true,
    });
    return false;
  }
  return true;
}

// Helper function to remove assignees and reviewers from extractedResources
function cleanExtractedResources(resources: ExtractedResource[]): ExtractedResource[] {
  return resources.map((resource) => {
    const { assignees, reviewers, ...rest } = resource as ExtractedResource & { assignees?: unknown; reviewers?: unknown };
    return rest as ExtractedResource;
  });
}

// Helper: Parse JSON file content and extract resources
function parseJsonFileContent(fileContent: string): { extractedResources: ExtractedResource[] } {
  const result = JSON.parse(fileContent) as { extractedResources?: ExtractedResource[] } | ExtractedResource[] | ExtractedResource;
  return result && typeof result === 'object' && 'extractedResources' in result
    ? { extractedResources: result.extractedResources || [] }
    : { extractedResources: Array.isArray(result) ? result : [result as ExtractedResource] };
}

// Helper: Validate extracted resources structure (legacy keys, taxonomyData, labels format)
function validateExtractedResourcesStructure(
  extractedResources: ExtractedResource[],
  filename: string
): string | null {
  if (!extractedResources || !Array.isArray(extractedResources)) {
    return `File "${filename}": extractedResources must be an array.`;
  }

  for (let i = 0; i < extractedResources.length; i++) {
    const resource = extractedResources[i];

    // Check for legacy labelIds usage
    if (resource.labelIds && Array.isArray(resource.labelIds) && resource.labelIds.length > 0) {
      // If labelIds exists but labels is missing or empty, this is legacy JSON
      if (!resource.labels || !Array.isArray(resource.labels) || resource.labels.length === 0) {
        return `File "${filename}": uses legacy field "labelIds". Please provide labels as "labels": [{ "id": "<uuid>" }].`;
      }
      // If both exist, fail to avoid ambiguity
      return `File "${filename}": contains both "labels" and "labelIds". Please use only "labels": [{ "id": "<uuid>" }].`;
    }

    // Validate labels structure if present
    if (resource.labels && Array.isArray(resource.labels)) {
      for (let j = 0; j < resource.labels.length; j++) {
        const label = resource.labels[j];
        if (!label || typeof label !== 'object' || !label.id || typeof label.id !== 'string') {
          return `File "${filename}": each entry in "labels" must have an "id" field.`;
        }
        // Basic UUID format check (8-4-4-4-12 hex characters)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(label.id)) {
          return `File "${filename}": invalid UUID format in labels[${j}].id: "${label.id}".`;
        }
      }
    }

  // Validate taxonomyData / child taxonomy structure
  if (resource.taxonomy && Array.isArray(resource.taxonomy)) {
    for (let k = 0; k < resource.taxonomy.length; k++) {
      // Use any to allow checking legacy keys like childTaxonomy
      const taxonomyItem: any = resource.taxonomy[k];

      // Detect legacy childTaxonomy usage (old schema) when childAnnotation is missing
      if (!taxonomyItem.childAnnotation && Array.isArray(taxonomyItem.childTaxonomy)) {
        return `File "${filename}": uses legacy field "childTaxonomy". Please rename "childTaxonomy" to "childAnnotation" for annotation "${taxonomyItem.annotationId || 'unknown'}".`;
      }

      // Check if childAnnotation is valid if present
      if (taxonomyItem.childAnnotation && (!Array.isArray(taxonomyItem.childAnnotation))) {
        return `File "${filename}": "childAnnotation" must be an array for taxonomy annotation "${taxonomyItem.annotationId || 'unknown'}".`;
      }

        // Check if taxonomyData exists and is a non-empty object
        if (!taxonomyItem.taxonomyData || 
            typeof taxonomyItem.taxonomyData !== 'object' || 
            Array.isArray(taxonomyItem.taxonomyData) ||
            Object.keys(taxonomyItem.taxonomyData).length === 0) {
          return `File "${filename}": field "taxonomyData" is required for taxonomy annotations (annotationId: "${taxonomyItem.annotationId || 'unknown'}").`;
        }

        // Validate childAnnotation taxonomyData if present
        if (taxonomyItem.childAnnotation && Array.isArray(taxonomyItem.childAnnotation)) {
          for (let l = 0; l < taxonomyItem.childAnnotation.length; l++) {
            const childItem = taxonomyItem.childAnnotation[l];
            if (!childItem.taxonomyData || 
                typeof childItem.taxonomyData !== 'object' || 
                Array.isArray(childItem.taxonomyData) ||
                Object.keys(childItem.taxonomyData).length === 0) {
              return `File "${filename}": field "taxonomyData" is required for childAnnotation "${childItem.annotationId || 'unknown'}" under parent annotation "${taxonomyItem.annotationId || 'unknown'}".`;
            }
          }
        }
      }
    }
  }

  return null; // No validation errors
}

// Helper: Read and parse a single file
async function readAndParseFile(uploadFile: UploadFileInfo): Promise<PreparedFileData | null> {
  if (!uploadFile.file) {
    return null;
  }
  
  const file = uploadFile.file;
  const filename = file.name.trim();
  
  if (!validateFilename(filename)) {
    return null;
  }
  
  try {
    const fileContent = await readFileContent(file);
    const formattedData = parseJsonFileContent(fileContent);
    
    // Validate JSON structure before processing
    const validationError = validateExtractedResourcesStructure(formattedData.extractedResources, filename);
    if (validationError) {
      notification.error({
        title: 'Invalid JSON Structure',
        content: validationError,
        duration: 5000,
        closable: true,
      });
      return null;
    }
    
    return {
      file,
      filename,
      extractedResources: cleanExtractedResources(formattedData.extractedResources)
    };
      } catch (fileError: unknown) {
        const errorMessage = formatErrorMessage(fileError)
        notification.error({
          title: 'Error',
          content: `Error reading file "${filename}": ${errorMessage}`,
          duration: 5000,
          closable: true,
        });
        return null;
      }
}

// Helper: Prepare file data by reading files (can run in parallel with session create/update)
async function prepareFilesData(files: UploadFileInfo[]): Promise<PreparedFileData[]> {
  if (!files || files.length === 0) {
    return [];
  }
  
  // Only handle JSON uploads for DL Sessions 
  if (activeTab.value !== 'dLSession') {
    return [];
  }
  
  try {
    // Read all files and collect extracted resources in parallel
    const fileReadPromises = files.map(readAndParseFile);
    const results = await Promise.all(fileReadPromises);
    
    const filesData = results.filter((r): r is PreparedFileData => r !== null);
    
    if (filesData.length === 0) {
      notification.error({ 
        title: 'Error',
        content: 'No valid files to upload', 
        duration: 5000,
        closable: true,
      });
      return [];
    }
    
    return filesData;
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Error during file preparation',
      duration: 5000,
      closable: true,
    });
    return [];
  }
}

// Type definitions for duplicate check
type DuplicateCheckResult = {
  filename: string;
  hasDuplicates: boolean;
  duplicateCount: number;
  totalImages?: number;
};

type DuplicateCheckSummary = {
  filesWithDuplicates: Array<{ filename: string; totalImages: number; duplicateCount: number }>;
  totalDuplicates: number;
  totalImages: number;
};

// Helper: Check duplicates for a single file
async function checkFileDuplicates(
  fileData: PreparedFileData,
  sessionId: string
): Promise<DuplicateCheckResult> {
  const fileResourceIds = fileData.extractedResources.map((r: any) => r.id).filter(Boolean);
  
  if (fileResourceIds.length === 0) {
    return {
      filename: fileData.filename,
      hasDuplicates: false,
      duplicateCount: 0,
      totalImages: 0
    };
  }
  
  try {
    const duplicateCheck = await $client.dLSession.linkExtractedResources.mutate({
      dLSessionId: sessionId,
      filename: fileData.filename,
      extractedResources: cleanExtractedResources(fileData.extractedResources),
      returnDuplicateInfo: true,
    }) as DuplicateCheckResponse;

    return {
      filename: fileData.filename,
      hasDuplicates: duplicateCheck?.hasDuplicates || false,
      duplicateCount: duplicateCheck?.duplicateCount || 0,
      totalImages: fileData.extractedResources.length
    };
  } catch (error: any) {
    // If error, assume no duplicates for this file
    return {
      filename: fileData.filename,
      hasDuplicates: false,
      duplicateCount: 0,
      totalImages: fileData.extractedResources.length
    };
  }
}

// Helper: Aggregate duplicate check results
function aggregateDuplicateResults(results: DuplicateCheckResult[]): DuplicateCheckSummary {
  const filesWithDuplicates: Array<{ filename: string; totalImages: number; duplicateCount: number }> = [];
  let totalDuplicates = 0;
  let totalImages = 0;
  
  results.forEach((result) => {
    const imageCount = result.totalImages || 0;
    totalImages += imageCount;
    
    if (result.hasDuplicates) {
      filesWithDuplicates.push({
        filename: result.filename,
        totalImages: imageCount,
        duplicateCount: result.duplicateCount || 0,
      });
      totalDuplicates += result.duplicateCount || 0;
    }
  });
  
  return {
    filesWithDuplicates,
    totalDuplicates,
    totalImages
  };
}

// Helper: Check duplicates and upload files in parallel
async function checkAndUploadFilesParallel(
  filesData: PreparedFileData[], 
  sessionId: string, 
  suppressSuccessMessage: boolean = false
) {
  if (!filesData || filesData.length === 0 || !sessionId) {
    return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] };
  }
  
  // Only handle JSON uploads for DL Sessions 
  if (activeTab.value !== 'dLSession') {
    return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] };
  }
  
  try {
    // Check for duplicates in parallel for all files (using PreparedFileData is sufficient)
    const duplicateCheckPromises = filesData.map(fileData => checkFileDuplicates(fileData, sessionId));
    const duplicateCheckResults = await Promise.all(duplicateCheckPromises);
    
    // Aggregate results
    const summary = aggregateDuplicateResults(duplicateCheckResults);
    
    if (summary.filesWithDuplicates.length > 0) {
      // Convert PreparedFileData to full file data structure with fileType, buffer, and base64
      const filesDataWithBuffers = await Promise.all(
        filesData.map(async (fileData) => {
          const fileBufferData = await readFileAsBuffer(fileData.file);
          return {
            ...fileData,
            fileType: fileBufferData.fileType,
            buffer: fileBufferData.buffer,
            base64: fileBufferData.base64
          };
        })
      );
      
      // Show confirmation modal
      duplicateInfo.value = {
        filesWithDuplicates: summary.filesWithDuplicates,
        totalDuplicates: summary.totalDuplicates,
        totalImages: summary.totalImages,
      };
      pendingUploadFiles.value = filesDataWithBuffers; // Store full structure
      pendingUploadSessionId.value = sessionId;
      showDuplicateConfirmationModal.value = true;
      return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [], pending: true };
    }
    
    // No duplicates - convert and proceed with upload
    const filesDataWithBuffers = await Promise.all(
      filesData.map(async (fileData) => {
        const fileBufferData = await readFileAsBuffer(fileData.file);
        return {
          ...fileData,
          fileType: fileBufferData.fileType,
          buffer: fileBufferData.buffer,
          base64: fileBufferData.base64
        };
      })
    );
    
    return await processFileUploads(filesDataWithBuffers, sessionId, false, suppressSuccessMessage);
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Error during file processing',
      duration: 5000,
      closable: true,
    });
    return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] };
  }
}

async function checkAndUploadFiles(files: UploadFileInfo[], sessionId: string, suppressSuccessMessage: boolean = false) {
  if (!files || files.length === 0 || !sessionId) {
    return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] };
  }
  
  // Only handle JSON uploads for DL Sessions 
  if (activeTab.value !== 'dLSession') {
    return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] };
  }
  
  const filesData: Array<{ file: File, filename: string, extractedResources: ExtractedResource[], fileType: string, buffer: ArrayBuffer, base64: string }> = []
  
  try {
    // Read all files and collect extracted resources
    for (const uploadFile of files) {
      if (!uploadFile.file) continue
      
      const file = uploadFile.file
      const filename = file.name.trim()
      
      if (filename.startsWith('.')) {
        notification.error({
          title: 'Error',
          content: `Filename cannot be empty: ${filename}`,
          duration: 5000,
          closable: true,
        })
        continue
      }
      
      // Read file content (files should already be validated during upload, but read for processing)
      try {
        // Read file as text for JSON parsing
        const fileContent = await readFileContent(file)
        const result = JSON.parse(fileContent)
        const formattedData = result.extractedResources ? 
          result : 
          {
            extractedResources: Array.isArray(result) ? result : [result]
          }
        
        // Read file as buffer (binary) with file type
        const fileBufferData = await readFileAsBuffer(file)
        
        filesData.push({
          file,
          filename,
          extractedResources: cleanExtractedResources(formattedData.extractedResources),
          fileType: fileBufferData.fileType,
          buffer: fileBufferData.buffer,
          base64: fileBufferData.base64
        })
      } catch (fileError: unknown) {
        const errorMessage = formatErrorMessage(fileError)
        notification.error({
          title: 'Error',
          content: `Error reading file "${filename}": ${errorMessage}`,
          duration: 5000,
          closable: true,
        })
        continue
      }
    }
    
    if (filesData.length === 0) {
      notification.error({ 
        title: 'Error',
        content: 'No valid files to upload', 
        duration: 5000,
        closable: true,
      })
      return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] }
    }
    
    // Check for duplicates using returnDuplicateInfo flag
    const filesWithDuplicates: Array<{ filename: string, totalImages: number, duplicateCount: number }> = []
    let totalDuplicates = 0
    let totalImages = 0
    
    // Calculate total images across all files
    filesData.forEach(fileData => {
      totalImages += fileData.extractedResources.length
    })
    
    for (const fileData of filesData) {
      const fileResourceIds = fileData.extractedResources.map((r: any) => r.id).filter(Boolean)
      
      if (fileResourceIds.length > 0) {
        try {
          // Use linkExtractedResources with returnDuplicateInfo=true to check duplicates
          const duplicateCheck = await $client.dLSession.linkExtractedResources.mutate({
            dLSessionId: sessionId,
            filename: fileData.filename,
            extractedResources: cleanExtractedResources(fileData.extractedResources),
            returnDuplicateInfo: true,
            fileType: fileData.fileType,
            fileBuffer: fileData.base64, // Send base64 encoded buffer
          }) as DuplicateCheckResponse

          if (duplicateCheck && duplicateCheck.hasDuplicates) {
            filesWithDuplicates.push({
              filename: fileData.filename,
              totalImages: fileData.extractedResources.length,
              duplicateCount: duplicateCheck.duplicateCount || 0,
            })
            totalDuplicates += duplicateCheck.duplicateCount || 0
          }
        } catch (error: any) {
          // If error, assume no duplicates for this file
          // Don't throw - continue processing other files
        }
      }
    }
    
    if (filesWithDuplicates.length > 0) {
      // Show confirmation modal
      duplicateInfo.value = {
        filesWithDuplicates,
        totalDuplicates,
        totalImages,
      }
      pendingUploadFiles.value = filesData
      pendingUploadSessionId.value = sessionId
      showDuplicateConfirmationModal.value = true
      return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [], pending: true }
    } else {
      // No duplicates, proceed with upload
      return await processFileUploads(filesData, sessionId, false, true)
    }
  } catch (error: unknown) {
    const errorMessage = formatErrorMessage(error)
    notification.error({
      title: 'Error',
      content: `Error during file processing: ${errorMessage}`,
      duration: 5000,
      closable: true,
    })
    return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] }
  }
}

// Process multiple file uploads (actual upload logic)
async function processFileUploads(filesData: Array<{ file: File, filename: string, extractedResources: ExtractedResource[], fileType: string, buffer: ArrayBuffer, base64: string }>, sessionId: string, skipDuplicates: boolean = false, suppressSuccessMessage: boolean = false): Promise<FileUploadResult> {
  let totalLinked = 0
  let totalSkipped = 0
  const uploadedFilesList: Array<{ filename: string, count: number }> = []
  
  try {
    // Process each file
    for (const fileData of filesData) {
      try {
        const result = await $client.dLSession.linkExtractedResources.mutate({
          dLSessionId: sessionId,
          filename: fileData.filename,
          extractedResources: cleanExtractedResources(fileData.extractedResources),
          skipDuplicates: skipDuplicates,
          fileType: fileData.fileType,
          fileBuffer: fileData.base64, // Send base64 encoded buffer
        })
        
        totalLinked += result.count
        const skipped = fileData.extractedResources.length - result.count
        if (skipped > 0) {
          totalSkipped += skipped
        }
        
        // Track successful uploads for the list
        uploadedFilesList.push({
          filename: fileData.filename,
          count: result.count
        })
      } catch (error: unknown) {
        const errorMessage = formatErrorMessage(error)
        const errorWithCode = error as ErrorWithCode
        
        // Handle duplicate error from service layer
        if (errorWithCode?.data?.code === 'CONFLICT' || errorMessage.toLowerCase().includes('already exist') || errorMessage.toLowerCase().includes('duplicate')) {
          notification.warning({ 
            title: 'Warning',
            content: `File "${fileData.filename}": ${errorMessage}`,
            duration: 5000,
            closable: true,
          })
        } else {
          notification.error({
            title: 'Error',
            content: `Error uploading file "${fileData.filename}": ${errorMessage}`,
            duration: 5000,
            closable: true,
          })
        }
      }
    }
    
    // Show success message with file list only if not suppressed
    if (!suppressSuccessMessage) {
      showFileUploadSuccessMessage({ totalLinked, totalSkipped, uploadedFilesList })
    }
    
    return { totalLinked, totalSkipped, uploadedFilesList }
  } catch (error: any) {
    notification.error({
      title: 'Error',
      content: error.message || 'Error during upload',
      duration: 5000,
      closable: true,
    })
    return { totalLinked: 0, totalSkipped: 0, uploadedFilesList: [] }
  }
}

// Handle duplicate confirmation modal responses
async function handleDuplicateConfirmation(proceed: boolean) {
  const sessionId = pendingUploadSessionId.value
  showDuplicateConfirmationModal.value = false
  
  if (proceed && pendingUploadFiles.value.length > 0 && sessionId) {
    // Filter out files where all images are duplicates (skip them completely)
    const filesToUpload = pendingUploadFiles.value.filter((fileData) => {
      if (!duplicateInfo.value) return true
      
      // Find this file in the duplicate info
      const fileDuplicateInfo = duplicateInfo.value.filesWithDuplicates.find(
        (f) => f.filename === fileData.filename
      )
      
      // If file has duplicate info and all images are duplicates, skip it
      if (fileDuplicateInfo && fileDuplicateInfo.duplicateCount === fileDuplicateInfo.totalImages) {
        return false // Skip this file
      }
      
      return true // Include this file
    })
    
    // Only proceed if there are files to upload (files with at least some new images)
    if (filesToUpload.length > 0) {
      // User clicked Yes - proceed with upload skipping duplicates
      const uploadResult = await processFileUploads(filesToUpload, sessionId, true, true) // Suppress here - we'll show message below
      
      // Refresh uploaded files list
      await fetchUploadedJsonFiles(sessionId)
      
      // Show file upload success message if files were uploaded
      showFileUploadSuccessMessage(uploadResult);
      
      // Navigate to session preview page after successful upload (only if files were uploaded)
      if (activeTab.value === 'dLSession' && uploadResult.totalLinked > 0) {
        router.push(`/data-labelling/${sessionId}`)
        // Clear form state
        resetSessionModal()
        return
      }
    } else {
      // All files had all duplicates - nothing to upload
      notification.info({
        title: 'Info',
        content: 'All selected files contain only duplicate images. No files were uploaded.',
        duration: 5000,
        closable: true,
      })
    }
  } else {
    // User clicked No - cancel upload
    if (sessionUploadRef.value) {
      sessionUploadRef.value.clear()
    }
    sessionFiles.value = []
  }
  
  // Clear pending data
  duplicateInfo.value = null
  pendingUploadFiles.value = []
  pendingUploadSessionId.value = null
}

async function importCSV() {
  if (fileInput.value) {
    fileInput.value?.click();
  }
}

const handleCSVFileUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e!.target!.result;
      parseCSV(text);
    };
    reader.readAsText(file)
  }
  event.target.value = null
}

const parseCSV = (text: any) => {
  const lines = text.split('\n').filter((line: any) => line.trim() !== '');
  const result = ref([])

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const columns: any = line.split(',').map((column: any) => column.trim());

    if (columns.length > 0) {
      result!.value!.push(columns[0])
    }
  }

  updateLabels(result.value);
};

const updateLabels = (data: any) => {
  const uniqueLabels = data.filter((item: any) => {
    return !newSession.value.labelIds.some((id: any) => id === item);
  })

  const uniqueLabelSet = new Set(uniqueLabels);
  const availableLabels = labels.value.filter((item: any) => uniqueLabelSet.has(item.name));
  const availableLabelSet = new Set(labels.value.map((item: any) => item.name));
  const notAvailableInUniqueLabels = uniqueLabels.filter((item: any) => !availableLabelSet.has(item));
  
  if (availableLabels.length) {
    newSession.value.labelIds.push(...availableLabels.map((item) => item.id));
    newSession.value.labelIds = [...new Set(newSession.value.labelIds)];
    if (notAvailableInUniqueLabels.length) {
      notification.warning({
        title: 'Partially Successfull',
        content: `Labels partially uploaded. The following Labels: "${notAvailableInUniqueLabels.join(', ')}" are not present in the Label Master.`,
        duration: 5000,
        closable: true
      })
    } else {
      notification.success({
        title: 'Successfull',
        content: `Labels uploaded successfully.`,
        duration: 11000, 
        closable: true
      })
    }
  } else {
    notification.error({
      title: 'Error',
      content: `Error in processing the uploaded file. Only .csv files are allowed (or) Check if the labels are delimited by new lines in the csv.`,
      duration: 5000,
      closable: true
    })
  }
}

// Auto create session
function generateSessionName (){
  const generatedName = projectCode.value + '_' + subProjectCode.value + '_' + useCaseCode.value + '_' + anatomyPlaneCode.value + '_' + centerCode.value + '_' + userTypeCode.value + '_' + imageCount.value + '_' + setCode.value;
  newSession!.value!.name = generatedName;
  
  // Clear any existing errors and re-validate the generated name
  nameError.value = '';
  nameTouched.value = true;
  nameDirty.value = true;
  validateName(generatedName);
  
  // Also trigger form validation to clear any form-level errors
  nextTick(() => {
    formRef.value?.validate();
  });
}

// Handle image count input to prevent alphabets
function handleImageCountInput(value: number | null) {
  if (value === null || value === undefined) {
    imageCount.value = null
    return
  }
  // Ensure only positive integers
  const numValue = Math.floor(Math.abs(value))
  imageCount.value = numValue >= 1 ? numValue : null
}

function handleImageCountKeydown(event: KeyboardEvent) {
  // Allow: backspace, delete, tab, escape, enter, arrow keys, home, end
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
  
  // Allow Ctrl/Cmd + A, C, V, X
  if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
    return
  }
  
  // Allow numbers
  if (event.key >= '0' && event.key <= '9') {
    return
  }
  
  // Block everything else (alphabets, special characters)
  if (!allowedKeys.includes(event.key)) {
    event.preventDefault()
  }
}

function handleImageCountPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') || ''
  // Extract only numbers from pasted text
  const numbersOnly = pastedText.replace(/[^0-9]/g, '')
  if (numbersOnly) {
    const numValue = parseInt(numbersOnly, 10)
    if (!isNaN(numValue) && numValue >= 1) {
      imageCount.value = numValue
    }
  }
}

function cancelCreateSession(){
  newSession!.value = null;
  approvalOptions.value = [];
  projectCode.value = null
  subProjectCode.value = null
  useCaseCode.value = null
  anatomyPlaneCode.value = null
  centerCode.value = null
  userTypeCode.value = null
  imageCount.value = null
  setCode.value = null
  taxonomyLevels.value = [{
    selectedTaxonomy: null,
    selectedTaxonomies: [],  
    selectedLandmarks:[]// Ensure this is initialized as an empty array
  }];
  
  // Reset validation states
  nameTouched.value = false
  nameDirty.value = false
  nameError.value = ''
  formRef.value?.restoreValidation()
  
  // Reset file upload
  sessionFiles.value = [];
  sessionFileInfo.value = null;
  uploadedJsonFiles.value = [];
  hasPendingImages.value = false;
  if (sessionUploadRef.value) {
    sessionUploadRef.value.clear();
  }
}

const hasLoadedAutoSessionCodes = ref(false)
async function fetchAutoSessionCodes() {
  if (hasLoadedAutoSessionCodes.value || isFetchingTaxonomy.value) return
  isFetchingTaxonomy.value = true
  try {
    await $client.taxonomy.autoSessionCodesList.query({ sort: [{ name: 'asc' }] }).then((response) => {
      projectCodeList!.value = response.data[0];
      subProjectCodeList.value = response.data[1];
      useCaseCodeList.value = response.data[2];
      anatomyPlaneCodeList.value = response.data[3];
      centerCodeList.value = response.data[4];
      userTypeCodeList.value = response.data[5];
    })
  } catch (error) {
    // swallow (UI can still work without auto-suggest codes)
  } finally {
    filteredTaxonomys.value = taxonomy.value
    isFetchingTaxonomy.value = false
    hasLoadedAutoSessionCodes.value = true
  }
}

function handleAutoGenerateSessionName() {
  newSession!.value!.name = null
  if (selectAutoGenerateSessionName.value) {
    fetchAutoSessionCodes()
  }
  if (!selectAutoGenerateSessionName.value) {
    projectCode.value = null
    subProjectCode.value = null
    useCaseCode.value = null
    anatomyPlaneCode.value = null
    centerCode.value = null
    userTypeCode.value = null
    imageCount.value = null
    setCode.value = null
  }
}

const canCreateSession = ref<boolean>(false);
const canReadSession = ref<boolean>(false);
const canUpdateSession = ref<boolean>(false);
const canDeleteSession = ref<boolean>(false);
const canAnalyseSession = ref<boolean>(false);
const canLockSession = ref<boolean>(false);

async function checkAbilities() {
  canCreateSession.value = await defineAbilitiesFor(Module.Session, Action.CREATE);
  canReadSession.value = await defineAbilitiesFor(Module.Session, Action.READ);
  canUpdateSession.value = await defineAbilitiesFor(Module.Session, Action.UPDATE);
  canDeleteSession.value = await defineAbilitiesFor(Module.Session, Action.DELETE);
  canAnalyseSession.value = await defineAbilitiesFor(Module.Session, Action.Analyse);
  canLockSession.value = await defineAbilitiesFor(Module.Session, Action.Lock);
}

onMounted(() => {
  checkAbilities();
  // Match older page behavior: start loading cached lookup data on client mount.
  // (SSR loads are handled via fetchSessions() which also ensures lookups.)
  fetchAllAnnotations()
});

watch(route, () => {
  checkAbilities();
});

// Lock/Unlock Session Functions
// Use centralized validation from useFormValidation composable
const { validateLockUnlockReason: validateReason } = useFormValidation()

const lockUnlockReasonTouched = ref(false)

/**
 * Validate lock/unlock reason field
 * Follows the same pattern as Label.vue for consistent error handling
 * 
 * @param reason - The reason string to validate
 * @returns true if valid, false otherwise
 */
function validateLockUnlockReason(reason: string): boolean {
  // Pass the current action type for context-aware error messages
  const error = validateReason(reason, lockUnlockAction.value as 'lock' | 'unlock')
  lockUnlockReasonError.value = error
  return error === ''
}

/**
 * Handle lock/unlock session action
 * 
 * STEP-BY-STEP FLOW:
 * 1. Validates session ID and reason
 * 2. Calls appropriate backend endpoint (lockSession or unlockSession)
 * 3. Backend returns simple response: { success, message, lockReason/unlockReason }
 * 4. Refreshes session list to get updated lock status
 * 5. Shows success notification
 * 6. Clears modal and form state
 * 
 * Note: unlockSession endpoint already updates session status to "Re-open",
 * so no additional updateSessionStatus call is needed
 */
async function handleLockUnlockSession() {
  // Step 1: Validate session ID exists
  if (!lockUnlockSessionId.value) return
  
  // Step 2: Validate reason before submission
  if (!validateLockUnlockReason(lockUnlockReason.value)) {
    return
  }
  
  isSubmittingLockUnlock.value = true
  
  try {
    const sessionName = data.value.find((s: any) => s.id === lockUnlockSessionId.value)?.name || ''
    
    if (lockUnlockAction.value === 'lock') {
      // Step 3a: Lock session - backend returns { success, message, lockReason }
      const result = await $client.dLSession.lockSession.mutate({
        dLSessionId: lockUnlockSessionId.value,
        reason: lockUnlockReason.value.trim()
      })
      
      // Step 4a: Refresh sessions to get updated lock status
      await fetchSessions({})
      
      // Step 5a: Show success notification
      notification.success({
        title: 'Success',
        content: result.message || `Session "${sessionName}" is locked now successfully`,
        duration: 5000,
        closable: true
      })
    } else {
      // Step 3b: Unlock session - backend returns { success, message, unlockReason }
      // Note: unlockSession already updates lock history AND session status to "Re-open"
      const result = await $client.dLSession.unlockSession.mutate({
        dLSessionId: lockUnlockSessionId.value,
        reason: lockUnlockReason.value.trim()
      })
      
      // Step 4b: Refresh sessions to get updated lock status and "Re-open" status
      await fetchSessions({})
      
      // Step 5b: Show success notification
      notification.success({
        title: 'Success',
        content: result.message || `The session name is ${sessionName} is unlocked now successfully`,
        duration: 5000,
        closable: true
      })
    }
    
    // Step 6: Clear modal and form state
    showLockUnlockModal.value = false
    lockUnlockSessionId.value = null
    lockUnlockReason.value = ''
    lockUnlockReasonError.value = ''
    lockUnlockReasonTouched.value = false
  } catch (error: any) {
    // Error handling - show user-friendly error message
    notification.error({
      title: 'Error',
      content: error.message || 'Failed to update session lock status',
      duration: 5000,
      closable: true
    })
  } finally {
    isSubmittingLockUnlock.value = false
  }
}

//Reference Link
const showReferenceLinks = ref(false)

// Reference Link functions
function addReferenceLink() {
  if (!newSession.value) return;
  
  // Initialize sop array if it doesn't exist
  if (!Array.isArray(newSession.value.sop)) {
    newSession.value.sop = [];
  }
  
  // Add a new empty reference link item
  newSession.value.sop.push({ name: '', sopLink: '' });
}

function removeReferenceLink(index) {
  if (newSession.value && Array.isArray(newSession.value.sop)) {
    newSession.value.sop.splice(index, 1);
  }
}

// Add taxonomy level function (modified to reset new level properly)
const addTaxonomyLevel = () => {
  taxonomyLevels.value.push({ 
    selectedTaxonomy: null,
    selectedTaxonomies: [],
    selectedLandmarks: []
  });
  
  // Initialize select all states for the new level
  selectAllChecked.value.push(false);
  selectAllIndeterminate.value.push(false);
  selectAllLandmarksChecked.value.push(false);
  landmarkIndeterminate.value.push(false);
};

const tempTaxonomyLevels = ref<TaxonomyLevel[]>([])
const tempSelectAllChecked = ref<boolean[]>([])
const tempSelectAllIndeterminate = ref<boolean[]>([])
const tempSelectAllLandmarksChecked = ref<boolean[]>([])
const tempLandmarkIndeterminate = ref<boolean[]>([])

const removeTaxonomyLevel = (index: number) => {
  tempTaxonomyLevels.value.push(taxonomyLevels.value[index])
  tempSelectAllChecked.value.push(selectAllChecked.value[index])
  tempSelectAllIndeterminate.value.push(selectAllIndeterminate.value[index])
  tempSelectAllLandmarksChecked.value.push(selectAllLandmarksChecked.value[index])
  tempLandmarkIndeterminate.value.push(landmarkIndeterminate.value[index])

  taxonomyLevels.value.splice(index, 1)
  selectAllChecked.value.splice(index, 1)
  selectAllIndeterminate.value.splice(index, 1)
  selectAllLandmarksChecked.value.splice(index, 1)
  landmarkIndeterminate.value.splice(index, 1)
}

// Updated to handle manual taxonomy name input
const selectedTaxonomyAnnotations = ref<Map<string, TaxonomyAnnotation[]>>(new Map())

// Add this method to fetch annotations for a taxonomy
async function fetchTaxonomyAnnotations(taxonomyId: string) {
  try {
    const allAnnotationsResponse = await $client.taxonomy.fetchTaxonomyAnnotations.query({
      taxonomyId: taxonomyId
    });
    
    if (allAnnotationsResponse && allAnnotationsResponse.annotations) {
      selectedTaxonomyAnnotations.value.set(taxonomyId, allAnnotationsResponse.annotations);
    
    }
  } catch (error) {
  }
}

// Watch for changes in taxonomy levels to track annotation selections
watch(taxonomyLevels, (newLevels) => {
  // Clear existing tracking
  selectedAnnotationsMap.value.clear();
  
  // Track selections from each taxonomy level
  newLevels.forEach((level, levelIndex) => {
    if (level.selectedTaxonomy && level.selectedTaxonomies) {
      // Process each selected annotation
      level.selectedTaxonomies.forEach(annotationId => {
        const annotation = allAnnotations.value.find(a => a.id === annotationId);
        
        if (annotation) {
          // Check if this annotation is already tracked
          const existingSelection = selectedAnnotationsMap.value.get(annotationId);
          
          if (existingSelection && existingSelection.taxonomyId !== level.selectedTaxonomy) {
            // This is a duplicate selection across different taxonomy groups
            notification.warning({
              title: 'Duplicate Selection',
              content: `${annotation.name} is already selected in ${existingSelection.taxonomyName}`,
              duration: 3000
            });
          }
          
          // Update the tracking map even if duplicate, to keep it current
          selectedAnnotationsMap.value.set(annotationId, {
            taxonomyId: level.selectedTaxonomy,
            taxonomyName: level.selectedTaxonomy,
            annotationName: annotation.name
          });
        }
      });
    }
  });
}, { deep: true });

// Add these refs
const selectAllIndeterminate = ref<boolean[]>([])
const selectAllChecked = ref<boolean[]>([])

// Add this function to handle select all
const handleSelectAll = (index: number, state: string) => {
  const currentTaxonomyId = taxonomyLevels.value[index].selectedTaxonomy;
  
  if (!currentTaxonomyId) return;

  if (selectAllChecked.value[index] && state == 'Select All') {
    // Get all available annotations 
    const availableAnnotations = allAnnotations.value.filter(annotation => {
      const existingSelection = selectedAnnotationsMap.value.get(annotation.id);
      const isSelectedInOtherLevel = existingSelection && 
                                   existingSelection.taxonomyId !== currentTaxonomyId;
      return !isSelectedInOtherLevel;
    });
    
    // Map to their IDs
    taxonomyLevels.value[index].selectedTaxonomies = availableAnnotations.map(annotation => annotation.id);
  } else {
    taxonomyLevels.value[index].selectedTaxonomies = [];
  }
  
  selectAllIndeterminate.value[index] = false;
}

// Add a watch to update select all states when selections change
watch(taxonomyLevels, (newVal) => {
  newVal.forEach((level, index) => {
    // Check if level and selectedTaxonomies exist
    if (!level || !level.selectedTaxonomies) {
      // Reset the state for this index if data is undefined
      selectAllChecked.value[index] = false;
      selectAllIndeterminate.value[index] = false;
      return;  // Skip further processing for this level
    }

    // Count all available annotations (not used in other levels)
    const availableAnnotationsCount = allAnnotations.value.filter(annotation => {
      const existingSelection = selectedAnnotationsMap.value.get(annotation.id);
      return !(existingSelection && existingSelection.taxonomyId !== level.selectedTaxonomy);
    }).length;

    // Now safely process the length
    const selectedLength = level.selectedTaxonomies.length;

    if (selectedLength === 0) {
      selectAllChecked.value[index] = false;
      selectAllIndeterminate.value[index] = false;
    } else if (selectedLength === availableAnnotationsCount) {
      selectAllChecked.value[index] = true;
      selectAllIndeterminate.value[index] = false;
    } else {
      selectAllChecked.value[index] = false;
      selectAllIndeterminate.value[index] = true;
    }
  });
}, { deep: true });

const selectedLandmarkAnnotations = ref([])
const isFetchingLandmarks = ref(false)
const selectAllLandmarksChecked = ref<boolean[]>([])
const landmarkIndeterminate = ref<boolean[]>([])

// Handle Select All Landmarks
function handleSelectAllLandmarks(index: number, state: string) {
  const level = taxonomyLevels.value[index];
  if (!level || !level.selectedTaxonomy) return;

  const validOptions = getLandmarkAnnotationOptions(level.selectedTaxonomy, level);
  
  nextTick(() => {
    if (state === 'Select All') {
      level.selectedLandmarks = validOptions.map(opt => opt.value);
      selectAllLandmarksChecked.value[index] = true;
      landmarkIndeterminate.value[index] = false;
    } else {
      level.selectedLandmarks = [];
      selectAllLandmarksChecked.value[index] = false;
      landmarkIndeterminate.value[index] = false;
    }
  });
}

// Add watch for landmark selection state
watch(taxonomyLevels, (newVal) => {
  newVal.forEach((level, index) => {
    if (!level || !level.selectedLandmarks) {
      selectAllLandmarksChecked.value[index] = false;
      landmarkIndeterminate.value[index] = false;
      return;
    }

    const availableLandmarks = getLandmarkAnnotationOptions(
      level.selectedTaxonomy, 
      level
    );
    const selectedLength = level.selectedLandmarks.length;
    const totalLength = availableLandmarks.length;

    if (selectedLength === 0) {
      selectAllLandmarksChecked.value[index] = false;
      landmarkIndeterminate.value[index] = false;
    } else if (selectedLength === totalLength) {
      selectAllLandmarksChecked.value[index] = true;
      landmarkIndeterminate.value[index] = false;
    } else {
      selectAllLandmarksChecked.value[index] = false;
      landmarkIndeterminate.value[index] = true;
    }
  });
}, { deep: true });

// Initialize the arrays in onMounted
onMounted(() => {
  selectAllChecked.value = [false]
  selectAllIndeterminate.value = [false]
  selectAllLandmarksChecked.value = [false]
  landmarkIndeterminate.value = [false]
})

const renderSelectedTags = ({ tags, onClose }: { tags: any[], onClose: (tag: any) => void }) => {
  if (tags.length <= 2) {
    return tags.map(tag => {
      return h(
        'div',
        {
          class: 'tag-wrapper',
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0 6px',
            fontSize: '12px',
            backgroundColor: '#f0f0f0',
            borderRadius: '3px',
            marginRight: '4px'
          }
        },
        [
          h('span', tag.label),
          h(
            'span',
            {
              style: {
                marginLeft: '4px',
                cursor: 'pointer'
              },
              onClick: () => onClose(tag)
            },
            '×'
          )
        ]
      )
    })
  } else {
    return [
      h(
        'div',
        {
          class: 'count-wrapper',
          style: {
            padding: '0 6px',
            fontSize: '12px',
            color: '#606266'
          }
        },
        `${tags.length} selected`
      )
    ]
  }
}

const renderSelectedLabel = (option: any) => {
  const level = taxonomyLevels.value.find(level => level.selectedTaxonomy === option.value);
  return option.label;
}

const renderLandmarkLabel = (option: any) => {
  const level = taxonomyLevels.value.find(level => 
    Array.isArray(level.selectedLandmarks) && 
    level.selectedLandmarks.includes(option.value)
  );
  return option.label;
};

function resetSessionModal() {
  // Reset initial form state tracking
  resetInitialFormState();

  // Reset all session-related variables
  newSession.value = null;
  approvalOptions.value = [];
  
  // Reset all auto-generate session name fields
  selectAutoGenerateSessionName.value = false;
  projectCode.value = null;
  subProjectCode.value = null;
  useCaseCode.value = null;
  anatomyPlaneCode.value = null;
  centerCode.value = null;
  userTypeCode.value = null;
  imageCount.value = null;
  setCode.value = null;
  
  // Reset validation states
  nameTouched.value = false
  nameDirty.value = false
  nameError.value = ''
  formRef.value?.restoreValidation()
  
  // Reset assignee/reviewer states
  selectedAssigneesCount.value = 0;
  selectedReviewersCount.value = 0;
  selectAllAssignees.value = false;
  selectAllReviewers.value = false;
  assigneesIndeterminate.value = false;
  reviewersIndeterminate.value = false;
  
  // CRITICAL: Reset taxonomy levels to initial state
  taxonomyLevels.value = [{
    selectedTaxonomy: null,
    selectedTaxonomyId: null,
    selectedTaxonomies: [],
    selectedLandmarks: []
  }];
  
  // Reset taxonomy selection states
  selectAllChecked.value = [false];
  selectAllIndeterminate.value = [false];
  selectAllLandmarksChecked.value = [false];
  landmarkIndeterminate.value = [false];
  
  // Clear annotation tracking
  selectedAnnotationsMap.value.clear();
  selectedTaxonomyAnnotations.value.clear();
  
  // Reset file upload
  sessionFiles.value = [];
  sessionFileInfo.value = null;
  uploadedJsonFiles.value = [];
  hasPendingImages.value = false;
  isCheckingPendingImages.value = false;
  duplicateInfo.value = null;
  pendingUploadFiles.value = [];
  pendingUploadSessionId.value = null;
  showDuplicateConfirmationModal.value = false;
  uploadMode.value = 'local'; // Reset to local mode
  if (sessionUploadRef.value) {
    sessionUploadRef.value.clear();
  }

}

function renderLabelName(option: { label: string; value: string }) {
  // Find the label by ID in your labels array
  const labelObj = labels.value.find(l => l.id === option.value);
  return labelObj ? labelObj.name : option.value;
}

// S3 Modal functions
function openS3Modal(mode: 'push' | 'upload' = 'upload') {
  // Check if pending images exist (same validation as local upload)
  if (hasPendingImages.value) {
    notification.warning({
      content: 'Cannot upload JSON files when there are pending images in the session',
      duration: 5000,
    });
    return;
  }
  
  s3ModalMode.value = mode;
  isPushToS3Modal.value = true;
}

function closeS3Modal() {
  isPushToS3Modal.value = false;
  s3Config.value.s3Key = '';
}

async function handleS3Upload() {
  try {
    if (!s3Config.value.s3Key) {
      notification.error({
        content: 'Please enter S3 key',
        duration: 5000,
      });
      return;
    }

    // Check if pending images exist (same validation as local upload)
    if (hasPendingImages.value) {
      notification.warning({
        content: 'Cannot upload JSON files when there are pending images in the session',
        duration: 5000,
      });
      return;
    }

    // Call tRPC procedure to download from S3
    const jsonData = await $client.dLSession.downloadJsonFromS3.mutate({
      s3Key: s3Config.value.s3Key,
    });

    // Extract filename from S3 key or use default
    let filename = 'imported.json';
    const pathParts = s3Config.value.s3Key.split('/').filter(p => p);
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      filename = lastPart.endsWith('.json') ? lastPart : `${lastPart}.json`;
    }

    // Convert JSON data to File object
    const jsonString = JSON.stringify(jsonData);
    const file = new File([jsonString], filename, {
      type: 'application/json',
    });

    // Create UploadFileInfo object
    const uploadFileInfo: UploadFileInfo = {
      id: Date.now().toString(),
      name: filename,
      status: 'pending',
      file: file,
    };

    // Add to sessionFiles array (files will be linked when Submit/Update is clicked)
    sessionFiles.value = [...sessionFiles.value, uploadFileInfo];

    notification.success({
      content: `Successfully downloaded "${filename}" from S3. File will be linked when you submit or update the session.`,
      duration: 5000,
    });

    closeS3Modal();
  } catch (error: any) {
    notification.error({
      content: error.message || 'Failed to download from S3',
      duration: 5000,
    });
  }
}

const isTabChanging = ref(false)

const resetAnalysisTabState = () => {
  analysisFilters.value = {
    name: [],
    extractedresourcecount: []
  }
  filterSearchQueries.value = {
    name: '',
    extractedresourcecount: ''
  }
  tempFilterSelections.value = {
    name: [],
    extractedresourcecount: []
  }
  filterDropdownVisible.value = {
    name: false,
    extractedresourcecount: false
  }
  filterOptions.value = {
    name: [],
    extractedresourcecount: []
  }
  analysisPagination.page = 1
  analysisSortStates.value = [{
    columnKey: 'name',
    sorter: true,
    order: 'ascend'
  }]
}

watch(
  analysisActiveTab,
  async (newTab, oldTab) => {
    if (
      isTabChanging.value ||
      newTab === oldTab ||
      !isAnalysingSession.value
    ) {
      return
    }

    try {
      isTabChanging.value = true
      resetAnalysisTabState()
      if (isAnalysisSession.value) {
        await analysisSession({})
        await fetchAllFilterOptions()
      }
    } catch (error) {
      console.error('Error in tab change:', error)
    } finally {
      isTabChanging.value = false
    }
  },
  { flush: 'post' }
)
watch(isAnalysingSession, (newValue) => {
  if (!newValue) {
    // Only reset values after modal is fully closed
    nextTick(() => {
      isAnalysisSession.value = null // Change to null instead of empty string
      activesessionName.value = ''
      analysisActiveTab.value = 'label'
      analysisSortStates.value = [{
        columnKey: 'name',
        sorter: true,
        order: 'ascend'
      }]
    })
  }
})

</script>

<template>
  <div>
    <!-- Fixed breadcrumb and title header -->
    <div class="fixed top-[72px] left-0 right-0 bg-neutral-900 z-40">
      <div class="px-10 pt-4">
        <div class="text-l py-2">
          <NBreadcrumb separator=">" data-testid="session-breadcrumb">
            <NBreadcrumbItem data-testid="session-breadcrumb-home" @click="router.push('../')">
                Home
            </NBreadcrumbItem>
            <NBreadcrumbItem data-testid="session-breadcrumb-epic" @click="router.push({path: `/epic/${project?.epicId}`})">
              {{epicName ? epicName : 'Unknown'}}
            </NBreadcrumbItem>
            <NBreadcrumbItem data-testid="session-breadcrumb-project">
              {{projectName ? projectName : 'Unknown'}}
            </NBreadcrumbItem>
          </NBreadcrumb>
        </div>
        <NTabs v-model:value="activeTab">
          <NTab v-for="tab in tabs" :key="tab.key" :name="tab.key" :tab="tab.name" />
        </NTabs>
        <div class="inline-flex w-full justify-between items-center px-2 py-4">
          <div class="inline-flex items-center gap-2">
            <Icon
              data-testid="session-back-button"
              name="ph:caret-left"
              class="text-2xl text-primary-500 hover:text-primary-300 cursor-pointer"
              @click="() => project ? router.push({
                path: `/epic/${project.epicId}`,
              }) : router.go(-1)"
            />
            <p class="text-2xl">{{activeTabName}}</p>
          </div>
          <div class="inline-flex items-center gap-9">
          <NInput data-testid="session-search-input" placeholder="Search" v-model:value="searchQuery" @keydown.enter="fetchSessions({})">
            <template #suffix >
                <svg data-testid="session-search-icon" @click="fetchSessions({})" class="flex-none cursor-pointer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
                  <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                </svg>
            </template>
          </NInput>
        <div class="btn-wr flex">
          <NButton data-testid="session-image-search-button" v-if="activeTabName == 'Data Labelling Session'" strong secondary type="primary" @click="showModalRef = !showModalRef">
            Image Search
          </NButton>
          <NButton
            data-testid="session-create-button"
            v-if="canCreateSession"
            strong secondary type="primary" @click="
              showSubmit=true;
              // Reset validation states
              nameTouched = false;
              nameDirty = false;
              nameError = '';
              newSession = {
                name: '',
                description: '',
                priority: 1,
                sop: [],
                projectId: route.params.id.toString(),
                users: [],
                labelIds: [],
                sessionLabelIds: [],
                approval: [],
                taxonomyLevels: [{
                  selectedTaxonomy: null,
                  selectedTaxonomies: []
                }], // Initialize with one empty level
              };
              approvalOptions = [];
              selectedAssigneesCount = 0;
              selectedReviewersCount = 0;
              selectAllAssignees = false;
              selectAllReviewers = false;
              assigneesIndeterminate = false;
              reviewersIndeterminate = false;
              selectAutoGenerateSessionName = false;
              projectCode = null;
              subProjectCode = null;
              useCaseCode = null;
              anatomyPlaneCode = null;
              centerCode = null;
              userTypeCode = null;
              imageCount = null;
              setCode = null;
              "
          >
            Create Session
          </NButton>
        </div>
        </div>
      </div>
    </div>
    </div>
    <!-- Content area with padding for fixed header -->
    <div class="px-10 py-4" style="padding-top: 160px;">
      <!-- Regular Sessions Table -->
      <NDataTable
        data-testid="session-table"
        v-if="canReadSession"
        ref="table"
        :key="(row: Session) => row.id"
        remote
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :scroll-x="1600"
        :row-props="(row: Session) => {
          const isDisabled = activeTab === 'dLSession' && hasPendingDeleteRequest(row.id);
          const rejectedRequest = activeTab === 'dLSession' ? getRejectedDeleteRequest(row.id) : null;
          const rejectionReason = rejectedRequest?.rejectionReason;
          const tooltipContent = rejectionReason 
            ? `Rejection Reason: ${rejectionReason}` 
            : rejectedRequest 
              ? 'This session had a delete request that was rejected' 
              : null;
          
          return {
            style: isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {},
            class: isDisabled ? 'disabled-row' : '',
            title: tooltipContent || undefined
          };
        }"
        @update:sorter="handleSorterChange"
      />
    </div>

    <NModal v-if="newSession" v-model:show="isCreatingSession" class="create-session-modal" data-testid="session-create-modal">
      <NCard  :title="showSubmit == true ? `Create Session` : `Update Session`" :bordered="false" role="dialog" aria-modal="true" closable @close="resetSessionModal()" class="create-session-card">
        <div class="create-session-container">
          <!-- Left side: Form fields -->
          <div class="create-session-form-wrapper">
            <NForm
              ref="formRef"
              :model="newSession" 
              :rules="formRules"
              label-placement="left" 
              size="medium"
              label-width="140px"
              require-mark-placement="right-hanging"
              class="create-session-form"
            >
          <NFormItem 
            label="Name" 
            path="name" 
            required
            :validation-status="nameTouched && nameError ? 'error' : undefined"
            :show-feedback="false"
          >
            <NInput 
              data-testid="session-name-input"
              v-model:value="newSession.name" 
              placeholder="Enter session name"
              @update:value="(value) => { 
                // Mark as dirty when user types
                nameDirty = true
                // Only validate if field has been touched (user has interacted)
                if (nameTouched) {
                  validateName(value) 
                }
              }"
              @focus="() => {
                // Mark as touched on focus, but don't validate empty field yet
                nameTouched = true
              }"
              @blur="() => { 
                nameTouched = true
                nameDirty = true
                // Always validate on blur
                if (newSession) validateName(newSession.name) 
              }"
            />
          </NFormItem>
          <div v-if="nameTouched && nameError" class="text-red-500 text-xs mb-2" style="padding-left: 140px;">{{ nameError }}</div>
          <div v-else class="mb-2"></div>
            <NFormItem label=" " path="autoName" v-if="showSubmit">
            <NCheckbox data-testid="session-auto-generate-checkbox" v-model:checked="selectAutoGenerateSessionName"  @update:checked="handleAutoGenerateSessionName"> Auto Generate Session Name </NCheckbox>
          </NFormItem>
          <NFormItem label="Description" path="description">
            <NInput
              data-testid="session-description-input"
              v-model:value="newSession.description" placeholder="Enter description" type="textarea"
              :autosize="{
                minRows: 2,
                maxRows: 4,
              }"
            />
          </NFormItem>
          <div v-if="activeTab === 'dLSession'">
          <div class="flex items-start gap-2" style="padding-left: 140px;">
            <NFormItem v-if="activeTab === 'dLSession'" label="Session Labels" path="sessionLabelIds" label-placement="top" class="flex-1">
              <NSelect
                data-testid="session-session-labels-select"
                v-model:value="(newSession as CreateDLSessionInput).sessionLabelIds"
                :options="sessionLabels.map(sl => ({
                  label: sl.name,
                  value: sl.id,
                }))"
                :loading="isFetchingSessionLabels"
                filterable
                clear-filter-after-select
                multiple
                placeholder="Enter session labels"
                @focus="fetchSessionLabels"
              />
            </NFormItem>
            <NFormItem v-if="activeTab === 'dLSession'" label="Session Status" path="sessionStatusId" label-placement="top" class="flex-1">
              <NSelect
                data-testid="session-status-select"
                v-model:value="(newSession as CreateDLSessionInput).sessionStatusId"
                :options="sessionStatusOptionsForForm"
                filterable
                clearable
                placeholder="Select session status"
                @focus="fetchSessionStatus"
              />
            </NFormItem>
          </div>
          </div>
          <div :class="(!selectAutoGenerateSessionName ? 'hidden' : '') +' flex flex-col'"  v-if="showSubmit">         
            <NFormItem label="Project Code" path="projectCode">
              <NSelect
                data-testid="session-project-code-select"
                v-model:value="projectCode"
                placeholder="Enter Project Code"
                tag
                filterable clearable :options="Object.values(projectCodeList).map((key) => ({
                  label: key.name,
                  value: key.name,
                }))"
                @focus="fetchAutoSessionCodes"
              />
            </NFormItem>
            <NFormItem label="Sub-Project Code" path="subProjectCode">
              <NSelect
                data-testid="session-sub-project-code-select"
                v-model:value="subProjectCode"
                placeholder="Enter Sub-Project Code"
                tag
                filterable clearable :options="Object.values(subProjectCodeList).map((key) => ({
                  label: key.name,
                  value: key.name,
                }))"
              />
            </NFormItem>
            <NFormItem label="Use Case Code" path="useCaseCode">
              <NSelect
                data-testid="session-use-case-code-select"
                v-model:value="useCaseCode"
                placeholder="Enter Use Case Code"
                tag
                filterable clearable :options="Object.values(useCaseCodeList).map((key) => ({
                  label: key.name,
                  value: key.name,
                }))"
              />
            </NFormItem>
            <NFormItem label="Anatomy Plane Code" path="anatomyPlaneCode">
              <NSelect
                data-testid="session-anatomy-plane-code-select"
                v-model:value="anatomyPlaneCode"
                placeholder="Enter Anatomy Plane Code"
                tag
                filterable clearable :options="Object.values(anatomyPlaneCodeList).map((key) => ({
                  label: key.name,
                  value: key.name,
                }))"
              />
            </NFormItem>
            <NFormItem label="Center Code" path="centerCode">
              <NSelect
                data-testid="session-center-code-select"
                v-model:value="centerCode"
                placeholder="Enter Center Code"
                tag
                filterable clearable :options="Object.values(centerCodeList).map((key) => ({
                  label: key.name,
                  value: key.name,
                }))"
              />
            </NFormItem>
            <NFormItem label="User Type Code" path="userTypeCode">
              <NSelect
                data-testid="session-user-type-code-select"
                v-model:value="userTypeCode"
                placeholder="Enter User Type Code"
                tag
                filterable clearable :options="Object.values(userTypeCodeList).map((key) => ({
                  label: key.name,
                  value: key.name,
                }))"
              />
            </NFormItem>
            <NFormItem label="Image Count" path="imageCount">
                <NInputNumber 
                  data-testid="session-image-count-input"
                  v-model:value="imageCount" 
                  placeholder="Enter Image Count" 
                  :min="1" 
                  :precision="0"
                  :show-button="false" 
                  class="w-full"
                  @update:value="handleImageCountInput"
                  @keydown="handleImageCountKeydown"
                  @paste="handleImageCountPaste"
                />
            </NFormItem>
            <NFormItem label="Set Code" path="setCode">
                <NInput data-testid="session-set-code-input" v-model:value="setCode" placeholder="Enter Set Code" />
            </NFormItem>
            <div class="flex justify-end mb-5">
              <n-button data-testid="session-generate-name-button" strong  type="primary" @click="generateSessionName" :disabled=" !(projectCode && subProjectCode && useCaseCode && anatomyPlaneCode && centerCode && userTypeCode && imageCount && setCode )">
                Generate
              </n-button>
            </div>
          </div>
          <NFormItem
  label="Reference links" path="referenceLink"
>
  <div class="flex flex-col w-full gap-2">
    <div v-if="newSession.sop && newSession.sop.length > 0" class="flex items-center gap-2 mb-1">
      <div class="flex-1 font-medium text-sm">Name</div>
      <div class="flex-1 font-medium text-sm">Link</div>
      <div style="width: 24px;"></div>
    </div>
    
    <!-- SOP array items -->
    <template v-if="newSession.sop && Array.isArray(newSession.sop)">
      <div 
        v-for="(sopItem, index) in newSession.sop" 
        :key="index" 
        class="flex items-center gap-2"
      >        
        <div class="flex-1 flex items-center gap-2">
          <div class="flex-1 w-full">
            <NInput
              :value="sopItem?.name || ''"
              @update:value="(v) => {
                if (!newSession.sop[index]) {
                  newSession.sop[index] = { name: v, sopLink: '' };
                } else {
                  newSession.sop[index].name = v;
                }
              }"
            />
          </div>
          
          <div class="flex-1 w-full">
            <NInput
              :value="sopItem?.sopLink || ''"
              @update:value="(v) => {
                if (!newSession.sop[index]) {
                  newSession.sop[index] = { name: '', sopLink: v };
                } else {
                  newSession.sop[index].sopLink = v;
                }
              }"
            />
          </div>
          
          <Icon
            name="ph:minus-circle"
            class="flex-none text-primary-500 hover:text-primary-300 cursor-pointer"
            @click="newSession.sop.splice(index, 1)"
          />
        </div>
      </div>
    </template>
    
    <!-- Add Reference Link button -->
    <div class="mt-2">
      <div
        class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-300 text-sm cursor-pointer"
        @click="addReferenceLink"
      >
        <Icon
          name="ph:plus-circle"
          class="flex-none"
        />
        <span>Add Links</span>
      </div>
    </div>
  </div>
</NFormItem>
          <NFormItem label="Assignees" path="users" style='align-items:center'>
            <div class="w-full flex flex-col">
            <div class="flex justify-end mb-1">
              <NCheckbox data-testid="session-assignees-select-all" v-model:checked="selectAllAssignees" :indeterminate="assigneesIndeterminate" @update:checked="handleSelectAllAssignees"> {{ selectedAssigneesCount  > 0  ? 'Deselect All' : 'Select All'}} </NCheckbox>
            </div>
            <NSelect
              data-testid="session-assignees-select"
              :value="assigneesValue"
              :options="assigneesOptions || []"
              multiple
              filterable
              placeholder="Select Assignees"
              @search="handleSearchAssignees"
              @keyup.enter="handleEnterKey('Assignees')"
              @update:value="handleAssigneesUpdate"
              :render-label="renderDropdownLabel"
              :render-tag="renderUserTag"
            />
            <span v-if="selectedAssigneesCount" class="text-primary-600 mt-2">{{selectedAssigneesCount}} {{ selectedAssigneesCount == 1 ? 'Assignee' : 'Assignees' }}  selected</span>
            </div>
          </NFormItem>
          <NFormItem label="Reviewers" path="users" style='align-items:center'>
            <div class="w-full flex flex-col">
            <div class="flex justify-end mb-1">
              <NCheckbox data-testid="session-reviewers-select-all" v-model:checked="selectAllReviewers" :indeterminate="reviewersIndeterminate" @update:checked="handleSelectAllReviewers">  {{ selectedReviewersCount  > 0  ? 'Deselect All' : 'Select All'}} </NCheckbox>
            </div>
            <NSelect
              data-testid="session-reviewers-select"
              :value="reviewersValue"
              :options="reviewersOptions || []"
              multiple
              filterable
              placeholder="Select Reviewers"
              @search="handleSearchAssignees"
              @keyup.enter="handleEnterKey('Reviewers')"
              @update:value="handleReviewersUpdate"
              :render-label="renderDropdownLabel"
              :render-tag="renderUserTag"
            />
            <span v-if="selectedReviewersCount" class="text-primary-600 mt-2">{{selectedReviewersCount}} {{ selectedReviewersCount == 1 ? 'Reviewer' : 'Reviewers' }}  selected</span>
            </div>
          </NFormItem>
          <NFormItem label="Approval Level" path="approvalLevel">
            <div class="flex flex-col w-full gap-2">
              <div v-for="(_, index) in newSession.approval" :key="index" v-if="newSession.approval && newSession.approval.length > 0" class="inline-flex items-center gap-2">
                <span class="flex-none text-sm font-medium min-w-[24px]">{{ index + 1 }}.</span>
                <NSelect
                  data-testid="session-approval-level-select"
                  :value="approvalValues[index] || []"
                  :options="getApprovalOptions(index)"
                  multiple
                  filterable
                  placeholder="Select Approval level"
                  @update:value="(v: string[]) => handleApprovalUpdate(index, v)"
                  :render-label="renderDropdownLabelForApproval"
                  :render-tag="renderUserTag"
                />
                <Icon
                  name="ph:minus-circle"
                  class="flex-none text-primary-500 hover:text-primary-300 cursor-pointer"
                  @click="newSession!.approval.splice(index, 1)"
                />
              </div>
              <div class="mt-2">
                <div v-if="newSession!.approval && newSession!.approval.length < 5"
                  class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-300 text-sm cursor-pointer"
                  @click="newSession!.approval.push([])"
                >
                  <Icon
                    name="ph:plus-circle"
                    class="flex-none"
                  />
                  <span>Add Level</span>
                </div>
              </div>
            </div>
          </NFormItem>
          <NFormItem v-if="activeTab === 'dLSession'" label="Labels" path="labelIds">
          <div class="w-full flex flex-col gap-2">
            <NSelect
              data-testid="session-labels-select"
              v-model:value="(newSession as CreateDLSessionInput).labelIds"
              :options="filteredLabels.map(label => ({
                label: label.name,
                value: label.id,
              }))"
              :loading="isFetchingLabels"
              filterable
              :clear-filter-after-select="true"
              multiple
              placeholder="Add labels"
              @focus="fetchLabels"
              @search="handleSearch"
              @keyup.enter="handleLabelEnterKey()"
              :render-label="renderLabelName"
            />
            <span v-if="(newSession as CreateDLSessionInput).labelIds?.length" class="text-primary-600">{{(newSession as CreateDLSessionInput).labelIds.length}} {{(newSession as CreateDLSessionInput).labelIds.length == 1 ? 'Label' : 'Labels' }} selected</span>
            <div class="flex justify-end">
              <NButton data-testid="session-import-csv-button" class="px-[5px] bg-[#add8e6] text-[#000000] rounded-none h-[22px]" @click="importCSV">Import CSV</NButton>
              <input type="file" ref="fileInput" @change="handleCSVFileUpload" style="display: none;" />
            </div>
          </div>
        </NFormItem>
          <NFormItem v-if="activeTab === 'dLSession'" label="Taxonomy" path="taxonomyLevels">
            <div class="flex flex-col w-full gap-4">
              <!-- Iterate through taxonomy levels -->
              <div v-for="(level, index) in taxonomyLevels" :key="index" class="flex flex-col gap-4">
                <div class="flex gap-2">
                  <!-- Replaced Select with Input -->
                  <div class="w-1/2 flex flex-col gap-3">
                    <NInput
                      v-model:value="level.selectedTaxonomy"
                      placeholder="Enter Taxonomy Name"
                      @blur="validateTaxonomyName(level, index)"
                    />
                    <div v-if="index === taxonomyLevels.length - 1"
                        class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-300 text-sm cursor-pointer"
                        @click="addTaxonomyLevel"
                      >
                        <Icon
                          name="ph:plus-circle"
                          class="flex-none"
                        />
                        <span>Add Taxonomy</span>
                      </div>
                  </div>

                  <!-- Multiple select field for annotations -->
                  <div class="w-1/2 flex flex-col gap-3">
                    <NSelect
                      v-model:value="level.selectedTaxonomies"
                      :disabled="!level.selectedTaxonomy"
                      :options="getAnnotationOptions(level.selectedTaxonomy, level)"
                      :loading="isFetchingAllAnnotations"
                      filterable
                      multiple
                      placeholder="Select Annotations"
                      :max-tag-count="1"
                      :render-label="renderSelectedLabel"
                      @focus="fetchAllAnnotations"
                    >
                      <!-- Custom rendering for options to show disabled state with reason -->
                      <template #option="{ option }">
                        <div :class="{ 'opacity-50': option.disabled }">
                          {{ option.label }}
                          <span v-if="option.disabled" class="text-xs text-gray-500 ml-2">
                            ({{ option.description }})
                          </span>
                        </div>
                      </template>
                    </NSelect>
                    <div class="flex items-center gap-2">
                      <NCheckbox 
                        v-model:checked="selectAllChecked[index]"
                        :indeterminate="selectAllIndeterminate[index]"
                        @update:checked="handleSelectAll(index,level.selectedTaxonomies.length > 0 ? 'Deselect All' : 'Select All')"
                      >
                        {{ level.selectedTaxonomies.length > 0 ? 'Deselect All' : 'Select All' }}
                      </NCheckbox>
                      <span v-if="level.selectedTaxonomies.length" class="text-primary-600">
                        {{level.selectedTaxonomies.length}} {{level.selectedTaxonomies.length === 1 ? 'Annotation' : 'Annotations'}} selected
                      </span>
                    </div>
                  </div>
                  
                  <!-- Landmark selection field -->
                  <div class="w-1/2 flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                      <NSelect
                        v-model:value="level.selectedLandmarks" 
                        :disabled="!level.selectedTaxonomies.length"
                        :options="getLandmarkAnnotationOptions(level.selectedTaxonomy, level)"
                        :loading="isFetchingAllAnnotations"
                        filterable
                        multiple
                        placeholder="Crossbar Appearance"
                        :max-tag-count="1"
                        :render-label="renderLandmarkLabel"
                        class="flex-1"
                        @focus="fetchAllAnnotations"
                      />
                    </div>
                    <div class="flex items-center gap-2">
                      <NCheckbox 
                        v-model:checked="selectAllLandmarksChecked[index]" 
                        :indeterminate="landmarkIndeterminate[index]"
                        @update:checked="handleSelectAllLandmarks(index, level.selectedLandmarks?.length > 0 ? 'Deselect All' : 'Select All')"
                      >
                        {{ level.selectedLandmarks?.length > 0 ? 'Deselect All' : 'Select All' }}
                      </NCheckbox>
                      <span v-if="level.selectedLandmarks?.length" class="text-primary-600">
                        {{level.selectedLandmarks.length}} {{level.selectedLandmarks.length === 1 ? 'Landmark' : 'Landmarks'}} selected
                      </span>
                    </div>
                  </div>
                  
                  <!-- Remove level button -->
                  <div v-if="taxonomyLevels.length > 1" class="flex items-center h-[34px]">
                    <Icon
                      name="ph:minus-circle"
                      class="flex-none text-primary-500 hover:text-primary-300 cursor-pointer"
                      @click="removeTaxonomyLevel(index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </NFormItem>
          <NFormItem v-if="activeTab === 'cESession'" label="Structure Groups" path="structures">
            <div class="w-full flex flex-col gap-2">
              <NSelect
                v-model:value="(newSession as CreateCESessionInput).structures"
                remote
                :options="filteredStructuredGroups.map(structureGroup => ({
                  label: structureGroup.name,
                  value: structureGroup.id,
                }))"
                :loading="isFetchingStructureGroups"
                filterable
                :clear-filter-after-select="false"
                multiple
                placeholder="Add Structure Groups"
                @focus="fetchStructureGroups"
                @search="handleStructureGroupSearch"
              />
              <span v-if="(newSession as CreateCESessionInput).structures?.length" class="text-primary-600">{{(newSession as CreateCESessionInput).structures?.length}} {{(newSession as CreateDLSessionInput).structures?.length == 1 ? 'Structure Group' : 'Structure Groups' }} selected</span>
            </div>
          </NFormItem>
        </NForm>
          </div>
          <!-- Right side: File upload -->
          <div class="create-session-upload-wrapper">
            <div class="upload-section">
              <!-- Upload from S3 Button -->
              <div class="flex w-full justify-end gap-2 mb-4">
                <NButton 
                  type="primary"
                  strong
                  :disabled="hasPendingImages"
                  @click="openS3Modal('upload')"
                >
                  Upload from S3
                </NButton>
              </div>
              
              <!-- Local Upload Area -->
              <NUpload
                ref="sessionUploadRef"
                v-model:file-list="sessionFiles"
                :default-upload="false"
                :multiple="true"
                :disabled="hasPendingImages"
                accept=".json,application/json"
                :before-upload="beforeUploadFile"
                @change="handleSessionFileChange"
                class="upload-component"
              >
                <NUploadDragger class="upload-dragger-full">
                  <div class="flex flex-col items-center justify-center gap-4 py-8">
                    <NIcon class="text-4xl text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </NIcon>
                    <div class="text-center">
                      <p class="text-sm font-medium mb-1">Click or drag files to this area to upload</p>
                      <p class="text-xs text-gray-500">Support for multiple JSON file uploads</p>
                      <p v-if="sessionFiles.length > 0" class="text-xs text-primary-500 mt-2">
                        {{ sessionFiles.length }} {{ sessionFiles.length === 1 ? 'file' : 'files' }} selected
                      </p>
                    </div>
                  </div>
                </NUploadDragger>
              </NUpload>
              
              <!-- Display uploaded files for this session -->
              <div v-if="showSubmit === false && activeTab === 'dLSession'" class="mt-4 w-full">
                <div class="border-t border-gray-200 pt-4">
                  <p class="text-sm font-medium mb-2 text-primary-600">Uploaded Files:</p>
                  <div v-if="isFetchingUploadedFiles" class="text-xs text-gray-500 py-2">
                    Loading...
                  </div>
                  <div v-else-if="uploadedJsonFiles.length === 0" class="text-xs text-gray-500 py-2">
                    No file uploaded for this session
                  </div>
                  <div v-else class="space-y-2" :class="uploadedJsonFiles.length > 3 ? 'max-h-[120px] overflow-y-auto scrollbar-hide' : ''">
                    <div 
                      v-for="file in displayedUploadedFiles" 
                      :key="file.id"
                      class="flex items-center justify-between p-2 bg-primary-50 rounded text-xs"
                    >
                      <div class="flex items-center gap-2 flex-1 min-w-0">
                        <NIcon class="text-primary-500 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </NIcon>
                        <span class="text-primary-700 truncate font-medium" :title="file.filename">{{ file.filename }}</span>
                      </div>
                      <span class="text-gray-500 text-xs flex-shrink-0 ml-2">
                        {{ file.createdAt instanceof Date ? file.createdAt.toLocaleDateString() : new Date(file.createdAt).toLocaleDateString() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="create-session-footer">
            <NButton strong type="error" @click="cancelCreateSession" class="footer-button">
              Cancel
            </NButton>
            <NButton strong type="success" v-if="showSubmit" @click="createSession" :disabled="!isFormValid" class="footer-button">
              Submit
            </NButton>
            <NButton strong type="success" v-if="!showSubmit" @click="updateRow(newSession)" :disabled="!isFormValid || !hasFormChanges" class="footer-button">
              Update
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
    <!-- S3 Upload Modal -->
    <NModal v-model:show="isPushToS3Modal" data-testid="session-s3-modal">
      <NCard
        class="w-[50vh]"
        :title="s3ModalMode === 'push' ? 'Push to S3' : 'Upload from S3'"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        @close="closeS3Modal"
      >
        <NForm
          :model="s3Config"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
          <NFormItem label="S3 key" path="s3Key" required>
            <NInput
              data-testid="session-s3-key-input"
              v-model:value="s3Config.s3Key"
              placeholder="Enter S3 key"
              @keydown.enter.prevent="handleS3Upload"
            />
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton 
              data-testid="session-s3-upload-button"
              strong 
              type="primary" 
              @click="handleS3Upload"
            >
              Upload
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
    <NModal v-model:show="showModalRef" data-testid="session-image-search-modal" :mask-closable="true" class="pb-8" :on-after-leave="openCloseImageSearchModal">
      <NCard  :bordered="false" title="Image Search" role="dialog" aria-modal="true" class="mx-40 px-8" closable @close="showModalRef = !showModalRef">
        <div>
          <div class="input-wrapper w-full flex flex-row items-center pb-10">
            <div class="w-[40%]">
              <NInput data-testid="session-image-search-input" type="text" placeholder="Search Image Id" v-model:value="imageId" />
            </div>
          </div>
          <NDataTable
            data-testid="session-image-search-table"
            ref="table"
            :key="(row: Session) => row.id"
            remote
            :columns="imageSearchTableColumns"
            :data="imageSearchTableData"
            :loading="loading"
            :pagination="pagination"
            size="small"
            @update:sorter="handleSorterChange"
          />
        </div>
      </NCard>
    </NModal>

    <NModal
      v-if="isDeleteSession"
      v-model:show="isDeletingSession"
      data-testid="session-delete-modal"
    >
      <NCard
        class="w-[80vh]"
        title="Delete Session"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="() => { isDeleteSession = null; deleteSessionName = ''; deleteSessionReason = ''; }"
      >
        <NForm
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
          <NFormItem label="Session Name">
            <NInput
              data-testid="session-delete-name"
              :value="deleteSessionName"
              disabled
              placeholder="Session name"
            />
          </NFormItem>
          <NFormItem label="Reason">
            <NInput
              data-testid="session-delete-reason-input"
              v-model:value="deleteSessionReason"
              type="textarea"
              placeholder="Enter reason for deletion or approval request"
              :rows="4"
              :maxlength="500"
              show-count
            />
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="session-delete-cancel-button" strong type="default" @click="cancelRequest">
              Cancel
            </NButton>
            <NButton data-testid="session-delete-request-button" strong type="info" @click="requestApproval" class="request-approval-btn">
              Request Approval
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
    <NModal
      v-if="isAnalysisSession"
      v-model:show="isAnalysingSession"
      :mask-closable="true"
      :on-after-leave="openCloseAnalysisModal"
    >
      <NCard
        class="w-[80vh]"
        :title="activesessionName"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="isAnalysingSession = !isAnalysingSession"
      >
        <NTabs v-model:value="analysisActiveTab">
          <NTab name="label" tab="Label Analysis" />
          <NTab name="annotation" tab="Annotation Analysis" />
          <NTab name="status" tab="Status Analysis" />
        </NTabs>

        <NDataTable
          ref="table"
          :key="analysisTableKey"
          remote
          :columns="analyseColumns"
          :data="analysisData"
          :loading="analysisLoading"
          :pagination="analysisPagination"
          size="small"
          @update:sorter="handleAnalyseSorterChange"
        />
      </NCard>
    </NModal>
<NModal v-model:show="showDeletionConfirmation">
  <NCard
    class="w-[600px]"
    title="Confirm Taxonomy Deletion"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
    closable
    @close="handleCancel"
  >
    <div class="whitespace-pre-line">
      <h4>The following annotations have related records that will be deleted:</h4>
      <div class="mt-4">
        <div v-for="(detail, index) in confirmationDetails" :key="index" class="mb-4">
          <div class="font-semibold">{{ detail.taxonomyName }} - {{ detail.annotationName }}:</div>
          <div class="ml-4">
            <div>Total related records: {{ detail.counts.totalCount }}</div>
            <div>Taxonomy Data: {{ detail.counts.taxonomyDataCount }}</div>
            <div>Child Taxonomy Data: {{ detail.counts.childTaxonomyDataCount }}</div>
            <div>Child Taxonomies: {{ detail.counts.childTaxonomyCount }}</div>
          </div>
        </div>
      </div>
      <div class="mt-4 font-medium">Do you want to proceed?</div>
    </div>
    <template #footer>
      <div class="inline-flex items-center justify-end gap-2 w-full">
        <NButton strong type="error" @click="handleCancel">
          Cancel
        </NButton>
        <NButton strong type="success" @click="handleConfirm">
          Yes, Delete
        </NButton>
      </div>
    </template>
  </NCard>
</NModal>

  <!-- Duplicate Files Confirmation Modal -->
  <NModal
    v-model:show="showDuplicateConfirmationModal"
    :mask-closable="false"
    :close-on-esc="true"
  >
    <NCard
      class="w-[600px]"
      title="Duplicate Images Detected"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true"
    >
      <div class="mb-4">
        <p class="mb-3">
          While uploading, some of the selected images already exist in this session.
        </p>
        
        <div v-if="duplicateInfo && duplicateInfo.filesWithDuplicates.length > 0" class="mt-4 space-y-4">
          <p class="text-sm font-semibold mb-2">Files containing duplicates:</p>
          <div v-for="fileInfo in duplicateInfo.filesWithDuplicates" :key="fileInfo.filename" class="bg-neutral-800 p-3 rounded border border-neutral-700">
            <p class="text-sm mb-1">
              <strong>Name:</strong> <code :class="fileInfo.duplicateCount === fileInfo.totalImages ? 'text-yellow-400' : 'text-primary-400'">{{ fileInfo.filename }}</code>
            </p>
            <p class="text-sm text-neutral-300">
              A total of <strong class="text-primary-400">{{ fileInfo.totalImages }} image's </strong> were found, out of which <strong class="text-primary-400">{{ fileInfo.duplicateCount }} image's </strong> are already present in this session.
            </p>
          </div>
        </div>
        
        <p v-if="duplicateInfo && duplicateInfo.totalImages === duplicateInfo.totalDuplicates" class="mt-4 text-sm text-yellow-500 font-semibold">
          All images already exist in this session. No new images to upload.
        </p>
        <p v-else class="mt-4 text-sm">
          Are you sure you want to continue and upload only the image's and file's that are not already present in this session ?
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <NButton
            strong
            type="error"
            @click="handleDuplicateConfirmation(false)"
          >
            No
          </NButton>
          <NButton
            strong
            type="success"
            :disabled="duplicateInfo ? duplicateInfo.totalImages === duplicateInfo.totalDuplicates : false"
            autofocus
            @click="handleDuplicateConfirmation(true)"
          >
            Yes
          </NButton>
        </div>
      </template>
    </NCard>
    </NModal>
    
    <!-- Lock/Unlock Session Modal -->
    <NModal
      v-model:show="showLockUnlockModal"
      :mask-closable="false"
      :close-on-esc="false"
    >
      <NCard
        class="w-[600px]"
        :title="lockUnlockAction === 'lock' ? 'Lock Session' : 'Unlock Session'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showLockUnlockModal = false; lockUnlockReason = ''; lockUnlockReasonError = ''; lockUnlockReasonTouched = false"
      >
        <NForm
          :model="{ reason: lockUnlockReason }"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
        >
          <NFormItem 
            label="Reason" 
            required 
            path="reason"
            :validation-status="lockUnlockReasonTouched && lockUnlockReasonError ? 'error' : undefined"
          >
            <NInput
              v-model:value="lockUnlockReason"
              type="textarea"
              :placeholder="lockUnlockAction === 'unlock' ? 'Why you want to unlock the session.' : `Why do you want to ${lockUnlockAction} this session?`"
              :rows="3"
              :maxlength="100"
              show-count
              :style="{ resize: 'none' }"
              @input="lockUnlockReasonTouched = true; if (lockUnlockReason) validateLockUnlockReason(lockUnlockReason)"
              @blur="lockUnlockReasonTouched = true; if (lockUnlockReason) validateLockUnlockReason(lockUnlockReason)"
            />
            <template v-if="lockUnlockReasonTouched && lockUnlockReasonError" #feedback>
              <span class="text-red-500 text-xs" style="margin-top: 4px; display: block; margin-bottom: 0;">{{ lockUnlockReasonError }}</span>
            </template>
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton 
              strong 
              type="error" 
              @click="showLockUnlockModal = false; lockUnlockReason = ''; lockUnlockReasonError = ''; lockUnlockReasonTouched = false"
            >
              Cancel
            </NButton>
            <NButton 
              strong 
              type="success" 
              :disabled="!!lockUnlockReasonError || !lockUnlockReason || lockUnlockReason.trim().length < 10 || lockUnlockReason.length > 100 || isSubmittingLockUnlock"
              @click="handleLockUnlockSession"
            >
              Submit
          </NButton>
        </div>
      </template>
    </NCard>
  </NModal>
  </div>
</template>

<style scoped>
.tag-wrapper {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count-wrapper {
  display: inline-flex;
  align-items: center;
}

.count-only {
  width: 100%;
  display: inline-flex;
  align-items: center;
}

:deep(.n-form-item-label) {
  text-align: left !important;
}

.create-session-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  width: 100%;
  justify-content: space-between;
}

.create-session-form-wrapper {
  flex: 1;
  min-width: 0;
  width: 50%;
}

/* Hide scrollbar for filter dropdowns - using :deep() to target popover content */
:deep(.filter-scroll-container) {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

:deep(.filter-scroll-container::-webkit-scrollbar) {
  display: none !important; /* Chrome, Safari, Opera */
  width: 0 !important;
  height: 0 !important;
}

/* Hide scrollbar for uploaded files list */
.scrollbar-hide {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none !important; /* Chrome, Safari, Opera */
  width: 0 !important;
  height: 0 !important;
}

/* Hide horizontal scrollbar for data table */
:deep(.n-data-table-wrapper) {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

:deep(.n-data-table-wrapper::-webkit-scrollbar) {
  display: none !important; /* Chrome, Safari, Opera */
  width: 0 !important;
  height: 0 !important;
}

/* Global styles for filter scroll containers (popover content rendered outside component) */
.filter-scroll-container {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

.filter-scroll-container::-webkit-scrollbar {
  display: none !important; /* Chrome, Safari, Opera */
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

/* Filter icon color classes */
.filter-icon-active {
  color: #1890ff !important;
}

.filter-icon-inactive {
  color: #8c8c8c !important;
}

:deep(.create-session-form) {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 !important;
}

:deep(.create-session-form .n-base-selection) {
  min-height: 36px;
  height: auto;
}

/* Hide empty wrapper divs and hidden tag helpers for :: values (suffixed values used for checkbox state) */
:deep(.n-base-selection-tag-wrapper:empty) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Hide the hidden tag helper spans */
:deep(.n-base-selection-tag-wrapper .hidden-tag-helper) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Hide wrapper that only contains hidden helper (using :has if supported, fallback to direct child) */
:deep(.n-base-selection-tag-wrapper:has(.hidden-tag-helper:only-child)) {
  display: none !important;
}

.create-session-upload-wrapper {
  flex: 1;
  min-width: 0;
  width: 50%;
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.upload-section {
  position: sticky;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 70%;
  align-items: center;
}

:deep(.upload-component) {
  width: 100%;
  height: 100%;
  max-width: 100%;
}

:deep(.upload-dragger-full) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
}

:deep(.n-upload-dragger) {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  background-color: transparent;
  transition: border-color 0.3s;
  min-height: 198px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

:deep(.n-upload-dragger:hover) {
  border-color: #1890ff;
}

.create-session-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0px;
  margin-top: 20px;
}
/* Target the label content area specifically */
:deep(.create-session-form .n-form-item-label) {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
}



:deep(.ellipsis-button:hover) {
  background-color: rgba(128, 128, 128, 0.3) !important;
  border-color: rgba(128, 128, 128, 0.5) !important;
}

:deep(.ellipsis-button:active) {
  background-color: rgba(128, 128, 128, 0.3) !important;
  border-color: rgba(128, 128, 128, 0.5) !important;
}

:deep(.n-dropdown-option) {
  background-color: transparent !important;
}

:deep(.n-dropdown-option:hover) {
  background-color: #808080 !important;
}

:deep(.n-dropdown-option:active) {
  background-color: #808080 !important;
}

:deep(.n-dropdown-option:focus) {
  background-color: #808080 !important;
}

:deep(.n-dropdown-option:hover:active) {
  background-color: #808080 !important;
}

:deep(.n-dropdown-option:focus:active) {
  background-color: #808080 !important;
}

/* Delete menu item color - applies to all states */
:deep(.delete-menu-item),
:deep(.n-dropdown-option .delete-menu-item),
:deep(.n-dropdown-option:hover .delete-menu-item),
:deep(.n-dropdown-option:active .delete-menu-item),
:deep(.n-dropdown-option:focus .delete-menu-item),
:deep(.n-dropdown-option:hover:active .delete-menu-item),
:deep(.n-dropdown-option:focus:active .delete-menu-item),
:deep(.n-dropdown-option[data-key="delete"]),
:deep(.n-dropdown-option[data-key="delete"]:hover),
:deep(.n-dropdown-option[data-key="delete"]:active),
:deep(.n-dropdown-option[data-key="delete"]:focus) {
  color: #F87777 !important;
}

/* Analysis menu item color - applies to all states */
:deep(.analysis-menu-item),
:deep(.n-dropdown-option .analysis-menu-item),
:deep(.n-dropdown-option:hover .analysis-menu-item),
:deep(.n-dropdown-option:active .analysis-menu-item),
:deep(.n-dropdown-option:focus .analysis-menu-item),
:deep(.n-dropdown-option:hover:active .analysis-menu-item),
:deep(.n-dropdown-option:focus:active .analysis-menu-item),
:deep(.n-dropdown-option[data-key="analysis"]),
:deep(.n-dropdown-option[data-key="analysis"]:hover),
:deep(.n-dropdown-option[data-key="analysis"]:active),
:deep(.n-dropdown-option[data-key="analysis"]:focus) {
  color: #F2C97D !important;
}

/* Additional targeting for nested elements */
:deep(.n-dropdown-menu .delete-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option .delete-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:hover .delete-menu-item) {
  color: #F87777 !important;
}

:deep(.n-dropdown-menu .analysis-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option .analysis-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:hover .analysis-menu-item) {
  color: #F2C97D !important;
}

/* Target the specific nested label class for Delete - using the exact class path */
:deep(.n-dropdown-menu .n-dropdown-option .n-dropdown-option-body .n-dropdown-option-body__label .delete-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:hover .n-dropdown-option-body .n-dropdown-option-body__label .delete-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:active .n-dropdown-option-body .n-dropdown-option-body__label .delete-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:focus .n-dropdown-option-body .n-dropdown-option-body__label .delete-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="delete"] .n-dropdown-option-body .n-dropdown-option-body__label),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="delete"]:hover .n-dropdown-option-body .n-dropdown-option-body__label),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="delete"]:active .n-dropdown-option-body .n-dropdown-option-body__label),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="delete"]:focus .n-dropdown-option-body .n-dropdown-option-body__label) {
  color: #F87777 !important;
}

/* Target the specific nested label class for Analysis - using the exact class path */
:deep(.n-dropdown-menu .n-dropdown-option .n-dropdown-option-body .n-dropdown-option-body__label .analysis-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:hover .n-dropdown-option-body .n-dropdown-option-body__label .analysis-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:active .n-dropdown-option-body .n-dropdown-option-body__label .analysis-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option:focus .n-dropdown-option-body .n-dropdown-option-body__label .analysis-menu-item),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="analysis"] .n-dropdown-option-body .n-dropdown-option-body__label),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="analysis"]:hover .n-dropdown-option-body .n-dropdown-option-body__label),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="analysis"]:active .n-dropdown-option-body .n-dropdown-option-body__label),
:deep(.n-dropdown-menu .n-dropdown-option[data-key="analysis"]:focus .n-dropdown-option-body .n-dropdown-option-body__label) {
  color: #F2C97D !important;
}

/* Request Approval button styling */
.request-approval-btn {
  color: #1890ff !important;
}

.request-approval-btn:hover {
  color: #000000 !important;
}
</style>
