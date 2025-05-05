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

export interface METAOBJECTDEFINITION_CREATE_MUTATION_RESULT {
  data: {
    metaobjectDefinitionCreate: {
      metaobjectDefinition: {
        name: string;
      }
      userErrors: any[]
    },
  }
}

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

export interface METAOBJECT_CREATE_RESULT {
  data: {
    metaobjectCreate: {
      metaobject: {
        handle: string;
      },
      userErrors: any[]
    }
  }
}

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

export interface METAOBJECT_UPDATE_RESULT {
  data: {
    metaobjectUpdate: {
      metaobject: {
        handle: string;
      }
      userErrors: any[];
    }
  }
}

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

export interface CUSTOMERS_METAOBJECT_QUERY_RESULT {
  data: {
    metaobjects: {
      nodes: {
        id: string;
        field: {
          value: string;
        }
      }[]
    }
  }
};

export const METAOBJECT_DEFINITION_QUERY = `
query($type: String!) {
  metaobjectDefinitionByType(type: $type) {
    name
    id
  }
}`;

export interface METAOBJECT_DEFINITION_QUERY_RESULT {
  data: {
    metaobjectDefinitionByType: {
      name: string,
      id: string
    } | null
  }
}