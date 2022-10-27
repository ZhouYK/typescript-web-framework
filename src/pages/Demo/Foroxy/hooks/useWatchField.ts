import useQueryField from '@/pages/Demo/Foroxy/hooks/useQueryField';
import { useEffect } from 'react';

function useWatchField<V>(name: string, callback: (value: V) => void) {
  const [, field] = useQueryField<V>(name);
  useEffect(() => field?.onChange((s) => {
    callback(s);
  }), [field]);
}

export default useWatchField;
