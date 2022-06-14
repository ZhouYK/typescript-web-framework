import {
  FC,
} from 'react';
import {
  Layout, Avatar, Breadcrumb, Dropdown, Menu,
} from 'antd';
import model from '@src/models/user/model';
import { useModel } from 'femo';
import {
  Props,
} from '@src/components/Header/interface';
import { Link } from 'react-router-dom';

import style from './style.less';

const { Header } = Layout;

const CusHeader: FC<Props> = (props: Props) => {
  const { breadcrumbNameMap } = props;
  const [userInfo] = useModel(model);
  const breadcrumbs = breadcrumbNameMap.map((bread) => (
      <Breadcrumb.Item key={bread.name as any}>
        <Link to={bread.completePath}>
          { bread.name }
        </Link>
      </Breadcrumb.Item>
  ));

  const overlay = (
    <Menu>
      <Menu.Item>
        <a href={''}>退出</a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className={style.header}>
      { breadcrumbs.length !== 0 ? (
        <section className={`${style.prefix}-header-breadcrumb`}>
          <Breadcrumb>{breadcrumbs}</Breadcrumb>
        </section>
      ) : null }
      <section className={`${style.prefix}-header-placeholder-section`} />
      <Dropdown
        overlay={overlay}
      >
        <section className={`${style.prefix}-header-user-info`}>
          <Avatar src={userInfo?.thumbnail} />
          <span className={`${style.prefix}-header-user-name`}>{ userInfo?.name }</span>
        </section>
      </Dropdown>
    </Header>
  );
};

export default CusHeader;
