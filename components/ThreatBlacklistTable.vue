<template>
    <q-page v-if="auth.isAuthenticated">
        <q-table
            class="my-sticky-header-table"
            style="height: calc(100vh - 50px)"
            flat
            bordered
            title="เมนู"
            color="amber"
            :rows="table_rows_menu"
            :columns="table_columns_menu"
            row-key="blacklistId"
            v-model:pagination="pagination_menu"
            selection="multiple"
            :rows-per-page-options="[5, 10, 15, 20, 30, 50, 0]"
            @request="loadNextData"
            separator="cell"
            :loading="loading"
        >
            <!-- top-left slot -->
            <template #top-left>
                <q-input
                    outlined
                    dense
                    debounce="300"
                    placeholder="ค้นหา"
                    v-model="filter_menu_table"
                    bg-color="dark"
                    @keyup.enter="onClick('tableSearch')"
                >
                    <template #append>
                        <q-btn
                            round
                            dense
                            flat
                            icon="search"
                            @click="onClick('tableSearch')"
                        />
                    </template>
                </q-input>
                <q-badge
                    class="q-ml-md text-bold q-pa-sm"
                    align="middle"
                    color="dark"
                    style="font-size: 20px"
                >
                    ข้อมูลทั้งหมด :
                    {{ pagination_menu.rowsNumber.toLocaleString("en-US") }}
                </q-badge>
            </template>

            <!-- top-right slot -->
            <template #top-right>
                <q-btn
                    class="q-mr-lg"
                    icon="add"
                    rounded
                    color="green-7"
                    @click="onClick('addTable')"
                />
                <q-btn
                    :disable="selectedTable.length === 0"
                    icon="delete"
                    rounded
                    color="negative"
                    @click="onClick('deleteSelectedTable')"
                />
            </template>

            <!-- default header -->
            <template #header="props">
                <q-tr :props="props">
                    <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        class="text-bold"
                        style="font-size: medium"
                    >
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>

            <!-- body cell fallback -->
            <template #body-cell="props">
                <q-td
                    :props="props"
                    :class="
                        props.row.index % 2 === 0 ? 'bg-grey-1' : 'bg-white'
                    "
                >
                    {{ props.value }}
                </q-td>
            </template>

            <!-- full body override so we can render checkboxes and edit chips -->
            <template #body="props">
                <q-tr
                    :props="props"
                    class="cursor-pointer"
                    :class="
                        props.row.index % 2 === 0 ? 'bg-grey-10' : 'bg-grey-9'
                    "
                >
                    <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                    >
                        <template v-if="col.name === 'id'">
                            <q-checkbox
                                :model-value="
                                    selectedTable.includes(props.row.index)
                                "
                                @update:model-value="
                                    (val) => toggleRowSelection(props.row, val)
                                "
                            />
                            <q-chip
                                class="shadow-up-3 q-pr-sm"
                                clickable
                                rounded
                                @click="onClick('editIngredient', props.row)"
                            >
                                <q-avatar
                                    icon="edit"
                                    color="blue"
                                    text-color="white"
                                />
                                <div class="text-center text-bold">
                                    {{ props.row.index }}
                                </div>
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
        <!-- Edit Dialog -->
        <q-dialog v-model="edit_ingredient_detail_isOpen">
            <q-card style="width: 800px; max-width: 800vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">
                        แก้ไขข้อมูลของ ID :
                        <q-badge
                            outline
                            class="text-h6 q-ml-md"
                            align="middle"
                            color="positive"
                        >
                            {{ edit_ingredient_detail.blacklistId }}
                        </q-badge>
                    </div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px">
                    <q-item-section>
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_ingredient_detail.blacklistCode"
                            outlined
                            :label="fieldLabel"
                        />
                        <q-input
                            v-model="edit_ingredient_detail.tags"
                            outlined
                            label="tags"
                        />
                    </q-item-section>
                </q-item>

                <q-card-actions align="around">
                    <q-btn label="ยกเลิก" color="negative" v-close-popup />
                    <q-btn
                        flat
                        label="บันทึก"
                        @click="onClick('saveEditIngredient')"
                        color="primary"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Add Dialog -->
        <q-dialog v-model="add_ingredient_detail_isOpen" @show="onDialogShow">
            <q-card style="width: 800px; max-width: 800vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">เพิ่มข้อมูล</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px">
                    <q-item-section>
                        <q-input
                            class="q-pb-lg"
                            v-model="add_ingredient_detail.blacklistCode"
                            outlined
                            :label="fieldLabel"
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="add_ingredient_detail.tags"
                            outlined
                            label="tags"
                        />
                    </q-item-section>
                </q-item>

                <q-card-actions align="around">
                    <q-btn label="ยกเลิก" color="negative" v-close-popup />
                    <q-btn
                        flat
                        label="บันทึก"
                        @click="onClick('saveAddTable')"
                        color="primary"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
