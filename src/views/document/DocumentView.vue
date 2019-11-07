<template>
        <b-container v-if="loadedDocument" fluid class="form-content">
            <b-tabs content-class="mt-3" fill>
                <b-tab title="Données" active>
                    <b-alert variant="danger" :show="true" v-if="eventualDictionaryCallError != null">
                        <h4 class="alert-heading">Erreur</h4>
                        <b-row class="mb-2">
                            <b-col>
                                Impossible d'afficher les données formattées car le modèle sémantique du document n'a pas pu être chargé. <br>
                                Vous pouvez toujours visualiser les données via les autres onglets. "Données brutes JSON" donne une vision complète mais technique du document.
                            </b-col>
                        </b-row>
                        <b-row class="mb-2">
                            <b-col>
                                Code retour HTTP : <span class="font-weight-bolder">{{ eventualDictionaryCallError.status }}</span> 
                            </b-col>
                        </b-row>
                        <b-row class="mb-2">
                            <b-col>
                                Type  : 
                                <span class="font-weight-bolder">
                                    {{ eventualDictionaryCallError.error }} 
                                </span>
                            </b-col>
                        </b-row>
                        <b-row class="mb-2">
                            <b-col>
                                Message : <span class="font-weight-bolder"> {{ eventualDictionaryCallError.message }} : {{ eventualDictionaryCallError. path}}</span>
                            </b-col>
                        </b-row>
                    </b-alert>

                    <template v-if="eventualDictionaryCallError == null">
                        <div
                            v-for="(composite, index) in dictionary"
                            :key="index"
                        >

                            <b-row>
                                <b-col>
                                    <h3 class="title-border">
                                        {{attributeLabel(composite)}}
                                    </h3>
                                </b-col>

                            </b-row>

                            <b-row v-if="composite.type == 'Composite' && composite.multi == true">
                                <b-col>
                                    TODO : grille {{composite.path}}
                                    <!-- <composite-grid
                                        :data="dataByPath(composite.path)"
                                        :composite-attribute="composite"
                                    >

                                    </composite-grid> -->
                                </b-col>
                            </b-row>

                            <b-row v-else>
                                <b-col 
                                    v-for="(attribute,index) in getSimpleAttrs(composite.attributs)" 
                                    :key="index"
                                    sm="12"
                                    md="6"
                                    lg="4"
                                    xl="3"
                                >
                                    <b-form-group>
                                        <label :for="attribute.path">{{attributeLabel(attribute)}}</label>
                                        <el-date-picker
                                            :id="attribute.path" 
                                            v-if="attribute.type === 'Date'"
                                            :value="dataByPath(attribute.path)" 
                                            @change="changeData($event,attribute.path,attribute.type)"
                                            :format="attribute.path.startsWith('technical.') ? 'dd/MM/yyyy HH:mm' : 'yyyy-MM-dd'"
                                            :type="attribute.path.startsWith('technical.') ? 'datetime'  : 'date'"
                                            >
                                        </el-date-picker>
                                        <b-form-input 
                                            v-else
                                            :value="dataByPath(attribute.path)" 
                                            :id="attribute.path" 
                                            :disabled="attribute.modifiable === false || !hasWritePrivilege"
                                            @change="changeData($event,attribute.path,attribute.type)"
                                            type="text"
                                        >
                                        </b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                                
                            
                        </div>
                    </template>
                </b-tab>
                <b-tab title="Evènements">
                </b-tab>
                <b-tab title="Contenu">
                </b-tab>
                <b-tab title="Données brutes JSON">
                    <v-jsoneditor ref="jsonEditor" v-model="documentData" :options="jsonEditoroptions" :plus="false"  @error="onJsonError"/>
                </b-tab>
                <b-tab v-if="dataChanged" title="Sauvegarder">
                    <vue-json-compare :oldData="initialDocumentData" :newData="documentData"></vue-json-compare>
                </b-tab>
            </b-tabs>
            
        </b-container>
        <doc-repo-ws-error-dialog v-else-if="eventualErrorData != null" :eventual-error-data="eventualErrorData"></doc-repo-ws-error-dialog>
        <div id="waitingClass" class="p-5 m-5" v-else>
            <font-awesome-icon icon="spinner" spin size="4x"/>
        </div>
</template>


<script lang="ts">
import {Component, Prop, Vue, Watch, Ref} from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import VJsoneditor from 'v-jsoneditor/src/index'
import DocRepoWsErrorDialog, { ErrorData } from '@/components/DocRepoWsErrorDialog.vue';
import vueJsonCompare from 'vue-json-compare';
import { Dictionary, Attribute, AttributeLabel, AttributeType } from '@/model/dictionary/Dictionary';
import { Attributes } from '@fortawesome/fontawesome-svg-core';
import { ObjectUtils } from '@/model/object/ObjectUtils';
import CompositeGrid from '@/views/document/CompositeGrid.vue';

