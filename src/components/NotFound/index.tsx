import { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import NotFoundSVG from '@/assets/svg/404.svg';
import style from './style.less';

interface Props {
  className?: string;
  text?: any;
}

const NotFound: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { className, text } = props;

  return (
    <section className={classNames(style.notFound, className)}>
      <section className='failed-content'>
        <section className='svg-container'>
          <NotFoundSVG />
        </section>
        <section className='tip-desc'>
          {text}
        </section>
      </section>
    </section>
  );
};

NotFound.defaultProps = {
  text: '页面不存在，请检查页面链接是否正确',
};

export default NotFound;
