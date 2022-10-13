import React, { useCallback, useRef } from 'react';
import { isInViewPortVertical, throttle } from '@/tools/util';

const useScrollLoad = (refInstance: React.MutableRefObject<HTMLElement>, loadFnc: () => void): [
  (element: HTMLElement) => void
] => {
  const cacheRef = useRef({ lastIsInViewport: false });
  const onScrollY = useCallback(throttle(() => {
    const lastIsInViewport = cacheRef.current?.lastIsInViewport;
    if (refInstance.current && !lastIsInViewport && isInViewPortVertical(refInstance.current)) {
      cacheRef.current.lastIsInViewport = true;
      loadFnc();
    } else if (lastIsInViewport && (!refInstance.current || !isInViewPortVertical(refInstance.current))) {
      cacheRef.current.lastIsInViewport = false;
    }
  }, 100), [refInstance, loadFnc]);

  return [onScrollY];
};

export default useScrollLoad;
