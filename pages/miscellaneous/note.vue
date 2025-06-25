<template>
  <q-page v-if="auth.isAuthenticated">
    <q-card>

      <q-card-section class="q-pa-none q-ma-none" style="height: 100vh;">
        <div class="row">
          <div class="col-12 col-md-12 q-pa-none">
            <q-table class="my-sticky-header-table" style="height: 95vh;" flat bordered title="หมายเหตุ" color="amber"
              :rows="table_rows_menu" :columns="table_columns_menu" row-key="id" v-model:pagination="pagination_menu"
              v-model:selected="selected" selection="multiple" :rows-per-page-options="[5, 10, 15, 20, 30, 50, 0]"
              @request="loadNextData" separator="cell" :loading="loading">
              <template v-slot:top-left>
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
                <q-btn :disable="selectedTable.length <= 0" icon="delete" rounded color="negative"
                  @click="onClick(`deleteSelectedTable`)" />
              </template>

              <template v-slot:body-cell="props">
                <q-td :props="props" :class="(props.row.id % 2 === 0) ? 'bg-accent' : 'bg-white'">
                  <template v-if="props.col.name === 'description'">
                    {{ truncateText(props.value, 30) }}
                  </template>
                  <template v-else>
                    {{ props.value }}
                  </template>
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
                        @click="onClick('editNote', props.row)">
                        <q-avatar icon="edit" color="blue" text-color="white"></q-avatar>
                        <div class="text-center text-bold">{{ props.row.index }}</div>
                      </q-chip>
                    </template>

                    <template v-else-if="col.name === 'createdDate'">
                      {{ convertTimestamp(props.row.createdDate) }}
                    </template>

                    <template v-else-if="col.name === 'description'">
                      {{ truncateText(props.row[col.field], 30) }}
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
    
    <!-- Edit Dialog -->
    <q-dialog v-model="edit_note_detail_isOpen">
      <q-card style="width: 800px; max-width: 800vw;">

        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">แก้ไขข้อมูลของ ID : <q-badge outline class="text-h6" align="middle" color="positive">{{
            edit_note_detail.id }} </q-badge></div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 300px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="edit_note_detail.header" outlined label="Header" />
            <q-input class="q-pb-lg" v-model="edit_note_detail.description" outlined label="Description" 
              type="textarea" rows="4" />
            <q-input class="q-pb-lg" v-model="edit_note_detail.owner" outlined label="Owner" />
            <q-input v-model="edit_note_detail.tags" outlined label="Tags" />
          </q-item-section>
        </q-item>

        <q-card-actions align="around">
          <q-btn label="ยกเลิก" color="negative" v-close-popup />
          <q-btn flat label="บันทึก" @click="onClick('saveEditNote')" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <!-- Add Dialog -->
    <q-dialog v-model="add_note_detail_isOpen">
      <q-card style="width: 800px; max-width: 800vw;">

        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">เพิ่มข้อมูลหมายเหตุ</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-item class="q-pl-lg q-pr-lg" style="min-height: 300px;">
          <q-item-section>
            <q-input class="q-pb-lg" v-model="add_note_detail.header" outlined label="Header" />
            <q-input class="q-pb-lg" v-model="add_note_detail.description" outlined label="Description" 
              type="textarea" rows="4" />
            <q-input class="q-pb-lg" v-model="add_note_detail.owner" outlined label="Owner" />
            <q-input class="q-pb-lg" v-model="add_note_detail.tags" outlined label="Tags" />
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
  { name: 'header', align: 'left', label: 'Header', field: 'header', sortable: true },
  { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true },
  { name: 'owner', align: 'left', label: 'Owner', field: 'owner', sortable: true },
  { name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true },
  { name: 'createdDate', align: 'center', label: 'Created Date', field: 'createdDate', sortable: true },
]

const table_rows_menu = ref([])
const filter_menu_table = ref('')
const pagination_menu = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const loading = ref(true)
const edit_note_detail_isOpen = ref(false)
const edit_note_detail = ref({
  id: "",
  orgId: "default",
  header: "",
  description: "",
  owner: "",
  tags: "",
  createdDate: ""
})

