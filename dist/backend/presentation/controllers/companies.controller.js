import { CompaniesRepository } from "../../data/repositories/companies.repository.js";
import { ResponseError, ResponseErrorCode, } from "../response-entities/response-error.js";
import { CompaniesShopifyDatasource } from "../../data/datasources/shopify/companies-shopify.datasource.js";
import { ResponseOk } from "../response-entities/response-ok.js";
import { RESPONSE_STATUS_BAD_REQUEST, RESPONSE_STATUS_ERROR, } from "./responseStatusCodes.js";
import { CompaniesService } from "../../domain/services/companies.service.js";
import { GetDataError } from "../../exceptions/get-data.error.js";
import { logger } from "../../helpers/logger-helper.js";
import { NotFoundError } from "../../exceptions/not-found.error.js";
import { CustomersRepository } from "../../data/repositories/customers.repository.js";
import { CustomersShopifyDatasource } from "../../data/datasources/shopify/customers-shopify.datasource.js";
import { CustomersService } from "../../domain/services/customers.service.js";
import { ERPService } from '../../domain/services/erp.service.js';
//Los controllers recuperan los parámetros de la llamada, llaman al servicio correspondiente y revuelven una respuesta
export class CompaniesController {
    static erpService = new ERPService();
    async getPaymentTerms(req, res) {
        logger.debug('companiesController: Getting Company Payment Terms');
        const body = req.body;
        const customer_token = req.header('Usertoken');
        logger.debug(body);
        try {
            const company_location_id = body.companyLocationId;
            const company_id = body.companyId;
            const customer_id = body.customerId;
            const shop = body.shop;
            if (!company_location_id || !company_id || !customer_id || !shop) {
                logger.error('Falta alguno de los siguientes datos obligatorios: companyLocationId, companyId, customerId, shop');
                res.status(400).json({ status: 'Bad Request' });
                return;
            }
            // Debemos comprobar que el customer_id y company_id es numérico.
            const numeric_customer = parseInt(customer_id);
            const numeric_company = parseInt(company_id);
            if (isNaN(numeric_customer) && isNaN(numeric_company)) {
                logger.error('El customer_id o company_id no es numérico');
                res.status(400).json({ status: 'Bad Request' });
                return;
            }
            // Debemos comprobar la identidad del usuario.
            // y también debemos comprobar si el customer id pertenece al company id solicitado.
            const customersRepository = new CustomersRepository(new CustomersShopifyDatasource(shop));
            const customersService = new CustomersService(customersRepository);
            // Autenticar token del customer.
            const is_authenticated = await customersService.authenticateCustomer(numeric_customer, customer_token ? customer_token : '');
            if (!is_authenticated) {
                logger.error(`El customer con ID: ${numeric_customer} no ha proporcionado un token válido`);
                res.status(403).json({ status: 'Forbidden' });
                return;
            }
            // Comprobar que el customer pertenece a la company.
            const customer_company = await customersService.getCustomerCompany(numeric_customer);
            logger.debug(customer_company);
            if (customer_company != numeric_company) {
                logger.error(`El customer con ID: ${numeric_customer} ha intentado acceder a una company que no es suya: ${numeric_company}`);
                res.status(403).json({ status: 'Forbidden' });
                return;
            }
            // Ahora vamos a comprobar que lo location ID es numérica.
            const numeric_location = parseInt(company_location_id);
            if (isNaN(numeric_location)) {
                res.status(400).json({ status: 'Bad Request' });
                return;
            }
            // Ahora vamos a consultar el estado de los términos de pago de la company solicitada.
            const companiesRepository = new CompaniesRepository(new CompaniesShopifyDatasource(shop));
            const companiesService = new CompaniesService(companiesRepository);
            const payment_terms = await companiesService.getCompanyPaymentTerms(numeric_location);
            res.status(200).json({ result: payment_terms });
        }
        catch (error) {
            logger.error('No se ha podido consultar los términos de pago de una company', error);
            res.status(500).json({ status: 'Server Error' });
            return;
        }
    }
    /**@deprecated */
    async changePaymentTermsLegacy(req, res) {
        logger.debug('companiesController: Changing Company Payment Terms');
        const body = req.body;
        logger.debug(body);
        try {
            const companyLocationId = body.companyLocationId;
            const shop = body.shop;
            const b2bPayment = body.b2bPayment;
            const companyId = body.companyId;
            if (!shop || !companyLocationId || !companyId || b2bPayment == null) {
                logger.error('companiesController: Error intentando cambiar términos de pago, falta shop/companyLocationId/companyId/b2bPayment');
                res.status(RESPONSE_STATUS_BAD_REQUEST).json(new ResponseError(ResponseErrorCode.ErrorFaltanDatosObligatorios));
                return;
            }
            const companiesRepository = new CompaniesRepository(new CompaniesShopifyDatasource(shop));
            const companiesService = new CompaniesService(companiesRepository);
            const changePaymentTermsRequest = await companiesService.changeCompanyPaymentTerms({ companyLocationId: companyLocationId, b2bPayment: b2bPayment, companyId: parseInt(companyId) });
            if (!changePaymentTermsRequest) {
                res.status(RESPONSE_STATUS_BAD_REQUEST).send(JSON.stringify({ status: 'Failed' }));
            }
            res.status(200).send(JSON.stringify({ status: 'Success' }));
        }
        catch (error) {
            if (error instanceof GetDataError) {
                logger.debug("Respuesta con error de acceso a datos");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorGetData));
            }
            else if (error instanceof NotFoundError) {
                logger.debug("Respuesta con error no encontrado");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorNoEncontrado));
            }
            //Otros errores
            else {
                logger.debug("Respuesta con error no controlado");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorGeneral));
            }
        }
    }
    async changePaymentTerms(req, res) {
        logger.debug('companiesController: Changing Company Payment Terms');
        const body = req.body;
        logger.debug(body);
        const customer_token = req.header('Usertoken');
        try {
            if (!body.data) {
                res.status(400).json({ status: 'Bad Request' });
                return;
            }
            const b64Buffer = Buffer.from(body.data, 'base64');
            const decoded_data_string = decodeURIComponent(b64Buffer.toString('utf8'));
            const data = JSON.parse(decoded_data_string);
            const companyLocationId = data.companyLocationId;
            const shop = data.shop;
            const b2bPayment = data.b2bPayment;
            const companyId = data.companyId;
            const customer_id = data.customerId;
            if (!shop || !companyLocationId || !companyId || b2bPayment == null || !customer_id) {
                logger.error('companiesController: Error intentando cambiar términos de pago, falta shop/companyLocationId/companyId/b2bPayment');
                res.status(RESPONSE_STATUS_BAD_REQUEST).json(new ResponseError(ResponseErrorCode.ErrorFaltanDatosObligatorios));
                return;
            }
            // Debemos comprobar que el usuario es de la company que dice ser.
            const customersRepository = new CustomersRepository(new CustomersShopifyDatasource(shop));
            const customersService = new CustomersService(customersRepository);
            // Comprobamos que el customer id es un número.
            const numeric_customer = parseInt(customer_id);
            const numeric_company = parseInt(companyId);
            const numeric_location = parseInt(companyLocationId);
            if (isNaN(numeric_company) || isNaN(numeric_customer) || isNaN(numeric_location)) {
                logger.error('Se han recibido IDs NO numéricos');
                res.status(400).json({ status: 'Bad Request' });
                return;
            }
            // Ahora autentificamos al customer.
            const is_authenticated = await customersService.authenticateCustomer(numeric_customer, customer_token ? customer_token : '');
            if (!is_authenticated) {
                logger.error(`companiesController: El customer con ID: ${numeric_customer} no ha proporcionado un token válido`);
                res.status(403).json({ status: 'Forbidden' });
                return;
            }
            const customer_company = await customersService.getCustomerCompany(numeric_customer);
            if (customer_company != numeric_company) {
                logger.error(`companiesController: El customer con ID: ${numeric_customer} ha intentado acceder a una company que no es suya: ${numeric_company}`);
                res.status(403).json({ status: 'Forbidden' });
                return;
            }
            const companiesRepository = new CompaniesRepository(new CompaniesShopifyDatasource(shop));
            const companiesService = new CompaniesService(companiesRepository);
            const changePaymentTermsRequest = await companiesService.changeCompanyPaymentTerms({ companyLocationId: companyLocationId, b2bPayment: b2bPayment, companyId: parseInt(companyId) });
            if (!changePaymentTermsRequest) {
                res.status(RESPONSE_STATUS_BAD_REQUEST).send(JSON.stringify({ status: 'Failed' }));
            }
            res.status(200).send(JSON.stringify({ status: 'Success' }));
        }
        catch (error) {
            if (error instanceof GetDataError) {
                logger.debug("Respuesta con error de acceso a datos");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorGetData));
            }
            else if (error instanceof NotFoundError) {
                logger.debug("Respuesta con error no encontrado");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorNoEncontrado));
            }
            //Otros errores
            else {
                logger.debug("Respuesta con error no controlado");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorGeneral));
            }
        }
    }
    async getCompanyBillingAddress(req, res) {
        const body = req.body;
        try {
            const companyId = body.companyId;
            const shop = body.shop;
            if (!companyId || !shop) {
                //Devolvemos un error indicando que no hemos recibido datos obligatorios
                res
                    .status(RESPONSE_STATUS_BAD_REQUEST)
                    .json(new ResponseError(ResponseErrorCode.ErrorFaltanDatosObligatorios));
            }
            else {
                //Creamos el servicio para que se encargue de la lógica con el repository y datasource que le queramos pasar
                const companiesRepository = new CompaniesRepository(new CompaniesShopifyDatasource(shop));
                const companiesService = new CompaniesService(companiesRepository);
                //Recuperamos la billingAddress
                const billingAddress = await companiesService.getCompanyBillingAddress({
                    companyId: companyId,
                });
                //Respuesta devolviendo el resultado
                res.send(new ResponseOk({ billingAddress: billingAddress }));
            }
        }
        catch (error) {
            //Si hay errores devolvemos un codigo de error que permita al front identificar que tipo de error ha sido por si quiere mostrar feedback diferente al usuario segun este error
            //Error en los accesos a base de datos
            if (error instanceof GetDataError) {
                logger.debug("Respuesta con error de acceso a datos");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorGetData));
            }
            else if (error instanceof NotFoundError) {
                logger.debug("Respuesta con error no encontrado");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorNoEncontrado));
            }
            //Otros errores
            else {
                logger.debug("Respuesta con error no controlado");
                res
                    .status(RESPONSE_STATUS_ERROR)
                    .json(new ResponseError(ResponseErrorCode.ErrorGeneral));
            }
        }
    }
    static async getERPPartners(req, res) {
        try {
            const { limit = 10, offset = 0 } = req.query;
            const partners = await this.erpService.getPartners(['id', 'name', 'email', 'phone', 'street', 'city', 'country_id', 'vat'], [], parseInt(limit), parseInt(offset));
            logger.debug('📌 Partners obtenidos:', JSON.stringify(partners, null, 2));
            if (!partners || partners.length === 0) {
                return res.status(404).json({ error: 'No se obtuvieron partners desde ERP' });
            }
            return res.status(200).json({ partners });
        }
        catch (error) {
            logger.error('Error al obtener partners de ERP:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    static async getERPPartnerById(req, res) {
        try {
            const { id } = req.params;
            const partner = await this.erpService.getPartnerById(parseInt(id));
            if (!partner) {
                return res.status(404).json({ error: 'No se encontró el partner en ERP' });
            }
            return res.status(200).json({ partner });
        }
        catch (error) {
            logger.error('Error al obtener partner de ERP:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
