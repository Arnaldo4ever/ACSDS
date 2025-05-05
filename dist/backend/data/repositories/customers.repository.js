export class CustomersRepository {
    customersDatasource;
    constructor(customersDatasource) {
        this.customersDatasource = customersDatasource;
    }
    async getCustomerCompany(customer_id) {
        return await this.customersDatasource.getCustomerCompany(customer_id);
    }
    async getCustomerToken(customer_id) {
        return await this.customersDatasource.getCustomerToken(customer_id);
    }
}
