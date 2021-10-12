import React, { FC, useEffect, useState } from 'react';
import Test from '@src/pages/Demo/Suspense/Test';

interface Props {

}

// let count = 0;
const CiCi: FC<Props> = (props) => {
  const [c, updateC] = useState(Date.now());
  console.log('cici before');
  // if (count === 0) {
  //   count += 1;
  //   throw new Promise((resolve) => {
  //     setTimeout(resolve, 2000);
  //   });
  // }
  console.log('cici after');
  return (
    <span>
      cici: {c}
      {
        props.children
      }
    </span>
  );
};

export default CiCi;
