import dotenv from 'dotenv';
import path from 'path';
// Cargar variables de entorno desde .env
dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});
export const config = {
    // Credenciales de ERP
    ERP_LOGIN_URL: process.env.ERP_LOGIN_URL || '',
    ERP_SERVICE_URL: process.env.ERP_SERVICE_URL || '',
    ERP_USER: process.env.ERP_USER || '',
    ERP_PASSWORD: process.env.ERP_PASSWORD || '',
    ERP_DB: process.env.ERP_DB || '',
    ERP_URL: process.env.ERP_URL || '',
    ERP_SESSION_ID: process.env.ERP_SESSION_ID || '',
    // Otras configuraciones de la aplicación
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // Añade más configuraciones según necesites
};
