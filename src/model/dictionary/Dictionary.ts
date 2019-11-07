import { AxiosResponse } from 'axios';
import axiosInstance from '@/plugins/axios-vue';
import { ColumnToChoose } from '@/model/grid/GridColumns';

export interface Attribute {
	attributs: Attribute[] | null;
	path: string;
	multi: boolean;
	type: AttributeType;
	labels: AttributeLabel[] | null;
	isInArray: boolean;
	modifiable ?: boolean; 
}

export interface AttributeLabel {
	lang: string;
	text: string;
}

export enum AttributeType {
	Text = "Text",
	Number = "Number",
	Boolean = "Boolean",
	Date = "Date",
	Composite = "Composite"
}

export class Dictionary {

    public static getDictionaryList() : Promise<string[]> {
        return new Promise((resolve,reject) => {
            axiosInstance.get('/api/dictionary/list').then((response : AxiosResponse) => {
                resolve(response.data);
            }).catch((error : any) => {
                reject(error);
            });
        });
    }

    public static getDictionary(dictionaryKey : string) : Promise<Attribute[]> {
        return new Promise((resolve,reject) => {
            axiosInstance.get('/api/dictionary/get/' + dictionaryKey).then((response : AxiosResponse) => {
                resolve(this.categorizeAttributes(response.data.attributs));
            }).catch((error : any) => {
                reject(error);
            });
        });
	}
	
	public static getAllPath(attributes : Attribute[]) : string[] {
		let result : string[] = [];
		for(let i=0 ; i<attributes.length ; i++) {
			let currentattr = attributes[i];
			if(currentattr.type == AttributeType.Composite && currentattr.attributs != null) {
				result.concat(this.getAllPath(currentattr.attributs));
			} else {
				result.push(currentattr.path);
			}
		}
		return result;
	}

    private static categorizeAttributes(dictionary : Attribute[]) : Attribute[]{
		let attributes : Attribute[] = [];

		attributes.push(this.technicalAttribute());
		attributes.push(this.modelAttribute());
		attributes.push(this.eventsAttribute());

		attributes.push({
			attributs: null,//will be added after
			path: 'document',
			multi:false,
			type: AttributeType.Composite,
			isInArray: false,
			labels: [{
				lang: 'fr',
				text: 'Document'
			}]
		});
		let simpleAttributes : Attribute[] = [];
		if(dictionary != null) {
			for(let i=0 ; i < dictionary.length ; i++) {
				let currentAttribute = dictionary[i];
				if(currentAttribute.type == AttributeType.Composite) {
					attributes.push(currentAttribute);
				} else {
					simpleAttributes.push(currentAttribute);
				}
			}
		}
		for(let i=0; i<attributes.length ; i++) {
			if(attributes[i].path === "document") {
				attributes[i].attributs = simpleAttributes;
				break;
			}
		}
		return attributes;
    }

    public static columnsToChoose(allAttributes : Attribute[]) : ColumnToChoose[] {
        let columnsToChoose : ColumnToChoose[] = [];

        for(let i=0 ; i<allAttributes.length ; i++) {
            //should only be composite on top level
            //we do not take multi = true because it can't be well represented on a column
            let currentComposite : Attribute = allAttributes[i];
            if(currentComposite.type == AttributeType.Composite && currentComposite.multi == false) {
                columnsToChoose.push({label: this.attributeLabel(currentComposite)});
                //children
                if(currentComposite.attributs != null) {
                    for(let j=0 ; j<currentComposite.attributs.length ; j++) {
                        let childAttribute : Attribute = currentComposite.attributs[j];
						columnsToChoose.push({
							key: childAttribute.path, 
							label : this.attributeLabel(childAttribute)
						})
                    }
                }
                
            }
        }
	
		return columnsToChoose;
    }

    public static columnToggleObject(allAttributes : Attribute[], selectedColumnKeys : string[]) : object {
        let result : object = {};

       /*  {
        'technical.doc_create_date' : true,
        'technical.key2' : false,
        'technical.key3' : false,
        'technical.key4' : false,
        'technical.key5' : false
		} */
		

        for(let i=0 ; i<allAttributes.length ; i++) {
            //should only be composite on top level
            //we do not take multi = true because it can't be well represented on a column
            let currentComposite : Attribute = allAttributes[i];
            if(currentComposite.type == AttributeType.Composite && currentComposite.multi == false) {
                //children
                if(currentComposite.attributs != null) {
                    for(let j=0 ; j<currentComposite.attributs.length ; j++) {
                        let childAttribute : Attribute = currentComposite.attributs[j];
                        result[childAttribute.path] = selectedColumnKeys.indexOf(childAttribute.path) > -1;
                    }
                }
                
            }
        }
        return result;
    }

    public static attributeLabel(attribute : Attribute) : string {
		if(attribute.labels != null && attribute.labels.length > 0)
			return attribute.labels[0].text;

		return attribute.path;
    }
    
