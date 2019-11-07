<template>
  <div class="app">
    <router-view/>
  </div>
</template>


<script>
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component()
  export default class App extends Vue {
  }
</script>

<style lang="scss">

</style>
