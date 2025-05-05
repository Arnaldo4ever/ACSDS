export const METAFIELDS_SET_QUERY = `
mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      key
      namespace
      value
      createdAt
      updatedAt
    }
    userErrors {
      field
      message
      code
    }
  }
}`;

export interface METAFIELDS_SET_QUERY_RESULT {
  data: {
    metafieldsSet: {
      metafields: {
        key: string;
        namespace: string;
        value: string;
        createdAt: string;
        updatedAt: string;
      }[];
      userErrors: {
        field: string;
        message: string;
        code: string;
      }[];
    };
  };
};
