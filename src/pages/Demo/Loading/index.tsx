import { FC } from 'react';
import { gluer, useModel } from 'femo';
import Scrollbar from '@/components/Scrollbar';
import { useHistory } from 'react-router-dom';

interface Props {

}

const nameModel = gluer('测试');
const Loading: FC<Props> = (_props) => {
  const [name] = useModel(nameModel);
  const history = useHistory();

  const jump = () => {
    history.push('/demo/femo');
  };

  return (
    <Scrollbar>
      <button onClick={jump}>跳转</button>
      <span>{name}</span>
    </Scrollbar>
  );
};

export default Loading;
