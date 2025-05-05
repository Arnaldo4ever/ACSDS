/*
 Los repositories son las clases que proporcionan acceso a datos a los servicios. Reciben como parámetros
 uno o varios datasources (patrón de inyección de dependencias) que se encargarán de acceder a los datos de
 de una forma concreta, por ejemplo a través del API de grapfhQL de Shopify, de forma transparente al repository
*/
export class CompaniesRepository {
    companiesDataSource;
    constructor(companiesDataSource) {
        this.companiesDataSource = companiesDataSource;
    }
    async getCompanyPaymentTerms(companyLocationId) {
        return await this.companiesDataSource.getCompanyPaymentTerms(companyLocationId);
    }
    async getCompanyBillingAddress(companyId) {
        return await this.companiesDataSource.getCompanyBillingAddress(companyId);
    }
    async changeCompanyPaymentTerms(companyId, b2bPayment) {
        return await this.companiesDataSource.changeCompanyPaymentTerms(companyId, b2bPayment);
    }
    async getAllCompanyLocations(companyId) {
        return await this.companiesDataSource.getAllCompanyLocations(companyId);
    }
}
