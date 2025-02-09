import { prefix } from '../constants';
import FormItem from '../FormItem';
import type { SerpentContextInterface } from '../interface';

const defaultValue: SerpentContextInterface = {
  presentation: FormItem,
  prefix,
};

export default defaultValue;
