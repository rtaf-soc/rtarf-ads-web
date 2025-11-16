<template>
    <q-page v-if="auth.isAuthenticated">
        <q-card>
            <q-card-section class="q-pa-none q-ma-none" style="height: 100vh">
                <div class="row">
                    <div class="col-12 col-md-12 q-pa-none">
                        <q-table
                            class="my-sticky-header-table"
                            style="height: 95vh"
                            flat
                            bordered
                            title="หมายเหตุ"
                            color="amber"
                            :rows="table_rows_menu"
                            :columns="table_columns_menu"
                            row-key="id"
                            v-model:pagination="pagination_menu"
                            v-model:selected="selected"
                            selection="multiple"
                            :rows-per-page-options="[5, 10, 15, 20, 30, 50, 0]"
                            @request="loadNextData"
                            separator="cell"
                            :loading="loading"
                        >
                            <template v-slot:top-left>
                                <q-input
                                    outlined
                                    dense
                                    debounce="300"
                                    placeholder="ค้นหา"
                                    v-model="filter_menu_table"
                                    bg-color="dark"
                                    @keyup.enter="onClick(`tableSearch`)"
                                >
                                    <template v-slot:append>
                                        <q-btn
                                            round
                                            dense
                                            flat
                                            icon="search"
                                            @click="onClick(`tableSearch`)"
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
                                    {{
                                        Number(
                                            pagination_menu.rowsNumber,
                                        ).toLocaleString("en-US")
                                    }}
                                </q-badge>
                            </template>
                            <template v-slot:top-right>
                                <q-btn
                                    class="q-mr-lg"
                                    icon="add"
                                    rounded
                                    color="green-7"
                                    @click="onClick(`addTable`)"
                                />
                                <q-btn
                                    :disable="selectedTable.length <= 0"
                                    icon="delete"
                                    rounded
                                    color="negative"
                                    @click="onClick(`deleteSelectedTable`)"
                                />
                            </template>

                            <template v-slot:body-cell="props">
                                <q-td
                                    :props="props"
                                    :class="
                                        props.row.id % 2 === 0
                                            ? 'bg-accent'
                                            : 'bg-white'
                                    "
                                >
                                    <template
                                        v-if="props.col.name === 'description'"
                                    >
                                        {{ truncateText(props.value, 30) }}
                                    </template>
                                    <template v-else>
                                        {{ props.value }}
                                    </template>
                                </q-td>
                            </template>
                            <template v-slot:header="props">
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

                            <template v-slot:body="props">
                                <q-tr
                                    :props="props"
                                    class="cursor-pointer"
                                    :class="
                                        props.row.index % 2 === 0
                                            ? 'bg-grey-10'
                                            : 'bg-grey-9'
                                    "
                                >
                                    <q-td
                                        v-for="(col, colIndex) in props.cols"
                                        :key="col.name"
                                        :props="props"
                                    >
                                        <template v-if="col.name === 'id'">
                                            <q-checkbox
                                                :model-value="
                                                    isRowSelected(props.row)
                                                "
                                                @update:model-value="
                                                    (val) =>
                                                        toggleRowSelection(
                                                            props.row,
                                                            val,
                                                        )
                                                "
                                            />
                                            <!-- <q-chip
                                                class="shadow-up-3 q-pr-sm"
                                                clickable
                                                rounded
                                                @click="
                                                    onClick(
                                                        'editNode',
                                                        props.row,
                                                    )
                                                "
                                            >
                                                <q-avatar
                                                    icon="edit"
                                                    color="blue"
                                                    text-color="white"
                                                ></q-avatar>
                                                <div
                                                    class="text-center text-bold"
                                                >
                                                    {{ props.row.index }}
                                                </div>
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
                                                        onClick(
                                                            'editNode',
                                                            props.row,
                                                        )
                                                    "
                                                    icon="edit"
                                                    label="แก้ไขข้อมูล"
                                                />
                                                <q-fab-action
                                                    padding="5px"
                                                    external-label
                                                    label-position="top"
                                                    color="orange"
                                                    Ï
                                                    @click="
                                                        onClick(
                                                            'settings',
                                                            props.row,
                                                        )
                                                    "
                                                    icon="settings"
                                                    label="setting"
                                                />
                                            </q-fab>
                                        </template>

                                        <template
                                            v-else-if="
                                                col.name === 'createdDate'
                                            "
                                        >
                                            {{
                                                convertTimestamp(
                                                    props.row.createdDate,
                                                )
                                            }}
                                        </template>

                                        <template
                                            v-else-if="
                                                col.name === 'description'
                                            "
                                        >
                                            {{
                                                truncateText(
                                                    props.row[col.field],
                                                    30,
                                                )
                                            }}
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
        <q-dialog v-model="edit_node_detail_isOpen">
            <q-card style="width: 800px; max-width: 800vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">
                        แก้ไขข้อมูลของ ID :
                        <q-badge
                            outline
                            class="text-h6"
                            align="middle"
                            color="positive"
                            >{{ edit_node_detail.id }}
                        </q-badge>
                    </div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-item class="q-pl-lg q-pr-lg" style="min-height: 300px">
                    <q-item-section>
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_node_detail.name"
                            outlined
                            label="Node Name"
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_node_detail.description"
                            outlined
                            label="Description"
                            type="textarea"
                            rows="4"
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_node_detail.layer"
                            outlined
                            label="Layer"
                            readonly
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_node_detail.type"
                            outlined
                            label="Type"
                            readonly
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="edit_node_detail.tags"
                            outlined
                            label="tags"
                        />
                        <div class="row q-my-sm q-gutter-md">
                            <div class="col">
                                <q-input
                                    v-model="edit_node_detail.latitude"
                                    outlined
                                    label="Latitude"
                                    type="number"
                                />
                            </div>
                            <div class="col">
                                <q-input
                                    v-model="edit_node_detail.longitude"
                                    outlined
                                    label="Longitude"
                                    type="number"
                                />
                            </div>
                        </div>
                    </q-item-section>
                </q-item>

                <q-card-actions align="around">
                    <q-btn label="ยกเลิก" color="negative" v-close-popup />
                    <q-btn
                        flat
                        label="บันทึก"
                        @click="onClick('saveEditNode')"
                        color="primary"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Add Dialog -->
        <q-dialog v-model="add_node_detail_isOpen">
            <q-card style="width: 800px; max-width: 800vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">เพิ่มข้อมูล</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-item class="q-pl-lg q-pr-lg" style="min-height: 300px">
                    <q-item-section>
                        <q-input
                            class="q-pb-lg"
                            v-model="add_node_detail.name"
                            outlined
                            label="Node Name"
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="add_node_detail.description"
                            outlined
                            label="Description"
                            type="textarea"
                            rows="4"
                        />
                        <q-select
                            class="q-pb-lg"
                            v-model="add_node_detail.layer"
                            outlined
                            label="Layer"
                            :options="layerOptions"
                        />
                        <q-select
                            class="q-pb-lg"
                            v-model="add_node_detail.type"
                            outlined
                            label="Type"
                            :options="nodeTypeOptions"
                        />
                        <q-input
                            class="q-pb-lg"
                            v-model="add_node_detail.tags"
                            outlined
                            label="Tags"
                        />
                        <div class="row q-my-sm q-gutter-md">
                            <div class="col">
                                <q-input
                                    v-model="add_node_detail.latitude"
                                    outlined
                                    label="Latitude"
                                    type="number"
                                />
                            </div>
                            <div class="col">
                                <q-input
                                    v-model="add_node_detail.longitude"
                                    outlined
                                    label="Longitude"
                                    type="number"
                                />
                            </div>
                        </div>
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

        <!-- Settings/Connections Dialog -->
        <q-dialog
            v-model="settings_dialog_isOpen"
            persistent
            @hide="clearSettingsDialog"
        >
            <q-card style="width: 1000px; max-width: 90vw">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">
                        Node Connection Settings
                        <!-- <q-badge
                            outline
                            class="text-h6"
                            align="middle"
                            color="positive"
                            >{{ settings_node_detail.id }}
                        </q-badge> -->
                    </div>

                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section>
                    <div class="text-7">
                        Source node id :
                        <q-badge
                            outline
                            class="text-h7"
                            align="middle"
                            color="positive"
                            >{{ settings_node_detail.id }}
                        </q-badge>
                    </div>
                </q-card-section>
                <q-card-section>
                    <!-- Node Info (Read-only) -->
                    <div class="row q-col-gutter-md q-mb-lg">
                        <div class="col-6">
                            <q-input
                                v-model="settings_node_detail.name"
                                outlined
                                label="Node Name"
                                readonly
                            />
                        </div>
                        <div class="col-6">
                            <q-input
                                v-model="settings_node_detail.description"
                                outlined
                                label="Description"
                                readonly
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-md q-mb-lg">
                        <div class="col-6">
                            <q-input
                                v-model="settings_node_detail.layer"
                                outlined
                                label="Layer"
                                readonly
                            />
                        </div>
                        <div class="col-6">
                            <q-input
                                v-model="settings_node_detail.type"
                                outlined
                                label="Type"
                                readonly
                            />
                        </div>
                    </div>

                    <q-separator class="q-my-md" />

                    <!-- Two Column Layout for Connections -->
                    <div class="row q-col-gutter-md" style="min-height: 400px">
                        <!-- Left: Available Connectable Nodes -->
                        <div class="col-5">
                            <div
                                class="text-subtitle1 text-weight-medium q-mb-sm"
                            >
                                Available Nodes
                            </div>
                            <q-card flat bordered style="height: 400px">
                                <q-list separator>
                                    <q-item
                                        v-for="node in connectableNodes"
                                        :key="node.id"
                                        clickable
                                        @click="selectConnectableNode(node)"
                                        :active="
                                            selectedConnectableNodes.some(
                                                (n) => n.id === node.id,
                                            )
                                        "
                                        active-class="bg-blue-1"
                                    >
                                        <q-item-section side>
                                            <q-checkbox
                                                :model-value="
                                                    selectedConnectableNodes.some(
                                                        (n) => n.id === node.id,
                                                    )
                                                "
                                                @update:model-value="
                                                    selectConnectableNode(node)
                                                "
                                            />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>{{
                                                node.name
                                            }}</q-item-label>
                                            <q-item-label caption>
                                                Type: {{ node.type }}
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item
                                        v-if="connectableNodes.length === 0"
                                    >
                                        <q-item-section>
                                            <q-item-label
                                                class="text-grey-6 text-center"
                                            >
                                                No available nodes
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card>
                        </div>

                        <!-- Middle: Action Buttons -->
                        <div class="col-2 flex flex-center">
                            <div class="column q-gutter-md">
                                <q-btn
                                    round
                                    color="primary"
                                    icon="arrow_forward"
                                    size="md"
                                    :disable="
                                        selectedConnectableNodes.length === 0
                                    "
                                    @click="onClick('addConnection')"
                                >
                                    <q-tooltip>Add Connection</q-tooltip>
                                </q-btn>
                                <q-btn
                                    round
                                    color="negative"
                                    icon="arrow_back"
                                    size="md"
                                    :disable="
                                        selectedConnectedNodes.length === 0
                                    "
                                    @click="onClick('removeConnection')"
                                >
                                    <q-tooltip>Remove Connection</q-tooltip>
                                </q-btn>
                            </div>
                        </div>

                        <!-- Right: Connected Nodes -->
                        <div class="col-5">
                            <div
                                class="text-subtitle1 text-weight-medium q-mb-sm"
                            >
                                Connected Nodes
                            </div>
                            <q-card flat bordered style="height: 400px">
                                <q-list separator>
                                    <q-item
                                        v-for="node in connectedNodes"
                                        :key="node.linkId || node.id"
                                        clickable
                                        @click="selectConnectedNode(node)"
                                        :active="
                                            selectedConnectedNodes.some(
                                                (n) => n.linkId === node.linkId,
                                            )
                                        "
                                        active-class="bg-orange-1"
                                    >
                                        <q-item-section side>
                                            <q-checkbox
                                                :model-value="
                                                    selectedConnectedNodes.some(
                                                        (n) =>
                                                            n.linkId ===
                                                            node.linkId,
                                                    )
                                                "
                                                @update:model-value="
                                                    selectConnectedNode(node)
                                                "
                                            />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>
                                                {{
                                                    node.destinationNodeName ||
                                                    node.name
                                                }}
                                            </q-item-label>
                                            <q-item-label caption>
                                                Type:
                                                {{
                                                    node.destinationNodeType ||
                                                    node.type
                                                }}
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item v-if="connectedNodes.length === 0">
                                        <q-item-section>
                                            <q-item-label
                                                class="text-grey-6 text-center"
                                            >
                                                No connections
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn label="Close" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import moment from "moment";
import { useAuthStore } from "~/stores/auth";

