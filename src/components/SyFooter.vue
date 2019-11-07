<template>
  <footer class="main-footer">
      <b-container fluid>
        <ul class="footer-copyright">
            <li>Cegedim © 2019</li>
            <li>Le portail SY by Cegedim est un service de Cegedim</li>
        </ul>
        <nav class="footer-nav">
            <ul>
              <li><a href="#">CGU</a></li>
              <li><a href="#" rel="noopener noreferrer" target="_blank">Service commercial Cegedim</a></li>
              <li><a href="#">Mentions légales</a></li>
              <li><a href="#" rel="noopener noreferrer" target="_blank">cegedim.fr</a></li>
            </ul>
        </nav>
      </b-container>
  </footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class SyFooter extends Vue {
  
}
</script>

<style>

</style>
