import { MetaobjectsRepository } from "../../data/repositories/metaobjects.repository.js";
import { logger } from "../../helpers/logger-helper.js";
import { MetaobjectDefintion } from "../entities/metaobject-definition.js";
import { MetaobjectUpdate } from "../entities/metaobject-update.js";

export class MetaobjectsService {
  constructor(private readonly metaobjectsRepository: MetaobjectsRepository) {}

  async createMetaobject(
    metaobjectDefintion: MetaobjectDefintion
  ): Promise<boolean> {
    try {
      await this.metaobjectsRepository.createMetaObject(metaobjectDefintion);
      return true;
    } catch (error) {
      console.log("MetaobjectsService: Error en createMetaobject", error);
      return false;
    }
  }

  async metaobjectUpdate(metaobjectUpdate: MetaobjectUpdate) {
    try {
      await this.metaobjectsRepository.metaobjectUpdate(metaobjectUpdate);
      return true;
    } catch (error) {
      console.log("MetaobjectsService: Error en metaobjectUpdate", error);
      return false;
    }
  }

  async getCustomersList() {
    try {
      const users_list = await this.metaobjectsRepository.getCustomersList();
      return users_list;
    } catch (error) {
      logger.error("MetaobjectService: Error en getCustomersList, ", error);
      return null;
    }
  }
  async doesMetaobjectDefinitionExist(metaobjectDefinition: MetaobjectDefintion) {
    try {
      return await this.metaobjectsRepository.doesMetaobjectDefinitionExist(metaobjectDefinition);
    } catch(error) {
      logger.error(`MetaobjectsService: Error en doesMetaobjectDefinitionExist, `, error);
      return "";
    }
  }
}
