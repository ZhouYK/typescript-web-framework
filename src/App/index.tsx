import React, { FC } from 'react';
import { Layout } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import SiderControl from '@src/components/Sider/SiderControl';
import DispatchRoute from '@src/components/Routes/DispatchRoute';
import subSiderStyle from '@src/components/SubSider/style.less';
import HeaderControl from '@src/components/Header/HeaderControl';

import style from './style.less';

const { Content } = Layout;

interface AppProps extends RouteComponentProps {
}

const App: FC<AppProps> = (props: AppProps) => {
  const { ...routeProps } = props;

  return (
    <Layout style={{ height: '100%' }}>
      <HeaderControl {...routeProps} />
      <Content className={style.contentWrap}>
        <Layout hasSider>
          <SiderControl {...routeProps} />
          <Layout
            id="page-layout"
            style={{
              overflowX: 'auto',
            }}
            className={subSiderStyle.subSider}
          >
            <DispatchRoute { ...routeProps } />
          </Layout>
        </Layout>
      </Content>
    </Layout>
  );
};

export default withRouter(App);
