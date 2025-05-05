export abstract class ShopDatasource {
  abstract getShopId(): Promise<string>;
  abstract setRecargoShopMetafield(id: string, shopId: string): Promise<boolean>;
}