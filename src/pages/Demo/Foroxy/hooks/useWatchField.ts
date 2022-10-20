import useQueryField from '@/pages/Demo/Foroxy/hooks/useQueryField';
import { useEffect } from 'react';

function useWatchField<V>(name: string, callback: (value: V) => void) {
  const [, field] = useQueryField<V>(name);
  console.log('name', name, 'field', field);
  useEffect(() => field?.onChange((s) => {
    callback(s);
  }), [field]);
}

export default useWatchField;
