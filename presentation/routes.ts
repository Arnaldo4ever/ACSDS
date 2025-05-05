import { Router } from "express";
import { CompaniesController } from "./controllers/companies.controller.js";
import { MetafieldsController } from "./controllers/metafields.controller.js";
import cors from "cors";
import { ProductsController } from "./controllers/products.controller.js";
import { SettingsController } from "./controllers/settings.controller.js";
import { TransformerController } from "./controllers/transformer.controller.js";
import { CustomersController } from "./controllers/customers.controller.js";
import { validateAdminRequest } from "../helpers/jwt-helper.js";
import { validateAppProxySignature } from "../helpers/signature-helper.js";
import { OrdersController } from "./controllers/orders.controller.js";

//Aquí crearemos todas las rutas de nuestra app y para cada una de ellas llamaremos a una función de un controller que se encargará de procesarla
export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        const companiesController = new CompaniesController;
        const metafieldsController = new MetafieldsController;
        const settingsController = new SettingsController;
        const transformerController = new TransformerController;
        const customersController = new CustomersController;
        const productsController = new ProductsController;
        
        //products
        router.get('api/ERP/products/:id', ProductsController.getProductById);
        //router.get('api/ERP/products', ProductsController.getERPProducts);
        router.get('api/ERP/products/:id/attachments', ProductsController.getProductAttachments);
        
        //company
        router.get('api/ERP/companies/:id', CompaniesController.getERPPartnerById);
        //router.get('api/ERP/companies', CompaniesController.getERPPartners);

        // órdenes
        // Obtener lista de órdenes
        //router.get('api/ERP/orders', OrdersController.getERPOrders);
        // Obtener orden por ID
        //router.get('api/ERP/orders/:id', OrdersController.getOrderById);

        router.post("/api/companies/billing-address", async (_req, res) => await companiesController.getCompanyBillingAddress(_req,res));

        router.post("/api/companies/change-payment", async (_req, res) => await companiesController.changePaymentTermsLegacy(_req, res));

        router.post("/api/authenticated/createMetafields", validateAdminRequest, async (_req, res) => await metafieldsController.createMetafields(_req, res));

        router.get("/api/authenticated/getMetafieldsCreated", validateAdminRequest, async (_req, res) => await metafieldsController.getMetafields(_req, res));

        router.get("/api/authenticated/getAllSettings", validateAdminRequest, async(_req, res) => await settingsController.getAllSettings(_req, res));

        router.post("/api/authenticated/applySettings", validateAdminRequest, async (_req, res) => await settingsController.saveSettings(_req, res));

        router.post("/api/authenticated/runSettingsInstaller", validateAdminRequest, async (_req, res) => await settingsController.runSettingsInstaller(_req, res));
        router.post("/api/authenticated/runSettingsUpdater", validateAdminRequest, async (_req, res) => await settingsController.runSettingsUpdater(_req, res));

        //router.post("/api/authenticated/changePaymentTerms", async (_req, res) => res.status(200).json({ status: 'Working on it!' }));

        router.post("/api/changePaymentTerms", cors(), async (_req, res) => await companiesController.changePaymentTerms(_req, res));

        router.post("/api/getPaymentTerms", cors(), async (_req, res) => await companiesController.getPaymentTerms(_req, res));

        router.post("/api/shop/getRecargoEquivalenciaID", cors(), async (_req, res) => await productsController.getRecargoEquivalenciaID(_req, res));

        // Transformador de carrito.
        router.get("/api/authenticated/getCartTransformerID", validateAdminRequest, async(_req, res) => await transformerController.getCartTransformerID(_req, res));

        router.get("/api/authenticated/getCartTransformerMetafield", validateAdminRequest,async (_req, res) => await transformerController.getTransformerRecargos(_req, res));

        router.post("/api/authenticated/setCartTransformerMetafield", validateAdminRequest, async (_req, res) => await transformerController.setTransfromerMetafield(_req, res));

        router.post("/api/update_last_visit", validateAppProxySignature, async (_req, res) => await customersController.updateLastVisit(_req, res));
        
    return router;
  }
}
