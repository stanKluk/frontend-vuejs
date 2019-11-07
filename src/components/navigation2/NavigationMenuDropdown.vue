<template>
    <li class="nav-item dropdown nav-item-square" :class="isOpen ? 'show' : ''" v-click-outside="onClickOutside">
        <a 
            @click="isOpen = !isOpen" 
            href="#" 
            class="nav-link dropdown-toggle"
            :class="active() ? 'active' : ''"
            data-toggle="dropdown" 
            :aria-expanded="isOpen ? 'true' : 'false'"
        >
            <font-awesome-icon v-if="menuData.icon" :icon="menuData.icon.name" />
            {{ $t(menuData.labelKey) }}
            <font-awesome-icon v-if="!isOpen" class="responsiveIcon" icon="chevron-right" />
            <font-awesome-icon v-else class="responsiveIcon" icon="chevron-down" />
        </a>
        <div 
            class="dropdown-menu" 
            :class="isOpen ? 'show' : ''"
        >

            <template v-for="(subMenu, index) in menuData.subMenu">
                <div class="dropdown-divider" v-if="subMenu.separator" :key="index"></div>
                <a class="dropdown-item"  
                    v-else-if="subMenu.eventName"
                    :key="index"
                    @click="onCustomEvent(subMenu.eventName)"
                >
                    <font-awesome-icon v-if="subMenu.icon" :icon="subMenu.icon.name" />
                    {{ $t(subMenu.labelKey) }}
                </a>
                <router-link  class="dropdown-item" 
                    v-else
                    :key="index"
                    :to="subMenu.placeholder"
                    @click.native="selectSubMenu"
                >
                    <font-awesome-icon v-if="subMenu.icon" :icon="subMenu.icon.name" />
                    {{ $t(subMenu.labelKey) }}
                </router-link>
            </template>

        </div>
    </li>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { NavigationMenu } from './NavigationConf';
import { ChangedDataValueEvent } from './ChangedDataValueEvent';

@Component
export default class NavigationMenuDropdown extends Vue {

    @Prop()
    private menuData !: NavigationMenu;

    private isOpen : boolean = false;
    private onClickOutside () {
        this.isOpen = false;
    }

    private selectSubMenu() {
        this.isOpen = false;
    }

    private active() : boolean {
        let subMenuPlaceholders : string[] = this.menuData.subMenu.map(subMenu => subMenu.placeholder);
        return subMenuPlaceholders.indexOf(this.$route.path) > -1;
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
