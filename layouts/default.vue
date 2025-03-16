<script setup lang="ts">
// import { ref } from 'vue';
// import type { EssentialLinkProps } from '../components/EssentialLink.vue';
import { ref, nextTick } from 'vue';
import { useAuthStore } from '~/stores/auth'
import { type MenuRedirectProps } from "../components/MenuRedirect.vue";
import Dashboard from '~/pages/dashboard.vue';
const router = useRouter()

const auth = useAuthStore()


const menuInsetLevel = 0.3

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

const ThreatBlacklistLink: MenuRedirectProps[] = [

  {
    title: 'Threat Blacklist',
    // caption: 'จัดหา',
    icon: 'table_chart',
    link: "/destination"
  },
];

const ThreatHuntingLink: MenuRedirectProps[] = [

  {
    title: 'Threat Hunting',
    // caption: 'จัดหา',
    icon: 'table_chart',
    link: "/threat_hunting"
  },
];

const overviewLink: MenuRedirectProps[] = [

  {
    title: 'Overview',
    // caption: 'จัดหา',
    icon: 'overview',
    link: "/overview"
  },
];

const commanderLink: MenuRedirectProps[] = [

  {
    title: 'Commander',
    // caption: 'จัดหา',
    icon: 'commander',
    link: "/commander"
  },
];

const dashboardLink: MenuRedirectProps[] = [

  {
    title: 'Dashboard',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/dashboard"
  },
];

const IPMappingLink: MenuRedirectProps[] = [

  {
    title: 'IP Mapping',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/ip_mapping"
  },
];

const ThreatIntelligenceLink: MenuRedirectProps[] = [

  {
    title: 'Threat Intelligence',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/threat_intelligence"
  },
];

const geoIpLink: MenuRedirectProps[] = [

  {
    title: 'GeoIP',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/geo_ip_attack"
  },
];

const deviceUptimeLink: MenuRedirectProps[] = [

  {
    title: 'Device Uptime',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/numa_status"
  },
];

const deviceCVELink: MenuRedirectProps[] = [

  {
    title: 'Device CVE',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/device_cve"
  },
];

const toolsLink: MenuRedirectProps[] = [

  {
    title: 'Kibana',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/device_cve"
  },
  {
    title: 'Kafka',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/device_cve"
  },
];

const adminLink: MenuRedirectProps[] = [

  {
    title: 'Admin',
    // caption: 'จัดหา',
    icon: 'Dashboard',
    link: "/admin"
  },
];


const leftDrawerOpen = ref(false)
const initUsername = ref(false)
const username = ref('NaN')
const selectedDriver = ref(null);
const drivers = ref([])


function toggleLeftDrawer() {
  // console.log(leftDrawerOpen.value)
  leftDrawerOpen.value = !leftDrawerOpen.value
}
function handleLogout() {
  auth.logout()
  router.push('/login')
}

</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="auth.isAuthenticated" flat dense round icon="menu" :glossy="false"
          @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Military Rule Detection Joint Sharing
        </q-toolbar-title>

        <q-btn v-if="auth.isAuthenticated" dense label="Logout" color="negative" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer :breakpoint="500" v-model="leftDrawerOpen" show-if-above bordered v-if="auth.isAuthenticated">
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <q-card>
          <MenuRedirect v-for="link in overviewLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in commanderLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in ThreatHuntingLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in dashboardLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in ThreatBlacklistLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in IPMappingLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in ThreatIntelligenceLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in geoIpLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in deviceUptimeLink" :key="link.title" v-bind="link" />
        </q-card>

        <q-card>
          <MenuRedirect v-for="link in deviceCVELink" :key="link.title" v-bind="link" />
        </q-card>
        <q-expansion-item expand-separator icon="visibility" caption="Tools">
          <q-card>
            <MenuRedirect v-for=" link in toolsLink " :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>

        <q-card>
          <MenuRedirect v-for="link in adminLink" :key="link.title" v-bind="link" />
        </q-card>

        <!-- <q-expansion-item expand-separator icon="visibility" caption="รายการตรวจจับ">
          <q-card>
            <MenuRedirect v-for=" link in hotelLink " :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item> -->

        <!-- <q-expansion-item expand-separator icon="visibility" caption="ระบบงานทั่วไป">
          <q-card>
            <MenuRedirect v-for=" link in webviewLink " :key="link.title" v-bind="link" />
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