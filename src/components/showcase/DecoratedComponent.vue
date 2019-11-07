<template src="./commonTemplate.html">
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class DecoratedComponent extends Vue {

    private pageTitle : string = 'Exemple .vue avec typescript & decorateurs';
    private buttonChecked : boolean = false;

    get pageTitleUpper () : string {
        return this.pageTitle.toUpperCase();
    }

    get buttonText() : string {
        return this.buttonChecked ? 'Inactive' : 'Active';
    }

}
</script>


<style>

</style>
