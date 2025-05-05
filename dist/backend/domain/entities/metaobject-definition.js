export class MetaobjectDefintion {
    name;
    type;
    fieldDefinitions;
    description;
    constructor(name, type, fieldDefinitions, description) {
        this.name = name;
        this.type = type;
        this.fieldDefinitions = fieldDefinitions;
        this.description = description;
    }
}
