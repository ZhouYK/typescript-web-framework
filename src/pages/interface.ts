import { ComponentType, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export type Permission = Set<any> | any[];

export interface RoadMap {
  name?: string | ReactNode; // 路由的 name。可以是动态的，数据来自于url的query，形如 {depart_id}
  innerTitle?: string | ReactNode; // 渲染到 Menu.Item children 的内容，如果为 undefined 则渲染 name
  path: string; // 必需。这个是路由配置的唯一key
  realPath?: string; // 表示该节点的真正路由地址。如果没有将由path来决定。realPath还是处在router的控制下。权重低于externUrl
  externUrl?: string; // 跳转到外部的链接，如果需要在新标签打开需要配置 externProps = {target: '_blank'}。配置了externUrl将会忽略 path和realPath
  externProps?: object; // <a> 标签的所有可选属性
  homeUrl?: string; // 系统的默认首页，只在第一层配置了才有效，目前在404组件中有用到
  subPaths?: RoadMap[]; // 和leafPaths互斥。 下级菜单
  leafPaths?: RoadMap[]; // 和subPaths互斥。叶子页面，不会再有下级。没有自己的菜单，但是会激活父节点的菜单
  component?: any; // 只和subPaths互斥，与leafPaths可以共存。没有下级菜单的才会有组件
  grayFeature?: any; // 灰度的key。如果有值，表示该节点处于灰度状态，会从灰度接口结果中匹配：匹配到了则显示；未匹配则不显示。显示与否也是通过控制visible
  permissions?: Permission; // 每个节点权限码。如果不指定permissions或者permissions为空数组，则认为该节点默认所有可见。普通数组代表'且', Set代表'或'
  authResult?: { [index: string]: boolean }; // 权限校验结果
  fallback?: (props: RouteComponentProps) => any; // 当没有权限时的回退函数（重定向，还是绘制其他视图，都通过fallback）
  access?: boolean; // 是否可以访问到，是权限码校验的结果。配合fallback使用
  icon?: ComponentType;
  hasHeader?: boolean; // 可应用所有路由，对应的页面是否显示最顶部的header，true：展示，false：隐藏，默认为true。上级路由设置对下级路由生效，下级路由设置可以覆盖上级路由设置（优先级高于上级路由）
  hasSider?: boolean; // 可应用所有路由，对应的页面是否显示最左侧导航菜单栏，true：展示，false：隐藏，默认为true。上级路由设置对下级路由生效，下级路由设置可以覆盖上级路由设置（优先级高于上级路由）
  hasSubSider?: boolean; // 可应用于所有路由，对应的页面是否展示左侧第二级导航菜单栏，true：展示，false：隐藏，默认为true。上级路由设置对下级路由生效，下级路由设置可以覆盖上级路由设置（优先级高于上级路由）
  visible?: boolean; // 单纯控制显示与否.false: 菜单不可见；true: 菜单可见; visible菜单是否展示。目前在beforeRender.ts(这里面相当于当做是过滤标识，不是字段的本意)、SubSider/index.tsx中有使用
  defaultOpen?: boolean; // 控制二级子菜单是否默认展开
}


export interface RoadMapModuleType {
  [index: string]: RoadMap;
}
