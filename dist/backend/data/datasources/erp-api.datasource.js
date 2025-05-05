import axios from 'axios';
import { ERPAuthenticationDataSource } from './erp-authentication.datasource.js';
export class ERPApiDataSource {
    static async makeRequest(endpoint, params) {
        const sessionId = ERPAuthenticationDataSource.getSessionId();
        const erpServiceUrl = ERPAuthenticationDataSource.getServiceUrl();
        if (!erpServiceUrl) {
            throw new Error('Configuración de ERP Service URL incompleta');
        }
        try {
            const response = await axios.post(erpServiceUrl, {
                jsonrpc: "2.0",
                method: "call",
                params: params
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': sessionId || ''
                }
            });
            // Manejar diferentes estructuras de respuesta
            if (response.data.error) {
                throw new Error(`Error en la API de ERP: ${JSON.stringify(response.data.error)}`);
            }
            return response.data.result;
        }
        catch (error) {
            console.error('Error en la solicitud a la API de ERP:', error);
            throw error;
        }
    }
    static async searchRead(model, fields = [], domain = [], limit = 10, offset = 0) {
        try {
            // Autenticar antes de hacer la solicitud
            await ERPAuthenticationDataSource.authenticateERP();
            // Preparar parámetros para la llamada
            const params = [
                ERPAuthenticationDataSource.getSessionId(),
                model,
                "search_read",
                [domain],
                {
                    fields: fields,
                    limit: limit,
                    offset: offset
                }
            ];
            // Realizar la solicitud
            const result = await this.makeRequest('search_read', params);
            // Validar y retornar resultado
            if (!result) {
                console.warn(`No se obtuvieron resultados para el modelo ${model}`);
                return [];
            }
            return result;
        }
        catch (error) {
            console.error(`Error en searchRead para modelo ${model}:`, error);
            throw error;
        }
    }
}
