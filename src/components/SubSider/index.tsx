import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { pathToRegexp } from 'path-to-regexp';
import React, {
  useRef, useState, useEffect, ReactElement, useCallback,
} from 'react';
import classnames from 'classnames';
import {
  EXTERN_KEY_PREFIX,
  SubSider,
  SubSiderProps,
  State,
  RefInstance,
  CurContext,
  KeyPathItem,
  OTHER_NAV_KEY_PREFIX, RenderFunc,
} from './interface';
import style from './style.less';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;
const { Sider } = Layout;

/**
 * 获取一个 url path 中最大斜线的个数
 * 如果 url path 不是以斜线开始或者结束，会将斜线补全再计算
 * @param path
 */
const getPathLength = (path: string): number => {
  let pathLength = path.split('/').length;
  if (!path.startsWith('/')) {
    pathLength += 1;
  }
  if (!path.endsWith('/')) {
    pathLength += 1;
  }
  return pathLength;
};

/**
 * 找出 path 中斜线最多的一个 road，作为和当前路径最匹配的 road
 * 如果有多个相同，则选择第一个相同的
 * @param sameDepthRoads
 */
const getMostEqualPath = (sameDepthRoads: KeyPathItem[]): KeyPathItem => {
  let maxPath = -1;
  let maxPathRoad: KeyPathItem;
  sameDepthRoads.forEach((road: KeyPathItem): void => {
    const currentPathLength = getPathLength(road.keyPath);
    if (currentPathLength > maxPath) {
      maxPath = currentPathLength;
      maxPathRoad = road;
    }
  });
  return maxPathRoad;
};

const genRenderMenus = (curContext: CurContext): RenderFunc => {
  const renderMenus = (sider: SubSider, path: string[] = [], depth = 1): ReactElement[] => {
    // 第一次调用
    if (path.length === 0) {
      // 如果sider数据发生了更新才做重新渲染
      // 否则，从缓存中获取
      if (curContext.cachedSider === sider) {
        return curContext.cachedElements;
      }
      curContext.keyPaths = [];
    }
    const { basePath, subSider } = sider;
    const cachedElements: (React.ReactElement | null)[] = [];
    subSider.forEach((item): void => {
      path.push(item.path);
      if (item.visible !== false) {
        const keyPath = `${basePath}${path.join('')}`;
        const obj: KeyPathItem = {
          keyPath,
          depth,
        };
        if (item.component) {
          obj.component = item.component;
        }
        curContext.keyPaths.push(obj);
        const title = item.name;
        if (item.subPaths && item.subPaths.length !== 0) {
          cachedElements.push(
            <SubMenu title={title} key={keyPath}>
              {renderMenus({ basePath, subSider: item.subPaths }, path, depth + 1)}
            </SubMenu>,
          );
          // 跳转到外部页面的链接，渲染一个 a 标签
        } else if (item.externUrl) {
          cachedElements.push(
            <MenuItem key={`${EXTERN_KEY_PREFIX}-${item.externUrl}`} title={title} className="zyk-menu-extern-item">
              <a href={item.externUrl} rel="noopener noreferrer" {...item.externProps || {}}>
                {item.innerTitle || title}
              </a>
            </MenuItem>,
          );
        } else {
          cachedElements.push(
            <MenuItem key={keyPath} title={title}>
              <Link to={item.realPath || keyPath}>{item.innerTitle || title}</Link>
            </MenuItem>,
          );
        }
      }
      path.pop();
    });
    return cachedElements;
  };
  return renderMenus;
};

// 获取初始的默认打开的子菜单
const getDefaultOpenKeys = (sider: SubSider): string[] => {
  const defaultOpenKeys: string[] = [];
  if (sider) {
    const { basePath, subSider } = sider;
    if (subSider) {
      subSider.forEach((item): void => {
        if (item.subPaths && item.defaultOpen) {
          defaultOpenKeys.push(`${basePath}${item.path}`);
        }
      });
    }
  }
  return defaultOpenKeys;
};

const SubLeftSider = (props: SubSiderProps): ReactElement => {
  const [curContext] = useState((): CurContext => ({
    keyPaths: [],
    cachedSider: {
      basePath: '',
      subSider: [],
    },
    cachedElements: [],
  }));
  const keysRef: RefInstance = useRef([]);
  // 菜单状态
  const keysInitial: State = { openKeys: getDefaultOpenKeys(props.sider), selectedKeys: [] };
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

    // 同等深度的节点，取路径最长（斜线最多而非字符串长度最长）的节点
    arr.forEach((road: KeyPathItem): void => {
      if (!map.has(road.depth)) {
        const sameDepthArr = arr.filter((road2: KeyPathItem): boolean => road2.depth === road.depth);
        map.set(road.depth, getMostEqualPath(sameDepthArr));
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
  }, [props.sider, props.location.pathname, props.location.search]);

  // 菜单项点击事件
  const handleItemClick = useCallback(
    (obj: { item: any; key: any; keyPath: any[] }): void => {
      // 如果点击跳转外部的 url 则不选中当前点击的 menu
      if (!obj.key.startsWith(EXTERN_KEY_PREFIX) && !obj.key.startsWith(OTHER_NAV_KEY_PREFIX)) {
        keysUpdater({
          ...keysRef.current,
          selectedKeys: [obj.key],
        });
      }
    },
    [keysRef],
  );

  // 次级菜单展开状态变化事件
  const handleSubMenuOpenChange = useCallback(
    (oks: any[]): void => {
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

  const { sider /* loadingStatus */, hasSider } = props;
  curContext.cachedElements = renderMenus(sider);
  curContext.cachedSider = sider;
  const { openKeys, selectedKeys } = keys;
  const siderMenu = useRef(null);

  return (
    <Sider
      className={classnames('zyk-layout-sider', {
        'zyk-sub-sider-without-top-sider': !hasSider,
      })}
      width={hasSider ? style.siderWidth : style.siderWidth - style.paddingOneSide}
    >
      <Menu
        ref={siderMenu}
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

export default SubLeftSider;
