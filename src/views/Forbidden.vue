<template>
    <b-container>
        <fixed-background></fixed-background>
        <b-row class="small-kiss-container p-0" align-h="end" no-gutters>
            <b-col cols="auto" class="p-0 m-0" align-self="end">
                <lang-dropdown size="sm"></lang-dropdown>
            </b-col>
        </b-row>

        <b-row class="small-kiss-container form-content mt-4">
            <h2>{{ $t('view.forbidden.title') }}</h2>
            <p>{{ $t('view.forbidden.body') }}</p>
            <p>
                <router-link to="/search/documents"><font-awesome-icon class="responsiveIcon" icon="chevron-left" />
                    {{ $t('view.notFound.backlink') }}
                </router-link>
            </p>
        </b-row>


  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model } from 'vue-property-decorator';
import FixedBackground from '@/components/FixedBackground.vue';
import LangDropdown from './../components/dropdown/LangDropdown.vue'

@Component({components : {
    FixedBackground,
    LangDropdown
}})
export default class Forbidden extends Vue {

}
</script>

<style>

</style>
