import { logger } from "../../helpers/logger-helper.js";
export class TransformerService {
    transformerDatasource;
    constructor(transformerDatasource) {
        this.transformerDatasource = transformerDatasource;
    }
    async setTransformerMetafield(cartTransformer, value) {
        try {
            logger.debug('Cambiando metafield del cart transformer...');
            return await this.transformerDatasource.setTransformerMetafield(cartTransformer, value);
        }
        catch (error) {
            logger.error('TransformerService Error: No se ha podido cambiar el metafield del cart transformer, ', error);
            return false;
        }
    }
}
