// Interfaz base para todos los modelos de ERP
export interface ERPModel {
  id: number;
  name: string;
}

// Interfaz para órdenes de venta
export interface SaleOrder extends ERPModel {
  state: string;
  amount_total: number;
  date_order?: Date;
  partner_id?: number;
  user_id?: number;
  currency_id?: number;
}

// Interfaz para partners (clientes/proveedores)
export interface Partner extends ERPModel {
  email: string;
  phone: string;
  street?: string;
  city?: string;
  country_id?: number;
  vat?: string;
  customer?: boolean;
  supplier?: boolean;
}

// Interfaz para productos
export interface Product extends ERPModel {
  list_price: number;
  default_code?: string;
  categ_id?: number;
  type: 'product' | 'service' | 'consu';
  uom_id?: number;
  standard_price?: number;
  active?: boolean;
}

// Interfaz para compañías
export interface Company extends ERPModel {
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  country_id?: number;
  vat?: string;
  currency_id?: number;
  logo_web?: string;
}

// Interfaz para usuarios
export interface User extends ERPModel {
  login: string;
  email?: string;
  active?: boolean;
  company_id?: number;
  groups_id?: number[];
}

// Interfaz para facturas
export interface Invoice extends ERPModel {
  number: string;
  state: string;
  amount_total: number;
  date_invoice?: Date;
  partner_id?: number;
  user_id?: number;
  currency_id?: number;
}

// Interfaz para líneas de pedido
export interface SaleOrderLine extends ERPModel {
  order_id: number;
  product_id: number;
  product_uom_qty: number;
  price_unit: number;
  price_subtotal: number;
  tax_id?: number[];
}

// Interfaz para categorías de productos
export interface ProductCategory extends ERPModel {
  parent_id?: number;
  complete_name?: string;
}