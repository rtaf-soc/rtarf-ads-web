<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>

      <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
        <div class="row">
          <div class="col-12 col-md-12 q-pa-none">
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
                  ข้อมูลทั้งหมด : {{ Number(pagination_menu.rowsNumber).toLocaleString('en-US') }}
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
          <div class="text-h6">แก้ไขข้อมูลของ ID : <q-badge outline class="text-h6" align="middle" color="positive">{{
            edit_ingredient_detail.iocHostId }} </q-badge></div>

          <!-- <div class="text-h7 q-mt-sm">Destination IP Address : <q-badge class="text-h5" color="primary">{{
            edit_ingredient_detail.blacklistCode }} </q-badge></div> -->
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.iocEndpoint" outlined label="URL" />
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.description" outlined label="Description" />
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.authenticationKey" outlined label="API Key"
              type="password">
              <template v-slot:append>
                <q-btn flat round dense icon="content_copy"
                  @click="copyToClipboard(edit_ingredient_detail.authenticationKey)" />
              </template>
            </q-input>
            <q-input v-model="edit_ingredient_detail.tags" outlined label="tags" />
          </q-item-section>
        </q-item>

        <q-card-actions align="around">
          <q-btn label="ยกเลิก" color="negative" v-close-popup />
          <q-btn flat label="บันทึก" @click="onClick('saveEditIngredient')" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="add_ingredient_detail_isOpen">
      <q-card style="width: 800px; max-width: 800vw;">

        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">เพิ่มข้อมูล </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>

            <q-input class="q-pb-lg" v-model="add_ingredient_detail.iocEndpoint" outlined label="URL" />
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.description" outlined label="Description" />
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.iocHostCode" outlined label="CIDR Code" />
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.iocType" outlined label="CIDR Type" />
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.authenticationKey" outlined label="API Key"
              type="password">
              <template v-slot:append>
                <q-btn flat round dense icon="content_copy"
                  @click="copyToClipboard(add_ingredient_detail.authenticationKey)" />
              </template>
            </q-input>
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

// import { fetchMenu, createMenu } from '~/api/menuService';
// import { createIngredient, fetchIngredients, updateIngredient } from '~/api/ingredientService';

const table_columns_menu = [

  { name: 'id', align: 'center', label: 'Action', field: 'index', headerStyle: 'width: 30px' },
  { name: 'iocEndpoint', align: 'center', label: 'URL', field: 'iocEndpoint', sortable: true, },
  { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true, },

  { name: 'tags', align: 'left', label: 'tags', field: 'tags', sortable: true, },
  // { name: 'blacklistType', align: 'center', label: 'type', field: 'blacklistType', sortable: true, },

  // { name: 'createdDate', align: 'center', label: 'สร้างเมื่อ', field: 'createdDate', sortable: true, },

]


const mock_data = []

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
  iocHostId: "",
  orgId: "default",
  iocHostCode: "",
  iocType: "",
  iocEndpoint: "",
  authenticationKey: "",
  isTlsRequired: "",
  description: "",
  createdDate: "2024-10-12T09:24:30.125001Z",
  tags: ""
}

const add_ingredient_detail_isOpen = ref(false)
const add_ingredient_detail = {
  // iocHostId: "",
  orgId: "default",
  iocHostCode: "",
  iocType: "",
  iocEndpoint: "",
  authenticationKey: "",
  isTlsRequired: true,
  description: "",
  createdDate: "2024-10-12T09:24:30.125001Z",
  tags: ""

}

// "blacklistId": "8d2b7f6c-49a9-43db-86fa-ff123c8e5e77",
//   "orgId": "default",
//     "blacklistCode": "192.168.1.1",
//       "tags": "Automatic-Scan",
//         "blacklistType": 1,
//           "createdDate": "2024-10-12T09:24:30.125001Z"

const selectedTable = ref([])
const apiComponent = "IocHost"
// Loading.show()

