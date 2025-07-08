<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <!-- <q-card-section class="q-pb-none">
        <h5 class="q-pa-none q-ma-none">
          Destination IP</h5>
      </q-card-section> -->

      <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
        <div class="row">
          <div class="col-12 col-md-12 q-pa-none">
            <q-table class="my-sticky-header-table" style="height: 95vh;" flat bordered title="User Management"
              :rows="table_rows_menu" :columns="table_columns_menu" row-key="id" v-model:pagination="pagination_menu"
              :rows-per-page-options="[5, 10, 15, 20, 30, 50, 0]" @request="loadNextData" separator="cell"
              :loading="loading">
              <template v-slot:top-left>
                <q-input outlined dense debounce="300" placeholder="ค้นหา" v-model="filter_menu_table" bg-color="dark"
                  @keyup.enter="onClick('tableSearch')">
                  <template v-slot:append>
                    <q-btn round dense flat icon="search" @click="onClick(`tableSearch`)" />
                  </template>
                </q-input>
                <q-badge class="q-ml-md text-bold q-pa-sm" align="middle" color="dark" style="font-size:20px;">
                  ข้อมูลทั้งหมด : {{ pagination_menu.rowsNumber.toLocaleString('en-US') }}
                </q-badge>
              </template>
              <template v-slot:top-right>
                <q-btn class="q-mr-lg" icon="add" rounded color="green-7" @click="onClick(`addTable`)" />
                <q-btn :disable="selectedTable.length === 0" icon="delete" rounded color="negative"
                  @click="onClick(`deleteSelectedTable`)" />
              </template>

              <template v-slot:body-cell="props">
                <q-td :props="props" :class="(props.row.id % 2 === 0) ? 'bg-accent' : 'bg-white'">
                  {{ props.value }}

                </q-td>
              </template>
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-bold"
                    style="font-size: medium;">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" class="cursor-pointer"
                  :class="(props.row.index % 2 === 0) ? 'bg-grey-10' : 'bg-grey-9'">
                  <q-td v-for="(col, colIndex) in props.cols" :key="col.name" :props="props">
                    <template v-if="col.name === 'id'">
                      <q-checkbox :model-value="isRowSelected(props.row)"
                        @update:model-value="val => toggleRowSelection(props.row, val)" />
                      <q-chip class="shadow-up-3 q-pr-sm" clickable rounded
                        @click="onClick('editIngredient', props.row)">
                        <q-avatar icon="edit" color="blue" text-color="white"></q-avatar>
                        <div class="text-center text-bold">{{ props.row.index }}</div>
                      </q-chip>
                    </template>

                    <template v-else-if="col.name === 'createdDate'">
                      {{ convertTimestamp(props.row.createdDate) }}
                    </template>

                    <template v-else>
                      {{ props.row[col.field] }}
                    </template>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="edit_ingredient_detail_isOpen">
      <q-card style="width: 800px; max-width: 800vw;">

        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">แก้ไขข้อมูล
            <!-- <q-badge outline class="text-h6" align="middle" color="negative">
              {{edit_ingredient_detail.cidr }} 

            </q-badge> -->
          </div>

          <!-- <div class="text-h7 q-mt-sm">Destination IP Address : <q-badge class="text-h5" color="primary">{{
            edit_ingredient_detail.blacklistCode }} </q-badge></div> -->
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.userName" outlined label="User Name" />
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.userEmail" outlined label="User Email" />

            <!-- Add roles checkboxes section -->
            <div class="q-pb-lg q-pt-lg">
              <div class="custom-outlined-container">
                <div class="custom-outlined-label">User Role</div>
                <div class="row q-col-gutter-sm q-pa-sm">
                  <div v-for="role in globalRolesList" :key="role.roleId" class="col-6 q-mb-sm">
                    <q-checkbox :label="role.roleName + ' (' + role.roleDescription + ')'" :val="role.roleName"
                      v-model="selectedRoles" @update:model-value="updateRolesListFromSelected" dense />
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-card-actions align="around">
          <q-btn label="ยกเลิก" color="negative" v-close-popup />
          <q-btn flat label="บันทึก" @click="onClick('saveEditIngredient')" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="add_ingredient_detail_isOpen" @show="onDialogShow">
      <q-card style="width: 800px; max-width: 800vw;">

        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">เพิ่มข้อมูล </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.userName" outlined label="User Name" />
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.userEmail" outlined label="User Email" />

            <!-- Replace existing roles section with this -->
            <div class="q-pb-lg q-pt-lg">
              <div class="custom-outlined-container">
                <div class="custom-outlined-label">User Role</div>
                <div class="row q-col-gutter-sm q-pa-sm">
                  <div v-for="role in globalRolesList" :key="role.roleId" class="col-6 q-mb-sm">
                    <q-checkbox :label="role.roleName + ' (' + role.roleDescription + ')'" :val="role.roleName"
                      v-model="selectedRoles" @update:model-value="updateRolesListFromSelected" dense />
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-card-actions align="around">
          <q-btn label="ยกเลิก" color="negative" v-close-popup />
          <q-btn flat label="บันทึก" @click="onClick('saveAddTable')" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment';
