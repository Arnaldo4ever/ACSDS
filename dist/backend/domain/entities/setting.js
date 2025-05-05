export class Setting {
    name;
    description;
    type;
    value;
    constructor(name, description, type, value) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.value = value;
    }
}
