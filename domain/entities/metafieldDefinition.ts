export class MetafieldDefinition {
  name: string;
  namespace: string;
  key: string;
  description: string;
  type: string;
  ownerType: string;
  validations?: any[];

  constructor(
    name: string,
    namespace: string,
    key: string,
    description: string,
    type: string,
    ownerType: string,
    validations?: any[]
  ) {
    this.name = name;
    this.namespace = namespace;
    this.key = key;
    this.description = description;
    this.type = type;
    this.ownerType = ownerType;
    this.validations = validations;
  }
}
