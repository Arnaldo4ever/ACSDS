export const SET_TRANSFORMER_METAFIELD = `
mutation SetMetafield($ownerId: ID!, $value: String!) {
  metafieldsSet(metafields: [
    {
      namespace: "$app:upng",
      key: "recargos",
      ownerId: $ownerId,
      type: "single_line_text_field",
      value: $value
    }
  ]) {
    metafields {
      id
    }
  }
}
`;

export interface SET_TRANSFORMER_METAFIELD_RESULT {
  data: {
    metafieldsSet: {
      metafields: {
        id: string;
      }[];
    };
  };
};