import { useAuthStore } from '~/stores/auth'
import mock_roles from './mock_roles.json'


const table_columns_menu = [
  { name: 'id', align: 'center', label: 'Action', field: 'index', headerStyle: 'width: 30px' },
  { name: 'userName', align: 'center', label: 'Username', field: 'userName', sortable: true, },
  { name: 'userEmail', align: 'center', label: 'Email', field: 'userEmail', sortable: true, },
  { name: 'rolesList', align: 'center', label: 'Role', field: 'rolesList', sortable: true, },
  { name: 'createdDate', align: 'center', label: 'Created Date', field: 'createdDate', sortable: true, },
]
// const role
const monacoEditor = ref(null)
const showEditor = ref(false)
const editorOptions = {
  automaticLayout: true,
  theme: 'vs-dark',
}
const stringOptions = mock_roles
const filterOptions = ref(stringOptions)
// const filterOptions = ref(mock_roles)
const mock_data = [
  {
    "userName": "alice.wong",
    "userEmail": "alice.wong@company.com",
    "userRole": "User Management,Settings",
    "createdDate": "2024-10-12T09:24:30.125001Z"
  },
  {
    "userName": "bob.smith",
    "userEmail": "bob.smith@company.com",
    "userRole": "Reporting Module,Data Import",
    "createdDate": "2024-10-12T09:24:30.125001Z"
  },
  {
    "userName": "carol.johnson",
    "userEmail": "carol.johnson@company.com",
    "userRole": "API Access,File Manager",
    "createdDate": "2024-10-12T09:24:30.125001Z"
  },
  {
    "userName": "david.lee",
    "userEmail": "david.lee@company.com",
    "userRole": "Audit Logs,Audit Trail",
    "createdDate": "2024-10-12T09:24:30.125001Z"
  },
  {
    "userName": "eve.kim",
    "userEmail": "eve.kim@company.com",
    "userRole": "Billing,Notification",
    "createdDate": "2024-10-12T09:24:30.125001Z"
  }
]







const table_rows_menu = ref([])
const table_rows_ingredients = ref([])
const filter_menu_table = ref('')
const filter_ingredient_table = ref('')
const pagination_menu = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const pagination_ingredient = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
}
const loading = ref(true)
const edit_ingredient_detail_isOpen = ref(false)
const edit_ingredient_detail = {
  orgUserId: "",
  userName: "",
  userEmail: "",
  rolesList: "",
  createdDate: "2024-10-12T09:24:30.125001Z"
}
const add_ingredient_detail_isOpen = ref(false)
const add_ingredient_detail = {
  userName: "",
  userEmail: "",
  rolesList: "",
  createdDate: "2024-10-12T09:24:30.125001Z"
}

// "blacklistId": "8d2b7f6c-49a9-43db-86fa-ff123c8e5e77",
//   "orgId": "default",
//     "blacklistCode": "192.168.1.1",
//       "tags": "Automatic-Scan",
//         "blacklistType": 1,
//           "createdDate": "2024-10-12T09:24:30.125001Z"