const table_columns_menu = [
    {
        name: "id",
        align: "center",
        label: "Action",
        field: "index",
        headerStyle: "width: 30px",
    },
    {
        name: "name",
        align: "center",
        label: "Node Name",
        field: "name",
        headerStyle: "width: 30px",
    },
    {
        name: "description",
        align: "left",
        label: "Description",
        field: "description",
        sortable: true,
    },
    {
        name: "layer",
        align: "left",
        label: "Layer",
        field: "layer",
        sortable: true,
    },
    {
        name: "type",
        align: "left",
        label: "Type",
        field: "type",
        sortable: true,
    },
    {
        name: "tags",
        align: "left",
        label: "Tags",
        field: "tags",
        sortable: true,
    },
    // {
    //     name: "createdDate",
    //     align: "center",
    //     label: "Created Date",
    //     field: "createdDate",
    //     sortable: true,
    // },
];

const table_rows_menu = ref([]);
const filter_menu_table = ref("");
const pagination_menu = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
});

const loading = ref(true);
const edit_node_detail_isOpen = ref(false);
const edit_node_detail = ref({
    id: "",
    orgId: "default",
    name: "",
    description: "",
    layer: "",
    type: "",
    tags: "",
    longitude: "",
    latitude: "",
    createdDate: "",
});

