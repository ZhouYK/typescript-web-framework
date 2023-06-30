import { FNode, FormContextValue, FormState } from '@/pages/Demo/Form/lib/interface';
import { useDerivedState } from 'femo';
import React, { FC } from 'react';
import FormContext from './FormContext';

interface Props {
  children: any;
  state: FormState;
  node: FNode<FormState>
}

const WuSongFormItemProvider: FC<Props> = (props) => {
  const { state, node } = props;

  const [value] = useDerivedState<FormContextValue>(() => {
    return {
      state,
      node,
    };
  }, [state, node]);

  return (
    <FormContext.Provider value={value}>
      {
        props.children
      }
    </FormContext.Provider>
  );
};

export default WuSongFormItemProvider;
