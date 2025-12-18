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
            row-key="ruleId"
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
                    label="Discover"
                    icon="data_exploration"
                    rounded
                    color="indigo"
                    @click="onClick('openDiscovery')"
                />
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
                            <!-- <q-chip class="shadow-up-3 q-pr-sm" clickable rounded @click="onClick('editIngredient', props.row)">
                <q-avatar icon="edit" color="blue" text-color="white" />
                <div class="text-center text-bold">{{ props.row.index }}</div>
              </q-chip> -->

                            <q-fab
                                v-model="props.row.fabOpen"
                                label-position="top"
                                external-label
                                color="blue"
                                icon="keyboard_arrow_right"
                                direction="right"
                                padding="xs"
                            >
                                <q-fab-action
                                    padding="5px"
                                    external-label
                                    label-position="top"
                                    color="primary"
                                    @click="
                                        onClick('editIngredient', props.row)
                                    "
                                    icon="edit"
                                    label="แก้ไขข้อมูล"
                                />
                                <q-fab-action
                                    padding="5px"
                                    external-label
                                    label-position="top"
                                    color="orange"
                                    @click="onClick('getLucene', props.row)"
                                    icon="dataset"
                                    label="Lucene คิวรี่"
                                />
                            </q-fab>
                        </template>

                        <template v-else-if="col.name === 'createdDate'">
                            {{ convertTimestamp(props.row.ruleCreatedDate) }}
                        </template>

                        <template v-else>
                            {{ props.row[col.field] }}
                        </template>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
        <q-dialog v-model="show_lucene_value_isOpen">
            <q-card style="width: 800px; max-width: 800vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">
                        ข้อมูลของ ID :
                        <q-badge
                            outline
                            class="text-h6 q-ml-md"
                            align="middle"
                            color="positive"
                        >
                            {{ show_lucene_value.ruleId }}
                        </q-badge>
                    </div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px">
                    <q-item-section class="q-pb-none">
                        <template
                            v-if="
                                show_lucene_value &&
                                typeof show_lucene_value.luceneQuery !==
                                    'undefined'
                            "
                        >
                            <q-input
                                v-if="show_lucene_value.luceneQuery != null"
                                class="q-pb-none"
                                v-model="show_lucene_value.luceneQuery"
                                type="textarea"
                                outlined
                                readonly
                            >
                                <template #append>
                                    <q-btn
                                        flat
                                        round
                                        dense
                                        icon="content_copy"
                                        color="primary"
                                        @click="
                                            copyToClipboard(
                                                show_lucene_value.luceneQuery,
                                            )
                                        "
                                    >
                                        <q-tooltip>Copy to clipboard</q-tooltip>
                                    </q-btn>
                                </template>
                            </q-input>
                            <div
                                v-else
                                class="text-center text-bold text-red q-pa-md"
                                style="font-size: 30px"
                            >
                                ไม่พบข้อมูล
                            </div>
                        </template>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-btn
                        class="q-mt-none q-pt-none"
                        label="Discover"
                        icon="data_exploration"
                        rounded
                        color="indigo"
                        @click="onClick('openDiscoverLucene')"
                    />
                </q-item>
            </q-card>
        </q-dialog>

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
                            {{ edit_ingredient_detail.ruleId }}
                        </q-badge>
                    </div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-item class="q-pl-lg q-pr-lg" style="min-height: 200px">
                    <q-item-section>
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_ingredient_detail.ruleName"
                            outlined
                            label="Rule Name"
                            disable
                        />

                        <q-btn @click="onClick('editRule')" color="green"
                            >แก้ไข code</q-btn
                        >
                        <div v-if="showEditor">
                            <MonacoEditor
                                v-model="edit_ingredient_detail.ruleDefinition"
                                lang="yaml"
                                style="height: 400px"
                                :options="editorOptions"
                            />
                        </div>
                        <q-input
                            v-else
                            class="q-pb-lg"
                            v-model="edit_ingredient_detail.ruleDefinition"
                            outlined
                            label="Rule Definition"
                            disable
                        />

                        <q-input
                            class="q-pb-lg"
                            v-model="edit_ingredient_detail.refUrl"
                            outlined
                            label="URL"
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_ingredient_detail.tags"
                            outlined
                            label="tags"
                        />
                        <q-checkbox
                            v-model="edit_ingredient_detail.isActive"
                            :true-value="1"
                            :false-value="0"
                            label="Active Status"
                            color="positive"
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
                            v-model="add_ingredient_detail.ruleName"
                            outlined
                            label="Rule Name"
                        />
                        <q-btn @click="showEditor = !showEditor" color="green"
                            >แก้ไข code</q-btn
                        >
                        <div v-if="showEditor">
                            <MonacoEditor
                                v-model="add_ingredient_detail.ruleDefinition"
                                lang="yaml"
                                style="height: 400px"
                                :options="editorOptions"
                            />
                        </div>
                        <q-input
                            v-else
                            class="q-pb-lg"
                            v-model="add_ingredient_detail.ruleDefinition"
                            outlined
                            label="Rule Definition"
                            disable
                        />

                        <q-input
                            class="q-pb-lg"
                            v-model="add_ingredient_detail.refUrl"
                            outlined
                            label="URL"
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="add_ingredient_detail.tags"
                            outlined
                            label="tags"
                        />
                        <q-checkbox
                            v-model="add_ingredient_detail.isActive"
                            :true-value="1"
                            :false-value="0"
                            label="Active Status"
                            color="positive"
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
import { ref, onMounted } from "vue";
import moment from "moment";
import { useAuthStore } from "~/stores/auth";
import { Dialog, Notify, Loading, useQuasar } from "quasar";
import { definePageMeta } from "#imports";

