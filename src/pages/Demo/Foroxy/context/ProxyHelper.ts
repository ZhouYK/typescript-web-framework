import { GluerReturn } from 'femo';

class ProxyHelper {
  fields = new Map<string, GluerReturn<any>>();

  addField = (name: string, field: GluerReturn<any>) => {
    this.fields.set(name, field);
  }

  removeField = (name: string) => {
    this.fields.delete(name);
  }
}

export default ProxyHelper;
