export class MetaobjectDefintion {
  name: string;
  type: string;
  fieldDefinitions: {
    description: string;
    key: string;
    name: string;
    required: boolean;
    type: string;
  };
  description: string;
  constructor(
    name: string,
    type: string,
    fieldDefinitions: {
      description: string;
      key: string;
      name: string;
      required: boolean;
      type: string;
    },
    description: string
  ) {
    this.name = name;
    this.type = type;
    this.fieldDefinitions = fieldDefinitions;
    this.description = description;
  }
}
