//Usaremos esta excepción cuando haya algún error relacionado con el acceso a datos, por ejemplo una llamada de GraphQL
export class GetDataError extends Error {
    constructor(message:string){
        super(message);
        this.name = 'Error al obtener información de la fuente de datos';
    }
}