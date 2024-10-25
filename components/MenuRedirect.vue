

<script setup lang="ts">
export interface MenuRedirectProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  clickable?: boolean;
  disable?: boolean;
}
withDefaults(defineProps<MenuRedirectProps>(), {
  caption: "",
  link: "#",
  icon: "",
  clickable: true,
  disable: false
});

// const redirect = (link) => clearError({ redirect: link })
</script>
<template>
  <q-item :inset-level="0.3" :clickable="clickable" :active="link === $route.path" active-class="bg-primary text-white"
    target="_blank" :disable="disable" @click="$router.push({ path: link })">
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