const add_node_detail_isOpen = ref(false);
const add_node_detail = ref({
    orgId: "default",
    name: "",
    description: "",
    layer: "",
    type: "",
    tags: "",
    longitude: "",
    latitude: "",
    createdDate: "",
});

const layerOptions = ref([]);
const nodeTypeOptions = ref([]);

const selectedTable = ref([]);
const apiComponent = "Node";

// Settings/Connections Dialog State
const settings_dialog_isOpen = ref(false);
const settings_node_detail = ref({
    id: "",
    name: "",
    description: "",
    layer: "",
    type: "",
});
const connectableNodes = ref([]);
const connectedNodes = ref([]);
const selectedConnectableNodes = ref([]);
const selectedConnectedNodes = ref([]);

export default {
    mounted() {
        console.log("mounted");
        this.loading = false;
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
            edit_node_detail_isOpen,
            layerOptions,
            nodeTypeOptions,
            edit_node_detail,
            selectedTable,
            add_node_detail_isOpen,
            add_node_detail,
            apiComponent,
            settings_dialog_isOpen,
            settings_node_detail,
            connectableNodes,
            connectedNodes,
            selectedConnectableNodes,
            selectedConnectedNodes,
        };
    },

    beforeMount() {
        definePageMeta({
            middleware: "auth",
        });
        this.loadData();
    },

    methods: {
        async loadMenu(data) {
            try {
                console.log("load menu");
                console.log(data);
                let mockdata = [...data];
                let data_rows = mockdata;
                this.selectedTable = [];
                for (let index = 0; index < data_rows.length; index++) {
                    this.selectedTable.push({ value: false });
                    const element = data_rows[index];
                    element.index =
                        index +
                        1 +
                        (this.pagination_menu.page - 1) *
                            this.pagination_menu.rowsPerPage;
                }
                this.table_rows_menu = data_rows;
            } catch (error) {
                console.error("Error fetching menu:", error);
                this.table_rows_menu = [];
            }
        },

        convertTimestamp(datetime) {
            return moment(datetime).format("DD/MM/YYYY");
        },

        truncateText(text, maxLength) {
            if (!text) return "";
            return text.length > maxLength
                ? text.substring(0, maxLength) + "..."
                : text;
        },

        getCurrentTimestamp() {
            const now = moment.utc();
            const ms = now.format("SSS");
            return now.format("YYYY-MM-DDTHH:mm:ss.") + ms + "000Z";
        },

        clearAddTable() {
            this.add_node_detail = {
                orgId: "default",
                name: "",
                description: "",
                layer: "",
                type: "",
                tags: "",
                longitude: "",
                latitude: "",
            };
        },

        async fetchLayers() {
            // Skip if already fetched
            if (this.layerOptions.length > 0) {
                return;
            }

            try {
                const accessToken = localStorage.getItem("accessToken");
                const body = {
                    apiComponent: "Node",
                    orgName: "default",
                    actionName: "GetLayers",
                    apiMethod: "GET",
                };

                const response = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify(body),
                });
                // console.log("Layers response:", response);
                // Response is directly an array, not wrapped in .data
                if (response && Array.isArray(response)) {
                    // Map to simple string array for Quasar select
                    this.layerOptions = response.map((layer) => layer.name);
                    // console.log("Layer options loaded:", this.layerOptions);
                }
            } catch (error) {
                console.error("Error fetching layers:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error loading layers: " + error,
                });
            }
        },

        async fetchNodeTypes() {
            // Skip if already fetched
            if (this.nodeTypeOptions.length > 0) {
                return;
            }

            try {
                const accessToken = localStorage.getItem("accessToken");
                const body = {
                    apiComponent: "Node",
                    orgName: "default",
                    actionName: "GetNodeTypes",
                    apiMethod: "GET",
                };

                const response = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify(body),
                });

                // console.log("Node types response:", response);
                // Response is directly an array, not wrapped in .data
                if (response && Array.isArray(response)) {
                    // Map to simple string array for Quasar select
                    this.nodeTypeOptions = response.map((type) => type.name);
                    // console.log(
                    //     "Node type options loaded:",
                    //     this.nodeTypeOptions,
                    // );
                }
            } catch (error) {
                console.error("Error fetching node types:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error loading node types: " + error,
                });
            }
        },

        // Settings Dialog Methods
        selectConnectableNode(node) {
            // Toggle multi-select
            const index = this.selectedConnectableNodes.findIndex(
                (n) => n.id === node.id,
            );
            if (index > -1) {
                // Already selected, remove it
                this.selectedConnectableNodes.splice(index, 1);
            } else {
                // Not selected, add it
                this.selectedConnectableNodes.push(node);
            }
        },

        selectConnectedNode(node) {
            // Toggle multi-select
            const index = this.selectedConnectedNodes.findIndex(
                (n) => n.linkId === node.linkId,
            );
            if (index > -1) {
                // Already selected, remove it
                this.selectedConnectedNodes.splice(index, 1);
            } else {
                // Not selected, add it
                this.selectedConnectedNodes.push(node);
            }
        },

        clearSettingsDialog() {
            // Clear all dialog state when closing
            this.connectableNodes = [];
            this.connectedNodes = [];
            this.selectedConnectableNodes = [];
            this.selectedConnectedNodes = [];
            this.settings_node_detail = {
                id: "",
                name: "",
                description: "",
                layer: "",
                type: "",
            };
        },

        async fetchConnectableNodes(nodeId) {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const body = {
                    apiComponent: "Node",
                    orgName: "default",
                    actionName: "GetConnectableNodes",
                    apiMethod: "GET",
                    nodeId: nodeId,
                };

                const response = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify(body),
                });

                console.log("Connectable nodes response:", response);

                // Response is directly an array
                if (response && Array.isArray(response)) {
                    // Filter out nodes that are already connected
                    const connectedNodeIds = this.connectedNodes.map(
                        (n) =>
                            n.destinationNode ||
                            n.DestinationNode ||
                            n.destinationNodeId ||
                            n.id,
                    );
                    console.log(
                        "Connected node IDs to filter:",
                        connectedNodeIds,
                    );

                    // Filter before assigning
                    const filteredNodes = response.filter(
                        (node) => !connectedNodeIds.includes(node.id),
                    );

                    console.log(
                        "Available nodes after filtering:",
                        filteredNodes,
                    );

                    this.connectableNodes = filteredNodes;
                } else {
                    this.connectableNodes = [];
                }
            } catch (error) {
                console.error("Error fetching connectable nodes:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error loading connectable nodes: " + error,
                });
                this.connectableNodes = [];
            }
        },

        async fetchConnectedNodes(nodeId) {
            try {
                this.$q.loading.show({
                    message: "Loading connections...",
                });

                const accessToken = localStorage.getItem("accessToken");
                const body = {
                    apiComponent: "Node",
                    orgName: "default",
                    actionName: "GetNodeLinks",
                    apiMethod: "GET",
                    srcNodeId: nodeId,
                };

                const response = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify(body),
                });

                console.log("Connected nodes response:", response);

                // Response is directly an array
                if (response && Array.isArray(response)) {
                    // Map and store connected nodes with all necessary fields
                    const mappedNodes = response.map((link) => ({
                        ...link,
                        linkId: link.id, // Store link ID for deletion
                        destinationNodeName:
                            link.destinationNodeName ||
                            link.DestinationNodeName,
                        destinationNodeType:
                            link.destinationNodeType ||
                            link.DestinationNodeType,
                        destinationNodeId:
                            link.destinationNode ||
                            link.DestinationNode ||
                            link.destinationNodeId,
                        destinationNode:
                            link.destinationNode ||
                            link.DestinationNode ||
                            link.destinationNodeId,
                    }));

                    console.log("Connected nodes mapped:", mappedNodes);
                    this.connectedNodes = mappedNodes;
                } else {
                    this.connectedNodes = [];
                }
            } catch (error) {
                console.error("Error fetching connected nodes:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error loading connected nodes: " + error,
                });
                this.connectedNodes = [];
            } finally {
                this.$q.loading.hide();
            }
        },

        async addLink() {
            if (this.selectedConnectableNodes.length === 0) {
                return;
            }

            try {
                this.$q.loading.show({
                    message: `Adding ${this.selectedConnectableNodes.length} connection(s)...`,
                });

                const accessToken = localStorage.getItem("accessToken");

                // Process all selected nodes in parallel
                const promises = this.selectedConnectableNodes.map(
                    async (selectedNode) => {
                        const linkName = selectedNode.name;
                        const linkDescription = `${this.settings_node_detail.name} connected to ${selectedNode.name}`;

                        const body = {
                            apiComponent: "Node",
                            orgName: "default",
                            actionName: "AddLink",
                            apiMethod: "POST",
                            srcNodeId: this.settings_node_detail.id,
                            Name: linkName,
                            Description: linkDescription,
                            Tags: "",
                            DestinationNode: selectedNode.id,
                        };

                        return await $fetch("/api/apiClient", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + accessToken,
                            },
                            body: JSON.stringify(body),
                        });
                    },
                );

                const responses = await Promise.all(promises);
                console.log("Add links responses:", responses);

                this.$q.notify({
                    position: "top",
                    type: "positive",
                    message: `${this.selectedConnectableNodes.length} connection(s) added successfully`,
                });

                // Clear selections
                this.selectedConnectableNodes = [];

                // Refresh both lists
                await this.fetchConnectedNodes(this.settings_node_detail.id);
                await this.fetchConnectableNodes(this.settings_node_detail.id);
            } catch (error) {
                console.error("Error adding links:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error adding connections: " + error,
                });
            } finally {
                this.$q.loading.hide();
            }
        },

        async removeLink() {
            if (this.selectedConnectedNodes.length === 0) {
                return;
            }

            try {
                this.$q.loading.show({
                    message: `Removing ${this.selectedConnectedNodes.length} connection(s)...`,
                });

                const accessToken = localStorage.getItem("accessToken");

                // Process all selected nodes in parallel
                const promises = this.selectedConnectedNodes.map(
                    async (selectedNode) => {
                        const body = {
                            apiComponent: "Node",
                            orgName: "default",
                            actionName: "DeleteLinkById",
                            apiMethod: "DELETE",
                            linkId: selectedNode.linkId, // Use link ID, not node ID
                        };

                        return await $fetch("/api/apiClient", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + accessToken,
                            },
                            body: JSON.stringify(body),
                        });
                    },
                );

                const responses = await Promise.all(promises);
                console.log("Remove links responses:", responses);

                this.$q.notify({
                    position: "top",
                    type: "positive",
                    message: `${this.selectedConnectedNodes.length} connection(s) removed successfully`,
                });

                // Clear selections
                this.selectedConnectedNodes = [];

                // Refresh both lists
                await this.fetchConnectedNodes(this.settings_node_detail.id);
                await this.fetchConnectableNodes(this.settings_node_detail.id);
            } catch (error) {
                console.error("Error removing links:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error removing connections: " + error,
                });
            } finally {
                this.$q.loading.hide();
            }
        },

        isRowSelected(row) {
            return this.selectedTable.includes(row.index);
        },

        toggleRowSelection(row, isSelected) {
            if (isSelected) {
                if (!this.selectedTable.includes(row.index)) {
                    this.selectedTable.push(row.index);
                }
            } else {
                this.selectedTable = this.selectedTable.filter(
                    (id) => id !== row.index,
                );
            }
        },

        async onClick(fn_name, param = null) {
            switch (fn_name) {
                case "tableSearch":
                    this.loadData();
                    break;
                case "editNode":
                    console.log(param);
                    this.edit_node_detail = { ...param };
                    this.edit_node_detail_isOpen = true;
                    break;
                case "saveEditNode":
                    console.log("saveEditNode");
                    console.log(this.edit_node_detail);
                    this.updateData();
                    break;
                case "saveAddTable":
                    this.add_node_detail.createdDate =
                        this.getCurrentTimestamp();
                    this.addData();
                    break;
                case "deleteSelectedTable":
                    console.log(`deleteTable`);
                    this.deleteSelectedRows();
                    break;
                case "addTable":
                    this.clearAddTable();
                    this.$q.loading.show({
                        message: "Loading options...",
                    });
                    try {
                        console.log("Fetching layers...");
                        await this.fetchLayers();
                        await this.fetchNodeTypes();
                        this.add_node_detail_isOpen = true;
                    } catch (error) {
                        console.error("Error loading options:", error);
                        this.$q.notify({
                            position: "top",
                            type: "negative",
                            message: "Error loading options: " + error,
                        });
                    } finally {
                        this.$q.loading.hide();
                    }
                    break;
                case "settings":
                    console.log("Opening settings for node:", param);
                    this.settings_node_detail = {
                        id: param.id,
                        name: param.name,
                        description: param.description,
                        layer: param.layer,
                        type: param.type,
                    };
                    this.settings_dialog_isOpen = true;
                    // Fetch connected nodes first, then filter available nodes
                    await this.fetchConnectedNodes(param.id);
                    await this.fetchConnectableNodes(param.id);
                    break;
                case "addConnection":
                    if (this.selectedConnectableNodes.length > 0) {
                        await this.addLink();
                    }
                    break;
                case "removeConnection":
                    if (this.selectedConnectedNodes.length > 0) {
                        await this.removeLink();
                    }
                    break;
                default:
                    break;
            }
        },

        async deleteSelectedRows() {
            let data = this.table_rows_menu.filter((row) =>
                this.selectedTable.includes(row.index),
            );
            let html = data
                .map(
                    (item) =>
                        `${item.index}. Node Name : ${item.name} , Description : ${item.description}`,
                )
                .join("<br/>");

            this.$q
                .dialog({
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
                    for (let index = 0; index < data.length; index++) {
                        await this.deleteData(data[index].id);
                    }
                })
                .onCancel(() => {
                    // console.log('>>>> Cancel')
                })
                .onDismiss(() => {
                    // console.log('I am triggered on both OK and Cancel')
                });

            console.log(data);
        },

        async deleteData(id) {
            this.$q.loading.show();
            try {
                const accessToken = localStorage.getItem("accessToken");
                let body = {
                    id: id,
                    apiComponent: this.apiComponent,
                    orgName: "default",
                    actionName: "DeleteNodeById",
                    apiMethod: "DELETE",
                };

                console.log(body);
                let countData = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify(body),
                });

                this.$q.notify({
                    position: "top",
                    type: "positive",
                    message: "ลบข้อมูลสำเร็จ",
                });
                this.edit_node_detail_isOpen = false;
                await this.loadData();
            } catch (error) {
                console.error("Error delete data:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error delete data:" + error,
                });
            } finally {
                this.$q.loading.hide();
            }
        },

        async updateData() {
            console.log("update data");
            this.$q.loading.show();
            try {
                const accessToken = localStorage.getItem("accessToken");
                let body = { ...this.edit_node_detail };
                body["id"] = this.edit_node_detail.id;
                body["apiComponent"] = this.apiComponent;
                body["orgName"] = "default";
                body["actionName"] = "UpdateNodeById";

                console.log(body);
                console.log("start update");
                let countData = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify(body),
                });

                this.$q.notify({
                    position: "top",
                    type: "positive",
                    message: "อัพเดทข้อมูลสำเร็จ",
                });
                this.edit_node_detail_isOpen = false;
                await this.loadData();
            } catch (error) {
                console.error("Error update data:", error);
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: "Error update data:" + error,
                });
            } finally {
                this.$q.loading.hide();
            }
        },

        async addData() {
            console.log("add data");
            this.$q.loading.show();
            try {
                const accessToken = localStorage.getItem("accessToken");

                let body = { ...this.add_node_detail };
                body["apiComponent"] = this.apiComponent;
                body["orgName"] = "default";
                body["actionName"] = "AddNode";

                console.log(body);
                console.log("start add");
                let data = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify(body),
                });

                if (data.status && data.status.toLowerCase() != "ok") {
                    throw data.description;
                }

                this.$q.notify({
                    position: "top",
                    type: "positive",
                    message: "เพิ่มข้อมูลสำเร็จ",
                });
                this.add_node_detail_isOpen = false;
                this.clearAddTable();
                this.loadData();
            } catch (error) {
                this.$q.notify({
                    position: "top",
                    type: "negative",
                    message: error,
                });
                console.error("Error create data:", error);
            } finally {
                this.$q.loading.hide();
            }
        },

        async loadData() {
            this.$q.loading.show();
            try {
                const accessToken = localStorage.getItem("accessToken");

                let countData = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify({
                        offset: 0,
                        fromDate: "2025-05-05T17:56:35.528Z",
                        toDate: "2025-05-06T17:56:35.528Z",
                        limit: 10,
                        fullTextSearch: this.filter_menu_table,
                        apiComponent: this.apiComponent,
                        orgName: "default",
                        actionName: "GetNodeCount",
                    }),
                });

                console.log("count");
                console.log(countData);

                this.pagination_menu.rowsNumber = countData;
                this.pagination_menu.page = 1;

                console.log(this.pagination_menu.page);
                console.log("before load data");
                let data = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify({
                        offset: 0,
                        fromDate: "2025-05-05T17:56:35.528Z",
                        toDate: "2025-05-06T17:56:35.528Z",
                        limit: 10,
                        fullTextSearch: this.filter_menu_table,
                        apiComponent: this.apiComponent,
                        orgName: "default",
                        actionName: "GetNodes",
                    }),
                });

                console.log("load data");
                console.log(data);
                await this.loadMenu(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                this.$q.loading.hide();
            }
        },

        async loadNextData(props) {
            const { page, rowsPerPage, sortBy, descending } = props.pagination;
            this.$q.loading.show();
            try {
                const accessToken = localStorage.getItem("accessToken");
                let countData = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify({
                        offset: 0,
                        fromDate: "2025-05-05T17:56:35.528Z",
                        toDate: "2025-05-06T17:56:35.528Z",
                        limit: 10,
                        fullTextSearch: this.filter_menu_table,
                        apiComponent: this.apiComponent,
                        orgName: "default",
                        actionName: "GetNodeCount",
                    }),
                });

                console.log(page - 1);
                console.log(countData);
                this.pagination_menu.rowsNumber = countData;
                this.pagination_menu.page = page;
                this.pagination_menu.rowsPerPage = rowsPerPage;
                console.log(this.pagination_menu.page);

                let data = await $fetch("/api/apiClient", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    body: JSON.stringify({
                        offset: this.pagination_menu.page - 1,
                        fromDate: "2025-05-05T17:56:35.528Z",
                        toDate: "2025-05-06T17:56:35.528Z",
                        limit: this.pagination_menu.rowsPerPage,
                        fullTextSearch: this.filter_menu_table,
                        apiComponent: this.apiComponent,
                        orgName: "default",
                        actionName: "GetNodes",
                    }),
                });

                console.log(data);
                console.log("loadNextData");
                await this.loadMenu(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                this.$q.loading.hide();
            }
        },
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