    public static attributesByPathList(pathList : string[], categorizeAttributes : Attribute[]) : Map<string,Attribute> {
        let attributesByPath = new Map<string,Attribute>();

        for(let i=0 ; i<categorizeAttributes.length ; i++) {
            //should only be composite on top level
            //we do not take multi = true because it can't be well represented on a column
            let currentComposite : Attribute = categorizeAttributes[i];
            if(currentComposite.type == AttributeType.Composite && currentComposite.multi == false) {
                //children
                if(currentComposite.attributs != null) {
                    for(let j=0 ; j<currentComposite.attributs.length ; j++) {
                        let childAttribute : Attribute = currentComposite.attributs[j];
                        if(pathList.indexOf(childAttribute.path) > -1) {
                            attributesByPath.set(childAttribute.path, childAttribute);
                        }
                    }
                }
            } 
        }
        return attributesByPath;
    }
    
    private static technicalAttribute() : Attribute {
		return {
			attributs: [
				{
					attributs: null,
					path : '_id',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					modifiable: false,
					labels: [{
						lang: 'fr',
						text: '_id'
					}]
				},
				{
					attributs: null,
					path : 'technical.type_doc',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Type de document'
					}]
				},
				{
					attributs: null,
					path : 'technical.doc_create_date',
					multi: false,
					type: AttributeType.Date,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Date de création'
					}]
				},
				{
					attributs: null,
					path : 'technical.status.code',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Type de statut'
					}]
				},
				{
					attributs: null,
					path : 'technical.status.value',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Valeur de statut'
					}]
				},
				{
					attributs: null,
					path : 'technical.sender_doc_reference',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Référence Emetteur'
					}]
				},
				{
					attributs: null,
					path : 'technical.sender_id',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Identifiant Technique Emetteur'
					}]
				},
				{
					attributs: null,
					path : 'technical.sender_nat_code',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Identifiant National Emetteur'
					}]
				},
				{
					attributs: null,
					path : 'technical.sender_vat_code',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'TVA Intraco Emetteur'
					}]
				},
				{
					attributs: null,
					path : 'technical.sender_name',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Raison Sociale Emetteur'
					}]
				},
				{
					attributs: null,
					path : 'technical.sender_doc_key',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Clé hiérarchique Emetteur'
					}]
				},
				{
					attributs: null,
					path : 'technical.recipient_doc_reference',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Référence Destinataire'
					}]
				},
				{
					attributs: null,
					path : 'technical.recipient_id',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Identifiant Technique Destinataire'
					}]
				},
				{
					attributs: null,
					path : 'technical.recipient_nat_code',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Identifiant National Destinataire'
					}]
				},
				{
					attributs: null,
					path : 'technical.recipient_vat_code',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'TVA Intraco Destinataire'
					}]
				},
				{
					attributs: null,
					path : 'technical.recipient_name',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Raison Sociale Destinataire'
					}]
				},
				{
					attributs: null,
					path : 'technical.recipient_doc_key',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Clé hiérarchique Destinataire'
					}]
				},
				{
					attributs: null,
					path : 'technical.value_date',
					multi: false,
					type: AttributeType.Date,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Date de valeur'
					}]
				},
				{
					attributs: null,
					path : 'technical.update_date',
					multi: false,
					type: AttributeType.Date,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Date de mise à jour'
					}]
				},
				{
					attributs: null,
					path : 'technical.test',
					multi: false,
					type: AttributeType.Boolean,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Indicateur de test'
					}]
				},
				{
					attributs: null,
					path : 'technical.sending_date',
					multi: false,
					type: AttributeType.Date,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Date de transfert du document'
					}]
				},


			],
			path: 'technical',
			multi:false,
			type: AttributeType.Composite,
			isInArray: false,
			labels: [{
				lang: 'fr',
				text: 'Technical'
			}]
		};
	}


	private static modelAttribute() : Attribute {
		return {
			attributs: [
				{
					attributs: null,
					path : 'model.dictionaryKey',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Clé dictionnaire'
					}]
				},
				{
					attributs: null,
					path : 'model.clientKey',
					multi: false,
					type: AttributeType.Text,
					isInArray: false,
					labels: [{
						lang: 'fr',
						text: 'Clé client'
					}]
				},
			],
			path: 'model',
			multi:false,
			type: AttributeType.Composite,
			isInArray: false,
			labels: [{
				lang: 'fr',
				text: 'Modèle sem.'
			}]
		};
	}

	private static eventsAttribute() : Attribute {
		return {
			attributs: [
				{
					attributs: null,
					path : 'technical.events.eventGuid',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'guid'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.creationDate',
					multi: false,
					type: AttributeType.Date,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Date technique'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.date',
					multi: false,
					type: AttributeType.Date,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Date'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.type',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Type'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.user',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Utilisateur'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.category',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Catégorie'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.actorName ',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Acteur'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.comment ',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Commentaire'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.statusCode',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Code statut'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.statusValue',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Valeur statut'
					}]
				},
				{
					attributs: null,
					path : 'technical.events.transactionId',
					multi: false,
					type: AttributeType.Text,
					isInArray: true,
					labels: [{
						lang: 'fr',
						text: 'Transaction ID'
					}]
				},
			],
			path: 'technical.events',
			multi:true,
			type: AttributeType.Composite,
			isInArray: false,
			labels: [{
				lang: 'fr',
				text: 'Events'
			}]
		};
	}



}