import { GluerReturn, useIndividualModel } from 'femo';
import { useContext, useEffect } from 'react';
import WuSongFormContextCons from '../FormProvider/WuSongFormContext';
import { FieldModelProps } from '../interface';

const useFieldModel = (initState: FieldModelProps): [FieldModelProps, GluerReturn<FieldModelProps>] => {
  const [state, field] = useIndividualModel(initState);
  const context = useContext(WuSongFormContextCons);
  useEffect(() => {
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
  }, []);
  return [state, field];
};

export default useFieldModel;
