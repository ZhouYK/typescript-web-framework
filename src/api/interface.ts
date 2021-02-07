export namespace User {

  export enum ModuleAuthKey {
    module_auth = 'module_auth', // '权限管理'
    module_hr = 'module_hr', // 'hr系统'
    module_mine_home = 'module_mine_home', // '我的'
  }
  export interface BasicInfo {
    name: string;
    customer_id: number;
    top_team_name: string;
    top_team_id: number;
    email: string;
    thumbnail: string;
    is_top_team_leader: boolean; // 是否是 1级或者0级部门领导
  }

  interface SubPermission {
    [index: string]: boolean;
  }

  export interface Permission {
    auth: boolean;
    sub_permits: SubPermission;
  }

  export type Permissions = {
    [P in ModuleAuthKey]: Permission;
  };

  export interface SummaryInfo {
    user_info: BasicInfo;
    permissions: Permissions;
  }
}
