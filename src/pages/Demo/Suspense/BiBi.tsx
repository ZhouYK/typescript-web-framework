import React, { FC, useState } from 'react';
import useSWR from 'swr';

interface Props {

}

const BiBi: FC<Props> = () => {
  const [b, updateB] = useState(Date.now());
  // console.log('b', b);
  // const { data } = useSWR('/api/123', () => new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('测试bibi');
  //   }, 2000);
  // }), {
  //   suspense: true,
  // });
  return <span>BiBi</span>;
};

export default BiBi;
