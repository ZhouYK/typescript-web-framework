import React, {
  RefObject,
  useCallback, useEffect, useState,
} from 'react';
import { Flow } from '@src/pages/Three/Flow/interface';
import NodeForm, { Props } from '@src/pages/Three/Flow/NodeForm';
import { Object3D } from 'three';
import { getSafe } from '@src/tools/util';
import useResult from '@src/hooks/useResult';


const useNodeResult = (splineHelperObjects: Object3D[], reactContainerRef: RefObject<HTMLElement>) => {
  const [data, updateData] = useState<Flow.Node[]>(() => []);
  const [curItem, updateItem] = useState<Flow.Node>();
  const saveItem = useCallback((item: Flow.Node) => {
    const internalData = [...data];
    for (let i = 0; i < internalData.length; i += 1) {
      if (item.id === internalData[i].id) {
        internalData[i] = { ...item };
        break;
      }
    }
    updateData(internalData);
  }, [data]);

  const getElementFromObject3D = useCallback((obj3d: Object3D) => getSafe(obj3d, 'children[0].element'), []);

  const genComp = useCallback(() => (props: Props) => <NodeForm { ...props } />, []);

  const [FormComp, updateFormComp] = useState(() => genComp());
  const clickItem = useCallback((item: Flow.Node) => {
    updateItem(item);
  }, [curItem, saveItem]);


  const delItem = useCallback((item: Flow.Node) => {
    const internalData = [...data];
    let flag = false;
    let targetDom: HTMLElement = null;
    for (let j = 0; j < splineHelperObjects.length; j += 1) {
      const obj = splineHelperObjects[j];
      if (obj.userData.id === item.id) {
        targetDom = getElementFromObject3D(obj);
        flag = true;
        break;
      }
    }
    for (let i = 0; i < internalData.length; i += 1) {
      if (internalData[i].id === item.id) {
        internalData.splice(i, 1);
        if (flag) {
          reactContainerRef.current.appendChild(targetDom);
        }
        updateData(internalData);
        break;
      }
    }
    if (item.id === (curItem && curItem.id)) {
      updateItem(null);
    }
  }, [data, curItem, splineHelperObjects, reactContainerRef]);


  useEffect(() => {
    updateFormComp(() => genComp());
  }, [curItem]);

  return useResult({
    data,
    updateData,
    curItem,
    clickItem,
    saveItem,
    delItem,
    FormComp,
  });
};

export default useNodeResult;
