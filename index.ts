// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

//import shopify from "./shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";
import { AppRoutes } from "./backend/presentation/routes.js";
import cors from "cors";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);
/*
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

//Con esto nos aseguramos de que todas las peticiones que entran por api se ejecutan desde el admin de shopify. Quitar el comentario para el caso de apps que solo tengan parte frontent desde el admin o cambiar para usar un prefijo distinto que queramos validar
app.use("/api/authenticated/*", cors(), shopify.validateAuthenticatedSession());

//Middleware de express para recibir datos "raw" y que se parseen automáticamente como json
app.use(express.json());

//Rutas de desarrollos
app.use(AppRoutes.routes);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  console.log("ensureInstalledOnShop");
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
*/