import { RoadMap, RoadMapType } from '@/config/interface';
import { Layout, Menu } from '@arco-design/web-react';
import { useDerivedState } from 'femo';
import React, { ReactElement, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CurContext, EXTERN_KEY_PREFIX, Props } from './interface';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;
const { Sider } = Layout;

const colapisble = (map: RoadMap[]) => !((map || []).find((r) => (r?.path ?? '').indexOf('/dep-hr') !== -1));

const EmptyIcon = (): null => null;

const LeftSider = (props: Props): ReactElement => {
  const {
    sider, currentRoad,
  } = props;
  const [collapsed, updateCollapsed] = useState(false);
  const onCollapse = useCallback((colla: boolean) => {
    updateCollapsed(colla);
  }, []);

  const [curContext] = useState((): CurContext => ({
    cachedElements: [],
  }));

  const history = useHistory();

  const renderMenus = (menus: RoadMap[]): ReactElement[] => menus.map((item): ReactElement => {
    let elements = null;
    if (item.type === RoadMapType.living) {
      const IconComponent = item.icon || EmptyIcon;
      if (item.hasLivingRoadInSubRoads) {
        elements = (
          <SubMenu title={ <span><IconComponent /> item.name</span>} key={item.completePath}>
            {renderMenus(item.subRoads)}
          </SubMenu>
        );
        // 跳转到非系统内的页面的链接，渲染一个 a 标签
      } else if (item.externUrl) {
        elements = (
          <MenuItem key={`${EXTERN_KEY_PREFIX}-${item.externUrl}`}>
            <IconComponent />
            <a href={item.externUrl} rel="noopener noreferrer" {...item.externProps || {}}>
              {item.name}
            </a>
          </MenuItem>
        );
      } else {
        elements = (
          <MenuItem
            onClick={(): void => {
              history.push(item.completePath);
            }}
            key={item.completePath}
            title={item.name}
          >
            <IconComponent />
            {item.name}
          </MenuItem>
        );
      }
    }
    return elements;
  });

  useDerivedState(() => {
    curContext.cachedElements = renderMenus(sider);
  }, [sider]);

  // 菜单状态
  const [keys, keysModel] = useDerivedState((state) => {
    const { type } = currentRoad;
    const openKeys = [];
    let current = currentRoad.parent;
    let selectedKeys: string[] = [];
    const isLiving = type === RoadMapType.living;
    if (isLiving) {
      selectedKeys = [currentRoad.completePath];
    }
    while (current) {
      openKeys.unshift(current.completePath);
      if (!isLiving) {
        if (current.type === RoadMapType.living && selectedKeys.length === 0) {
          selectedKeys = [current.completePath];
        }
      }
      current = current.parent;
    }
    const obj: {
      openKeys: string[];
      selectedKeys: string[];
    } = {
      openKeys,
      selectedKeys,
    };
    return {
      ...obj,
      openKeys: Array.from(new Set([...(state?.openKeys ?? []), ...obj.openKeys])),
    };
  }, [sider, currentRoad]);

  // 菜单项点击事件
  const handleItemClick = useCallback(
    (obj: { item: any; key: string; keyPath: string[] } & any): any => {
      const key: string = obj?.key ?? '';
      if (key.startsWith(`${EXTERN_KEY_PREFIX}-`)) {
        return;
      }
      // 避免重复渲染，此处采用静默更新
      // 菜单项自身会 history.push
      keysModel.silent((_d, state) => ({
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

  const backHome = () => {
    history.push('/');
  };

  const { openKeys, selectedKeys } = keys;

  return (
    <Sider
      collapsible={colapisble(sider)}
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <div>logo</div>
      <Menu
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onClick={handleItemClick}
        onClickSubMenu={handleSubMenuOpenChange}
      >
        {curContext.cachedElements}
      </Menu>
    </Sider>
  );
};

export default LeftSider;
