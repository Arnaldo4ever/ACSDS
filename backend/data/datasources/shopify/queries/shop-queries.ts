export const RE_METAFIELD_MUTATION = `
mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      key
    }
    userErrors {
      field
      message
      code
    }
  }
}`;

export interface RE_METAFIELD_MUTATION_RESULT {
  data: {
    metafieldsSet: {
      metafields: {
        key: string;
      }[];
      userErrors: any[];
    };
  };
};

export const GET_SHOP_ID = `
{
  shop {
    id
  }
}`;

export interface GET_SHOP_ID_RESULT {
  data: {
    shop: {
      id: string;
    };
  };
}