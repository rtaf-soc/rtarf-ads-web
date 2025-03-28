<template>
  <q-page>
    <q-card>
      <q-card-section class="q-pb-none">
        <h5 class="q-pa-none q-ma-none">
          หน้าหลัก</h5>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-4 q-pa-sm">
            <q-table class="my-sticky-header-table" style="height: 75vh;" flat bordered title="เมนู"
              :rows="table_rows_menu" :columns="table_columns_menu" row-key="id" :filter="filter_menu_table"
              :pagination="pagination_menu" separator="cell" :loading="loading">
              <template v-slot:top-left>
                <div class="text-h5 q-mr-md">เมนู</div>
                <q-input outlined dense debounce="300" v-model="filter_menu_table" placeholder="ค้นหา">
                  <template v-slot:append>
                    <!-- <q-icon name="ค้นหา" /> -->
                  </template>
                </q-input>
              </template>
              <!-- <template v-slot:top>
                <q-btn color="primary" :disable="loading" label="Add row" />
                <q-btn v-if="table_rows_menu.length !== 0" class="q-ml-sm" color="primary" :disable="loading"
                  label="Remove row" />
                <q-space />
                <q-input borderless dense debounce="300" color="primary" v-model="filter_menu_table">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template> -->
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
                <q-tr :props="props" @click="handleRowClick(props.row)" class="cursor-pointer"
                  :class="(props.row.index % 2 === 0) ? 'bg-grey-10' : 'bg-grey-9'">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ props.row[col.field] }}
                  </q-td>
                </q-tr>
              </template>

            </q-table>
          </div>
          <div class="col-12 col-md-8 q-pa-sm">
            <q-table class="my-sticky-header-table" style="height: 75vh;" flat bordered title="วัตถุดิบ"
              :rows="table_rows_ingredients" :columns="table_columns_ingredients" row-key="id"
              :pagination="pagination_ingredient" separator="cell" :filter="filter_ingredient_table" :loading="loading">
              <template v-slot:top-left>
                <div class="text-h5 q-mr-md">วัตถุดิบ</div>
                <q-input outlined dense debounce="300" v-model="filter_ingredient_table" placeholder="ค้นหา">
                  <template v-slot:append>
                    <!-- <q-icon name="ค้นหา" /> -->
                  </template>
                </q-input>
              </template>
              <template v-slot:top-right>
                <q-btn color="positive" push full-width>เริ่มชั่ง

                </q-btn>
              </template>
              <!-- <template v-slot:top>
                <q-btn color="primary" :disable="loading" label="Add row" />
                <q-btn v-if="table_rows_ingredients.length !== 0" class="q-ml-sm" color="primary" :disable="loading"
                  label="Remove row" />
                <q-space />
                <q-input borderless dense debounce="300" color="primary" v-model="filter_ingredient_table">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template> -->
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
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <!-- {{ props.row[col.field] }} -->
                    <template v-if="col.name === 'id'">
                      <!-- <q-icon name="edit" @click="showValue(props.row[col.field])" /> -->
                      <q-chip class="shadow-up-3" clickable rounded @click="onClick(`editIngredient`, props.row)">
                        <q-avatar icon="edit" color="blue" text-color="white"></q-avatar>
                        <div class="text-center text-bold">{{ props.row.index }} </div>
                      </q-chip>
                    </template>
                    <template v-else>
                      {{ props.row[col.field] }}
                    </template>
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:body-cell-id="props">
                <q-td :props="props">
                  <q-chip class="shadow-up-3" clickable rounded @click="onClick(`editIngredient`, props.row)">
                    <q-avatar icon="edit" color="blue" text-color="white"></q-avatar>
                    <div class="text-center text-bold">{{ props.row.index }} </div>
                  </q-chip>
                </q-td>
              </template>

            </q-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="edit_ingredient_detail_isOpen">
      <q-card style="width: 800px; max-width: 800vw;">

        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">แก้ไขข้อมูลของ : <q-badge class="text-h5" color="primary">{{
            edit_ingredient_detail.name }} </q-badge></div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
          <q-item-section>
            <q-input v-model="edit_ingredient_detail.name" outlined label="ชื่อ" />
          </q-item-section>
          <q-item-section>
            <q-input type="number" v-model="edit_ingredient_detail.weight" outlined label="น้ำหนัก" />
          </q-item-section>
          <q-item-section>
            <q-input type="number" v-model="edit_ingredient_detail.tolerance" outlined mask="#.##" fill-mask="0"
              reverse-fill-mask label="ค่าความคลาดเคลื่อน" />
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

import { fetchMenu, createMenu } from '~/api/menuService';
import { createIngredient, fetchIngredients, updateIngredient } from '~/api/ingredientService';

const table_columns_menu = [

  { name: 'id', align: 'center', label: 'ลำดับที่', field: 'index', headerStyle: 'width: 30px' },
  { name: 'name', label: 'ชื่อ', align: 'left', field: 'name', sortable: true },
  { name: 'price', align: 'left', label: 'ราคา', field: 'price', sortable: true, },
  { name: 'description', align: 'left', label: 'คำอธิบาย', field: 'description', sortable: true, },

]
const table_columns_ingredients = [
  // { name: 'index', label: 'ลำดับที่', align: 'center', field: 'index', sortable: true, headerStyle: 'width: 5px', style: "max-width: 5px" },

  { name: 'id', align: 'center', label: 'ลำดับที่', field: 'index', headerStyle: 'width: 30px' },
  { name: 'name', label: 'ชื่อ', align: 'left', field: 'name', sortable: true },
  { name: 'weight', align: 'center', label: 'น้ำหนัก', field: 'weight', sortable: true, },
  { name: 'tolerance', align: 'center', label: 'ความคลาดเคลื่อน', field: 'tolerance', sortable: true, },

  // { name: 'lastname', align: 'left', label: 'นามสกุล', field: 'lastname', sortable: true, },
  // { name: 'active', align: 'center', label: 'สถานะ', field: 'active', sortable: true, headerStyle: 'width: 30px' },
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
      visible_ingredient_columns: ref(['index', 'name', 'weight', 'tolerance']),
      table_columns_menu,
      table_columns_ingredients,
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

  async onMounted() {
    console.log('load menu');
    await this.loadMenu();
  },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
  },
  methods: {
    async loadMenu() {
      try {
        const data = await fetchMenu();
        this.menus = data.data;
        console.log(this.menus);
        let data_rows = data.data;
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
      this.loadIngredients(props.id);
    },
    async loadIngredients(menuId) {
      try {
        const data = await fetchIngredients(menuId);
        // this.ingredients = data.data;
        // console.log(data)
        // this.table_rows_ingredients = data.data
        let data_rows = data.data;
        for (let index = 0; index < data_rows.length; index++) {
          const element = data_rows[index];
          element.index = index + 1;
        }
        // console.log(data_rows)
        this.table_rows_ingredients = data_rows;
        // console.log(this.table_rows_ingredients)
      }
      catch (error) {
        console.error('Error fetching ingredients:', error);
        // this.ingredients = [];
      }
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
      this.$router.push({ path: '/ingredient', query: { menu_id: menuId } });
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
        // const data = updateIngredient(this.edit_ingredient_detail.id, this.edit_ingredient_detail);

        default:
          break;
      }
    },
    async fn_updateIngredient(id, data) {
      const resData = await updateIngredient(id, data);
      console.log(resData)

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




