import { ERPService } from '../erp.service';
// Crea un mock completo del repositorio
class MockERPRepository {
    searchRead = jest.fn((model, fields, domain, limit, offset) => {
        console.log('Mock searchRead called with:', { model, fields, domain, limit, offset });
        if (model === 'res.partner') {
            return Promise.resolve([
                { id: 1, name: 'Test Partner', email: 'test@example.com', phone: '123456' },
                { id: 2, name: 'Another Partner', email: 'another@example.com', phone: '789012' }
            ]);
        }
        return Promise.resolve([]);
    });
    getById = jest.fn((model, id, fields) => {
        console.log('Mock getById called with:', { model, id, fields });
        if (model === 'res.partner' && id === 1) {
            return Promise.resolve({
                id: 1,
                name: 'Test Partner',
                email: 'test@example.com',
                phone: '123456'
            });
        }
        return Promise.resolve(null);
    });
}
// Reemplaza la implementación real del repositorio con el mock
jest.mock('../../../data/repositories/erp.repository', () => {
    return {
        ERPRepository: jest.fn().mockImplementation(() => {
            console.log('Mock ERPRepository constructor called');
            return new MockERPRepository();
        })
    };
});
describe('ERPService', () => {
    let erpService;
    let mockRepository;
    beforeEach(() => {
        console.log('BeforeEach: Creating ERPService');
        erpService = new ERPService();
        // Accede al mock del repositorio
        mockRepository = erpService.repository;
        console.log('BeforeEach: mockRepository', mockRepository);
    });
    test('getPartners debe devolver partners', async () => {
        const partners = await erpService.getPartners();
        expect(mockRepository.searchRead).toHaveBeenCalledWith('res.partner', ['name', 'email', 'phone'], [], 10, 0);
        expect(Array.isArray(partners)).toBe(true);
        expect(partners.length).toBeGreaterThan(0);
        const firstPartner = partners[0];
        expect(firstPartner).toHaveProperty('id');
        expect(firstPartner).toHaveProperty('name');
    });
    test('getPartnerById debe devolver un partner específico', async () => {
        const partnerId = 1;
        const partner = await erpService.getPartnerById(partnerId);
        expect(mockRepository.getById).toHaveBeenCalledWith('res.partner', partnerId, ['name', 'email', 'phone']);
        expect(partner).toBeDefined();
        expect(partner.id).toBe(partnerId);
    });
    test('getPartnerById debe lanzar error para ID inexistente', async () => {
        const invalidPartnerId = 99999;
        await expect(erpService.getPartnerById(invalidPartnerId))
            .rejects.toThrow(`Partner no encontrado con ID ${invalidPartnerId}`);
    });
});
