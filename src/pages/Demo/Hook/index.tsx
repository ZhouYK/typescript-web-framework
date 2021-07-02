import React, {
  FC, PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import { Button, Space } from 'antd';
import { safeCrash } from '@src/hocs';

interface Props {

}

const Hook: FC<Props> = (_props: PropsWithChildren<Props>) => {
  const [loading, updateLoading] = useState(false);
  const firstRenderFlag = useRef(true);
  const countRef = useRef(0);
  countRef.current += 1;
  if (countRef.current === 3) {
    countRef.current -= 2;
  }
  if (countRef.current === 2 && firstRenderFlag.current) {
    firstRenderFlag.current = false;
    updateLoading(true);
    console.log('更新了loading', 'countRef.current', countRef.current);
  }

  // 这些render之前的状态是最新的
  const testCallback = useCallback(() => {
    console.log('testCallback', countRef.current);
  }, [countRef.current]);

  testCallback();

  const [deps, updateDeps] = useState([{ name: 1 }, { name: 2 }]);

  // 依赖顺序的改变会触发内部回调的执行
  useEffect(() => {
    console.log('deps', deps);
  }, [...deps]);

  // render之后的状态，如果跳过了当次更新，则会保持原状。
  useEffect(() => {
    console.log('countRef.current', countRef.current);
  }, [countRef.current]);

  const onClick = useCallback(() => {
    updateDeps([...deps.reverse()]);
  }, []);

  const onUpdateClick = useCallback(() => {
    updateDeps([...deps]);
  }, [deps]);

  console.log('loading', loading);
  console.log('current', countRef.current);
  return (
    <Space>
      <Button onClick={onClick}>测试 reverse</Button>
      <Button onClick={onUpdateClick}>不改变顺序</Button>
    </Space>
  );
};

Hook.displayName = 'Hook';

export default safeCrash(Hook);
