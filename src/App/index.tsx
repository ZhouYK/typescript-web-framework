import React, { FC, ReactElement } from 'react';
import { Layout } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import SiderControl from '@src/components/Sider/SiderControl';
import DispatchRoute from '@src/components/Routes/DispatchRoute';
import HeaderControl from '@src/components/Header/HeaderControl';
// import Scrollbar from '@src/components/Scrollbar';
// import { isMobile } from '@src/tools/util';

import style from './style.less';

const { Content } = Layout;

interface AppProps extends RouteComponentProps {
}

const App: FC<AppProps> = (props: AppProps): ReactElement => {
  const { ...routeProps } = props;
  const content = (
    <Content className={style.mainLayout}>
      <DispatchRoute { ...routeProps } />
    </Content>
  );
  return (
    <Layout hasSider style={{ height: '100%' }}>
      <SiderControl {...routeProps} />
      <Layout className={style.contentWrap}>
        <HeaderControl {...routeProps} />
        {content}
      </Layout>
    </Layout>
  );
};

export default withRouter(App);
