import FormItem from '@/pages/Demo/Wusong/lib/FormItem';
import linkField from '@/pages/Demo/Wusong/lib/hoc/linkField';
import { Input } from 'antd';
// import useQueryField from '@/pages/Demo/Wusong/hooks/useQueryField';
import React, { FC } from 'react';

interface Props {

}

const NameField: FC<Props> = (_props) => {
  return (
    <FormItem
      label='名字'
    >
      <Input placeholder='请输入名字' />
    </FormItem>
  );
};

export default linkField(NameField);
