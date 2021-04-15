import React, { FC, PropsWithChildren } from 'react';
import { Flow } from '@src/pages/Three/Flow/interface';
import {Button, Form, InputNumber} from 'antd';
import fieldNames from './fieldNames';

interface Props {
  saveItem?: (item: Flow.Node) => void;
  node: Flow.Node;
}

const NodeForm: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { node } = props;
  const [form] = Form.useForm();

  return (
    <section>
      <h4>{ node.name }</h4>
      <Form
        form={form}
        hideRequiredMark
        colon={false}
      >
        <Form.Item
          name={fieldNames.time_point}
          label='控制时间点'
          rules={[{
            required: true,
            message: '请输入（秒）',
          }]}
          initialValue={node.time_point}
        >
          <InputNumber min={1}/>
        </Form.Item>
        <Form.Item
          label='判断条件'
        >
         <>
           <>
             {  }
           </>
           <Button>添加</Button>
         </>
        </Form.Item>
      </Form>
    </section>
  );
};

export default NodeForm;
