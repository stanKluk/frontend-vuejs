<template>
    <nav class="main-nav">
        <!-- BARRE HAUT -->
        <div class="header-top">

            <div class="header-top-right">
                <!-- Lien - Dropdown -->
                <navigation-menu-user 
                    v-if="menuAccount[0]" 
                    :menu-data="menuAccount[0]"
                    :user-name="$session.firstName + ' ' + $session.lastName"
                    :user-enterprise="$session.company"
                >
                </navigation-menu-user>

                <navigation-menu-holder
                        v-for="(menu,index) in menuGlobal"
                        :key="index"
                        :menu-data="menu"
                        @on-custom-event="emittedEvent($event)"
                        @changed-data-value="changedDataValue($event)"
                    >
                </navigation-menu-holder>

            </div>
            
            <!-- Logo -->
            <a class="nav-logo" href="#">
            </a>
            
        </div>
        <!-- BARRE BAS -->
        <div v-click-outside="onClickOutsideResponsiveMenu">
            <div class="header-menu navbar navbar-expand-lg">
                <!-- Trigger Mobile -->
                <button 
                    class="navbar-toggler hamburger-header" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#navbarResponsive" 
                    aria-controls="navbarResponsive" 
                    :aria-expanded="responsiveMenuOpen ? true : false" 
                    @click="responsiveMenuOpen = !responsiveMenuOpen"
                    aria-label="Toggle navigation">
                    <span></span><span></span><span></span>
                </button>
                <!-- Navbar-collapse -->
                <div 
                    class="collapse navbar-collapse"  
                    id="navbarResponsive"
                    :class="responsiveMenuOpen ? 'show' : ''"
                >
                    <ul class="navbar-nav">
                        <!-- Lien -->

                        <navigation-menu-holder
                            v-for="(menu,index) in menuApplication"
                            :key="index"
                            :menu-data="menu"
                            @on-custom-event="emittedEvent($event)"
                            @changed-data-value="changedDataValue($event)"
                        >
                        </navigation-menu-holder>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import 'bootstrap-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import { NavigationConf, NavigationMenu, MenuType } from './NavigationConf';
import { ChangedDataValueEvent } from './ChangedDataValueEvent'
import NavigationMenuHolder from './NavigationMenuHolder.vue';
import NavigationMenuDropdown from './NavigationMenuDropdown.vue';
import NavigationMenuUser from './NavigationMenuUser.vue';
import { Route } from 'vue-router';

@Component({components: 
    {
        NavigationMenuHolder,
        NavigationMenuDropdown,
        NavigationMenuUser
    }
})
export default class Navigation extends Vue {

    private responsiveMenuOpen : boolean = false;
    private onClickOutsideResponsiveMenu () {
        this.responsiveMenuOpen = false;
    }
    @Watch('$route')
    private onRouteChange() {
        this.responsiveMenuOpen = false;
    }

    private title : string = 'SY-Template';

    //menus
    private menuApplication : NavigationMenu[] = [];
    private menuGlobal : NavigationMenu[] = []; 
    private menuAccount : NavigationMenu[] = [];

    private userName : string = "Thierry de la street";
    private userEnterprise : string = 'Cegedim';

    constructor() {
        super();
        this.fetchData();
    }

    private fetchData() {
        this.$http.get('/api/applicationHeader').then((response : AxiosResponse) => {
            let navigationConf = response.data as NavigationConf;

            let menuLanguageArray = navigationConf.menu.GLOBAL.filter( menu => menu.dataName === 'language');
            if(menuLanguageArray && menuLanguageArray.length === 1) {
                menuLanguageArray[0].defaultValue = this.$i18n.locale;
            }

            this.title = navigationConf.title;
            this.menuApplication = navigationConf.menu.APPLICATION;
            this.menuGlobal = navigationConf.menu.GLOBAL;
            this.menuAccount = navigationConf.menu.ACCOUNT;

        }).catch((error : any) => {
            console.log(error);
        });

    }

    private changedDataValue(data : ChangedDataValueEvent) {
        switch (data.name) {
            case "language":
                this.$i18n.locale = data.value;
                break;
        
            default:
                break;
        }
    }

    private emittedEvent(eventName : string) {
        switch (eventName) {
            case "disconnect":
                this.$http.post('/logout');
                this.$session.invalidate();
                this.$router.push('/login');
                break;
        
            default:
                break;
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.nav-application-title {
    position: absolute;//absolute relative to logo
    left: 200px;
    bottom: 21px;
}

</style>
