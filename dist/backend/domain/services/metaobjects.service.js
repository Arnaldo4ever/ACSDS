import { logger } from "../../helpers/logger-helper.js";
export class MetaobjectsService {
    metaobjectsRepository;
    constructor(metaobjectsRepository) {
        this.metaobjectsRepository = metaobjectsRepository;
    }
    async createMetaobject(metaobjectDefintion) {
        try {
            await this.metaobjectsRepository.createMetaObject(metaobjectDefintion);
            return true;
        }
        catch (error) {
            console.log("MetaobjectsService: Error en createMetaobject", error);
            return false;
        }
    }
    async metaobjectUpdate(metaobjectUpdate) {
        try {
            await this.metaobjectsRepository.metaobjectUpdate(metaobjectUpdate);
            return true;
        }
        catch (error) {
            console.log("MetaobjectsService: Error en metaobjectUpdate", error);
            return false;
        }
    }
    async getCustomersList() {
        try {
            const users_list = await this.metaobjectsRepository.getCustomersList();
            return users_list;
        }
        catch (error) {
            logger.error("MetaobjectService: Error en getCustomersList, ", error);
            return null;
        }
    }
    async doesMetaobjectDefinitionExist(metaobjectDefinition) {
        try {
            return await this.metaobjectsRepository.doesMetaobjectDefinitionExist(metaobjectDefinition);
        }
        catch (error) {
            logger.error(`MetaobjectsService: Error en doesMetaobjectDefinitionExist, `, error);
            return "";
        }
    }
}
