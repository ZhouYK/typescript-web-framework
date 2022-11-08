import { GluerReturn } from 'femo';

export interface FieldModelProps<V = any> {
  name: string;
  value: V;
  [index: string]: any;
}

export interface WuSongFormContext {
  fields: Map<string, GluerReturn<any>>;
  subscriptions: Map<string, (<S>(target: GluerReturn<S>) => void)[]>;
}

export type WuSongFormItemContext = GluerReturn<FieldModelProps>;
