import { CompaniesRepository } from "../../data/repositories/companies.repository.js";
import { logger } from "../../helpers/logger-helper.js";
import { BillingAddress } from "../entities/billing-address.js";

export interface GetCompanyBillingAdddresParams {
    companyId: number;
}

export interface ChangeCompanyPaymentTermsParams {
    companyLocationId: number;
    b2bPayment: boolean;
    companyId: number;
}

const DUE_ON_FULFILLMENT_ID = "gid://shopify/PaymentTermsTemplate/9";

/*
* Los servicios encapsulan la lógica de la app. Les daría igual que los llamara un script que un controlador.
* Lo normal es que interactuen con repositorios para trabajar con datos. Los repositorios los recibirán como parámetros
* porque usamos el patrón de inyección de dependencias
*/

export class CompaniesService {
    constructor(
        private readonly companiesRepository:CompaniesRepository
    ){}

    async getCompanyPaymentTerms(companyLocationId: number) {
        try {
            return await this.companiesRepository.getCompanyPaymentTerms(companyLocationId);
        } catch(error) {
            logger.error(`CompaniesService: No se ha podido obtener los términos de pago para la location: ${companyLocationId}, `, error);
            return false;
        }
    }
    
    async getCompanyBillingAddress (params: GetCompanyBillingAdddresParams): Promise<BillingAddress>{
        try {
            const billingAddress = await this.companiesRepository.getCompanyBillingAddress(params.companyId);
            return billingAddress;
        } catch(error) {
            console.log('CompaniesService: Error en getCompanyBillingAddress',error);
            throw error;
        }
    }

    async changeCompanyPaymentTerms(params: ChangeCompanyPaymentTermsParams) {
        try {
            let b2bPayment = null;
            if(params.b2bPayment) b2bPayment = DUE_ON_FULFILLMENT_ID;
            const locations = await this.companiesRepository.getAllCompanyLocations(params.companyId);
            for(let i = 0; i < locations.length; i++) {
                const locationId = locations[i].id;
                await this.companiesRepository.changeCompanyPaymentTerms(locationId, b2bPayment);
            }
            return true;
        } catch(error) {
            logger.error('CompaniesService: Error en changeCompanyPaymentTerms')
            throw error;
        }
    }
}