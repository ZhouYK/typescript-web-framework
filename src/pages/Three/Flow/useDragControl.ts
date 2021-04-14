import { Camera, Object3D, Event } from 'three';
import {
  useCallback, useRef,
} from 'react';
import { DragControls } from 'three/examples/jsm/controls/DragControls';


type Keys = 'dragstart' | 'drag' | 'dragend' | 'hoveron' | 'hoveroff';
type Events = {
  [key in Keys]?: (event: Event) => void;
};

const useDragControl = (camera: Camera, eventsObject: Events) => {
  const flagRef = useRef<HTMLElement>(null);
  const dragControlRef = useRef<DragControls>();
  const eventsRef = useRef<Events>();
  eventsRef.current = eventsObject;

  const createDragControl = useCallback((object3dArr: Object3D[], rendererDomElement: HTMLElement) => {
    if (flagRef.current !== rendererDomElement) {
      flagRef.current = rendererDomElement;
    }
    dragControlRef.current?.dispose();
    if (!object3dArr.length) return;
    dragControlRef.current = new DragControls([...object3dArr], camera, rendererDomElement);
    Object.keys(eventsObject).forEach((k) => {
      dragControlRef.current.addEventListener(k, eventsRef.current[k as Keys]);
    });
  }, [camera]);

  return {
    dragControlRef,
    createDragControl,
  };
};

export default useDragControl;
