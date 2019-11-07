<template>
    <valuated-dropdown 
        variant="light"
        :same-width-as-button="true"
        :size="size"
        :data="languagesDropdownData"
        :selected-data="selectedLangageData"
        @changed-data-value="changedLanguage($event)">
    </valuated-dropdown>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model } from 'vue-property-decorator';
import FixedBackground from './FixedBackground.vue';
import { ValuatedDropdownData, ValuatedDropdownDataEntry } from './ValuatedDropdownData'
import ValuatedDropdown from './ValuatedDropdown.vue'

@Component({components : {
    ValuatedDropdown
}})
export default class LangDropdown extends Vue {

    @Prop({default: 'sm'})
    private readonly size !: string;

    private languagesDropdownData : ValuatedDropdownData = {
        entries : [
            { data: 'en', label: "header.menu.global.language.en"},
            { data: 'fr', label: "header.menu.global.language.fr"},
        ]
    };

    private get selectedLangageData() : ValuatedDropdownDataEntry {
        let selected = this.languagesDropdownData.entries.filter( dataEntry => dataEntry.data === this.$i18n.locale);
        if(selected.length === 1)
            return selected[0];

        return this.languagesDropdownData.entries[0];
    }

    private changedLanguage(languageSelected : ValuatedDropdownDataEntry) {
        this.$i18n.locale = languageSelected.data;
    }

}
</script>

<style>

</style>
