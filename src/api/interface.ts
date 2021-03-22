export namespace User {
  export interface BasicInfo {
    name: string;
    customer_id: number;
    top_team_name: string;
    top_team_id: number;
    email: string;
    thumbnail: string;
    is_top_team_leader: boolean; // 是否是 1级或者0级部门领导
  }
}
