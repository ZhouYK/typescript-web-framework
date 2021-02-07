import React, { CSSProperties, FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import LoadingSVG from '@src/assets/svg/loading.svg';
import styleLess from './style.less';

interface Props {
  className?: string;
  size?: number;
  style?: CSSProperties;
  type?: 'small' | 'default' | 'mid' | 'large';
}

const Spinner: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    className, style,
  } = props;
  return (
    <section style={style} className={classNames(styleLess.spinner, className)}>
      <section className='spinner-wrap'>
        <LoadingSVG />
      </section>
    </section>
  );
};

Spinner.defaultProps = {
  type: 'default',
};

export default Spinner;
