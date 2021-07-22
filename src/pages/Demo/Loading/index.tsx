import React, { FC, useCallback } from 'react';
import { useIndividualModel } from 'femo';

interface Props {

}

const Loading: FC<Props> = (_props) => {
  const getCount = useCallback(() => new Promise((resolve) => {
    setTimeout(() => resolve(200), 2000);
  }), []);

  const [count,,, { loading }] = useIndividualModel(0, [getCount]);

  console.log('loading：', loading, ' count：', count);
  return (
    <span>{count}</span>
  );
};

export default Loading;
