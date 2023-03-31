import React, { FC, useEffect, useState } from 'react';

interface Props {

}

const ClosureTest: FC<Props> = (_props) => {
  const [a, setA] = useState(0);

  console.log('outer a', a);
  useEffect(() => {
    setA((prevState) => prevState + 1);
    setTimeout(() => {
      console.log('timeout a', a);
    }, 1000);
  }, []);

  return (
    <>
      {a}
    </>
  );
};

export default ClosureTest;
