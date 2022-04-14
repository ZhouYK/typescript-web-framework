import { FC, useRef } from 'react';

interface Props {

}

const Sub: FC<Props> = (props) => {
  const propsRef = useRef(props);
  console.log('Sub', Object.is(props, propsRef.current), props);
  propsRef.current = props;
  return <span>Sub</span>;
};

export default Sub;
