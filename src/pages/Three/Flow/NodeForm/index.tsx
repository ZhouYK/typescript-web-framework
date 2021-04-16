import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Flow } from '@src/pages/Three/Flow/interface';
import { Button, Form, InputNumber } from 'antd';
import ConditionField from '@src/pages/Three/Flow/Fields/Condition';
import { getSafe } from '@src/tools/util';
import { useDerivedStateToModelFromProps, useIndividualModel } from 'femo';
import fieldNames from '../Fields/fieldNames';

export interface Props {
  saveItem?: (item: Flow.Node) => void;
  node: Flow.Node;
}

const NodeForm: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { node, saveItem } = props;
  const [form] = Form.useForm();

  const [, casesModel] = useIndividualModel<Flow.Case[]>(getSafe(node, 'switch_case') || []);
  const [cases] = useDerivedStateToModelFromProps(props, casesModel, (nextProps, prevProps, state) => {
    if (nextProps.node !== prevProps.node) {
      return getSafe(nextProps, 'node.switch_case') || [];
    }
    return state;
  });

  const addCase = useCallback(() => {
    casesModel((_, state) => [...state, {
      formal: '',
      node: null,
    }]);
  }, [casesModel]);

  const onSaveForm = useCallback(() => {
    form.validateFields().then((res) => {
      const conditions: Flow.Case[] = [];
      const result: any = {
        ...node,
      };
      Object.keys(res).forEach((key) => {
        if (key.startsWith(fieldNames.condition)) {
          conditions.push(res[key]);
        } else {
          result[key] = res[key];
        }
      });
      result.switch_case = conditions;
      saveItem(result);
    });
  }, [form, node, saveItem]);

  return (
    <section>
      <h4>{ getSafe(node, 'name') }</h4>
      <Form
        form={form}
        preserve={false}
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
          initialValue={getSafe(node, 'time_point')}
        >
          <InputNumber min={1}/>
        </Form.Item>
        <Form.Item
          label='判断条件'
        >
         <>
           {
             cases.map((c: Flow.Case, index: number) => (
                  <ConditionField key={index} name={`${fieldNames.condition}-${index}`} initialValue={c} />
             ))
           }
           <Button onClick={addCase}>添加</Button>
         </>
        </Form.Item>
      </Form>
      <Button onClick={onSaveForm} type='primary'>保存变更</Button>
    </section>
  );
};

export default NodeForm;
