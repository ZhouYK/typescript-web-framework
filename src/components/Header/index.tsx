import React, {
  FC, useEffect, useState,
} from 'react';
import {
  Layout, Avatar, Breadcrumb, Dropdown, Menu,
} from 'antd';
import userModel from '@src/model/user';
import { subscribe } from 'femo';
import { User } from '@src/api/interface';
import { getSafe } from '@src/tools/util';
import {
  Props,
} from '@src/components/Header/interface';
import { Link } from 'react-router-dom';

import style from './style.less';

const { Header } = Layout;

const MisHeader: FC<Props> = (props: Props) => {
  const [userInfo, updateUserInfo] = useState((): User.BasicInfo => userModel.info());
  useEffect(() => subscribe([userModel.info], (info: User.BasicInfo) => {
    updateUserInfo(info);
  }), []);

  const breadcrumbs = Object.keys(props.breadcrumbNameMap).map((key: string) => {
    const names = props.breadcrumbNameMap[key];
    if (names instanceof Array) {
      return names.map((name: string) => (
        <Breadcrumb.Item key={key}>
          <Link to={key}>
            { name }
          </Link>
        </Breadcrumb.Item>
      ));
    }
    return (
      <Breadcrumb.Item key={key}>
        <Link to={key}>
          { names }
        </Link>
      </Breadcrumb.Item>
    );
  });

  const overlay = (
    <Menu>
      <Menu.Item>
        <a href={''}>退出</a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className={style.misHeader}>
      { breadcrumbs.length !== 0 ? (
        <section className='mis-header-breadcrumb'>
          <Breadcrumb>{breadcrumbs}</Breadcrumb>
        </section>
      ) : null }
      <section className='mis-header-placeholder-section' />
      <Dropdown
        overlay={overlay}
      >
        <section className='mis-header-user-info'>
          <Avatar src={getSafe(userInfo, 'thumbnail')} />
          <span className='mis-header-user-name'>{ getSafe(userInfo, 'name') }</span>
        </section>
      </Dropdown>
    </Header>
  );
};

export default MisHeader;
