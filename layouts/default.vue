<script setup lang="ts">
// import { ref } from 'vue';
// import type { EssentialLinkProps } from '../components/EssentialLink.vue';
import { ref, onMounted, nextTick } from 'vue';

import { type MenuRedirectProps } from "../components/MenuRedirect.vue";
// import { useDriverStore } from '../stores/driver';
import { getClientDriver, setClientDriver } from '../api/scaleService';

// import { useAuthStore } from '@/stores/auth';

// const driverStore = useDriverStore();

// console.log(driverStore.driver)
const menuInsetLevel = 0.3
// const essentialLinks: MenuRedirectProps[] = [
//   {
//     title: 'จัดการผู้ใช้งาน',
//     // caption: 'จัดหา',
//     icon: 'group',
//     link: "/users"
//   }
// ];
const hotelLink: MenuRedirectProps[] = [
  {
    title: 'Source IP Address',
    // caption: 'จัดหา',
    icon: 'table_chart',
    link: "/source"
  },
  {
    title: 'Destination IP Address',
    // caption: 'จัดหา',
    icon: 'table_chart',
    link: "/destination"
  },
];

const webviewLink: MenuRedirectProps[] = [
  {
    title: 'Geo-IP Attack Map',
    // caption: 'จัดหา',
    icon: 'table_chart',
    link: "/geo_ip_attack"
  },
  {
    title: 'สถานะอุปกรณ์เครือข่าย',
    // caption: 'จัดหา',
    icon: 'table_chart',
    link: "/numa_status"
  },
];

const leftDrawerOpen = ref(false)
const initUsername = ref(false)
const username = ref('NaN')
const selectedDriver = ref(null);
const drivers = ref([])

onMounted(async () => {
  // Wait for the next DOM update cycle
  await nextTick();
  // console.log(driv er)
  // Code to run after the component is mounted and DOM is updated  
  // message.value = 'Component has been mounted and updated!';
  console.log('Component has been mounted and updated');
  leftDrawerOpen.value = false
  // await driverStore.getDriver();
  // console.log(driverStore.drivers)
  await getDriver()
  console.log()
});

// const drivers = driverStore.drivers;
// console.log(drivers)

// const usersLink: MenuRedirectProps[] = [
//   {
//     title: 'ผู้ใช้ (users)',
//     // caption: 'จัดหา',
//     icon: 'group',
//     link: "/users"
//   },
//   {
//     title: 'ประวัติการเข้าใช้งาน',
//     // caption: 'จัดหา',
//     icon: 'group',
//     link: "/user_logs"
//   }
// ];


// function logout() {
//   let currentUrl = new URL(window.location)
//   localStorage.removeItem('UserProfile')
//   location.replace(currentUrl.origin + "/login")
// }
function toggleLeftDrawer() {
  // console.log(leftDrawerOpen.value)
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function getDriver() {
  try {
    drivers.value = []
    // drivers.value = await getClientDriver();
    // console.log('get driver2')
    console.log(drivers.value)
  } catch (error) {
    // showTooltip(error)
    console.log(error)
    // let the form component display the error
    // return error
  }

}

function onDriverSelect(event: String) {
  console.log(event)
  updateDriver(event)
}

async function updateDriver(driverPath: String) {
  try {
    let result = await setClientDriver(driverPath);
    // console.log('get driver2')
    console.log(result)
  } catch (error) {
    // showTooltip(error)
    console.log(error)
    // let the form component display the error
    // return error
  }
}

// onMounted(() => {
// const config = useRuntimeConfig();
// console.log(config.public.baseURL)
// useCheckLogin()
// setUsername()
// })
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" :glossy="false" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Military Rule Detection Joint Sharing
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <!-- <div v-show="initUsername">
          <q-chip outline color="white" text-color="white" icon="account_circle">
            {{ username }}
          </q-chip>
          <q-btn class="q-ml-md" outlined push color="red" label="ออกจากระบบ" size="sm" @click="logout()">
          </q-btn>
        </div> -->
        <!-- <q-btn class="q-ml-sm" icon="refresh" outlined rounded full-width @click="getDriver">

        </q-btn> -->
        <!-- <q-btn dense icon="refresh" rounded full-width @click="getDriver()">

        </q-btn> -->
        <!-- <q-select class="q-pa-sm" outlined v-model="selectedDriver" :options="drivers" option-label="path"
          option-value="path" label="Drivers" emit-value map-options @update:model-value="onDriverSelect"
          @add="onDriverSelect"> -->
        <!-- <template v-slot:prepend>


            <q-btn dense icon="refresh" rounded full-width @click="getDriver">

            </q-btn>
          </template> -->
        <!-- </q-select> -->
        <!-- <p>{{ drivers }}</p> -->
        <!-- <div>
          <label for="driver-select">Select a Driver:</label>
          <select id="driver-select" v-model="drivers">
            <option v-for="driver in drivers" :key="driver.path" :value="driver.path">
              {{ driver.path }}
            </option>
          </select>
        </div> -->

      </q-toolbar>
    </q-header>

    <q-drawer :breakpoint="500" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <q-card>
          <!-- <MenuRedirect v-for=" link  in  mainLink " :key="link.title" v-bind="link" /> -->
          <!-- <MenuRedirect v-for=" link  in  menuLink " :key="link.title" v-bind="link" /> -->
        </q-card>
        <!-- <q-expansion-item expand-separator icon="settings_ethernet" label="หน้าแรก" caption="วัดน้ำหนัก">
          <q-expansion-item :header-inset-level="menuInsetLevel" expand-separator icon="tune" caption="รายการตรวจจับ">
            <q-card>
              <MenuRedirect v-for=" link in hotelLink " :key="link.title" v-bind="link" />
            </q-card>
          </q-expansion-item>
        </q-expansion-item> -->
        <q-expansion-item expand-separator icon="visibility" caption="รายการตรวจจับ">
          <q-card>
            <MenuRedirect v-for=" link in hotelLink " :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="visibility" caption="ระบบงานทั่วไป">
          <q-card>
            <MenuRedirect v-for=" link in webviewLink " :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>
        <!-- <q-expansion-item expand-separator icon="apartment" label="จัดการโรงแรม" default-opened>

          <q-card>
            <MenuRedirect v-for=" link  in  hotelLink " :key="link.title" v-bind="link" />
          </q-card>

        </q-expansion-item>
        <q-expansion-item expand-separator icon="manage_accounts" label="จัดการผู้ใช้งาน" default-opened>

          <q-card>
            <MenuRedirect v-for=" link  in  usersLink " :key="link.title" v-bind="link" />
          </q-card>

        </q-expansion-item> -->

      </q-list>
    </q-drawer>

    <q-page-container>

      <!-- <NuxtPage /> -->

      <div class="layout-wrapper">
        <div class="background-overlay"></div>
        <NuxtPage />
      </div>
    </q-page-container>
  </q-layout>
</template>


<style scoped lang="sass">
.layout-wrapper
  position: relative
  min-height: 100vh
  overflow: hidden

.background-overlay
  position: fixed
  top: 5%
  width: 100vw // 100% - 20% on each side, using viewport width for consistency
  height: 100vh // 100% - 20% on top and bottom, using viewport height for consistency
  background-image: url('/background.png') // Make sure the image is in the public directory
  background-size: contain
  background-position: center
  background-repeat: no-repeat
  z-index: -1
  opacity: 0.2 // Optional: Adjust transparency if needed
</style>