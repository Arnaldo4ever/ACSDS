import winston, {format} from "winston";
const {combine,timestamp,json} = format;
//import {Mail} from "winston-mail";
//import * as  nodemailer from "nodemailer";

//Inicializa logs
export const logger = winston.createLogger({
    level: 'debug',
    format: combine(
      timestamp(),
      json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/upng-error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/upng-combined.log' })
      /*new winston.transports.Mail({
        level: 'error', // Define el nivel de error que deseas monitorizar
        from: '"SOPORTE" guillermo@upango.es',
        to: 'guillermo@upango.es',
        subject: 'ROYAL BIO: new error occurred',
        host: 'smtp.office365.com',
        port: 587,
        tls: true,
        secure: false,
        username: "guillermo@upango.es", 
        password: "xxx",
        //authentication: "XOAUTH2"
      })*/
    ]
});