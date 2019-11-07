<template>
    <div>
		<sy-sidebar 
			position="absolute"
			:is-open.sync="openFilters" 
			show-dictionary="true"
			:dictionary.sync="selectedDictionary"
			:dictionary-list="dictionaryList"
			reset-title="Réinitialiser les filtres"
			close-title="Fermer les filtres"
			search-button-title="Appliquer les filtres"
			@on-search="onSearch"
			@on-reset="onReset"
		>

			<sy-sidebar-card v-for="(composite,index) in dictionary" :key="index" :title="attributeLabel(composite)">

				<div v-for="(attr,index) in composite.attributs" :key="index" class="form-group">
					<label :for="attr.path">{{ attributeLabel(attr) }}</label>
					<el-date-picker
						v-if="attr.type === 'Date'"
						:id="attr.path"
						v-model="filters[attr.path]"
						:format="attr.path.startsWith('technical.') ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'"
						:type="attr.path.startsWith('technical.') ? 'datetimerange'  : 'daterange'"
						start-placeholder="Date début"
						end-placeholder="Date fin"
						style="width : 270px;">
					</el-date-picker>
					<b-form-select 
						v-else-if="attr.type === 'Boolean'"
						v-model="filters[attr.path]" 
						:id="attr.path"
						:options="booleanOptions"
					></b-form-select>
					<b-input-group v-else>
						<b-form-input 
							:value="filters[attr.path]"
							@change="changeFilter($event,attr.path)"
							:id="attr.path"
							:placeholder="attr.path" 
							:type="attr.type === 'Number' ? 'number' : 'text'"
						>
						</b-form-input>
						<filter-type-dropdown :filter-type="filtersType[attr.path]" @changed-filter-type="changedFilterType($event,attr.path)">
						</filter-type-dropdown>
						<b-input-group-append>
							<b-button @click="filters[attr.path] = null" variant="secondary"><font-awesome-icon icon="times" /></b-button>
						</b-input-group-append>
					</b-input-group>
				</div>
			
			</sy-sidebar-card>	

			
		</sy-sidebar> 
		<b-container fluid class="form-content">
			<b-row class="form-title">
				<h2 class="col-md-6">Factures en traitement</h2>
			</b-row>
			<b-row class="mb-4" align-h="between">
				<b-col class="pt-2 filter" sm="auto" cols="5">
					<b-button variant="primary" @click="openFilters = true">
						<font-awesome-icon icon="sliders-h" />
						Filtrer
					</b-button>
					<span class="filter-count">{{rows}} documents</span>
				</b-col>
				<sy-grid-controls 
					:columns-list="columnsToChoose"
					:column-toggle.sync="columnsToggle"
					@on-column-toggle="onColumnToggle($event)"
					@changed-pagination="pagination = $event"
					@on-csv-export="onCsvExport()"
					@on-refresh="onGridColumnRefresh()">
				</sy-grid-controls>
			</b-row>

			<b-row class="grid-top-filter mb-3">
				<b-col md="12">
					<b-alert 
						v-for="(filter,index) in criteria"
						:key="index"
						variant="light" 
						class="filter-label" 
						:show="true" 
						fade>
						{{index}}{{formatFilterType(index)}} {{formatFilterValue(filter)}}
					</b-alert>
					<!-- @dismissed="showDismissibleAlert=false" -->

				</b-col>
			</b-row>

			<documents-grid 
				:column-defs="columnDefs"
				:data="rowData"
				@on-sort-changed="onSortChange($event)"
				@on-cell-clicked="onCellClicked($event)"
				@column-moved="onColumnMoved"
				:initial-sort="gridSortObject"
			>
			</documents-grid>

			<doc-repo-ws-error-dialog :show-error.sync="remoteWsError" v-if="eventualErrorData != null" :eventual-error-data="eventualErrorData"></doc-repo-ws-error-dialog>

			<b-row align-h="center" class="mt-3">
				<sy-grid-pagination
					:current-page="currentPage"       
					:page-number="pageNumber"     
					@page-changed="pageChanged($event)"
				>
				</sy-grid-pagination>
			</b-row>
		</b-container>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model, Watch } from 'vue-property-decorator';
import SySidebar from '@/components/grid/sidebar/SySidebar.vue';
import { AxiosResponse } from 'axios';
import SySidebarCard from '@/components/grid/sidebar/SySidebarCard.vue';
import SyGridPagination from '@/components/grid/SyGridPagination.vue';
import DocumentsGrid from '@/views/document/DocumentsGrid.vue';
import SyGridControls  from '@/components/grid/SyGridControls.vue';
import { ColumnToChoose, ColumnToChooseToogleEvent, GridColumns } from '@/model/grid/GridColumns';
import { format } from 'path';
import { Dictionary, Attribute, AttributeLabel, AttributeType } from '@/model/dictionary/Dictionary';
import DocRepoWsErrorDialog, { ErrorData } from '@/components/DocRepoWsErrorDialog.vue';
import FilterTypeDropdown, { FilterType } from '@/components/grid/sidebar/FilterTypeDropdown.vue';


