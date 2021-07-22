import React, { FC, useCallback } from 'react';
import { gluer, useIndividualModel, useModel } from 'femo';

interface Props {

}

const nameModel = gluer('测试');
const Loading: FC<Props> = (_props) => {
  const getCount = useCallback(() => new Promise((resolve) => {
    setTimeout(() => resolve(200), 2000);
  }), []);

  const [count,,, { loading }] = useIndividualModel(0, [getCount]);
  const [name] = useModel(nameModel);
  console.log('loading：', loading, ' count：', count);
  return (
    <span>{count} {name}</span>
  );
};

export default Loading;
