import {
  AnchorHTMLAttributes, ComponentType,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PrepareDataInjectProps } from '@/components/PrepareData';
import { ServiceOptions } from 'femo';

export type Permission = Set<any> | any[];

export enum RoadMapType {
  living = 'living',
  fallen = 'fallen'
}

export interface RoadMap {
  name?: any; // 路由的 name。可以是动态的，数据来自于url的query，形如 {depart_id}
  path: string; // 必需。这个是路由配置的唯一key
  completePath?: string; // 完整路径，相较于path补充了前缀。 形如 /xxx/xxx/{path}
  externUrl?: string; // 跳转到外部的链接，如果需要在新标签打开需要配置 externProps = {target: '_blank'}。配置了externUrl将会忽略 path和realPath
  externProps?: AnchorHTMLAttributes<any>; // <a> 标签的所有可选属性
  subRoads?: RoadMap[];
  component?: ComponentType<Partial<RouteComponentProps> & PrepareDataInjectProps>; // 只和subPaths互斥，与leafPaths可以共存。没有下级菜单的才会有组件
  permissions?: Permission; // 每个节点权限码。如果不指定permissions或者permissions为空数组，则认为该节点默认所有可见。普通数组代表'且', Set代表'或'
  fallback?: ComponentType<any>; // 当没有权限时的回退函数（重定向，还是绘制其他视图，都通过fallback）
  access?: boolean; // 是否可以访问到，是权限码校验的结果。配合fallback使用
  icon?: ComponentType;
  hasHeader?: boolean; // 可应用所有路由，对应的页面是否显示最顶部的header，true：展示，false：隐藏，默认为true。上级路由设置对下级路由生效，下级路由设置可以覆盖上级路由设置（优先级高于上级路由）
  hasSider?: boolean; // 可应用所有路由，对应的页面是否显示最左侧导航菜单栏，true：展示，false：隐藏，默认为true。上级路由设置对下级路由生效，下级路由设置可以覆盖上级路由设置（优先级高于上级路由）
  hasLivingRoadInSubRoads?: boolean; // 在subRoads中是否有类型为 RoadMapType.living 的road
  type?: RoadMapType.fallen | RoadMapType.living; // 路由类型，living(默认值): 有自己菜单项的; fallen: 没有自己的菜单项；fallen类型渲染时，会向上寻找第一个living的菜单项进行高亮
  defaultOpen?: boolean; // 控制二级子菜单是否默认展开
  parent?: RoadMap;
  prepare?: (routeParams: RouteComponentProps, control: ServiceOptions['control']) => Promise<any>; // 提前拉取页面数据
}

export interface RoadMapModuleType {
  [index: string]: RoadMap;
}
