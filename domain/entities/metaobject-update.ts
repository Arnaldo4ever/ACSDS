export class MetaobjectUpdate {
  id: string;
  fields: [
    {
      key: string;
      value: string;
    }
  ];

  constructor(
    id: string,
    fields: [
      {
        key: string;
        value: string;
      }
    ]
  ) {
    this.id = id;
    this.fields = fields;
  }
}
