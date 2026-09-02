import { useEffect, useRef, type KeyboardEvent } from "react";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Color3, Color4, Vector3 } from "@babylonjs/core/Maths/math";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/core/Rendering/edgesRenderer";
import { Scene } from "@babylonjs/core/scene";
import type { Shape3dId } from "@/game/shapes";

type StudioProps = { shapeId: Shape3dId; accent: string; resetKey: number; onInteract?: () => void };

const parseColor = (hex: string) => Color3.FromHexString(hex);

export default function ShapeStudioCanvas({ shapeId, accent, resetKey, onInteract }: StudioProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const startedRef = useRef(false);
  const orbitRadiansRef = useRef(0);
  const sceneGenerationRef = useRef(0);
  const resetCountRef = useRef(0);
  const idleMotionPauseUntilRef = useRef(0);
  const idleMotionBlendRef = useRef(1);
  const idleMotionFrameRef = useRef(0);

  const yieldIdleMotion = () => {
    idleMotionPauseUntilRef.current = performance.now() + 1800;
    if (canvasRef.current) canvasRef.current.dataset.idleMotionState = "yielding";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    const camera = new ArcRotateCamera("shapes-orbit-camera", -Math.PI / 2.8, Math.PI / 2.55, 8.2, Vector3.Zero(), scene);
    camera.lowerRadiusLimit = 5.2; camera.upperRadiusLimit = 11; camera.lowerBetaLimit = 0.1; camera.upperBetaLimit = Math.PI - 0.1;
    camera.lowerAlphaLimit = null; camera.upperAlphaLimit = null;
    camera.wheelDeltaPercentage = 0.015; camera.panningSensibility = 0; camera.attachControl(canvas, true);
    const skyLight = new HemisphericLight("shapes-sky-light", new Vector3(0, 1, 0), scene); skyLight.intensity = 0.96; skyLight.diffuse = new Color3(0.67, 0.9, 1); skyLight.groundColor = new Color3(0.2, 0.1, 0.38);
    const pinkLight = new PointLight("shapes-pink-light", new Vector3(-4.8, 4.5, -3), scene); pinkLight.diffuse = new Color3(1, 0.55, 0.7); pinkLight.intensity = 10;
    const cyanLight = new PointLight("shapes-cyan-light", new Vector3(4.4, 3.8, -4), scene); cyanLight.diffuse = new Color3(0.42, 0.84, 0.95); cyanLight.intensity = 11;
    const goldLight = new PointLight("shapes-gold-light", new Vector3(3.7, -2, 3.4), scene); goldLight.diffuse = new Color3(1, 0.8, 0.42); goldLight.intensity = 7;
    const glow = new GlowLayer("shapes-glow", scene); glow.intensity = 0.42;
    engineRef.current = engine; sceneRef.current = scene; cameraRef.current = camera;
    sceneGenerationRef.current += 1;
    canvas.dataset.sceneGeneration = String(sceneGenerationRef.current);
    let lastTouchX: number | null = null;
    let lastTouchY: number | null = null;
    let touchCameraRadians = 0;
    const recordOrbit = (radians: number) => { orbitRadiansRef.current += radians; canvas.dataset.orbitRadians = orbitRadiansRef.current.toFixed(3); };
    const onPointerDown = (event: PointerEvent) => { yieldIdleMotion(); if (event.pointerType === "touch") { canvas.dataset.touchOrbit = "true"; lastTouchX = event.clientX; lastTouchY = event.clientY; } onInteract?.(); };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || lastTouchX === null || lastTouchY === null) return;
      yieldIdleMotion();
      const signedDeltaX = event.clientX - lastTouchX;
      const signedDeltaY = event.clientY - lastTouchY;
      const cameraRadians = (signedDeltaX / Math.max(canvas.clientWidth, 1)) * Math.PI * 2;
      const betaRadians = -(signedDeltaY / Math.max(canvas.clientHeight, 1)) * Math.PI * 0.95;
      const activeCamera = cameraRef.current;
      if (activeCamera) {
        activeCamera.alpha += cameraRadians;
        activeCamera.beta = Math.max(activeCamera.lowerBetaLimit ?? 0.1, Math.min(activeCamera.upperBetaLimit ?? Math.PI - 0.1, activeCamera.beta + betaRadians));
        canvas.dataset.cameraAlpha = activeCamera.alpha.toFixed(3);
        canvas.dataset.cameraBeta = activeCamera.beta.toFixed(3);
      }
      touchCameraRadians += Math.abs(cameraRadians);
      canvas.dataset.touchCameraRadians = touchCameraRadians.toFixed(3);
      recordOrbit(Math.abs(cameraRadians));
      lastTouchX = event.clientX;
      lastTouchY = event.clientY;
    };
    const onPointerEnd = () => { lastTouchX = null; lastTouchY = null; };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerEnd);
    canvas.addEventListener("pointercancel", onPointerEnd);
    const resize = () => engine.resize(); window.addEventListener("resize", resize);
    engine.runRenderLoop(() => scene.render());
    return () => { canvas.removeEventListener("pointerdown", onPointerDown); canvas.removeEventListener("pointermove", onPointerMove); canvas.removeEventListener("pointerup", onPointerEnd); canvas.removeEventListener("pointercancel", onPointerEnd); window.removeEventListener("resize", resize); scene.dispose(); engine.dispose(); engineRef.current = null; sceneRef.current = null; cameraRef.current = null; startedRef.current = false; };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.meshes.filter((mesh) => mesh.name.startsWith("shape-model") || mesh.name.startsWith("shape-vertex") || mesh.name.startsWith("shape-depth-particle") || mesh.name.startsWith("shape-feature")).forEach((mesh) => mesh.dispose());
    scene.materials.filter((material) => material.name.startsWith("shape-model") || material.name.startsWith("shape-vertex") || material.name.startsWith("shape-depth-particle") || material.name.startsWith("shape-feature")).forEach((material) => material.dispose());
    const material = new StandardMaterial("shape-model-material", scene);
    const color = parseColor(accent); material.diffuseColor = color.scale(0.9); material.emissiveColor = color.scale(0.18); material.specularColor = new Color3(0.62, 0.68, 0.82); material.specularPower = 104; material.useSpecularOverAlpha = true; material.alpha = 0.96; material.backFaceCulling = false;
    const lightScale = shapeId === "cube" ? 0.36 : 0.28;
    const skyLight = scene.getLightByName("shapes-sky-light"); if (skyLight) skyLight.intensity = shapeId === "cube" ? 0.52 : 0.44;
    const pinkLight = scene.getLightByName("shapes-pink-light"); if (pinkLight) pinkLight.intensity = 10 * lightScale;
    const cyanLight = scene.getLightByName("shapes-cyan-light"); if (cyanLight) cyanLight.intensity = 11 * lightScale;
    const goldLight = scene.getLightByName("shapes-gold-light"); if (goldLight) goldLight.intensity = 7 * lightScale;
    let mesh;
    if (shapeId === "cube") mesh = MeshBuilder.CreateBox("shape-model-cube", { size: 3.2 }, scene);
    else if (shapeId === "rectangular-prism") mesh = MeshBuilder.CreateBox("shape-model-rectangular-prism", { width: 4.2, height: 2.6, depth: 2.7 }, scene);
    else if (shapeId === "sphere") mesh = MeshBuilder.CreateSphere("shape-model-sphere", { diameter: 3.65, segments: 32 }, scene);
    else if (shapeId === "hemisphere") { mesh = MeshBuilder.CreateSphere("shape-model-hemisphere", { diameter: 3.65, segments: 32, slice: 0.5 }, scene); mesh.position.y = -0.92; }
    else if (shapeId === "cylinder") mesh = MeshBuilder.CreateCylinder("shape-model-cylinder", { height: 4, diameter: 2.8, tessellation: 40 }, scene);
    else if (shapeId === "cone") mesh = MeshBuilder.CreateCylinder("shape-model-cone", { height: 4.25, diameterTop: 0, diameterBottom: 3.3, tessellation: 40 }, scene);
    else if (shapeId === "square-pyramid") mesh = MeshBuilder.CreateCylinder("shape-model-square-pyramid", { height: 4.1, diameterTop: 0, diameterBottom: 3.9, tessellation: 4 }, scene);
    else if (shapeId === "triangular-pyramid") mesh = MeshBuilder.CreateCylinder("shape-model-triangular-pyramid", { height: 4.1, diameterTop: 0, diameterBottom: 3.9, tessellation: 3 }, scene);
    else if (shapeId === "triangular-prism") { mesh = MeshBuilder.CreateCylinder("shape-model-triangular-prism", { height: 4.2, diameterTop: 3.25, diameterBottom: 3.25, tessellation: 3 }, scene); mesh.rotation.z = Math.PI / 2; }
    else if (shapeId === "pentagonal-prism") mesh = MeshBuilder.CreateCylinder("shape-model-pentagonal-prism", { height: 4.15, diameterTop: 3.4, diameterBottom: 3.4, tessellation: 5 }, scene);
    else if (shapeId === "pentagonal-pyramid") mesh = MeshBuilder.CreateCylinder("shape-model-pentagonal-pyramid", { height: 4.2, diameterTop: 0, diameterBottom: 4, tessellation: 5 }, scene);
    else mesh = MeshBuilder.CreateTorus("shape-model-torus", { diameter: 3.8, thickness: 1.15, tessellation: 40 }, scene);
    const edgeTint = new Color4(Math.min(1, color.r * 0.9 + 0.1), Math.min(1, color.g * 0.9 + 0.1), Math.min(1, color.b * 0.9 + 0.1), 0.96);
    mesh.material = material; mesh.enableEdgesRendering(); mesh.edgesWidth = 3.5; mesh.edgesColor = edgeTint;
    mesh.rotation.y = 0.42;
    const baseYaw = mesh.rotation.y;
    const boundaryMaterial = new StandardMaterial("shape-feature-boundary-material", scene);
    boundaryMaterial.diffuseColor = color.scale(0.68); boundaryMaterial.emissiveColor = color.scale(0.44); boundaryMaterial.specularColor = new Color3(1, 1, 1); boundaryMaterial.specularPower = 96; boundaryMaterial.alpha = 0.98; boundaryMaterial.disableLighting = true; boundaryMaterial.backFaceCulling = false;
    const faceMaterial = new StandardMaterial("shape-feature-face-material", scene);
    faceMaterial.diffuseColor = color.scale(0.42); faceMaterial.emissiveColor = color.scale(0.28); faceMaterial.specularColor = new Color3(0.18, 0.2, 0.26); faceMaterial.specularPower = 32; faceMaterial.alpha = 0.95; faceMaterial.disableLighting = true; faceMaterial.backFaceCulling = false;
    const addRim = (name: string, diameter: number, y: number) => {
      const rim = MeshBuilder.CreateTorus(`shape-feature-${name}`, { diameter, thickness: 0.07, tessellation: 40 }, scene);
      rim.position.y = y; rim.material = boundaryMaterial;
    };
    const addFaceCap = (name: string, radius: number, y: number) => {
      const cap = MeshBuilder.CreateDisc(`shape-feature-${name}`, { radius, tessellation: 40 }, scene);
      cap.rotation.x = -Math.PI / 2; cap.position.y = y; cap.material = faceMaterial;
    };
    if (shapeId === "hemisphere") { addFaceCap("hemisphere-flat-face", 1.825, -0.92); addRim("hemisphere-flat-rim", 3.67, -0.92); }
    if (shapeId === "cylinder") { addFaceCap("cylinder-top-face", 1.4, 2); addFaceCap("cylinder-bottom-face", 1.4, -2); addRim("cylinder-top-rim", 2.82, 2); addRim("cylinder-bottom-rim", 2.82, -2); }
    if (shapeId === "cone") { addFaceCap("cone-base-face", 1.65, -2.125); addRim("cone-base-rim", 3.32, -2.125); }
    const vertexMaterial = new StandardMaterial("shape-vertex-material", scene);
    vertexMaterial.diffuseColor = new Color3(1, 0.78, 0.22); vertexMaterial.emissiveColor = new Color3(1, 0.48, 0.08);
    const marker = (position: Vector3, index: string) => {
      const dot = MeshBuilder.CreateSphere(`shape-vertex-${shapeId}-${index}`, { diameter: 0.23, segments: 12 }, scene);
      dot.parent = mesh; dot.position = position; dot.material = vertexMaterial;
    };
    const meshRingVertices = (targetY: number) => {
      const positions = mesh.getVerticesData("position") ?? [];
      const unique = new Map<string, Vector3>();
      for (let index = 0; index < positions.length; index += 3) {
        const x = positions[index]; const y = positions[index + 1]; const z = positions[index + 2];
        if (Math.abs(y - targetY) > 0.025 || Math.hypot(x, z) < 0.1) continue;
        const key = `${x.toFixed(3)}:${y.toFixed(3)}:${z.toFixed(3)}`;
        if (!unique.has(key)) unique.set(key, new Vector3(x, y, z));
      }
      return Array.from(unique.values());
    };
    const meshExtents = mesh.getBoundingInfo().boundingBox.extendSize;
    const markerRing = (y: number, prefix: string) => meshRingVertices(y).forEach((position, index) => marker(position, `${prefix}-${index}`));
    if (shapeId === "cube") [-1, 1].forEach((x) => [-1, 1].forEach((y) => [-1, 1].forEach((z) => marker(new Vector3(x * 1.6, y * 1.6, z * 1.6), `${x}${y}${z}`))));
    if (shapeId === "rectangular-prism") [-1, 1].forEach((x) => [-1, 1].forEach((y) => [-1, 1].forEach((z) => marker(new Vector3(x * 2.1, y * 1.3, z * 1.35), `${x}${y}${z}`))));
    if (shapeId === "cone") marker(new Vector3(0, 2.12, 0), "tip");
    if (shapeId === "square-pyramid" || shapeId === "triangular-pyramid" || shapeId === "pentagonal-pyramid") { marker(new Vector3(0, meshExtents.y, 0), "tip"); markerRing(-meshExtents.y, "base"); }
    if (shapeId === "triangular-prism" || shapeId === "pentagonal-prism") { markerRing(-meshExtents.y, "front"); markerRing(meshExtents.y, "back"); }
    if (canvasRef.current) { canvasRef.current.dataset.vertexMarkerGeometry = "mesh-derived"; canvasRef.current.dataset.vertexMarkerCount = String(scene.meshes.filter((item) => item.name.startsWith(`shape-vertex-${shapeId}-`)).length); }
    const depthParticleMaterial = new StandardMaterial("shape-depth-particle-material", scene);
    depthParticleMaterial.diffuseColor = color.scale(0.72); depthParticleMaterial.emissiveColor = color.scale(0.48); depthParticleMaterial.alpha = 0.48; depthParticleMaterial.disableLighting = true;
    const depthParticles = Array.from({ length: 13 }, (_, index) => {
      const particle = MeshBuilder.CreateSphere(`shape-depth-particle-${shapeId}-${index}`, { diameter: 0.075, segments: 8 }, scene);
      particle.material = depthParticleMaterial;
      return { particle, phase: (index * 0.163) % 1, lateralX: ((index * 37) % 11 - 5) / 5, lateralY: ((index * 19) % 9 - 4) / 5, speed: 0.115 + (index % 4) * 0.018 };
    });
    if (canvasRef.current) { canvasRef.current.dataset.depthParticleCount = String(depthParticles.length); canvasRef.current.dataset.glassReflection = "active"; }
    const animationStartedAt = performance.now();
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    idleMotionFrameRef.current = animationStartedAt;
    if (canvasRef.current) canvasRef.current.dataset.idleMotion = prefersReducedMotion ? "reduced" : "active";
    const animationObserver = scene.onBeforeRenderObservable.add(() => {
      if (mesh.isDisposed()) return;
      const now = performance.now();
      const seconds = (now - animationStartedAt) / 1000;
      const elapsed = Math.min(0.08, Math.max(0, (now - idleMotionFrameRef.current) / 1000));
      idleMotionFrameRef.current = now;
      const motionTarget = !prefersReducedMotion && now >= idleMotionPauseUntilRef.current ? 1 : 0;
      idleMotionBlendRef.current += (motionTarget - idleMotionBlendRef.current) * Math.min(1, elapsed * 7);
      const idleBlend = idleMotionBlendRef.current;
      mesh.rotation.y = baseYaw + Math.sin(seconds * 0.66) * 0.22 * idleBlend;
      const pinkLight = scene.getLightByName("shapes-pink-light") as PointLight | null;
      const cyanLight = scene.getLightByName("shapes-cyan-light") as PointLight | null;
      const goldLight = scene.getLightByName("shapes-gold-light") as PointLight | null;
      if (pinkLight) pinkLight.position.set(-4.8 + Math.sin(seconds * 0.62) * 0.62 * idleBlend, 4.5 + Math.cos(seconds * 0.7) * 0.3 * idleBlend, -3 + Math.cos(seconds * 0.56) * 0.45 * idleBlend);
      if (cyanLight) cyanLight.position.set(4.4 + Math.cos(seconds * 0.58) * 0.58 * idleBlend, 3.8 + Math.sin(seconds * 0.68) * 0.25 * idleBlend, -4 + Math.sin(seconds * 0.61) * 0.42 * idleBlend);
      if (goldLight) goldLight.position.set(3.7 + Math.sin(seconds * 0.72) * 0.35 * idleBlend, -2 + Math.cos(seconds * 0.6) * 0.22 * idleBlend, 3.4 + Math.cos(seconds * 0.66) * 0.32 * idleBlend);
      material.emissiveColor = color.scale(0.13 + Math.sin(seconds * 1.7) * 0.02 * idleBlend);
      if (canvasRef.current) { canvasRef.current.dataset.idleMotionState = prefersReducedMotion ? "reduced" : idleBlend < 0.08 ? "yielding" : motionTarget ? "active" : "settling"; canvasRef.current.dataset.idleMotionYaw = (mesh.rotation.y - baseYaw).toFixed(4); }
      const cameraPosition = cameraRef.current?.position ?? new Vector3(4, 4, -6);
      const forward = cameraPosition.normalize();
      const right = Vector3.Cross(Vector3.Up(), forward).normalize();
      const up = Vector3.Cross(forward, right).normalize();
      depthParticles.forEach(({ particle, phase, lateralX, lateralY, speed }) => {
        if (particle.isDisposed()) return;
        const travel = (phase + seconds * speed) % 1;
        const far = forward.scale(0.65).add(right.scale(lateralX * 1.2)).add(up.scale(lateralY * 0.78));
        const near = forward.scale(6.2).add(right.scale(lateralX * 3.35)).add(up.scale(lateralY * 2.05));
        particle.position.copyFrom(Vector3.Lerp(far, near, travel));
        const scale = 0.46 + travel * 0.84;
        particle.scaling.setAll(scale);
        particle.visibility = travel < 0.8 ? (1 - travel / 0.8) * 0.45 : 0;
      });
    });
    return () => { scene.onBeforeRenderObservable.remove(animationObserver); };
  }, [shapeId, accent]);

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    yieldIdleMotion();
    camera.alpha = -Math.PI / 2.8; camera.beta = Math.PI / 2.55; camera.radius = 8.2;
    if (canvasRef.current) { resetCountRef.current += 1; canvasRef.current.dataset.resetViewCount = String(resetCountRef.current); canvasRef.current.dataset.cameraAlpha = camera.alpha.toFixed(3); canvasRef.current.dataset.cameraBeta = camera.beta.toFixed(3); canvasRef.current.dataset.cameraRadius = camera.radius.toFixed(3); }
  }, [resetKey]);

  const orbit = (alpha: number, beta = 0) => {
    const camera = cameraRef.current;
    if (!camera) return;
    yieldIdleMotion();
    camera.alpha += alpha;
    orbitRadiansRef.current += Math.abs(alpha);
    canvasRef.current?.setAttribute("data-orbit-radians", orbitRadiansRef.current.toFixed(3));
    camera.beta = Math.max(camera.lowerBetaLimit ?? 0.1, Math.min(camera.upperBetaLimit ?? Math.PI - 0.1, camera.beta + beta));
    canvasRef.current?.setAttribute("data-camera-beta", camera.beta.toFixed(3));
    onInteract?.();
  };
  const zoom = (distance: number) => {
    const camera = cameraRef.current;
    if (!camera) return;
    yieldIdleMotion();
    camera.radius = Math.max(camera.lowerRadiusLimit ?? 5.2, Math.min(camera.upperRadiusLimit ?? 11, camera.radius + distance));
    canvasRef.current?.setAttribute("data-camera-radius", camera.radius.toFixed(3));
    onInteract?.();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); orbit(-0.22); }
    if (event.key === "ArrowRight") { event.preventDefault(); orbit(0.22); }
    if (event.key === "ArrowUp") { event.preventDefault(); orbit(0, -0.16); }
    if (event.key === "ArrowDown") { event.preventDefault(); orbit(0, 0.16); }
  };

  return <div className="shapes-canvas-control-wrap"><canvas ref={canvasRef} className="shapes-studio-canvas" data-orbit-radians="0" data-touch-orbit="false" data-camera-alpha="0" data-camera-beta="0" data-camera-radius="8.2" data-touch-camera-radians="0" data-scene-generation="0" data-reset-view-count="0" data-solid-treatment="faceted-glass" data-glass-system="cube-standard" data-energy-ring="removed" data-depth-particle-count="0" data-idle-motion="active" data-idle-motion-state="active" data-idle-motion-yaw="0" tabIndex={0} onKeyDown={onKeyDown} aria-label="Interactive 3D shape viewer. Drag left or right to turn around the solid, drag up or down to view it from above or below, or use the arrow keys to rotate the selected solid." /><div className="shapes-zoom-controls" aria-label="3D shape zoom controls"><button onClick={() => zoom(-0.8)} aria-label="Zoom in on shape">+</button><button onClick={() => zoom(0.8)} aria-label="Zoom out from shape">−</button></div><div className="shapes-orbit-controls" aria-label="3D shape rotation controls"><button onClick={() => orbit(-0.22)} aria-label="Rotate shape left">←</button><button onClick={() => orbit(0, -0.16)} aria-label="Tilt shape up">↑</button><button onClick={() => orbit(0, 0.16)} aria-label="Tilt shape down">↓</button><button onClick={() => orbit(0.22)} aria-label="Rotate shape right">→</button></div></div>;
}
