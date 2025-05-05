import { Request, Response } from "express";
import { logger } from "../../helpers/logger-helper.js";
import { SettingsController } from "./settings.controller.js";
import { SettingsSqliteDatasource } from "../../data/datasources/sqlite/settings-sqlite.datasource.js";
import { SETTINGS_PATH } from "../../domain/config/requirements.js";
import { SettingsService } from "../../domain/services/settings.service.js";
import { TransformerService } from "../../domain/services/transformer.service.js";
import { TransformerShopifyDatasource } from "../../data/datasources/shopify/transformer-shopify.datasource.js";

export class TransformerController {

  public async setTransfromerMetafield(req: Request, res: Response) {
    const body = req.body;
    try {
      const value = body.value as string | undefined;
      const shop = res.locals.shopify.session.shop as string | undefined;
      if(!value || !shop) {
        logger.error('setTransfromerMetafield: Request Incompleta.');
        res.status(400).json({ status: 'Bad Request' });
        return;
      }
      const transformerService = new TransformerService(new TransformerShopifyDatasource(shop));
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const transformer_id = await settingsService.getParamValue({ name: 'cart_transformer_id' }) as string | undefined;
      if(!transformer_id) {
        logger.error('No se ha encontrado ID del transformador de carrito');
        res.status(500).json({ status: 'Server Error' });
        return;
      }
      const metafieldChangeResult = await transformerService.setTransformerMetafield(transformer_id, value);
      if(!metafieldChangeResult) {
        logger.error('Algo fue mal al intentar cambiar el metafield del cartTransformer.');
        res.status(500).json({ status: 'Server Error' });
        return;
      }
      const settingsUpdate: Map<string, string> = new Map();
      settingsUpdate.set('cart_transfomer_metafield', value);
      settingsService.saveSettings({ settings_map: settingsUpdate });
      res.status(200).json({ status: 'Success' });
      return;
    } catch(error) {
      logger.error('No se ha podido cambiar los datos del transformador de carrito.');
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }

  public async getTransformerRecargos(req: Request, res: Response) {
    logger.debug('Se han solicitado los valores de los recargos del cart transformer.');
    try {
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const transformer_value = await settingsService.getParamValue({ name: 'cart_transfomer_metafield' }) as string | undefined;
      if(typeof transformer_value === 'undefined') {
        logger.error('transformer_value ha devuelto undefined');
        res.status(500).json({ status: 'Server Error' });
        return;
      }
      res.status(200).json({ value: transformer_value });
    } catch(error) {
      logger.error('No se ha podido obtener el metafield del cart transformer.');
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }

  public async getCartTransformerID(req: Request, res: Response) {
    logger.debug('Se ha solicitado el ID del cart transformer.');
    try {
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const transformer_id = await settingsService.getParamValue({ name: 'cart_transformer_id' }) as string | undefined;
      if(!transformer_id) {
        logger.error('No se ha encontrado ID del cart transformer');
        res.status(404).json({ status: 'Not found' });
        return;
      }
      res.status(200).json({ id: transformer_id });
      return;
    } catch(error) {
      logger.error('No se ha podido obtener el ID del cart transformer.');
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }
}