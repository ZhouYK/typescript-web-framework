import model from '@src/pages/Demo/Tearing/model';
import { useDerivedState, useModel } from 'femo';
import React, { FC, useRef } from 'react';
import Dot from './Dot';

interface Props {

}

const count = 1000;

const Tearing: FC<Props> = (_props) => {
  const gapRef = useRef(0);
  useModel(model);
  const [children] = useDerivedState(() => {
    const arr = [];
    for (let i = 0; i <= count; i += 1) {
      arr.push(
        <Dot key={i} />,
      );
    }
    return arr;
  }, [model]);

  const onClick = () => {
    console.log('gap', Date.now() - gapRef.current);
    if (Date.now() - gapRef.current > 300) {
      console.log('单击');
      model((_d, s) => {
        let r = s;
        if (s === 'blue') {
          r = 'red';
        }
        if (s === 'red') {
          r = 'blue';
        }
        console.log('r', r);
        return r;
      });
    } else {
      console.log('双击');
      model.silent((_d, s) => {
        let r = s;
        if (s === 'blue') {
          r = 'red';
        }
        if (s === 'red') {
          r = 'blue';
        }
        console.log('r', r);
        return r;
      });
    }
    gapRef.current = Date.now();
  };

  return (
    <section>
      <section>
        <button onClick={onClick}>点击</button>
      </section>
      <section>
        {
          children
        }
      </section>
    </section>
  );
};

export default Tearing;
