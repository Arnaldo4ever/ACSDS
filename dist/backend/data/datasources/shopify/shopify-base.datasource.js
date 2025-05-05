//import shopify from "../../../../shopify.js";
//Clase base con métodos útiles para usen todos los datasources de Shopify con GrapthQL
export class ShopifyBaseDatasource {
    shop; //Por ejemplo "upango2b2.myshopify.com"
    constructor(shop) {
        this.shop = shop;
    }
    async getGraphqlClient() {
        //Si no estamos conectados al admin, podemos recuperar un token de sesión "ofline" que está almacenado en el database.sqlite
        const sesionGuardadaParaShop = await shopify.config.sessionStorage.findSessionsByShop(this.shop);
        var session = sesionGuardadaParaShop[0];
        const graphqlClient = new shopify.api.clients.Graphql({ session: session });
        return graphqlClient;
    }
    // checkUserErrorsInAdminApiRequest(responserDataObject){
    //     const userErrors = responserDataObject.userErrors;
    //     if (userErrors.length > 0) {
    //         var errorString = '';
    //         userErrors.forEach((error) => {
    //             errorString += `"${error.field}": ${error.message}`;
    //             logger.error(`Error en el campo "${error.field}": ${error.message}`);
    //         });
    //         throw new AdminApiError(errorString);
    //     }
    // }
    buildShopifyId(id, type) {
        return 'gid://shopify/' + type + '/' + id;
    }
    idFromShopifyId(shopifyId) {
        const matches = shopifyId.match(/(\d+)$/);
        if (matches && matches.length > 1) {
            return parseInt(matches[1], 10);
        }
        return shopifyId;
    }
}
