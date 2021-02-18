import React, {
  ErrorInfo, ReactElement, ReactNode, useEffect, useState,
} from 'react';
import { Router } from 'react-router-dom';
import sentry from '@src/tools/sentry';
import { getSafe } from '@src/tools/util';
import userModel from '@src/model/user';
import { common } from '@src/api/actions';
import Spinner from '@src/components/Spinner';
import NotFound from '@src/components/NotFound';
import { User } from '@src/api/interface';
import { ApiCode } from '@src/tools/request/interface';
import permissionModel from '@src/model/permission';
import { extractPagesRoadMapAsArray, extractPagesRoadMapKeys } from '@src/pages/aroundRoadMap';
import { findUserPathRoadMap } from '@src/tools/auth';
import pagesRoadMap from '@src/pages/roadMap';
import history from './history';

interface EcProps {
  children: ReactNode;
}

class ErrorCatch extends React.Component<EcProps> {
  public componentDidCatch(err: Error, msg: ErrorInfo): void {
    sentry.reportErrorBoundary(err, msg, this);
  }

  public render(): ReactNode {
    return this.props.children;
  }
}
interface RootProps {
  [index: string]: any;
}

enum ReadyState {
  success,
  fail,
  pending,
}

const extractPermissions = (permissions: User.SummaryInfo['permissions']) => {
  let result: { [index: string]: boolean } = {};
  try {
    Object.keys(permissions).forEach((key) => {
      const cur = permissions[key as User.ModuleAuthKey];
      result[key] = getSafe(cur, 'auth') || false;
      const sub_permits = getSafe(cur, 'sub_permits');
      result = {
        ...result,
        ...sub_permits,
      };
    });
  } catch (e) {
    sentry.reportError(e);
  }
  return result;
};

const Root = (props: RootProps): ReactElement => {
  const { children } = props;
  const [ready, updateReady] = useState(ReadyState.pending);

  useEffect(() => {
    updateReady(ReadyState.success);
    return;
    // eslint-disable-next-line no-unreachable
    userModel.info(() => common.getUserInfo().then((res) => {
      // 如果是员工入口的绩效管理，则展示另外一套路由
      // 更新权限数据
      permissionModel.permission(extractPermissions(getSafe(res, 'data.permissions')));
      const keys = extractPagesRoadMapKeys();
      // 过滤根据权限遍历路由
      pagesRoadMap(
        findUserPathRoadMap(permissionModel.permission(), extractPagesRoadMapAsArray()).reduce((pre, cur, index) => {
          pre[keys[index]] = cur;
          return pre;
        }, {}),
      );
      updateReady(ReadyState.success);
      return getSafe(res, 'data');
    }).catch((err: any) => {
      const code = getSafe(err, 'code');
      if (code !== ApiCode.needLogin) {
        updateReady(ReadyState.fail);
      }
    }));
  }, []);

  if (ready === ReadyState.pending) {
    return <Spinner />;
  }

  if (ready === ReadyState.fail) {
    return <NotFound text='用户信息获取失败，请稍后重试...' />;
  }

  return (
    <ErrorCatch>
      <Router history={history}>
        {children}
      </Router>
    </ErrorCatch>
  );
};

export default Root;
