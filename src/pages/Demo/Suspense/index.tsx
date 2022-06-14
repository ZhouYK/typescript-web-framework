import Container from '@src/pages/Demo/Suspense/Container';
import React, {
  Suspense, FC, useState, useRef,
} from 'react';
import Child from './Child';

interface Props {

}

const SuspenseTest: FC<Props> = () => {
  const [a, updateA] = useState(0);
  const [b, updateB] = useState(0);
  const divRef = useRef();

  const onClick = () => {
    updateA((preA) => preA + 1);
  };

  const onStop = () => {
    updateB((prevB) => prevB + 1);
  };

  return (
    <>
      <div ref={divRef} />
      <button onClick={onClick}>发起请求</button>
      <button onClick={onStop}>停止请求</button>
      <Suspense fallback={<Container container={divRef.current}>我是占位样式</Container>}>
        <Child a={a} b={b} />
      </Suspense>
    </>
  );
};

export default SuspenseTest;
