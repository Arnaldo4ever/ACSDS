export class MetaobjectsRepository {
    metaobjectsDatasource;
    constructor(metaobjectsDatasource) {
        this.metaobjectsDatasource = metaobjectsDatasource;
    }
    async createMetaObject(metaobjectDefintion) {
        return await this.metaobjectsDatasource.createMetaObject(metaobjectDefintion);
    }
    async metaobjectUpdate(metaobjectUpdate) {
        return await this.metaobjectsDatasource.metaobjectUpdate(metaobjectUpdate);
    }
    async getCustomersList() {
        return await this.metaobjectsDatasource.getCustomersList();
    }
    async doesMetaobjectDefinitionExist(metaobjectDefinition) {
        return await this.metaobjectsDatasource.doesMetaobjectDefinitionExist(metaobjectDefinition);
    }
}
