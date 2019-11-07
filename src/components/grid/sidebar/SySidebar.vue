<template>
    <div class="filter-container" :style="'position:' + position" :class="open ? 'open' : ''">
   
	<!-- BOUTONS -->
    <div class="filter-top">
		<button @click="open = false" class="exit btn-sidebar-trigger"  type="button" :title="closeTitle">
			<font-awesome-icon size="lg" icon="times" :style="{ color: 'rgba(255, 255, 255, 0.5)' }" />
		</button>
		<button @click="onReset" class="reinit" name="" type="button" :title="resetTitle">
			<font-awesome-icon icon="sync" :style="{ color: 'black' }" />
		</button>
		<button @click="onSearch" class="search" name="" type="button">
			{{ searchButtonTitle }}
		</button>
		
	</div>
	<!-- CONTENEUR DES FILTRES -->
	<div class="filter-content">
		<!-- accordion - cf. sidebar.js -->
		<div role="tablist" class="accordion" id="accordion">

			<b-card-body v-if="showDictionary">
				<b-form-group>
					<label for="dictionary">Dictionnaire</label>
					<b-form-select id="dictionary" 
						v-model="selectedDictionary" 
						:options="dictionaryList"
					></b-form-select>
				</b-form-group>
			</b-card-body>

			<!-- slot contains a list of sy-sidebar-card which will work as an accordion -->
			<slot></slot>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Model, PropSync } from 'vue-property-decorator';
import SySidebarCard from '@/components/grid/sidebar/SySidebarCard.vue'
import { CollapseEvent } from '@/components/grid/sidebar/SySidebarCard.vue'

@Component({components : {
	SySidebarCard
}})
export default class SySidebar extends Vue {

	@PropSync('isOpen')
	private open !: boolean;

	@Prop()
	private closeTitle !: string;

	@Prop()
	private resetTitle !: string;

	@Prop()
	private searchButtonTitle !: string;

	@Prop({default: false})
	private showDictionary !: boolean;

	@PropSync('dictionary')
	private selectedDictionary !: string;

	@Prop({default: function() {return []}})
	private dictionaryList !: string[];

	@Prop({default: "fixed"})
	private position !: string;

	@Emit()
	private onSearch() {
		
	}

	@Emit()
	private onReset() {
		
	}

  
}
</script>

<style>

</style>
