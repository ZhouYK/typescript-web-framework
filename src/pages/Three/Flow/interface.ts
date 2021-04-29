export namespace Flow {

  // 资源视频
  export interface ResourceNode {
    id: string;
    name: string;
    url: string;
  }

  // 节点视频
  export interface Node {
    id: string;
    name: string; // 视频名称
    url: string;
    time_point?: number; // 控制时间点（秒）
    switch_case?: Case[]; // 判断条件
    x?: number; // 拖拽放入时的坐标
    y?: number; // 拖拽放入时的坐标
  }

  export interface Case {
    formal: string;
    node: Node;
  }

  export interface DataWithDom {
    dom: HTMLElement;
    data: Node;
  }

  export interface RefFn {
    (data: DataWithDom): void;
  }
}
