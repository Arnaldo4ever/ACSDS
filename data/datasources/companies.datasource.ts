import { BillingAddress } from '../../domain/entities/billing-address.js';

export abstract class CompaniesDatasource{
    abstract getCompanyBillingAddress(companyId:number):Promise<BillingAddress>;
    abstract getAllCompanyLocations(companyId: number):Promise<any[]>;
    abstract changeCompanyPaymentTerms(companyLocationId: number, b2bPayment: string|null): Promise<boolean>;
    abstract getCompanyPaymentTerms(companyLocationId: number): Promise<boolean>;
}