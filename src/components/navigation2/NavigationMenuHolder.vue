<template>
    <navigation-menu-simple
        v-if="menuData.subMenu.length == 0"
        :menu-data="menuData"
        @on-custom-event="onCustomEvent($event)"
    >
    </navigation-menu-simple>
    <navigation-menu-data
        v-else-if="menuData.dataName"
        :menu-data="menuData"
        @changed-data-value="changedDataValue($event)"
    >
    </navigation-menu-data>
    <navigation-menu-dropdown
        v-else
        :menu-data="menuData"
        @on-custom-event="onCustomEvent($event)"
    >
    </navigation-menu-dropdown>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { NavigationConf, NavigationMenu, MenuType } from './NavigationConf';
import { ChangedDataValueEvent } from './ChangedDataValueEvent'
import NavigationMenuDropdown from './NavigationMenuDropdown.vue';
import NavigationMenuSimple from './NavigationMenuSimple.vue';
import NavigationMenuData from './NavigationMenuData.vue';

@Component({components: 
    {
        NavigationMenuDropdown,
        NavigationMenuSimple,
        NavigationMenuData
    }
})
export default class NavigationMenuHolder extends Vue {

    @Prop()
    private menuData !: NavigationMenu;

    @Emit()
    private onCustomEvent(eventName : string) : string {
        return eventName;
    }
    @Emit()
    private changedDataValue(event : ChangedDataValueEvent) : ChangedDataValueEvent {
        return event;
    }

}
</script>

<style>

</style>