export default {
  mounted() {
    console.log('mounted')
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
      apiComponent
      // rowsNumber: xx if getting data from a server
    };
  },

  // convertTimestamp(datetime) {
  //   let dbtime = moment(datetime);
  //   let formattedDate = dbtime.format("DD/MM/YYYY");
  //   return formattedDate // Output: 26-12-2023
  // },

  // async onMounted() {
  //   console.log('onMount2')
  //   loading.value = false
  //   Loading.hide()
  //   await this.fetchData()
  //   // console.log('load menu');
  //   // await this.loadMenu();
  // },
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
        console.log("load menu")
        console.log(data)
        let mockdata = [...data];
        console.log("load menu from data")
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
        // iocHostId: "",
        orgId: "default",
        iocHostCode: "",
        iocType: "",
        iocEndpoint: "",
        authenticationKey: "",
        isTlsRequired: true,
        description: "",
        createdDate: "2024-10-12T09:24:30.125001Z",
        tags: ""

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
          this.add_ingredient_detail.createdDate = this.getCurrentTimestamp()
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
      let html = data
        .map(item => `${item.index}. URL : ${item.iocEndpoint} , TAGS : ${item.tags}`)
        .join('<br/>')

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
        // console.log('>>>> OK')
        for (let index = 0; index < data.length; index++) {
          await this.deleteData(data[index].iocHostId)

        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })

      // for (let index = 0; index < data.length; index++) {
      //   await this.deleteData(data[index].ruleId)

      // }
      console.log(data)
    },
    async getRulesById(ruleId) {

      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body = { ruleId: ruleId }

        console.log(body)
        let data = await $fetch('/api/blacklist/get_by_id', {
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
    async deleteData(id) {
      Loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body = {
          id: id,
          apiComponent: apiComponent,
          orgName: "default",
          actionName: "DeleteIocHostById",
          apiMethod: "DELETE"
        }

        console.log(body)
        let countData = await $fetch('/api/apiClient', {
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
        let body = this.edit_ingredient_detail
        body['id'] = this.edit_ingredient_detail.iocHostId
        body['apiComponent'] = apiComponent
        body['orgName'] = "default"
        body['actionName'] = "UpdateIocHostById"

        console.log(body)
        console.log('start addd')
        let countData = await $fetch('/api/apiClient', {
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

        let body = this.add_ingredient_detail
        body['apiComponent'] = apiComponent
        body['orgName'] = "default"
        body['actionName'] = "AddIocHost"

        console.log(body)
        console.log('start addd')
        let data = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          // Use a raw JSON body as expected by your API:
          body: JSON.stringify(body)
        });

        if (data.status.toLowerCase() != "ok") {
          throw data.description
        }
        Notify.create({
          position: "top",
          type: 'positive',
          message: 'เพิ่มข้อมูลสำเร็จ'
        });
        this.add_ingredient_detail_isOpen = false
        this.clearAddTable()
        this.loadData()
      } catch (error) {
        Notify.create({
          position: "top",
          type: 'negative',
          message: error
        });
        console.error('Error create data:', error);

      } finally {
        Loading.hide()
      }
    },

    async loadData() {
      Loading.show()
      try {
        // const countApi = config.apiPath + `/api/${data.apiComponent}/org/${data.orgName}/action/${data.actionName}`
        const accessToken = localStorage.getItem('accessToken');


        let countData = await $fetch('/api/apiClient', {
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
            limit: 10,
            fullTextSearch: filter_menu_table.value,
            apiComponent: "IocHost",
            orgName: "default",
            actionName: "GetIocHostCount"

          })


        });
        console.log("count")

        console.log(countData)

        pagination_menu.value.rowsNumber = countData
        pagination_menu.value.page = 1

        console.log(pagination_menu.page)
        console.log('before load data')
        let data = await $fetch('/api/apiClient', {
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
            limit: 10,
            fullTextSearch: filter_menu_table.value,
            apiComponent: apiComponent,
            orgName: "default",
            actionName: "GetIocHosts"

          })


        });
        // console.log('load data')
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
        let countData = await $fetch('/api/apiClient', {
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
            limit: 10,
            fullTextSearch: filter_menu_table.value,
            cidr: "",
            zone: "",
            apiComponent: apiComponent,
            orgName: "default",
            actionName: "GetIocHostCount"

          })


        });
        console.log(page - 1)
        console.log(countData)
        pagination_menu.value.rowsNumber = countData
        pagination_menu.value.page = page
        pagination_menu.value.rowsPerPage = rowsPerPage
        console.log(pagination_menu.page)
        let data = await $fetch('/api/apiClient', {
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
            cidr: "",
            zone: "",
            apiComponent: apiComponent,
            orgName: "default",
            actionName: "GetIocHosts"

          })


        });
        console.log(data)
        console.log("loadNextData")
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
