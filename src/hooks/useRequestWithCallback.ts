import { useCallback } from 'react';
import { useDerivedState, useIndividualModel } from 'femo';

const useRequestWithCallback = <T>(request: T, initLoading: boolean, initSuccess: boolean): [T, boolean, boolean, (loading: boolean) => void] => {
  const [,, clonedRaceModel, { loading: requestLoading, successful }] = useIndividualModel(null);

  const [loading] = useDerivedState(initLoading, () => requestLoading, [requestLoading]);
  const [success] = useDerivedState(initSuccess, () => successful, [successful]);

  // @ts-ignore
  const callback = useCallback((...args: any[]): Promise<any> => clonedRaceModel.race(() => request(...args)), [request]);

  // @ts-ignore
  return [callback, loading, success];
};

export default useRequestWithCallback;
