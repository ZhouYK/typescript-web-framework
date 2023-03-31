import React, { useRef, useState } from 'react';

const useOrderTest = (value: 0 | 1) => {
  const flagRef = useRef(false);
  console.log('flagRef', flagRef.current);
  if (flagRef.current) {
    return;
  }
  flagRef.current = true;
  const [, updateCount] = useState(0);
  if (value === 0) {
    updateCount((prevCount) => prevCount + 1);
  }
  if (value === 1) {
    updateCount((prevCount) => prevCount - 1);
  }
};
const HookOrderTest = () => {
  const [count, setCount] = useState<0 | 1>(0);
  useOrderTest(count);
  return (
    <section onClick={() => {
      setCount((prevCount) => {
        if (prevCount === 0) return 1;
        return 0;
      });
    }} >测试</section>
  );
};

export default HookOrderTest;
