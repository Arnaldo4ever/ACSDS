import { logger } from "../../helpers/logger-helper.js";
import { MetafieldsRepository } from "../../data/repositories/metafields.repository.js";
import { MetafieldsShopifyDatasource } from "../../data/datasources/shopify/metafields-shopify.datasource.js";
import { MetafieldsService } from "../../domain/services/metafields.service.js";
import { MetaobjectsService } from "../../domain/services/metaobjects.service.js";
import { MetaobjectsRepository } from "../../data/repositories/metaobjects.repository.js";
import { MetaobjectsShopifyDatasource } from "../../data/datasources/shopify/metaobjects-shopify.datasource.js";
import { REQUIRED_METAFIELDS, REQUIRED_METAOBJECTS } from "../../domain/config/requirements.js";
export class MetafieldsController {
    // Esta función se encarga de comunicarle al admin, qué metafields existen en la aplicación y cuáles están instalados.
    async getMetafields(req, res) {
        logger.debug("Se ha solicitado los metafields de la aplicación");
        try {
            const shop = res.locals.shopify.session.shop;
            if (!shop) {
                logger.error("Ha entrado una petición autenticada sin shop");
                res.status(400).json({ status: "Bad Request" });
                return;
            }
            const metafieldsRepository = new MetafieldsRepository(new MetafieldsShopifyDatasource(shop));
            const metafieldsService = new MetafieldsService(metafieldsRepository);
            // Ahora vamos a comprobar que los metafields existen.
            const result = {
                metafields: [],
                missing_metafields: [],
                metaobjects: [],
                missing_metaobjects: []
            };
            // Vamos a comprobar que todos los metafields requeridos existen.
            for (let i = 0; i < REQUIRED_METAFIELDS.length; i++) {
                const metafield = REQUIRED_METAFIELDS[i];
                logger.debug(`Comprobando si el metafield ${metafield.namespace}.${metafield.key} existe`);
                const metafieldResult = await metafieldsService.doesMetafieldExist(metafield);
                if (metafieldResult) {
                    result.metafields.push(metafield);
                }
                else {
                    result.missing_metafields.push(metafield);
                }
            }
            const metaobjectsRepository = new MetaobjectsRepository(new MetaobjectsShopifyDatasource(shop));
            const metaobjectsService = new MetaobjectsService(metaobjectsRepository);
            // Ahora vamos a hacer lo mismo con los metaobjetos.
            for (let i = 0; i < REQUIRED_METAOBJECTS.length; i++) {
                const metaobject = REQUIRED_METAOBJECTS[i];
                const doesMetaobjectExist = await metaobjectsService.doesMetaobjectDefinitionExist(metaobject);
                if (doesMetaobjectExist) {
                    result.metaobjects.push(metaobject);
                }
                else {
                    result.missing_metaobjects.push(metaobject);
                }
            }
            res.status(200).json({ data: result });
        }
        catch (error) {
            logger.error('No se ha podido consultar el estado de los metafields/metaobjetos de la aplicación, ', error);
            res.status(500).json({ status: 'Server Error' });
            return;
        }
    }
    async createMetafields(req, res) {
        logger.debug("Se ha solicitado crear los metafields de la aplicación...");
        try {
            // Esta petición solo puede ser autenticada
            const shop = res.locals.shopify.session.shop;
            if (!shop) {
                logger.error("Ha entrado una petición autenticada sin shop");
                res.status(400).json({ status: "Bad Request" });
                return;
            }
            // Esta aplicación necesita crear un metaobjeto.
            const metaobjectsRepository = new MetaobjectsRepository(new MetaobjectsShopifyDatasource(shop));
            const metaobjectsService = new MetaobjectsService(metaobjectsRepository);
            const metaobjectMaps = new Map();
            for (let i = 0; i < REQUIRED_METAOBJECTS.length; i++) {
                const appMetaobject = REQUIRED_METAOBJECTS[i];
                const metaobject = await metaobjectsService.createMetaobject(appMetaobject);
                // Ahora vamos a obtener el ID del metaobjeto, en caso de que lo necesitemos más tarde.
                logger.debug("Se ha creado el metaobject de la aplicación");
                const metaobjectId = await metaobjectsService.doesMetaobjectDefinitionExist(appMetaobject);
                if (!metaobjectId) {
                    logger.error('Algo fue mal intentando encontrar el ID del metaobjeto que se ha creado.');
                }
                else {
                    metaobjectMaps.set(appMetaobject.type, metaobjectId);
                }
            }
            const metafieldsRepository = new MetafieldsRepository(new MetafieldsShopifyDatasource(shop));
            const metafieldsService = new MetafieldsService(metafieldsRepository);
            // Ahora vamos a crear un array con todos los metafields necesarios para esta aplicación.
            // Creamos todos los metafields del array.
            for (let i = 0; i < REQUIRED_METAFIELDS.length; i++) {
                const metafieldDefinition = REQUIRED_METAFIELDS[i];
                // Ahora comprobamos si hay validaciones.
                if (metafieldDefinition.validations) {
                    metafieldDefinition.validations.forEach((validation) => {
                        // Si existe una validación de nombre: "metaobject_definition_id" o "metaobject_definition_ids", vamos a reemplazar todos los nombres de los metaobjetos por los IDs de los metaobjetos.
                        switch (validation.name) {
                            case "metaobject_definition_id":
                                const metaobjectDefinitionId = metaobjectMaps.get(validation.value);
                                if (metaobjectDefinitionId)
                                    validation.value = metaobjectDefinitionId;
                                break;
                            case "metaobject_definition_ids":
                                // En este caso, debemos construir un array con todos los IDs a los que queremos hacer referencia.
                                // Damos por hecho que validation.value es un array.
                                const result = [];
                                validation.value.forEach((val) => {
                                    const id = metaobjectMaps.get(val);
                                    id ? result.push(id) : logger.error(`No se ha encontrado metaobject de tipo: ${val}`);
                                });
                                validation.value = JSON.stringify(result);
                                break;
                            default:
                                break;
                        }
                    });
                }
                await metafieldsService.createMetafield(metafieldDefinition);
                logger.debug('Se ha creado un metafield de la aplicación');
            }
            res.status(200).json({ status: "Success!" });
            return;
        }
        catch (error) {
            logger.error("Error al intentar crear los metafields de la aplicación, ", error);
            res.status(500).json({ status: "Server Error" });
            return;
        }
    }
}
