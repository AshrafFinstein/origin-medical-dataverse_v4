<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { StructureGroups } from '@prisma/client'
import type { DataTableColumns, DataTableSortState  } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, NColorPicker, useNotification, NPopconfirm, NTooltip } from 'naive-ui'
import { StructureGroupCreateInput } from '~~/types'
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
const editedRow = ref<StructureGroups | null>(null)

// Validation state
const nameError = ref('')
const nameTouched = ref(false)
const structureErrors = ref<Record<number, string>>({})
const structureTouched = ref<Record<number, boolean>>({})

// Use centralized validation utilities
const { validateRequired, validatePattern } = useFormValidation()

// Validation regex pattern - allows letters, numbers, underscores, and hyphens only
const validationPattern = /^[A-Za-z0-9_-]+$/

// Function to filter input to only allow valid characters
function filterInput(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '')
}

// Validation function for Structure Group Name
function validateName(value: string | undefined) {
  // Check required
  const requiredError = validateRequired(value, 'Structure Group Name')
  if (requiredError) {
    nameError.value = requiredError
    return false
  }
  
  // Check pattern
  const patternError = validatePattern(value!, 'Structure Group Name', validationPattern)
  if (patternError) {
    nameError.value = patternError
    return false
  }
  
  nameError.value = ''
  return true
}

// Validation function for Structure Name
function validateStructureName(value: string | undefined, index: number) {
  // Check required
  const requiredError = validateRequired(value, 'Structure Name')
  if (requiredError) {
    structureErrors.value[index] = requiredError
    return false
  }
  
  // Check pattern
  const patternError = validatePattern(value!, 'Structure Name', validationPattern)
  if (patternError) {
    structureErrors.value[index] = patternError
    return false
  }
  
  structureErrors.value[index] = ''
  return true
}

// Validate all structures
function validateAllStructures(): boolean {
  if (!newStructureGroup.value) return false
  
  let isValid = true
  newStructureGroup.value.structureInStructureGroup.forEach((structure, index) => {
    structureTouched.value[index] = true
    if (!validateStructureName(structure.name, index)) {
      isValid = false
    }
  })
  
  return isValid
}

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<StructureGroups>>(() => [
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
          'data-testid': `structure-name-input-${index}`,
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
    render: (row: StructureGroups) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: StructureGroups) => {
      return row.createdAt.toLocaleString()
    },
  },
  {
    key: 'actions',
    width: '30%',
    title: 'Actions',
    render(row, index) {
      return h(
        'div',
        {
          class: 'inline-flex items-center gap-2',
          'data-testid': `structure-actions-row-${index}`,
        },
        canUpdateStructures.value ? 
          h(
            NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `structure-edit-button-${index}`,
              onClick: () => {
                showSubmit.value = false
                const filteredData = data?.value.data?.filter((e) => e.id === row.id);
                if (filteredData && filteredData.length > 0) {
                  const selectedData = filteredData[0];
                  const structureGroupData = {
                    id: row.id,
                    name: selectedData.name,
                    structureInStructureGroup: selectedData.StructureInStructureGroup.map((item) => ({
                      id: item.id,
                      name: item.name,
                      structureGroupId: item.structureGroupId
                    })),
                  };
                  newStructureGroup.value = structureGroupData;
                  // Store original values for comparison
                  originalStructureGroup.value = JSON.parse(JSON.stringify(structureGroupData));
                  // Clear validation errors and touched state when editing
                  nameError.value = ''
                  nameTouched.value = false
                  structureErrors.value = {}
                  structureTouched.value = {}
                }
              },
            },
            { default: () => 'Edit' }
          ) : null
      );
    },
    }
]);

