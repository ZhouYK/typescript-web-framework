import { Layout } from '@zyk/components';
import React from 'react';
import { connect, DvaInstance } from 'dva';
import { RouteComponentProps } from 'react-router';
import { get} from 'lodash';
import { Dispatch } from 'redux';
import DispatchRoute from '../components/Routes/DispatchRoute';
import SiderControl from '../components/Sider/SiderControl';
import HeaderControl from '../components/PeopleHeader/HeaderControl';
import Evaluation from '../components/Evaluation';
import style from './style.less';
import subSiderStyle from '../components/SubSider/style.less';
import { RoadMap } from '../pages/pagesRoadMap';
import { UserInfo } from '../models/userInfo';

const { Content } = Layout;

interface AppProps extends RouteComponentProps {
  app: DvaInstance;
  pagesRoadMap: RoadMap[];
  dispatch: Dispatch;
}

const App = (props: AppProps) => {
  const { app, ...routeProps } = props;

  return (
    <React.Fragment>
      <Layout style={{ height: '100%' }}>
        <HeaderControl />
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
              <DispatchRoute />
              <Evaluation />
            </Layout>
          </Layout>
        </Content>
      </Layout>
    </React.Fragment>
  );
};

const mapStateToProps = (state: { userInfo: UserInfo }) => {
  const pagesRoadMap = get(state, 'userInfo.userRoadMap') || [];

  return {
    pagesRoadMap,
  };
};

export default connect(mapStateToProps)(App);
