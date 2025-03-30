<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section class="q-pb-none">
        <h5 class="q-pa-none q-ma-none">Domain Blacklist</h5>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-12 q-pa-sm">
            <q-table class="my-sticky-header-table" style="height: 87vh;" flat bordered title="เมนู"
              :rows="table_rows_menu" :columns="table_columns_menu" row-key="id" :pagination="pagination_menu"
              separator="cell" :loading="loading">
              <template v-slot:top-left>
                <div class="text-h5 q-mr-md">Black list IP Address</div>
                <q-input outlined dense debounce="300" placeholder="ค้นหา" v-model="filter_menu_table" bg-color="dark">
                  <template v-slot:append>
                    <q-btn round dense flat icon="search" @click="onClick(`tableSearch`)" />
                  </template>
                </q-input>
              </template>
              <template v-slot:top-right>
                <q-btn class="q-mr-lg" icon="add" rounded color="green-7"
                  @click="this.add_ingredient_detail_isOpen = true" />
                <q-btn :disable="selectedTable <= 0" icon="delete" rounded color="negative" @click="onClick(`deleteSelectedTable`)"/>
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
          <div class="text-h6">แก้ไขข้อมูลของ ID : <q-badge outline class="text-h6" align="middle" color="negative">{{
            edit_ingredient_detail.blacklistId }} </q-badge></div>

          <!-- <div class="text-h7 q-mt-sm">Source IP Address : <q-badge class="text-h5" color="primary">{{
            edit_ingredient_detail.blacklistCode }} </q-badge></div> -->
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="edit_ingredient_detail.blacklistCode" outlined label="Source IP" />
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
          <div class="text-h6">เพิ่มข้อมููล </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="add_ingredient_detail.blacklistCode" outlined label="Domain" />
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
  // { name: 'blacklistId', label: 'ชื่อ', align: 'left', field: 'blacklistId', sortable: true },
  { name: 'blacklistCode', align: 'left', label: 'Domain', field: 'blacklistCode', sortable: true, },
  // { name: 'orgId', align: 'center', label: 'รหัสสถานที่', field: 'orgId', sortable: true, },
  { name: 'tags', align: 'left', label: 'tags', field: 'tags', sortable: true, },
  // { name: 'blacklistType', align: 'center', label: 'type', field: 'blacklistType', sortable: true, },

  { name: 'createdDate', align: 'center', label: 'สร้างเมื่อ', field: 'createdDate', sortable: true, },

]


const mock_data = [
  {
    "blacklistId": "8d2b7f6c-49a9-43db-86fa-ff123c8e5e77",
    "orgId": "default",
    "blacklistCode": "192.168.1.1",
    "tags": "Automatic-Scan",
    "blacklistType": 1,
    "createdDate": "2024-10-12T09:24:30.125001Z"
  },
  {
    "blacklistId": "5e9d4c2d-58f3-4f8f-b59a-b51d7e2f5b29",
    "orgId": "branch1",
    "blacklistCode": "203.0.113.5",
    "tags": "Manual-Import",
    "blacklistType": 2,
    "createdDate": "2024-10-11T15:37:19.678005Z"
  },
  {
    "blacklistId": "a673f3a1-bb82-4a94-b3d6-ead99b43b9a2",
    "orgId": "default",
    "blacklistCode": "172.16.254.3",
    "tags": "Security-Alert",
    "blacklistType": 2,
    "createdDate": "2024-10-13T14:48:22.345987Z"
  },
  {
    "blacklistId": "f1c9a58d-3f84-4ea8-bf3c-4b6f7e78d2c0",
    "orgId": "branch2",
    "blacklistCode": "198.51.100.14",
    "tags": "Automatic-Scan",
    "blacklistType": 1,
    "createdDate": "2024-10-13T16:54:11.912340Z"
  },
  {
    "blacklistId": "d57f82d1-7b8a-48f4-a1d7-cd49e7c2e9a1",
    "orgId": "default",
    "blacklistCode": "185.224.128.141",
    "tags": "Manual-Import",
    "blacklistType": 2,
    "createdDate": "2024-10-13T11:54:46.325011Z"
  },
  {
    "blacklistId": "3c1d1b2e-8eaf-4b82-bf7f-8e5ed7c9fd2e",
    "orgId": "branch3",
    "blacklistCode": "203.0.113.22",
    "tags": "Security-Alert",
    "blacklistType": 1,
    "createdDate": "2024-10-10T10:10:10.101010Z"
  },
  {
    "blacklistId": "95a1f8b7-3a5e-41cd-a6c1-23bc678abc4d",
    "orgId": "default",
    "blacklistCode": "10.0.0.2",
    "tags": "Manual-Import",
    "blacklistType": 1,
    "createdDate": "2024-10-14T05:00:33.123456Z"
  },
  {
    "blacklistId": "6c3db8f9-a2d8-4e15-983b-bf31a2e0b123",
    "orgId": "branch1",
    "blacklistCode": "192.0.2.34",
    "tags": "Automatic-Scan",
    "blacklistType": 2,
    "createdDate": "2024-10-13T08:30:55.445678Z"
  },
  {
    "blacklistId": "0e3f4a58-8f24-4c59-b2f7-948adf5ec879",
    "orgId": "branch2",
    "blacklistCode": "172.16.0.8",
    "tags": "Security-Alert",
    "blacklistType": 1,
    "createdDate": "2024-10-13T17:21:43.563432Z"
  },
  {
    "blacklistId": "bcf9a61d-e287-4e99-b389-294b582ca4a2",
    "orgId": "default",
    "blacklistCode": "10.10.10.10",
    "tags": "Manual-Import",
    "blacklistType": 2,
    "createdDate": "2024-10-13T13:47:12.876123Z"
  }
]

