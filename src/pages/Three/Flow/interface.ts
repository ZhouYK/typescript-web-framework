export namespace Flow {
  export interface Node {
    id: string;
    name: string;
    x?: number; // 拖拽放入时的坐标
    y?: number; // 拖拽放入时的坐标
  }

  export interface DataWithDom {
    dom: HTMLElement;
    data: Node;
  }

  export interface RefFn {
    (data: DataWithDom): void;
  }
}
