import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubeGroup = new THREE.Group();
const cubeSize = 1.0;
const spacing = 0.1;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0xffffff];

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));
      const cubelet = new THREE.Mesh(geometry, materials);
      cubelet.position.set(x * (cubeSize + spacing), y * (cubeSize + spacing), z * (cubeSize + spacing));
      cubeGroup.add(cubelet);
    }
  }
}

scene.add(cubeGroup);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
