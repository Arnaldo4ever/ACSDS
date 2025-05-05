import { MetafieldDefinition } from "../../domain/entities/metafieldDefinition.js";
import { MetafieldSetInput } from "../../domain/entities/metafields.js";
import { MetafieldsDatasource } from "../datasources/metafields.datasource.js";

export class MetafieldsRepository {
  constructor(private readonly metafieldsDatasource: MetafieldsDatasource) {}

  async createMetafield(metafieldDefinition: MetafieldDefinition) {
    return await this.metafieldsDatasource.createMetafield(metafieldDefinition);
  }

  async doesMetafieldExist(metafield: MetafieldDefinition) {
    return await this.metafieldsDatasource.doesMetafieldExist(metafield);
  }
  async metafieldsSet(input: MetafieldSetInput[]) {
    return await this.metafieldsDatasource.metafieldsSet(input);
  }
}
