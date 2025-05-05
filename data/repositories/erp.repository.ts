import axios, { AxiosResponse } from 'axios';
import { logger } from '../../helpers/logger-helper.js';
import { ERPAuthenticationDataSource } from '../datasources/erp-authentication.datasource.js';

interface ERPSearchReadResponse<T> {
  jsonrpc: string;
  id?: number;
  result: T[];
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export class ERPRepository {
  private async getAuthenticatedClient() {
  const sessionId = await ERPAuthenticationDataSource.authenticateERP();
  const serviceUrl = ERPAuthenticationDataSource.getServiceUrl();

    return {
      sessionId,
      serviceUrl
    };
  }

  async searchRead<T>(
    model: string, 
    fields: string[] = [], 
    domain: any[] = [], 
    limit = 10, 
    offset = 0
  ): Promise<T[]> {
    try {
      const { sessionId, serviceUrl } = await this.getAuthenticatedClient();

      const response: AxiosResponse<ERPSearchReadResponse<T>> = await axios.post(serviceUrl, {
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
      });

      // Verificar si hay error en la respuesta
      if (response.data.error) {
        throw new Error(`Error en búsqueda ERP: ${response.data.error.message}`);
      }

      return response.data.result || [];

    } catch (error) {
      logger.error(`Error en searchRead para modelo ${model}:`, error);
      throw error;
    }
  }

  async getById<T>(
    model: string, 
    id: number, 
    fields: string[] = []
  ): Promise<T | null> {
    try {
      const results = await this.searchRead<T>(
        model, 
        fields, 
        [['id', '=', id]], 
        1
      );

      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error(`Error al obtener ${model} por ID:`, error);
      throw error;
    }
  }
}