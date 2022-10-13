import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import Scrollbar from '@/components/Scrollbar';
import style from './style.less';

interface Props extends ModalProps {
  getScrollDom?: (dom: HTMLElement) => void;
}
interface State {
  loading: boolean;
  topActive: boolean;
  bottomActive: boolean;
  prevProps?: Props;
}

const detectContent = (containerDom: HTMLElement | null): { topActive: boolean; bottomActive: boolean } | null => {
  if (!containerDom) return null;
  const { scrollTop, clientHeight, scrollHeight } = containerDom;
  if (scrollTop !== 0) {
    // 到底了
    if (clientHeight + scrollTop >= scrollHeight) {
      return {
        topActive: true,
        bottomActive: false,
      };
    }
    return {
      topActive: true,
      bottomActive: true,
    };
  }
  if (clientHeight >= scrollHeight) {
    return {
      topActive: false,
      bottomActive: false,
    };
  }

  if (clientHeight < scrollHeight) {
    return {
      topActive: false,
      bottomActive: true,
    };
  }
  return null;
};

class EnhancedModal extends React.Component<Props, State> {
  static defaultProps = {
    visible: false,
    maskClosable: false,
  };

  containerDom: HTMLElement | null = null;

  state = {
    loading: false,
    topActive: false,
    bottomActive: false,
  };

  mutationObserver: MutationObserver;

  handleYScroll = (): void => {
    this.applyDetectResult();
  };

  applyDetectResult = (): void => {
    const result = detectContent(this.containerDom);
    if (result) {
      this.setState(result);
    }
  };

  getContainerDom = (container: HTMLElement): void => {
    this.containerDom = container;
    if (this.props.getScrollDom) {
      this.props.getScrollDom(container);
    }
    this.applyDetectResult();
    if (this.containerDom) {
      // @ts-ignore
      const MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
      if (MutationObserver) {
        this.mutationObserver = new MutationObserver(() => {
          this.applyDetectResult();
        });
        this.mutationObserver.observe(this.containerDom, {
          childList: true,
          subtree: true,
        });
      }
    } else if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  };

  renderContent = (): ReactElement => (
    <Scrollbar containerRef={this.getContainerDom} onScrollY={this.handleYScroll}>
      {this.props.children}
    </Scrollbar>
  );

  render(): ReactElement {
    const { wrapClassName, ...restProps } = this.props;
    const newWrapClassName = classNames(style.enhancedModal, wrapClassName, 'ant-enhanced-modal', {
      'ant-enhanced-modal-top-active': this.state.topActive,
      'ant-enhanced-modal-bottom-active': this.state.bottomActive,
    });
    return (
      <Modal centered {...restProps} wrapClassName={newWrapClassName}>
        {this.renderContent()}
      </Modal>
    );
  }
}

export default EnhancedModal;
