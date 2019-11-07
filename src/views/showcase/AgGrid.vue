<template>
    <b-container fluid class="form-content">
        <b-row class="form-title">
            <h2 class="col-md-6">Factures en traitement</h2>
        </b-row>
        <b-row class="mb-4" align-h="between">
            <b-col class="pt-2 filter" sm="auto" cols="5">
                <b-button variant="primary" @click="openFilters">
                    <font-awesome-icon icon="sliders-h" />
                    Filtrer
                </b-button>
                <span class="filter-count">177 factures</span>
            </b-col>
            <b-col sm lg="auto">
                <b-button v-b-tooltip.hover title="Exporter les résultats (.pdf)" variant="default"><font-awesome-icon icon="file-pdf" /></b-button>
                <b-button v-b-tooltip.hover title="Exporter les résultats (.csv)" variant="default"><font-awesome-icon icon="file-excel" /></b-button>
                <valuated-dropdown 
                    variant="light"
                    size="default"
                    :data="paginationData"
                    :selected-data="selectedPagination"
                    @changed-data-value="changedPagination($event)">
                </valuated-dropdown>
                <b-button v-b-tooltip.hover title="Réinitialiser l'affichage" variant="default"><font-awesome-icon icon="sync" /></b-button>
            </b-col>
        </b-row>
        <b-row class="grid-top-filter mb-3">
            <b-col md="12">
                <b-alert variant="light" class="filter-label" :show="true" dismissible fade>Critère</b-alert>
                <!-- @dismissed="showDismissibleAlert=false" -->

            </b-col>
        </b-row>
        <ag-grid-vue style="width: 100%;"
                    class="ag-theme-balham"
                    id="agTable"
                    rowHeight="50"
                    headerHeight="50"
                    domLayout="autoHeight"
                    suppressDragLeaveHidesColumns="true"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :rowData="rowData"
                    @first-data-rendered="onFirstDataRendered">
        </ag-grid-vue>
        <b-row align-h="center" class="mt-3">
            <sy-grid-pagination
                :current-page="currentPage"       
                :page-number="pageNumber"     
                @page-changed="pageChanged($event)"
            >
            </sy-grid-pagination>
        </b-row>

    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Model, Watch } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import { svgPathData as eyeSvg } from '@fortawesome/free-solid-svg-icons/faEye';
import { ValuatedDropdownData, ValuatedDropdownDataEntry } from '@/components/dropdown/ValuatedDropdownData';
import ValuatedDropdown from '@/components/dropdown/ValuatedDropdown.vue';
import SyGridPagination from '@/components/grid/SyGridPagination.vue';



@Component({components: {
    ValuatedDropdown,
    SyGridPagination
}})
export default class AgGrid extends Vue {

    private selectedPagination : ValuatedDropdownDataEntry = {data: 10, label: "component.grid.pagination.10l"};

    private paginationData : ValuatedDropdownData = {
        entries : [
            { data: 10, label: "component.grid.pagination.10l"},
            { data: 20, label: "component.grid.pagination.20l"},
            { data: 50, label: "component.grid.pagination.50l"},
            { data: 100, label: "component.grid.pagination.100l"},
        ]
    };

    private gridOptions : object = {
        components: {
            eyeIconRenderer: this.eyeIconRenderer
        }
    }

    private columnDefs : object[] = [
        {headerName: 'colString1', field: 'colString1', resizable: true},
        {headerName: 'colString2', field: 'colString2', resizable: true},
        {headerName: 'colDate1', field: 'colDate1', resizable: true, valueFormatter : this.dateFormatter},
        {headerName: 'colDate2', field: 'colDate2', resizable: true, valueFormatter : this.dateFormatter},
        {headerName: 'colInt1', field: 'colInt1',resizable: true},
        {headerName: 'colInt2', field: 'colInt2', resizable: true},
        {headerName: 'colDouble1', field: 'colDouble1', resizable: true},
        {headerName: 'detail', field: 'detail', resizable: true, cellRenderer : 'eyeIconRenderer'}
    ];

    private rowData : [] = [];

    private currentPage : number = 1;
    private rows : number = 150;
    private perPage : number = 10;

    @Watch('currentPage')
    private onCurrentPageChange(currentPageNew : number) {
        this.fetchData();
    }

    @Watch('perPage')
    private onPerPageChange(currentPageNew : number) {
        this.fetchData();
    }

    @Emit()
    private openFilters() : boolean {
        return true;
    }

    private eyeIconRenderer() : any {
        return '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-file-pdf fa-w-12"><path fill="currentColor" d="' + eyeSvg + '"></path></svg>';
    }

    private get pageNumber() : number {
        return Math.round(this.rows/this.perPage) + 1;
    }

    private created() {
        this.fetchData();
    }

    private onFirstDataRendered(params) {
        //resizing columns to fit, it is mandatory fro this component - we have to wait until it's attached to DOM
        if(!this.isMobile())
            params.api.sizeColumnsToFit();
    }

    private isMobile() {
        if( screen.width <= 760 ) {
            return true
        } else {
            return false
        }
    }

    private fetchData() {
        this.$http.post('/api/data', {
            page: this.currentPage,
            perPage : this.perPage
        }).then((response : AxiosResponse) => {
            this.rowData =  response.data;
        }).catch((error : any) => {
            console.log(error);
        });
    }

    private dateFormatter(params : any) : string {
        return params.value.toLocaleString('fr-FR');
    }

    private changedPagination(changedData : ValuatedDropdownDataEntry) {
        this.perPage = changedData.data;
    }

    private pageChanged(selectedPage : number) {
        this.currentPage = selectedPage;
    }

}
</script>

<style>
</style>
