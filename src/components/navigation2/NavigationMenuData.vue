<template>
    <li class="nav-item dropdown nav-item-square" :class="isOpen ? 'show' : ''" v-click-outside="onClickOutside">
        <a 
            @click="isOpen = !isOpen" 
            href="#" 
            class="nav-link dropdown-toggle"
            data-toggle="dropdown" 
            :aria-expanded="isOpen ? 'true' : 'false'"
        >
            <font-awesome-icon v-if="menuData.icon" :icon="menuData.icon.name" />
            {{ $t(menuLabelKey) }}
        </a>
        <div 
            class="dropdown-menu" 
            :class="isOpen ? 'show' : ''">

            <template v-for="(subMenu, index) in menuData.subMenu">
                <div class="dropdown-divider" v-if="subMenu.separator" :key="index"></div>
                <a class="dropdown-item"
                    v-else
                    :key="index"
                    @click="changedDataValue(menuData.dataName, subMenu.value)"
                    :to="subMenu.placeholder"
                >
                    <font-awesome-icon v-if="subMenu.icon" :icon="subMenu.icon.name" />
                    {{ $t(subMenu.labelKey) }}
                </a>
            </template>

        </div>
    </li>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { ChangedDataValueEvent } from './ChangedDataValueEvent';
import { NavigationMenu } from './NavigationConf';

@Component
export default class NavigationMenuData extends Vue {

    @Prop()
    private menuData !: NavigationMenu;

    private selectedDataValue : any = this.menuData.defaultValue;

    private isOpen : boolean = false;
    private onClickOutside () {
        this.isOpen = false;
    }

    private selectSubMenu() {
        this.isOpen = false;
    }

    private get menuLabelKey() : string {
        let correspondingSubmenu = this.menuData.subMenu
                .filter(subMenu => subMenu.value === this.selectedDataValue);

        return correspondingSubmenu[0].labelKey;    
    }

    @Emit()
    private changedDataValue(dataName, dataValue) : ChangedDataValueEvent {
        this.isOpen = false;
        this.selectedDataValue = dataValue;
        return new ChangedDataValueEvent(dataName, dataValue);
    }

}
</script>

<style>

</style>
