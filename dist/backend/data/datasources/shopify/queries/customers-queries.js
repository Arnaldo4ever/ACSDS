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
;
export const USER_TOKEN_QUERY = `
query doesCustomerExist($id: ID!) {
  customer(id: $id) {
    metafield(namespace: "upng", key: "secret_token") {
      value
    }
  }
}`;
;
