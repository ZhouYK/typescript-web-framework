import React from 'react';
import { withRouter } from 'react-router';
import { FailedPage, Mode } from '../../FOF';
import { getPagesRoadMap } from '../../../pages/pagesRoadMap';
import { basename } from '../../../runtime/env';
import { captureException } from '../../../utils/util';

const FailedPageWithRouter = withRouter(FailedPage);

const isolatePage = (WrappedComponent: React.ComponentClass<any> | React.FC<any>) => {
  interface State {
    hasError: boolean;
  }

  return class IsolatedComponent extends React.Component<any> {
    state: State = {
      hasError: false,
    };

    static getDerivedStateFromError(_error: any) {
      return {
        hasError: true,
      };
    }

    componentDidCatch(error: any, _info: any) {
      // console.log(error, info);
      // 手动上报错误异常
      captureException(error);
    }

    backToHome = (_e: any, homeUrl: string) => {
      if (homeUrl) {
        window.location.href = `${basename}${homeUrl}`;
      }
    };

    render() {
      if (this.state.hasError) {
        return (
          <FailedPageWithRouter backToHome={this.backToHome} getPagesRoadMap={getPagesRoadMap} mode={Mode.exception} />
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default isolatePage;
