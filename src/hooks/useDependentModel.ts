import { genRaceQueue, gluer, subscribe } from 'femo';
import { useEffect, useRef, useState } from 'react';

const useDependentModel = <D, T>(request: (...args: any[]) => Promise<any>, dataHandler: (d: D) => T, initState: T) => {
  const flagRef = useRef(false);
  const [model] = useState(() => gluer(initState));
  const [state, updateState] = useState(() => model());
  const [raceQueue] = useState(() => genRaceQueue());
  const [req] = useState<typeof request>(() => (...args: any[]) => {
    const p = model(() => request(...args).then((res: D) => dataHandler(res)));
    raceQueue.push(p);
    return p;
  });

  useEffect(() => subscribe([model], (data: T) => {
    updateState(data);
  }), []);

  const [result, updateResult] = useState(() => ({
    req,
    state,
    model,
  }));

  useEffect(() => {
    if (flagRef.current) {
      updateResult({
        req,
        state,
        model,
      });
    } else {
      flagRef.current = true;
    }
  }, [req, state, model]);

  return result;
};

export default useDependentModel;
