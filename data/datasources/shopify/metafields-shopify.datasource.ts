import { MetafieldDefinition } from "../../../domain/entities/metafieldDefinition.js";
import { MetafieldSetInput } from "../../../domain/entities/metafields.js";
import { logger } from "../../../helpers/logger-helper.js";
import { MetafieldsDatasource } from "../metafields.datasource.js";
import { METAFIELDS_SET_QUERY, METAFIELDS_SET_QUERY_RESULT } from "./queries/metafields-queries.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
import { RequestReturn } from "@shopify/shopify-api/lib/clients/http_client/types.js";

const CREATE_METAFIELD_DEFINITION = `
mutation createMetafields($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      id
      namespace
    }
    userErrors {
      field
      message
      code
    }
  }
}`;

interface CreateMetafieldDefinitionQueryResult {
  data: {
    metafieldDefinitionCreate: {
      createdDefinition: {
        id: string;
        namespace: string;
      };
      userErrors: [
        {
          field: string;
          message: string;
          code: string;
        }
      ];
    };
  };
}

export const METAFIELD_DEFINITIONS_QUERY = `
query($namespace:String, $key:String, $type:MetafieldOwnerType!) {
  metafieldDefinitions(ownerType: $type, 
  namespace:$namespace, 
  key:$key,
  first: 1) {
    edges {
      node {
        name
      }
    }
  }
}`;

interface METAFIELD_DEFINITIONS_QUERY_RESULT {
  data: {
    metafieldDefinitions: {
      edges: [
        {
          node: {
            name: string
          }
        }
      ] | []
    }
  }
}

export class MetafieldsShopifyDatasource
  extends ShopifyBaseDatasource
  implements MetafieldsDatasource
{
  constructor(shop: string) {
    super(shop);
  }

  async metafieldsSet(input: MetafieldSetInput[]): Promise<boolean> {
    logger.debug(`Actualizando metafields...`);
    logger.debug(input);
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResult: RequestReturn<METAFIELDS_SET_QUERY_RESULT> = await graphqlClient.query({
        data: {
          query: METAFIELDS_SET_QUERY,
          variables: {
            metafields: input
          }
        }
      });
      logger.debug(queryResult.body.data);
      return true;
    } catch(error) {
      logger.error(`No se ha podido actualizar el metafield, ${error}`);
      throw error;
    }
  }

  async doesMetafieldExist(metafield: MetafieldDefinition): Promise<boolean> {
    logger.debug(`Consultando si un metafield (${metafield.namespace}.${metafield.key}) existe...`);
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResult: RequestReturn<METAFIELD_DEFINITIONS_QUERY_RESULT> = await graphqlClient.query({
        data: {
          query: METAFIELD_DEFINITIONS_QUERY,
          variables: {
            namespace: metafield.namespace,
            key: metafield.key,
            type: metafield.ownerType.toUpperCase()
          }
        }
      });
      if(queryResult.body.data.metafieldDefinitions.edges.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch(error) {
      console.error('No se ha podido consultar si el metafield especificado existe, ', error);
      throw error;
    }
  }

  async createMetafield(
    metafieldDefinition: MetafieldDefinition
  ): Promise<boolean> {
    logger.debug("Creando MetafieldDefinition...");
    logger.debug(metafieldDefinition);
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResult: RequestReturn<CreateMetafieldDefinitionQueryResult> =
        await graphqlClient.query({
          data: {
            query: CREATE_METAFIELD_DEFINITION,
            variables: {
              definition: {
                name: metafieldDefinition.name,
                namespace: metafieldDefinition.namespace,
                key: metafieldDefinition.key,
                description: metafieldDefinition.description,
                type: metafieldDefinition.type,
                ownerType: metafieldDefinition.ownerType,
                validations: metafieldDefinition.validations,
              },
            },
          },
        });
      return true;
    } catch (error) {
      logger.error(
        "No se ha podido realizar la mutation para crear el metafield, ",
        error
      );
      throw error;
    }
  }
}
