<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>
      <q-card-section class="q-pb-none">
        <h5 class="q-pa-none q-ma-none">
          Destination IP</h5>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
        <div class="row">
          <div class="col-12 col-md-12 q-pa-none">
            <q-table class="my-sticky-header-table" style="height: 75vh;" flat bordered title="เมนู"
              :rows="table_rows_menu" :columns="table_columns_menu" row-key="id" :filter="filter_menu_table"
              :pagination="pagination_menu" separator="cell" :loading="loading">
              <template v-slot:top-left>
                <div class="text-h5 q-mr-md">Black list IP Address</div>
                <q-input outlined dense debounce="300" v-model="filter_menu_table" placeholder="ค้นหา">
                  <template v-slot:append>
                    <!-- <q-icon name="ค้นหา" /> -->
                  </template>
                </q-input>
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
                <!-- <q-tr :props="props" @click="handleRowClick(props.row)" class="cursor-pointer"
                  :class="(props.row.index % 2 === 0) ? 'bg-grey-10' : 'bg-grey-9'">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ props.row[col.field] }}
                  </q-td>
                </q-tr> -->

                <q-tr :props="props" class="cursor-pointer"
                  :class="(props.row.index % 2 === 0) ? 'bg-grey-10' : 'bg-grey-9'">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <!-- {{ props.row[col.field] }} -->
                    <template v-if="col.name === 'tags'">
                      <!-- <q-icon name="edit" @click="showValue(props.row[col.field])" /> -->
                      <q-chip class="shadow-up-3" clickable rounded @click="onClick(`editIngredient`, props.row)">
                        <q-avatar icon="edit" color="blue" text-color="white"></q-avatar>
                        <div class="text-center text-bold">{{ props.row.tags }} </div>
                      </q-chip>
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
          <div class="text-h6">แก้ไขข้อมูลของ ID : <q-badge class="text-h5" color="primary">{{
            edit_ingredient_detail.blacklistId }} </q-badge></div>

          <div class="text-h7 q-mt-sm">IP Address : <q-badge class="text-h5" color="primary">{{
            edit_ingredient_detail.blacklistCode }} </q-badge></div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input v-model="edit_ingredient_detail.tags" outlined label="tags" />
          </q-item-section>
        </q-item>

        <q-card-actions align="around">
          <q-btn label="ยกเลิก" color="negative" v-close-popup />
          <q-btn flat label="บันทึก" @click="onClick('saveEditIngredient')" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment';

import { fetchMenu, createMenu } from '~/api/menuService';
import { createIngredient, fetchIngredients, updateIngredient } from '~/api/ingredientService';
// Loading.show()
const table_columns_menu = [

  { name: 'id', align: 'center', label: 'ลำดับที่', field: 'index', headerStyle: 'width: 30px' },
  { name: 'blacklistId', label: 'ชื่อ', align: 'left', field: 'blacklistId', sortable: true },
  { name: 'blacklistCode', align: 'center', label: 'ip_address', field: 'blacklistCode', sortable: true, },
  { name: 'orgId', align: 'center', label: 'รหัสสถานที่', field: 'orgId', sortable: true, },
  { name: 'tags', align: 'center', label: 'tags', field: 'tags', sortable: true, },
  // { name: 'blacklistType', align: 'center', label: 'type', field: 'blacklistType', sortable: true, },
  // { name: 'createdDate', align: 'center', label: 'สร้างเมื่อ', field: 'createdDate', sortable: true, },
  { name: 'createdDate', align: 'center', label: 'วันที่เก็บข้อมูล', field: 'createdDate', format: (val, row) => this.convertTimestamp(val), sortable: true },
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
const loading = ref(false)
const edit_ingredient_detail_isOpen = ref(false)
const edit_ingredient_detail = {
  name: "",
  weight: "",
  tolerance: 0,

}


export default {
  setup() {
    onMounted(() => {
      // Loading.hide()
      // await this.loadMenu();
    })
    const auth = useAuthStore();
    return {
      auth
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
      edit_ingredient_detail
      // rowsNumber: xx if getting data from a server
    };
  },

  convertTimestamp(datetime) {
    let dbtime = moment(datetime);
    let formattedDate = dbtime.format("DD-MM-YYYY");
    return formattedDate // Output: 26-12-2023
  },

  // async onMounted() {
  // Loading.hide()

  // },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
    this.loadMenu();
  },
  methods: {
    async loadMenu() {
      try {
        // const data = await fetchMenu();
        let mockdata = mock_data.filter(item => item.blacklistType === 1);

        // console.log(filteredData);
        this.menus = mockdata;
        console.log(this.menus);
        let data_rows = mockdata
        for (let index = 0; index < data_rows.length; index++) {
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
    handleRowClick(props) {
      console.log(props.id);
      // this.loadIngredients(props.id);
    },
    convertTimestamp(datetime) {
      let dbtime = moment(datetime);
      let formattedDate = dbtime.format("DD-MM-YYYY");
      return formattedDate // Output: 26-12-2023
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
    onClick(fn_name, param = null) {
      switch (fn_name) {
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
        // const data = updateIngredient(this.edit_ingredient_detail.id, this.edit_ingredient_detail);

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
