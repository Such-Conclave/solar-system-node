import * as THREE from "three";

type Lights = [THREE.AmbientLight, THREE.PointLight];

export const createLights = (): Lights => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

  // Point Light.
  const pointLight = new THREE.PointLight(0xf4e99b, 1);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 4096;
  pointLight.shadow.mapSize.height = 4096;
  pointLight.shadow.camera.near = 1.5;
  pointLight.shadow.camera.far = 15;
  pointLight.shadow.radius = 16;

  return [ambientLight, pointLight];
};