// — imports & setup
import { ref, onMounted, computed } from "vue";
import moment from "moment";
import { useAuthStore } from "~/stores/auth";
import { Dialog, Notify, Loading } from "quasar";
import { definePageMeta } from "#imports";

// 1️⃣ declare prop to make this reusable
const props = defineProps({
    blacklistType: { type: Number, required: true },
});

// 2️⃣ protect with auth middleware
definePageMeta({ middleware: "auth" });

// — dynamic field label based on blacklist type
const fieldLabel = computed(() => {
    switch (props.blacklistType) {
        case 1:
            return "Source IP";
        case 2:
            return "Destination IP";
        case 3:
            return "Domain";
        case 4:
            return "SHA256";
        default:
            return "Blacklist Code";
    }
});

// — state & config (exactly as before)
const auth = useAuthStore();
const table_columns_menu = computed(() => [
    {
        name: "id",
        align: "center",
        label: "Action",
        field: "index",
        headerStyle: "width: 30px",
    },
    {
        name: "blacklistCode",
        align: "left",
        label: fieldLabel.value,
        field: "blacklistCode",
        sortable: true,
    },
    {
        name: "tags",
        align: "left",
        label: "tags",
        field: "tags",
        sortable: true,
    },
    {
        name: "createdDate",
        align: "center",
        label: "Created Date",
        field: "createdDate",
        sortable: true,
    },
]);
const apiComponent = "Blacklist";
const selectedTable = ref([]);
const monacoEditor = ref(null);
const showEditor = ref(false);
const editorOptions = { automaticLayout: true, theme: "vs-dark" };
const filter_menu_table = ref("");
const pagination_menu = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
});
const pagination_ingredient = {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 10,
};
const loading = ref(true);
const table_rows_menu = ref([]);
const edit_ingredient_detail_isOpen = ref(false);
const edit_ingredient_detail = ref({
    blacklistId: "",
    orgId: "default",
    blacklistCode: "",
    tags: "",
    blacklistType: props.blacklistType,
    createdDate: "2024-10-12T09:24:30.125001Z",
});
const add_ingredient_detail_isOpen = ref(false);
const add_ingredient_detail = ref({
    orgId: "default",
    blacklistCode: "",
    tags: "",
    blacklistType: props.blacklistType,
    createdDate: "2024-10-12T09:24:30.125001Z",
});

// — lifecycle: load on mount
onMounted(async () => {
    loading.value = false;
    console.log(props.refType);
    await loadData();
});

// — methods (kept exactly as you had, just swapped `this.` → refs)
function convertTimestamp(dt) {
    return moment(dt).format("DD/MM/YYYY");
}
function getCurrentTimestamp() {
    const now = moment.utc();
    const ms = now.format("SSS");
    return now.format("YYYY-MM-DDTHH:mm:ss.") + ms + "000Z";
}
function clearAddTable() {
    add_ingredient_detail.value = {
        ...add_ingredient_detail.value,
        ruleName: "",
        ruleDefinition: "",
        refUrl: "",
        tags: "",
    };
}
function isRowSelected(row) {
    return selectedTable.value.includes(row.index);
}
function toggleRowSelection(row, isSelected) {
    if (isSelected) {
        if (!selectedTable.value.includes(row.index))
            selectedTable.value.push(row.index);
    } else {
        selectedTable.value = selectedTable.value.filter(
            (i) => i !== row.index,
        );
    }
}

