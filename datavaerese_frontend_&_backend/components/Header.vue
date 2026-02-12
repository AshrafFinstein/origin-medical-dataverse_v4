<script setup lang="ts">
import type { User } from '@auth0/auth0-spa-js'
import { NTooltip, NButton, NModal, NCard } from 'naive-ui'
import { defineAbilitiesFor } from '~/types/ability'
import { Module, Action } from '~/types/enum'

const user = useState<User>('user')
const username = user?.value.name
const route = useRoute();

const abilitiesMap = [
  { ref: 'canCreateLabel', module: Module.Label, action: Action.CREATE },
  { ref: 'canUpdateLabel', module: Module.Label, action: Action.UPDATE },
  { ref: 'canCreateUserRoles', module: Module.UserRoles, action: Action.CREATE },
  { ref: 'canReadUserRoles', module: Module.UserRoles, action: Action.READ },
  { ref: 'canUpdateUserRoles', module: Module.UserRoles, action: Action.UPDATE },
  { ref: 'canCreateStructures', module: Module.Taxonomy, action: Action.CREATE },
  { ref: 'canUpdateStructures', module: Module.Taxonomy, action: Action.UPDATE },
  { ref: 'canCreateTaxonomy', module: Module.Taxonomy, action: Action.CREATE },
  { ref: 'canUpdateTaxonomy', module: Module.Taxonomy, action: Action.UPDATE },
  { ref: 'canCreateUserGroup', module: Module.UserGroup, action: Action.CREATE },
  { ref: 'canUpdateUserGroup', module: Module.UserGroup, action: Action.UPDATE },
  { ref: 'canReadUser', module: Module.UserRoles, action: Action.READ },
  { ref: 'canUpdateUser', module: Module.UserRoles, action: Action.UPDATE },
  { ref: 'canCreateSessionCodes', module: Module.SessionCodes, action: Action.CREATE },
  { ref: 'canReadSessionCodes', module: Module.SessionCodes, action: Action.READ },
  { ref: 'canUpdateSessionCodes', module: Module.SessionCodes, action: Action.UPDATE },
  { ref: 'canCreateAnnotation', module: Module.Annotation, action: Action.CREATE },
  { ref: 'canUpdateAnnotation', module: Module.Annotation, action: Action.UPDATE },
  { ref: 'canCreateSessionLabel', module: Module.SessionLabel, action: Action.CREATE },
  { ref: 'canReadSessionLabel', module: Module.SessionLabel, action: Action.READ },
  { ref: 'canUpdateSessionLabel', module: Module.SessionLabel, action: Action.UPDATE }
];

// Dynamically create ref variables for abilities
const abilityRefs = abilitiesMap.reduce((acc, ability) => {
  acc[ability.ref] = ref<boolean>(false);
  return acc;
}, {} as Record<string, Ref<boolean>>);

// Check abilities asynchronously
async function checkAbilities() {
  await Promise.all(
    abilitiesMap.map(async (ability) => {
      abilityRefs[ability.ref].value = await defineAbilitiesFor(ability.module, ability.action);
    })
  );
}

onMounted(() => {
  checkAbilities();
});

watch(route, () => {
  checkAbilities();
});

const isAnyPermissionGranted = computed(() => {
  return abilityRefs.canCreateLabel.value ||
         abilityRefs.canUpdateLabel.value ||
         abilityRefs.canCreateUserRoles.value ||
         abilityRefs.canReadUserRoles.value ||
         abilityRefs.canUpdateUserRoles.value ||
         abilityRefs.canCreateStructures.value ||
         abilityRefs.canUpdateStructures.value ||
         abilityRefs.canCreateTaxonomy.value ||
         abilityRefs.canUpdateTaxonomy.value ||
         abilityRefs.canCreateUserGroup.value ||
         abilityRefs.canUpdateUserGroup.value ||
         abilityRefs.canReadUser.value ||
         abilityRefs.canUpdateUser.value ||
         abilityRefs.canCreateSessionCodes.value ||
         abilityRefs.canReadSessionCodes.value ||
         abilityRefs.canUpdateSessionCodes.value ||
         abilityRefs.canCreateAnnotation.value ||
         abilityRefs.canUpdateAnnotation.value;
});

const showLogoutModal = ref(false)

function handleLogoutClick() {
  showLogoutModal.value = true
}

function handleLogoutConfirm() {
  window.location.href = '/api/auth/logout'
}

function handleLogoutCancel() {
  showLogoutModal.value = false
}

</script>

<template>
  <div
    class="navbar fixed top-0 left-0 right-0 flex flex-row bg-neutral-700 h-[72px] px-12 justify-between items-center w-full shadow-lg z-50"
  >
    <div class="col-span-1 flex flex-row justify-start items-center gap-4">
      <div data-testid="header-logo" @click="$router.push('/')">
        <img
          class="object-contain h-[52px] w-auto bg-neutral-700 border-0"
          src="@/assets/images/logos/Logo.png"
        >
      </div>
    </div>
    <div class="col-span-1 flex flex-row justify-end gap-10 items-center">
      <div class="flex flex-row gap-2">
        <p class="text-neutral-300">
          Logged in as:
        </p>
        <p class="text-neutral-100">
          {{ username }}
        </p>
      </div>
      <n-tooltip v-if="isAnyPermissionGranted" trigger="hover">
        <template #trigger>
          <a data-testid="header-masters-link" class="btn cursor-pointer no-underline !p-0" href="/master">
            <Icon name="uil:setting" class="text-2xl master-tooltip cursor-pointer" />
          </a>
        </template>
        Masters
      </n-tooltip>
      <NButton data-testid="header-logout-button" class="btn btn-primary cursor-pointer" @click="handleLogoutClick">
        Log out
      </NButton>
    </div>
  </div>
  
  <NModal
    v-model:show="showLogoutModal"
    data-testid="logout-modal"
  >
    <NCard
      class="w-[80vh]"
      title="Confirm Logout"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      closable
      @close="handleLogoutCancel"
    >
      <div class="flex">
        <p class="text-neutral-300">
          Are you sure you want to log out?
        </p>
      </div>
      <template #footer>
        <div class="inline-flex items-center justify-end gap-2 w-full">
          <NButton data-testid="logout-cancel-button" strong type="error" @click="handleLogoutCancel">
            Cancel
          </NButton>
          <NButton data-testid="logout-confirm-button" strong type="success" @click="handleLogoutConfirm">
            Logout
          </NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>
