import { logger } from "../../../helpers/logger-helper.js";
import { ShopDatasource } from "../shop.datasource.js";
import { GET_SHOP_ID, GET_SHOP_ID_RESULT, RE_METAFIELD_MUTATION, RE_METAFIELD_MUTATION_RESULT } from "./queries/shop-queries.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
import { RequestReturn } from "@shopify/shopify-api/lib/clients/http_client/types.js";

export class ShopShopifyDatasource extends ShopifyBaseDatasource implements ShopDatasource {
  constructor(shop: string) {
    super(shop);
  }

  async getShopId(): Promise<string> {
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<GET_SHOP_ID_RESULT> = await graphqlClient.query({
        data: {
          query: GET_SHOP_ID
        }
      });
      const shopId = queryResponse.body.data.shop.id;
      return shopId;
    } catch(error) {
      logger.error('Algo fue mal intentando obtener el ID de la shop, ', error);
      throw error;
    }
  }

  async setRecargoShopMetafield(id: string, shopId: string): Promise<boolean> {
    logger.debug('Cambiendo metafield de shop de recargo de equivalencia.');
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<RE_METAFIELD_MUTATION_RESULT> = await graphqlClient.query({
        data: {
          query: RE_METAFIELD_MUTATION,
          variables: {
            metafields: [
              {
                namespace: "upng",
                key: "recargo_id",
                ownerId: shopId,
                type: "single_line_text_field",
                value: id
              }
            ]
          }
        }
      });
      const data = queryResponse.body.data;
      logger.debug(data);
      if(data.metafieldsSet.userErrors.length > 0) {
        logger.error('La query se ha ejecutado con errores.');
        logger.error(data.metafieldsSet.userErrors);
        return false;
      }
      return true;
    } catch(error) {
      logger.error('No se ha podido cambiar el metafield del recargo de equivalencia, ', error);
      throw error;
    }
  }
  
}