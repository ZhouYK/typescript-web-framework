import { FC, ReactElement } from 'react';
import { Layout } from '@arco-design/web-react';
import SiderControl from '@/components/Sider/SiderControl';
import DispatchRoute from '@/components/Routes/DispatchRoute';
import HeaderControl from '@/components/Header/HeaderControl';

const { Content } = Layout;

interface AppProps {
}

const App: FC<AppProps> = (_props: AppProps): ReactElement => {
  const content = (
    <Content>
      <DispatchRoute />
    </Content>
  );
  return (
    <Layout hasSider style={{ height: '100%' }}>
      <SiderControl />
      <Layout>
        <HeaderControl />
        {content}
      </Layout>
    </Layout>
  );
};

export default App;
