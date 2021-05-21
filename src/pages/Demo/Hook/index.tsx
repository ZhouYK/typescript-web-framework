import React, {
  FC, PropsWithChildren, useCallback, useEffect, useState,
} from 'react';
import { Button, Space } from 'antd';
import { safeCrash } from '@src/hocs';

interface Props {

}

const Hook: FC<Props> = (_props: PropsWithChildren<Props>) => {
  const [deps, updateDeps] = useState([{ name: 1 }, { name: 2 }]);

  // 依赖顺序的改变会触发内部回调的执行
  useEffect(() => {
    console.log('deps', deps);
  }, [...deps]);

  const onClick = useCallback(() => {
    updateDeps([...deps.reverse()]);
  }, []);

  const onUpdateClick = useCallback(() => {
    updateDeps([...deps]);
  }, [deps]);

  return (
    <Space>
      <Button onClick={onClick}>测试 reverse</Button>
      <Button onClick={onUpdateClick}>不改变顺序</Button>
    </Space>
  );
};

Hook.displayName = 'Hook';

export default safeCrash(Hook);
