import React from 'react';
import { Button } from '@zyk/components';
import intl from 'react-intl-universal';
import { get } from 'lodash';
import { RouteComponentProps } from 'dva/router';
import './index.less';
import F00 from '../../assets/svg/404.svg';
import FailedSvg from '../../partialPageEntry/bridge/video/assets/svg/failed.svg';

import { RoadMap } from '../../pages/model/pagesRoadMap';

export enum Mode {
  default = 'default',
  exception = 'exception',
}

export interface Props extends RouteComponentProps {
  getPagesRoadMap?: () => RoadMap[];
  homeUrl?: string;
  backToHome?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, homeUrl?: string) => void;
  mode?: Mode;
}

interface State {
  homeUrl: string;
}

export class FailedPage extends React.Component<Props, State> {
  state = {
    homeUrl: '',
  };

  static defaultProps = {
    mode: Mode.default,
  };

  static getDerivedStateFromProps(nextProps: Props) {
    if ('homeUrl' in nextProps) {
      return {
        homeUrl: nextProps.homeUrl,
      };
    }
    return null;
  }

  backToHome = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (this.props.backToHome) {
      this.props.backToHome(e, this.state.homeUrl);
    } else {
      e.preventDefault();
      this.props.history.push(this.state.homeUrl);
    }
  };

  matchSystem = (road: RoadMap) => {
    const pathname = get(this.props, 'location.pathname') || '';
    return pathname === road.path || pathname.startsWith(`${road.path}/`);
  };

  getPagesRoadMap = () => {
    try {
      return (this.props.getPagesRoadMap && this.props.getPagesRoadMap()) || [];
    } catch (e) {
      // console.log(e)
    }
    return [];
  };

  componentDidMount(): void {
    // 遍历pagesRoadMap的第一层，获取到path，作为系统区分
    const pagesRoadMap: RoadMap[] = this.getPagesRoadMap();
    const collectSystemPath = pagesRoadMap.find((road: RoadMap) => this.matchSystem(road));
    this.setState({
      homeUrl: get(collectSystemPath, 'homeUrl', '') || '',
    });
  }

  divideAction = {
    [Mode.default]: {
      getImg: () => <F00 />,
      getMessage: () => intl.get('FourXXMessage'),
      getAction: () => intl.get('FourXXAction'),
    },
    [Mode.exception]: {
      getImg: () => <FailedSvg />,
      getMessage: () => intl.get('MessageHttpError'),
      getAction: () => '',
    },
  };

  render() {
    const anchorProps = {
      herf: `/zyk${this.state.homeUrl}`,
    };

    const target = this.divideAction[this.props.mode] || this.divideAction[Mode.default];

    return (
      <div styleName="fourxxPage">
        <div className="fourxxPage-content">
          <div className="fourxxPage-image">{target.getImg()}</div>
          <p>{target.getMessage()}</p>
          <p>{target.getAction()}</p>
          {this.state.homeUrl ? (
            <div className="fourxxPage-homeButton">
              <a {...anchorProps} onClick={this.backToHome}>
                <Button type="primary">{intl.get('FourXXButton')}</Button>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default (props: Props) => {
  return (innerProps: RouteComponentProps) => <FailedPage {...props} {...innerProps} />;
};
