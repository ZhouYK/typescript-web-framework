import React, {
  FC, PropsWithChildren, useCallback, useState,
} from 'react';
import { SelectProps, Select } from 'antd';
import { Flow } from '@src/pages/Three/Flow/interface';
import listModel from '../ListNode/model';

interface Props extends Omit<SelectProps<any>, 'onSelect'> {
  onSelectChange: (node: Flow.Node) => void;
}

const NodeSelect: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { onSelectChange, ...rest } = props;
  const [list] = useState(() => listModel());

  const onSelect = useCallback((key: any) => {
    const target = list.find((n) => key === n.id);
    onSelectChange(target);
  }, [onSelectChange]);

  return (
    <Select
      placeholder='请选择'
      onSelect={onSelect}
      {...rest}
    >
      {
        list.map((node) => (
            <Select.Option value={node.id} key={node.id}>
              { node.name }
            </Select.Option>
        ))
      }
    </Select>
  );
};

export default NodeSelect;
