import { readFile } from "fs/promises";
import { logger } from "../../helpers/logger-helper.js";
export class SettingsService {
    settingsDatasource;
    // Caché de ajustes, para no tener que acceder a la base de datos todo el rato.
    settingsCache;
    constructor(settingsDatasource) {
        this.settingsDatasource = settingsDatasource;
        this.settingsCache = new Map();
    }
    async getSetting(params) {
        try {
            return await this.settingsDatasource.getSetting(params.name);
        }
        catch (error) {
            logger.error('SettingsService: Error al obtener un ajuste, ', error);
            return;
        }
    }
    // Devuelve el valor de un parámetro.
    async getParamValue(params) {
        try {
            if (params.cache) {
                const cachedVal = this.settingsCache.get(params.name);
                if (cachedVal)
                    return cachedVal;
            }
            const setting = await this.getSetting({ name: params.name });
            if (!setting) {
                logger.error(`No se ha encontrado un ajuste bajo el nombre: ${params.name}`);
                return;
            }
            const type = setting.type;
            const value = setting.value;
            // Ahora voy a mirar el tipo y devolver un valor del tipo adecuado.
            switch (type) {
                case 'string':
                    this.settingsCache.set(params.name, value);
                    return value;
                case 'int':
                    const intVal = parseInt(value);
                    if (isNaN(intVal)) {
                        logger.error(`${params.name} tiene un valor NO entero pero es de tipo entero`);
                        return;
                    }
                    this.settingsCache.set(params.name, intVal);
                    return intVal;
                case 'float':
                    const floatVal = parseFloat(value);
                    if (isNaN(floatVal)) {
                        logger.error(`${params.name} tiene un valor NO numérico pero es de tipo entero`);
                        return;
                    }
                    this.settingsCache.set(params.name, floatVal);
                    return floatVal;
                case 'boolean':
                    if (value != "true" && value != "false") {
                        logger.error(`El ajuste ${params.name} es de tipo booleano, pero tiene un valor NO booleano`);
                        return;
                    }
                    this.settingsCache.set(params.name, value == "true" ? true : false);
                    return value == "true" ? true : false;
                default:
                    this.settingsCache.set(params.name, value);
                    return value;
            }
        }
        catch (error) {
            logger.error('SettingsService: Error al obtener el valor de un ajuste, ', error);
            return;
        }
    }
    async getAllSettings() {
        try {
            logger.debug('Obteniendo todos los ajustes de la aplicación');
            return await this.settingsDatasource.getSettingsData();
        }
        catch (error) {
            logger.error('SettingsService: Error al obtener todos los ajustes, ', error);
        }
    }
    async saveSettings(params) {
        try {
            const settings_map = params.settings_map;
            // Vamos a obtener todos los settings primero para comprobar que los tipos son correctos.
            const settings = await this.getAllSettings();
            // Si no hay settings, hay un problema, por lo que no hagas nada.
            if (!settings) {
                logger.error('SettingsService: Error, no hay ajustes para esta aplicación.');
                return false;
            }
            // Voy a construir un mapa de cada setting con su tipo.
            const settings_types = new Map();
            settings.forEach((setting) => {
                settings_types.set(setting.name, setting.type);
            });
            // Ahora debemos comprobar que los valores enviados son del tipo correcto y los insertamos en la base de datos.
            for (const [name, value] of settings_map) {
                const type = settings_types.get(name);
                if (!type) {
                    console.error(`No se ha encontrado tipo para el ajuste: ${name}`);
                    continue;
                }
                // Comprobamos que el tipo es válido.
                let valid = false;
                switch (type) {
                    case 'string':
                        valid = true;
                        this.settingsCache.set(name, value);
                        break;
                    case 'int':
                        const intVal = parseInt(value);
                        if (!isNaN(intVal))
                            valid = true;
                        this.settingsCache.set(name, intVal);
                        break;
                    case 'float':
                        const floatVal = parseFloat(value);
                        if (!isNaN(floatVal))
                            valid = true;
                        this.settingsCache.set(name, floatVal);
                        break;
                    case 'boolean':
                        if (value == "true" || value == "false")
                            valid = true;
                        this.settingsCache.set(name, value == "true" ? true : false);
                        break;
                    default:
                        valid = true;
                        this.settingsCache.set(name, value);
                        break;
                }
                if (valid)
                    await this.settingsDatasource.modifySetting(name, value);
                else
                    logger.error('El dato introducido no tiene un tipo válido');
            }
            return true;
        }
        catch (error) {
            logger.error('SettingsService: Error, no se han podido guardar los nuevos ajustes, ', error);
            return false;
        }
    }
    // I'm gonna be honest, the old way is overkill if you just want to change 1 setting.
    // Will return false if it fails to change the setting.
    async saveSetting(name, value) {
        try {
            // Check if the setting exists in the first place.
            const setting = await this.settingsDatasource.getSetting(name);
            if (!setting) {
                logger.error(`No se ha encontrado el ajuste ${name} en la base de datos.`);
                return false;
            }
            // Check if the type is valid.
            let valid = false;
            switch (setting.type) {
                case 'string':
                    valid = true;
                    break;
                case 'int':
                    const intVal = parseInt(value);
                    if (!isNaN(intVal))
                        valid = true;
                    break;
                case 'float':
                    const floatVal = parseFloat(value);
                    if (!isNaN(floatVal))
                        valid = true;
                    break;
                case 'boolean':
                    if (value == "true" || value == "false")
                        valid = true;
                    break;
                default:
                    valid = true;
                    break;
            }
            if (!valid) {
                logger.error(`Type: ${setting.type} is not valid or value: ${value} is not valid.`);
                return false;
            }
            await this.settingsDatasource.modifySetting(name, value);
            return true;
        }
        catch (error) {
            logger.error("SettingsService Error: Could not change settings, ", error);
            return false;
        }
    }
    // This function will open the settings.json file and try to create all the fields defined there.
    async runSettingsInstaller() {
        try {
            await this.settingsDatasource.syncSettings();
            // Read the settings.json file.
            const settings_file = await readFile("settings.json", "utf-8");
            // Parse the file.
            const parsed_settings = JSON.parse(settings_file);
            // For each setting, try to create it.
            for (let i = 0; i < parsed_settings.settings.length; i++) {
                const setting = parsed_settings.settings[i];
                await this.settingsDatasource.insertSetting(setting);
            }
            return true;
        }
        catch (error) {
            logger.error("SettingsService Error: Failed to install settings, ", error);
            return false;
        }
    }
    async runSettingsUpdater() {
        try {
            // Read the settings.json file.
            const settings_file = await readFile("settings.json", "utf-8");
            // Parse the file.
            const parsed_settings = JSON.parse(settings_file);
            // Get the current settings.
            const current_settings = await this.settingsDatasource.getSettingsData();
            if (!current_settings) {
                logger.error("SettingsService Error: Failed to get current settings, returning false");
                return false;
            }
            // For each setting, if it doesn't already exists, create it.
            for (let i = 0; i < parsed_settings.settings.length; i++) {
                const setting = parsed_settings.settings[i];
                const existing_setting = await this.settingsDatasource.getSetting(setting.name);
                if (!existing_setting) {
                    await this.settingsDatasource.insertSetting(setting);
                }
            }
            // For each setting that does not exist in the file, we will delete it.
            for (let i = 0; i < current_settings.length; i++) {
                const setting = current_settings[i];
                const existing_setting = parsed_settings.settings.find(s => s.name == setting.name);
                if (!existing_setting) {
                    await this.settingsDatasource.deleteSetting(setting);
                }
            }
            return true;
        }
        catch (error) {
            logger.error("SettingsService Error: Failed to update settings, ", error);
            return false;
        }
    }
    async checkUpdates() {
        try {
            // Read the settings.json file.
            const settings_file = await readFile("settings.json", "utf-8");
            // Parse the file.
            const parsed_settings = JSON.parse(settings_file);
            // For each setting, if it doesn't already exists, return true.
            let updates = false;
            // Get all current settings.
            const settings = await this.settingsDatasource.getSettingsData();
            if (!settings) {
                logger.error("SettingsService Error: Failed to get current settings, returning false");
                return false;
            }
            for (let i = 0; i < parsed_settings.settings.length; i++) {
                const setting = parsed_settings.settings[i];
                const existing_setting = settings.find(s => s.name == setting.name);
                if (!existing_setting) {
                    updates = true;
                    break;
                }
            }
            // Also check if there is a current setting that does not exist in the file.
            for (let i = 0; i < settings.length; i++) {
                const setting = settings[i];
                const existing_setting = parsed_settings.settings.find(s => s.name == setting.name);
                if (!existing_setting) {
                    updates = true;
                    break;
                }
            }
            return updates;
        }
        catch (error) {
            logger.error("SettingsService Error: Failed to get if there are updates, ", error);
            return false;
        }
    }
}
