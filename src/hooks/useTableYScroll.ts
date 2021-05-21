import { useCallback, useEffect, useState } from 'react';

const useTableYScroll = (diff = 370) => {
  const [y, updateY] = useState(() => window.innerHeight - diff);
  const updateYWhenResize = useCallback(() => {
    updateY(window.innerHeight - diff);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateYWhenResize, {
      passive: true,
    });
    return () => window.removeEventListener('resize', updateYWhenResize);
  }, []);
  return y;
};

export default useTableYScroll;
