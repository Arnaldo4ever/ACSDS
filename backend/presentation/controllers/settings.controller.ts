import { Request, Response } from "express";
import { logger } from "../../helpers/logger-helper.js";
import { SettingsService } from "../../domain/services/settings.service.js";
import { SettingsSqliteDatasource } from "../../data/datasources/sqlite/settings-sqlite.datasource.js";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";

const SETTINGS_PATH = './upango.sqlite';

export class SettingsController {

  public async runSettingsUpdater(req: Request, res: Response) {
    logger.debug("Actualizando los ajustes de la aplicación...");
    try {
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const updater_result = await settingsService.runSettingsUpdater();
      if(!updater_result) {
        logger.error("Updater failed");
        res.status(500).json({ status: 'Updater failed' });
        return;
      }
      res.status(200).json({ status: 'Success!' });
      return;
    } catch(error) {
      logger.error("Error al actualizar los ajustes de la aplicación, ", error);
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }

  public async runSettingsInstaller(req: Request, res: Response) {
    logger.debug('Instalando ajustes de la aplicación...');
    try {
      // Since this is the installer, the database is not guaranteed to exist, so we need to check if it does exists in the first place.
      const dbExists = existsSync(SETTINGS_PATH);
      if(!dbExists) {
        logger.debug("Settings DB does not exist, creating...");
        // Create the file.
        await writeFile(SETTINGS_PATH, "");
      }
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const installer_result = await settingsService.runSettingsInstaller();
      if(!installer_result) {
        logger.error("Installer failed");
        res.status(500).json({ status: 'Installer failed' });
        return;
      }
      res.status(200).json({ status: 'Success!' });
      return;
    } catch(error) {
      logger.error("Error al instalar los ajustes de la aplicación, ", error);
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }

  public async getParamValue(req: Request, res: Response) {
    logger.debug('Obteniendo valor de un parámetro');
    const param_name = req.query.param as string | undefined;
    try {
      if(!param_name) {
        logger.error('El usuario no ha proporcionado un parámetro');
        res.status(400).json({ status: 'Bad Request' });
        return;
      }
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const val = await settingsService.getParamValue({ name: param_name, cache: true });
      if(!val && val != false) {
        logger.error(`No se ha encontrado un ajuste con el nombre: ${param_name}`);
        res.status(404).json({ status: 'Not found' });
        return;
      }
      res.status(200).json({ data: val });
      return;
    } catch(error) {
      logger.error('Algo fue mal intentando obtener el valor de un parámetro, ', error);
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }

  public async getAllSettings(req: Request, res: Response) {
    try {
      logger.debug('Obteniendo todos los ajustes de la aplicación...');
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const settings = await settingsService.getAllSettings();
      console.log(settings);
      if(!settings) {
        res.status(404).json({ status: 'Not found' });
        return;
      }
      const updates = await settingsService.checkUpdates();
      res.status(200).json({ data: settings, updates: updates });
      return;
    } catch(error) {
      logger.error('Error al intentar obtener todos los ajustes de la aplicación, ', error);
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }

  public async saveSettings(req: Request, res: Response) {
    logger.debug('Guardando ajustes de la aplicación');
    const body = req.body;
    try {
      logger.debug(body);
      // Ahora vamos a contruir un mapa que asocia las claves del objeto con su valor.
      const settings_map: Map<string, string> = new Map(Object.entries(body));
      const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
      const result = await settingsService.saveSettings({ settings_map: settings_map });
      res.status(200).json({ status: 'Success!' });
    } catch(error) {
      console.error('Error al guardar los ajustes de la aplicación, ', error);
      res.status(500).json({ status: 'Server Error' });
      return;
    }
  }
}