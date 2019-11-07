<template>
	<b-input-group-append>
		<b-dropdown variant="secondary" lazy>
			<b-dropdown-item-button 
				@click="changedFilterType('equals')" 
				:active="currentFilter == 'equals'">
				Egal à
			</b-dropdown-item-button>
			<b-dropdown-item-button 
				@click="changedFilterType('beginsWith')" 
				:active="currentFilter == 'beginsWith'">
				Commence par
			</b-dropdown-item-button>
			<b-dropdown-item-button 
				@click="changedFilterType('contains')" 
				:active="currentFilter == 'contains'">
				Contient
			</b-dropdown-item-button>
			<b-dropdown-item-button 
				@click="changedFilterType('regex')" 
				:active="currentFilter == 'regex'">
				Regex
			</b-dropdown-item-button>
		</b-dropdown>
	</b-input-group-append>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Model, PropSync, Watch } from 'vue-property-decorator';


export enum FilterType {
	equals = 'equals',
	beginsWith = 'beginsWith',
	contains = 'contains',
	regex = 'regex'
}

@Component({components : {
}})
export default class FilterTypeDropdown extends Vue {

/* 	@Prop()
	private path !: string; */

	@Prop({default : FilterType.equals})
	private filterType !: FilterType;

	private currentFilter : FilterType = this.filterType;

	@Watch('filterType')
	private resetCurrentFilter() {
		this.currentFilter = this.filterType;
	}

	@Emit()
	private changedFilterType(filterType : FilterType) : FilterType {
		this.currentFilter = filterType;
		return filterType;
	}
  
}
</script>

<style>

</style>
