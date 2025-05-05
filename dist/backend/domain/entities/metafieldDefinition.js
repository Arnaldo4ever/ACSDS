export class MetafieldDefinition {
    name;
    namespace;
    key;
    description;
    type;
    ownerType;
    validations;
    constructor(name, namespace, key, description, type, ownerType, validations) {
        this.name = name;
        this.namespace = namespace;
        this.key = key;
        this.description = description;
        this.type = type;
        this.ownerType = ownerType;
        this.validations = validations;
    }
}
