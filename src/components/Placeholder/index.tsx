import React, { FC, PropsWithChildren, ReactElement } from 'react';
import style from './style.less';

interface Props {
  text?: string;
}

const Placeholder: FC<Props> = (props: PropsWithChildren<Props>): ReactElement => <span className={style.empty}>{props.text}</span>;

Placeholder.defaultProps = {
  text: '--',
};
export default Placeholder;
