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
import { ApiCode } from '@src/tools/request/interface';
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

const Root = (props: RootProps): ReactElement => {
  const { children } = props;
  const [ready, updateReady] = useState(ReadyState.pending);

  useEffect(() => {
    updateReady(ReadyState.success);
    userModel(() => common.getUserInfo().then((res) => {
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