@Component({components : {
        VJsoneditor,
        DocRepoWsErrorDialog,
        vueJsonCompare,
        CompositeGrid
    }
})
export default class DocumentView extends Vue {

    private eventualErrorData : ErrorData | null = null;
    private loadedDocument : boolean = false;
    private eventualDictionaryCallError : object | null = null;
    private loadedDictionary : boolean = false;

    private dictionaryKey : string = '';
    private dictionary : Attribute[] | null = null;

    private documentData : object = {};
    private initialDocumentData : object = {};
    private dataChanged : boolean = false;

    private hasWritePrivilege : boolean = false;

    private self : any = this;
    @Ref('jsonEditor')
    private jsonEditor : any;
    private jsonEditoroptions : object = {
        sortObjectKeys: false,
        enableSort: false,
        enableTransform: false,
        onChangeJSON : this.getOnChangeCallback()
    };

    mounted() {
        if(this.$session.hasAuthority('PRIVILEGE_READ') && this.$route.params['documentId']) {
            let documentId = this.$route.params['documentId'];
            this.fetchData(documentId);
        }
        if(this.$session.hasAuthority('PRIVILEGE_WRITE')) {
            this.hasWritePrivilege = true;
        } else {
            this.jsonEditoroptions['mode'] = 'view';
        }
    }

    private fetchData(documentId : string) {
        this.$http.get('/api/documents/get/' + documentId).then((axiosResponse : AxiosResponse) => {
            this.documentData = axiosResponse.data.response;
            this.initialDocumentData = ObjectUtils.deepCopy(this.documentData);
            this.dictionaryKey = axiosResponse.data.response.model.dictionaryKey;
            this.loadedDocument = true;
            Dictionary.getDictionary(this.dictionaryKey).then( (response) => {
                let rawDictionary = response;
                this.dictionary = rawDictionary.filter((composite) => {
                    return composite.path !== 'technical.events';
                });
                this.loadedDictionary = true;
            }).catch( (error: any) => {
                this.eventualDictionaryCallError = error.data;
            }) ;
            this.dataChanged = false;
        }).catch( (error: any) => {
            this.eventualErrorData = error.data;
        }) ;    
    }

    private getOnChangeCallback() {
        let self = this;
        return function(event : any) {
            self.dataChanged = true;
        };
    }

    private onJsonError(event : any) {
        console.log("test");
        
    }

    ///Data tab, via dictionary
    private attributeLabel(attribute : Attribute) : string{
        return Dictionary.attributeLabel(attribute);
    }

    private dataByPath(path : string) : any {
        let pathTokens = path.split('\.');
        let value = null;
        let currentNode = this.documentData;
        for(let i=0 ; i<pathTokens.length ; i++) {
            let currentNodeKey = pathTokens[i];
            if(currentNode[currentNodeKey]) {
                currentNode = currentNode[currentNodeKey];
            } else {
                return null;
            }
            
        }
        return currentNode;
    }

    private changeData(newValue : string, path : string, type: AttributeType) {
        let pathTokens = path.split('\.');
        let currentNode = this.documentData;

        for(let i=0 ; i<pathTokens.length - 1 ; i++) {
            let currentNodeKey = pathTokens[i];
            if(!currentNode[currentNodeKey]) {
                currentNode[currentNodeKey] = {};
            } 
            currentNode = currentNode[currentNodeKey];
        }

        let lastKey = pathTokens[pathTokens.length-1];
        currentNode[lastKey] = newValue;
        this.dataChanged = true;
        this.jsonEditor.editor.update(this.documentData);
    }

    private getSimpleAttrs(attributes : Attribute[]) : Attribute[] {
        return attributes.filter((attribute) => {
            return attribute.isInArray !== true;
        });

    }


}
</script>


<style>
div.jsoneditor-menu  {
    background-color: #787c81;
    border-bottom: 1px solid #787c81;
}
div.jsoneditor {
    border: thin solid #787c81;
}

#waitingClass {
    margin: 0 auto;
    text-align: center;
}

span.alpaca-k {
    color: #1a1a1a;
}

span.alpaca-string, span.alpaca-number {
    color: #006000;
}

p.alpaca-p {
    margin-bottom: 9px;
}

div.alpaca-json {
    border: thin solid #787c81;
    font-family: "dejavu sans mono","droid sans mono",consolas,monaco,"lucida console","courier new",courier,monospace,sans-serif;
    font-size: 10pt;
    color: #1a1a1a;
    background-color: #f1f4f8;
    border-radius: 0;
    padding: 25px;
}

div.el-date-editor.el-input {
    width: 100%;
}

</style>
