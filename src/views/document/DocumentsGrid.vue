<template>
    <ag-grid-vue style="width: 100%;"
                ref="agGrid"
                class="ag-theme-balham"
                id="agTable"
                rowHeight="50"
                headerHeight="50"
                domLayout="autoHeight"
                suppressDragLeaveHidesColumns="true"
                :gridOptions="gridOptions"
                
                :rowData="data"
                @sort-changed="onSortChanged"
                @column-moved="columnMoved"
                @cellClicked="onCellClicked"
                multiSortKey='ctrl'
                @grid-ready="onGridReady"
                @first-data-rendered="onFirstDataRendered">
    </ag-grid-vue>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Model, Watch, Ref } from 'vue-property-decorator';
import { svgPathData as eyeSvg } from '@fortawesome/free-solid-svg-icons/faEye';
import { svgPathData as fileDownloadSvg } from '@fortawesome/free-solid-svg-icons/faFileDownload';

@Component({components: {}})
export default class DocumentsGrid extends Vue {

    @Prop()
    private data !: [];

    @Prop()
    private initialSort !: object[];

    @Prop()
    private columnDefs !: object[];

    @Ref('agGrid')
    private agGrid : any;

    private gridOptions : object = {
        suppressCellSelection: true,
        defaultColDef : {
            sortable: true
        },
        components: {
            eyeIconRenderer: this.eyeIconRenderer,
            pdfLinkRenderer: this.pdfLinkRenderer,
            isoDateRenderer : this.isoDateRenderer,
            arrayValueRenderer : this.arrayValueRenderer,
        }
    }

    /* private columnDefs : object[] = [
        {headerName: '_id', field: '_id', resizable: true, sortable: false},
        {headerName: 'doc_create_date', field: 'technical.doc_create_date', resizable: true, cellRenderer: 'dateRenderer'},
        {headerName: 'type_doc', field: 'technical.type_doc',resizable: true},
        {headerName: 'sender_doc_reference', field: 'technical.sender_doc_reference', resizable: true},
        {headerName: 'sender_id', field: 'technical.sender_id', resizable: true},
        {headerName: 'sender_name', field: 'technical.sender_name', resizable: true},
        {headerName: 'recipient_id', field: 'technical.recipient_id', resizable: true},
        {headerName: 'recipient_name', field: 'technical.recipient_name', resizable: true},
        {headerName: 'recipient_doc_reference', field: 'technical.recipient_doc_reference', resizable: true},
        {headerName: 'status', field: 'technical.status', resizable: true, sortable: false, valueFormatter: this.statusFormatter},
        {headerName: 'lien pdf', field: 'technical.contents', resizable: true, cellRenderer: 'pdfLinkRenderer'},
        {headerName: 'detail', field: 'detail', resizable: true, cellRenderer : 'eyeIconRenderer'}
    ];
 */

    private onFirstDataRendered(params) {
        //resizing columns to fit, it is mandatory fro this component - we have to wait until it's attached to DOM
        if(!this.isMobile())
            params.api.sizeColumnsToFit();

        params.api.setSortModel(this.initialSort);

    }

    private onGridReady(params) {
        params.api.setSortModel(this.initialSort);
    }

    @Watch('columnDefs')
    private onColumnDefChange() {
        this.agGrid.gridOptions.api.setColumnDefs(this.columnDefs);
        this.agGrid.gridOptions.api.sizeColumnsToFit();
    }

    @Watch('initialSort')
    private onSortChange() {
        let api = this.agGrid.gridOptions.api;
        api.setSortModel(this.initialSort);
    }

    @Emit()
    private onSortChanged(event : any) : object[] {
        let sortModel = event.api.getSortModel();
        return sortModel;
    }

    @Emit()
    private columnMoved(event : any) : string[] {
        return event.columnApi.getColumnState().map( (item : any) => {
            return item.colId
        });
    }

    @Emit()
    private onCellClicked(event : any) : any {
        return event;
    }

    private isMobile() {
        if( screen.width <= 760 ) {
            return true
        } else {
            return false
        }
    }

    private isoDateRenderer(params : any) : any {
        return new Date(params.value).toLocaleString('fr-FR');
    }

    private statusFormatter(params : any) : string {
        let result : string[] = [];
        for(let i=0 ; i< params.value.length ; i++) {
            let arrayValue = params.value[i];
            result.push(arrayValue.code as string);
            result.push(' : ');
            result.push(arrayValue.value as string);
            result.push('\n');
        }
        return result.join('');
    }

    private arrayValueRenderer(params : any) : string {
        let result : string[] = [];
        let pathTokens = params.colDef.colId.split('\.');

        let nodeArray = [];
        let rowData = params.data;
        let currentNode = rowData;
        for(let i=0 ; i<pathTokens.length-1 ; i++) {
            let currentPath = pathTokens[i];
            currentNode = currentNode[currentPath];
        }

        if(currentNode)
            nodeArray = currentNode;

        let valueKey = pathTokens[pathTokens.length-1];
        for(let i=0 ; i< nodeArray.length ; i++) {
            let arrayValue = nodeArray[i];
            result.push(arrayValue[valueKey] as string);
            result.push('<br\>');
        }
        return result.join('');
    }

    private eyeIconRenderer() : any {
        return '<a><svg aria-hidden="true" style="font-size:20px;margin: 13px;" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-file-pdf fa-w-12"><path fill="currentColor" d="' + eyeSvg + '"></path></svg></a>';    }

    private pdfLinkRenderer(params : any) : string {
        if(params.value && params.value.length) {
            let invoicePdf = null;
            for(let i=0 ; i<params.value.length ; i++) {
                let elInArray = params.value[i];
                if(elInArray.type === "INVOICE_PDF") {
                     return '<a>' + this.downloadIcon() + '</a>';
                }
            }
        }
        return '-';
    }

    private downloadIcon() : string {
        return '<svg aria-hidden="true" style="font-size:25px;margin: 10px;" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-file-pdf fa-w-12"><path fill="currentColor" d="' + fileDownloadSvg + '"></path></svg>';
    }

}
</script>

<style>

.ag-cell a {
    color: #252525;
}


.ag-cell:hover a {
    color: #21b8cf !important;
}



</style>
