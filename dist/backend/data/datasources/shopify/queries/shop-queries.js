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
;
export const GET_SHOP_ID = `
{
  shop {
    id
  }
}`;
