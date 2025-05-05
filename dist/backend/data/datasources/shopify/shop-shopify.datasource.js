import { logger } from "../../../helpers/logger-helper.js";
import { GET_SHOP_ID, RE_METAFIELD_MUTATION } from "./queries/shop-queries.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
export class ShopShopifyDatasource extends ShopifyBaseDatasource {
    constructor(shop) {
        super(shop);
    }
    async getShopId() {
        try {
            const graphqlClient = await this.getGraphqlClient();
            const queryResponse = await graphqlClient.query({
                data: {
                    query: GET_SHOP_ID
                }
            });
            const shopId = queryResponse.body.data.shop.id;
            return shopId;
        }
        catch (error) {
            logger.error('Algo fue mal intentando obtener el ID de la shop, ', error);
            throw error;
        }
    }
    async setRecargoShopMetafield(id, shopId) {
        logger.debug('Cambiendo metafield de shop de recargo de equivalencia.');
        try {
            const graphqlClient = await this.getGraphqlClient();
            const queryResponse = await graphqlClient.query({
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
            if (data.metafieldsSet.userErrors.length > 0) {
                logger.error('La query se ha ejecutado con errores.');
                logger.error(data.metafieldsSet.userErrors);
                return false;
            }
            return true;
        }
        catch (error) {
            logger.error('No se ha podido cambiar el metafield del recargo de equivalencia, ', error);
            throw error;
        }
    }
}
