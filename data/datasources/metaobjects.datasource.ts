import { MetaobjectDefintion } from "../../domain/entities/metaobject-definition.js";
import { MetaobjectUpdate } from "../../domain/entities/metaobject-update.js";
import { UsersMetaobject } from "../../domain/entities/users-metaobject.js";

export abstract class MetaobjectsDatasource {
  abstract createMetaObject(
    metaobjectDefintion: MetaobjectDefintion
  ): Promise<boolean>;
  abstract metaobjectUpdate(
    metaobjectUpdate: MetaobjectUpdate
  ): Promise<boolean>;
  abstract getCustomersList(): Promise<UsersMetaobject|null>;
  abstract doesMetaobjectDefinitionExist(metaobjectDefinition: MetaobjectDefintion): Promise<string>;
}
