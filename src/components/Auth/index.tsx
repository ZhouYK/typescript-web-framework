import React, { ReactNode } from 'react';
import { permissionCheck } from '../../utils/auth';
import { Permission } from '../../pages/pagesRoadMap';

interface AuthProps {
  // 组件本身需要的权限码，权限条件
  permissions: Permission;
  // 若当前组件无对应权限, 应提供fallback方法用以处理无权限状态下的组件状态
  fallback: () => ReactNode;
  // 组件被注入的权限码
  authResult?: Record<string, boolean>;
  authFn?: () => Record<string, boolean>;
  children: ReactNode | ReactNode[];
}

class Auth extends React.Component<AuthProps> {
  static defaultProps: AuthProps = {
    permissions: [],
    fallback: () => null,
    authResult: {},
    children: null,
  };

  render() {
    const authResult = this.props.authResult ? { ...this.props.authResult } : this.props.authFn();

    // 若无权限要求, 则直接返回组件
    const isValid = permissionCheck(this.props.permissions, authResult);

    // 根据权限确定返回值
    if (isValid === true) return this.props.children;
    if (this.props.fallback) return this.props.fallback();
    return null;
  }
}

export default Auth;