const table_rows_menu = ref([])
const table_rows_ingredients = ref([])
const filter_menu_table = ref('')
const filter_ingredient_table = ref('')
const pagination_menu = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
}

const pagination_ingredient = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
}
const loading = ref(true)
const edit_ingredient_detail_isOpen = ref(false)
const edit_ingredient_detail = {
  name: "",
  weight: "",
  tolerance: 0,

}
const add_ingredient_detail_isOpen = ref(false)
const add_ingredient_detail = {
  blacklistId: "zxcvzxcv",
  orgId: "default",
  blacklistCode: "",
  tags: "",
  blacklistType: 2,
  createdDate: "2024-10-12T09:24:30.125001Z"

}

// "blacklistId": "8d2b7f6c-49a9-43db-86fa-ff123c8e5e77",
//   "orgId": "default",
//     "blacklistCode": "192.168.1.1",
//       "tags": "Automatic-Scan",
//         "blacklistType": 1,
//           "createdDate": "2024-10-12T09:24:30.125001Z"

const selectedTable = ref([])

// Loading.show()

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
      add_ingredient_detail
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
    // console.log('load menu');
    // await this.loadMenu();
  },
  beforeMount() {
    // console.log('beformount')
    definePageMeta({
      middleware: 'auth'
    })
    this.loadMenu();
  },
  // onMounted() {
  //   loadMenu()
  //   // Loading.hide()
  // },
  methods: {
    async loadMenu() {
      try {
        // const data = await fetchMenu();
        let mockdata = mock_data.filter(item => item.blacklistType === 2);

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
        blacklistId: "zxcvzxcv",
        orgId: "default",
        blacklistCode: "",
        tags: "",
        blacklistType: 2,
        createdDate: "2024-10-12T09:24:30.125001Z"

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
    deleteSelectedRows() {
      // Filter out rows that have been selected
      table_rows_menu.value = table_rows_menu.value.filter(row => !selectedTable.value.includes(row.index))
      // Clear the selection after deletion
      selectedTable.value = []
    },

    onClick(fn_name, param = null) {
      switch (fn_name) {
        case 'tableSearch':
          if (this.filter_menu_table.trim().length > 0) {
            console.log(`have search text ${this.filter_menu_table}`)
          } else {
            console.log(`no search test`)
          }
          // edit_ingredient_detail 
          break;
        case 'editIngredient':
          console.log(param);
          this.edit_ingredient_detail = param;
          this.edit_ingredient_detail_isOpen = true;

          // edit_ingredient_detail 
          break;
        case 'saveEditIngredient':
          console.log('saveEditIngredient')
          console.log(this.edit_ingredient_detail)
          this.fn_updateIngredient(this.edit_ingredient_detail.id, this.edit_ingredient_detail)
          Notify.create({
            position: "top",
            type: 'positive',
            message: 'บันทึกสำเร็จ'
          });
          this.edit_ingredient_detail_isOpen = false;
          break;
        // const data = updateIngredient(this.edit_ingredient_detail.id, this.edit_ingredient_detail);
        case 'saveAddTable':
          this.add_ingredient_detail.createdDate = this.getCurrentTimestamp()
          mock_data.push(this.add_ingredient_detail)
          this.loadMenu()
          this.clearAddTable()
          this.add_ingredient_detail_isOpen = false
          break;

        case 'deleteSelectedTable':
          console.log(`deleteTable`)
          this.deleteSelectedRows()
          break;

        default:
          break;
      }
    },
    async fn_updateIngredient(id, data) {
      // const resData = await updateIngredient(id, data);
      // console.log(resData)

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
