<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <!-- <q-card-section class="q-pb-none">
        <h5 class="q-pa-none q-ma-none">
          Destination IP</h5>
      </q-card-section> -->

      <q-card-section>
        <div class="row">

          <div class="col-12 col-md-12 q-pa-sm">

            <q-table class="my-sticky-header-table" style="height: 87vh;" flat bordered title="เมนู" color="amber"
              :rows="table_rows_menu" :columns="table_columns_menu" row-key="id" v-model:pagination="pagination_menu"
              v-model:selected="selected" selection="multiple" :rows-per-page-options="[5, 10, 15, 20, 30, 50, 0]"
              @request="loadNextData" separator="cell" :loading="loading">

              <template v-slot:top-left>

                <!-- <div class="text-h5 q-mr-md">Black list IP Address</div> -->
                <q-input outlined dense debounce="300" placeholder="ค้นหา" v-model="filter_menu_table" bg-color="dark"
                  @keyup.enter="onClick(`tableSearch`)">
                  <template v-slot:append>

                    <q-btn round dense flat icon="search" @click="onClick(`tableSearch`)" />
                  </template>
                </q-input>
                <q-badge class="q-ml-md text-bold q-pa-sm" align="middle" color="dark" style="font-size:20px;">
                  ข้อมูลทั้งหมด : {{ Number(pagination_menu.rowsNumber).toLocaleString('en-US') }} ชุด
                </q-badge>
              </template>
              <template v-slot:top-right>

                <q-btn class="q-mr-lg" icon="add" rounded color="green-7" @click="onClick(`addTable`)" />
                <q-btn :disable="selectedTable <= 0" icon="delete" rounded color="negative"
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

                    <template v-else-if="col.name === 'ruleCreatedDate'">
                      {{ convertTimestamp(props.row.ruleCreatedDate) }}
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
          <div class="text-h6">แก้ไขข้อมูลของ ID :
            <q-badge outline class="text-h6 q-ml-md" align="middle" color="positive">
              {{ edit_ingredient_detail.ruleId }}

            </q-badge>
          </div>

          <!-- <div class="text-h7 q-mt-sm">Destination IP Address : <q-badge class="text-h5" color="primary">{{
            edit_ingredient_detail.blacklistCode }} </q-badge></div> -->
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.ruleName" outlined label="Rule Name" disable />

            <!-- <q-btn @click="this.showEditor = !this.showEditor" color="green"> -->
            <q-btn @click="onClick('editRule')" color="green">
              แก้ไข code</q-btn>
            <div v-if="showEditor">
              <MonacoEditor v-model="edit_ingredient_detail.ruleDefinition" lang="yaml" style="height: 400px;"
                :options="editorOptions" />
            </div>
            <q-input v-if="!showEditor" class="q-pb-lg" v-model="edit_ingredient_detail.ruleDefinition" outlined
              label="Rule Definition" disable />
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.refUrl" outlined label="URL" />
            <q-input v-model="edit_ingredient_detail.tags" outlined label="tags" />
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
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.ruleName" outlined label="Rule Name">

            </q-input>

            <q-btn @click="this.showEditor = !this.showEditor" color="green">
              แก้ไข code</q-btn>
            <div v-if="showEditor">
              <MonacoEditor v-model="add_ingredient_detail.ruleDefinition" lang="yaml" style="height: 400px;"
                :options="editorOptions" />
            </div>
            <q-input v-if="!showEditor" class="q-pb-lg" v-model="add_ingredient_detail.ruleDefinition" outlined
              label="Rule Definition" disable />

            <q-input class="q-pb-lg" v-model="add_ingredient_detail.refUrl" outlined label="URL" />
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.tags" outlined label="tags" />
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

const table_columns_menu = [

  { name: 'id', align: 'center', label: 'Action', field: 'index', headerStyle: 'width: 30px' },
  // { name: 'blacklistId', label: 'ชื่อ', align: 'left', field: 'blacklistId', sortable: true },
  { name: 'ruleName', align: 'left', label: 'Rule Name', field: 'ruleName', sortable: true, },
  { name: 'refUrl', align: 'center', label: 'URL', field: 'refUrl', sortable: true, },
  { name: 'tags', align: 'left', label: 'tags', field: 'tags', sortable: true, },
  // { name: 'blacklistType', align: 'center', label: 'type', field: 'blacklistType', sortable: true, },

  // { name: 'ruleCreatedDate', align: 'center', label: 'สร้างเมื่อ', field: 'ruleCreatedDate', sortable: true, },

]
const selected = ref([])
const monacoEditor = ref(null)
const showEditor = ref(false)
const editorOptions = {
  automaticLayout: true,
  theme: 'vs-dark',
}


