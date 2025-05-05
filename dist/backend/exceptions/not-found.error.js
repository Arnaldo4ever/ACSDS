//Usaremos esta excepción cuando haya algún error relacionado con el acceso a datos, por ejemplo una llamada de GraphQL
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'No se ha encontrado la información';
    }
}
