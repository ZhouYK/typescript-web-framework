import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Flow } from '@src/pages/Three/Flow/interface';
import {
  Button, Form, Switch, Tooltip,
} from 'antd';
import ConditionField from '@src/pages/Three/Flow/Fields/Condition';
import { getSafe } from '@src/tools/util';
import { useDerivedStateToModelFromProps, useIndividualModel } from 'femo';
import { DeleteOutlined, PlaySquareOutlined } from '@ant-design/icons';
import TimePointField from '@src/pages/Three/Flow/Fields/TimePoint';
import fieldNames from '../Fields/fieldNames';
import style from './style.less';

export interface Props {
  saveItem?: (item: Flow.Node) => void;
  delItem?: (item: Flow.Node) => void;
  node: Flow.Node;
}

const NodeForm: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { node, saveItem, delItem } = props;
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

  const deleteItem = useCallback(() => {
    if (delItem) {
      delItem(node);
    }
  }, [delItem]);

  return (
    <section className={style.nodeForm}>
      <section className='video-name'>
        <section className='icon'>
          <PlaySquareOutlined />
        </section>
        <section className='symbol'>
          { getSafe(node, 'name') }
        </section>
        <Tooltip
          title='删除'
        >
          <section className='delete' onClick={deleteItem}>
            <DeleteOutlined />
          </section>
        </Tooltip>
      </section>
      <Form
        form={form}
        preserve={false}
        hideRequiredMark
        colon={false}
        layout='vertical'
      >
        <Form.Item
          name={fieldNames.open}
          label='开启互动'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>
        <TimePointField
          name={fieldNames.time_point}
          label='控制时间'
          rules={[{
            required: true,
            message: '请输入（秒）',
          }]}
          node={node}
          initialValue={getSafe(node, 'time_point')}
        />

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
