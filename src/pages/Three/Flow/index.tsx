import React, {
  ComponentType,
  FC, PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import * as THREE from 'three';
import {
  Material, Object3D, Vector2, WebGLRenderer,
} from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import useLine from '@src/pages/Three/Flow/useLine';
import useDragControl from '@src/pages/Three/Flow/useDragControl';
import { getSafe } from '@src/tools/util';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Flow } from './interface';
import Node from './Node';
import ListNode, { type } from './ListNode';
import style from './style.less';
import nodeStyle from './Node/style.less';

interface Props {
}
const ARC_SEGMENTS = 200;

const DragWithLine: FC<Props> = (_props: PropsWithChildren<Props>) => {
  const flagRef = useRef(false);
  const [list, updateList] = useState(() => [{
    id: '1',
    name: '测试1',
  }, {
    id: '2',
    name: '测试2',
  }, {
    id: '3',
    name: '测试3',
  }]);
  const [data, updateData] = useState<Flow.Node[]>(() => []);
  const containerRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const reactContainerRef = useRef<HTMLDivElement>();
  const rendererRef = useRef<WebGLRenderer>();
  const twoDRendererRef = useRef<CSS3DRenderer>();
  const [material] = useState(() => new THREE.MeshBasicMaterial({ color: 'transparent' }));

  const [splineHelperObjects] = useState<Object3D[]>([]);
  const [scene] = useState(() => {
    const tmpScene = new THREE.Scene();
    tmpScene.background = new THREE.Color(0xffffff);
    return tmpScene;
  });
  const [camera] = useState(() => {
    const tmpCamera = new THREE.PerspectiveCamera(70, 2, 1, 10000);
    tmpCamera.position.set(0, 0, 1000);
    return tmpCamera;
  });
  const [helper] = useState(() => {
    const helper = new THREE.GridHelper(1000, 10);
    helper.position.y = 0;
    helper.rotation.x = Math.PI / 2;
    (helper.material as Material).opacity = 0.25;
    (helper.material as Material).transparent = true;
    return helper;
  });

  const addSplineObject = useCallback((data: Flow.Node) => {
    const object = new THREE.Mesh(new THREE.PlaneGeometry(nodeStyle.width, nodeStyle.height, nodeStyle.width, nodeStyle.height), material);
    const p = new Vector2();
    const size = rendererRef.current.getSize(p);
    console.log('size', size);
    // object.position.x = (data.x - 300 - (size.x / window.devicePixelRatio) + 120);
    // object.position.x = (data.x - 300 - (size.x / window.devicePixelRatio) + 120);
    object.position.y = 0;
    object.position.x = 0;
    object.position.z = 0;
    console.log(data, object.position);
    object.userData = { ...data };
    return object;
  }, []);

  const refFn = useCallback((refData: Flow.DataWithDom) => {
    const { dom, data } = refData;
    if (dom) {
      const clonedDom = dom;
      const p = addSplineObject(data);
      const domObj = new CSS3DObject(clonedDom as HTMLElement);
      p.add(domObj);
      scene.add(p);
      splineHelperObjects.push(p);
    } else {
      for (let i = 0; i < splineHelperObjects.length; i += 1) {
        const obj = splineHelperObjects[i];
        const { userData } = obj;
        if (userData.id === data.id) {
          // 组件卸载时，也从场景中去掉对应的3d对象
          scene.remove(obj);
          splineHelperObjects.splice(i, 1);
          break;
        }
      }
    }
  }, []);

  const { createLine, updateLinePositions: updateSplineOutline } = useLine(scene, ARC_SEGMENTS);

  const displayToPixel = useCallback(() => {
    const canvas = rendererRef.current.domElement;
    const width = containerRef.current.clientWidth * window.devicePixelRatio;
    const height = containerRef.current.clientHeight * window.devicePixelRatio;
    const needResize = width !== canvas.width || height !== canvas.height;
    if (needResize) {
      rendererRef.current.setSize(width, height, false);
      twoDRendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
    return needResize;
  }, []);

  const render = useCallback(() => {
    if (displayToPixel()) {
      const canvas = rendererRef.current.domElement;
      camera.aspect = canvas.width / canvas.height;
      camera.updateProjectionMatrix();
    }
    rendererRef.current.render(scene, camera);
    twoDRendererRef.current.render(scene, camera);
    updateSplineOutline();
  }, [updateSplineOutline]);

  const { createDragControl } = useDragControl(camera, {
    dragstart: (event) => {
      const targetDom = event.object.children[0].element;
      if (targetDom.className.indexOf('move') === -1) {
        targetDom.className = `${targetDom.className} move`;
      }
    },
    dragend: (event) => {
      const targetDom = event.object.children[0].element;
      targetDom.className = targetDom.className.replace('move', '');
    },
    drag: render,
  });

  const getElementFromObject3D = useCallback((obj3d: Object3D) => getSafe(obj3d, 'children[0].element'), []);

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
  }, [data]);


  const delItemFromList = useCallback((item: Flow.Node) => {
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

  const doRender = useCallback(() => {
    createLine(splineHelperObjects);
    createDragControl(splineHelperObjects, twoDRendererRef.current.domElement);
    render();
  }, [createLine, createDragControl, render, splineHelperObjects, twoDRendererRef.current]);

  useEffect(() => {
    if (flagRef.current) {
      doRender();
    } else {
      flagRef.current = true;
    }
  }, [data]);

  useEffect(() => {
    scene.add(helper);
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    twoDRendererRef.current = new CSS3DRenderer();
    twoDRendererRef.current.domElement.style.position = 'absolute';
    twoDRendererRef.current.domElement.style.top = '0px';
    containerRef.current.appendChild(twoDRendererRef.current.domElement);
    doRender();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, []);

  const [, drop] = useDrop(() => ({
    accept: type,
    drop(item: Flow.Node, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      // console.log('drop', item, delta);
      let flag = false;
      for (let i = 0; i < data.length; i += 1) {
        if (item.id === data[i].id) {
          flag = true;
          return;
        }
      }
      if (!flag) {
        updateData([...data, { ...item, ...delta }]);
      }
    },
  }), [data]);
  console.log('data', data);
  return (

  <section className={style.area}>
    <section className='list'>
      <button onClick={addItem}>新增</button>
      <button onClick={modifyItem}>随机修改</button>
      <section>
        {
          list.map((n) => (
            <section className='node-wrap' key={n.id}>
              <ListNode delItem={delItemFromList} data={n}/>
            </section>
          ))
        }
      </section>
    </section>
    <section ref={drop} className='workspace'>
      <section ref={containerRef} className='withLine'>
        <canvas ref={canvasRef} />
      </section>
      <section ref={reactContainerRef} className='react-view'>
        {
          data.map((n) => (
            <Node delItem={delItem} data={n} refFn={refFn} key={n.id} />
          ))
        }
      </section>
    </section>
    <section className='edit-place'></section>
  </section>

  );
};

const InjectDndContext = (Component: ComponentType) => (props: any) => (
    <DndProvider backend={HTML5Backend}>
      <Component {...props} />
    </DndProvider>
);

export default InjectDndContext(DragWithLine);
