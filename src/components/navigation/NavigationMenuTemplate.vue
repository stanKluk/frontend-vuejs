<template>
    <b-navbar-nav>
        <template v-for="(menu, index) in menuData">
            <b-nav-item 
                v-if="menu.subMenu.length == 0 && !menu.eventName"
                :key="index" 
                :to="menu.placeholder" >
                {{ $t(menu.labelKey) }}
            </b-nav-item>
            <b-nav-item 
                v-else-if="menu.subMenu.length == 0 && menu.eventName"
                :key="index" 
                @click="onEvent(menu.eventName)">
                {{ $t(menu.labelKey) }}
            </b-nav-item>
            <b-nav-item-dropdown 
                v-else
                :key="index" 
                :text="$t(menu.labelKey)" 
                :left="dropdownAlign === 'left'"
                :right="dropdownAlign === 'right'">
                <template v-for="(subMenu, index) in menu.subMenu">
                    <b-dropdown-divider v-if="subMenu.separator" :key="index"></b-dropdown-divider>
                    <b-dropdown-item 
                        v-else-if="subMenu.eventName"
                        :key="index"
                        @click="onEvent(subMenu.eventName)">>
                            {{ $t(subMenu.labelKey) }}
                    </b-dropdown-item>
                    <b-dropdown-item 
                        v-else-if="menu.dataName"
                        :key="index"
                        @click="changedDataValue(menu.dataName, subMenu.value)"
                        :to="subMenu.placeholder">
                            {{ $t(subMenu.labelKey) }}
                    </b-dropdown-item>
                    <b-dropdown-item 
                        v-else
                        :key="index"
                        :to="subMenu.placeholder">
                            {{ $t(subMenu.labelKey) }}
                    </b-dropdown-item>
                </template>
            </b-nav-item-dropdown>
        </template>
    </b-navbar-nav>
</template>

<script lang="ts">
import 'bootstrap-vue';
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import { NavigationMenu } from './NavigationConf'
import { ChangedDataValueEvent } from './ChangedDataValueEvent'

@Component
export default class NavigationMenuTemplate extends Vue {

    @Prop()
    private menuData !: NavigationMenu[];

    @Prop()
    private dropdownAlign !: string;

    @Emit()
    private changedDataValue(dataName, dataValue) : ChangedDataValueEvent {
        return new ChangedDataValueEvent(dataName, dataValue);
    }

    @Emit()
    private onEvent(eventName : string) : string {
        return eventName;
    }
}
</script>

<style>

</style>
