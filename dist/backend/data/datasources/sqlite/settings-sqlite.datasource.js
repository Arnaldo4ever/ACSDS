import { Setting } from "../../../domain/entities/setting.js";
import { logger } from "../../../helpers/logger-helper.js";
import { SQLiteBaseDatasource } from "./sqlite-base.datasource.js";
export class SettingsSqliteDatasource extends SQLiteBaseDatasource {
    constructor(path) {
        super(path);
    }
    async syncSettings() {
        const db = this.getDb();
        try {
            // El authenticate simplemente comprueba que podemos acceder a la base de datos.
            await db.authenticate();
            // Actualizo el ajuste.
            const SettingsModel = this.getSettingsModel(db);
            await SettingsModel.sync();
            // Cerramos la conexión con la base de datos.
            await db.close();
            return true;
        }
        catch (error) {
            await db.close();
            logger.error('Error al intentar sincronizar los ajustes, ', error);
            throw error;
        }
    }
    async deleteSetting(setting) {
        const db = this.getDb();
        try {
            // El authenticate simplemente comprueba que podemos acceder a la base de datos.
            await db.authenticate();
            // Actualizo el ajuste.
            const SettingsModel = this.getSettingsModel(db);
            await SettingsModel.destroy({
                where: {
                    name: setting.name
                }
            });
            // Cerramos la conexión con la base de datos.
            await db.close();
            return true;
        }
        catch (error) {
            await db.close();
            logger.error('Error al intentar borrar un ajuste, ', error);
            throw error;
        }
    }
    async insertSetting(setting) {
        const db = this.getDb();
        try {
            // El authenticate simplemente comprueba que podemos acceder a la base de datos.
            await db.authenticate();
            // Actualizo el ajuste.
            const SettingsModel = this.getSettingsModel(db);
            await SettingsModel.create({
                name: setting.name,
                description: setting.description,
                type: setting.type,
                value: setting.value
            });
            // Cerramos la conexión con la base de datos.
            await db.close();
            return true;
        }
        catch (error) {
            await db.close();
            logger.error('Error al intentar crear un ajuste, ', error);
            throw error;
        }
    }
    // Esta función devuelve <any> como valor porque puede devolver cualquier cosa.
    // El usuario debería de saber qué valor está llamando al conseguir este ajuste y por lo tanto, que tipo de datos devuelve.
    async getSetting(name) {
        const db = this.getDb();
        try {
            // Comprobamos que podemos acceder a la base de datos.
            await db.authenticate();
            // Obtener el modelo de Settings.
            const SettingsModel = this.getSettingsModel(db);
            // Obtenemos el valor.
            const settings = await SettingsModel.findAll({
                where: {
                    name: name
                }
            });
            if (settings.length <= 0) {
                logger.error('No se ha encontrado ningún setting con ese nombre');
                return;
            }
            // Solo debería de existir 1 resultado.
            const setting = settings[0];
            const setting_name = setting.get('name');
            const description = setting.get('description');
            const type = setting.get('type');
            const value = setting.get('value');
            return new Setting(setting_name, description, type, value);
        }
        catch (error) {
            logger.error('Algo fue mal intentando obtener el valor de un parámetro, ', error);
            throw error;
        }
    }
    async modifySetting(name, value) {
        const db = this.getDb();
        try {
            // El authenticate simplemente comprueba que podemos acceder a la base de datos.
            await db.authenticate();
            // Actualizo el ajuste.
            const SettingsModel = this.getSettingsModel(db);
            await SettingsModel.update({ value: value }, {
                where: {
                    name: name
                }
            });
            // Cerramos la conexión con la base de datos.
            await db.close();
            return true;
        }
        catch (error) {
            await db.close();
            logger.error('Error al intentar modificar un ajuste, ', error);
            throw error;
        }
    }
    async getSettingsData() {
        const db = this.getDb();
        try {
            await db.authenticate();
            const SettingsModel = this.getSettingsModel(db);
            const settings = await SettingsModel.findAll();
            await db.close();
            let result = [];
            settings.forEach((setting) => {
                const name = setting.get('name');
                const description = setting.get('description');
                const type = setting.get('type');
                const value = setting.get('value');
                result.push(new Setting(name, description, type, value));
            });
            return result;
        }
        catch (error) {
            await db.close();
            logger.error('Error al intentar obtener los datos de los ajustes, ', error);
            throw error;
        }
    }
}
