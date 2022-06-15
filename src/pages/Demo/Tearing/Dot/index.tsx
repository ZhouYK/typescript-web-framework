import React, { FC } from 'react';
import model from '../model';

interface Props {
  color?: string;
}

const Dot: FC<Props> = (_props) => {
  // const { color } = props;
  console.log('Dot color', `I am ${model()}`);
  return (
    <section style={{
      background: `${model()}`, width: '20px', height: '20px', borderRadius: '50%', float: 'left',
    }} />
  );
};

export default Dot;
