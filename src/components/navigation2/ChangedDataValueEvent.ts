export class ChangedDataValueEvent {
    name : string;
    value : any;

    constructor(name: string, value : any) {
        this.name = name;
        this.value = value;
    }
}