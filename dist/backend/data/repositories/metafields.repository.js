export class MetafieldsRepository {
    metafieldsDatasource;
    constructor(metafieldsDatasource) {
        this.metafieldsDatasource = metafieldsDatasource;
    }
    async createMetafield(metafieldDefinition) {
        return await this.metafieldsDatasource.createMetafield(metafieldDefinition);
    }
    async doesMetafieldExist(metafield) {
        return await this.metafieldsDatasource.doesMetafieldExist(metafield);
    }
    async metafieldsSet(input) {
        return await this.metafieldsDatasource.metafieldsSet(input);
    }
}
