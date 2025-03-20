<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()
const router = useRouter()

export interface MenuRedirectProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  clickable?: boolean;
  disable?: boolean;
  inset?: number;
  openNewTab?: boolean
}
const props = withDefaults(defineProps<MenuRedirectProps>(), {
  caption: "",
  link: "#",
  icon: "",
  clickable: true,
  disable: false,
  inset: 0.3,
  openNewTab: false
});

async function handleClick() {
  try {
    // Attempt to refresh the token before navigating
    console.log('call token')
    auth.refreshAuthToken()
    // If refresh succeeds, redirect to the provided link
    if (props.openNewTab) {
      window.open(props.link, "_blank")
    } else {

      router.push({ path: props.link })
    }
  } catch (error) {
    // If refreshing fails, log out and send user to login page
    console.log(error)
    auth.logout()
    // router.push('/login')
  }
}

// const redirect = (link) => clearError({ redirect: link })
</script>
<template>
  <q-item :inset-level="inset" :clickable="clickable" :active="link === $route.path"
    active-class="bg-primary text-white" target="_blank" :disable="disable" @click="handleClick">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
