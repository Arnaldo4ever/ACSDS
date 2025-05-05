import { logger } from "../../helpers/logger-helper.js";
export class MetafieldsService {
    metafieldsRepository;
    constructor(metafieldsRepository) {
        this.metafieldsRepository = metafieldsRepository;
    }
    async createMetafield(metafieldDefinition) {
        try {
            return await this.metafieldsRepository.createMetafield(metafieldDefinition);
        }
        catch (error) {
            logger.error("MetafieldsService Error: No se ha podido crear el metafieldDefinition, ", error);
            return false;
        }
    }
    async doesMetafieldExist(metafield) {
        try {
            return await this.metafieldsRepository.doesMetafieldExist(metafield);
        }
        catch (error) {
            logger.error('MetafieldsService Error: No se ha podido encontrar el metafield, ', error);
            return false;
        }
    }
    async metafieldsSet(input) {
        try {
            return await this.metafieldsRepository.metafieldsSet(input);
        }
        catch (error) {
            logger.error('MetafieldsService Error: No se ha podido actualizar el metafield, ', error);
            return false;
        }
    }
}
