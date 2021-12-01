import React from 'react';
import sentry from '@src/tools/sentry';
import Failed from '@src/components/Failed';

interface Props {
  fallback?: (error: any) => React.ReactElement | React.ReactNode;
}

interface State {
  hasError: boolean;
  text?: string;
  error?: any;
}
class Crash extends React.Component<Props, any> {
  state: State = {
    hasError: false,
    text: '页面崩溃了，请稍后重试...',
    error: null,
  };

  static getDerivedStateFromError(error: any): any {
    const errorStr = String(error);
    const tmpState: State = {
      hasError: true,
      error,
    };
    if (errorStr.startsWith('ChunkLoadError')) {
      tmpState.text = '网络出现问题，请刷新页面重试';
    }
    return tmpState;
  }

  componentDidCatch(error: any, _info: any): void {
    // console.log(error, info);
    // 手动上报错误异常
    sentry.reportError(error);
  }

  render(): any {
    if (this.state.hasError && !this.props.fallback) {
      return (
        <Failed text={this.state.text}/>
      );
    }
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback(this.state.error);
    }

    return (
      <>
        {this.props.children}
      </>
    );
  }
}

export default Crash;
