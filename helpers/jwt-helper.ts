import { NextFunction, Request, Response } from "express";
import { logger } from "./logger-helper.js";
import * as jose from "jose";
import { Session } from "@shopify/shopify-api";

// Esta función se encarga de verificar que una petición autenticada viene del admin y no de otro sitio.
// Por ejemplo, podría llegar un token de autentificación de una Checkout UI Extension, y si no lo verificamos, se podrían acceder a funciones de admin.
// Esta función se asegurará de que esto no ocurra.
/**
 * @author Alejandro Villarreal Ayala
 * @description Esta función se encarga de verificar que una petición autenticada viene del admin y no de otro sitio como una Checkout UI Extension, por ejemplo.
 */
export const validateAdminRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session_bearer = req.header("authorization") as string | undefined;
    if (!session_bearer) {
      logger.error(
        "No se ha encontrado header de autenticación, seguro que esta ruta es autenticada?"
      );
      res.status(402).send("Invalid shop provided");
      return;
    }
    const token = session_bearer.split("Bearer ")[1];
    // Tiene que existir on token.
    if (!token) {
      res
        .status(401)
        .send(`Failed to parse session token '${token}': not found`);
      return;
    }
    // También verificamos que tenemos una sesión.
    const session: Session = res.locals.shopify.session;
    // Si después de todo esto no hay sesión, algo ha ido bastante mal con nuestra aplicación o con la llamada.
    if (!session) {
      res.status(500).json({ status: "Server Error" });
      return;
    }
    // Ahora verifico en session token y que el session token viene del admin.
    await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.SHOPIFY_API_SECRET),
      {
        issuer: `https://${session.shop}/admin`,
      }
    );
    // Si la función no ha dado ningún error (el catch lo habría pillado.) Todo está bien y podemos continuar.
    logger.debug('La petición viene del admin, token verificado, se puede continuar con la ejecución');
    next();
  } catch (error) {
    logger.error('Algo fue mal intentando verificar el token, ', error);
    res.status(401).json({ status: 'Authentication Failed' });
    return;
  }
};
