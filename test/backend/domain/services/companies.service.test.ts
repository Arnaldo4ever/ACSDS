/*import { describe, it, expect } from 'vitest';
import { CompaniesService } from "../../../../backend/domain/services/companies.service";
import { CompaniesDatasource } from "../../../../backend/data/datasources/companies.datasource";
import { BillingAddress } from "../../../../backend/domain/entities/billing-address";
import { CompaniesRepository } from "../../../../backend/data/repositories/companies.repository";

//DataSource para los test que devuelven un resultado de preuba que me interese para probar el servicio
class MockDataSource implements CompaniesDatasource{
    getAllCompanyLocations(companyId: number): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    changeCompanyPaymentTerms(companyLocationId: number, b2bPayment: string | null): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async getCompanyBillingAddress(companyId: number): Promise<BillingAddress> {
        if (companyId == 1234) {
            // Simulando una pequeña demora antes de resolver la promesa
            await new Promise(resolve => setTimeout(resolve, 1000));
            return Promise.resolve(new BillingAddress('123 Main St', 'Apt 2', '12345', 'Anytown', 'ABC Company', '555-123-4567'));
        } else {
            return Promise.reject(new Error('Company ID not found'));
        }
    }

}

describe('CompaniesService', () =>{

    //Creo la instancia del servicio con un repositorio que use el MockDataSource para probar
    const companiesRepository = new CompaniesRepository(new MockDataSource());
    const companiesService = new CompaniesService(companiesRepository);

    it('Recupera datos de una company que existe', async() => {

        const billingAddress = await companiesService.getCompanyBillingAddress({companyId:1234});
    
        expect(billingAddress).toBeInstanceOf(BillingAddress);
        expect(billingAddress.address1).toBe('123 Main St');
        expect(billingAddress.address2).toBe('Apt 2');
        expect(billingAddress.zip).toBe('12345');
        expect(billingAddress.city).toBe('Anytown');
        expect(billingAddress.companyName).toBe('ABC Company');
        expect(billingAddress.phone).toBe('555-123-4567');
    });

    it('Si el repositorio devuelve una excepción, el servicio deve lanzar la misma excepción', async() => {
    
        await expect(async () => companiesService.getCompanyBillingAddress({companyId:8888})).rejects.toThrowError('Company ID not found');
    });
});*/