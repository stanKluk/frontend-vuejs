<template>
  <div>
    <navigation></navigation>
    <router-view/>
    <sy-footer/>
  </div>
</template>


<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Navigation from '../components/navigation2/Navigation.vue';
    import SyFooter from '../components/SyFooter.vue';

    @Component({
        components: {Navigation, SyFooter}
    })
    export default class Home extends Vue {
    }
</script>


<style>

</style>
