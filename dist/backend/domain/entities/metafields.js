export class MetafieldSetInput {
    key;
    namespace;
    ownerId;
    type;
    value;
    constructor(key, namespace, ownerId, type, value) {
        this.key = key;
        this.namespace = namespace;
        this.ownerId = ownerId;
        this.type = type;
        this.value = value;
    }
}
