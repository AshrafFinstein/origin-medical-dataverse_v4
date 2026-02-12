<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import type { Taxonomy } from '@prisma/client'
import type { DataTableColumns, DataTableSortState  } from 'naive-ui'
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, NColorPicker, useNotification } from 'naive-ui'
import type { TaxonomyCreateManyInput } from '../trpc/routes/taxonomy'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'
import { debounce } from 'lodash'
import SearchComponent from '~/components/searchBarMasters.vue'
import { useErrorFormatter } from '~/composables/useErrorFormatter'


definePageMeta({
  layout: 'default',
})

interface TaxonomyLabel {
  id?: string;
  annotationId: string | null;
  colorCode: string | null;
}

const route = useRoute()
const { $client } = useNuxtApp()
const router = useRouter()
const notification = useNotification()
const { formatErrorMessage } = useErrorFormatter()
const searchQuery = ref('')
const loading = ref(false)
const data = ref<any>(null)
const totalDataCount = ref(0)
const editedRow = ref<Taxonomy | null>(null)
const showSubmit = ref<boolean>(true)

// Get annotation master data
const { data: annotationMasterData } = await $client.annotation.list.useQuery({})

// TABLE
const table = ref(null)
const columns = computed<DataTableColumns<Taxonomy>>(() => [
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
          'data-testid': `taxonomy-name-input-${index}`,
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
    render: (row: Taxonomy) => {
      return row.updatedAt.toLocaleString()
    },
  },
  {
    key: 'createdAt',
    title: 'Created at',
    width: '20%',
    sorter: true,
    sortOrder: sortKeyMapOrder.value.createdAt || false,
    render: (row: Taxonomy) => {
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
          'data-testid': `taxonomy-actions-row-${index}`,
        },
        canUpdateTaxonomy.value ? 
        h(
            NButton,
            {
              strong: true,
              tertiary: false,
              size: 'small',
              'data-testid': `taxonomy-edit-button-${index}`,
              onClick: () => {
                showSubmit.value = false;
                const selectedData = data?.value.data?.find((e) => e.id === row.id);
                if (selectedData) {
                  newTaxonomy.value = {
                    id: row.id,
                    name: selectedData.name,
                    typesInTaxonomies: selectedData.typesInTaxonomies.map((item) => ({
                      id: item.id,
                      annotationId: item.annotationId,  // Use annotationId instead of name
                      colorCode: item.colorCode
                    })),
                  };
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
    await fetchTaxonomies()
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
    await fetchTaxonomies()
  },
  onUpdatePageSize: async (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    await fetchTaxonomies()
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


// LIST TAXONOMY
async function fetchTaxonomies({
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
  await $client.taxonomy.list.query({
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

// Watch for empty search
watch(searchQuery, (newValue) => {
  // Only refresh when search is cleared (becomes empty)
  if (newValue === '') {
    fetchTaxonomies();
  }
})

// CREATE TAXONOMY
const newTaxonomy = ref<TaxonomyCreateManyInput | null>(null)
const isCreatingTaxonomy = computed(() => !!newTaxonomy.value)

async function createTaxonomy() {
  if (newTaxonomy.value) {
    try {
      // Validate that all required fields are present
      for (const item of newTaxonomy.value.typesInTaxonomies) {
        if (!item.annotationId) {
          throw new Error('All annotations must be selected')
        }
      }

      await $client.taxonomy.createTaxonomy.mutate([{
        name: newTaxonomy.value.name,
        typesInTaxonomies: newTaxonomy.value.typesInTaxonomies.map(item => ({
          annotationId: item.annotationId!,
          colorCode: item.colorCode || 'rgb(0,0,0)'
        }))
      }])
      
      notification.success({ content: 'Taxonomy Created Successfully', duration: 5000 })
      newTaxonomy.value = null
      await fetchTaxonomies()
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

const taxonomyTypeResult = await $client.taxonomy.taxonomyTypeList.useQuery({ });

watch(data, () => {
  if (data.value?.metadata.totalCount)
    pagination.pageCount = Math.ceil(data.value.metadata.totalCount / pagination.pageSize)
}, {
  immediate: true,
})


const duplicateTaxonomy = (data: TaxonomyLabel) => {
  const newLabel = {
    annotationId: data.annotationId,
    colorCode: data.colorCode
  }
  newTaxonomy!.value!.typesInTaxonomies.push(newLabel)
}

const canCreateTaxonomy = ref<boolean>(false);
const canUpdateTaxonomy = ref<boolean>(false);

async function checkAbilities() {
  canCreateTaxonomy.value = await defineAbilitiesFor(Module.Taxonomy, Action.CREATE);
  canUpdateTaxonomy.value = await defineAbilitiesFor(Module.Taxonomy, Action.UPDATE);
}

onMounted(() => {
  checkAbilities();
  fetchTaxonomies(); // Fetch data on mount
});

watch(route, () => {
  checkAbilities();
});

// Add these refs for managing the confirmation modal
const showDeletionConfirmation = ref(false);
const confirmationDetails = ref<any[]>([]);
const pendingUpdateData = ref<any>(null);
const isUpdating = ref(false);


async function updateTaxonomyRow(row: any) {
  if (isUpdating.value) {
    return
  }
  
  try {
    // Validate that all required fields are present
    isUpdating.value = true;
    for (const item of row.typesInTaxonomies) {
      if (!item.annotationId) {
        throw new Error('All annotations must be selected')
      }
    }

    // First attempt the update to check for affected records
    const updateResult = await $client.taxonomy.updateTaxonomy.mutate({
      id: row.id,
      name: row.name,
      typesInTaxonomies: row.typesInTaxonomies.map((item: TaxonomyLabel) => ({
        id: item.id || undefined,
        annotationId: item.annotationId!,
        colorCode: item.colorCode || 'rgb(0,0,0)'
      })),
      confirmDeletion: false // First try without confirmation
    });

    // Check if confirmation is required
    if (updateResult.requiresConfirmation) {
      // Store the current update data for later use
      pendingUpdateData.value = row;
      // Format the confirmation details from annotation changes
      confirmationDetails.value = updateResult.annotationChanges.map((change: any) => ({
        typeId: change.typeId,
        oldAnnotationName: change.currentAnnotationName,
        newAnnotationId: change.newAnnotationId,
        affectedSessions: change.affectedSessions.map((session: any) => ({
          sessionId: session.sessionId,
          sessionName: session.sessionName,
          currentAnnotationName: session.currentAnnotationName
        }))
      }));
      // Show the confirmation modal
      showDeletionConfirmation.value = true;
      return;
    }
    notification.success({ content: 'Taxonomy Updated Successfully', duration: 5000 });
    newTaxonomy.value = null;
    await fetchTaxonomies();
    showDeletionConfirmation.value = false;
  } catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error),
      duration: 5000,
      closable: true,
    });
  } finally {
    isUpdating.value = false;
  }
}

// Function to handle the confirmed update
async function handleConfirmedUpdate(row: any) {
  try {
    const result = await $client.taxonomy.updateTaxonomy.mutate({
      id: row.id,
      name: row.name,
      typesInTaxonomies: row.typesInTaxonomies.map((item: TaxonomyLabel) => ({
        id: item.id || undefined,
        annotationId: item.annotationId!,
        colorCode: item.colorCode || 'rgb(0,0,0)'
      })),
      confirmDeletion: true 
    });

    notification.success({ content: 'Taxonomy Updated Successfully', duration: 5000 });
    newTaxonomy.value = null;
    await fetchTaxonomies();
    showDeletionConfirmation.value = false;
  } catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error),
      duration: 5000,
      closable: true,
    });
  }
}

// Functions to handle modal actions
function handleCancel() {
  showDeletionConfirmation.value = false;
  pendingUpdateData.value = null;
  confirmationDetails.value = [];
}

function handleConfirm() {
  if (pendingUpdateData.value) {
    handleConfirmedUpdate(pendingUpdateData.value);
  }
}

const showDeletionModal = ref(false);
const deletionDetails = ref<any>(null);
const pendingDeleteData = ref<any>(null);
const isDeletingTaxonomy = ref(false);

// deleteTaxonomyType function
async function deleteTaxonomyType(row: Taxonomy) {
  if (isDeletingTaxonomy.value) return;
  
  try {
    isDeletingTaxonomy.value = true;
    
    // First attempt to delete to check for affected records
    const deleteResult = await $client.taxonomy.deleteTaxonomyType.mutate({
      typesInTaxonomies: [{
        id: row.id
      }],
      confirmDelete: false // First try without confirmation
    });

    // Check if confirmation is required
    if (deleteResult.requiresConfirmation) {
      pendingDeleteData.value = row;
      deletionDetails.value = deleteResult.affectedRecords;
      showDeletionModal.value = true;
      return;
    }

    // If no confirmation needed, process deletion
    await handleConfirmedDeletion(row);

  } catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error) || 'An error occurred',
      duration: 5000,
      closable: true,
    });
  } finally {
    isDeletingTaxonomy.value = false;
  }
}

// Function to handle confirmed deletion
async function handleConfirmedDeletion(row: Taxonomy) {
  try {
    await $client.taxonomy.deleteTaxonomyType.mutate({
      typesInTaxonomies: [{
        id: row.id
      }],
      confirmDelete: true
    });
    
    if (newTaxonomy.value && newTaxonomy.value.typesInTaxonomies) {
      const index = newTaxonomy.value.typesInTaxonomies.findIndex(item => item.id === row.id);
      if (index !== -1) {
        newTaxonomy.value.typesInTaxonomies.splice(index, 1);
      }
    }
    
    notification.success({ 
      content: `Taxonomy Type Deleted Successfully`, 
      duration: 5000 
    });
    
    await fetchTaxonomies();
    showDeletionModal.value = false;
    pendingDeleteData.value = null;
    deletionDetails.value = null;
    
  } catch (error: any) {
    notification.create({
      title: 'Error',
      type: 'error',
      content: formatErrorMessage(error) || 'An error occurred',
      duration: 5000,
      closable: true,
    });
  }
}

// Functions to handle deletion modal actions
function handleDeleteCancel() {
  showDeletionModal.value = false;
  pendingDeleteData.value = null;
  deletionDetails.value = null;
  isDeletingTaxonomy.value = false;
}

function handleDeleteConfirm() {
  if (pendingDeleteData.value) {
    handleConfirmedDeletion(pendingDeleteData.value);
  }
}

function handleDeleteClick(label, index) {
  if (label.id) {
    // If it has an ID, it exists in the database
    deleteTaxonomyType({ id: label.id });
  } else {
    // If no ID, it's a new unsaved annotation
    newTaxonomy.value.typesInTaxonomies.splice(index, 1);
  }
}

</script>

<template>
  <div>
    <div>
      <div class="inline-flex w-full justify-between items-center px-2 py-4">
        <div class="inline-flex items-center gap-2">
          <h2>Taxonomy</h2>
        </div>
        <div class="flex space-x-4">
          <SearchComponent
            v-model="searchQuery"
            :on-search="fetchTaxonomies"
            placeholder="Search"
          />
          <NButton data-testid="taxonomy-create-button" v-if="canCreateTaxonomy" strong secondary type="primary" @click="showSubmit=true;newTaxonomy = {
              name: '',
              typesInTaxonomies: [{
                annotationId: null,
                colorCode: null
              }],
            }">
            Create a Taxonomy
          </NButton>
        </div>
      </div>
      <NDataTable 
        data-testid="taxonomy-table"
        ref="table" 
        :key="(row: Taxonomy) => row.id" 
        remote 
        :columns="columns" 
        :data="data?.data"
        :loading="loading" 
        :pagination="pagination" 
        @update:sorter="handleSorterChange" 
      />
    </div>
    <NModal v-if="newTaxonomy" v-model:show="isCreatingTaxonomy" data-testid="taxonomy-create-modal">
      <NCard class="w-[80vh]" :title="showSubmit ? 'Create a Taxonomy' : 'Update a Taxonomy'" :bordered="false"
        size="huge" role="dialog" aria-modal="true" closable @close="newTaxonomy = null">
        <NForm :model="newTaxonomy" label-placement="left" require-mark-placement="right-hanging" size="medium"
          label-width="auto">
          <NFormItem label="Enter taxonomy name" path="name">
            <NInput data-testid="taxonomy-create-name-input" v-model:value="newTaxonomy.name" placeholder="Give the taxonomy a name" />
          </NFormItem>
          <p class="mb-[20px]">Annotations</p>
          <NFormItem>
            <div class="flex flex-col w-full gap-2">
              <div
                v-for="(label, index) in newTaxonomy.typesInTaxonomies"
                :key="index"
                class="inline-flex w-full items-center gap-2"
                :data-testid="`taxonomy-annotation-row-${index}`"
              >
                <div class="flex flex-row gap-2 w-[100%]">
                  <NSelect
                    :data-testid="`taxonomy-annotation-select-${index}`"
                    v-model:value="label.annotationId"
                    filterable
                    clearable
                    :options="annotationMasterData?.data?.map((annotation) => ({
                      label: annotation.name,
                      value: annotation.id,
                    }))"
                    placeholder="Select annotation"
                  />
                </div>
                <div class="flex flex-row gap-2 w-[100%]">
                  <NColorPicker
                    :data-testid="`taxonomy-color-picker-${index}`"
                    v-model:value="label.colorCode"
                    :show-alpha="false"
                  />
                </div>
                <div
                  class="w-14 h-14 cursor-pointer gap-2"
                  :data-testid="`taxonomy-duplicate-button-${index}`"
                  @click="duplicateTaxonomy(label)"
                >
                  <svg viewBox="0 0 512 512" class="w-full h-full">
                    <path
                      d="M395.88 80A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80z"
                      fill="currentColor" />
                    <path
                      d="M408 112H184a72 72 0 0 0-72 72v224a72 72 0 0 0 72 72h224a72 72 0 0 0 72-72V184a72 72 0 0 0-72-72zm-32.45 200H312v63.55c0 8.61-6.62 16-15.23 16.43A16 16 0 0 1 280 376v-64h-63.55c-8.61 0-16-6.62-16.43-15.23A16 16 0 0 1 216 280h64v-63.55c0-8.61 6.62-16 15.23-16.43A16 16 0 0 1 312 216v64h64a16 16 0 0 1 16 16.77c-.42 8.61-7.84 15.23-16.45 15.23z"
                      fill="currentColor" />
                  </svg>
                </div>
                <Icon
                  :data-testid="`taxonomy-delete-annotation-button-${index}`"
                  name="ph:trash"
                  class="flex-none text-primary-500 hover:text-primary-300 cursor-pointer"
                  @click="handleDeleteClick(label, index)"
                />
              </div>
              <div
                class="inline-flex items-center gap-1 text-primary-500 hover:text-primary-300 text-sm cursor-pointer"
                data-testid="taxonomy-add-annotation-button"
                @click="newTaxonomy.typesInTaxonomies.push({
                  annotationId: null,
                  colorCode: null
                })"
              >
                <Icon name="ph:plus-circle" class="flex-none" />
                <span>Add</span>
              </div>
            </div>
          </NFormItem>
        </NForm>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="taxonomy-create-cancel-button" strong type="error" @click="newTaxonomy = null">
              Cancel
            </NButton>
            <NButton data-testid="taxonomy-create-submit-button" strong type="success" v-if="showSubmit" @click="createTaxonomy">
              Submit
            </NButton>
            <NButton data-testid="taxonomy-update-button" v-if="!showSubmit" strong type="success" :loading="isUpdating"
            :disabled="isUpdating" @click="updateTaxonomyRow(newTaxonomy)">
              Update
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
    <NModal v-model:show="showDeletionConfirmation" data-testid="taxonomy-update-confirmation-modal">
      <NCard class="w-[600px]" title="Confirm Taxonomy Update" :bordered="false" size="huge" role="dialog"
        aria-modal="true" closable @close="handleCancel">
        <div class="whitespace-pre-line">
          <h4>The following annotations have related records that will be affected:</h4>
          <div class="mt-4">
            <div v-for="(detail, index) in confirmationDetails" :key="index" class="mb-4">
              <div class="font-semibold">{{ detail.oldAnnotationName }}</div>
              <div class="ml-4">
                <div>Total DL Sessions affected: {{ detail.affectedSessions.length }}</div>
                <div class="mt-2">Affected DL Sessions:</div>
                <div v-for="(session, sIndex) in detail.affectedSessions" :key="sIndex" class="ml-4">
                  <div class="ml-2">{{ session.sessionName }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 font-medium text-red-500">
            This action cannot be undone. Do you want to proceed with the deletion?
          </div>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="taxonomy-update-confirmation-cancel-button" strong type="default" @click="handleCancel">
              Cancel
            </NButton>
            <NButton data-testid="taxonomy-update-confirmation-proceed-button" strong type="error" @click="handleConfirm">
              Yes, Proceed
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
    <NModal v-model:show="showDeletionModal" data-testid="taxonomy-delete-modal">
      <NCard 
        class="w-[600px]" 
        title="Confirm Taxonomy Type Deletion" 
        :bordered="false" 
        size="huge" 
        role="dialog"
        aria-modal="true" 
        closable 
        @close="handleDeleteCancel"
      >
        <div class="whitespace-pre-line">
          <h4>The following records will be affected by this deletion:</h4>
          <div class="mt-4">
            <div v-for="(record, index) in deletionDetails" :key="index" class="mb-4">
              <div class="font-semibold">{{ record.annotationName }}</div>
              <div class="ml-4">
                <div>Total DL Sessions affected: {{ record.relatedCounts.totalSessions }}</div>
                <div>Total Records affected: {{ record.relatedCounts.totalRecords }}</div>
                <div v-if="record.relatedCounts.affectedDLSessions.length > 0" class="mt-2">
                  Affected DL Sessions:
                  <div v-for="(session, sIndex) in record.relatedCounts.affectedDLSessions" 
                      :key="sIndex" 
                      class="ml-4"
                  >
                    <div class="ml-2">
                      {{ session.sessionName }}
                      <span class="text-gray-500">
                        ({{ session.taxonomyDataCount }} taxonomy data, 
                        {{ session.childTaxonomyCount }} child taxonomies)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 font-medium text-red-500">
            This action cannot be undone. Do you want to proceed with the deletion?
          </div>
        </div>
        <template #footer>
          <div class="inline-flex items-center justify-end gap-2 w-full">
            <NButton data-testid="taxonomy-delete-cancel-button" strong type="default" @click="handleDeleteCancel">
              Cancel
            </NButton>
            <NButton 
              data-testid="taxonomy-delete-confirm-button"
              strong 
              type="error" 
              :loading="isDeletingTaxonomy"
              :disabled="isDeletingTaxonomy"
              @click="handleDeleteConfirm"
            >
              Yes, Delete
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>