import React, { FC, PropsWithChildren } from 'react';
import { FormItemProps, Form } from 'antd';
import Condition from '@src/pages/Three/Flow/Condition';

interface Props extends Omit<FormItemProps, 'children'>{

}

const ConditionField: FC<Props> = (props: PropsWithChildren<Props>) => (
    <Form.Item
      {...props}
    >
      <Condition />
    </Form.Item>
);

export default ConditionField;
