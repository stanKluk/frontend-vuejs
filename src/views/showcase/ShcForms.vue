<template>
    <b-container class="form-content">
      <b-row class="form-title">
        <h2 class="col-md-6">Formulaires</h2>
      </b-row>
      <b-row>
          <b-col lg="6">
              <legend>Champs</legend>
              <label for="email">Adresse email *</label>
              
              <b-form-group>
                <b-form-input
                    id="email"
                    aria-describedby="email-input-live-help"
                    placeholder="Adresse email"
                ></b-form-input>
                <b-form-text id="email-input-live-help">Votre adresse email professionnelle</b-form-text>
              </b-form-group>

              <b-form-group>
                <label for="password">Mot de passe</label>
                <b-form-input id="password" type="password" placeholder="Mot de passe"></b-form-input>
              </b-form-group>

              <b-form-group>
                <label for="select">Select</label>
                <b-form-select id="select" v-model="selected" :options="options"></b-form-select>
              </b-form-group>

              <b-form-group>
                <label for="multiSelect">Multiple select</label>
                <b-form-select id="multiSelect" v-model="selectedMultiple" :options="options" multiple :select-size="4"></b-form-select>
              </b-form-group>
              
              <b-form-group>
                <label for="textarea">Textarea</label>
                <b-form-textarea
                    id="textarea"
                    v-model="file"
                    placeholder="Enter something..."
                    rows="3"
                    max-rows="6"
                    >
                </b-form-textarea>
              </b-form-group>

              <b-form-group>
                <label for="defaultFileInput">Default file input</label>
                <b-form-file id="defaultFileInput" v-model="file2" plain></b-form-file>
                <b-form-text id="defaultFileInput">This is some placeholder block-level help text for the above input.</b-form-text>
              </b-form-group>

              <b-form-group>
                <label for="defaultFileInput">Classic file input</label>
                <b-form-file 
                    v-model="file"
                    :state="Boolean(file)"
                    placeholder="Choisir un fichier"
                    browse-text="Choisir"
                    drop-placeholder="Drop file here..."
                    ></b-form-file>
              </b-form-group>

              <label>Button File input</label>
              <div class="form-group">
                  <!-- This button must be handled specifically -->
                  <input type="file" class="custom-file-input button-file-input" id="inputGroupFile01">
                  <label class="btn btn-secondary" for="inputGroupFile01">Choisir un fichier</label>
              </div>

              <h1>Champs + boutons</h1>
                
                <b-form-group>
                  <label for="date">Select Date Range</label>
                  <b-input-group class="mt-3">
                    <v-date-picker
                    v-model="dateValue">
                    <input type="text" 
                      class="form-control"
                      id="date"
                      slot-scope="{ inputProps, inputEvents, isDragging }"
                      v-bind="inputProps"
                      v-on="inputEvents"
                    >
                  </v-date-picker>
                    <b-input-group-append>
                      <b-button variant="secondary"><font-awesome-icon icon="calendar" /></b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>


                <b-input-group class="mt-3">
                  <b-input placeholder="this one doesn't work but has a better ui"></b-input>
                  <b-input-group-append>
                    <b-button variant="secondary"><font-awesome-icon icon="calendar" /></b-button>
                  </b-input-group-append>
                </b-input-group>


                <b-input-group class="mt-3">
                  <b-form-input></b-form-input>
                  <b-input-group-append>
                    <b-dropdown text="Dropdown" variant="secondary">
                      <b-dropdown-item>Dropdown link</b-dropdown-item>
                      <b-dropdown-item>Dropdown link</b-dropdown-item>
                    </b-dropdown>
                  </b-input-group-append>
                </b-input-group>


                <b-input-group class="mt-3">
                  <b-dropdown slot="prepend" text="Dropdown" variant="info" v-for="i in 2" :key="i">
                    <b-dropdown-item>Action A</b-dropdown-item>
                    <b-dropdown-item>Action B</b-dropdown-item>
                  </b-dropdown>

                  <b-form-input></b-form-input>

                  <b-dropdown slot="append" text="Dropdown" variant="outline-secondary" v-for="i in 2" :key="i">
                    <b-dropdown-item>Action C</b-dropdown-item>
                    <b-dropdown-item>Action D</b-dropdown-item>
                  </b-dropdown>
                </b-input-group>
               

          </b-col>
          <b-col lg="4" offset-lg="1">
              <legend>Etats</legend>
              <b-form-group>
                <label for="testDisabled">Disabled</label>
                <b-form-input id="testDisabled" disabled placeholder="Disabled"></b-form-input>
              </b-form-group>

              <b-form-group>
                <label for="testReadonly">Readonly</label>
                <b-form-input id="testReadonly" readonly placeholder="Readonly"></b-form-input>
              </b-form-group>
              
              <b-form-group>
                <label for="valid-input">Valide / non valide</label>
                <b-form-input 
                    id="valid-input" 
                    v-model="password" 
                    :state="validPassword" 
                    type="password" 
                    aria-describedby="valid-input-live-isInvalid valid-input-live-isValid"
                    value="valid-input"></b-form-input>

                <b-form-invalid-feedback id="valid-input-live-isInvalid">
                  Le mot de passe doit faire plus de 3 caractères
                </b-form-invalid-feedback>

              </b-form-group>

              <legend>Tailles</legend>
              <b-form-group>
                <label for="large">Large</label>
                <b-form-input id="large" placeholder="Large" size="lg"></b-form-input>
              </b-form-group>

              <b-form-group>
                <label for="default">Default</label>
                <b-form-input id="default" placeholder="Default"></b-form-input>
              </b-form-group>

              <b-form-group>
                <label for="small">Small</label>
                <b-form-input id="small" placeholder="Small" size="sm"></b-form-input>
              </b-form-group>

          </b-col>
      </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model, Ref } from 'vue-property-decorator';

@Component
export default class ShcToolbars extends Vue {
    
    private selected : string | null = null;
    private options : object[] = [
        { value: null, text: 'Please select an option', disabled: true },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
    ];
    private selectedMultiple : any[] = ['b',{ C: '3PO' }];

    //files
    private file = null;
    private file2 = null;

    //validate password state
    private password : string = '';
    get validPassword() : boolean {
        return this.password.length > 3;
    }


    private dateValue : Date = new Date();

    /* @Ref('datePicker')
    private datePicker!: VueComponent; */

    //datepicker language
    /* private languages = lang;
    private dateFormat : string = 'dd/MM/yyyy';
    @Ref('programaticOpen')
    private programaticOpen : any;
     */
/*     private openPicker() {
        /* this.programaticOpen.showCalendar(); 
        console.log(this.datePicker);
        this.datePicker.click();
    } */

}
</script>

<style>

</style>
