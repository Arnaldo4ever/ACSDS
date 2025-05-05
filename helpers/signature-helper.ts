import { NextFunction, Request, Response } from "express";
import { logger } from "./logger-helper.js";
import { createHmac } from "crypto";

export const validateAppProxySignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.query.signature;
  logger.debug('Verificando firma del app proxy...');
  delete req.query.signature;
  // Convertir el query a un string ordenado.
  const queryString = Array.from(Object.entries(req.query)).map((elem) => elem.join('=')).sort().join('');
  // Crear un hash con el query string.
  const query_hmac = createHmac('sha256', process.env.SHOPIFY_API_SECRET as string).update(queryString).digest('hex');
  if(query_hmac === signature) {
    next();
  } else {
    logger.error('La firma del app proxy no es correcta.');
    res.status(401).send('Unauthorized');
    return;
  }
};