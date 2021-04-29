import { useCallback, useState } from 'react';
import { Flow } from '@src/pages/Three/Flow/interface';
import useResult from '@src/hooks/useResult';
import listModel from './model';

const useListNodeResult = () => {
  const [list, updateList] = useState(() => listModel());

  const delItemFromList = useCallback((item: Flow.ResourceNode) => {
    const internalList = [...list];
    for (let i = 0; i < internalList.length; i += 1) {
      if (internalList[i].id === item.id) {
        internalList.splice(i, 1);
        updateList(internalList);
        break;
      }
    }
  }, [list]);

  const addItem = useCallback(() => {
    const internalList = [...list];
    internalList.push({
      id: `${Date.now()}`,
      name: `新增${internalList.length}`,
    });
    updateList(internalList);
  }, [list]);

  const modifyItem = useCallback(() => {
    // eslint-disable-next-line no-bitwise
    const index = ~~(list.length * Math.random());
    const str = `${Date.now()}`;
    list[index].name = `${str.substring(str.length - 6)}变化`;
    updateList([...list]);
  }, [list]);

  return useResult({
    list,
    delItemFromList,
    addItem,
    modifyItem,
  });
};

export default useListNodeResult;
