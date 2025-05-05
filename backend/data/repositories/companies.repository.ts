import { BillingAddress } from '../../domain/entities/billing-address.js';
import { CompaniesDatasource } from '../datasources/companies.datasource.js';

/*
 Los repositories son las clases que proporcionan acceso a datos a los servicios. Reciben como parámetros
 uno o varios datasources (patrón de inyección de dependencias) que se encargarán de acceder a los datos de
 de una forma concreta, por ejemplo a través del API de grapfhQL de Shopify, de forma transparente al repository
*/

export class CompaniesRepository{
    constructor(
        private readonly companiesDataSource:CompaniesDatasource
    ){}
    async getCompanyPaymentTerms(companyLocationId: number) {
        return await this.companiesDataSource.getCompanyPaymentTerms(companyLocationId);
    }
    async getCompanyBillingAddress(companyId:number):Promise<BillingAddress>{
        return await this.companiesDataSource.getCompanyBillingAddress(companyId);
    }
    async changeCompanyPaymentTerms(companyId:number, b2bPayment: string|null):Promise<boolean>{
        return await this.companiesDataSource.changeCompanyPaymentTerms(companyId, b2bPayment);
    }
    async getAllCompanyLocations(companyId: number):Promise<any[]> {
        return await this.companiesDataSource.getAllCompanyLocations(companyId);
    }
}