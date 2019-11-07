<template>
<b-modal v-model="remoteWsError" 
        title="Une erreur est survenue au niveau du web service" 
        header-bg-variant="danger"
        content-class="shadow"
        ok-only no-stacking
    >
        <!-- <div slot="modal-ok"></div> -->
        <b-row class="mb-2">
            <b-col>
                Code retour HTTP : <span class="font-weight-bolder">{{ eventualErrorData.httpCode }}</span> 
            </b-col>
        </b-row>
        <b-row class="mb-2">
            <b-col>
                Code retour fonctionnel {{ eventualErrorData.code }} : 
                <span class="font-weight-bolder">
                    {{ $t('docrepows.errors[' + eventualErrorData.code + ']')}} 
                </span>
            </b-col>
        </b-row>
        <b-row class="mb-2">
            <b-col>
                Message : <span class="font-weight-bolder"> {{ eventualErrorData.message }} </span>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                Id de la transaction : <span class="font-weight-bolder"> {{ eventualErrorData.transactionId }} </span>
            </b-col>
        </b-row>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model, Watch } from 'vue-property-decorator';


export interface ErrorData {
    httpCode ?: number;
    code ?: string;
    message ?: string;
    transactionId ?: string;
}

@Component({components : {

}})
export default class DocRepoWsErrorDialog extends Vue {

    @Prop()
    private eventualErrorData ?: ErrorData;

    @PropSync('showError')
    private remoteWsError !: boolean;
    
  
}
</script>

<style>

</style>
