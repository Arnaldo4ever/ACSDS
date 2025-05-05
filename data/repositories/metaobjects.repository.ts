import { MetaobjectDefintion } from "../../domain/entities/metaobject-definition.js";
import { MetaobjectUpdate } from "../../domain/entities/metaobject-update.js";
import { MetaobjectsDatasource } from "../datasources/metaobjects.datasource.js";

export class MetaobjectsRepository {
  constructor(private readonly metaobjectsDatasource: MetaobjectsDatasource) {}

  async createMetaObject(metaobjectDefintion: MetaobjectDefintion): Promise<boolean> {
    return await this.metaobjectsDatasource.createMetaObject(metaobjectDefintion);
  }
  async metaobjectUpdate(metaobjectUpdate: MetaobjectUpdate) {
    return await this.metaobjectsDatasource.metaobjectUpdate(metaobjectUpdate);
  }
  async getCustomersList() {
    return await this.metaobjectsDatasource.getCustomersList();
  }
  async doesMetaobjectDefinitionExist(metaobjectDefinition: MetaobjectDefintion) {
    return await this.metaobjectsDatasource.doesMetaobjectDefinitionExist(metaobjectDefinition);
  }
}