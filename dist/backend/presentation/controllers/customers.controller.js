import { logger } from '../../helpers/logger-helper.js';
import { CustomersService } from '../../domain/services/customers.service.js';
import { CustomersShopifyDatasource } from '../../data/datasources/shopify/customers-shopify.datasource.js';
import { CustomersRepository } from '../../data/repositories/customers.repository.js';
import { MetafieldsRepository } from '../../data/repositories/metafields.repository.js';
import { MetafieldsShopifyDatasource } from '../../data/datasources/shopify/metafields-shopify.datasource.js';
import { MetafieldsService } from '../../domain/services/metafields.service.js';
import { MetafieldSetInput } from '../../domain/entities/metafields.js';
export class CustomersController {
    async updateLastVisit(req, res) {
        logger.debug(req.query);
        try {
            const customer_id = req.query.logged_in_customer_id;
            const shop = req.query.shop;
            const customer_secret = req.header('Usertoken');
            if (!customer_id || !customer_secret || !shop) {
                res.status(401).json({ status: 'Unauthorized' });
                return;
            }
            // Check that customer id is a number.
            const numeric_customer_id = parseInt(customer_id);
            if (isNaN(numeric_customer_id)) {
                res.status(401).json({ status: 'Unauthorized' });
                return;
            }
            // Authenticate the customer.
            const customersService = new CustomersService(new CustomersRepository(new CustomersShopifyDatasource(shop)));
            const customerAuthenticated = await customersService.authenticateCustomer(numeric_customer_id, customer_secret);
            if (!customerAuthenticated) {
                res.status(401).json({ status: 'Unauthorized' });
                return;
            }
            // If the customer is authenticated, update the last visit time.
            const metafieldsService = new MetafieldsService(new MetafieldsRepository(new MetafieldsShopifyDatasource(shop)));
            const updateStatus = await metafieldsService.metafieldsSet([new MetafieldSetInput('last_visit', 'upng', `gid://shopify/Customer/${customer_id}`, 'date_time', new Date().toISOString())]);
            if (updateStatus) {
                res.status(200).json({ status: 'OK' });
            }
            else {
                res.status(500).json({ status: 'Server Error' });
            }
            return;
        }
        catch (error) {
            logger.error('Algo fue mal intentando actualizar el último tiempo de visita, ', error);
            res.status(500).json({ status: 'Server Error' });
            return;
        }
    }
}