// your big onClick switch, update all `this.` to variables
async function onClick(fn_name, param = null) {
    switch (fn_name) {
        case "tableSearch":
            await loadData();
            break;

        case "editIngredient":
            showEditor.value = false;
            Object.assign(edit_ingredient_detail.value, param);
            edit_ingredient_detail_isOpen.value = true;
            break;

        case "saveEditIngredient":
            await updateData();
            break;

        case "saveAddTable":
            add_ingredient_detail.value.ruleCreatedDate = getCurrentTimestamp();
            await addData();
            break;

        case "deleteSelectedTable":
            await deleteSelectedRows();
            break;

        case "addTable":
            showEditor.value = false;
            add_ingredient_detail_isOpen.value = true;
            break;

        case "editRule":
            if (!showEditor.value) {
                edit_ingredient_detail.value.ruleDefinition =
                    await getRulesById(
                        edit_ingredient_detail.value.blacklistId,
                    );
            }
            showEditor.value = !showEditor.value;
            break;
    }
}

// fetch & pagination helpers
async function loadMenu(data) {
    console.log("loadMenu");
    try {
        const mockdata = [...data];
        selectedTable.value = [];
        mockdata.forEach((row, i) => {
            selectedTable.value.push(false);
            row.index =
                i +
                1 +
                (pagination_menu.value.page - 1) *
                    pagination_menu.value.rowsPerPage;
        });
        table_rows_menu.value = mockdata;
    } catch (err) {
        console.error("Error fetching menu:", err);
        table_rows_menu.value = [];
    }
}

async function loadData() {
    Loading.show();
    try {
        // const countApi = config.apiPath + `/api/${data.apiComponent}/org/${data.orgName}/action/${data.actionName}`
        const accessToken = localStorage.getItem("accessToken");

        let countData = await $fetch("/api/apiClient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            // Use a raw JSON body as expected by your API:

            body: JSON.stringify({
                offset: 0,
                fromDate: "2025-05-05T17:56:35.528Z",
                toDate: "2025-05-06T17:56:35.528Z",
                limit: 10,
                fullTextSearch: filter_menu_table.value,
                blacklistCode: "",
                blacklistType: props.blacklistType,
                apiComponent: apiComponent,
                orgName: "default",
                actionName: "GetBlackListCount",
            }),
        });
        console.log("count");

        console.log(countData);

        pagination_menu.value.rowsNumber = countData;
        pagination_menu.value.page = 1;

        console.log(pagination_menu.page);
        console.log("before load data");
        let data = await $fetch("/api/apiClient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            // Use a raw JSON body as expected by your API:

            body: JSON.stringify({
                offset: 0,
                fromDate: "2025-05-05T17:56:35.528Z",
                toDate: "2025-05-06T17:56:35.528Z",
                limit: 10,
                fullTextSearch: filter_menu_table.value,
                blacklistCode: "",
                blacklistType: props.blacklistType,
                apiComponent: apiComponent,
                orgName: "default",
                actionName: "GetBlacklists",
            }),
        });
        await loadMenu(data);
    } catch (error) {
        console.error("Error fetching overview data:", error);
    } finally {
        Loading.hide();
    }
}

async function loadNextData(props) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    Loading.show();
    try {
        // const countApi = config.apiPath + `/api/${data.apiComponent}/org/${data.orgName}/action/${data.actionName}`
        const accessToken = localStorage.getItem("accessToken");

        let countData = await $fetch("/api/apiClient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            // Use a raw JSON body as expected by your API:

            body: JSON.stringify({
                offset: 0,
                fromDate: "2025-05-05T17:56:35.528Z",
                toDate: "2025-05-06T17:56:35.528Z",
                limit: 10,
                fullTextSearch: filter_menu_table.value,
                blacklistCode: "",
                blacklistType: props.blacklistType,
                apiComponent: apiComponent,
                orgName: "default",
                actionName: "GetBlackListCount",
            }),
        });
        pagination_menu.value.rowsNumber = countData;
        pagination_menu.value.page = page;
        pagination_menu.value.rowsPerPage = rowsPerPage;

        console.log(pagination_menu.page);
        console.log("before load data");
        let data = await $fetch("/api/apiClient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            // Use a raw JSON body as expected by your API:

            body: JSON.stringify({
                offset: pagination_menu.value.page - 1,
                limit: pagination_menu.value.rowsPerPage,
                fromDate: "2025-05-05T17:56:35.528Z",
                toDate: "2025-05-06T17:56:35.528Z",
                fullTextSearch: filter_menu_table.value,
                blacklistCode: "",
                blacklistType: props.blacklistType,
                apiComponent: apiComponent,
                orgName: "default",
                actionName: "GetBlacklists",
            }),
        });
        await loadMenu(data);
    } catch (error) {
        console.error("Error fetching overview data:", error);
    } finally {
        Loading.hide();
    }
}

