<template>
    <div class="nav-item nav-item-user dropdown"  :class="isOpen ? 'show' : ''" v-click-outside="onClickOutside">
        <a 
            @click="isOpen = !isOpen" 
            class="nav-link dropdown-toggle" 
            data-toggle="dropdown" href="#"
            :aria-expanded="isOpen ? 'true' : 'false'"
        >
            <div class="user-info">
                <font-awesome-icon icon="user" class="user-avatar" />
                <!-- <img class="user-avatar" src="img/avatar.jpg" /> -->
                <span class="user-name">{{ userName }}</span>
                <span class="user-company">{{ userEnterprise }}</span>
            </div>
            <div class="user-icon">
                <font-awesome-icon icon="user" />
            </div>
        </a>
        <div 
            class="dropdown-menu"
            :class="isOpen ? 'show' : ''"
        >
            <router-link 
                v-for="(subMenu, index) in menuData.subMenu"
                :key="index"
                :to="subMenu.placeholder"
            >
                {{ $t(subMenu.labelKey) }}
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { NavigationMenu } from './NavigationConf';
import { ChangedDataValueEvent } from './ChangedDataValueEvent';

@Component
export default class NavigationMenuUser extends Vue {

    @Prop()
    private menuData !: NavigationMenu;

    @Prop()
    private userName ?: string;

    @Prop()
    private userEnterprise ?: string;

    private isOpen : boolean = false;
    private onClickOutside () {
        this.isOpen = false;
    }

    private selectSubMenu() {
        this.isOpen = false;
    }

    @Emit()
    private onCustomEvent(eventName : string) : string {
        this.isOpen = false;
        return eventName;
    }

}
</script>

<style scoped>

</style>
