export class MetafieldSetInput {
  key: string;
  namespace: string;
  ownerId: string;
  type: string;
  value: string;
  constructor(key: string, namespace: string, ownerId: string, type: string, value: string) {
    this.key = key;
    this.namespace = namespace;
    this.ownerId = ownerId;
    this.type = type;
    this.value = value;
  }
}