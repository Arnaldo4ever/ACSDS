import { MetaobjectDefintion } from "../../../domain/entities/metaobject-definition.js";
import { MetaobjectUpdate } from "../../../domain/entities/metaobject-update.js";
import { UsersMetaobject } from "../../../domain/entities/users-metaobject.js";
import { logger } from "../../../helpers/logger-helper.js";
import { MetaobjectsDatasource } from "../metaobjects.datasource.js";
import {
  CUSTOMERS_METAOBJECT_QUERY,
  CUSTOMERS_METAOBJECT_QUERY_RESULT,
  METAOBJECT_CREATE,
  METAOBJECT_CREATE_RESULT,
  METAOBJECT_DEFINITION_QUERY,
  METAOBJECT_DEFINITION_QUERY_RESULT,
  METAOBJECT_UPDATE,
  METAOBJECT_UPDATE_RESULT,
  METAOBJECTDEFINITION_CREATE_MUTATION,
  METAOBJECTDEFINITION_CREATE_MUTATION_RESULT,
} from "./queries/metaobjects-queries.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
import { RequestReturn } from "@shopify/shopify-api/lib/clients/http_client/types.js";

export class MetaobjectsShopifyDatasource
  extends ShopifyBaseDatasource
  implements MetaobjectsDatasource
{
  constructor(shop: string) {
    super(shop);
  }

  async doesMetaobjectDefinitionExist(metaobjectDefinition: MetaobjectDefintion): Promise<string> {
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<METAOBJECT_DEFINITION_QUERY_RESULT> = await graphqlClient.query({
        data: {
          query: METAOBJECT_DEFINITION_QUERY,
          variables: {
            type: metaobjectDefinition.type
          }
        }
      });
      const data = queryResponse.body.data;
      // Si metaobjectDefinitionByType es null, eso significa que el metaobjectDefinition no existe.
      if(!data.metaobjectDefinitionByType) return "";
      else return data.metaobjectDefinitionByType.id;
    } catch(error) {
      logger.error(`No se ha podido consultar si existe un metaobjeto con la definición proporcionada (${metaobjectDefinition.name}), `, error);
      throw error;
    }
  }

  async getCustomersList(): Promise<UsersMetaobject|null> {
    logger.debug("Se ha pedido obtener la lista de usuarios del metaobjeto");
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<CUSTOMERS_METAOBJECT_QUERY_RESULT> =
        await graphqlClient.query({
          data: {
            query: CUSTOMERS_METAOBJECT_QUERY,
          },
        });
      const data = queryResponse.body.data;
      if (!data) {
        logger.error(
          "No se ha podido obtener la lista de usuarios del metaobjeto, has creado el metaobjeto?"
        );
        logger.error(queryResponse);
        return null;
      }
      const nodes = data.metaobjects.nodes;
      if (nodes.length == 0) {
        logger.error("No se han encontrado campos en el metaobjeto.");
        return null;
      }
      const users_raw = nodes[0].field.value;
      const users_shopify_id = JSON.parse(users_raw) as string[];
      const users: string[] = [];
      users_shopify_id.forEach((user_id) => {
        users.push(user_id.split("Customer/")[1]);
      });
      const result = new UsersMetaobject(nodes[0].id, users);
      return result;
    } catch (error) {
      logger.error(
        "No se ha podido obtener la lista de usuarios del metaobjeto, ",
        error
      );
      throw error;
    }
  }

  async metaobjectUpdate(metaobjectUpdate: MetaobjectUpdate): Promise<boolean> {
    logger.debug("Actualizando metaobject...");
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<METAOBJECT_UPDATE_RESULT> =
        await graphqlClient.query({
          data: {
            query: METAOBJECT_UPDATE,
            variables: {
              id: metaobjectUpdate.id,
              metaobject: {
                fields: metaobjectUpdate.fields,
              },
            },
          },
        });
      logger.debug(queryResponse.body.data);
      return true;
    } catch (error) {
      logger.error("No se ha podido actualizar el metaobjeto, ", error);
      throw error;
    }
  }

  async createMetaObject(metaobjectDefintion: MetaobjectDefintion) {
    logger.debug("Se ha solicitado crear un metaobjeto.");
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<METAOBJECTDEFINITION_CREATE_MUTATION_RESULT> =
        await graphqlClient.query({
          data: {
            query: METAOBJECTDEFINITION_CREATE_MUTATION,
            variables: {
              definition: metaobjectDefintion,
            },
          },
        });
      logger.debug(queryResponse.body.data);
      if (
        queryResponse.body.data.metaobjectDefinitionCreate.userErrors.length > 0
      ) {
        // Esto es cuando el metaobjectDefinition ya existe.
        return true;
      }
      return true;
    } catch (error) {
      logger.error("Error en la creación del metaobjeto, ", error);
      throw error;
    }
  }
}
