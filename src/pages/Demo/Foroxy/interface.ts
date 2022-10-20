import { GluerReturn } from 'femo';

export interface ProxyContextValue {
  fields: Map<string, GluerReturn<any>>;
  subscriptions: Map<string, (<S>(target: GluerReturn<S>) => void)[]>;
}
export interface NecessaryProps {
  name: string;
}
