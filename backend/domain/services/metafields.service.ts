import { MetafieldsRepository } from "../../data/repositories/metafields.repository.js";
import { logger } from "../../helpers/logger-helper.js";
import { MetafieldDefinition } from "../entities/metafieldDefinition.js";
import { MetafieldSetInput } from "../entities/metafields.js";

export class MetafieldsService {
  constructor(private readonly metafieldsRepository: MetafieldsRepository) {}

  async createMetafield(metafieldDefinition: MetafieldDefinition) {
    try {
      return await this.metafieldsRepository.createMetafield(
        metafieldDefinition
      );
    } catch (error) {
      logger.error(
        "MetafieldsService Error: No se ha podido crear el metafieldDefinition, ",
        error
      );
      return false;
    }
  }

  async doesMetafieldExist(metafield: MetafieldDefinition) {
    try {
      return await this.metafieldsRepository.doesMetafieldExist(metafield);
    } catch(error) {
      logger.error('MetafieldsService Error: No se ha podido encontrar el metafield, ', error);
      return false;
    }
  }

  async metafieldsSet(input: MetafieldSetInput[]) {
    try {
      return await this.metafieldsRepository.metafieldsSet(input);
    } catch(error) {
      logger.error('MetafieldsService Error: No se ha podido actualizar el metafield, ', error);
      return false;
    }
  }
}
