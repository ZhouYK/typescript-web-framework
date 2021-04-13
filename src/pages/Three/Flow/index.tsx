import React, {
  FC, PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import * as THREE from 'three';
import {
  Material, Object3D, WebGLRenderer,
} from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import useLine from '@src/pages/Three/Flow/useLine';
import useDragControl from '@src/pages/Three/Flow/useDragControl';
import { getSafe } from '@src/tools/util';
import { Flow } from './interface';
import Node from './Node';
import style from './style.less';
import nodeStyle from './Node/style.less';

interface Props {
}
const ARC_SEGMENTS = 200;

const DragWithLine: FC<Props> = (_props: PropsWithChildren<Props>) => {
  const flagRef = useRef(false);
  const [data, updateData] = useState(() => ([{
    id: '1',
    name: '测试1',
  }, {
    id: '2',
    name: '测试2',
  }, {
    id: '3',
    name: '测试3',
  }]));
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
    tmpCamera.position.set(0, 250, 1000);
    return tmpCamera;
  });

  const [plane] = useState(() => {
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -200;
    plane.receiveShadow = true;
    return plane;
  });

  const [helper] = useState(() => {
    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = -199;
    (helper.material as Material).opacity = 0.25;
    (helper.material as Material).transparent = true;
    return helper;
  });

  const addSplineObject = useCallback((data: Flow.Node) => {
    const object = new THREE.Mesh(new THREE.PlaneGeometry(nodeStyle.width, nodeStyle.height, nodeStyle.width, nodeStyle.height), material);
    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600;
    object.position.z = 0;
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

  const addItem = useCallback(() => {
    const internalData = [...data];
    internalData.push({
      id: `${Date.now()}`,
      name: `新增${internalData.length}`,
    });
    updateData(internalData);
  }, [data]);

  const modifyItem = useCallback(() => {
    // eslint-disable-next-line no-bitwise
    const index = ~~(data.length * Math.random());
    const str = `${Date.now()}`;
    data[index].name = `${str.substring(str.length - 6)}变化`;
    updateData([...data]);
  }, [data]);

  useEffect(() => {
    if (flagRef.current) {
      createLine(splineHelperObjects);
      createDragControl(splineHelperObjects, twoDRendererRef.current.domElement);
      render();
    } else {
      flagRef.current = true;
    }
  }, [data]);

  useEffect(() => {
    scene.add(plane);
    scene.add(helper);
    createLine(splineHelperObjects);
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    twoDRendererRef.current = new CSS3DRenderer();
    twoDRendererRef.current.domElement.style.position = 'absolute';
    twoDRendererRef.current.domElement.style.top = '0px';
    containerRef.current.appendChild(twoDRendererRef.current.domElement);
    createDragControl(splineHelperObjects, twoDRendererRef.current.domElement);
    render();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, []);

  return (
    <>
      <button onClick={addItem}>新增</button>
      <button onClick={modifyItem}>随机修改</button>
      <section ref={containerRef} className={style.withLine}>
        <canvas ref={canvasRef} />
      </section>
      <section ref={reactContainerRef} className='react-view'>
         {
          data.map((n) => (
            <Node delItem={delItem} data={n} refFn={refFn} key={n.id} />
          ))
         }
      </section>
    </>
  );
};

export default DragWithLine;
