import axios from 'axios';
import { logger } from '../../helpers/logger-helper.js';
import { ERPAuthenticationDataSource } from '../datasources/erp-authentication.datasource.js';
export class ERPRepository {
    async getAuthenticatedClient() {
        const sessionId = await ERPAuthenticationDataSource.authenticateERP();
        const serviceUrl = ERPAuthenticationDataSource.getServiceUrl();
        return {
            sessionId,
            serviceUrl
        };
    }
    async searchRead(model, fields = [], domain = [], limit = 10, offset = 0) {
        try {
            const { sessionId, serviceUrl } = await this.getAuthenticatedClient();
            const response = await axios.post(serviceUrl, {
                jsonrpc: "2.0",
                method: "call",
                params: [
                    sessionId,
                    model,
                    "search_read",
                    [domain],
                    {
                        fields: fields,
                        limit: limit,
                        offset: offset
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': sessionId || ''
                }
            });
            return response.data.result || [];
        }
        catch (error) {
            logger.error(`Error al buscar en modelo ${model}:`, error);
            throw error;
        }
    }
    async getById(model, id, fields = []) {
        try {
            const results = await this.searchRead(model, fields, [['id', '=', id]], 1);
            return results.length > 0 ? results[0] : null;
        }
        catch (error) {
            logger.error(`Error al obtener ${model} por ID:`, error);
            throw error;
        }
    }
}
