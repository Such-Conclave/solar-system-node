import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { LAYERS } from "../constants";

export interface PointOfInterest {
  name: string;
  y: number;
  z: number;
  type?: string;
}

export class Label {
  parent: THREE.Object3D;
  parentRadius: number;
  elements: CSS2DObject[];

  constructor(parent: THREE.Object3D, parentRadius: number) {
    this.parent = parent;
    this.parentRadius = parentRadius;
    this.elements = [];
  }

  createPOILabel = (poi: PointOfInterest) => {
    const container = document.createElement("div");
    container.className = "label";

    if (poi.type) {
      const img = document.createElement("img");
      img.src = `./icons/${poi.type}.svg`;
      container.appendChild(img);
    }

    const text = document.createElement("p");
    text.textContent = poi.name;
    container.appendChild(text);

    const label = new CSS2DObject(container);
    label.center.set(0, 0);
    label.layers.set(LAYERS.POILabel);
    label.layers.disable(LAYERS.POILabel);

    const labelPosition = this.rotateLabel(poi.y, poi.z).toArray();
    label.position.set(...labelPosition);

    this.parent.add(label);
    this.elements.push(label);
  };

  showPOI = () => {
    this.elements.forEach((label) => {
      label.layers.enable(LAYERS.POILabel);
    });
  };

  hidePOI = () => {
    this.elements.forEach((label) => {
      label.layers.disable(LAYERS.POILabel);
    });
  };

  update = (camera: THREE.Camera) => {
    this.elements.forEach((label) => {
      const rotationOpacity = this.getRotationOpacity(camera, label);
      const distanceOpacity = this.getDistanceOpacity(camera);
      const opacity = rotationOpacity * distanceOpacity;
      label.element.style.opacity = opacity.toString();
    });
  };

  rotateLabel = (y: number, z: number) => {
    const vector = new THREE.Vector3(this.parentRadius, 0, 0);
    vector.applyAxisAngle(new THREE.Vector3(0, 1, 0), y);
    vector.applyAxisAngle(new THREE.Vector3(0, 0, 1), z);
    return vector;
  };

  getRotationOpacity = (camera: THREE.Camera, label: CSS2DObject): number => {
    const hideThreshold = 1;
    const fadeThreshold = 0.75;
    const cameraVector = camera.position.clone().normalize();
    const labelVector = label.position.clone().normalize();
    const delta = Math.acos(cameraVector.dot(labelVector));

    if (delta > hideThreshold) {
      return 0;
    } else if (delta > fadeThreshold) {
      return (hideThreshold - delta) / (hideThreshold - fadeThreshold);
    } else {
      return 1;
    }
  };

  getDistanceOpacity = (camera: THREE.Camera): number => {
    const hideThreshold = this.parentRadius * 12;
    const fadeThreshold = this.parentRadius * 8;
    const distance = camera.position.length();

    if (distance > hideThreshold) {
      return 0;
    } else if (distance > fadeThreshold) {
      return (hideThreshold - distance) / (hideThreshold - fadeThreshold);
    } else {
      return 1;
    }
  };
}
