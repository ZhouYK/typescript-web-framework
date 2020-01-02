import { Dropdown, Button, Menu } from '@zyk/components';
import React, { ReactElement, ReactNode } from 'react';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import { get, isArray, throttle } from 'lodash';
import WrapButton from './WrapButton';
import * as style from './style.less';
import DotMoreIcon from '../../assets/svg/dot_more.svg';
import TalentLock from '../TalentLock';

interface Props {
  className?: string;
  children?: any[];
  containerScrollBarDom?: HTMLElement;
}

interface State {
  dropdownVisible: boolean;
  children: ReactElement[];
  preProps?: Props;
  count: number;
}

type MapValue = [number, any];

class AdjustButtons extends React.Component<Props, State> {
  static WrapButton = WrapButton;

  childrenDomMap: Map<number, Element | Text> = new Map();

  collChildrenDom: ReactElement = null;

  containerDom: HTMLDivElement = null;

  state: State = {
    dropdownVisible: false,
    children: [],
    count: 0,
  };

  static getDerivedStateFromProps(nextProps: Props, nextState: State) {
    if (!('preProps' in nextState) || nextState.preProps.children !== nextProps.children) {
      return {
        children: nextProps.children,
        preProps: nextProps,
      };
    }
    return null;
  }

  handleVisibleChange = (visible: boolean) => {
    this.setState({
      dropdownVisible: visible,
    });
  };

  processFnc = () => {
    if (this.containerDom) {
      const containerOffsetWidth = this.containerDom.offsetWidth;
      const count = this.childrenDomMap.size;
      // 默认加上更多按钮的宽度和外边距
      let childrenWidth = Number(style.moreBtnWidth) + Number(style.marginRight);
      let splitIndex: number = count;
      if (this.state.count === 0) {
        return;
      }
      // @ts-ignore
      const childrenDomMapArr = Array.from(this.childrenDomMap).sort((prev: MapValue, next: MapValue) => {
        return prev[0] - next[0];
      });
      const mapChildrenDomReactElement: MapValue[] = [];
      const childrenElementArr = isArray(this.props.children) ? this.props.children : [this.props.children];
      // this.childrenDomMap 中的是实际挂载的，需要重新序列化，并依据存储的key从this.props.children中找到目标reactElement
      // 从而获取到最终显示出来的按钮
      childrenDomMapArr.forEach((value: MapValue, index: number) => {
        mapChildrenDomReactElement.push([value[0], childrenElementArr[value[0]]]);
        const scrollWidth = get(value[1], 'scrollWidth', 0) || 0;
        const sum = index + 1 === count ? scrollWidth : scrollWidth + Number(style.marginRight);
        childrenWidth += sum;
        if (childrenWidth > containerOffsetWidth && splitIndex === count) {
          splitIndex = index;
        }
      });

      const collButtons = mapChildrenDomReactElement.slice(splitIndex).map((value: MapValue) => value[1]);
      const fakeChildrenElementArr = new Array(childrenElementArr.length);
      mapChildrenDomReactElement.slice(0, splitIndex).forEach((value: MapValue) => {
        // eslint-disable-next-line prefer-destructuring
        fakeChildrenElementArr[value[0]] = value[1];
      });
      const isInvalid = (child: any) => {
        return (
          Object.is(child, false) ||
          Object.is(child, true) ||
          Object.is(child, null) ||
          Object.is(child, undefined) ||
          Object.is(child, '')
        );
      };
      const isAllInvalid = () => {
        return collButtons.every((child: any) => {
          return isInvalid(child);
        });
      };
      if (collButtons.length !== 0 && !isAllInvalid()) {
        const innerChildren = (
          <Menu className={style.adjustMoreMenu}>
            {collButtons.map((child: ReactElement) => {
              let tempChild = child;
              let disabled = false;
              // 针对收起来的人才锁，做特殊处理
              if (React.isValidElement(child) && child.type === TalentLock) {
                // @ts-ignore
                tempChild = React.cloneElement(child, {
                  ...child.props,
                  placement: 'left',
                  wrapperClassName: classnames(child.props.wrapperClassName, 'talent-lock-btn-wrap-in-dot'),
                });
                disabled = true;
              }
              if (isInvalid(tempChild)) return tempChild;
              return (
                <Menu.Item disabled={disabled} key={get(tempChild, 'key')}>
                  {tempChild}
                </Menu.Item>
              );
            })}
          </Menu>
        );
        this.collChildrenDom = this.renderMoreBtn(innerChildren);
      }
      fakeChildrenElementArr.push(this.collChildrenDom);
      this.setState({
        children: fakeChildrenElementArr,
      });
    }
  };

  responseWindowResize = throttle(() => {
    this.collChildrenDom = null;
    this.setState(
      {
        children: null,
      },
      () => {
        this.setState({
          children: this.props.children,
        });
      },
    );
  }, 60);

  componentDidMount(): void {
    this.processFnc();
    window.addEventListener('resize', this.responseWindowResize);
  }

  componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (prevState.count !== this.state.count) {
      this.processFnc();
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.responseWindowResize);
  }

  renderMoreBtn = (overlay: ReactNode) => {
    return (
      <Dropdown
        overlay={overlay}
        overlayClassName={style.overlayClassName}
        trigger={['click']}
        onVisibleChange={this.handleVisibleChange}
        getPopupContainer={(node: HTMLElement) => this.props.containerScrollBarDom || node.parentElement}
      >
        <Button className="adjust-more-btn">
          <DotMoreIcon />
        </Button>
      </Dropdown>
    );
  };

  enhanceChildren = () => {
    // @ts-ignore
    const cloneElement = (children: ReactElement, index: number): any => {
      if (React.isValidElement(children)) {
        const childType = get(children, 'type');
        const namespace = get(childType, 'namespace');
        const props: any = { ...children.props };
        if (namespace === WrapButton.namespace) {
          // @ts-ignore
          props.getButtonRef = (ref: any) => {
            this.childrenDomMap.set(index, ReactDom.findDOMNode(ref));
          };
          props.componentDidMount = () => {
            this.setState((prevState: State) => {
              return {
                count: prevState.count + 1,
              };
            });
          };
          props.componentWillUnmount = () => {
            this.setState((prevState: State) => {
              this.childrenDomMap.delete(index);
              return {
                count: prevState.count - 1,
              };
            });
          };
          return React.cloneElement(children, { ...props });
        }

        // @ts-ignore
        return React.cloneElement(children, { ...props, children: cloneElement(children.props.children, index) });
      }
      if (!isArray(children)) return children;
      return React.Children.map(children, (child: ReactElement) => {
        return cloneElement(child, index);
      });
    };
    // @ts-ignore
    return React.Children.map(this.state.children, (child: ReactElement, index: number) => {
      return cloneElement(child, index);
    });
  };

  getContainerRef = (dom: HTMLDivElement) => {
    this.containerDom = dom;
  };

  render() {
    const children = this.enhanceChildren();
    // @ts-ignore
    return (
      <div ref={this.getContainerRef} className={classnames(style.adjustButtons, this.props.className)}>
        {children}
      </div>
    );
  }
}

export default AdjustButtons;
