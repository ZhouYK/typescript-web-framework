import React, {
  FC, useState,
} from 'react';
import useSWR from 'swr';

interface Props {

}

let count = 0;
const a = () => new Promise((_resolve, reject) => {
  setTimeout(() => {
    reject('测试test');
  }, 4000);
});
const Test: FC<Props> = (props) => {
  const [test] = useState(Date.now());
  // const { data } = useSWR('/api/123', () => new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve('测试test');
  //   }, 2000);
  // }), {
  //   suspense: true,
  // });
  console.log('test before', test);
  if (count === 0) {
    count += 1;
    throw a();
  }
  console.log('test after', test);
  return <span>Test{test}</span>;
  // console.log('Test');
  // return <span>Test</span>;
};

export default Test;
