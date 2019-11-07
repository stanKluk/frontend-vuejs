<template>
    <div id="fixedBackground" :class="backgroundClass">

    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class FixedBackground extends Vue {

    @Prop({default: 0})
    private variant !: number;

    private get backgroundClass() : string{
        if(this.variant > 4 || this.variant < 0)
            return 'variant-0';
        return 'variant-' + this.variant;
    }
    
}
</script>

<style scoped >
#fixedBackground {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -100;

}

.variant-0 {
    background: center/cover no-repeat fixed #f1f4f8;
    background-image: url(./../assets/images/bg/background.jpg);
}

.variant-1 {
    background: center/cover no-repeat fixed #f1f4f8;
    background-image: url(./../assets/images/bg/background1.jpg);
}

.variant-2 {
    background: center/cover no-repeat fixed #f1f4f8;
    background-image: url(./../assets/images/bg/background2.jpg);
}

.variant-3 {
    background: center/cover no-repeat fixed #f1f4f8;
    background-image: url(./../assets/images/bg/background3.jpg);
}

.variant-4 {
    background: center/cover no-repeat fixed #f1f4f8;
    background-image: url(./../assets/images/bg/background4.jpg);
}
</style>
