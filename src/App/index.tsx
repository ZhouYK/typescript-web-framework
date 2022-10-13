import { FC, ReactElement } from 'react';
import { Layout } from 'antd';
import SiderControl from '@/components/Sider/SiderControl';
import DispatchRoute from '@/components/Routes/DispatchRoute';
import HeaderControl from '@/components/Header/HeaderControl';

import style from './style.less';

const { Content } = Layout;

interface AppProps {
}

const App: FC<AppProps> = (_props: AppProps): ReactElement => {
  const content = (
    <Content className={style.mainLayout}>
      <DispatchRoute />
    </Content>
  );
  return (
    <Layout hasSider style={{ height: '100%' }}>
      <SiderControl />
      <Layout className={style.contentWrap}>
        <HeaderControl />
        {content}
      </Layout>
    </Layout>
  );
};

export default App;
