import { logger } from "../../helpers/logger-helper.js";
import { SettingsService } from "../../domain/services/settings.service.js";
import { SettingsSqliteDatasource } from "../../data/datasources/sqlite/settings-sqlite.datasource.js";
import { SETTINGS_PATH } from "../../domain/config/requirements.js";
import { ERPService } from '../../domain/services/erp.service.js';
export class ProductsController {
    static erpService = new ERPService();
    async getRecargoEquivalenciaID(req, res) {
        logger.debug('Se ha solicitado obtener el ID del producto marcado como "Recargo de Equivalencia".');
        try {
            const settingsService = new SettingsService(new SettingsSqliteDatasource(SETTINGS_PATH));
            const re_id = await settingsService.getParamValue({ name: 'recargo_id' });
            if (!re_id) {
                logger.error('No se ha encontrado ID de Recargo de Equivalencia.');
                res.status(500).json({ status: 'ID Not found' });
                return;
            }
            res.status(200).json({ id: re_id });
            return;
        }
        catch (error) {
            logger.error('No se ha podido obtener el ID del recargo de equivalencia.');
            res.status(500).json({ status: 'Server Error' });
            return;
        }
    }
    // Obtener lista de productos
    static async getERPProducts(req, res) {
        try {
            const products = await this.erpService.getProducts(['name', 'list_price', 'default_code', 'type'], req.body.domain || []);
            res.json(products);
        }
        catch (error) {
            logger.error('Error al obtener productos', error);
            res.status(500).json({ error: 'No se pudieron obtener los productos' });
        }
    }
    // Obtener producto por ID
    static async getProductById(req, res) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return res.status(400).json({ error: 'ID de producto inválido' });
            }
            const product = await this.erpService.getProductById(productId);
            res.json(product);
        }
        catch (error) {
            logger.error('Error al obtener producto por ID', error);
            res.status(404).json({
                error: error instanceof Error
                    ? error.message
                    : 'Producto no encontrado'
            });
        }
    }
    // Obtener productos por categoría
    static async getProductsByCategory(req, res) {
        try {
            const categoryId = parseInt(req.params.categoryId);
            if (isNaN(categoryId)) {
                return res.status(400).json({ error: 'ID de categoría inválido' });
            }
            const products = await this.erpService.getProducts(['name', 'list_price', 'default_code', 'type'], [['categ_id', '=', categoryId]]);
            res.json(products);
        }
        catch (error) {
            logger.error('Error al obtener productos por categoría', error);
            res.status(500).json({
                error: 'No se pudieron obtener los productos de esta categoría'
            });
        }
    }
    // Buscar productos por nombre o código
    static async searchProducts(req, res) {
        try {
            const { query } = req.body;
            if (!query) {
                return res.status(400).json({ error: 'Consulta de búsqueda requerida' });
            }
            const products = await this.erpService.getProducts(['name', 'list_price', 'default_code', 'type'], ['|',
                ['name', 'ilike', `%${query}%`],
                ['default_code', 'ilike', `%${query}%`]
            ]);
            res.json(products);
        }
        catch (error) {
            logger.error('Error al buscar productos', error);
            res.status(500).json({ error: 'No se pudieron buscar los productos' });
        }
    }
    // Buscar attachment dentro de productos
    static async getProductAttachments(req, res) {
        try {
            const productId = parseInt(req.params.id);
            if (isNaN(productId)) {
                return res.status(400).json({ error: 'ID de producto inválido' });
            }
            const attachments = await this.erpService.getProductAttachments(productId);
            res.json({
                total: attachments.length,
                attachments: attachments.map(attachment => ({
                    name: attachment.name,
                    type: attachment.type,
                    hasContent: !!attachment.datas
                }))
            });
        }
        catch (error) {
            logger.error('Error al obtener documentos adjuntos del producto', error);
            res.status(500).json({
                error: error instanceof Error
                    ? error.message
                    : 'Error al obtener documentos adjuntos'
            });
        }
    }
}
