import React, { Component, ReactNode, SyntheticEvent } from 'react';
import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import classNames from 'classnames';
import { isEmpty } from '@src/tools/util';
import styleLess from './index.less';

interface ClampProps {
  maxWidth?: number | string;
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
  styleName?: string;
  onClick?: (e: SyntheticEvent) => void;
  stopMouseLeavePropagation?: boolean;
  stopMouseEnterPropagation?: boolean;
  placement?: TooltipPlacement;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  onMouseLeave?: boolean;
  visibleForce?: boolean; // 不管什么场景， 强制显示 toolTip
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  line?: number; // 多行显示
  align?: { offset: number[] };
}

class Clamp extends Component<ClampProps> {
  state = {
    tipVisible: false,
  };

  contentNode: HTMLSpanElement = null;

  static defaultProps = {
    placement: 'topLeft',
    mouseEnterDelay: 0.3,
    mouseLeaveDelay: 0.3,
  };

  format = (width: string | number) => {
    const strWidth = String(width);
    if (strWidth.indexOf('%') !== -1) {
      return strWidth;
    }
    if (strWidth.indexOf('px') < 0) {
      return `${strWidth}px`;
    }
    return strWidth;
  };

  handleClick = (e: SyntheticEvent) => {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  handleVisibleChange = (v: boolean) => {
    const { maxWidth } = this.props;
    if (this.contentNode) {
      if (v) {
        const { line } = this.props;
        const isMultiLine = line && line > 1;
        const clientWidth = this.contentNode.getBoundingClientRect().width;
        const clientHeight = this.contentNode.getBoundingClientRect().height;
        this.contentNode.style.maxWidth = 'unset';
        this.contentNode.style.overflow = 'visible';
        if (isMultiLine) {
          this.contentNode.style.webkitLineClamp = 'unset';
        }
        const scrollWidth = this.contentNode.getBoundingClientRect().width;
        const scrollHeight = this.contentNode.getBoundingClientRect().height;
        this.contentNode.style.maxWidth = !isEmpty(maxWidth) ? this.format(maxWidth) : '100%';
        this.contentNode.style.overflow = 'hidden';
        if (isMultiLine) {
          this.contentNode.style.webkitLineClamp = `${line}`;
        }

        if (this.props.visibleForce) {
          this.setState({
            tipVisible: v && true,
          });
        } else if (!isMultiLine && clientWidth < scrollWidth) {
          this.setState({
            tipVisible: v,
          });
        } else if (isMultiLine && clientHeight < scrollHeight) {
          this.setState({
            tipVisible: v,
          });
        }
      } else if (!v) {
        this.setState({
          tipVisible: v,
        });
      }
    }
  };

  onMouseLeave = () => this.setState({ tipVisible: false });

  render() {
    const {
      label, maxWidth, className, line, children,
    } = this.props;
    const { tipVisible } = this.state;
    const formattedWidth = this.format(maxWidth);
    const isMultiLine = line && line > 1;
    const contentStyle: React.CSSProperties = {};
    if (maxWidth) {
      contentStyle.maxWidth = formattedWidth;
    }
    if (isMultiLine) {
      contentStyle.WebkitLineClamp = line;
      contentStyle.lineClamp = line;
    }
    return (
      <Tooltip
        mouseEnterDelay={this.props.mouseEnterDelay}
        mouseLeaveDelay={this.props.mouseLeaveDelay}
        getPopupContainer={this.props.getPopupContainer}
        visible={tipVisible}
        overlayClassName={classNames(styleLess['custom-tooltip'], this.props.overlayClassName)}
        title={
          <span
            className='clamp-inner-span'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children || label}
          </span>
        }
        onVisibleChange={this.handleVisibleChange}
        trigger="hover"
        placement={this.props.placement}
        align={this.props.align}
      >
        <span
          onMouseLeave={this.props.onMouseLeave && this.onMouseLeave}
          className={classNames(isMultiLine ? styleLess['line-content'] : styleLess.content, className, 'clamp-content')}
          style={contentStyle}
          onClick={this.handleClick}
          ref={(node) => {
            this.contentNode = node;
          }}
        >
          {children || label}
        </span>
      </Tooltip>
    );
  }
}

export default Clamp;
