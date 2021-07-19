import React, { FC, useCallback, useState } from 'react';
import { Button } from 'antd';

interface Props {

}

const UpdateState: FC<Props> = (_props) => {
  const [name, updateName] = useState('');
  const [age, updateAge] = useState(0);

  const onClick = useCallback(() => {
    updateName(`${Date.now()}`);
    updateAge(Date.now());
  }, []);
  console.log('点击一次，执行了多少次', name, age);
  return (
    <Button onClick={onClick}>点我</Button>
  );
};

export default UpdateState;
