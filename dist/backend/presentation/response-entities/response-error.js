export var ResponseErrorCode;
(function (ResponseErrorCode) {
    ResponseErrorCode["ErrorGeneral"] = "ERROR_GENERAL";
    ResponseErrorCode["ErrorGetData"] = "ERROR_GET_DATA";
    ResponseErrorCode["ErrorNoEncontrado"] = "ERROR_NO_ENCONTRADO";
    ResponseErrorCode["ErrorFaltanDatosObligatorios"] = "ERROR_FALTAN_DATOS";
})(ResponseErrorCode || (ResponseErrorCode = {}));
export class ResponseError {
    errorCode;
    constructor(errorCode) {
        this.errorCode = errorCode;
    }
}
