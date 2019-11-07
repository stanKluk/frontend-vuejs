<template>
    <b-dropdown 
        :text="$t(currentData.label)" 
        :variant="variant" 
        :size="size" 
        :right="menuAlignRight" 
        :left="!menuAlignRight"
        ref="dropdownElem"
    >
        <b-dropdown-item
            v-for="(dataEntry,index) in data.entries"
            :key="index"
            @click="changedDataValue(dataEntry)"
            :class="sameWidthAsButton ? 'sameWidthAsButton' : ''"
        >
            {{ $t(dataEntry.label) }}
        </b-dropdown-item>
        
    </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, PropSync, Ref } from 'vue-property-decorator';
import { ValuatedDropdownData, ValuatedDropdownDataEntry } from './ValuatedDropdownData'
import { BDropdown } from 'bootstrap-vue';

@Component
export default class ValuatedDropdown extends Vue {

    @Prop()
    private data !: ValuatedDropdownData;

    @Prop()
    private selectedData !: ValuatedDropdownDataEntry;

    private currentData : ValuatedDropdownDataEntry = this.selectedData;

    @Prop({default: 'primary'})
    private readonly variant !: string;

    @Prop({default: ''})
    private readonly size !: string;

    @Prop({default: true})
    private readonly menuAlignRight !: boolean;

    @Ref('dropdownElem')
    private dropdownElem !: BDropdown;

    @Prop({default: false})
    private sameWidthAsButton !: boolean;

    mounted() {
        if(this.sameWidthAsButton) {
            let dropdownHtml = this.dropdownElem.$el as HTMLElement;
            let ulChild = dropdownHtml.childNodes[2] as HTMLElement;
            ulChild.style.width = dropdownHtml.offsetWidth + 'px';
            ulChild.style.minWidth = dropdownHtml.offsetWidth + 'px';
        }
    }

    @Emit()
    private changedDataValue(dataEntry : ValuatedDropdownDataEntry) : any {
        this.currentData = dataEntry;
        return dataEntry;
    }

}
</script>

<style>

li.sameWidthAsButton a.dropdown-item{
    padding: 0.25rem 0.5rem;
}

</style>
