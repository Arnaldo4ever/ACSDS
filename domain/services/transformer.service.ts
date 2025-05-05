import { TransformerDatasource } from "../../data/datasources/transformer.datasource.js";
import { logger } from "../../helpers/logger-helper.js";

export class TransformerService {
  constructor(private readonly transformerDatasource: TransformerDatasource) {}

  async setTransformerMetafield(cartTransformer: string, value: string) {
    try {
      logger.debug('Cambiando metafield del cart transformer...');
      return await this.transformerDatasource.setTransformerMetafield(cartTransformer, value);
    } catch(error) {
      logger.error('TransformerService Error: No se ha podido cambiar el metafield del cart transformer, ', error);
      return false;
    }
  }
}