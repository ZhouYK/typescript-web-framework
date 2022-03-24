import { Button } from 'antd';
import { useIndividualModel } from 'femo';
import {
  FC, useCallback, useRef,
} from 'react';

interface Props {

}

const n = 100000;

const Benchmark: FC<Props> = (_props) => {
  const [, countModel] = useIndividualModel(0);
  const startFlag = useRef(0);
  const endFlag = useRef(0);

  const onClick = useCallback(() => {
    startFlag.current = Date.now();
    for (let i = 0; i < n; i += 1) {
      if (i < (n - 1)) {
        countModel.silent(i + 1);
      } else {
        countModel(i + 1);
      }
    }
    endFlag.current = Date.now();
  }, []);

  return (
    <section>
      <section>
        <Button type='primary' onClick={onClick}>开始</Button>
      </section>
      <section style={{ display: 'flex' }}>
          <section>
          <section>未重构</section>
          <section>{countModel()}</section>
          <section>
            耗时：{ (endFlag.current - startFlag.current) / 1000 }
          </section>
          </section>
      </section>
    </section>
  );
};

export default Benchmark;
