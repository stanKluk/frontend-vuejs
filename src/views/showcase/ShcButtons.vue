<template>
  <b-container class="form-content">
    <b-row class="form-title"><h2 class="col-md-6">Boutons</h2></b-row>
      <b-row>
        <b-col lg="7">
            <legend>Boutons classiques</legend>
            <p>
                <b-button variant="primary">Primary</b-button>
                <b-button variant="secondary">Secondary</b-button>
                <b-button variant="default">Default</b-button>
            </p>
            <legend>Boutons moins classiques</legend>
            <p>
                <b-button variant="outline-secondary">Outline Secondary</b-button>
                <b-button variant="success">Success</b-button>
                <b-button variant="danger">Danger</b-button>
                <b-button variant="warning">Warning</b-button>
                <b-button variant="info">Info</b-button>
                <b-button variant="light">Light</b-button>
                <b-button variant="dark">Dark</b-button>
            </p>
            <legend>Boutons icones</legend>
            <p>
                <b-button variant="primary"><font-awesome-icon icon="plus" /></b-button> 
                <b-button variant="secondary"><font-awesome-icon icon="plus" /></b-button> 
                <b-button variant="default"><font-awesome-icon icon="plus" /></b-button>
            </p>
            <legend>Disabled</legend>
            <p>
                <b-button variant="primary" disabled>Primary</b-button> 
                <b-button variant="secondary" disabled>Secondary</b-button> 
                <b-button variant="default" disabled>Default</b-button>
            </p>
            <legend>Boutons liens</legend>
            <p>
                <b-button variant="link">Link</b-button>
                <b-button variant="link" class="btn-smooth">Link</b-button><!-- btn-smooth is not a real bootsrap class, but we can add our own -->
            </p>
            <legend>Tailles</legend>
            <p>
                <b-button variant="primary" size="sm">Bouton small</b-button> 
                <b-button variant="primary">Bouton default</b-button> 
                <b-button variant="primary" size="lg">Bouton large</b-button> 
            </p>
            <legend>Dropdowns</legend>
            <p>
                <b-dropdown text="Primary" variant="primary">
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                </b-dropdown>
                <b-dropdown text="Secondary" variant="secondary">
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                </b-dropdown>
                <b-dropdown text="Default" variant="default">
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                    <b-dropdown-item>Dropdown link</b-dropdown-item>
                </b-dropdown>
                <b-dropdown v-bind:text="dropdownSelectText" variant="default">
                    <b-dropdown-item v-on:click="changeDropdownText">Option 1</b-dropdown-item>
                    <b-dropdown-item v-on:click="changeDropdownText">Option 2</b-dropdown-item>
                    <b-dropdown-item v-on:click="changeDropdownText">Option 3</b-dropdown-item>
                    <b-dropdown-item v-on:click="changeDropdownText">Option 4</b-dropdown-item>
                </b-dropdown>
            </p>
        </b-col>
        <b-col lg="5">
            <legend>Groupe horizontal</legend>
            <b-btn-group>
                <b-button variant="default">Button</b-button>
                <b-button variant="default">Button</b-button>
                <b-button variant="default">Button</b-button>
            </b-btn-group>
            <legend>Groupe horizontal variante</legend>
            <b-btn-group>
                <b-button variant="outline-secondary">Button</b-button>
                <b-button variant="outline-secondary">Button</b-button>
                <b-button variant="outline-secondary">Button</b-button>
            </b-btn-group>
            <legend>Groupe vertical</legend>
            <b-btn-group vertical>
                <b-button variant="default">Button</b-button>
                <b-button variant="default">Button</b-button>
                <b-button variant="default">Button</b-button>
            </b-btn-group>
            <legend>Bouton block</legend>
            <p>
                <b-button block variant="primary" size="lg">Bouton block</b-button> 
            </p>
            <legend>Boutons checkbox</legend>
            <b-btn-group>
                <b-button variant="primary" :pressed.sync="buttonCheckBox1">Active</b-button>
                <b-button variant="primary" :pressed.sync="buttonCheckBox2">Check</b-button>
                <b-button variant="primary" :pressed.sync="buttonCheckBox3">Check</b-button>
            </b-btn-group>
            <legend>Boutons radio</legend>
            <b-btn-group>
                <b-button variant="primary" :pressed.sync="buttonRadio1" v-on:click="toggleRadio(1)">Active</b-button>
                <b-button variant="primary" :pressed.sync="buttonRadio2" v-on:click="toggleRadio(2)">Check</b-button>
                <b-button variant="primary" :pressed.sync="buttonRadio3" v-on:click="toggleRadio(3)">Check</b-button>
            </b-btn-group>
        </b-col>
      </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model } from 'vue-property-decorator';

@Component
export default class ShcButtons extends Vue {

    //checkbox
    private buttonCheckBox1: boolean = true;
    private buttonCheckBox2: boolean = false;
    private buttonCheckBox3: boolean = false;

    //radio buttons
    private buttonRadio1: boolean = true;
    private buttonRadio2: boolean = false;
    private buttonRadio3: boolean = false;

    private toggleRadio(nbr : number) {
        if(nbr === 1) {
            this.buttonRadio1 = true;
            this.buttonRadio2 = false;
            this.buttonRadio3 = false;
        } else if(nbr === 2) {
            this.buttonRadio1 = false;
            this.buttonRadio2 = true;
            this.buttonRadio3 = false;
        } else if(nbr === 3) {
            this.buttonRadio1 = false;
            this.buttonRadio2 = false;
            this.buttonRadio3 = true;
        }
        
    }

    //dropdown select
    private dropdownSelectText : string = "Dropdown select";

    private changeDropdownText(event : MouseEvent) {

        if(event.srcElement != null) {
            let srcElement = (<HTMLElement>event.srcElement);
            this.dropdownSelectText = srcElement.textContent != null ? srcElement.textContent : '';
        }
    }

}

</script>
