import { logger } from "../../helpers/logger-helper.js";
export class CustomersService {
    customersRepository;
    constructor(customersRepository) {
        this.customersRepository = customersRepository;
    }
    async getCustomerCompany(customer_id) {
        try {
            return await this.customersRepository.getCustomerCompany(customer_id);
        }
        catch (error) {
            logger.error(`CustomersService: Error al intentar obtener la company del customer con id: ${customer_id}`);
            return null;
        }
    }
    async getCustomerToken(customer_id) {
        try {
            return await this.customersRepository.getCustomerToken(customer_id);
        }
        catch (error) {
            logger.error(`CustomersService: Error al intentar obtener el token del customer con id: ${customer_id}`);
            return null;
        }
    }
    async authenticateCustomer(customer_id, token) {
        try {
            const customer_token = await this.getCustomerToken(customer_id);
            return customer_token === token;
        }
        catch (error) {
            logger.error(`CustomersService: Error al intentar autenticar al customer con id: ${customer_id}`);
            return false;
        }
    }
}
