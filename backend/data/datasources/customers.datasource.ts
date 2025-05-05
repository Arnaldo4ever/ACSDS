export abstract class CustomersDatasource {
  abstract getCustomerCompany(customer_id: number): Promise<number|null>;
  abstract getCustomerToken(customer_id: number): Promise<string>;
}