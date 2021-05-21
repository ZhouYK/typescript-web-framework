import React, {
  createRef,
  FC, PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { safeCrash } from '@src/hocs';
import style from './style.less';

interface Props {

}

const Drag: FC<Props> = (_props: PropsWithChildren<Props>) => {
  const containerRef = createRef<HTMLDivElement>();
  const canvasRef = createRef<HTMLCanvasElement>();

  const rendererRef = useRef<{
    renderer: THREE.Renderer;
  }>({
    renderer: null,
  });

  const controlsRef = useRef<{
    controls: DragControls;
  }>({
    controls: null,
  });

  const [camera] = useState(() => {
    const tmpCamera = new THREE.PerspectiveCamera(70, 2, 1, 5000);
    tmpCamera.position.z = 1000;
    return tmpCamera;
  });
  const [scene] = useState(() => {
    const tmpScene = new THREE.Scene();
    tmpScene.background = new THREE.Color(0xf0f0f0);
    return tmpScene;
  });

  const [group] = useState(() => {
    const tmpGroup = new THREE.Group();
    scene.add(group);
    return tmpGroup;
  });

  const [objects] = useState(() => {
    const tmpObjects = [];
    const geometry = new THREE.BoxGeometry(40, 40, 40);
    for (let i = 0; i < 200; i += 1) {
      const object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));

      object.position.x = Math.random() * 1000 - 500;
      object.position.y = Math.random() * 600 - 300;
      object.position.z = Math.random() * 800 - 400;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() * 2 + 1;
      object.scale.y = Math.random() * 2 + 1;
      object.scale.z = Math.random() * 2 + 1;
      scene.add(object);
      tmpObjects.push(object);
    }
    return tmpObjects;
  });

  const [enableSelection, updateEnableSelection] = useState(false);

  const resizeCanvas = useCallback((rder: THREE.Renderer) => {
    const canvas = rder.domElement;
    const container = containerRef.current;
    const pixelRatio = window.devicePixelRatio;
    const width = container.clientWidth * pixelRatio;
    const height = container.clientHeight * pixelRatio;
    const needResize = width !== canvas.width || height !== canvas.height;
    if (needResize) {
      rder.setSize(width, height, false);
    }
    return needResize;
  }, []);

  const render = useCallback(() => {
    const { renderer } = rendererRef.current;
    if (renderer) {
      renderer.render(scene, camera);
    }
  }, []);

  const resizeRendererAndCamera = useCallback(() => {
    if (rendererRef.current) {
      const { renderer } = rendererRef.current;
      if (resizeCanvas(renderer)) {
        camera.aspect = renderer.domElement.width / renderer.domElement.height;
        camera.updateProjectionMatrix();
      }
    }
  }, []);

  const onWindowResize = useCallback(() => {
    resizeRendererAndCamera();
    render();
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { keyCode } = event;
    updateEnableSelection(keyCode === 16);
  }, []);

  const onKeyUp = useCallback(() => {
    updateEnableSelection(false);
  }, []);

  const onClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (enableSelection) {
      const { controls } = controlsRef.current;
      const draggableObjects = controls.getObjects();
      draggableObjects.length = 0;
      controls.transformGroup = false;
      draggableObjects.push(...objects);
    }
    render();
  }, [enableSelection]);

  useEffect(() => {
    rendererRef.current.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
    const { renderer } = rendererRef.current;
    controlsRef.current.controls = new DragControls([...objects], camera, renderer.domElement);
    const { controls } = controlsRef.current;
    window.addEventListener('resize', onWindowResize);
    controls.addEventListener('drag', render);
    resizeRendererAndCamera();
    render();
    return () => {
      window.removeEventListener('resize', onWindowResize);
      controls.removeEventListener('drag', render);
    };
  }, []);

  return (
    <section className={style.container} ref={containerRef} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onClick={onClick}>
      <canvas ref={canvasRef} />
    </section>
  );
};

Drag.displayName = 'Three-Drag';

export default safeCrash(Drag);
