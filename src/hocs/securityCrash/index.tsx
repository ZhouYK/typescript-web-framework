import React from 'react';
import sentry from '@src/tools/sentry';
import Failed from '@src/components/Failed';

interface State {
  hasError: boolean;
  text?: string;
}
const securityCrash = <P, _>(TargetComponent: React.ComponentType<P>) => class SecurityCrash extends React.Component<P, any> {
    state: State = {
      hasError: false,
      text: '页面崩溃了，请稍后重试...',
    };

    getDerivedStateFromError(error: any) {
      const errorStr = String(error);
      const tmpState: State = {
        hasError: true,
      };
      if (errorStr.startsWith('ChunkLoadError')) {
        tmpState.text = '网络出现问题，请刷新页面重试';
      }
      return tmpState;
    }

    componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
      sentry.reportError(error);
    }

    render() {
      if (this.state.hasError) {
        return (
          <Failed text={this.state.text} />
        );
      }
      return <TargetComponent {...this.props} />;
    }
};

export default securityCrash;