@Component({components : {
	SySidebar,
	SySidebarCard,
	SyGridControls,
	SyGridPagination,
	DocumentsGrid,
	DocRepoWsErrorDialog,
	FilterTypeDropdown
}})
export default class DocumentSearch extends Vue {

	private openFilters : boolean = false;
	private rowData : [] = [];
	private eventualErrorData : ErrorData | null = null;
	private remoteWsError : boolean = false;

	private currentPage : number = 1;
	private pagination : number = 10;
	private rows : number = 0;

	//dictionary
	private selectedDictionary : string = "STANDARD_LAD";
	private dictionaryList : string[] = [];
	private dictionary : Attribute[] | null = null;

	private filters : object = this.defaultFilters();
	private filtersType : object = {};
	private criteria : object = {};
	private sort : object = this.defaultSort();
	private gridSortObject : object[] = this.defaultSortOrder();
	private selectedColumnKeys : string[] = GridColumns.defaultSelectedColumns();
	private columnsToggle : object = {};

	private booleanOptions = [
		{value : true, text: "Oui"},
		{value : false, text: "Non"},
		{value : null, text: "-"}
	];

	constructor() {
		super();
	}

	mounted() {
		this.retrieveLocalStorage();
		this.getDictionariesList();
		this.getDictionary();
		this.cleanFilters();
		/* this.fetchData(); */ //no init fetch on mount, ag grid make an event onSortChange on init
	}

	private retrieveLocalStorage() {
		let savedDictionary = localStorage.getItem('savedDictionary');
		if(savedDictionary != null) {
			this.selectedDictionary = savedDictionary;
		}
		let savedFilters = localStorage.getItem('savedFilters');
		if(savedFilters != null) {
			this.filters = JSON.parse(savedFilters);
		}
		let savedFiltersType  = localStorage.getItem('savedFiltersType');
		if(savedFiltersType != null) {
			this.filtersType = JSON.parse(savedFiltersType);
		}

		let savedColumns = localStorage.getItem('selectedColumnKeys');
		if(savedColumns != null) {
			this.selectedColumnKeys = JSON.parse(savedColumns);
		}

		let savedSort = localStorage.getItem('searchDocumentSort');
		if(savedSort != null) {
			this.gridSortObject = JSON.parse(savedSort);
		}
		let savedSortRequest = localStorage.getItem('searchDocumentSortRequest');
		if(savedSortRequest != null) {
			this.sort = JSON.parse(savedSortRequest);
		}
	}


	private get pageNumber() : number {
        return Math.floor(this.rows/this.pagination) + ((this.rows % this.pagination) == 0 ? 0 : 1);
    }

	private reductDate (d : Date, dayReduct: number) : Date {
		let newDate : Date = new Date();
		newDate.setTime(d.getTime() - dayReduct * 24 * 60 * 60 * 1000);
		return newDate;
	};

	private cleanFilters() {
		let filterKeys = Object.keys(this.filters);
		let cleaned = {};
		for(let i=0 ; i<filterKeys.length ; i++) {
			let key = filterKeys[i];
			let value = this.filters[key];
			if(value !== null && value !== '') {
				if(value instanceof Date) {
					cleaned[key] = (value as Date).toISOString();
				} else {
					cleaned[key] = value;
				}
			}
		}
		this.criteria = cleaned;
	}

	private changeFilter(value : string, path : string) {
		this.filters[path] = value;
	}

	private changedFilterType(filterType : FilterType, path : string) {
		this.filtersType[path] = filterType;
		localStorage.setItem('savedFiltersType', JSON.stringify(this.filtersType))
	}

	private formatFilterValue(value : any) : string {
		if(value instanceof Array) {
			let formatted : string[] = [];
			formatted.push('"depuis le');
			formatted.push(new Date(value[0]).toLocaleString());
			formatted.push('"');
			formatted.push('"jusqu\'au');
			formatted.push(new Date(value[1]).toLocaleString());
			formatted.push('"');
			return formatted.join(' ');
		}
		return '"' + value + '"';
	}

	private formatFilterType(filterPath : string) {
		let existingFilter : FilterType = this.filtersType[filterPath];
		if(existingFilter) {
			switch (existingFilter) {
				case FilterType.beginsWith:
					return ", commence par :";
			
				case FilterType.contains:
					return ", contient :"

				case FilterType.regex:
					return ", regex :"

				default:
					return ":";
			}
		}
		return ":";
	}

	private defaultFilters() : object{
		return {
			"technical.status.code" : "FUNCTIONAL",
			"technical.doc_create_date" : [
				this.reductDate(new Date(), 1),
				new Date()
			]
		};
	}

	private defaultSortOrder() : object[] {
		return [{
			colId : "technical.doc_create_date",
			sort : "desc"
		}];
	}

	private defaultSort() : object{
		return {
			"technical.doc_create_date" : -1
		};
	}

