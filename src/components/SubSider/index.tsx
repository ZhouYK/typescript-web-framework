import { Link } from 'dva/router';
import { Layout, Menu, Scrollbar } from '@zyk/components';
import pathToRegexp from 'path-to-regexp';
import React, { useMemo, useRef, useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { uniq, isPlainObject } from 'lodash';
import classnames from 'classnames';
import { objectToQuery, queryToObject } from '../../utils/util';
import {
  EXTERN_KEY_PREFIX,
  SubSider,
  SubSiderProps,
  State,
  RefInstance,
  CurContext,
  KeyPathItem,
  QueryRoad,
  Key,
  OTHER_NAV_KEY_PREFIX,
} from './interface';
import style from './style.less';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;
const { Sider } = Layout;

const genSearchStr = (key: Key) => {
  if (isPlainObject(key)) {
    return objectToQuery(key);
  }
  return '';
};

const transform_16 = 'transform-16';

let scrollContainer: any = null;

const getScrollContainer = (node: any) => {
  scrollContainer = node;
};

/**
 * 获取一个 url path 中最大斜线的个数
 * 如果 url path 不是以斜线开始或者结束，会将斜线补全再计算
 * @param path
 */
const getPathLength = (path: string) => {
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
  sameDepthRoads.forEach((road: KeyPathItem) => {
    const currentPathLength = getPathLength(road.keyPath);
    if (currentPathLength > maxPath) {
      maxPath = currentPathLength;
      maxPathRoad = road;
    }
  });
  return maxPathRoad;
};

const genRenderMenus = (curContext: CurContext, urlPath: string) => {
  const renderMenus = (sider: SubSider, path: string[] = [], depth: number = 1) => {
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
    subSider.forEach(item => {
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
            // @ts-ignore
            <SubMenu title={title} key={keyPath}>
              {renderMenus({ basePath, subSider: item.subPaths }, path, depth + 1)}
            </SubMenu>,
          );
          // 跳转到非 zyk 页面的链接，渲染一个 a 标签
        } else if (item.externUrl) {
          cachedElements.push(
            // @ts-ignore
            <MenuItem key={`${EXTERN_KEY_PREFIX}-${item.externUrl}`} title={title} className="zyk-menu-extern-item">
              <a href={item.externUrl} rel="noopener noreferrer" {...item.externProps || {}}>
                {item.innerTitle || title}
              </a>
            </MenuItem>,
          );
        } else if (item.queries) {
          // 这段逻辑处理path不变，query改变的情况
          const temp = item.queries.map((query: QueryRoad) => {
            if (query.visible !== false) {
              const searchStr = genSearchStr(query.key);
              let path = searchStr ? `${keyPath}?${searchStr}` : keyPath;
              let content = <Link to={path}>{query.innerTitle || query.name}</Link>;
              if (query.render) {
                path = `${OTHER_NAV_KEY_PREFIX}${path}`;
                content = query.render({
                  getScrollContainer: () => scrollContainer,
                });
              }
              const other = !!query.render;
              const isTalentList = urlPath.startsWith('/talent/list');
              return (
                <MenuItem
                  key={path}
                  className={classnames({
                    'zyk-menu-item-has-other-children': other,
                    'talent-folder-subsider-menu-item': isTalentList,
                  })}
                >
                  {content}
                </MenuItem>
              );
            }
            return null;
          });
          cachedElements.push(...temp);
          // ✨
          obj.queries = item.queries;
        } else {
          cachedElements.push(
            // @ts-ignore
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
const getDefaultOpenKeys = (sider: SubSider) => {
  const defaultOpenKeys: string[] = [];
  if (sider) {
    const { basePath, subSider } = sider;
    if (subSider) {
      subSider.forEach(item => {
        if (item.subPaths && item.defaultOpen) {
          defaultOpenKeys.push(`${basePath}${item.path}`);
        }
      });
    }
  }
  return defaultOpenKeys;
};

const SubLeftSider = (props: SubSiderProps) => {
  const [curContext] = useState(() => {
    const initial: CurContext = {
      keyPaths: [],
      cachedSider: {
        basePath: '',
        subSider: [],
      },
      cachedElements: [],
    };
    return initial;
  });
  const keysRef: RefInstance = useRef([]);
  // 菜单状态
  const keysInitial: State = { openKeys: getDefaultOpenKeys(props.sider), selectedKeys: [] };
  const [keys, keysUpdater] = useState(keysInitial);
  keysRef.current = keys;

  // 使用url path匹配keyPaths中的路径
  const analyzeUrlToKeys = (urlPath: string, searchStr?: string) => {
    const arr = curContext.keyPaths.filter(item => {
      const { keyPath } = item;
      const re = pathToRegexp(keyPath, [], { end: false });
      const result = re.exec(urlPath);
      return !!result;
    });
    const map = new Map();

    // 同等深度的节点，取路径最长（斜线最多而非字符串长度最长）的节点
    arr.forEach((road: KeyPathItem) => {
      if (!map.has(road.depth)) {
        const sameDepthArr = arr.filter((road2: KeyPathItem) => road2.depth === road.depth);
        map.set(road.depth, getMostEqualPath(sameDepthArr));
      }
    });

    const newArr = Array.from(map.values());

    // 按深度进行升序排列
    newArr.sort((a, b) => {
      return a.depth - b.depth;
    });

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
      const queryObj = queryToObject(searchStr, {});
      let forQuerySelectedKeys: string[] = [];
      // 如果有queries，需要针对性的做匹配
      if (target.queries) {
        // 只要地址栏中的query包含了配置的query，那么就会点亮
        const result = target.queries.filter((q: QueryRoad) => {
          const keys = Object.keys(q.key);
          if (keys.length === 0) return false;
          return keys.every((index: string) => index in queryObj);
        });
        if (result.length >= 1) {
          const theFirst = result[0];
          const searchStr = genSearchStr(theFirst.key);
          const keyPath = searchStr ? `${target.keyPath}?${searchStr}` : target.keyPath;
          forQuerySelectedKeys = [keyPath];
        }
      }
      obj.openKeys = newArr.map((n: KeyPathItem) => n.keyPath);
      obj.selectedKeys = forQuerySelectedKeys.length ? forQuerySelectedKeys : [target.keyPath];
    }
    keysUpdater({
      ...obj,
      openKeys: uniq([...keysRef.current.openKeys, ...obj.openKeys]),
    });
  };

  // 添加副作用代码
  useEffect(() => {
    analyzeUrlToKeys(props.location.pathname, props.location.search);
  }, [props.sider, props.location.pathname, props.location.search]);

  // 菜单项点击事件
  const handleItemClick = useMemo(
    () => (obj: { item: any; key: string; keyPath: string[] }) => {
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
  const handleSubMenuOpenChange = useMemo(
    () => (oks: string[]) => {
      keysUpdater({
        ...keysRef.current,
        openKeys: oks,
      });
    },
    [keysRef],
  );

  // 渲染menus
  // 这里没有放入useEffect和useLayoutEffect是为了在属性发生变化的第一次渲染就得到最新的元素;它们时机滞后，不合适
  const renderMenus = genRenderMenus(curContext, props.location.pathname);

  const { sider /* loadingStatus */, hasSider } = props;
  curContext.cachedElements = renderMenus(sider);
  curContext.cachedSider = sider;
  const { openKeys, selectedKeys } = keys;

  const [menuWidth, menuWidthUpdater] = useState(
    // style.siderWidth - (hasSider ? 2 * style.paddingOneSide : style.paddingOneSide),
    style.siderWidth - 2 * style.paddingOneSide,
  );

  const siderMenu = useRef(null);
  const siderMenuInfo = useRef({
    offsetWidth: 0,
    direction: 'right',
    dom: null,
  });

  const onScrollRight = useMemo(
    () => (container: Element) => {
      if (siderMenuInfo.current.offsetWidth === 0 && siderMenuInfo.current.dom) {
        siderMenuInfo.current.offsetWidth = siderMenuInfo.current.dom.offsetWidth;
      }
      let width = Number(menuWidth) + container.scrollLeft;
      const { scrollWidth } = siderMenuInfo.current.dom || { scrollWidth: 0 };
      if (width > scrollWidth) {
        width = scrollWidth;
      } else if (width === scrollWidth) {
        if (siderMenuInfo.current.direction === 'right') {
          menuWidthUpdater(width);
        }
        siderMenuInfo.current.direction = 'left';
      } else if (scrollWidth - width <= style.paddingOneSide) {
        if (siderMenuInfo.current.dom && siderMenuInfo.current.direction === 'right') {
          siderMenuInfo.current.dom.className = `${siderMenuInfo.current.dom.className} ${transform_16}`;
          // safari上需要加上1像素才能完全显示
          // todo 原因待查
          menuWidthUpdater(scrollWidth + 1);
        }
        siderMenuInfo.current.direction = 'left';
      } else {
        siderMenuInfo.current.direction = 'right';
      }
      if (siderMenuInfo.current.direction === 'right') {
        menuWidthUpdater(width);
      }
    },
    [],
  );

  const onScrollLeft = useMemo(
    () => (container: Element) => {
      if (siderMenuInfo.current.dom) {
        siderMenuInfo.current.dom.className = siderMenuInfo.current.dom.className.replace(transform_16, '');
      }
      if (siderMenuInfo.current.offsetWidth === 0 && siderMenuInfo.current.dom) {
        siderMenuInfo.current.offsetWidth = siderMenuInfo.current.dom.offsetWidth;
      }
      let width = Number(menuWidth) + container.scrollLeft;
      const { scrollWidth } = siderMenuInfo.current.dom || { scrollWidth: 0 };
      if (width > scrollWidth) {
        width = scrollWidth;
      } else if (width === scrollWidth) {
        if (siderMenuInfo.current.direction === 'left') {
          menuWidthUpdater(width);
        }
        siderMenuInfo.current.direction = 'right';
      } else {
        siderMenuInfo.current.direction = 'left';
      }
      if (siderMenuInfo.current.direction === 'left') {
        menuWidthUpdater(width);
      }
    },
    [],
  );

  useLayoutEffect(() => {
    siderMenuInfo.current.dom = ReactDOM.findDOMNode(siderMenu.current);
  }, []);

  const isReferral = props.location.pathname && props.location.pathname.startsWith('/referral');

  return (
    <Sider
      className={classnames('zyk-layout-sider', {
        'zyk-sub-sider-without-top-sider': !hasSider,
        'zyk-layout-sider-referral': isReferral,
      })}
      width={hasSider ? style.siderWidth : style.siderWidth - style.paddingOneSide}
    >
      <Scrollbar containerRef={getScrollContainer} onScrollRight={onScrollRight} onScrollLeft={onScrollLeft}>
        <Menu
          ref={siderMenu}
          className="zyk-sider-menu"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onClick={handleItemClick}
          onOpenChange={handleSubMenuOpenChange}
          mode="inline"
          style={{ minHeight: '100%', borderRight: 0, width: menuWidth }}
        >
          {curContext.cachedElements}
        </Menu>
      </Scrollbar>
    </Sider>
  );
};

export default SubLeftSider;
