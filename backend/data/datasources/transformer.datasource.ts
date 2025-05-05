export abstract class TransformerDatasource {
  abstract setTransformerMetafield(cartTransformer: string, value: string): Promise<boolean>;
}