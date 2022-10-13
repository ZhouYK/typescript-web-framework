import { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import FailedSvg from '@/assets/svg/failed.svg';
import style from './style.less';

interface Props {
  className?: string;
  text?: any;
}

const Failed: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { className, text } = props;

  return (
    <section className={classNames(style.failed, className)}>
      <section className='failed-content'>
        <section className='svg-container'>
          <FailedSvg />
        </section>
        <section className='tip-desc'>
          {text}
        </section>
      </section>
    </section>
  );
};

Failed.defaultProps = {
  text: '系统出现异常，请稍后重试...',
};

export default Failed;
