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
            if (response.data?.error) {
                throw new Error(`Error en la API de ERP: ${JSON.stringify(response.data.error)}`);
            }
            // Verificar y devolver el resultado
            if (response && response.data && response.data.result !== undefined) {
                return response.data.result;
            }
            else {
                console.warn('Respuesta de la API sin estructura esperada:', response);
                return response;
            }
        }
        catch (error) {
            console.error('Error en la solicitud a la API de ERP:', error.message);
            // Manejar diferentes tipos de errores
            if (error.response) {
                // La solicitud fue hecha y el servidor respondió con un código de estado
                console.error('Datos de error:', error.response.data);
                console.error('Código de estado:', error.response.status);
            }
            else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                console.error('No se recibió respuesta:', error.request);
            }
            else {
                // Algo sucedió al configurar la solicitud
                console.error('Error de configuración:', error.message);
            }
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