// 1️⃣ declare prop to make this reusable
const props = defineProps({
    refType: { type: String, required: true },
});

const apiComponent = "HuntingRule";
// 2️⃣ protect with auth middleware
definePageMeta({ middleware: "auth" });

// — state & config (exactly as before)
const auth = useAuthStore();
const config = useRuntimeConfig();
const $q = useQuasar();
const table_columns_menu = [
    {
        name: "id",
        align: "center",
        label: "Action",
        field: "index",
        headerStyle: "width: 30px",
    },
    {
        name: "ruleName",
        align: "left",
        label: "Rule Name",
        field: "ruleName",
        sortable: true,
    },
    {
        name: "refUrl",
        align: "center",
        label: "URL",
        field: "refUrl",
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
        field: "ruleCreatedDate",
        sortable: true,
    },
];
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
const show_lucene_value = ref(false);
const show_lucene_value_isOpen = ref(false);
const edit_ingredient_detail_isOpen = ref(false);
const edit_ingredient_detail = ref({
    ruleName: "",
    ruleDefinition: "",
    refUrl: "",
    tags: "",
    ruleCreatedDate: "2024-10-12T09:24:30.125001Z",
    update_at: "2023-05-20T11:00:00Z",
    isActive: 0,
});
const add_ingredient_detail_isOpen = ref(false);
const add_ingredient_detail = ref({
    ruleName: "",
    ruleDefinition: "",
    refUrl: "",
    tags: "",
    ruleCreatedDate: "2024-10-12T09:24:30.125001Z",
    update_at: "2023-05-20T11:00:00:Z",
    isActive: 0,
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
function buildKibanaDiscoverURL(luceneQuery) {
    if (!luceneQuery) return null;

    // URL encode the Lucene query
    const encodedQuery = encodeURIComponent(luceneQuery);

    // Get Kibana index ID from runtime config
    const kibanaIndexId = config.public.kibana.indexId;

    // Build the Kibana Discover URL with all parameters matching the example
    const baseParams = {
        _g: "(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-24h%2Fh,to:now))",
        _a: `(columns:!(),filters:!(),index:${kibanaIndexId},interval:auto,query:(language:lucene,query:'${encodedQuery}'),sort:!(!('@timestamp',desc)))`,
    };

    const queryString = `?_g=${baseParams._g}&_a=${baseParams._a}`;
    return `app/discover#/${queryString}`;
}

function clearAddTable() {
    add_ingredient_detail.value = {
        ...add_ingredient_detail.value,
        ruleName: "",
        ruleDefinition: "",
        refUrl: "",
        tags: "",
        isActive: 0,
    };
}
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        Notify.create({
            type: "positive",
            message: "คัดลอกข้อความสำเร็จ! (Copied to clipboard)",
            position: "top",
            timeout: 2000,
        });
    } catch (err) {
        Notify.create({
            type: "negative",
            message: "ไม่สามารถคัดลอกข้อความได้ (Failed to copy)",
            position: "top",
            timeout: 2000,
        });
    }
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
                    await getRulesById(edit_ingredient_detail.value.ruleId);
            }
            showEditor.value = !showEditor.value;
            break;
        case "getLucene":
            if (!show_lucene_value_isOpen.value) {
                // console.log(param)
                show_lucene_value.value = await getLuceneById(param.ruleId);
                console.log(show_lucene_value.value);
            }
            // show_lucene_value.value = !show_lucene_value.value
            show_lucene_value_isOpen.value = !show_lucene_value_isOpen.value;
            break;

        case "openDiscovery":
            const discoveryUrl = config.public.tool.url01 + "app/discover";
            window.open(discoveryUrl, "_blank");
            break;

        case "openDiscoverLucene":
            if (
                show_lucene_value.value &&
                show_lucene_value.value.luceneQuery
            ) {
                const kibanaPath = buildKibanaDiscoverURL(
                    show_lucene_value.value.luceneQuery,
                );
                if (kibanaPath) {
                    const fullUrl = config.public.tool.url01 + kibanaPath;
                    window.open(fullUrl, "_blank");
                } else {
                    $q.notify({
                        type: "warning",
                        message: "ไม่พบ Lucene query",
                        position: "top",
                        timeout: 2000,
                    });
                }
            } else {
                $q.notify({
                    type: "warning",
                    message: "กรุณาดึงข้อมูล Lucene ก่อน",
                    position: "top",
                    timeout: 2000,
                });
            }
            break;
    }
}

