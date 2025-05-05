import { logger } from "../../../helpers/logger-helper.js";
import { SET_TRANSFORMER_METAFIELD } from "./queries/transformer-queries.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
export class TransformerShopifyDatasource extends ShopifyBaseDatasource {
    constructor(shop) {
        super(shop);
    }
    async setTransformerMetafield(cartTransformer, value) {
        try {
            logger.debug('Intentando cambiar metafield de cart transformer...');
            const graphqlClient = await this.getGraphqlClient();
            const queryResponse = await graphqlClient.query({
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
        }
        catch (error) {
            logger.error('Algo fue mal al intentar cambiar el metafield del cartTransformer, ', error);
            throw error;
        }
    }
}
