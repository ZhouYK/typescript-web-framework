import { GluerReturn } from 'femo';

export interface FieldModelProps {
  name: string;
  [index: string]: any;
}

export interface WuSongFormContext {
  fields: Map<string, GluerReturn<any>>;
  subscriptions: Map<string, (<S>(target: GluerReturn<S>) => void)[]>;
}
