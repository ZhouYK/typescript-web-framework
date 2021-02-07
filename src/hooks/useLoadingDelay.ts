import { useCallback, useRef, useState } from 'react';

const useLoadingDelay = (initialLoading = false, showDelay = 0, hideDelay = 500): [boolean, (flag: boolean) => void] => {
  const [loading, updateLoading] = useState(initialLoading);
  const timerRef = useRef<{ showTimer: NodeJS.Timer; hideTimer: NodeJS.Timer }>({ showTimer: null, hideTimer: null });

  const updateLoadingDelay = useCallback((flag: boolean): void => {
    clearTimeout(timerRef.current.showTimer);
    clearTimeout(timerRef.current.hideTimer);
    if (flag) {
      if (!showDelay) {
        updateLoading(flag);
        return;
      }
      timerRef.current.showTimer = setTimeout(() => {
        updateLoading(true);
      }, showDelay);
    } else {
      if (!hideDelay) {
        updateLoading(flag);
        return;
      }
      timerRef.current.hideTimer = setTimeout(() => {
        updateLoading(false);
      }, hideDelay);
    }
  }, [timerRef]);

  return [loading, updateLoadingDelay];
};

export default useLoadingDelay;
