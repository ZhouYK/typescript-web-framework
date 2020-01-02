import React, { ReactElement } from 'react';
import { get } from 'lodash';

interface Props {
  getButtonRef?: (ref: any) => void;
  children: ReactElement;
  componentDidMount?: () => void;
  componentWillUnmount?: () => void;
}
class WrapButton extends React.Component<Props> {
  static namespace = 'WrapButton';

  static getDerivedStateFromProps(nextProps: Props): void {
    if (!React.Children.only(nextProps.children)) {
      throw new Error('Accept only one child');
    }
    if (!React.isValidElement(nextProps.children)) {
      throw new Error('Accept react element');
    }
    return null;
  }

  componentDidMount(): void {
    if (this.props.componentDidMount) {
      this.props.componentDidMount();
    }
  }

  componentWillUnmount(): void {
    if (this.props.componentWillUnmount) {
      this.props.componentWillUnmount();
    }
  }

  render() {
    const ref = (ref: any) => {
      const refFnc = get(this.props, 'children.props.ref');
      if (refFnc) {
        refFnc(ref);
      }
      const { getButtonRef } = this.props;
      if (getButtonRef) {
        getButtonRef(ref);
      }
    };
    const { children, ...restProps } = this.props;
    return React.cloneElement(children, { ...children.props, ...restProps, ref });
  }
}

export default WrapButton;