// fetch & pagination helpers
async function loadMenu(data) {
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
            row.fabOpen = false;
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
        const token = localStorage.getItem("accessToken");
        const count = await $fetch("/api/hunting_rules/count", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                offset: 0,
                fromDate: "2025-05-05T17:56:35.528Z",
                toDate: "2025-05-06T17:56:35.528Z",
                limit: 0,
                fullTextSearch: filter_menu_table.value,
                refType: props.refType,
            }),
        });
        pagination_menu.value.rowsNumber = count;
        pagination_menu.value.page = 1;

        const data = await $fetch("/api/hunting_rules/rules", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                offset: pagination_menu.value.page - 1,
                limit: pagination_menu.value.rowsPerPage,
                fullTextSearch: filter_menu_table.value,
                refType: props.refType,
            }),
        });
        await loadMenu(data);
    } catch (err) {
        console.error("Error fetching data:", err);
    } finally {
        Loading.hide();
    }
}

async function loadNextData(props) {
    // console.log(props)
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    Loading.show();
    try {
        const accessToken = localStorage.getItem("accessToken");
        let countData = await $fetch("/api/hunting_rules/count", {
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
                limit: 0,
                fullTextSearch: filter_menu_table.value,
                refType: props.refType,
            }),
        });
        pagination_menu.value.rowsNumber = countData;
        pagination_menu.value.page = page;
        pagination_menu.value.rowsPerPage = rowsPerPage;

        const data = await $fetch("/api/hunting_rules/rules", {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({
                offset: pagination_menu.value.page - 1,
                limit: pagination_menu.value.rowsPerPage,
                fullTextSearch: filter_menu_table.value,
                refType: props.refType,
            }),
        });
        await loadMenu(data);
    } catch (error) {
        console.error("Error fetching overview data:", error);
    } finally {
        Loading.hide();
    }
    // await loadData()
}

// CRUD calls
async function getRulesById(ruleId) {
    Loading.show();
    try {
        const token = localStorage.getItem("accessToken");
        const res = await $fetch("/api/hunting_rules/get_by_id", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ruleId }),
        });
        return res.ruleDefinition;
    } finally {
        Loading.hide();
    }
}
// Lucene คิวรี่
async function getLuceneById(ruleId) {
    Loading.show();
    try {
        const token = localStorage.getItem("accessToken");
        const res = await $fetch("/api/hunting_rules/get_lucence_by_id", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ruleId }),
        });
        return res;
    } finally {
        Loading.hide();
    }
}

async function deleteSelectedRows() {
    const toDel = table_rows_menu.value.filter((r) =>
        selectedTable.value.includes(r.index),
    );
    const html = toDel
        .map((i) => `${i.index}. Rule Name: ${i.ruleName}`)
        .join("<br/>");

    await Dialog.create({
        title: '<span class="text-red">ยืนยันการลบข้อมูล !</span>',
        html: true,
        message: `<span class="text-yellow">${html}</span>`,
        ok: { color: "primary" },
        cancel: { color: "negative" },
        persistent: true,
    }).onOk(async () => {
        for (const row of toDel) {
            await deleteData(row.ruleId);
        }
    });
}

async function deleteData(ruleId) {
    Loading.show();
    try {
        const token = localStorage.getItem("accessToken");
        await $fetch("/api/hunting_rules/delete", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ruleId }),
        });
        Notify.create({ type: "positive", message: "ลบข้อมูลสำเร็จ" });
        await loadData();
    } finally {
        Loading.hide();
    }
}

async function updateData() {
    Loading.show();
    try {
        const token = localStorage.getItem("accessToken");
        await $fetch("/api/hunting_rules/update", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(edit_ingredient_detail.value),
        });
        Notify.create({ type: "positive", message: "อัพเดตข้อมูลสำเร็จ" });
        edit_ingredient_detail_isOpen.value = false;
        await loadData();
    } finally {
        Loading.hide();
    }
}

async function addData() {
    Loading.show();
    try {
        const token = localStorage.getItem("accessToken");
        await $fetch("/api/hunting_rules/create", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                ...add_ingredient_detail.value,
                orgId: "default",
                refType: props.refType,
            }),
        });
        Notify.create({ type: "positive", message: "เพิ่มข้อมูลสำเร็จ" });
        add_ingredient_detail_isOpen.value = false;
        await loadData();
    } finally {
        Loading.hide();
    }
}
</script>
