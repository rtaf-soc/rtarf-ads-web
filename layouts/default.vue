<script setup lang="ts">
// import { ref } from 'vue';
// import type { EssentialLinkProps } from '../components/EssentialLink.vue';
import { ref, nextTick } from 'vue';
import { useAuthStore } from '~/stores/auth'
import { useTitleStore } from '~/stores/title'
import { type MenuRedirectProps } from "../components/MenuRedirect.vue";
// import Dashboard from '~/pages/dashboard.vue.old';
const router = useRouter()
const { public: { tool } } = useRuntimeConfig();
// console.log(tool)
const auth = useAuthStore()
const title = useTitleStore()

const fab_user_menu = ref(false)
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

// const webviewLink: MenuRedirectProps[] = [
//   {
//     title: 'Geo-IP Attack Map',
//     // caption: 'จัดหา',
//     icon: 'my_location',
//     link: "/geo_ip_attack"
//   },
//   {
//     title: 'สถานะอุปกรณ์เครือข่าย',
//     // caption: 'จัดหา',
//     icon: 'table_chart',
//     link: "/numa_status"
//   },
// ];

const ThreatBlacklistLink: MenuRedirectProps[] = [

  {
    title: 'Source IP Blacklist',
    icon: 'source',
    link: "/threat_blacklist/source_ip_blacklist",
  },
  {
    title: 'Destination IP Blacklist',
    icon: 'location_on',
    link: "/threat_blacklist/destination_ip_blacklist",
  },
  {
    title: 'Domain Blacklist',
    icon: 'domain_disabled',
    link: "/threat_blacklist/domain_blacklist",
  },
  {
    title: 'SHA256 Blacklist',
    icon: 'no_encryption',
    link: "/threat_blacklist/sha256_blacklist",
  },
];


const ThreatHuntingLink: MenuRedirectProps[] = [

  {
    title: 'Threat Hunting',
    // caption: 'จัดหา',
    icon: 'policy',
    link: "/threat_hunting",
    inset: 0.0
  },
];

const overviewLink: MenuRedirectProps[] = [

  {
    title: 'Overview',
    // caption: 'จัดหา',
    icon: 'settings_overscan',
    link: "/overview",
    inset: 0.0
  },
];

const zabbixLink: MenuRedirectProps[] = [

  {
    title: 'RTARF Monitoring',
    // caption: 'จัดหา',
    icon: "monitor_heart",
    link: "/zabbix",
    inset: 0.0
  },
];

const commanderLink: MenuRedirectProps[] = [

  {
    title: 'Commander',
    // caption: 'จัดหา',
    icon: 'keyboard_command_key',
    link: "/commander",
    inset: 0.0
  },
];

const dashboardLink: MenuRedirectProps[] = [

  // {
  //   title: 'MIST Summary',
  //   // caption: 'จัดหา',
  //   icon: 'dashboard',
  //   link: "/dashboard/mist_summary",
  // },
  // {
  //   title: 'Event Summary',
  //   // caption: 'จัดหา',
  //   icon: 'dashboard',
  //   link: "/dashboard/event_summary",
  // },
  {
    title: 'Cambodia Focused Attack',
    // caption: 'จัดหา',
    icon: 'dashboard',

    // TODO : change the link name accordingly
    link: "/dashboard/zeek_event_summary",
  },
  {
    title: 'Blacklist Summary',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/blacklist_summary",
  },
  {
    title: 'CrowdStrike Summary',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/crowdstrie_summary",
  },
  {
    title: 'IoC Summary',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/ioc_summary",
  },
  {
    title: 'Zeek Summary (Suricata)',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/zeek_summary_suricata",
  },
  {
    title: 'Zeek Summary (Intel)',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/zeek_summary_intel",
  },
  {
    title: 'Zeek Summary (HTTP)',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/zeek_summary_http",
  },
  {
    title: 'Zeek Summary (Kerberos)',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/zeek_summary_files",
  },
  {
    title: 'Zeek Summary (Radius)',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/zeek_summary_ssl",
  },
  {
    title: 'Zeek Summary (DNS)',
    // caption: 'จัดหา',
    icon: 'dashboard',
    link: "/dashboard/zeek_summary_dns",
  },
];
// const SigmaYaraRulesLink: MenuRedirectProps[] = [

//   {
//     title: 'Sigma & Yara rules',
//     // caption: 'จัดหา',
//     icon: 'hub',
//     link: "/sigma_yara_rules",
//     inset: 0.0
//   },
// ];

const DetectionRulesLink: MenuRedirectProps[] = [

  {
    title: 'Sigma Rules',
    // caption: 'จัดหา',
    icon: 'gavel',
    link: "/detection_rules/sigma_rules",
  },
  {
    title: 'Yara Rules',
    // caption: 'จัดหา',
    icon: 'gavel',
    link: "/detection_rules/yara_rules",
  },
  {
    title: 'Suricata rules',
    // caption: 'จัดหา',
    icon: 'gavel',
    link: "/detection_rules/suricata_rules",
  },
];

const IPMappingLink: MenuRedirectProps[] = [

  {
    title: 'IP Mapping',
    // caption: 'จัดหา',
    icon: 'hub',
    link: "/ip_mapping",
    inset: 0.0
  },
];

const ThreatIntelligenceLink: MenuRedirectProps[] = [

  {
    title: 'Threat Intelligence',
    // caption: 'จัดหา',
    icon: "psychology",
    link: "/threat_intelligence",
    inset: 0.0
  },
];


const geoIpLink: MenuRedirectProps[] = [

  {
    title: 'GeoIP',
    // caption: 'จัดหา',
    icon: 'my_location',
    link: "/geo_ip_attack",
    inset: 0.0
  },
];

