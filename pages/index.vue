<template>
  <!-- <div>
    <h2>Real-time Weight</h2>
    <p>{{ weight }}</p>
  </div>
  <div>
    <h1>WebSocket Example</h1>
    <button @click="open">Open WebSocket</button>
    <button @click="close">Close WebSocket</button>
  </div> -->
  <!-- <q-page> -->
  <q-card>
    <q-card-section>
      <h5 class="q-mt-none q-pt-none">หน้าหลัก</h5>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12 col-md-12 q-pa-sm" v-show="on_start_scaling > 0">
          <q-card flat bordered>
            <div class="text-h2 text-bold text-large text-center q-px-lg q-pa-md q-mx-lg bg-primary q-mt-md">
              ชั่ง :
              <q-badge class="text-h2 q-pa-sm" color="light-green">{{ currentScaler.name }}</q-badge>
            </div>
            <!-- <div class="text-h1 text-bold text-large text-right q-mr-lg">
              {{ currentScale.toFixed(3) }}
            </div> -->
            <div class="text-h1 text-bold text-large text-right q-mr-lg">
              {{ weight }}
            </div>
            <!-- <p>{{ weight }}</p> -->
            <q-item class="q-px-lg text-center">
              <q-item-section>
                <q-item-label class="text-h3 q-pa-md bg-negative"> นน. มาตรฐาน </q-item-label>
                <q-item-label class="text-h2"> {{ currentScaler.weight }} </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h3 q-pa-md bg-primary"> นน. ที่ต้องชั่ง </q-item-label>
                <q-item-label class="text-h2"> {{ (currentScaler.weight -
                  currentScaler.tolerance)
                  }}
                  - {{ (parseFloat(currentScaler.weight) + parseFloat(currentScaler.tolerance)) }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h3 q-pa-md bg-positive">นน. ชั่งจริง </q-item-label>
                <q-item-label class="text-h2"> {{ stableWeight.toFixed(4) }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
        <div class="col-12 col-md-4 q-pa-sm">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <q-table v-show="!on_start_scaling" class="my-sticky-header-table" style="height: 75vh;" flat bordered
              title="เมนู" :rows="table_rows_menu" :columns="table_columns_menu" row-key="id"
              :filter="filter_menu_table" :pagination="pagination_menu" separator="cell" :loading="loading">

              <template v-slot:top-left>
                <div class="text-h5 q-mr-md">เมนู</div>
                <q-input outlined dense debounce="300" v-model="filter_menu_table" placeholder="ค้นหา">
                  <template v-slot:append>
                    <!-- <q-icon name="ค้นหา" /> -->
                  </template>
                </q-input>
                <q-btn class="q-ml-sm" color="accent" rounded full-width @click="onClick('addMenu')">+

                </q-btn>
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

              <!-- <template v-slot:body="props">
                <q-tr :props="props" @click="handleRowClick(props.row)" class="cursor-pointer"
                  :class="(props.row.index % 2 === 0) ? 'bg-grey-10' : 'bg-grey-9'">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ props.row[col.field] }}
                  </q-td>
                </q-tr>
              </template> -->
              <template v-slot:body="props">
                <q-tr :props="props" class="cursor-pointer"
                  :class="(props.row.index % 2 === 0) ? 'bg-grey-10' : 'bg-grey-9'">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <!-- {{ props.row[col.field] }} -->

                    <template v-if="col.name === 'id'">
                      <!-- <q-icon name="edit" @click="showValue(props.row[col.field])" /> -->
                      <q-chip class="shadow-up-3" clickable rounded @click="onClick(`editMenu`, props.row)">
                        <q-avatar icon="edit" color="blue" text-color="white"></q-avatar>
                        <div class="text-center text-bold">{{ props.row.index }} </div>
                      </q-chip>
                    </template>
                    <template v-else>
                      <div @click="handleRowClick(props.row)">
                        {{ props.row[col.field] }}
                      </div>
                    </template>
                  </q-td>
                </q-tr>
              </template>

            </q-table>
          </transition>
        </div>
        <div :class="!on_start_scaling ? 'col-12 col-md-8 q-pa-sm' : 'col-12 col-md-12 q-pa-sm'">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <q-table class="my-sticky-header-table" style="height: 75vh;" flat bordered title="วัตถุดิบ"
              color="secondary" :rows="table_rows_ingredients" :columns="table_columns_ingredients" row-key="id"
              :pagination="pagination_ingredient" separator="cell" :filter="filter_ingredient_table" :loading="loading">

              <template v-slot:top-left>
                <div class="text-h5 q-mr-md">วัตถุดิบ</div>
                <q-input outlined dense debounce="300" v-model="filter_ingredient_table" placeholder="ค้นหา">
                  <template v-slot:append>
                    <!-- <q-icon name="ค้นหา" /> -->
                  </template>
                </q-input>
                <q-btn :disabled="selected_menu_id === 0" class="q-ml-sm" color="accent" rounded full-width
                  @click="onClick('addIngredient')">+

                </q-btn>
              </template>
              <template v-slot:top-right>
                <div v-show="!on_start_scaling">
                  <q-btn :disabled="selected_menu_id === 0" color="positive" push full-width
                    @click="onClick('startScaling')">เริ่มชั่ง

                  </q-btn>
                </div>
                <div v-show="on_start_scaling">
                  <q-btn color="negative" push full-width @click="onClick('stopScaling')">หยุดชั่ง

                  </q-btn>
                </div>
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
                  :class="((props.row.isChecked && on_start_scaling) ? 'bg-green q-pa-sm' : (props.row.index % 2 === 0) ? 'bg-grey-10' : 'bg-grey-9')">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <!-- {{ props.row[col.field] }} -->
                    <template v-if="col.name === 'id'">
                      <!-- <q-icon name="edit" @click="showValue(props.row[col.field])" /> -->
                      <div v-show="!on_start_scaling">
                        <q-chip class="shadow-up-3" clickable rounded @click="onClick(`editIngredient`, props.row)">
                          <div v-show="!on_start_scaling">
                            <q-avatar icon="edit" color="secondary" text-color="white"></q-avatar>
                          </div>
                        </q-chip>
                      </div>
                      <div v-show="on_start_scaling">
                        <!-- <q-checkbox size="xl" v-model="props.row.isChecked" color="positive"  /> -->
                        <q-chip class="shadow-up-3" clickable rounded @click="onClick(`editIngredient`, props.row)">
                          <div class="text-center text-bold">{{ props.row.index }} </div>
                        </q-chip>
                      </div>
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
          </transition>
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

  <q-dialog v-model="edit_menu_detail_isOpen">
    <q-card style="width: 800px; max-width: 800vw;">

      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">แก้ไขเมนู : <q-badge class="text-h5" color="primary">{{
          edit_menu_detail.name }} </q-badge></div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
        <q-item-section>
          <q-input v-model="edit_menu_detail.name" outlined label="ชื่อ" />
        </q-item-section>
        <q-item-section>
          <q-input v-model="edit_menu_detail.description" outlined label="คำอธิบาย" />
        </q-item-section>
        <q-item-section>
          <q-input type="number" v-model="edit_menu_detail.price" outlined mask="#.##" fill-mask="0" reverse-fill-mask
            label="ราคา" />
        </q-item-section>
      </q-item>

      <q-card-actions align="around">
        <q-btn label="ยกเลิก" color="negative" v-close-popup />
        <q-btn flat label="บันทึก" @click="onClick('saveEditMenu')" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="add_menu_detail_isOpen">
    <q-card style="width: 800px; max-width: 800vw;">

      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">เพิ่มเมนู </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
        <q-item-section>
          <q-input v-model="add_menu_detail.name" outlined label="ชื่อ" />
        </q-item-section>
        <q-item-section>
          <q-input v-model="add_menu_detail.description" outlined label="คำอธิบาย" />
        </q-item-section>
        <q-item-section>
          <q-input type="number" v-model="add_menu_detail.price" outlined mask="#.##" fill-mask="0" reverse-fill-mask
            label="ราคา" />
        </q-item-section>
      </q-item>

      <q-card-actions align="around">
        <q-btn label="ยกเลิก" color="negative" v-close-popup />
        <q-btn flat label="เพิ่ม" @click="onClick('saveAddMenu')" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="add_ingredient_detail_isOpen">
    <q-card style="width: 800px; max-width: 800vw;">

      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">เพิ่มวัตถุดิบ </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px;">
        <q-item-section>
          <q-input v-model="add_ingredient_detail.name" outlined label="ชื่อ" />
        </q-item-section>
        <q-item-section>
          <q-input v-model="add_ingredient_detail.description" outlined label="คำอธิบาย" />
        </q-item-section>
        <q-item-section>
          <q-input type="number" v-model="add_ingredient_detail.price" outlined mask="#.##" fill-mask="0"
            reverse-fill-mask label="ราคา" />
        </q-item-section>
      </q-item>

      <q-card-actions align="around">
        <q-btn label="ยกเลิก" color="negative" v-close-popup />
        <q-btn flat label="เพิ่ม" @click="onClick('saveAddIngredient')" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- </q-page> -->
