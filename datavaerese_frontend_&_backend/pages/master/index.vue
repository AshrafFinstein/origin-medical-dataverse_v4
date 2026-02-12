<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import { NTabs, useNotification, NTabPane } from 'naive-ui'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'

definePageMeta({
  layout: 'default',
})

const { $client } = useNuxtApp()
const router = useRouter()
const notification = useNotification()
const route = useRoute()

// TABS
const tabs = [
  {
    key: 'label',
    name: 'Label',
  },
  {
    key: 'taxonomy',
    name: 'Taxonomy',
  },
]
const activeTab = ref<'label' | 'taxonomy' |'annotation'|'structuregroup' | 'usergroup' | 'sessionCodes' | 'rolePermissions' | 'users' | 'sessionLabel'>('label')

async function routeCheck() {
  const tab = activeTab.value;
  if (tab === 'label' || tab === 'taxonomy' ||tab ==='annotation' || tab === 'structuregroup' || tab === 'usergroup' || tab === 'rolePermissions' || tab === 'users' || tab === 'sessionLabel') {
    router.push({ path: 'master', query: { tab } });
  } else if (tab === 'sessionCodes') {
    router.push({ path: 'master', query: { tab : 'sessionCodes',sessionTab : 'projectCode' } });
  }
}

const canCreateLabel = ref<boolean>(false);
const canUpdateLabel = ref<boolean>(false);
const canCreateTaxonomy = ref<boolean>(false);
const canUpdateTaxonomy = ref<boolean>(false);
const canCreateStructures = ref<boolean>(false);
const canUpdateStructures = ref<boolean>(false);
const canCreateUserGroup = ref<boolean>(false);
const canUpdateUserGroup = ref<boolean>(false);
const canCreateSessionCodes = ref<boolean>(false);
const canReadSessionCodes = ref<boolean>(false);
const canUpdateSessionCodes = ref<boolean>(false);
const canCreateUserRoles = ref<boolean>(false);
const canReadUserRoles = ref<boolean>(false);
const canUpdateUserRoles = ref<boolean>(false);
const canReadUser = ref<boolean>(false);
const canUpdateUser = ref<boolean>(false);
const canCreateAnnotation = ref<boolean>(false);
const canUpdateAnnotation = ref<boolean>(false);
const canReadSessionlabel = ref<boolean>(false);
const canCreateSessionlabel = ref<boolean>(false);
const canUpdateSessionlabel = ref<boolean>(false);

async function checkAbilities() {
  canCreateLabel.value = await defineAbilitiesFor(Module.Label, Action.CREATE);
  canUpdateLabel.value = await defineAbilitiesFor(Module.Label, Action.UPDATE);
  // canCreateTaxonomy.value = await defineAbilitiesFor(Module.Taxonomy, Action.CREATE);
  // canUpdateTaxonomy.value = await defineAbilitiesFor(Module.Taxonomy, Action.UPDATE);
  canCreateStructures.value = await defineAbilitiesFor(Module.StructureGroup, Action.CREATE);
  canUpdateStructures.value = await defineAbilitiesFor(Module.StructureGroup, Action.UPDATE);
  canCreateUserGroup.value = await defineAbilitiesFor(Module.UserGroup, Action.CREATE);
  canUpdateUserGroup.value = await defineAbilitiesFor(Module.UserGroup, Action.UPDATE);
  canCreateSessionCodes.value = await defineAbilitiesFor(Module.SessionCodes, Action.CREATE);
  canReadSessionCodes.value = await defineAbilitiesFor(Module.SessionCodes, Action.READ);
  canUpdateSessionCodes.value = await defineAbilitiesFor(Module.SessionCodes, Action.UPDATE);
  canCreateUserRoles.value = await defineAbilitiesFor(Module.UserRoles, Action.CREATE);
  canReadUserRoles.value = await defineAbilitiesFor(Module.UserRoles, Action.READ);
  canUpdateUserRoles.value = await defineAbilitiesFor(Module.UserRoles, Action.UPDATE);
  canReadUser.value = await defineAbilitiesFor(Module.UserRoles, Action.READ);
  canUpdateUser.value = await defineAbilitiesFor(Module.UserRoles, Action.UPDATE);
  canCreateAnnotation.value = await defineAbilitiesFor(Module.Annotation, Action.CREATE);
  canUpdateAnnotation.value = await defineAbilitiesFor(Module.Annotation, Action.UPDATE);
  canReadSessionlabel.value = await defineAbilitiesFor(Module.SessionLabel, Action.READ);
  canCreateSessionlabel.value = await defineAbilitiesFor(Module.SessionLabel, Action.CREATE);
  canUpdateSessionlabel.value = await defineAbilitiesFor(Module.SessionLabel, Action.UPDATE);
}

