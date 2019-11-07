<template>
    <div>
		<sy-sidebar 
			:is-open.sync="openFilters" 
			reset-title="Réinitialiser les filtres"
			close-title="Fermer les filtres"
			search-button-title="Appliquer les filtres"
			@on-search="onSearch"
			@on-reset="onReset"
		>
			<sy-sidebar-card title="Test">
					<b-form-checkbox
						v-model="checkBoxStatus1"
						value="accepted"
						unchecked-value="not_accepted"
					>
						Émise
					</b-form-checkbox>
                    <b-form-checkbox
						v-model="checkBoxStatus2"
						value="accepted"
						unchecked-value="not_accepted"
					>
						Transmise
					</b-form-checkbox>
                    <b-form-checkbox
						v-model="checkBoxStatus3"
						value="accepted"
						unchecked-value="not_accepted"
					>
						Non conforme
					</b-form-checkbox>
                    <b-form-checkbox
						v-model="checkBoxStatus4"
						value="accepted"
						unchecked-value="not_accepted"
					>
						Litige
					</b-form-checkbox>
			</sy-sidebar-card>

			<sy-sidebar-card title="Text">
				<div class="form-group">
					<label>Montant TTC entre</label>
					<input type="text" class="form-control">
				</div>
				<div class="form-group">
					<label>et</label>
					<input type="text" class="form-control">
				</div>
				<div class="form-group">
					<label>Montant TVA entre</label>
					<input type="text" class="form-control">
				</div>
				<div class="form-group">
					<label>et</label>
					<input type="text" class="form-control">
				</div>
			</sy-sidebar-card>	

			<sy-sidebar-card title="Test 3">
				<b-form-group>
					<b-form-input
						id="email"
						aria-describedby="email-input-live-help"
						placeholder="Adresse email"
					></b-form-input>
					<b-form-text id="email-input-live-help">Votre adresse email professionnelle</b-form-text>
				</b-form-group>

				<b-form-group>
					<label for="select">Select</label>
					<b-form-select id="select" v-model="selected" :options="options"></b-form-select>
				</b-form-group>

				<b-form-group>
					<label for="multiSelect">Multiple select</label>
					<b-form-select id="multiSelect" v-model="selectedMultiple" :options="options" multiple :select-size="4"></b-form-select>
				</b-form-group>
			</sy-sidebar-card>	
			
		</sy-sidebar> <!-- @on-close="openFilters = false" -->
		<ag-grid @open-filters="userFilterTrigger"></ag-grid>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model } from 'vue-property-decorator';
import SySidebar from '@/components/grid/sidebar/SySidebar.vue';
import SySidebarCard from '@/components/grid/sidebar/SySidebarCard.vue';
import AgGrid from '@/views/showcase/AgGrid.vue';

@Component({components : {
	SySidebar,
	SySidebarCard,
	AgGrid
}})
export default class GridContainer extends Vue {

	private openFilters : boolean = false;

	//input data
	private checkBoxStatus1 : string = 'not_accepted';
	private checkBoxStatus2 : string = 'not_accepted';
	private checkBoxStatus3 : string = 'not_accepted';
	private checkBoxStatus4 : string = 'not_accepted';

	private selected : string | null = null;
    private options : object[] = [
        { value: null, text: 'Please select an option', disabled: true },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
    ];
    private selectedMultiple : any[] = ['b',{ C: '3PO' }];

	private userFilterTrigger() {
		this.openFilters = true;
	}

	private onSearch() {
		console.log("perform search");
	}

	private onReset() {
		console.log("perform reset");
	}
  
}
</script>

<style>

</style>
