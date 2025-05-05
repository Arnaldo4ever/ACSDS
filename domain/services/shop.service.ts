import { ShopDatasource } from "../../data/datasources/shop.datasource.js";
import { logger } from "../../helpers/logger-helper.js";

export class ShopService {
  constructor(private readonly shopDatasource: ShopDatasource) {}

  async setRecargoShopMetafield(id: string) {
    try {
      const shopId = await this.shopDatasource.getShopId();
      return await this.shopDatasource.setRecargoShopMetafield(id, shopId);
    } catch(error) {
      logger.error('ShopService Error: No se ha podido cambiar el ID en el metafield de shop del recargo de equivalencia, ', error);
      return false;
    }
  }
}