</template>

<script>

import { fetchMenu, createMenu, updateMenu } from '~/api/menuService';
import { createIngredient, fetchIngredients, updateIngredient } from '~/api/ingredientService';
import { fetchStableWeight, getClientDriver } from '~/api/scaleService';
import { useWeightStore } from '~/stores/weight';
import { ref } from 'vue';

const weightStore = useWeightStore();
const weight = computed(() => weightStore.weight);
// const driver = useDrivertStore
// const { weight } = useWeightStore();
// console.log(weight)


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
const pagination_menu = { sortBy: 'desc', descending: false, page: 1, rowsPerPage: 10 }

const pagination_ingredient = { sortBy: 'desc', descending: false, page: 1, rowsPerPage: 10 }
const loading = ref(false)

const edit_ingredient_detail_isOpen = ref(false)
const edit_ingredient_detail = { name: "", weight: 0.00, tolerance: 0.00, }

const edit_menu_detail_isOpen = ref(false)
const edit_menu_detail = { name: "", description: "", price: 0 }

const add_menu_detail_isOpen = ref(false)
const add_menu_detail = ref({})

const add_ingredient_detail_isOpen = ref(false)
const add_ingredient_detail = ref({})

const initMenu = { name: "", description: "", price: 0 }
const initIngredient = { name: "", weight: 0.00, tolerance: 0.00, }

