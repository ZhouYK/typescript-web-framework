import React, {
  FC, PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import * as THREE from 'three';
import {
  CatmullRomCurve3, Line, Material, WebGLRenderer,
} from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Flow } from './interface'
import Node from './Node';
import style from './style.less';
import {gluer} from "femo";

interface Props {
  data: Flow.Node[];
}
const splinePointsLength = 3;
const ARC_SEGMENTS = 200;

const DragWithLine: FC<Props> = (props: PropsWithChildren<Props>) => {

  const { data } = props;
  const containerRef = React.createRef<HTMLDivElement>();
  const canvasRef = React.createRef<HTMLCanvasElement>();
  const rendererRef = useRef<WebGLRenderer>();
  const twoDRendererRef = useRef<CSS3DRenderer>();
  const curveRef = useRef<CatmullRomCurve3>();
  const curveLineMeshRef = useRef<Line>();
  const [material] = useState(() => new THREE.MeshBasicMaterial({ color: 'transparent' }));

  const [point] = useState(() => new THREE.Vector3());
  const [splineHelperObjects] = useState(() => gluer([]));
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

  const addSplineObject = useCallback((refData: Flow.DataWithDom) => {
    const { dom, data } = refData;
    const object = new THREE.Mesh(new THREE.PlaneGeometry(dom.clientWidth, dom.clientHeight, ~~dom.clientWidth, ~~dom.clientHeight), material);
    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600;
    object.position.z = 0;
    object.userData = { ...data };
    return object;
  }, []);

  const refFn = useCallback((refData: Flow.DataWithDom) => {
    const { dom, data } = refData;
    if (dom) {
      const p = addSplineObject(refData);
      const domObj = new CSS3DObject(dom);
      domObj.position.set(0, 1, 0);
      p.add(domObj);
      splineHelperObjects.push(p);
    } else {
      const target = splineHelperObjects.find((obj) => {
        const { userData } = obj;
        return userData.id === data.id;
      });
      for (let i = 0; i < splineHelperObjects.length; i += 1) {
        const obj = splineHelperObjects[i];
        const { userData } = obj;
          if (userData.id === obj.id) {
            splineHelperObjects
            break;
          }
      }
    }
  }, []);

  const drawLine = useCallback(() => {
    curveRef.current = new THREE.CatmullRomCurve3(splineHelperObjects.map((obj) => obj.position));
    const curvePoints = curveRef.current.getPoints(ARC_SEGMENTS - 1);
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    curveLineMeshRef.current = new THREE.Line(curveGeometry, new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35,
    }));
    scene.add(curveLineMeshRef.current);
  }, []);

  const updateSplineOutline = useCallback(() => {
    const curveLineMesh = curveLineMeshRef.current;
    const curve = curveRef.current;
    const linePositions = curveLineMesh.geometry.attributes.position;
    for (let i = 0; i < ARC_SEGMENTS; i += 1) {
      const t = i / (ARC_SEGMENTS - 1);
      curve.getPoint(t, point);
      linePositions.setXYZ(i, point.x, point.y, point.z);
    }
    linePositions.needsUpdate = true;
  }, []);

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
    console.log('drag');
    if (displayToPixel()) {
      const canvas = rendererRef.current.domElement;
      camera.aspect = canvas.width / canvas.height;
      camera.updateProjectionMatrix();
    }
    rendererRef.current.render(scene, camera);
    twoDRendererRef.current.render(scene, camera);
    updateSplineOutline();
  }, []);

  const dragRender = useCallback(() => {
    render();
  }, []);

  useEffect(() => {
    scene.add(plane);
    scene.add(helper);
    drawLine();
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    twoDRendererRef.current = new CSS3DRenderer();
    twoDRendererRef.current.domElement.className = style.hc;
    twoDRendererRef.current.domElement.style.position = 'absolute';
    twoDRendererRef.current.domElement.style.top = '0px';
    containerRef.current.appendChild(twoDRendererRef.current.domElement);
    const dragControl = new DragControls([...splineHelperObjects], camera, twoDRendererRef.current.domElement);
    dragControl.addEventListener('drag', dragRender);
    dragControl.addEventListener('dragstart', (event) => {
      // eslint-disable-next-line no-undef
      console.log('dragStart', event);
      const targetDom = event.object.children[0].element;
      if (targetDom.className.indexOf('move') === -1) {
        targetDom.className = `${targetDom.className} move`;
      }
    });
    dragControl.addEventListener('dragend', (event) => {
      // eslint-disable-next-line no-undef
      console.log('dragend', event);
      const targetDom = event.object.children[0].element;
      targetDom.className = targetDom.className.replace('move', '');
    });
    render();
    return () => {
      dragControl.deactivate();
    };
  }, []);

  const elements: any = [];
  for (let i = 0; i < splinePointsLength; i += 1) {
    elements.push(
      <Node key={i} number={i} symbol={i} details={i} ref={getRefDom} />,
    );
  }

  return (
    <section ref={containerRef} className={style.withLine}>
      <canvas ref={canvasRef} />
      {
        elements
      }
    </section>
  );
};

export default DragWithLine;
