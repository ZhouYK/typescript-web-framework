import React, {
  FC, PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import * as THREE from 'three';
import {
  CatmullRomCurve3, Line, Material, WebGLRenderer,
} from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import style from './style.less';

interface Props {

}
const splinePointsLength = 4;
const ARC_SEGMENTS = 200;

const DragWithLine: FC<Props> = (_props: PropsWithChildren<Props>) => {
  const containerRef = React.createRef<HTMLDivElement>();
  const canvasRef = React.createRef<HTMLCanvasElement>();
  const rendererRef = useRef<WebGLRenderer>();
  const curveRef = useRef<CatmullRomCurve3>();
  const curveLineMeshRef = useRef<Line>();

  const [point] = useState(() => new THREE.Vector3());
  const [positions] = useState([]);
  const [splineHelperObjects] = useState([]);
  const [geometry] = useState(() => new THREE.BoxGeometry(20, 20, 20));

  const [scene] = useState(() => {
    const tmpScene = new THREE.Scene();
    tmpScene.background = new THREE.Color(0xf0f0f0);
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

  const addSplineObject = useCallback(() => {
    const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const object = new THREE.Mesh(geometry, material);
    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600;
    object.position.z = Math.random() * 800 - 400;
    return object;
  }, []);

  const genObjects = useCallback(() => {
    for (let i = 0; i < splinePointsLength; i += 1) {
      const p = addSplineObject();
      scene.add(p);
      splineHelperObjects.push(p);
      positions.push(p.position);
    }
  }, []);

  const drawLine = useCallback(() => {
    genObjects();
    curveRef.current = new THREE.CatmullRomCurve3(positions);
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
    updateSplineOutline();
  }, []);

  useEffect(() => {
    scene.add(plane);
    scene.add(helper);
    drawLine();
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    const dragControl = new DragControls([...splineHelperObjects], camera, rendererRef.current.domElement);
    dragControl.addEventListener('drag', render);
    // @ts-ignore
    scene.add(dragControl);
    render();
    return () => {
      dragControl.removeEventListener('drag', render);
    };
  }, []);

  return (
    <section ref={containerRef} className={style.withLine}>
      <canvas ref={canvasRef} />
    </section>
  );
};

export default DragWithLine;
