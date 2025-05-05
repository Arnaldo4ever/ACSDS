export const METAOBJECTDEFINITION_CREATE_MUTATION = `
mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition {
      name
      type
      fieldDefinitions {
        name
        key
      }
    }
    userErrors {
      field
      message
      code
    }
  }
}`;
export const METAOBJECT_CREATE = `
mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
  metaobjectCreate(metaobject: $metaobject) {
    metaobject {
      handle
    }
    userErrors {
      field
      message
      code
    }
  }
}`;
export const METAOBJECT_UPDATE = `
mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
  metaobjectUpdate(id: $id, metaobject: $metaobject) {
    metaobject {
      handle
    }
    userErrors {
      field
      message
      code
    }
  }
}`;
export const CUSTOMERS_METAOBJECT_QUERY = `
query {
  metaobjects(type:"notify_customers", first: 1) {
    nodes {
      id
      field(key: "customer_list") {
        value
      }
    }
  }
}`;
;
export const METAOBJECT_DEFINITION_QUERY = `
query($type: String!) {
  metaobjectDefinitionByType(type: $type) {
    name
    id
  }
}`;
