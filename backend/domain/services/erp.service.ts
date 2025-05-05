import { ERPRepository } from '../../data/repositories/erp.repository.js';
import { 
  SaleOrder, 
  Partner, 
  Product, 
  Company 
} from '../entities/erp-models.js';

export class ERPService {
  private repository: ERPRepository;

  constructor() {
    this.repository = new ERPRepository();
  }

  // Métodos para órdenes de venta
  async getSaleOrders(
    fields: string[] = ['name', 'state', 'amount_total'], 
    domain: any[] = [], 
    limit = 10, 
    offset = 0
  ): Promise<SaleOrder[]> {
    return this.repository.searchRead<SaleOrder>('sale.order', fields, domain, limit, offset);
  }

  async getSaleOrderById(id: number, fields: string[] = ['name', 'state', 'amount_total']): Promise<SaleOrder> {
    const order = await this.repository.getById<SaleOrder>('sale.order', id, fields);
    
    if (!order) {
      throw new Error(`Orden no encontrada con ID ${id}`);
    }
    
    return order;
  }

  // Métodos para partners (clientes/proveedores)
  async getPartners(
    fields: string[] = ['name', 'email', 'phone'], 
    domain: any[] = [], 
    limit = 10, 
    offset = 0
  ): Promise<Partner[]> {
    return this.repository.searchRead<Partner>('res.partner', fields, domain, limit, offset);
  }

  async getPartnerById(id: number, fields: string[] = ['name', 'email', 'phone']): Promise<Partner> {
    const partner = await this.repository.getById<Partner>('res.partner', id, fields);
    
    if (!partner) {
      throw new Error(`Partner no encontrado con ID ${id}`);
    }
    
    return partner;
  }

  // Métodos para productos
  async getProducts(
    fields: string[] = ['name', 'list_price', 'default_code'], 
    domain: any[] = [], 
    limit = 10, 
    offset = 0
  ): Promise<Product[]> {
    return this.repository.searchRead<Product>('product.product', fields, domain, limit, offset);
  }

  async getProductById(id: number, fields: string[] = ['name', 'list_price', 'default_code']): Promise<Product> {
    const product = await this.repository.getById<Product>('product.product', id, fields);
    
    if (!product) {
      throw new Error(`Producto no encontrado con ID ${id}`);
    }
    
    return product;
  }

  // Métodos para compañías
  async getCompanies(
    fields: string[] = ['name', 'email', 'phone'], 
    domain: any[] = [], 
    limit = 10, 
    offset = 0
  ): Promise<Company[]> {
    return this.repository.searchRead<Company>('res.company', fields, domain, limit, offset);
  }

  async getCompanyById(id: number, fields: string[] = ['name', 'email', 'phone']): Promise<Company> {
    const company = await this.repository.getById<Company>('res.company', id, fields);
    
    if (!company) {
      throw new Error(`Compañía no encontrada con ID ${id}`);
    }
    
    return company;
  }

  // Métodos de búsqueda genéricos
  async searchRead<T>(
    model: string, 
    fields: string[] = [], 
    domain: any[] = [], 
    limit = 10, 
    offset = 0
  ): Promise<T[]> {
    return this.repository.searchRead<T>(model, fields, domain, limit, offset);
  }

  async getById<T>(
    model: string, 
    id: number, 
    fields: string[] = []
  ): Promise<T> {
    const record = await this.repository.getById<T>(model, id, fields);
    
    if (!record) {
      throw new Error(`Registro no encontrado en ${model} con ID ${id}`);
    }
    
    return record;
  }

  // Método para buscar attachments de un producto
  async getProductAttachments(productId: number): Promise<any[]> {
    return this.repository.searchRead('ir.attachment', 
      ['name', 'datas', 'type'], 
      [
        ['res_model', '=', 'product.product'], 
        ['res_id', '=', productId]
      ]
    );
  }
}