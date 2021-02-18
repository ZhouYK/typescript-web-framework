import { message, FormInstance } from 'antd';
import { getSafe } from '@src/tools/util';

export const scrollToFirstErrorField = (err: any, form: FormInstance): void => {
  const errorFields = getSafe(err, 'errorFields') || [];
  const names = getSafe(errorFields, '[0].name');
  message.error('完善表单项');
  form.scrollToField(names);
};

export const apiError = 'This is an api error';
