/**
 * Space Carnival canvas scene — a lifecycle-safe transparent Babylon layer kept deliberately mesh-free.
 * Visible stars, orbits, and mission motion are rendered by lightweight CSS and dotLottie assets so the
 * game remains robust in constrained WebGL environments without shader compilation noise.
 */
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Engine } from "@babylonjs/core/Engines/engine";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Scene } from "@babylonjs/core/scene";

export interface GameHandle {
  scene: Scene;
  dispose: () => void;
}

export async function createGameScene(engine: Engine, _canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0);
  scene.autoClear = true;
  const camera = new FreeCamera("space-carnival-passive-camera", new Vector3(0, 0, -10), scene);
  camera.setTarget(Vector3.Zero());

  return {
    scene,
    dispose: () => scene.dispose(),
  };
}
