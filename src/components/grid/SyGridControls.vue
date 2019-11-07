<template>
    <b-col sm lg="auto">
        <!-- <b-button v-b-tooltip.hover title="Exporter les résultats (.pdf)" variant="default"><font-awesome-icon icon="file-pdf" /></b-button> -->
   <!--      <b-button v-b-tooltip.hover title="Exporter les résultats (.csv)" variant="default" @click="onCsvExport">
            <font-awesome-icon icon="file-excel" />
        </b-button> -->

        <b-dropdown 
            id="columnDropdown"
            ref="columnDropdown"
            text="Gérer les colonnes" 
            variant="light"
            right
            @hide="beforeHide"
            @toggle="columnDropdownOpen = !columnDropdownOpen"
            v-click-outside="clickOutsideDropdown"
        >

            <template v-for="(column,index) in columnsList">
                <b-dropdown-item v-if="column.key" @click="onColumnToggle(column.key, column.label)" :key="index">

                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="customCheck1" 
                            v-model="columnToggleData[column.key]"
                            :true-value="true"
                            :false-value="false">
                        <label class="custom-control-label font-weight-normal" for="customCheck1">{{column.label}}</label>
                    </div>

                </b-dropdown-item>
                <b-dropdown-text v-else :key="index">
                    {{column.label}}
                </b-dropdown-text>
            </template>

            
        </b-dropdown>

        <valuated-dropdown 
            variant="light"
            size="default"
            :data="paginationData"
            :selected-data="selectedPagination"
            @changed-data-value="changedPagination($event)">
        </valuated-dropdown>
        <b-button v-b-tooltip.hover title="Réinitialiser l'affichage" variant="default" @click="onRefresh">
            <font-awesome-icon icon="sync" />
        </b-button>
    </b-col>
</template>

<script lang="ts">

import { Component, Prop, Vue, PropSync, Model, Watch, Emit, Ref } from 'vue-property-decorator';
import { ValuatedDropdownData, ValuatedDropdownDataEntry } from '@/components/dropdown/ValuatedDropdownData';
import { ColumnToChoose, ColumnToChooseToogleEvent } from '@/model/grid/GridColumns';
import ValuatedDropdown from '@/components/dropdown/ValuatedDropdown.vue';



@Component({components: {
    ValuatedDropdown
}})
export default class SyGridControls extends Vue {

    @Prop()
    private columnsList !: ColumnToChoose[]; /* = [
        {label: 'Technical'},
        {key: 'technical.doc_create_date', label: 'Date de création'},
        {key: 'technical.key2', label: 'Key2'},
        {key: 'technical.key3', label: 'Key3'},
        {label: 'Invoice'},
        {key: 'technical.key4', label: 'key3'},
        {key: 'technical.key5', label: 'key4'}
    ]; */


    @PropSync('columnToggle')
    private columnToggleData !: object;

    @Ref('columnDropdown')
    private columnDropdown : any;

    private columnDropdownOpen : boolean = false;


    private perPage : number = 10;

    private selectedPagination : ValuatedDropdownDataEntry = {data: 10, label: "component.grid.pagination.10l"};
    private paginationData : ValuatedDropdownData = {
        entries : [
            { data: 10, label: "component.grid.pagination.10l"},
            { data: 20, label: "component.grid.pagination.20l"},
            { data: 50, label: "component.grid.pagination.50l"},
            { data: 100, label: "component.grid.pagination.100l"},
            { data: 1000, label: "component.grid.pagination.1000l"}
        ]
    };

    private beforeHide(event : Event) {
        if(this.columnDropdownOpen == true) {
            //prevents dropdown hiding when clicking on item
            event.preventDefault();
        }
    }

    private clickOutsideDropdown() {
        this.columnDropdownOpen = false;
    }

    @Emit()
    private onColumnToggle(key : string, label: string) : ColumnToChooseToogleEvent {
        //toggle
        this.columnToggleData[key] = !this.columnToggleData[key];

        return {
            key: key,
            label: label,
            selected: this.columnToggleData[key]
        }
    }

    @Emit()
    private changedPagination(changedData : ValuatedDropdownDataEntry) : number {
        return changedData.data;
    }

    @Emit()
    private onCsvExport() {

    }

    @Emit()
    private onRefresh() {

    }

  /*   @Watch('perPage')
    private onPerPageChange(currentPageNew : number) {
        this.fetchData();
    } */


}
</script>

<style>
#columnDropdown > ul.dropdown-menu.dropdown-menu-right.show{
    max-height: 300px;
    overflow-y: scroll;
}
</style>