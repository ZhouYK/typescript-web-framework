import Sub from '@/pages/Demo/Test/Sub';
import { Button } from 'antd';
import { FC, useRef, useState } from 'react';

interface Props {

}

const Test: FC<Props> = (props) => {
  const propsRef = useRef(props);

  console.log('Test', Object.is(props, propsRef.current));
  propsRef.current = props;
  const [, updateC] = useState(0);
  const onFresh = () => {
    updateC((prevC) => prevC + 1);
  };

  return (
    <>
      <Button onClick={onFresh} type='primary'>刷新</Button>
      <span>Test</span>
      <Sub />
    </>
  );
};

export default Test;
