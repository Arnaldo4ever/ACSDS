import { ERPRepository } from '../../data/repositories/erp.repository.js';
export class ERPService {
    repository;
    constructor() {
        this.repository = new ERPRepository();
    }
    // Métodos para órdenes de venta
    async getSaleOrders(fields = ['name', 'state', 'amount_total'], domain = [], limit = 10, offset = 0) {
        return this.repository.searchRead('sale.order', fields, domain, limit, offset);
    }
    async getSaleOrderById(id, fields = ['name', 'state', 'amount_total']) {
        const order = await this.repository.getById('sale.order', id, fields);
        if (!order) {
            throw new Error(`Orden no encontrada con ID ${id}`);
        }
        return order;
    }
    // Métodos para partners (clientes/proveedores)
    async getPartners(fields = ['name', 'email', 'phone'], domain = [], limit = 10, offset = 0) {
        return this.repository.searchRead('res.partner', fields, domain, limit, offset);
    }
    async getPartnerById(id, fields = ['name', 'email', 'phone']) {
        const partner = await this.repository.getById('res.partner', id, fields);
        if (!partner) {
            throw new Error(`Partner no encontrado con ID ${id}`);
        }
        return partner;
    }
    // Métodos para productos
    async getProducts(fields = ['name', 'list_price', 'default_code'], domain = [], limit = 10, offset = 0) {
        return this.repository.searchRead('product.product', fields, domain, limit, offset);
    }
    async getProductById(id, fields = ['name', 'list_price', 'default_code']) {
        const product = await this.repository.getById('product.product', id, fields);
        if (!product) {
            throw new Error(`Producto no encontrado con ID ${id}`);
        }
        return product;
    }
    // Métodos para compañías
    async getCompanies(fields = ['name', 'email', 'phone'], domain = [], limit = 10, offset = 0) {
        return this.repository.searchRead('res.company', fields, domain, limit, offset);
    }
    async getCompanyById(id, fields = ['name', 'email', 'phone']) {
        const company = await this.repository.getById('res.company', id, fields);
        if (!company) {
            throw new Error(`Compañía no encontrada con ID ${id}`);
        }
        return company;
    }
    // Métodos de búsqueda genéricos
    async searchRead(model, fields = [], domain = [], limit = 10, offset = 0) {
        return this.repository.searchRead(model, fields, domain, limit, offset);
    }
    async getById(model, id, fields = []) {
        const record = await this.repository.getById(model, id, fields);
        if (!record) {
            throw new Error(`Registro no encontrado en ${model} con ID ${id}`);
        }
        return record;
    }
    // Método para buscar attachments de un producto
    async getProductAttachments(productId) {
        return this.repository.searchRead('ir.attachment', ['name', 'datas', 'type'], [
            ['res_model', '=', 'product.product'],
            ['res_id', '=', productId]
        ]);
    }
}
