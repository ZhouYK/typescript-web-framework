import { message, FormInstance } from 'antd';

export const scrollToFirstErrorField = (err: any, form: FormInstance): void => {
  const errorFields = err?.errorFields ?? [];
  const names = errorFields[0]?.name;
  message.error('完善表单项');
  form.scrollToField(names);
};

export const apiError = 'This is an api error';
