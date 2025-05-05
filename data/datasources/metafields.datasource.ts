import { MetafieldDefinition } from "../../domain/entities/metafieldDefinition.js";
import { MetafieldSetInput } from "../../domain/entities/metafields.js";

export abstract class MetafieldsDatasource {
  abstract createMetafield(
    metafieldDefinition: MetafieldDefinition
  ): Promise<boolean>;
  abstract doesMetafieldExist(metafield: MetafieldDefinition): Promise<boolean>;
  abstract metafieldsSet(input: MetafieldSetInput[]): Promise<boolean>;
}
