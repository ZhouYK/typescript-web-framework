import React from 'react';
import sentry from '@src/tools/sentry';
import Failed from '@src/components/Failed';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface Props extends RouteComponentProps {
}

interface State {
  hasError: boolean;
  text?: string;
}
class CrashPage extends React.Component<Props, any> {
  state: State = {
    hasError: false,
    text: '页面崩溃了，请稍后重试...',
  };

  static getDerivedStateFromError(error: any): any {
    const errorStr = String(error);
    const tmpState: State = {
      hasError: true,
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
    if (this.state.hasError) {
      return (
        <Failed text={this.state.text}/>
      );
    }
    return this.props.children;
  }
}

export default withRouter(CrashPage);
