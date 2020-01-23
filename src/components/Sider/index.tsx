import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import React, { ReactElement, useCallback, useRef } from 'react';
import { RoadMap } from '@src/pages/model/pagesRoadMap';
import {
  State, KeyPathItem, CurContext, RefInstance, Props, EXTERN_KEY_PREFIX, MenusFunc,
} from './interface';
import style from './style.less';

const { useState, useEffect } = React;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;
const { Sider } = Layout;

const genRenderMenus = (curContext: CurContext): MenusFunc => {
  // @ts-ignore
  const renderMenus = (menus: RoadMap[], path: string[] = [], depth: number = 1): ReactElement[] => {
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
        let title;
        if (typeof item.icon === 'string') {
          // @ts-ignore
          const iconEl = <Icon type={item.icon} />;
          title = <span>{iconEl}</span>;
        } else if (['function', 'object'].includes(typeof item.icon)) {
          // @ts-ignore
          const iconEl = <Icon component={item.icon} />;
          title = <span>{iconEl}</span>;
        } else {
          // 如果未指定icon，则默认指定一个
          title = <Icon type="setting" />;
        }
        if (item.subPaths && item.subPaths.length !== 0) {
          elements = (
            // @ts-ignore
            <SubMenu title={title} key={keyPath}>
              {renderMenus(item.subPaths, path, depth + 1)}
            </SubMenu>
          );
          // 跳转到非 zyk 页面的链接，渲染一个 a 标签
        } else if (item.externUrl) {
          elements = (
            // @ts-ignore
            <MenuItem key={`${EXTERN_KEY_PREFIX}-${item.externUrl}`} title={title} showTooltip>
              <a href={item.externUrl} rel="noopener noreferrer" {...item.externProps || {}}>
                {title}
              </a>
            </MenuItem>
          );
        } else {
          elements = (
            // @ts-ignore
            <MenuItem key={keyPath} title={item.name} showTooltip>
              <Link to={item.realPath || keyPath}>{title}</Link>
            </MenuItem>
          );
        }
      }
      path.pop();
      return elements;
    });
  };
  return renderMenus;
};

const LeftSider = (props: Props): ReactElement => {
  const [curContext] = useState((): CurContext => ({
    keyPaths: [],
    cachedSider: [],
    cachedElements: [],
  }));
  const keysRef: RefInstance = useRef([]);
  // 菜单状态
  const keysInitial: State = { openKeys: [], selectedKeys: [] };
  const [keys, keysUpdater] = useState(keysInitial);
  keysRef.current = keys;

  // 使用url path匹配keyPaths中的路径
  const analyzeUrlToKeys = (urlPath: string): void => {
    const arr = curContext.keyPaths.filter((item): boolean => {
      const { keyPath } = item;
      const re = pathToRegexp(keyPath, [], { end: false });
      const result = re.exec(urlPath);
      return !!result;
    });
    const map = new Map();
    // 同等深度的节点，取先匹配的
    arr.forEach((road: KeyPathItem): void => {
      if (!map.has(road.depth)) {
        map.set(road.depth, road);
      }
    });

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
    keysUpdater({
      ...obj,
      openKeys: Array.from(new Set([...keysRef.current.openKeys, ...obj.openKeys])),
    });
  };

  // 添加副作用代码
  useEffect((): void => {
    analyzeUrlToKeys(props.location.pathname);
  }, [props.sider, props.location.pathname]);

  // 菜单项点击事件
  const handleItemClick = useCallback(
    (obj: { item: any; key: string; keyPath: string[] }): void => {
      keysUpdater({
        ...keysRef.current,
        selectedKeys: [obj.key],
      });
    },
    [keysRef],
  );

  // 次级菜单展开状态变化事件
  const handleSubMenuOpenChange = useCallback(
    (oks: string[]): void => {
      keysUpdater({
        ...keysRef.current,
        openKeys: oks,
      });
    },
    [keysRef],
  );

  // 渲染menus
  // 这里没有放入useEffect和useLayoutEffect是为了在属性发生变化的第一次渲染就得到最新的元素;它们时机滞后，不合适
  const renderMenus = genRenderMenus(curContext);

  const { sider /* loadingStatus */ } = props;
  curContext.cachedElements = renderMenus(sider);
  curContext.cachedSider = sider;

  const { openKeys, selectedKeys } = keys;
  return (
    <Sider className={style.zykMenuSider} width={style.siderWidth}>
      <Menu
        className="zyk-sider-menu"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onClick={handleItemClick}
        onOpenChange={handleSubMenuOpenChange}
        mode="inline"
        style={{ minHeight: '100%', borderRight: 0 }}
      >
        {curContext.cachedElements}
      </Menu>
    </Sider>
  );
};

export default LeftSider;
