import React, { ReactNode } from 'react';
import ShareIcon from '../../assets/svg/share.svg';
import style from './style.less';

interface Props {
  name?: string;
  icon?: ReactNode;
}

class InnerTitle extends React.Component<Props> {
  static defaultProps = {
    icon: <ShareIcon />,
  };

  render() {
    return (
      <span className={style.innerTitle}>
        <span className="subsider-inner-title-name">{this.props.name}</span>
        <span className="subsider-inner-title-icon">{this.props.icon}</span>
      </span>
    );
  }
}

export default InnerTitle;
