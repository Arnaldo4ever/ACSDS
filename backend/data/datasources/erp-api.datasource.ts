import axios, { AxiosResponse } from 'axios';
import { ERPAuthenticationDataSource } from './erp-authentication.datasource.js';

// Interfaz para respuesta genérica de ERP
interface ERPGenericResponse<T> {
  jsonrpc: string;
  id?: number;
  result: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export class ERPApiDataSource {
  private static async makeRequest(
    endpoint: string, 
    params: any[]
  ) {
    const sessionId = ERPAuthenticationDataSource.getSessionId();
    const erpServiceUrl = ERPAuthenticationDataSource.getServiceUrl();

    if (!erpServiceUrl) {
      throw new Error('Configuración de ERP Service URL incompleta');
    }

    try {
      const response: AxiosResponse<ERPGenericResponse<any>> = await axios.post(erpServiceUrl, {
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

    } catch (error) {
      console.error('Error en la solicitud a la API de ERP:', error);
      throw error;
    }
  }

  public static async searchRead(
    model: string, 
    fields: string[] = [], 
    domain: any[] = [], 
    limit = 10, 
    offset = 0
  ) {
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

    } catch (error) {
      console.error(`Error en searchRead para modelo ${model}:`, error);
      throw error;
    }
  }
}