async function handleSorterChange(sorters: DataTableSortState | DataTableSortState[] | null) {
  if (!loading.value) {
    sortStates.value = [].concat(sorters as any)
    await fetchStructures()
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
    await fetchStructures()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchStructures()
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


// LIST Structure
async function fetchStructures({
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
  await $client.structures.list.query({
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
      fetchStructures()
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
    await fetchStructures()
  } finally {
    // Reset flag after a short delay to allow watcher to complete
    setTimeout(() => {
      isHandlingSearch.value = false
    }, 100)
  }
}

// CREATE STRUCTURE GROUP
const newStructureGroup = ref<StructureGroupCreateInput | null>(null)
const originalStructureGroup = ref<StructureGroupCreateInput | null>(null)
const showSubmit = ref<boolean>(true)
const isCreatingStructureGroup = computed(() => !!newStructureGroup.value)

// Check if there are changes in the form
const hasChanges = computed(() => {
  if (!newStructureGroup.value || !originalStructureGroup.value || showSubmit.value) {
    return false
  }
  
  // Compare name
  if (newStructureGroup.value.name !== originalStructureGroup.value.name) {
    return true
  }
  
  // Compare structures - check if count changed
  const currentStructures = newStructureGroup.value.structureInStructureGroup || []
  const originalStructures = originalStructureGroup.value.structureInStructureGroup || []
  
  if (currentStructures.length !== originalStructures.length) {
    return true
  }
  
  // Compare each structure by id and name
  for (let i = 0; i < currentStructures.length; i++) {
    const current = currentStructures[i]
    const original = originalStructures[i]
    
    // If IDs don't match, something changed
    if (current.id !== original.id) {
      return true
    }
    
    // If names don't match, something changed
    if (current.name !== original.name) {
      return true
    }
  }
  
  return false
})

async function createStructureGroup() {
  if (newStructureGroup.value) {
    // Mark field as touched when submitting
    nameTouched.value = true
    
    // Validate Structure Group Name before saving
    const isNameValid = validateName(newStructureGroup.value.name)
    
    if (!isNameValid) {
      return
    }
    
    // Validate all structures before saving
    const areStructuresValid = validateAllStructures()
    
    if (!areStructuresValid) {
      return
    }
    
    try {
      await $client.structures.createStructureGroup.mutate(newStructureGroup.value)
      notification.success({ content: `Structure Group Created Successfully`, duration: 5000 })
      newStructureGroup.value = null
      nameError.value = ''
      nameTouched.value = false
      structureErrors.value = {}
      structureTouched.value = {}
      await fetchStructures()
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

// DELETE Structure
async function deleteStructure(structureId: string, index: number) {
  try {
    if (structureId) {
      await $client.structures.deleteStructureInStructureGroup.mutate({
        id : structureId
      });
      notification.success({ content: `Structure Deleted Successfully`, duration: 5000 });
      
      if (newStructureGroup.value && newStructureGroup.value.structureInStructureGroup) {
        newStructureGroup.value.structureInStructureGroup.splice(index, 1) // Remove from the DOM
        // Clean up validation state for deleted structure and reindex remaining structures
        const newErrors: Record<number, string> = {}
        const newTouched: Record<number, boolean> = {}
        Object.keys(structureErrors.value).forEach(key => {
          const keyNum = parseInt(key)
          if (keyNum < index) {
            newErrors[keyNum] = structureErrors.value[keyNum]
            newTouched[keyNum] = structureTouched.value[keyNum]
          } else if (keyNum > index) {
            newErrors[keyNum - 1] = structureErrors.value[keyNum]
            newTouched[keyNum - 1] = structureTouched.value[keyNum]
          }
        })
        structureErrors.value = newErrors
        structureTouched.value = newTouched
      }
    } else {
      if (newStructureGroup.value && newStructureGroup.value.structureInStructureGroup) {
        newStructureGroup.value.structureInStructureGroup.splice(index, 1)
        // Clean up validation state for deleted structure and reindex remaining structures
        const newErrors: Record<number, string> = {}
        const newTouched: Record<number, boolean> = {}
        Object.keys(structureErrors.value).forEach(key => {
          const keyNum = parseInt(key)
          if (keyNum < index) {
            newErrors[keyNum] = structureErrors.value[keyNum]
            newTouched[keyNum] = structureTouched.value[keyNum]
          } else if (keyNum > index) {
            newErrors[keyNum - 1] = structureErrors.value[keyNum]
            newTouched[keyNum - 1] = structureTouched.value[keyNum]
          }
        })
        structureErrors.value = newErrors
        structureTouched.value = newTouched
      }
    }
  } catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error) || 'An error occurred',
      duration: 5000,
      closable: true,
    });
  } finally {
    await fetchStructures();
  }
}

// UPDATE STRUCTURE GROUP
async function updateStructureGroup(row: StructureGroupCreateInput) {
  // Mark field as touched when submitting
  nameTouched.value = true
  
  // Validate Structure Group Name before updating
  const isNameValid = validateName(row.name)
  
  if (!isNameValid) {
    return
  }
  
  // Validate all structures before updating
  const areStructuresValid = validateAllStructures()
  
  if (!areStructuresValid) {
    return
  }
  
  try {
    const filteredRow = row;

    await $client.structures.updateStructureGroup.mutate({
      id: filteredRow.id != null ? filteredRow.id.toString() : '',
      name: filteredRow.name != null ? filteredRow.name : '',
      structureInStructureGroup: filteredRow.structureInStructureGroup.map(resource => ({
        id: resource.id != null ? resource.id.toString() : '',
        structureGroupId: filteredRow.id != null ? filteredRow.id.toString() : '',
        name: resource.name != null ? resource.name.toString() : ''
      })),
    })
    newStructureGroup.value = null
    originalStructureGroup.value = null
    nameError.value = ''
    nameTouched.value = false
    structureErrors.value = {}
    structureTouched.value = {}
    notification.success({ content: `Structure Groups Updated Successfully`, duration: 5000 })
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
    newStructureGroup.value = null
    originalStructureGroup.value = null
    nameError.value = ''
    nameTouched.value = false
    structureErrors.value = {}
    structureTouched.value = {}
    await fetchStructures()
  }
}

watch(data, () => {
  if (data.value?.metadata.totalCount)
    pagination.pageCount = Math.ceil(data.value.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})

const canCreateStructures = ref<boolean>(false);
const canUpdateStructures = ref<boolean>(false);

async function checkAbilities() {
  canCreateStructures.value = await defineAbilitiesFor(Module.StructureGroup, Action.CREATE);
  canUpdateStructures.value = await defineAbilitiesFor(Module.StructureGroup, Action.UPDATE);
}

onMounted(() => {
  checkAbilities();
  fetchStructures(); // Fetch data on mount
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
          <h2>Structure Group</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="handleSearch"
            placeholder="Search"
          />
        <NButton
          v-if="canCreateStructures"
          data-testid="structure-create-button"
          strong secondary type="primary" @click="showSubmit=true; newStructureGroup = {
            name: '',
            structureInStructureGroup: [{
              name: ''
            }],
          }; nameError = ''; nameTouched = false; structureErrors = {}; structureTouched = {};"
        >
          Create Structure Group
        </NButton>
        </div>
      </div>
      <NDataTable
        data-testid="structure-table"
        ref="table"
        :key="(row: StructureGroups) => row.id"
        remote
        :columns="columns"
        :data="data?.data"
        :loading="loading"
        :pagination="pagination"
        @update:sorter="handleSorterChange"
      />
    </div>
    <NModal
      v-if="newStructureGroup"
      v-model:show="isCreatingStructureGroup"
      data-testid="structure-create-modal"
    >
      <NCard
        class="w-[600px]"
        :title="showSubmit ? 'Create Structure Group' : 'Update Structure Group'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable 
        @close="newStructureGroup = null; originalStructureGroup = null; nameError = ''; nameTouched = false; structureErrors = {}; structureTouched = {};"
        :style="{ 
          '--n-title-padding-left': '0',
          height: 'auto',
          maxHeight: '90vh',
          width: '800px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }"
      >
        <div :style="{ 
          overflowY: 'auto', 
          flex: '1 1 auto', 
          minHeight: 0,
          maxHeight: 'calc(90vh - 180px)',
          paddingBottom: '20px',
          paddingRight: '16px'
        }">
          <NForm
            :model="newStructureGroup"
            label-placement="top"
            require-mark-placement="right-hanging"
            size="medium"
          >
            <div class="flex flex-col gap-4" style="padding-bottom: 10px;">
              <!-- Structure Group Name -->
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <label class="text-sm font-medium">Structure Group Name</label>
                  <span class="text-red-500">*</span>
                  <NInput 
                    data-testid="structure-create-name-input"
                    v-model:value="newStructureGroup.name" 
                    :placeholder="`Structure Group Name`"
                    :status="nameTouched && nameError ? 'error' : undefined"
                    @input="nameTouched = true; validateName(newStructureGroup.name)"
                    @blur="nameTouched = true; if (newStructureGroup) validateName(newStructureGroup.name)"
                    style="flex: 1;"
                  />
                </div>
                <div v-if="nameTouched && nameError" class="text-red-500 text-xs" style="height: 20px; display: flex;  padding-left: 165px; margin-top: 6px; margin-bottom: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ nameError }}
                </div>
                <div v-else style="height: 20px; flex-shrink: 0;"></div>
              </div>
            
            <!-- List of Structures -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-1">
                <label class="text-sm font-medium">List of Structures</label>
                <span class="text-red-500"> *</span>
              </div>
              <div class="flex flex-col gap-4">
                <div v-for="(structure, index) in newStructureGroup.structureInStructureGroup" :key="index" class="flex flex-col gap-1">
                  <div class="flex items-start gap-2 w-full">
                    <div class="flex-1">
                      <NInput 
                        :data-testid="`structure-create-structure-input-${index}`"
                        v-model:value="structure.name" 
                        :placeholder="`Enter a Structure Name`"
                        :status="structureTouched[index] && structureErrors[index] ? 'error' : undefined"
                        @input="structureTouched[index] = true; if (structure) validateStructureName(structure.name, index)"
                        @blur="structureTouched[index] = true; if (structure) validateStructureName(structure.name, index)"
                      />
                    </div>
                    <n-popconfirm
                      positive-text="Yes"
                      negative-text="No"
                      @positive-click="deleteStructure(structure.id!, index)"
                      to="body"
                      :z-index="3000"
                    >
                      <template #trigger>
                        <n-button style="flex-shrink: 0;">
                          <template #icon>
                            <Icon
                              name="ph:trash" 
                              class="flex-none text-primary-500 hover:text-primary-300 cursor-pointer"
                            />
                          </template>
                          Delete
                        </n-button>
                      </template>
                      Are you sure you want to delete the structure?
                    </n-popconfirm>
                  </div>
                  <div v-if="structureTouched[index] && structureErrors[index]" class="text-red-500 text-xs" style="height: 20px; display: flex; align-items: center; margin-top: 4px; margin-bottom: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ structureErrors[index] }}
                  </div>
                  <div v-else style="height: 20px; flex-shrink: 0;"></div>
                </div>
                <div
                  data-testid="structure-add-structure-button"
                  class="flex items-center gap-1 text-primary-500 hover:text-primary-300 text-sm cursor-pointer w-fit"
                  @click="newStructureGroup.structureInStructureGroup.push({ name: '' })"
                >
                  <Icon
                    name="ph:plus-circle"
                    class="flex-none"
                  />
                  <span>Add</span>
                </div>
              </div>
            </div>
          </div>
        </NForm>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full" style="flex-shrink: 0;">
            <NButton data-testid="structure-create-cancel-button" strong type="error" @click="newStructureGroup = null; originalStructureGroup = null; nameError = ''; nameTouched = false; structureErrors = {}; structureTouched = {};">
              Cancel
            </NButton>
            <NButton 
              data-testid="structure-create-submit-button"
              strong 
              type="success" 
              v-if="showSubmit" 
              @click="createStructureGroup"
              :disabled="!!nameError || !newStructureGroup.name || Object.values(structureErrors).some(err => err !== '') || newStructureGroup.structureInStructureGroup.some(s => !s.name)"
            >
              Submit
            </NButton>
            <NButton 
              data-testid="structure-update-button"
              v-if="!showSubmit" 
              strong 
              type="success" 
              @click="updateStructureGroup(newStructureGroup)"
              :disabled="!!nameError || !newStructureGroup.name || Object.values(structureErrors).some(err => err !== '') || newStructureGroup.structureInStructureGroup.some(s => !s.name) || !hasChanges"
            >
              Update
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>