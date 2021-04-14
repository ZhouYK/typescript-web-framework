import {
  CatmullRomCurve3, Line, Object3D, Scene,
} from 'three';
import * as THREE from 'three';
import {
  useCallback, useRef, useState,
} from 'react';

const useLine = (scene: Scene, ARC_SEGMENTS: number) => {
  const createCurve3 = useCallback((obj3dArr: Object3D[]) => new THREE.CatmullRomCurve3(obj3dArr.map((obj) => obj.position)), []);
  const [point] = useState(() => new THREE.Vector3());
  const creLine = useCallback((c3: CatmullRomCurve3) => {
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(c3.getPoints(ARC_SEGMENTS - 1));
    return new THREE.Line(curveGeometry, new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35,
    }));
  }, []);

  const lineRef = useRef<Line>();
  const curve3Ref = useRef<CatmullRomCurve3>();

  const createLine = useCallback((object3dArr: Object3D[]) => {
    if (lineRef.current) {
      scene.remove(lineRef.current);
    }
    if (object3dArr.length <= 1) {
      return;
    }
    const curve3 = createCurve3(object3dArr);
    const line = creLine(curve3);
    lineRef.current = line;
    curve3Ref.current = curve3;
    scene.add(line);
  }, []);

  const updateLinePositions = useCallback(() => {
    const curveLineMesh = lineRef.current;
    if (!curveLineMesh) return;
    const curve = curve3Ref.current;
    const linePositions = curveLineMesh.geometry.attributes.position;
    for (let i = 0; i < ARC_SEGMENTS; i += 1) {
      const t = i / (ARC_SEGMENTS - 1);
      curve.getPoint(t, point);
      linePositions.setXYZ(i, point.x, point.y, point.z);
    }
    linePositions.needsUpdate = true;
  }, []);
  return {
    lineRef, curve3Ref, createLine, updateLinePositions,
  };
};

export default useLine;
