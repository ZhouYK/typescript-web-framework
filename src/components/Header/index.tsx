import React, {
  FC,
} from 'react';
import {
  Layout, Breadcrumb,
} from '@arco-design/web-react';
import {
  Props,
} from '@/components/Header/interface';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const CusHeader: FC<Props> = (props: Props) => {
  const { breadcrumbNameMap } = props;
  const breadcrumbs = breadcrumbNameMap.map((bread) => (
      <Breadcrumb.Item key={bread.name as React.Key}>
        <Link to={bread.completePath}>
          { bread.name }
        </Link>
      </Breadcrumb.Item>
  ));
  return (
    <Header>
      { breadcrumbs.length !== 0 ? (
        <section>
          <Breadcrumb>{breadcrumbs}</Breadcrumb>
        </section>
      ) : null }
    </Header>
  );
};

export default CusHeader;
