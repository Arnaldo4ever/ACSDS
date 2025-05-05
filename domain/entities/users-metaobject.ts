export class UsersMetaobject {
  id: string;
  customers: string[];

  constructor(id: string, customers: string[]) {
    this.id = id;
    this.customers = customers;
  }
}