const mock_data = [
  {
    "ruleName": "NoEmptyFields",
    "ruleDefinition": "|\n  description: Ensure that all required fields are filled\n  conditions:\n    - field: username\n      required: true\n    - field: password\n      required: true",
    "refUrl": "https://example.com/rules/no-empty-fields",
    "tags": "validation, form, data",
    "ruleCreatedDate": "2023-09-01T08:00:00Z",
    "update_at": "2023-09-10T08:00:00Z"
  },
  {
    "ruleName": "MaxInputLength",
    "ruleDefinition": "|\n  description: Limit the input length to prevent overflow issues\n  max_length: 100\n  note: 'Ensures UI stability'",
    "refUrl": "https://example.com/rules/max-input-length",
    "tags": "validation, input, UI",
    "ruleCreatedDate": "2023-08-20T09:00:00Z",
    "update_at": "2023-08-25T09:00:00Z"
  },
  {
    "ruleName": "UniqueEmail",
    "ruleDefinition": "|\n  description: Ensure that the email address is unique in the system\n  check:\n    - field: email\n      uniqueness: true",
    "refUrl": "https://example.com/rules/unique-email",
    "tags": "validation, email, uniqueness",
    "ruleCreatedDate": "2023-07-15T10:00:00Z",
    "update_at": "2023-07-20T10:00:00Z"
  },
  {
    "ruleName": "ValidDateFormat",
    "ruleDefinition": "|\n  description: Date should follow the format YYYY-MM-DD\n  pattern: '^\\d{4}-\\d{2}-\\d{2}$'\n  example: 2023-01-01",
    "refUrl": "https://example.com/rules/valid-date-format",
    "tags": "validation, date, format",
    "ruleCreatedDate": "2023-06-01T11:00:00Z",
    "update_at": "2023-06-05T11:00:00Z"
  },
  {
    "ruleName": "PositiveNumbers",
    "ruleDefinition": "|\n  description: Ensure that numeric values are positive\n  conditions:\n    - value: must be > 0",
    "refUrl": "https://example.com/rules/positive-numbers",
    "tags": "validation, numeric, logic",
    "ruleCreatedDate": "2023-05-10T12:00:00Z",
    "update_at": "2023-05-15T12:00:00Z"
  },
  {
    "ruleName": "NoSQLInjection",
    "ruleDefinition": "|\n  description: Prevent SQL injection by sanitizing all database inputs\n  methods:\n    - parameterized queries\n    - input sanitization",
    "refUrl": "https://example.com/rules/no-sql-injection",
    "tags": "security, database, injection",
    "ruleCreatedDate": "2023-04-01T13:00:00Z",
    "update_at": "2023-04-05T13:00:00Z"
  },
  {
    "ruleName": "StrongPassword",
    "ruleDefinition": "|\n  description: Password must be strong and secure\n  criteria:\n    - minimum: 8 characters\n    - mix: letters, numbers, and symbols",
    "refUrl": "https://example.com/rules/strong-password",
    "tags": "security, password, validation",
    "ruleCreatedDate": "2023-03-20T14:00:00Z",
    "update_at": "2023-03-25T14:00:00Z"
  },
  {
    "ruleName": "SecureProtocol",
    "ruleDefinition": "|\n  description: All external communications must use HTTPS\n  note: 'Ensures data encryption and integrity'",
    "refUrl": "https://example.com/rules/secure-protocol",
    "tags": "security, network, protocol",
    "ruleCreatedDate": "2023-02-10T15:00:00Z",
    "update_at": "2023-02-15T15:00:00Z"
  },
  {
    "ruleName": "SafeRedirect",
    "ruleDefinition": "|\n  description: Validate redirect URLs to prevent open redirect vulnerabilities\n  checks:\n    - verify domain\n    - allow-list trusted URLs",
    "refUrl": "https://example.com/rules/safe-redirect",
    "tags": "security, redirect, validation",
    "ruleCreatedDate": "2023-01-05T16:00:00Z",
    "update_at": "2023-01-10T16:00:00Z"
  },
  {
    "ruleName": "ValidURLFormat",
    "ruleDefinition": "|\n  description: refUrl must adhere to a valid format\n  pattern: '^(https?|ftp)://[^\\s/$.?#].[^\\s]*$'\n  example: https://example.com",
    "refUrl": "https://example.com/rules/valid-refUrl-format",
    "tags": "validation, refUrl, format",
    "ruleCreatedDate": "2023-12-01T17:00:00Z",
    "update_at": "2023-12-05T17:00:00Z"
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
  ruleName: "",
  ruleDefinition: "",
  refUrl: "",
  tags: "",
  ruleCreatedDate: "2024-10-12T09:24:30.125001Z",
  update_at: "2023-05-20T11:00:00Z"

}
const add_ingredient_detail_isOpen = ref(false)
const add_ingredient_detail = {
  ruleName: "",
  ruleDefinition: "",
  refUrl: "",
  tags: "",
  ruleCreatedDate: "2024-10-12T09:24:30.125001Z",
  update_at: "2023-05-20T11:00:00Z"

}

// "blacklistId": "8d2b7f6c-49a9-43db-86fa-ff123c8e5e77",
//   "orgId": "default",
//     "blacklistCode": "192.168.1.1",
//       "tags": "Automatic-Scan",
//         "blacklistType": 1,
//           "ruleCreatedDate": "2024-10-12T09:24:30.125001Z"

const selectedTable = ref([])
const code = ref(`# Write your YAML code here...
rule:
  description: "Ensure all required fields are filled."
  conditions:
    - field: username
      required: true
    - field: password
      required: true
`)

export default {
  mounted() {
    this.loading = false
    // Loading.hide()
  },
  setup() {

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

      editorOptions,
      code,
      monacoEditor,
      showEditor,


      // rowsNumber: xx if getting data from a server
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
    await this.fetchData()
    // console.log('load menu');
    // await this.loadMenu();
  },
  beforeMount() {
    // console.log('beformount')
    definePageMeta({
      middleware: 'auth'
    })
    this.loadData();
  },
  // onMounted() {
  //   loadMenu()
  //   // Loading.hide()
  // },
  methods: {
    async loadMenu(data) {
      try {
        // const data = await fetchMenu();
        let mockdata = [...data];
        // console.log(mockdata)
        // console.log(filteredData);
        this.menus = mockdata;
        console.log(this.menus);
        let data_rows = mockdata
        this.selectedTable = []
        for (let index = 0; index < data_rows.length; index++) {
          this.selectedTable.push({ value: false })
          const element = data_rows[index];
          element.index = index + 1 + ((pagination_menu.value.page - 1) * pagination_menu.value.rowsPerPage);
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
        ruleName: "",
        ruleDefinition: "",
        refUrl: "",
        tags: "",
        ruleCreatedDate: "2024-10-12T09:24:30.125001Z",
        update_at: "2023-05-20T11:00:00Z"

      }
    },
    isRowSelected(row) {
      return selectedTable.value.includes(row.index)
    },

    toggleRowSelection(row, isSelected) {
      if (isSelected) {
        // Add the row's unique index if it's not already in the array
        if (!selectedTable.value.includes(row.index)) {
          selectedTable.value.push(row.index)
        }
      } else {
        // Remove the row's index from the array
        selectedTable.value = selectedTable.value.filter(id => id !== row.index)
      }
    },

    async onClick(fn_name, param = null) {
      switch (fn_name) {
        case 'tableSearch':
          this.loadData()
          break;
        case 'editIngredient':
          this.showEditor = false
          console.log(param);
          this.edit_ingredient_detail = param;
          this.edit_ingredient_detail_isOpen = true;

          // edit_ingredient_detail 
          break;
        case 'saveEditIngredient':
          console.log('saveEditIngredient')
          console.log(this.edit_ingredient_detail)
          this.updateData()

          break;
        case 'saveAddTable':
          this.add_ingredient_detail.ruleCreatedDate = this.getCurrentTimestamp()
          this.addData()

          break;

        case 'deleteSelectedTable':
          console.log(`deleteTable`)
          this.deleteSelectedRows()
          break;
        case 'addTable':
          this.showEditor = false
          this.add_ingredient_detail_isOpen = true
          break;
        case 'editRule':
          if (!this.showEditor) {
            this.edit_ingredient_detail.ruleDefinition = await this.getRulesById(this.edit_ingredient_detail.ruleId)
          }
          this.showEditor = !this.showEditor
          // this.edit_ingredient_detail_isOpen = true
          break;

        default:
          break;
      }
    },
    async fn_updateIngredient(id, data) {
      // const resData = await updateIngredient(id, data);
      // console.log(resData)

    },
    async deleteSelectedRows() {
      // table_rows_menu.value.filter(row => !selectedTable.value.includes(row.ruleId)
      // table_rows_menu.value = table_rows_menu.value.filter(row => !selectedTable.value.includes(row.index))
      // selectedTable.value = []
      let data = table_rows_menu.value.filter(row => selectedTable.value.includes(row.index))
      // console.log(data.length)
      for (let index = 0; index < data.length; index++) {
        await this.deleteData(data[index].ruleId)

      }
      console.log(data)
    },
    async getRulesById(ruleId) {

      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body = { ruleId: ruleId }

        console.log(body)
        let data = await $fetch('/api/hunting_rules/get_by_id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify(body)


        });
        // Notify.create({
        //   position: "top",
        //   type: 'positive',
        //   message: 'ลบมูลสำเร็จ'
        // });
        // this.edit_ingredient_detail_isOpen = false;
        // await this.loadData()
        return data.ruleDefinition
      } catch (error) {
        console.error('Error delete data:', error);
        Notify.create({
          position: "top",
          type: 'negative',
          message: 'Error delete data:' + error
        });
      } finally {
        Loading.hide()
      }
    },
    async deleteData(ruleId) {

      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body = { ruleId: ruleId }

        console.log(body)
        let countData = await $fetch('/api/hunting_rules/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify(body)


        });
        Notify.create({
          position: "top",
          type: 'positive',
          message: 'ลบมูลสำเร็จ'
        });
        this.edit_ingredient_detail_isOpen = false;
        await this.loadData()
      } catch (error) {
        console.error('Error delete data:', error);
        Notify.create({
          position: "top",
          type: 'negative',
          message: 'Error delete data:' + error
        });
      } finally {
        Loading.hide()
      }
    },
    async updateData() {
      console.log('add data')
      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body =
          this.edit_ingredient_detail

        console.log(body)
        console.log('start addd')
        let countData = await $fetch('/api/hunting_rules/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify(body)


        });
        Notify.create({
          position: "top",
          type: 'positive',
          message: 'อัพเดขข้อมูลสำเร็จ'
        });
        this.edit_ingredient_detail_isOpen = false;
        await this.loadData()
      } catch (error) {
        console.error('Error create data:', error);
        Notify.create({
          position: "top",
          type: 'negative',
          message: 'Error create data:' + error
        });
      } finally {
        Loading.hide()
      }
    },
    async addData() {
      console.log('add data')
      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body = {
          // ruleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          ruleName: add_ingredient_detail.ruleName,
          orgId: "default",
          ruleCreatedDate: add_ingredient_detail.ruleCreatedDate,
          ruleDescription: "",
          ruleDefinition: add_ingredient_detail.ruleDefinition,
          refUrl: add_ingredient_detail.refUrl,
          refType: "Sigma",
          tags: add_ingredient_detail.tags
        }
        console.log(body)
        console.log('start addd')
        let countData = await $fetch('/api/hunting_rules/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify(body)


        });
        Notify.create({
          position: "top",
          type: 'positive',
          message: 'เพิ่มข้อมูลสำเร็จ'
        });
        this.add_ingredient_detail_isOpen = false
        this.loadData()
      } catch (error) {
        console.error('Error create data:', error);

      } finally {
        Loading.hide()
      }
    },

    async loadData() {
      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let countData = await $fetch('/api/hunting_rules/count', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify({
            offset: 0,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: 0,
            fullTextSearch: filter_menu_table.value,
            refType: "Sigma"
          })


        });
        console.log(countData)

        pagination_menu.value.rowsNumber = countData
        pagination_menu.value.page = 1

        console.log(pagination_menu.page)
        let data = await $fetch('/api/hunting_rules/rules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:

          body: JSON.stringify({
            offset: pagination_menu.value.page,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: pagination_menu.value.rowsPerPage,
            fullTextSearch: filter_menu_table.value,
            refType: "Sigma"
          })


        });
        // console.log(data)
        await this.loadMenu(data)
        // for (let index = 0; index < 4; index++) {
        //   overViewArray.value[index]['link'] = overviewData.value[index].variableValue;
        //   console.log(data)
        // }
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        Loading.hide()
      }
    },

    async loadNextData(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let countData = await $fetch('/api/hunting_rules/count', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify({
            offset: 0,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: 0,
            fullTextSearch: filter_menu_table.value,
            refType: "Sigma"
          })


        });
        console.log(page - 1)
        console.log(countData)
        pagination_menu.value.rowsNumber = countData
        pagination_menu.value.page = page
        pagination_menu.value.rowsPerPage = rowsPerPage
        console.log(pagination_menu.page)
        let data = await $fetch('/api/hunting_rules/rules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:

          body: JSON.stringify({
            offset: pagination_menu.value.page - 1,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: pagination_menu.value.rowsPerPage,
            fullTextSearch: filter_menu_table.value,
            refType: "Sigma"
          })


        });
        // console.log(data)
        await this.loadMenu(data)
        // for (let index = 0; index < 4; index++) {
        //   overViewArray.value[index]['link'] = overviewData.value[index].variableValue;
        //   console.log(data)
        // }
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        Loading.hide()
      }
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
</style>