async function deleteSelectedRows() {
    let data = table_rows_menu.value.filter((row) =>
        selectedTable.value.includes(row.index),
    );
    let html = data
        .map(
            (item) =>
                `${item.index}. URL : ${item.iocEndpoint} , TAGS : ${item.tags}`,
        )
        .join("<br/>");

    Dialog.create({
        title: '<span class="text-red">ยืนยันการลบข้อมูลต่อไปนี้ !</span>',
        message: `<span class="text-yellow">${html}</span>`,
        html: true,
        style: "minWidth:600px",
        ok: {
            push: true,
            color: "primary",
        },
        cancel: {
            push: true,
            color: "negative",
        },
        persistent: true,
    })
        .onOk(async () => {
            // console.log('>>>> OK')
            for (let index = 0; index < data.length; index++) {
                await deleteData(data[index].blacklistId);
            }
        })
        .onCancel(() => {
            // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
        });

    console.log(data);
}

async function deleteData(id) {
    Loading.show();
    try {
        const accessToken = localStorage.getItem("accessToken");
        let body = {
            id: id,
            apiComponent: apiComponent,
            orgName: "default",
            actionName: "DeleteBlacklistById",
            apiMethod: "DELETE",
        };

        console.log(body);
        let countData = await $fetch("/api/apiClient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            // Use a raw JSON body as expected by your API:
            body: JSON.stringify(body),
        });
        Notify.create({
            position: "top",
            type: "positive",
            message: "ลบมูลสำเร็จ",
        });
        edit_ingredient_detail_isOpen.value = false;
        await loadData();
    } catch (error) {
        console.error("Error delete data:", error);
        Notify.create({
            position: "top",
            type: "negative",
            message: "Error delete data:" + error,
        });
    } finally {
        Loading.hide();
    }
}

async function updateData() {
    console.log("add data");
    Loading.show();
    try {
        const accessToken = localStorage.getItem("accessToken");
        let body = edit_ingredient_detail.value;
        body["id"] = edit_ingredient_detail.value.blacklistId;
        body["apiComponent"] = apiComponent;
        body["orgName"] = "default";
        body["actionName"] = "UpdateBlackListById";

        console.log(body);
        console.log("start update");
        let countData = await $fetch("/api/apiClient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            // Use a raw JSON body as expected by your API:
            body: JSON.stringify(body),
        });
        Notify.create({
            position: "top",
            type: "positive",
            message: "อัพเดขข้อมูลสำเร็จ",
        });
        edit_ingredient_detail_isOpen.value = false;
        await loadData();
    } catch (error) {
        console.error("Error create data:", error);
        Notify.create({
            position: "top",
            type: "negative",
            message: "Error create data:" + error,
        });
    } finally {
        Loading.hide();
    }
}

async function addData() {
    console.log("add data");
    Loading.show();
    try {
        const accessToken = localStorage.getItem("accessToken");

        let body = add_ingredient_detail.value;
        body["apiComponent"] = apiComponent;
        body["orgName"] = "default";
        body["actionName"] = "AddBlacklist";

        console.log(body);
        console.log("start addd");
        let data = await $fetch("/api/apiClient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
            // Use a raw JSON body as expected by your API:
            body: JSON.stringify(body),
        });

        if (data.status.toLowerCase() != "ok") {
            throw data.description;
        }
        Notify.create({
            position: "top",
            type: "positive",
            message: "เพิ่มข้อมูลสำเร็จ",
        });
        add_ingredient_detail_isOpen.value = false;
        clearAddTable();
        loadData();
    } catch (error) {
        Notify.create({
            position: "top",
            type: "negative",
            message: error,
        });
        console.error("Error create data:", error);
    } finally {
        Loading.hide();
    }
}
</script>
