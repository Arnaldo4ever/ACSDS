import { logger } from "../../helpers/logger-helper.js";
export class ShopService {
    shopDatasource;
    constructor(shopDatasource) {
        this.shopDatasource = shopDatasource;
    }
    async setRecargoShopMetafield(id) {
        try {
            const shopId = await this.shopDatasource.getShopId();
            return await this.shopDatasource.setRecargoShopMetafield(id, shopId);
        }
        catch (error) {
            logger.error('ShopService Error: No se ha podido cambiar el ID en el metafield de shop del recargo de equivalencia, ', error);
            return false;
        }
    }
}
