<template>
    <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top">
        <b-container fluid>
            <b-navbar-brand>{{title}}</b-navbar-brand>
            
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
               
                <navigation-menu-template 
                    :menu-data="menuApplication">
                </navigation-menu-template>

                <navigation-menu-template 
                    :menu-data="menuAccount" 
                    @changed-data-value="changedDataValue($event)"
                    @on-event="emittedEvent($event)"
                    class="ml-auto" 
                    dropdown-align="right">
                </navigation-menu-template>

            </b-collapse>
        </b-container>
    </b-navbar>
</template>

<script lang="ts">
import 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import { NavigationConf, NavigationMenu, MenuType } from './NavigationConf';
import { ChangedDataValueEvent } from './ChangedDataValueEvent'
import NavigationMenuTemplate from './NavigationMenuTemplate.vue';

@Component({components: {NavigationMenuTemplate}})
export default class Navigation extends Vue {

    private title : string = 'SY-Template';
    private defaultPlaceholder : string = '/home';

    //menus
    private menuApplication : NavigationMenu[] = [];
    private menuAccount : NavigationMenu[] = []; 


    constructor() {
        super();
        this.fetchData();
    }

    private fetchData() {
        this.$http.get('/api/applicationHeader').then((response : AxiosResponse) => {
            let navigationConf = response.data as NavigationConf;
            console.log(navigationConf);

            this.title = navigationConf.title;
            this.defaultPlaceholder = navigationConf.defaultPlaceholder;
            this.menuApplication = navigationConf.menu.APPLICATION;
            this.menuAccount = navigationConf.menu.ACCOUNT;

        }).catch((error : any) => {
            console.log(error);
        });
    }

    private changedDataValue(event : ChangedDataValueEvent) {
        switch (event.name) {
            case "language":
                this.$i18n.locale = event.value;
                break;
        
            default:
                break;
        }
    }

    private emittedEvent(eventName : string) {
        console.log("fired event " + eventName);
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
