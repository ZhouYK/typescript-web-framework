import { FC } from 'react';
import Spinner from '@/components/Spinner';
import styleLess from './style.less';

interface Props {
  size?: number;
  style?: { [index: string]: any };
}
const PageLoading: FC<Props> = (props: Props) => {
  const { style } = props;
  return (
    <section style={style} className={styleLess.page}>
      <Spinner {...props} />
    </section>
  );
};

export default PageLoading;
