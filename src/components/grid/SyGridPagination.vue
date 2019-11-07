<template>
    <b-form inline @submit="onSubmit">
        <b-button variant="default" @click="stepFirstClick" :disabled="currentPageValue <= 1"><font-awesome-icon icon="step-backward" /></b-button>&nbsp;

        <b-button variant="default" @click="stepBackClick" :disabled="currentPageValue <= 1"><font-awesome-icon size="lg" icon="caret-left" />&nbsp;</b-button>&nbsp;

        <b-form-input id="small" class="m-auto" 
            @blur="onBlur()"
            v-model.number="currentPageInput" 
            type="number"
        >
        </b-form-input>&nbsp;/&nbsp;{{pageNumber}}&nbsp;

        <b-button variant="default" @click="stepForwardClick" :disabled="currentPageValue >= pageNumber">&nbsp;<font-awesome-icon size="lg" icon="caret-right" /></b-button>&nbsp;

        <b-button variant="default" @click="stepLastClick" :disabled="currentPageValue >= pageNumber"><font-awesome-icon icon="step-forward" /></b-button>
    </b-form>
</template>

<script lang="ts">

import { Component, Prop, Vue, PropSync, Model, Watch, Emit } from 'vue-property-decorator';

@Component
export default class SyGridPagination extends Vue {

    @Prop()
    private currentPage !: number;

    @Prop()
    private pageNumber !: number;

    private currentPageInput : number = this.currentPage;

    private currentPageValue : number = this.currentPage;

    private onBlur() {
        this.currentPageValue = this.currentPageInput;
    }

    @Watch('currentPageValue')
    @Emit()
    private pageChanged(currentPageValue : number) : number {

        if(currentPageValue < 1)
            currentPageValue = 1;

        if(currentPageValue > this.pageNumber)
            currentPageValue = this.pageNumber;


        this.currentPageValue = currentPageValue;
        this.currentPageInput = currentPageValue;
        return this.currentPageValue;
    }

    private stepFirstClick() {
        this.currentPageValue = 1;
    }

    private stepLastClick() {
        this.currentPageValue = this.pageNumber;
    }

    private stepBackClick() {
        this.currentPageValue--;
    }

    private stepForwardClick() {
        this.currentPageValue++;
    }

    private onSubmit(evt) {
        //prevents sending form
        evt.preventDefault();
        this.currentPageValue = this.currentPageInput;
    }

}
</script>

<style scoped>
#small {
    width: 80px;
}
</style>