export const CUSTOMER_COMPANIES_QUERY = `
query isCustomerInCompanny($customerId: ID!) {
  customer(id: $customerId) {
    id
    companyContactProfiles {
      company {
        id
      }
    }
  }
}`;

export interface CUSTOMER_COMPANIES_QUERY_RESULT {
  data: {
    customer: {
      id: string;
      companyContactProfiles: {
        company: {
          id: string
        }
      }[] | []
    } | null
  }
};

export const USER_TOKEN_QUERY = `
query doesCustomerExist($id: ID!) {
  customer(id: $id) {
    metafield(namespace: "upng", key: "secret_token") {
      value
    }
  }
}`;

export interface USER_TOKEN_QUERY_RESULT {
  data: {
    customer: {
      metafield: {
        value: string
      } | null
    } | null
  }
};