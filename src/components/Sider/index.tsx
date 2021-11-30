import { Layout, Menu } from 'antd';
import { pathToRegexp } from 'path-to-regexp';
import React, { ReactElement, useCallback, useState } from 'react';
import { RoadMap } from '@src/interface';
import { getSafe } from '@src/tools/util';
import { useDerivedState } from 'femo';
import {
  State, KeyPathItem, CurContext, Props, EXTERN_KEY_PREFIX,
} from './interface';

import style from './style.less';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;
const { Sider } = Layout;

const colapisble = (map: RoadMap[]) => !((map || []).find((r) => getSafe(r, 'path', '').indexOf('/dep-hr') !== -1));

const EmptyIcon = (): null => null;

const LeftSider = (props: Props): ReactElement => {
  const { history, sider, location } = props;
  const pathname = getSafe(location, 'pathname', '');
  const [collapsed, updateCollapsed] = useState(false);
  const onCollapse = useCallback((colla: boolean) => {
    updateCollapsed(colla);
  }, [updateCollapsed]);

  const [curContext] = useState((): CurContext => ({
    keyPaths: [],
    cachedSider: [],
    cachedElements: [],
  }));

  const renderMenus = useCallback((menus: RoadMap[], path: string[] = [], depth = 1): ReactElement[] => {
    // 第一次调用
    if (path.length === 0) {
      // 如果sider数据发生了更新才做重新渲染
      // 否则，从缓存中获取
      if (curContext.cachedSider === menus) {
        return curContext.cachedElements;
      }
      curContext.keyPaths = [];
    }

    return menus.map((item): ReactElement => {
      let elements = null;
      path.push(item.path);
      if (item.visible !== false) {
        const keyPath = path.join('');
        const obj: KeyPathItem = {
          keyPath,
          depth,
        };
        if (item.component) {
          obj.component = item.component;
        }
        curContext.keyPaths.push(obj);
        const IconComponent = item.icon || EmptyIcon;
        if (item.subPaths && item.subPaths.length !== 0) {
          elements = (
            <SubMenu title={item.name} key={keyPath} icon={<IconComponent />}>
              {renderMenus(item.subPaths, path, depth + 1)}
            </SubMenu>
          );
          // 跳转到非系统内的页面的链接，渲染一个 a 标签
        } else if (item.externUrl) {
          elements = (
            <MenuItem icon={<IconComponent />} key={`${EXTERN_KEY_PREFIX}-${item.externUrl}`}>
              <a href={item.externUrl} rel="noopener noreferrer" {...item.externProps || {}}>
                {item.name}
              </a>
            </MenuItem>
          );
        } else {
          elements = (
            <MenuItem
              onClick={(): void => {
                history.push(item.realPath || keyPath);
              }}
              key={keyPath}
              title={item.name}
              icon={<IconComponent />}
            >
              {item.name}
            </MenuItem>
          );
        }
      }
      path.pop();
      return elements;
    });
  }, []);

  // 渲染menus
  // 这里没有放入useEffect和useLayoutEffect是为了在属性发生变化的第一次渲染就得到最新的元素;它们时机滞后，不合适
  useDerivedState(() => {
    curContext.cachedElements = renderMenus(sider);
    curContext.cachedSider = sider;
  }, [sider]);

  // 使用url path匹配keyPaths中的路径
  const analyzeUrlToKeys = useCallback((urlPath: string): State => {
    const arr = curContext.keyPaths.filter((item): boolean => {
      const { keyPath } = item;
      const re = pathToRegexp(keyPath, [], { end: false });
      const result = re.exec(urlPath);
      return !!result;
    });
    const map = new Map();
    // 同等深度的节点，取先匹配的
    for (let i = 0; i < arr.length; i += 1) {
      const road = arr[i];
      if (!map.has(road.depth)) {
        map.set(road.depth, road);
      }
    }

    const newArr = Array.from(map.values());

    // 按深度进行升序排列
    newArr.sort((a, b): number => a.depth - b.depth);

    const obj: {
      openKeys: string[];
      selectedKeys: string[];
    } = {
      openKeys: [],
      selectedKeys: [],
    };
    const { length } = newArr;
    if (length >= 1) {
      // 最后一个是高亮的，我们要找的
      const target = newArr[newArr.length - 1];
      obj.openKeys = newArr.map((n: KeyPathItem): string => n.keyPath);
      obj.selectedKeys = [target.keyPath];
    }
    return obj;
  }, []);

  // 菜单状态
  const [keys, keysModel] = useDerivedState(() => analyzeUrlToKeys(pathname), (state) => {
    const obj = analyzeUrlToKeys(pathname);
    return {
      ...obj,
      openKeys: Array.from(new Set([...state.openKeys, ...obj.openKeys])),
    };
  }, [sider, pathname]);

  // 菜单项点击事件
  const handleItemClick = useCallback(
    (obj: { item: any; key: string; keyPath: string[] } & any): any => {
      const key: string = getSafe(obj, 'key') || '';
      if (key.startsWith(`${EXTERN_KEY_PREFIX}-`)) {
        return;
      }
      keysModel((_d, state) => ({
        ...state,
        selectedKeys: [key],
      }));
    },
    [],
  );

  // 次级菜单展开状态变化事件
  const handleSubMenuOpenChange = useCallback(
    (oks: (string[]) | any): any => {
      keysModel((_d, state) => ({
        ...state,
        openKeys: oks,
      }));
    },
    [],
  );

  const backHome = useCallback(() => {
    props.history.push('/');
  }, [props.history]);

  const { openKeys, selectedKeys } = keys;

  return (
    <Sider
      className={style.sider}
      width={style.siderwidth}
      collapsible={colapisble(sider)}
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <header className={`${style.prefix}-logo`} onClick={backHome}>
        <section className={`${style.prefix}-logo-png`} />
        <section className={`${style.prefix}-logo-placeholder`} />
        <span className={`${style.prefix}-logo-text`}>{style.prefix}</span>
      </header>
      <Menu
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onClick={handleItemClick}
        onOpenChange={handleSubMenuOpenChange}
        mode="inline"
        theme='dark'
      >
        {curContext.cachedElements}
      </Menu>
    </Sider>
  );
};

export default LeftSider;
