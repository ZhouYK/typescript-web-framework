import { GluerReturn, useIndividualModel } from 'femo';
import { useContext, useEffect } from 'react';
import WuSongFormContextCons from '../FormProvider/WuSongFormContext';
import { FieldModelProps } from '../interface';

const useFieldModel = (initState: FieldModelProps): [FieldModelProps, GluerReturn<FieldModelProps>] => {
  const [state, field] = useIndividualModel(initState);
  const context = useContext(WuSongFormContextCons);
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof state.name === 'string' && state.name) {
      context.fields.set(state.name, field);
      if (context.subscriptions.has(state.name)) {
        context.subscriptions.get(state.name).forEach((callback) => callback(field));
      }
      return () => {
        context.fields.delete(state.name);
        if (context.subscriptions.has(state.name)) {
          context.subscriptions.get(state.name).forEach((callback) => callback(null));
        }
      };
    }
  }, [state.name]);
  return [state, field];
};

export default useFieldModel;
