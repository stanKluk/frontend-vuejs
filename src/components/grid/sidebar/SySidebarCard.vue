<template>
    <b-card no-body>
        <b-card-header header-tag="header" class="p-0" :class="isOpen ? 'open' : ''" role="tab">
            <a block href="#" v-b-toggle="uniqueId" aria-expanded="false" aria-controls="collapse2">
                <div class="card-header" :class="isOpen ? 'open' : ''" id="heading2">
                    {{ title }}
                    <font-awesome-icon v-if="!isOpen" class="icon mt-1" icon="chevron-down" size="sm" />
                    <font-awesome-icon v-else class="icon mt-1" icon="chevron-up" size="sm" />
                </div>
            </a>
        </b-card-header>
        <b-collapse :id="uniqueId" v-model="isOpen" accordion="my-accordion" role="tabpanel">
            <b-card-body>
                <slot></slot>
            </b-card-body>
        </b-collapse>
    </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model, Emit } from 'vue-property-decorator';

export interface CollapseEvent {
    collapseId: string;
    shown: boolean;
}

@Component
export default class SySidebarCard extends Vue {

    @Prop()
    private title !: string;

    private isOpen : boolean = false;

    private get uniqueId() : string {
        return this.uuidv4();
    }

    private uuidv4() : string{
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
</script>

<style>

</style>
