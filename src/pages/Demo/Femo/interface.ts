export namespace Femo {
  export interface Query {
    name: string;
    condition: string;
  }

  export interface ListApiResult {
    total: number;
    content: number[];
    query: Query;
  }
}
