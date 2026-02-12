<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import { NTabs, useNotification, NTabPane } from 'naive-ui'

definePageMeta({
  layout: 'default',
})

const { $client } = useNuxtApp()
const router = useRouter()
const notification = useNotification()

const activeTab = ref<string>('projectCode')


onMounted(() => {
  const { query } = router.currentRoute.value;
  if (query && query.sessionTab) {
    activeTab!.value = query.sessionTab;
  }
});

async function routeCheck() {
  const tab = activeTab.value;
  router.push({ path: 'master', replace: true, query : {tab : 'sessionCodes' ,sessionTab : tab}});
}

</script>
<template>
  <div class="px-2 py-4">
      <NTabs data-testid="session-codes-tabs" v-model:value="activeTab" default-value="label" @update:value="routeCheck()">
          <NTabPane data-testid="session-codes-tab-project-code" name="projectCode" tab="Project Code">
              <SessionCodeMastersProjectCode />
          </NTabPane>
          <NTabPane data-testid="session-codes-tab-sub-project-code" name="subProjectCode" tab="Sub Project Code">
              <SessionCodeMastersSubProjectCode/>
          </NTabPane>
          <NTabPane data-testid="session-codes-tab-use-case-code" name="useCaseCode" tab="Use Case Code">
              <SessionCodeMastersUseCaseCode/>
          </NTabPane>
          <NTabPane data-testid="session-codes-tab-anatomy-plane-code" name="anatomyPlaneCode" tab="Anatomy Plane Code">
              <SessionCodeMastersAnatomyPlaneCode/>
          </NTabPane>
          <NTabPane data-testid="session-codes-tab-center-code" name="centerCode" tab="Center Code">
              <SessionCodeMastersCenterCode/>
          </NTabPane>
          <NTabPane data-testid="session-codes-tab-user-type-code" name="userTypeCode" tab="User Type Code">
              <SessionCodeMastersUserTypeCode/>
          </NTabPane>
      </NTabs>
  </div>
</template>