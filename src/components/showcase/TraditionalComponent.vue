<template src="./commonTemplate.html">
</template>

<script>
import Vue, { VNode } from 'vue'

export default {
    data () {
        return {
            pageTitle: 'Exemple .vue traditionnel',
            buttonChecked: true
        }
    },
  /*   methods: {
        greet () {
            return this.message + ' world';
        }
    }, */
    computed: {
        pageTitleUpper() {
            return this.pageTitle.toUpperCase();
        },
        buttonText() {
            return this.buttonChecked ? 'Inactive' : 'Active';
        }
    },
 /*    render (createElement) {
        return createElement('div', this.greeting);
    } */
}
</script>


<style>

</style>
