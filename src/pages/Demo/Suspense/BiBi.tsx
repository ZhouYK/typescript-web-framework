import React, { FC, useEffect, useState } from 'react';
import useSWR from 'swr';
import Test from '@src/pages/Demo/Suspense/Test';
import CiCi from '@src/pages/Demo/Suspense/CiCi';

interface Props {

}

const BiBi: FC<Props> = (props) => {
  const [b, updateB] = useState(Date.now());
  // console.log('b', b);
  // const { data } = useSWR('/api/123', () => new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('测试bibi');
  //   }, 2000);
  // }), {
  //   suspense: true,
  // });'
  useEffect(() => {
    console.log('BiBi挂载');
  }, []);
  return <span>BiBi <CiCi>
          <Test />
        </CiCi></span>;
};

export default BiBi;
