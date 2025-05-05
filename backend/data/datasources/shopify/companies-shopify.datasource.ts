import { GetDataError } from "../../../exceptions/get-data.error.js";
import { RequestReturn } from "@shopify/shopify-api/lib/clients/http_client/types.js";
import { GraphqlQueryError } from "@shopify/shopify-api";
import { CompaniesDatasource } from "../companies.datasource.js";
import { BillingAddress } from "../../../domain/entities/billing-address.js";
import { ShopifyBaseDatasource } from "./shopify-base.datasource.js";
import { logger } from "../../../helpers/logger-helper.js";
import { NotFoundError } from "../../../exceptions/not-found.error.js";

const GET_COMPANY_BILLING_ADDRESS_QUERY = `
query company($companyId: ID!) {
    company(id: $companyId) {
      name
      locations(first:1) {
        edges {
          node {
            billingAddress {
              address1,
              address2,
              city,
              zip,
              companyName,
              phone
            }
          }
        }
      }
    }
  }
`;

interface CompanyBillingAddressQueryResult {
  data: {
    company: {
      locations: {
        edges: [
          {
            node: {
              billingAddress: {
                address1: string;
                address2: string;
                city: string;
                zip: string;
                companyName: string;
                phone: string;
              };
            };
          }
        ];
      };
    };
  };
}

// Nota: Es posible que no haga falta hacer esta query!
const GET_COMPANY_LOCATIONS = `
query getCompanyLocations($id: ID!) {
  company(id: $id) {
    locations(first: 30) {
      nodes {
        id
      }
    }
  }
}`;

interface CompanyLocationsQuery {
  data: {
    company: {
      locations: {
        nodes: [
          {
            id: string
          }
        ]
      }
    }
  }
}

const COMPANY_LOCATION_UPDATE_MUTATION = `
mutation companyLocationUpdate($companyLocationId: ID!, $input: CompanyLocationUpdateInput!) {
    companyLocationUpdate(companyLocationId: $companyLocationId, input: $input) {
      companyLocation {
        id
      }
      userErrors {
        field
        message
      }
    }
}
`;

interface CompanyLocationMutationResponse {
  data: {
    companyLocationUpdate: {
      companyLocation: {
        id: string
      },
      userErrors: {
        field: string,
        message: string
      }
    }
  }
};

const PAYMENT_TERMS_QUERY = `
query getLocationPaymentTerms($locationId: ID!) {
  companyLocation(id: $locationId) {
    buyerExperienceConfiguration {
      paymentTermsTemplate {
        name
      }
    }
  }
}`;

interface PAYMENT_TERMS_RESULT {
  data: {
    companyLocation: {
      buyerExperienceConfiguration: {
        paymentTermsTemplate: {
          name: string
        } | null
      }
    }
  }
};

export class CompaniesShopifyDatasource
  extends ShopifyBaseDatasource
  implements CompaniesDatasource
{
  constructor(shop: string) {
    //Pasamos la tienda como parámetro al construcctor de la clase padre
    super(shop);
  }
  
  async getCompanyPaymentTerms(companyLocationId: number): Promise<boolean> {
    try {
      const graphqlClient = await this.getGraphqlClient();
      const queryResponse: RequestReturn<PAYMENT_TERMS_RESULT> = await graphqlClient.query({
        data: {
          query: PAYMENT_TERMS_QUERY,
          variables: {
            locationId: this.buildShopifyId(companyLocationId, 'CompanyLocation')
          }
        }
      });
      const data = queryResponse.body.data;
      logger.debug(data);
      const buyerExperienceConfiguration = data.companyLocation.buyerExperienceConfiguration;
      if (!buyerExperienceConfiguration || !buyerExperienceConfiguration.paymentTermsTemplate) {
        return false;
      } else {
        return true;
      }
    } catch(error) {
      logger.error(`No se ha podido obtener información sobre los términos de pago de la location con ID: ${companyLocationId}, `, error);
      throw error;
    }
    throw new Error("Method not implemented.");
  }

  async getAllCompanyLocations(companyId: number): Promise<any[]> {
    logger.debug('All Company Locations Requested');
    try {
      const graphqlClient = await this.getGraphqlClient();
      let queryResponse: RequestReturn<CompanyLocationsQuery>;
      queryResponse = await graphqlClient.query({
        data: {
          query: GET_COMPANY_LOCATIONS,
          variables: {
            id: this.buildShopifyId(companyId, 'Company')
          }
        },
      });
      return queryResponse.body.data.company.locations.nodes;
    } catch(error) {
      logger.error(
        "getCompanyBillingAddress: Error al ejecutar la query",
        error
      );
      throw error;
    }
  }

  async changeCompanyPaymentTerms(companyLocationId: number, b2bPayment: string|null): Promise<boolean> {
    try {
      const graphqlClient = await this.getGraphqlClient();
      let queryResponse: RequestReturn<CompanyLocationMutationResponse>;
      queryResponse = await graphqlClient.query({
        data: {
          query: COMPANY_LOCATION_UPDATE_MUTATION,
          variables: {
            companyLocationId: companyLocationId,
            input: {
              buyerExperienceConfiguration: {
                paymentTermsTemplateId: b2bPayment
              }
            }
          }
        }
      });
      return true;
    } catch(error) {
      logger.error(
        "getCompanyBillingAddress: Error al ejecutar la query",
        error
      );
      throw error;
    }
  }

  async getCompanyBillingAddress(companyId: number): Promise<BillingAddress> {
    var billingAddress = new BillingAddress();
    try {
      //Obtenemos el cliente para hacer llamadas GraphQL
      const graphqlClient = await this.getGraphqlClient();

      //Indicamos que tipo de campos va a tener la respuesta de la query a través de una interfaz. De esta forma tenemos claro y controlado lo que esperamos
      let queryResponse: RequestReturn<CompanyBillingAddressQueryResult>;

      //Hacemos la llamada
      queryResponse = await graphqlClient.query({
        data: {
          query: GET_COMPANY_BILLING_ADDRESS_QUERY,
          variables: {
            companyId: this.buildShopifyId(companyId, "Company"),
          },
        },
      });

      //Recuperamos y procesamos la respuesta
      const responseData = queryResponse.body.data;
      logger.debug(
        "getCompanyBillingAddress Response: " + JSON.stringify(responseData)
      );

      if (responseData.company == null) {
        throw new NotFoundError("BillingAddress para company " + companyId);
      }

      const locations = responseData.company.locations.edges;
      if (locations.length > 0) {
        const location = locations[0].node;
        const billingAddressResponse = location.billingAddress;

        billingAddress.address1 = billingAddressResponse.address1;
        billingAddress.address2 = billingAddressResponse.address2;
        billingAddress.companyName = billingAddressResponse.companyName;
        billingAddress.zip = billingAddressResponse.zip;
        billingAddress.city = billingAddressResponse.city;
        billingAddress.phone = billingAddressResponse.phone;
      }
    } catch (error) {
      logger.error(
        "getCompanyBillingAddress: Error al ejecutar la query",
        error
      );
      if (error instanceof GraphqlQueryError) {
        //Lanzamos errores que nos permitan indicar al servicio qué tipo de error ha ocurrido para que que lo pueda procesar como considere
        throw new GetDataError(
          "Error al consultar billing address de company " + companyId
        );
      }
      throw error;
    }

    return billingAddress;
  }
}
