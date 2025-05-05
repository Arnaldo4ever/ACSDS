import { logger } from "../../../helpers/logger-helper.js";
import { CUSTOMER_COMPANIES_QUERY, USER_TOKEN_QUERY } from "./queries/customers-queries.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
export class CustomersShopifyDatasource extends ShopifyBaseDatasource {
    constructor(shop) {
        super(shop);
    }
    async getCustomerToken(customer_id) {
        logger.debug('Obteniendo el token del customer con id: ' + customer_id);
        try {
            const graphqlClient = await this.getGraphqlClient();
            const queryResponse = await graphqlClient.query({
                data: {
                    query: USER_TOKEN_QUERY,
                    variables: {
                        id: this.buildShopifyId(customer_id, 'Customer')
                    }
                }
            });
            const data = queryResponse.body.data;
            logger.debug(data);
            if (!data.customer) {
                logger.error(`No se ha encontrado un customer con ID: ${customer_id}`);
                throw new Error(`No se ha encontrado un customer con ID: ${customer_id}`);
            }
            const token = data.customer.metafield?.value;
            return token ? token : '';
        }
        catch (error) {
            logger.error(`No se ha podido obtener el token del customer con ID: ${customer_id}, `, error);
            throw error;
        }
    }
    async getCustomerCompany(customer_id) {
        logger.debug('Obteniendo la company de un cliente con id: ' + customer_id);
        try {
            const graphqlClient = await this.getGraphqlClient();
            const queryResponse = await graphqlClient.query({
                data: {
                    query: CUSTOMER_COMPANIES_QUERY,
                    variables: {
                        customerId: this.buildShopifyId(customer_id, 'Customer')
                    }
                }
            });
            const data = queryResponse.body.data;
            logger.debug(data);
            if (!data.customer) {
                logger.error(`No se ha encontrado un customer con ID: ${customer_id}`);
                return null;
            }
            const contactProfiles = data.customer.companyContactProfiles;
            if (contactProfiles.length == 0) {
                logger.error(`El customer con ID: ${customer_id} no está en ninguna company`);
                return null;
            }
            const company = contactProfiles[0].company.id;
            // Ahora convierto el ID de la company en número.
            const numeric_company = parseInt(company.split("Company/")[1]);
            return numeric_company;
        }
        catch (error) {
            logger.error(`No se ha podido obtener el ID de la company del customer con ID: ${customer_id}, `, error);
            throw error;
        }
    }
}
