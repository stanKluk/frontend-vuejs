import { Dictionary, Attribute, AttributeType } from '@/model/dictionary/Dictionary';

export interface ColumnToChoose {
    key ?: string;
    label : string;
}

export interface ColumnToChooseToogleEvent {
    key: string;
    label: string;
    selected: boolean;
}

export class GridColumns {

    public static createSearchDocumentColumns(dictionary : Attribute[], selectedColumns : string[]) : object[] {

        let attrsByPath : Map<string,Attribute> = Dictionary.attributesByPathList(selectedColumns, dictionary);
        let columns : object[] = [];

        for(let i=0 ; i<selectedColumns.length ; i++) {
            let key = selectedColumns[i];
            let attr = attrsByPath.get(key);
            if(attr) {
                let label = Dictionary.attributeLabel(attr);
                let column = {
                    headerName: label,
                    field: key,
                    colId: key,
                    resizable: true
                };
                if(attr.isInArray) {
                    column['cellRenderer'] = 'arrayValueRenderer';
                } else if(attr.type == AttributeType.Date) {
                    if(attr.path.startsWith('technical.')) {
                        column['cellRenderer'] = 'isoDateRenderer';
                    } 
                }
                if(attr.path === '_id') {
                    column['sortable'] = false;
                } 
                columns.push(column);
            }
            
        }

        return columns.concat(this.mandatoryColumns());
    }

    public static mandatoryColumns() : object[] {
        return [
            {headerName: 'lien pdf', colId: 'technical.contents', field: 'technical.contents', resizable: true, sortable: false,  cellRenderer: 'pdfLinkRenderer'},
            {headerName: 'detail', colId: 'detail', field: 'detail', resizable: true, sortable: false,  cellRenderer : 'eyeIconRenderer'}
        ];
    }

    public static defaultSearchDocumentColumns() : object[] {
        return [
            {headerName: '_id', field: '_id', resizable: true, sortable: false},
            {headerName: 'doc_create_date', sort : 'desc', field: 'technical.doc_create_date', resizable: true, cellRenderer: 'dateRenderer'},
            {headerName: 'type_doc', field: 'technical.type_doc',resizable: true},
            {headerName: 'sender_doc_reference', field: 'technical.sender_doc_reference', resizable: true},
            {headerName: 'sender_id', field: 'technical.sender_id', resizable: true},
            {headerName: 'sender_name', field: 'technical.sender_name', resizable: true},
            {headerName: 'recipient_id', field: 'technical.recipient_id', resizable: true},
            {headerName: 'recipient_name', field: 'technical.recipient_name', resizable: true},
            {headerName: 'recipient_doc_reference', field: 'technical.recipient_doc_reference', resizable: true},
            {headerName: 'status', field: 'technical.status.code', resizable: true, sortable: false, cellRenderer: 'arrayValueRenderer'},
            {headerName: 'lien pdf', field: 'technical.contents', resizable: true, cellRenderer: 'pdfLinkRenderer'},
            {headerName: 'detail', field: 'detail', resizable: true, cellRenderer : 'eyeIconRenderer'}
        ];
    }

    public static defaultSelectedColumns() : string[] {
        return [
            '_id',
            'technical.doc_create_date',
            'technical.type_doc',
            'technical.sender_doc_reference',
            'technical.sender_id',
            'technical.sender_name',
            'technical.recipient_id',
            'technical.recipient_name',
            'technical.recipient_doc_reference',
            'technical.status'
        ];
    }
}