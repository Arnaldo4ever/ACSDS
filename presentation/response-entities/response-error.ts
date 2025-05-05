export enum ResponseErrorCode {
    ErrorGeneral = "ERROR_GENERAL",
    ErrorGetData = "ERROR_GET_DATA",
    ErrorNoEncontrado = "ERROR_NO_ENCONTRADO",
    ErrorFaltanDatosObligatorios="ERROR_FALTAN_DATOS",
  }

export class ResponseError{
    
    public errorCode : ResponseErrorCode;

    constructor(errorCode:ResponseErrorCode){
        this.errorCode = errorCode;
    }
}