const deviceUptimeLink: MenuRedirectProps[] = [

  {
    title: 'Device Uptime',
    // caption: 'จัดหา',
    icon: 'troubleshoot',
    link: "/numa_status",
    inset: 0.0
  },
];

const deviceCVELink: MenuRedirectProps[] = [

  {
    title: 'Device CVE',
    // caption: 'จัดหา',
    icon: 'privacy_tip',
    link: "/device_cve",
    inset: 0.0
  },
];

const toolsLink: MenuRedirectProps[] = [

  {
    title: 'Kibana',
    icon: 'open_in_new',
    // link: '/tools/kibana',
    link: tool.url01,
    openNewTab: true
  },
  {
    title: 'Kafka',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/kafka",
    link: tool.url02,
    openNewTab: true
  },
  {
    title: 'Metalog #1',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/metalog_1",
    link: tool.url031,
    openNewTab: true
  },
  {
    title: 'Metalog #2',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/metalog_2",
    link: tool.url032,
    openNewTab: true
  },
  {
    title: 'Metalog #3',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/metalog_3",
    link: tool.url033,
    openNewTab: true
  },

  {
    title: 'Net Approve #1',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/net_approve_1",
    link: tool.url041,
    openNewTab: true
  },
  {
    title: 'Net Approve #2',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/net_approve_2",
    link: tool.url042,
    openNewTab: true
  },
  {
    title: 'Net Approve #3',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/net_approve_3",
    link: tool.url043,
    openNewTab: true
  },
  {
    title: 'Net Approve #4',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/net_approve_4",
    link: tool.url044,
    openNewTab: true
  },
  {
    title: 'GeoIP',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/geo_ip",
    link: tool.url05,
    openNewTab: true
  },
  {
    title: 'Superset',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/superset",
    link: tool.url06,
    openNewTab: true
  },
  {
    title: 'Loki',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/loki",
    link: tool.url07,
    openNewTab: true
  },
  {
    title: 'Prometheus',
    // caption: 'จัดหา',
    icon: 'open_in_new',
    // link: "/tools/prometheus",
    link: tool.url08,
    openNewTab: true
  },
];

const adminLink: MenuRedirectProps[] = [

  {
    title: 'System Variable',
    // caption: 'จัดหา',
    icon: 'tune',
    link: "/admin/system_variable"
  },
  {
    title: 'Users',
    // caption: 'จัดหา',
    icon: 'group',
    link: "/admin/users"
  },
  // {
  //   title: 'Roles',

  //   icon: 'manage_accounts',
  //   link: "/admin/roles"
  // },
  {
    title: 'API Keys',
    icon: 'vpn_key',
    link: "/admin/api_keys"
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

  title.setTitle('Login')
  router.push('/login')
}

</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="auth.isAuthenticated" flat dense round icon="menu" :glossy="false" @click="toggleLeftDrawer" />

        <!-- <q-toolbar-title>
          Military Rule Detection Joint Sharing
        </q-toolbar-title> -->

        <q-toolbar-title>
          {{ title.title }}
        </q-toolbar-title>

        <!-- <q-btn v-if="auth.isAuthenticated" dense label="Logout" color="negative" @click="handleLogout" /> -->
        <div>
          <q-fab v-if="auth.isAuthenticated" v-model="fab_user_menu" vertical-actions-align="left" dense color="dark"
            icon="person" direction="down" padding="xs">
            <!-- <q-fab-action class="q-ma-lg" color="primary" @click="handleLogout" icon="logout" /> -->

            <q-btn v-if="auth.isAuthenticated" dense icon="logout" color="negative" @click="handleLogout" />
          </q-fab>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer :breakpoint="500" v-model="leftDrawerOpen" show-if-above bordered v-if="auth.isAuthenticated">
      <q-list>
        <!-- <q-item-label header> Menu </q-item-label> -->
        <q-item-label header class="flex flex-col items-center justify-center">
          <img src="/assets/icon.svg" alt="Menu Icon" width="43" height="41" />

          <img src="/assets/icon-word.svg" alt="Menu Icon" width="89" height="24" />

        </q-item-label>

        <q-card>
          <MenuRedirect v-for="link in overviewLink" :key="link.title" v-bind="link" />
        </q-card>
        <q-card>
          <MenuRedirect v-for="link in commanderLink" :key="link.title" v-bind="link" />
        </q-card>
        <q-card>
          <MenuRedirect v-for="link in zabbixLink" :key="link.title" v-bind="link" />
        </q-card>

        <!-- <q-card>
          <MenuRedirect v-for="link in ThreatHuntingLink" :key="link.title" v-bind="link" />
        </q-card> -->

        <q-expansion-item expand-separator icon="dashboard" label="Dashboard">
          <q-card>
            <MenuRedirect v-for="link in dashboardLink" :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="app_blocking" label="Threat Blacklist">
          <q-card>
            <MenuRedirect v-for="link in ThreatBlacklistLink" :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>

        <!-- <q-expansion-item expand-separator icon="radar" label="Detection Rules"> -->
        <q-expansion-item expand-separator icon="radar" label="Threat Hunting">
          <q-card>
            <MenuRedirect v-for="link in DetectionRulesLink" :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>

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

        <q-expansion-item expand-separator icon="construction" label="Tools">
          <q-card>
            <MenuRedirect v-for="link in toolsLink" :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="admin_panel_settings" label="Admin">
          <q-card>
            <MenuRedirect v-for="link in adminLink" :key="link.title" v-bind="link" />
          </q-card>
        </q-expansion-item>


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