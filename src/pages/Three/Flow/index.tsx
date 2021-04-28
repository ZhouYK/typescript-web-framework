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
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useNodeResult from '@src/pages/Three/Flow/Node/useNodeResult';
import useListNodeResult from '@src/pages/Three/Flow/ListNode/useListNodeResult';
import {
  Button, Empty, Input,
} from 'antd';
import { getSafe } from '@src/tools/util';
import { Flow } from './interface';
import Node from './Node';
import ListNode, { type } from './ListNode';
import style from './style.less';

interface Props {
}
const ARC_SEGMENTS = 1000;
const { devicePixelRatio } = window;

const DragWithLine: FC<Props> = (_props: PropsWithChildren<Props>) => {
  const flagRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const reactContainerRef = useRef<HTMLDivElement>();
  const rendererRef = useRef<WebGLRenderer>();
  const twoDRendererRef = useRef<CSS3DRenderer>();
  const dropMeasureRef = useRef<HTMLDivElement>();
  const [material] = useState(() => new THREE.MeshBasicMaterial({ color: 'transparent' }));

  const [splineHelperObjects] = useState<Object3D[]>([]);
  const [scene] = useState(() => {
    const tmpScene = new THREE.Scene();
    tmpScene.background = new THREE.Color(0xffffff);
    return tmpScene;
  });
  const [camera] = useState(() => {
    const tmpCamera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000);
    tmpCamera.position.set(0, 0, 100);
    tmpCamera.zoom = 1;
    return tmpCamera;
  });
  const [helper] = useState(() => {
    const helper = new THREE.GridHelper(2000, 100);
    // helper.position.y = 0;
    // helper.position.x = 0;
    helper.rotation.x = Math.PI / 2;
    // helper.position.z = 0;
    (helper.material as Material).opacity = 0.25;
    (helper.material as Material).transparent = true;
    return helper;
  });

  const addSplineObject = useCallback((data: Flow.Node) => {
    const object = new THREE.Mesh(new THREE.PlaneGeometry(style.width * devicePixelRatio, style.height * devicePixelRatio, style.width * devicePixelRatio, style.height * devicePixelRatio), material);
    const p = new Vector2();
    const size = rendererRef.current.getSize(p);
    // drop target的坐标
    const {
      x: dropTargetX, y: dropTargetY, width, height,
    } = dropMeasureRef.current.getBoundingClientRect();

    let diffX = data.x - dropTargetX;
    let diffY = data.y - dropTargetY;

    if (diffX < 0) {
      diffX = 0;
    } else if (diffX > width) {
      diffX = width;
    }

    if (diffY < 0) {
      diffY = 0;
    } else if (diffY > height) {
      diffY = height;
    }

    // eslint-disable-next-line no-bitwise
    object.position.x = diffX * devicePixelRatio - size.x / 2 + (style.width / 2);
    // eslint-disable-next-line no-bitwise
    object.position.y = size.y / 2 - diffY * devicePixelRatio - (style.height / 2);
    // object.position.y = 0;
    // object.position.x = 0;
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
    const width = containerRef.current.clientWidth * devicePixelRatio;
    const height = containerRef.current.clientHeight * devicePixelRatio;
    const needResize = width !== canvas.width || height !== canvas.height;
    if (needResize) {
      rendererRef.current.setSize(width, height, false);
      twoDRendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      // twoDRendererRef.current.setSize(width, height);
    }
    return needResize;
  }, []);

  const resizeCamera = useCallback(() => {
    const canvas = rendererRef.current.domElement;
    // camera.aspect = canvas.width / canvas.height;
    camera.left = -canvas.width / 2;
    camera.right = canvas.width / 2;
    camera.top = canvas.height / 2;
    camera.bottom = -canvas.height / 2;
    camera.updateProjectionMatrix();
  }, []);

  const render = useCallback(() => {
    if (displayToPixel()) {
      resizeCamera();
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

  // 绘图区域相关数据和事件
  const nodeResult = useNodeResult(splineHelperObjects, reactContainerRef);
  // 左侧列表相关数据和事件
  const listNodeResult = useListNodeResult();

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
  }, [nodeResult.data]);

  useEffect(() => {
    scene.add(helper);
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    twoDRendererRef.current = new CSS3DRenderer();
    twoDRendererRef.current.domElement.style.position = 'absolute';
    twoDRendererRef.current.domElement.style.top = '0px';
    containerRef.current.appendChild(twoDRendererRef.current.domElement);
    resizeCamera();
    doRender();
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, []);

  const [, drop] = useDrop(() => ({
    accept: type,
    drop(item: Flow.Node, monitor) {
      const delta = monitor.getSourceClientOffset();
      let flag = false;
      for (let i = 0; i < nodeResult.data.length; i += 1) {
        if (item.id === nodeResult.data[i].id) {
          flag = true;
          return;
        }
      }
      if (!flag) {
        nodeResult.updateData([...nodeResult.data, { ...item, ...delta }]);
      }
    },
  }), [nodeResult.data]);

  const [currentListNode, updateCurrentListNode] = useState<Flow.Node>(null);
  const clickListNode = useCallback((node: Flow.Node) => {
    updateCurrentListNode(node);
  }, []);

  return (
    <section className={style.area}>
      <section className='list'>
        <section className='list-inner'>
          <section className='video-area'>
            <section>{ getSafe(currentListNode, 'name') }</section>
          </section>
          <section className='video-list'>
            <section className='operation'>
              <section className='search-input-wrap'>
                <section className='search-input'>
                  <Input.Search placeholder='搜索视频' />
                </section>
              </section>
              <section className='btn-wrap'>
                <Button type='primary' onClick={listNodeResult.addItem}>上传视频</Button>
              </section>
            </section>
            {
              listNodeResult.list.map((n) => (
                <ListNode isActive={getSafe(currentListNode, 'id') === n.id} onClick={clickListNode} key={n.id} delItem={listNodeResult.delItemFromList} data={n}/>
              ))
            }
          </section>
        </section>
      </section>
      <section ref={drop} className='workspace'>
        <section ref={dropMeasureRef} className='drop-measure-container'>
          <section ref={containerRef} className='withLine'>
            <canvas ref={canvasRef} />
          </section>
          <section ref={reactContainerRef} className='react-view'>
            {
              nodeResult.data.map((n) => (
                <Node devicePixelRatio={devicePixelRatio} isActive={getSafe(nodeResult, 'curItem.id') === n.id} clickItem={nodeResult.clickItem} data={n} refFn={refFn} key={n.id} />
              ))
            }
          </section>
        </section>
      </section>
      <section className='edit-place'>
        {
          nodeResult.curItem ? <nodeResult.FormComp node={nodeResult.curItem} saveItem={nodeResult.saveItem} delItem={nodeResult.delItem}/> : <section className='edit-place-empty'><Empty /></section>
        }
      </section>
    </section>
  );
};

const InjectDndContext = (Component: ComponentType) => (props: any) => (
    <DndProvider backend={HTML5Backend}>
      <Component {...props} />
    </DndProvider>
);

export default InjectDndContext(DragWithLine);