const selectedTable = ref([])
const apiComponent = "OrganizationUser"
const globalRolesList = ref([])
const selectedRoles = ref([])
// Loading.show()
const model = ref(null)
export default {
  setup() {
    onMounted(() => {
      // console.log('onMount1')
      // this.loadMenu()
      loading.value = false
      Loading.hide()
    })
    const auth = useAuthStore();
    return {
      auth,
      loading
    }
  },
  data() {
    return {
      menus: [],
      isAddMenuDialogOpen: false,
      newMenuName: '',
      newIngredients: [
        { name: '', weight: '', tolerance: '' }
      ],
      loading,
      visible_menu_columns: ref(['index', 'name', 'price', 'description']),
      // visible_ingredient_columns: ref(['index', 'name', 'weight', 'tolerance']),
      table_columns_menu,
      // table_columns_ingredients,
      table_rows_menu,
      table_rows_ingredients,
      filter_menu_table,
      filter_ingredient_table,
      pagination_menu,
      pagination_ingredient,
      edit_ingredient_detail_isOpen,
      edit_ingredient_detail,
      selectedTable,
      add_ingredient_detail_isOpen,
      add_ingredient_detail,
      apiComponent,
      globalRolesList,
      selectedRoles,

      editorOptions,
      monacoEditor,
      showEditor,
      mock_roles,
      filterOptions,
      model,
      // rowsNumber: xx if getting data from a server
      createValue(val, done) {
        // Calling done(var) when new-value-mode is not set or is "add", or done(var, "add") adds "var" content to the model
        // and it resets the input textbox to empty string
        // ----
        // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
        // only if is not already set and it resets the input textbox to empty string
        // ----
        // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
        // (adds to model if not already in the model, removes from model if already has it)
        // and it resets the input textbox to empty string
        // ----
        // If "var" content is undefined/null, then it doesn't tampers with the model
        // and only resets the input textbox to empty string

        if (val.length > 0) {
          const modelValue = (model.value || []).slice()

          val
            .split(/[,;|]+/)
            .map(v => v.trim())
            .filter(v => v.length > 0)
            .forEach(v => {
              if (stringOptions.includes(v) === false) {
                stringOptions.push(v)
              }
              if (modelValue.includes(v) === false) {
                modelValue.push(v)
              }
            })

          done(null)
          model.value = modelValue
        }
      },

      filterFn(val, update) {
        update(() => {
          if (val === '') {
            filterOptions.value = stringOptions
          }
          else {
            const needle = val.toLowerCase()
            filterOptions.value = stringOptions.filter(
              v => v.toLowerCase().indexOf(needle) > -1
            )
          }
        })
      }
    };
  },
  // convertTimestamp(datetime) {
  //   let dbtime = moment(datetime);
  //   let formattedDate = dbtime.format("DD/MM/YYYY");
  //   return formattedDate // Output: 26-12-2023
  // },

  async onMounted() {
    // console.log('onMount2')
    loading.value = false
    Loading.hide()
    // console.log('load menu');
    // await this.loadMenu();
  },
  beforeMount() {
    // console.log('beformount')
    definePageMeta({
      middleware: 'auth'
    })
    this.loadData();
    this.loadRoles();
  },
  // onMounted() {
  //   loadMenu()
  //   // Loading.hide()
  // },
  methods: {
    async loadData() {
      loading.value = true
      try {
        const accessToken = localStorage.getItem('accessToken');

        // Change to POST method with correct component name
        let data = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({
            offset: (this.pagination_menu.page - 1) * this.pagination_menu.rowsPerPage,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: this.pagination_menu.rowsPerPage,
            fullTextSearch: this.filter_menu_table,
            apiComponent: this.apiComponent,
            orgName: "default",
            actionName: "GetUsers" // Changed to GetUsers
          })
        })

        // Make sure we're mapping the received data properly
        this.table_rows_menu = data.map((item, index) => ({
          ...item,
          index: ((this.pagination_menu.page - 1) * this.pagination_menu.rowsPerPage) + index + 1
        }));

        // Reset selection when data is loaded
        this.selectedTable = [];

        // Get total count
        await this.loadCount();

        loading.value = false;
        console.log('Loaded users:', this.table_rows_menu);
      } catch (error) {
        console.error('Error fetching users:', error);
        loading.value = false;

        // Show blank table instead of mock data
        this.table_rows_menu = [];
        this.pagination_menu.rowsNumber = 0;

        Notify.create({
          message: 'Failed to load users from API: ' + (error.message || 'Unknown error'),
          color: 'negative',
          position: 'top'
        });
      }
    },
    async loadCount() {
      try {
        const accessToken = localStorage.getItem('accessToken');

        // Change to POST method with correct action
        let countData = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({
            apiComponent: this.apiComponent,
            orgName: "default",
            actionName: "GetUserCount", // Changed to GetUserCount
            fullTextSearch: this.filter_menu_table
          })
        });

        // Directly assign the count data without checking for totalCount property
        this.pagination_menu.rowsNumber = countData || 0;
        console.log('Total user count:', countData);
      } catch (error) {
        console.error('Error fetching user count:', error);
        // Set count to 0 instead of using mock data length
        this.pagination_menu.rowsNumber = 0;
      }
    },
    async loadMenu() {
      try {
        // const data = await fetchMenu();
        let mockdata = [...mock_data];
        // console.log(mockdata)
        // console.log(filteredData);
        this.menus = mockdata;
        console.log(this.menus);
        let data_rows = mockdata
        this.selectedTable = []
        for (let index = 0; index < data_rows.length; index++) {
          this.selectedTable.push({ value: false })
          const element = data_rows[index];
          element.index = index + 1;
        }
        // console.log(data_rows)
        this.table_rows_menu = data_rows;
        // console.log(this.table_rows_menu)
      }
      catch (error) {
        console.error('Error fetching menu:', error);
        this.menus = [];
      }
    },
    convertTimestamp(datetime) {
      console.log('call')
      return moment(datetime).format("DD/MM/YYYY");
    },

    navigateToIngredients(menuId) {
      this.$router.push({ path: '/ingredients', query: { menu_id: menuId } });
    },
    showAddMenuDialog() {
      this.isAddMenuDialogOpen = true;
    },
    addAnotherIngredient() {
      this.newIngredients.push({ name: '', weight: '', tolerance: '' });
    },
    callApiIngredients(menuId) {
      // this.$router.push({ path: '/ingredient', query: { menu_id: menuId } });
    },
    getCurrentTimestamp() {
      // Get the current UTC time using moment
      const now = moment.utc();
      // Format milliseconds as three digits
      const ms = now.format("SSS");
      // Append three zeros to simulate microseconds
      return now.format("YYYY-MM-DDTHH:mm:ss.") + ms + "000Z";
    },
    clearAddTable() {
      this.add_ingredient_detail = {
        userName: "",
        userEmail: "",
        rolesList: "",
        createdDate: "2024-10-12T09:24:30.125001Z"
      }
    },
    onDialogShow() {
      this.clearAddTable();
      // Initialize with empty selection when adding new
      this.selectedRoles = [];
    },
    updateRolesListFromSelected() {
      // Convert selectedRoles array to comma-separated string
      if (this.add_ingredient_detail_isOpen) {
        this.add_ingredient_detail.rolesList = this.selectedRoles.join(',')
      } else if (this.edit_ingredient_detail_isOpen) {
        this.edit_ingredient_detail.rolesList = this.selectedRoles.join(',')
      }
    },
    initSelectedRolesFromList(rolesList) {
      if (!rolesList) return []
      // Split the comma-separated string into array
      return rolesList.split(',')
    },
    async loadRoles() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        let data = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({
            offset: 0,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: 0,
            fullTextSearch: this.filter_menu_table,
            apiComponent: "Role",
            orgName: "default",
            actionName: "GetRoles"
          })
        })
        this.globalRolesList = [...data]
        console.log('Loaded roles:', data)
      } catch (error) {
        console.error('Error fetching role data:', error);
        // Empty roles list instead of using mock data
        this.globalRolesList = []

        Notify.create({
          message: 'Failed to load roles: ' + (error.message || 'Unknown error'),
          color: 'negative',
          position: 'top'
        });
      }
    },
    isRowSelected(row) {
      return this.selectedTable.includes(row.index)
    },

    toggleRowSelection(row, isSelected) {
      if (isSelected) {
        // Add the row's unique index if it's not already in the array
        if (!this.selectedTable.includes(row.index)) {
          this.selectedTable.push(row.index)
        }
      } else {
        // Remove the row's index from the array
        this.selectedTable = this.selectedTable.filter(id => id !== row.index)
      }
    },
    // This method is no longer used, replaced by deleteSelectedUsers
    deleteSelectedRows() {
      console.log("Using API-based deletion instead")
    },

    async copyToClipboard(textToCopy) {
      try {
        // Use the Clipboard API to write the text
        await navigator.clipboard.writeText(textToCopy)
        Notify.create({
          message: 'Text copied successfully!',
          color: 'positive',
          position: 'top'
        })
      } catch (error) {
        console.error('Failed to copy:', error)
        Notify.create({
          message: 'Failed to copy text',
          color: 'negative',
          position: 'top'
        })
      }
    },

    async onClick(fn_name, param = null) {
      switch (fn_name) {
        case 'tableSearch':
          if (this.filter_menu_table.trim().length > 0) {
            console.log(`searching for ${this.filter_menu_table}`)
          } else {
            console.log(`no search text`)
          }
          // Reset pagination to first page when searching
          this.pagination_menu.page = 1
          await this.loadData()
          break;
        case 'editIngredient':
          this.showEditor = false
          console.log(param);

          if (param.orgUserId) {
            try {
              // Fetch detailed user data if needed
              const userData = await this.getUserById(param.orgUserId);
              if (userData) {
                this.edit_ingredient_detail = userData;
              } else {
                this.edit_ingredient_detail = param;
              }
            } catch (error) {
              console.error("Error fetching user details:", error);
              this.edit_ingredient_detail = param;
            }
          } else {
            this.edit_ingredient_detail = param;
          }

          // Initialize checkboxes based on existing rolesList
          this.selectedRoles = this.initSelectedRolesFromList(this.edit_ingredient_detail.rolesList)
          this.edit_ingredient_detail_isOpen = true;
          break;
        case 'saveEditIngredient':
          console.log('saveEditIngredient')
          console.log(this.edit_ingredient_detail)
          await this.updateUser(this.edit_ingredient_detail.orgUserId, this.edit_ingredient_detail)
          // Notify.create({
          //   position: "top",
          //   type: 'positive',
          //   message: 'บันทึกสำเร็จ'
          // });
          this.edit_ingredient_detail_isOpen = false;
          break;
        // const data = updateIngredient(this.edit_ingredient_detail.id, this.edit_ingredient_detail);
        case 'saveAddTable':
          this.add_ingredient_detail.createdDate = this.getCurrentTimestamp()
          await this.createUser()
          this.clearAddTable()
          this.add_ingredient_detail_isOpen = false
          break;

        case 'deleteSelectedTable':
          console.log(`deleteTable`)
          await this.deleteSelectedUsers()
          break;
        case 'addTable':
          this.showEditor = false
          this.add_ingredient_detail_isOpen = true
          break;
        default:
          break;
      }
    },
    async createUser() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        // Create proper payload for the user creation API
        const payload = {
          apiComponent: this.apiComponent,
          orgName: "default",
          orgCustomId: "default",
          actionName: "AddUser",
          apiMethod: "POST",  // Specify POST method explicitly
          userName: this.add_ingredient_detail.userName,
          userEmail: this.add_ingredient_detail.userEmail,
          rolesList: this.add_ingredient_detail.rolesList,
          userCreateDate: this.getCurrentTimestamp()
        };

        console.log("Creating user with payload:", payload);

        const response = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify(payload)
        });

        console.log("Create response:", response);

        // Check the response status
        if (response.status === 'OK') {
          // Reload data to show the new user
          await this.loadData();

          Notify.create({
            message: 'User created successfully',
            color: 'positive',
            position: 'top'
          });

          // Close the dialog
          this.add_ingredient_detail_isOpen = false;
        } else {
          // Handle non-success status
          throw new Error(response.description || 'Unknown error');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        Notify.create({
          message: 'Failed to create user: ' + (error.message || 'Unknown error'),
          color: 'negative',
          position: 'top'
        });
      }
    },

    async updateUser(orgUserId, userData) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        // Create proper payload for the user update API
        const payload = {
          apiComponent: this.apiComponent,
          orgName: "default",
          actionName: "UpdateUserById",
          id: orgUserId,  // Required for path construction in apiClient
          apiMethod: "POST",  // Specify POST method
          userName: userData.userName,
          userEmail: userData.userEmail,
          rolesList: userData.rolesList
        };

        console.log("Updating user with payload:", payload);

        const response = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify(payload)
        });

        console.log("Update response:", response);

        // Check the response status
        if (response.status === 'OK') {
          // Reload data to show updated user
          await this.loadData();

          Notify.create({
            position: "top",
            type: 'positive',
            message: 'บันทึกสำเร็จ'
          });
        } else {
          // Handle non-success status
          throw new Error(response.description || 'Unknown error');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        Notify.create({
          message: 'Failed to update user: ' + (error.message || 'Unknown error'),
          color: 'negative',
          position: 'top'
        });
      }
    },

    async deleteUser(orgUserId) {
      try {
        const accessToken = localStorage.getItem('accessToken');

        console.log("Deleting user with orgUserId:", orgUserId);

        // Use apiClient with correct parameters
        const response = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({
            apiComponent: this.apiComponent,
            orgName: "default",
            actionName: "DeleteUserById",
            id: orgUserId,
            apiMethod: "DELETE"  // This tells apiClient to use DELETE method
          })
        });

        console.log("Delete response:", response);

        // Check the response status
        if (response.status === 'OK') {
          Notify.create({
            message: 'User deleted successfully',
            color: 'positive',
            position: 'top'
          });

          // Reload data to update the table
          await this.loadData();
        } else {
          // Handle non-success status
          throw new Error(response.description || 'Unknown error');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        Notify.create({
          message: 'Failed to delete user: ' + (error.message || 'Unknown error'),
          color: 'negative',
          position: 'top'
        });
      }
    },

    async deleteSelectedUsers() {
      try {
        // Find the selected users
        const selectedUsers = this.table_rows_menu.filter(row =>
          this.selectedTable.includes(row.index)
        )

        if (selectedUsers.length === 0) {
          Notify.create({
            message: 'No users selected for deletion',
            color: 'warning',
            position: 'top'
          })
          return
        }

        let html = selectedUsers
          .map(item => `${item.index}. Username : ${item.userName}, E-mail : ${item.userEmail} , Role : ${item.rolesList} `)
          .join('<br/>')

        // Delete each selected user
        Dialog.create({
          title: '<span class="text-red">ยืนยันการลบข้อมูลต่อไปนี้ !</span>',
          message: `<span class="text-yellow">${html}</span>`,
          html: true,
          style: 'minWidth:600px',
          ok: {
            push: true,
            color: 'primary'
          },
          cancel: {
            push: true,
            color: 'negative'
          },
          persistent: true
        }).onOk(async () => {
          for (const user of selectedUsers) {
            await this.deleteUser(user.orgUserId)
          }

        }).onCancel(() => {
          // console.log('>>>> Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })

        // Clear selection after deletion
        this.selectedTable = []

      } catch (error) {
        console.error('Error deleting users:', error)
        Notify.create({
          message: 'Failed to delete some users: ' + (error.message || 'Unknown error'),
          color: 'negative',
          position: 'top'
        })
      }
    },

    async loadNextData(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.pagination_menu.page = page
      this.pagination_menu.rowsPerPage = rowsPerPage
      this.pagination_menu.sortBy = sortBy
      this.pagination_menu.descending = descending

      await this.loadData()
    }
    // async handleAddMenu() {
    //   try {
    //     const response = await createMenu({ name: this.newMenuName });
    //     const menuId = response.data.id;
    //     for (const ingredient of this.newIngredients) {
    //       await createIngredient({ ...ingredient, menu_id: menuId });
    //     }
    //     this.menus.push(response.data);
    //     this.isAddMenuDialogOpen = false;
    //     this.newMenuName = '';
    //     this.newIngredients = [{ name: '', weight: '', tolerance: '' }];
    //   } catch (error) {
    //     console.error('Error adding menu:', error);
    //   }
    // }
  },

};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $primary

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px

.custom-outlined-container
  position: relative
  border: 1px solid rgba(0, 0, 0, 0.24)
  border-radius: 4px
  padding-top: 8px
  padding-bottom: 8px
  min-height: 56px
  background: transparent

.custom-outlined-container:hover
  border-color: #000

.custom-outlined-label
  position: absolute
  top: -12px
  left: 8px
  padding: 0 4px
  font-size: 20px
  font-weight: 500
  line-height: 1
  color: rgba(0, 0, 0, 0.6)
  background-color: var(--q-card-bg, white)

/* Dark mode support */
.body--dark .custom-outlined-container
  border-color: rgba(255, 255, 255, 0.24)

.body--dark .custom-outlined-container:hover
  border-color: #fff

.body--dark .custom-outlined-label
  color: rgba(255, 255, 255, 0.7)
  background-color: var(--q-dark, #1D1D1D)
</style>
