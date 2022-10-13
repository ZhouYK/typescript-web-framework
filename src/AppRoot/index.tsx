import React, {
  ReactElement,
} from 'react';
import { Router } from 'react-router-dom';
import userModel from '@/models/user/model';
import userService from '@/models/user/service';
import Spinner from '@/components/Spinner';
import NotFound from '@/components/NotFound';
import { useModel } from 'femo';
import { safeCrash } from '@/hocs';
import history from './history';

interface RootProps {
  [index: string]: any;
}

const AppRoot = (props: RootProps): ReactElement => {
  const { children } = props;
  const [userInfo,, { loading }] = useModel(userModel, userService.getUserInfo);

  if (loading) {
    return <Spinner />;
  }

  if (!userInfo) {
    return <NotFound text='用户信息获取失败，请稍后重试...' />;
  }

  return (
    <Router history={history}>
      {children}
    </Router>
  );
};

export default safeCrash(AppRoot);
