import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Flow } from '@src/pages/Three/Flow/interface';
import { useDerivedStateToModel, useIndividualModel } from 'femo';
import { Input } from 'antd';
import NodeSelect from '@src/pages/Three/Flow/NodeSelect';
import { getSafe } from '@src/tools/util';

interface Props {
  onChange?: (value: Flow.Case) => void;
  value?: Flow.Case;
}

const Condition: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { onChange } = props;
  const [, valueModel] = useIndividualModel(props.value);

  const [value] = useDerivedStateToModel(props, valueModel, (nextProps, _prevProps, state) => {
    if ('value' in nextProps) {
      return nextProps.value;
    }
    return state;
  });

  const onFormalChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const result = {
      ...value,
      formal: evt.target.value,
    };
    if (onChange) {
      onChange(result);
    } else {
      valueModel(result);
    }
  }, [onChange, value]);

  const onSelectChange = useCallback((n: Flow.Node) => {
    const result = {
      ...value,
      node: n,
    };
    if (onChange) {
      onChange(result);
    } else {
      valueModel(result);
    }
  }, [onChange, value]);

  return (
    <section>
      <section>
        <Input onChange={onFormalChange} value={getSafe(value, 'formal')} />
      </section>
      <section>
        <NodeSelect onSelectChange={onSelectChange} value={getSafe(value, 'node.id')} />
      </section>
    </section>
  );
};

export default Condition;
