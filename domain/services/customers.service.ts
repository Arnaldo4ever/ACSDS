import { CustomersRepository } from "../../data/repositories/customers.repository.js";
import { logger } from "../../helpers/logger-helper.js";

export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async getCustomerCompany(customer_id: number)  {
    try {
      return await this.customersRepository.getCustomerCompany(customer_id);
    } catch(error) {
      logger.error(`CustomersService: Error al intentar obtener la company del customer con id: ${customer_id}`);
      return null;
    }
  }

  async getCustomerToken(customer_id: number) {
    try {
      return await this.customersRepository.getCustomerToken(customer_id);
    } catch(error) {
      logger.error(`CustomersService: Error al intentar obtener el token del customer con id: ${customer_id}`);
      return null;
    }
  }

  async authenticateCustomer(customer_id: number, token: string): Promise<boolean> {
    try {
      const customer_token = await this.getCustomerToken(customer_id);
      return customer_token === token;
    } catch(error) {
      logger.error(`CustomersService: Error al intentar autenticar al customer con id: ${customer_id}`);
      return false;
    }
  }
}