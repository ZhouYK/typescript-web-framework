import React, { FC, PropsWithChildren } from 'react';
import { Form, FormItemProps } from 'antd';
import TimePoint from '@src/pages/Three/Flow/components/TimePoint';
import { Flow } from '@src/pages/Three/Flow/interface';

interface Props extends Omit<FormItemProps, 'children'> {
  node: Flow.Node;
}

const TimePointField: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { node, ...rest } = props;
  return (
    <Form.Item
      {...rest}
    >
      <TimePoint node={node} />
    </Form.Item>
  );
};

export default TimePointField;
