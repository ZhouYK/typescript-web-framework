import { useEffect, useState } from 'react';
import { subscribe } from 'femo';

const useModel = <T>(model: any, handleFnc?: (data: any) => any): [T, (data: any) => void] => {
  const [state, updateState] = useState(() => {
    const tmpState = model();
    if (handleFnc) {
      return handleFnc(tmpState);
    }
    return tmpState;
  });

  useEffect(() => subscribe([model], (modelData: any) => {
    if (handleFnc) {
      updateState(handleFnc(modelData));
    } else {
      updateState(modelData);
    }
  }), [model, handleFnc]);

  return [state, updateState];
};

export default useModel;
