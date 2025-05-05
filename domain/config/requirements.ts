import { MetafieldDefinition } from "../entities/metafieldDefinition.js";
import { MetaobjectDefintion } from "../entities/metaobject-definition.js";

export const SETTINGS_PATH = './upango.sqlite';

// Si no quieres crear alguno de estos dos, simplemente déjalos como un array vacío

export const REQUIRED_METAFIELDS: MetafieldDefinition[] = [
  new MetafieldDefinition(
    "Icono",
    "upng",
    "icono",
    "Icono de la página",
    "file_reference",
    "PAGE",
    [{
      name: "file_type_options",
      value: '["Image"]',
    }]
  ),
  new MetafieldDefinition(
    "Tarifa",
    "upng",
    "tarifa",
    "Identificador de la tarifa que aplica al cliente. Se usa siempre en nuestro conector",
    "single_line_text_field",
    "COMPANY"
  ),
  new MetafieldDefinition(
    "Zona Fiscal",
    "upng",
    "zona_fiscal",
    "Zona fiscal de cliente. Se utiliza para identificar las empresas a las que hay que aplicar recargo de equivalencia, pero podría utilizarse para más cosas en el futuro.",
    "single_line_text_field",
    "COMPANY"
  ),
  new MetafieldDefinition(
    "SEO Hidden",
    "seo",
    "hidden",
    "Si a este metafield le ponemos un valor 1, el producto no aparece en los resultados de búsqueda.",
    "number_integer",
    "PRODUCT"
  ),
  new MetafieldDefinition(
    "Puede escoger pago",
    "upng",
    "puede_escoger_pago",
    "Muestra en el carrito el selector entre pagar y usar el término de pago para permitir hacer el pedido sin pagar",
    "boolean",
    "COMPANY"
  ),
  new MetafieldDefinition(
    "Tax Class",
    "upng",
    "tax-class",
    "Normalmente tendrá alguno de los siguientes valores: \"normal\", \"reducido\", \"superreducido\"",
    "single_line_text_field",
    "PRODUCT"
  ),
  new MetafieldDefinition(
    "Grupo Clientes",
    "upng",
    "grupo_clientes",
    "Para indicar el grupo de clientes que queremos que tenga acceso a la página",
    "single_line_text_field",
    "PAGE"
  ),
  new MetafieldDefinition(
    "Secret Token",
    "upng",
    "secret_token",
    "Token Secreto de Usuario, utilizado para autentificación",
    "single_line_text_field",
    "CUSTOMER"
  ),
  new MetafieldDefinition(
    "Recargo Equivalencia",
    "upng",
    "recargo_id",
    "ID de la variante de Producto del Recargo de Equivalencia",
    "single_line_text_field",
    "SHOP"
  ),
  new MetafieldDefinition(
    "Descuento Cliente",
    "upng",
    "company-discount",
    "Porcentaje de descuento que se aplicará en los pedidos de la empresa",
    "number_decimal",
    "COMPANY"
  ),
  new MetafieldDefinition(
    "Ultima visita",
    "upng",
    "last_visit",
    "Fecha y hora de la última visita del cliente a la tienda",
    "date_time",
    "CUSTOMER"
  )
];

export const REQUIRED_METAOBJECTS: MetaobjectDefintion[] = [
];