const selected_menu_id = ref(0.00)
const on_start_scaling = ref(false)

const currentScale = ref(0.00)
const stableWeight = ref(0.00)

const currentScaler = { name: "", weight: 0.00, tolerance: 0.00 }

// const { $websocket } = useNuxtApp();



// onUnmounted(() => {
//   disconnectWebSocket();  // Ensure WebSocket is closed when component unmounts
// });

export default {

  data() {
    return {
      menus: [],
      isAddMenuDialogOpen: false,
      newMenuName: '',
      newIngredients: [
        { name: '', weight: 0.00, tolerance: 0.00 }
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
      edit_ingredient_detail,
      edit_menu_detail_isOpen,
      edit_menu_detail,

      add_menu_detail_isOpen,
      add_menu_detail,
      add_ingredient_detail_isOpen,
      add_ingredient_detail,

      initMenu,
      initIngredient,

      selected_menu_id,
      on_start_scaling,

      currentScale,
      stableWeight,
      currentScaler,
      scaleChecked: [],
      weight,



      // driver



      // rowsNumber: xx if getting data from a server
    };
  },

  async mounted() {
    console.log('load menu');
    await this.loadMenu();
    // this.loadDriver()
  },
  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
  },
  beforeUnmount() {
    closeWSS()
  },


  methods: {
    openWSS() {
      this.$websocket.openWebSocket();
    },
    closeWSS() {
      this.$websocket.closeWebSocket();
    },

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
    // async loadDriver() {
    //   try {
    //     console.log('get driver')
    //     let driver = await getClientDriver();
    //     console.log(driver)
    //     // useDrivertStore.setDriver(driver)
    //     // console.log(useDrivertStore.driver)
    //     // console.log(weight)
    //     // this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
    //     // this.setScaleColor("secondary") 
    //   } catch (error) {
    //     console.error('Error deleting ingredient:', error);
    //   }
    // },
    handleRowClick(props) {
      console.log(props.id);
      this.selected_menu_id = props.id
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
      this.newIngredients.push({ name: '', weight: 0.00, tolerance: '' });
    },
    callApiIngredients(menuId) {
      this.$router.push({ path: '/ingredient', query: { menu_id: menuId } });
    },
    onClick(fn_name, param = null) {

      console.log('call fn:' + fn_name)

      switch (fn_name) {

        case 'editMenu':
          console.log(param);
          this.edit_menu_detail = param;
          this.edit_menu_detail_isOpen = true;
          // edit_ingredient_detail 
          break;
        case 'editIngredient':
          console.log(param);
          this.edit_ingredient_detail = param;
          this.edit_ingredient_detail_isOpen = true;
          // edit_ingredient_detail 
          break;
        case 'addMenu':
          // this.add_menu_detail.value = null
          // this.add_menu_detail = this.initMenu;
          // this.add_menu_detail_isOpen = true;

          break;
        case 'addIngredient':
          // this.add_ingredient_detail = null
          // this.add_ingredient_detail = this.initIngredient;
          // this.add_ingredient_detail_isOpen = true;

          break;

        case 'saveEditIngredient':
          this.fn_updateIngredient(this.edit_ingredient_detail.id, this.edit_ingredient_detail)
          break;
        case 'saveEditMenu':
          this.fn_updateMenu(this.edit_menu_detail.id, this.edit_menu_detail)
          break;
        case 'saveAddIngredient':
          this.fn_createIngredient(this.edit_ingredient_detail.id, this.edit_ingredient_detail)
          break;
        case 'saveAddMenu':
          this.fn_createMenu(this.edit_menu_detail.id, this.edit_menu_detail)
          break;
        case 'startScaling':
          this.openWSS()
          console.log(table_rows_ingredients.value)

          if (table_rows_ingredients.value.length > 0) {
            console.log(table_rows_ingredients.value[0])
            this.currentScaler = table_rows_ingredients.value[0]
          }
          this.on_start_scaling = true
          this.startCheckScale()
          break;
        case 'stopScaling':
          this.closeWSS()
          this.on_start_scaling = false
          this.stopCheckScale()
          break;

        default:
          break;
      }
    },
    async fn_updateIngredient(id, data) {
      const resData = await updateIngredient(id, data);
      console.log(resData)

    },
    async fn_updateMenu(id, data) {
      const resData = await updateMenu(id, data);
      // await this.loadMenu()
      console.log(resData)

    },
    async fn_createMenu(id, data) {
      const resData = await createMenu(data);
      // await this.loadMenu()
      console.log(resData)

    }
    ,
    async fn_createMenu(id, data) {
      const resData = await createIngredient(data);
      // await this.loadMenu()
      console.log(resData)

    },

    isWithinTolerance(weight, tolerance) {
      return this.currentScale >= weight - tolerance && this.currentScale <= weight + tolerance;
    },
    stopCheckScale() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.message = 'Loop stopped.';
    },
    updateIsCheck() {
      let shouldCheckNext = true; // Flag to check the next element

      for (let i = 0; i < this.table_rows_ingredients.length; i++) {
        const { weight, tolerance } = this.table_rows_ingredients[i];
        console.log(weight)

        if (shouldCheckNext && this.isWithinTolerance(weight, tolerance)) {
          this.table_rows_ingredients[i].isChecked = true;
          console.log('asd')

        }

        // Set the flag to check the next element only if the current element's isCheck is true
        shouldCheckNext = this.table_rows_ingredients[i].isChecked;

      }

      // Check if all elements have isCheck set to true
      if (this.table_rows_ingredients.every(item => item.isChecked)) {
        Notify.create({
          type: "Success",
          position: "top",
          color: "green",
          message: "ทำรายการสำเร็จ",
          actions: [
            { icon: 'close', color: 'grey', round: true, }
          ]

        });
        this.stopCheckScale();
        this.message = 'All items checked. Interval stopped.';
      } else {
        this.message = `Checked at ${new Date().toLocaleTimeString()}`;
      }
    },
    async startCheckScale() {
      let counter = 0
      let weightTmp = [0, 0, 0, 0]
      this.scaleChecked = {}
      let success_position = 0
      let loop_counter = 0
      for (const item of this.table_rows_ingredients) {
        item["isChecked"] = false
      }

      if (this.intervalId) return; // Prevent multiple intervals

      // await this.getStableWeight()

      this.intervalId = setInterval(() => {
        console.log('check scale')

        this.currentStableWeight();
        this.updateIsCheck();


      }, 500);
    },
    async getStableWeight() {
      // if (this.intervalId) return; // Prevent multiple intervals

      setInterval(() => {
        // console.log('get weight')
        this.currentStableWeight();
        // this.setScaleColor("negative")
      }, 500);


    },
    async currentStableWeight() {
      try {
        console.log('get weight')
        this.currentScale = await fetchStableWeight();
        console.log(this.currentScale)
        // console.log(weight)
        // this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
        // this.setScaleColor("secondary") 
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    },
    updateIsCheck() {
      let shouldCheckNext = true; // Flag to check the next element
      console.log('update checker')
      for (let i = 0; i < this.table_rows_ingredients.length; i++) {
        // console.log('in loop')
        const { weight, tolerance } = this.table_rows_ingredients[i];
        // console.log(weight)

        if (shouldCheckNext && this.isWithinTolerance(weight, tolerance)) {
          this.table_rows_ingredients[i].isChecked = true;
          if (i+1 < this.table_rows_ingredients.length) {
            // console.log('asds')
            try {
              this.currentScaler = this.table_rows_ingredients[i + 1]
              console.log(this.table_rows_ingredients[i + 1])
            } catch (error) {
              console.log(error)
            }

          }
        }

        // Set the flag to check the next element only if the current element's isCheck is true
        shouldCheckNext = this.table_rows_ingredients[i].isChecked;
      }

      // Check if all elements have isCheck set to true
      if (this.table_rows_ingredients.every(item => item.isChecked)) {
        Notify.create({
          type: "Success",
          position: "top",
          color: "green",
          message: "ทำรายการสำเร็จ",
          actions: [
            { icon: 'close', color: 'grey', round: true, }
          ]

        });
        this.stopCheckScale();
        this.message = 'All items checked. Interval stopped.';
      } else {
        this.message = `Checked at ${new Date().toLocaleTimeString()}`;
      }
    },
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