const add_note_detail_isOpen = ref(false)
const add_note_detail = ref({
  orgId: "default",
  header: "",
  description: "",
  owner: "",
  tags: "",
  createdDate: ""
})

const selectedTable = ref([])
const apiComponent = "Note"

export default {
  mounted() {
    console.log('mounted')
    this.loading = false
  },
  setup() {
    const auth = useAuthStore();
    return {
      auth,
      loading,
      table_columns_menu,
      table_rows_menu,
      filter_menu_table,
      pagination_menu,
      edit_note_detail_isOpen,
      edit_note_detail,
      selectedTable,
      add_note_detail_isOpen,
      add_note_detail,
      apiComponent
    }
  },

  beforeMount() {
    definePageMeta({
      middleware: 'auth'
    })
    this.loadData();
  },

  methods: {
    async loadMenu(data) {
      try {
        console.log("load menu")
        console.log(data)
        let mockdata = [...data];
        let data_rows = mockdata
        this.selectedTable = []
        for (let index = 0; index < data_rows.length; index++) {
          this.selectedTable.push({ value: false })
          const element = data_rows[index];
          element.index = index + 1 + ((this.pagination_menu.page - 1) * this.pagination_menu.rowsPerPage);
        }
        this.table_rows_menu = data_rows;
      }
      catch (error) {
        console.error('Error fetching menu:', error);
        this.table_rows_menu = [];
      }
    },
    
    convertTimestamp(datetime) {
      return moment(datetime).format("DD/MM/YYYY");
    },

    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },

    getCurrentTimestamp() {
      const now = moment.utc();
      const ms = now.format("SSS");
      return now.format("YYYY-MM-DDTHH:mm:ss.") + ms + "000Z";
    },
    
    clearAddTable() {
      this.add_note_detail = {
        orgId: "default",
        header: "",
        description: "",
        owner: "",
        tags: "",
        createdDate: ""
      }
    },
    
    isRowSelected(row) {
      return this.selectedTable.includes(row.index)
    },

    toggleRowSelection(row, isSelected) {
      if (isSelected) {
        if (!this.selectedTable.includes(row.index)) {
          this.selectedTable.push(row.index)
        }
      } else {
        this.selectedTable = this.selectedTable.filter(id => id !== row.index)
      }
    },

    async onClick(fn_name, param = null) {
      switch (fn_name) {
        case 'tableSearch':
          this.loadData()
          break;
        case 'editNote':
          console.log(param);
          this.edit_note_detail = { ...param };
          this.edit_note_detail_isOpen = true;
          break;
        case 'saveEditNote':
          console.log('saveEditNote')
          console.log(this.edit_note_detail)
          this.updateData()
          break;
        case 'saveAddTable':
          this.add_note_detail.createdDate = this.getCurrentTimestamp()
          this.addData()
          break;
        case 'deleteSelectedTable':
          console.log(`deleteTable`)
          this.deleteSelectedRows()
          break;
        case 'addTable':
          this.clearAddTable()
          this.add_note_detail_isOpen = true
          break;
        default:
          break;
      }
    },

    async deleteSelectedRows() {
      let data = this.table_rows_menu.filter(row => this.selectedTable.includes(row.index))
      let html = data
        .map(item => `${item.index}. Header : ${item.header} , Owner : ${item.owner}`)
        .join('<br/>')

      this.$q.dialog({
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
        for (let index = 0; index < data.length; index++) {
          await this.deleteData(data[index].id)
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })

      console.log(data)
    },

    async deleteData(id) {
      this.$q.loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body = {
          id: id,
          apiComponent: this.apiComponent,
          orgName: "default",
          actionName: "DeleteNoteById",
          apiMethod: "DELETE"
        }

        console.log(body)
        let countData = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify(body)
        });
        
        this.$q.notify({
          position: "top",
          type: 'positive',
          message: 'ลบข้อมูลสำเร็จ'
        });
        this.edit_note_detail_isOpen = false;
        await this.loadData()
      } catch (error) {
        console.error('Error delete data:', error);
        this.$q.notify({
          position: "top",
          type: 'negative',
          message: 'Error delete data:' + error
        });
      } finally {
        this.$q.loading.hide()
      }
    },

    async updateData() {
      console.log('update data')
      this.$q.loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let body = { ...this.edit_note_detail }
        body['id'] = this.edit_note_detail.id
        body['apiComponent'] = this.apiComponent
        body['orgName'] = "default"
        body['actionName'] = "UpdateNoteById"

        console.log(body)
        console.log('start update')
        let countData = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify(body)
        });
        
        this.$q.notify({
          position: "top",
          type: 'positive',
          message: 'อัพเดทข้อมูลสำเร็จ'
        });
        this.edit_note_detail_isOpen = false;
        await this.loadData()
      } catch (error) {
        console.error('Error update data:', error);
        this.$q.notify({
          position: "top",
          type: 'negative',
          message: 'Error update data:' + error
        });
      } finally {
        this.$q.loading.hide()
      }
    },

    async addData() {
      console.log('add data')
      this.$q.loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');

        let body = { ...this.add_note_detail }
        body['apiComponent'] = this.apiComponent
        body['orgName'] = "default"
        body['actionName'] = "AddNote"

        console.log(body)
        console.log('start add')
        let data = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify(body)
        });

        if (data.status && data.status.toLowerCase() != "ok") {
          throw data.description
        }
        
        this.$q.notify({
          position: "top",
          type: 'positive',
          message: 'เพิ่มข้อมูลสำเร็จ'
        });
        this.add_note_detail_isOpen = false
        this.clearAddTable()
        this.loadData()
      } catch (error) {
        this.$q.notify({
          position: "top",
          type: 'negative',
          message: error
        });
        console.error('Error create data:', error);
      } finally {
        this.$q.loading.hide()
      }
    },

    async loadData() {
      this.$q.loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');

        let countData = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({
            offset: 0,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: 10,
            fullTextSearch: this.filter_menu_table,
            apiComponent: "Note",
            orgName: "default",
            actionName: "GetNoteCount"
          })
        });

        console.log("count")
        console.log(countData)

        this.pagination_menu.rowsNumber = countData
        this.pagination_menu.page = 1

        console.log(this.pagination_menu.page)
        console.log('before load data')
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
            limit: 10,
            fullTextSearch: this.filter_menu_table,
            apiComponent: this.apiComponent,
            orgName: "default",
            actionName: "GetNotes"
          })
        });
        
        console.log('load data')
        console.log(data)
        await this.loadMenu(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.$q.loading.hide()
      }
    },

    async loadNextData(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      this.$q.loading.show()
      try {
        const accessToken = localStorage.getItem('accessToken');
        let countData = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({
            offset: 0,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: 10,
            fullTextSearch: this.filter_menu_table,
            apiComponent: this.apiComponent,
            orgName: "default",
            actionName: "GetNoteCount"
          })
        });
        
        console.log(page - 1)
        console.log(countData)
        this.pagination_menu.rowsNumber = countData
        this.pagination_menu.page = page
        this.pagination_menu.rowsPerPage = rowsPerPage
        console.log(this.pagination_menu.page)
        
        let data = await $fetch('/api/apiClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify({
            offset: this.pagination_menu.page - 1,
            fromDate: "2025-05-05T17:56:35.528Z",
            toDate: "2025-05-06T17:56:35.528Z",
            limit: this.pagination_menu.rowsPerPage,
            fullTextSearch: this.filter_menu_table,
            apiComponent: this.apiComponent,
            orgName: "default",
            actionName: "GetNotes"
          })
        });
        
        console.log(data)
        console.log("loadNextData")
        await this.loadMenu(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.$q.loading.hide()
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