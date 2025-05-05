export interface ERPRepositoryInterface {
  searchRead<T>(
    model: string, 
    fields: string[], 
    domain: any[], 
    limit?: number, 
    offset?: number
  ): Promise<T[]>;

  getById<T>(model: string, id: number, fields?: string[]): Promise<T>;
}