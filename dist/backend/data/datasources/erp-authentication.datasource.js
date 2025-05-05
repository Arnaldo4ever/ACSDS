import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { logger } from '../../helpers/logger-helper.js';
import { config } from '../../domain/config/config.js';
export class ERPAuthenticationDataSource {
    static sessionId = config.ERP_SESSION_ID;
    static lastAuthTime = null;
    static AUTH_EXPIRATION_TIME = 50 * 60 * 1000; // 50 minutos
    static async authenticateERP() {
        // Verificar si la sesión actual es válida
        if (this.isSessionValid()) {
            logger.debug('🔒 Usando sesión ERP existente');
            return this.sessionId;
        }
        // Autenticar si no hay sesión válida
        try {
            const response = await axios.post(config.ERP_LOGIN_URL, {
                jsonrpc: "2.0",
                params: {
                    db: config.ERP_DB,
                    login: config.ERP_USER,
                    password: config.ERP_PASSWORD
                }
            });
            if (response.data.result) {
                const setCookie = response.headers['set-cookie'];
                this.sessionId = Array.isArray(setCookie) && setCookie.length > 0
                    ? setCookie[0].split(';')[0]
                    : null;
                if (this.sessionId) {
                    this.lastAuthTime = Date.now();
                    logger.debug(`✅ Autenticación exitosa en ERP. Nueva Session ID: ${this.sessionId}`);
                    // Actualizar .env con nueva sesión
                    this.updateSessionConfig();
                    return this.sessionId;
                }
            }
            throw new Error('No se pudo obtener la sesión de ERP');
        }
        catch (error) {
            logger.error('Error en autenticación ERP:', error);
            throw error;
        }
    }
    static isSessionValid() {
        return this.sessionId !== null &&
            this.lastAuthTime !== null &&
            (Date.now() - this.lastAuthTime) < this.AUTH_EXPIRATION_TIME;
    }
    static updateSessionConfig() {
        try {
            const envPath = path.resolve(process.cwd(), '.env');
            let envContent = fs.readFileSync(envPath, 'utf8');
            // Actualizar o agregar ERP_SESSION_ID
            if (envContent.includes('ERP_SESSION_ID=')) {
                envContent = envContent.replace(/ERP_SESSION_ID=.*/, `ERP_SESSION_ID=${this.sessionId}`);
            }
            else {
                envContent += `\nERP_SESSION_ID=${this.sessionId}`;
            }
            fs.writeFileSync(envPath, envContent);
            logger.debug('Sesión de ERP actualizada en .env');
        }
        catch (error) {
            logger.error('No se pudo actualizar la configuración de sesión', error);
        }
    }
    static getSessionId() {
        if (!this.sessionId) {
            throw new Error('No hay sesión de ERP activa');
        }
        return this.sessionId;
    }
    static getServiceUrl() {
        if (!config.ERP_SERVICE_URL) {
            throw new Error('URL de servicio ERP no configurada');
        }
        return config.ERP_SERVICE_URL;
    }
}