watch(route, () => {
  checkAbilities();
});

onMounted(async() => {
  await checkAbilities();
  const { query } = router.currentRoute.value;
  if (query && query.tab) {
    activeTab.value = query.tab;
  } else {
    if (canCreateLabel.value || canUpdateLabel.value) {
      activeTab.value = 'label';
    } else if (canCreateTaxonomy.value || canUpdateTaxonomy.value) {
      activeTab.value = 'taxonomy';
    } else if (canCreateStructures.value || canUpdateStructures.value) {
      activeTab.value = 'structuregroup';
    } else if (canCreateUserGroup.value || canUpdateUserGroup.value) {
      activeTab.value = 'usergroup';
    } else if (canCreateSessionCodes.value || canReadSessionCodes.value || canUpdateSessionCodes.value) {
      activeTab.value = 'sessionCodes';
    } else if (canCreateUserRoles.value || canReadUserRoles.value || canUpdateUserRoles.value) {
      activeTab.value = 'rolePermissions';
    } else if (canReadUser.value || canUpdateUser.value) {
      activeTab.value = 'users';
    }
    else if (canCreateAnnotation.value || canUpdateAnnotation.value) {
      activeTab.value = 'annotation';
    }  else if (canReadSessionlabel.value || canCreateSessionlabel.value || canUpdateSessionlabel.value) {
      activeTab.value = 'sessionLabel';
    }
  }
});

</script>
<template>
    <div class="px-10 py-4">
      <NTabs data-testid="master-tabs" v-model:value="activeTab" default-value="label" @update:value="routeCheck()" type="card">
        <NTabPane data-testid="master-tab-label" name="label" tab="Label"  v-if="canCreateLabel || canUpdateLabel">
          <MastersLabel/>
        </NTabPane>
        <NTabPane data-testid="master-tab-taxonomy" name="taxonomy" tab="Taxonomy" v-if="canCreateTaxonomy || canUpdateTaxonomy">
          <MastersTaxonomy/>
        </NTabPane>
        <NTabPane data-testid="master-tab-annotation" name="annotation" tab="Annotation" v-if="canCreateAnnotation || canUpdateAnnotation">
          <MastersAnnotation/>
        </NTabPane>
        <NTabPane data-testid="master-tab-session-label" name="sessionLabel" tab="Session Label" v-if="canReadSessionlabel || canCreateSessionlabel || canUpdateSessionlabel">
          <MastersSessionLabel/>
        </NTabPane>
        <NTabPane data-testid="master-tab-structure-group" name="structuregroup" tab="Structure Group" v-if="canCreateStructures || canUpdateStructures">
          <MastersStructures/>
        </NTabPane>
        <NTabPane data-testid="master-tab-user-group" name="usergroup" tab="User Group" v-if="canCreateUserGroup || canUpdateUserGroup">
          <MastersUserGroup/>
        </NTabPane>
        <NTabPane data-testid="master-tab-session-codes" name="sessionCodes" tab="Session Codes" v-if="canCreateSessionCodes || canReadSessionCodes || canUpdateSessionCodes" >
          <MastersSessionCodes/>
        </NTabPane>
        <NTabPane data-testid="master-tab-role-permissions" name="rolePermissions" tab="User Roles" v-if="canCreateUserRoles || canReadUserRoles || canUpdateUserRoles">
          <MastersRolePermissions/>
        </NTabPane>
        <NTabPane data-testid="master-tab-users" name="users" tab="Users" v-if="canReadUser || canUpdateUser">
          <MastersUsers/>
        </NTabPane>
      </NTabs>
    </div>
</template>