	private getDictionariesList() {

		Dictionary.getDictionaryList().then( (response) => {
			this.dictionaryList = response;
		})
	}

	@Watch('selectedDictionary')
	private getDictionary() {
		Dictionary.getDictionary(this.selectedDictionary).then( (response) => {
			this.dictionary = response;
		});
		localStorage.setItem("savedDictionary", this.selectedDictionary);
	}

	private attributeLabel(attribute : Attribute) : string {
		return Dictionary.attributeLabel(attribute);
	}

	@Watch('pagination')
    private onPaginationChange(paginationNew : number) {
        this.fetchData();
	}
	
	private pageChanged(currentPageNew : number) {
		this.currentPage = currentPageNew;
        this.fetchData();
	}

	private onSortChange(event : object[]) {
		this.sort = {};
		for(let i=0 ; i<event.length ; i++) {
			let sortObj : any = event[i];
			this.sort[sortObj.colId] = sortObj.sort === "asc" ? 1 : -1;
		}
		localStorage.setItem("searchDocumentSort", JSON.stringify(event));
		localStorage.setItem("searchDocumentSortRequest", JSON.stringify(this.sort));
		this.fetchData();
	}

	private onCellClicked(event : any) {
		if(event.column.colId === "detail") {
			let documentId = event.data['_id'];
			if(documentId) {
				this.$router.push('/document/' + documentId);
			}
		} else if(event.column.colId === "technical.contents") {
			this.downloadContent(event);
		}
	}

	private downloadContent(event : any) {
		let invoicePdf = null;
		for(let i=0 ; i<event.value.length ; i++) {
			let elInArray = event.value[i];
			if(elInArray.type === "INVOICE_PDF") {
				let url = "/api/documents/download/" + event.data['_id'] + "/" + elInArray['file_identifier']
				this.$http.request({
					url: url,
					method: 'GET',
					responseType: 'blob', // important
				}).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					let contentDisposition : string= response.headers['content-disposition']
					let fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 'filename='.length);
					link.setAttribute('download', fileName); 
					document.body.appendChild(link);
					link.click();
					link.remove();
				}).catch((error : any) => {
					this.remoteWsError = true;
					this.eventualErrorData = error.data;
				});
			}
		}
	}

	private get columnsToChoose() : ColumnToChoose[] {
		if(this.dictionary != null)
			return Dictionary.columnsToChoose(this.dictionary);
		return [];
	}

	@Watch('dictionary')
	private createColumnsToggle() {
		if(this.dictionary != null) {
			this.columnsToggle = Dictionary.columnToggleObject(this.dictionary, this.selectedColumnKeys);
		}
	}
	
	private onColumnToggle(columnToggle : ColumnToChooseToogleEvent) {
		if(columnToggle.selected) {
			this.selectedColumnKeys.push(columnToggle.key);
		} else {
			let key = this.selectedColumnKeys.indexOf(columnToggle.key);
			this.selectedColumnKeys.splice(key, 1);
		}
		localStorage.setItem('selectedColumnKeys', JSON.stringify(this.selectedColumnKeys));
	}

	private get columnDefs() : object[] {
		if(this.dictionary != null)
			return GridColumns.createSearchDocumentColumns(this.dictionary, this.selectedColumnKeys);

		return GridColumns.defaultSearchDocumentColumns();
	}

	private onColumnMoved(newColOrder : string[]) {
		localStorage.setItem('selectedColumnKeys', JSON.stringify(newColOrder));
	}

	private onSearch() {
		this.cleanFilters();
		localStorage.setItem("savedFilters", JSON.stringify(this.filters));
		this.fetchData();
	}

	private onCsvExport() {
		console.log("export csv");
	}

	private onGridColumnRefresh() {
		this.selectedColumnKeys = GridColumns.defaultSelectedColumns();
		this.gridSortObject = this.defaultSortOrder();
		this.fetchData();
		localStorage.setItem('selectedColumnKeys', JSON.stringify(this.selectedColumnKeys));
	}

	private fetchData() {
		let searchRequest = {
			dictionaryKey : this.selectedDictionary,
			pageIndex : this.currentPage - 1,
			pageSize : this.pagination,
			query : this.criteria,
			filtersType: this.filtersType,
			sort : this.sort
		};

        this.$http.post('/api/documents/search', searchRequest ).then((response : AxiosResponse) => {
            this.rowData =  response.data.response.result;
            this.rows =  response.data.response.count;
        }).catch((error : any) => {
			this.remoteWsError = true;
			this.eventualErrorData = error.data;
        });
	}
	

	private onReset() {
		this.filters = this.defaultFilters();
		let fitlersTypeKeys = Object.keys(this.filtersType);
		for(let i=0 ; i<fitlersTypeKeys.length ; i++) {
			let key = fitlersTypeKeys[i];
			this.filtersType[key] = FilterType.equals;
		}
		localStorage.setItem('savedFiltersType', JSON.stringify({}));
	}
  
}
</script>

<style>

</style>
