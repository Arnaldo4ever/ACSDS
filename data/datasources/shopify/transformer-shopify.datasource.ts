import { logger } from "../../../helpers/logger-helper.js";
import { TransformerDatasource } from "../transformer.datasource.js";
import { SET_TRANSFORMER_METAFIELD, SET_TRANSFORMER_METAFIELD_RESULT } from "./queries/transformer-queries.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
import { RequestReturn } from "@shopify/shopify-api/lib/clients/http_client/types.js";

export class TransformerShopifyDatasource extends ShopifyBaseDatasource implements TransformerDatasource {
  constructor(shop: string) {
    super(shop);
  }

  async setTransformerMetafield(cartTransformer: string, value: string): Promise<boolean> {
    try {
      logger.debug('Intentando cambiar metafield de cart transformer...');
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<SET_TRANSFORMER_METAFIELD_RESULT> = await graphqlClient.query({
        data: {
          query: SET_TRANSFORMER_METAFIELD,
          variables: {
            ownerId: cartTransformer,
            value: value
          }
        }
      });
      const data = queryResponse.body.data;
      logger.debug(data);
      return true;
    } catch(error) {
      logger.error('Algo fue mal al intentar cambiar el metafield del cartTransformer, ', error);
      throw error;
    }
  }
}