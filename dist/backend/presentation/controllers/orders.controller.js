import { ERPService } from '../../domain/services/erp.service.js';
import { logger } from '../../helpers/logger-helper.js';
export class OrdersController {
    static erpService = new ERPService();
    static async getERPOrders(req, res) {
        try {
            const orders = await this.erpService.getSaleOrders(['name', 'state', 'amount_total'], req.body.domain || []);
            res.json(orders);
        }
        catch (error) {
            logger.error('Error al obtener órdenes', error);
            res.status(500).json({ error: 'No se pudieron obtener las órdenes' });
        }
    }
    static async getOrderById(req, res) {
        try {
            const orderId = parseInt(req.params.id);
            if (isNaN(orderId)) {
                return res.status(400).json({ error: 'ID de orden inválido' });
            }
            const order = await this.erpService.getSaleOrderById(orderId);
            res.json(order);
        }
        catch (error) {
            logger.error('Error al obtener orden por ID', error);
            res.status(404).json({
                error: error instanceof Error
                    ? error.message
                    : 'Orden no encontrada'
            });
        }
    }
}
