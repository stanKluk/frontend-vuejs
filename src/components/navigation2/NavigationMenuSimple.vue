<template>
    <li class="nav-item">
        <a 
            v-if="menuData.eventName"
            class="nav-link"
            @click="onCustomEvent(menuData.eventName)"
        >
            <font-awesome-icon v-if="menuData.icon" :icon="menuData.icon.name" />
            {{ $t(menuData.labelKey) }}
        </a>
        <router-link 
            v-else
            :to="menuData.placeholder"
            class="nav-link"
            :class="$route.path == menuData.placeholder ? 'active' : ''"
        >
            <font-awesome-icon v-if="menuData.icon" :icon="menuData.icon.name" />
            {{ $t(menuData.labelKey) }}
        </router-link>
    </li>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { NavigationMenu } from './NavigationConf';

@Component
export default class NavigationMenuSimple extends Vue {

    @Prop()
    private menuData !: NavigationMenu;

    @Emit()
    private onCustomEvent(eventName : string) : string {
        return eventName;
    }

}
</script>

<style>

</style>
