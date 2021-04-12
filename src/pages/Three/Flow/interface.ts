export namespace Flow {
  export interface Node {
    id: string;
    name: string;
  }

  export interface DataWithDom {
    dom: HTMLElement;
    data: Node;
  }

  export interface RefFn {
    (data: DataWithDom): void;
  }
}
