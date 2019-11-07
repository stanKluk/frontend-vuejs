<template>
    <div>
		
        <b-row class="mb-4" align-h="between">
            <b-col class="pt-2 filter" sm="auto" cols="5">
                <span class="filter-count">{{data.length}} lignes</span>
            </b-col>
            <sy-grid-controls 
                :columns-list="columnsToChoose"
                :column-toggle.sync="columnsToggle"
                @on-column-toggle="onColumnToggle($event)"
                @changed-pagination="pagination = $event"
                @on-refresh="onGridColumnRefresh()">
            </sy-grid-controls>
        </b-row>

        <!-- 
            ref="agGrid" 
            id="agTable"
        
        -->
        <ag-grid-vue style="width: 100%;"
            
            class="ag-theme-balham"
            
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


        <b-row align-h="center" class="mt-3">
            <sy-grid-pagination
                :current-page="currentPage"       
                :page-number="pageNumber"     
                @page-changed="pageChanged($event)"
            >
            </sy-grid-pagination>
        </b-row>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model, Watch } from 'vue-property-decorator';
import SyGridPagination from '@/components/grid/SyGridPagination.vue';
import SyGridControls  from '@/components/grid/SyGridControls.vue';
import { ColumnToChoose, ColumnToChooseToogleEvent, GridColumns } from '@/model/grid/GridColumns';
import { Dictionary, Attribute, AttributeLabel, AttributeType } from '@/model/dictionary/Dictionary';

@Component({components : {
	SyGridControls,
	SyGridPagination,
}})
export default class CompositeGrid extends Vue {

    @Prop()
    private data !: [];

    @Prop()
    private compositeAttribute !: Attribute;

    private currentPage : number = 1;

    private gridOptions : object = {
        suppressCellSelection: true,
        defaultColDef : {
            sortable: true
        },
        components: {
            isoDateRenderer : this.isoDateRenderer,
            arrayValueRenderer : this.arrayValueRenderer,
        }
    }

	constructor() {
		super();
	}

	mounted() {
		this.retrieveLocalStorage();
	}

	private retrieveLocalStorage() {

	}


	private get pageNumber() : number {
        return 1 ;//Math.floor(this.rows/this.pagination) + ((this.rows % this.pagination) == 0 ? 0 : 1);
    }

	private attributeLabel(attribute : Attribute) : string {
		return Dictionary.attributeLabel(attribute);
    }
    
    private isoDateRenderer(params : any) : any {
        return new Date(params.value).toLocaleString('fr-FR');
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

}
</script>

<style>

</style>
