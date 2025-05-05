import { CustomersDatasource } from "../datasources/customers.datasource.js";

export class CustomersRepository {
  constructor(private readonly customersDatasource: CustomersDatasource) {}

  async getCustomerCompany(customer_id: number)  {
    return await this.customersDatasource.getCustomerCompany(customer_id);
  }

  async getCustomerToken(customer_id: number) {
    return await this.customersDatasource.getCustomerToken(customer_id);
  }
}