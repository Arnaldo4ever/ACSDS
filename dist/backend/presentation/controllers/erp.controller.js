import { ERPService } from '../../domain/services/erp.service';
import { logger } from '../../helpers/logger-helper';
export class ERPController {
    erpService;
    constructor() {
        this.erpService = new ERPService();
    }
    async getSaleOrders(req, res) {
        try {
            const orders = await this.erpService.getSaleOrders(['name', 'state', 'amount_total'], req.body.domain || []);
            res.json(orders);
        }
        catch (error) {
            logger.error('Error al obtener órdenes de venta', error);
            res.status(500).json({ error: 'No se pudieron obtener las órdenes' });
        }
    }
}
