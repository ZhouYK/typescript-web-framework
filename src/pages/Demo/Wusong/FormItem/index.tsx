import linkDecorator from '@/pages/Demo/Wusong/hoc/linkDecorator';
import { Form } from 'antd';

export default linkDecorator(Form.Item, (p) => ({
  name: p.name,
  label: p.label,
}));
