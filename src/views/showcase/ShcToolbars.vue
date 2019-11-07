<template>
    <b-container class="form-content">
      <b-row class="form-title">
        <h2 class="col-md-6">Toolbars</h2>
      </b-row>
      <b-row>
          <b-col>
              <legend>Toolbar de boutons</legend>
              <p>
                  <b-button v-b-tooltip.hover title="Ajouter" variant="default"><font-awesome-icon icon="plus" /></b-button>

                  <b-button v-b-tooltip.hover title="Supprimer" variant="default"><font-awesome-icon icon="trash" /></b-button>
                  
                  <b-button v-b-tooltip.hover title="Editer" variant="default"><font-awesome-icon icon="pen" /></b-button>
                  
                  <b-button v-b-tooltip.hover title="Exporter en PDF" variant="default"><font-awesome-icon icon="file-pdf" /></b-button>
                  
                  <b-button v-b-tooltip.hover title="Exporter en format Excel" variant="default"><font-awesome-icon icon="file-excel" /></b-button>
                  
                  <b-button v-b-tooltip.hover title="Gérer les colonnes" variant="default"><font-awesome-icon icon="table" /></b-button>
                  
                  <b-button v-b-tooltip.hover title="Réinitialiser l'affichage" variant="default"><font-awesome-icon icon="sync" /></b-button>

                  <b-dropdown text="Dropdown" variant="default">
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                </b-dropdown>

                <b-btn-group>
                    <b-button v-b-tooltip.hover title="Précédent" variant="default"><font-awesome-icon icon="chevron-left" /></b-button>
                    <b-button v-b-tooltip.hover title="Suivant" variant="default"><font-awesome-icon icon="chevron-right" /></b-button>
                </b-btn-group>

                <b-button variant="default">
                    <font-awesome-icon icon="comment" />
                    Messagerie
                    <span class="badge badge-primary badge-pill">2</span>
                </b-button>

                <b-button variant="default">
                    <font-awesome-icon icon="calendar" />
                    Historique
                </b-button>
              </p>
          </b-col>
      </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model } from 'vue-property-decorator';

@Component
export default class ShcToolbars extends Vue {
    
}
</script>

<style>

</style>
