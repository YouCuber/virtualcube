import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

// シーン、カメラ、レンダラーの作成
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ルービックキューブの作成
const cubeGroup = new THREE.Group();
const cubeSize = 1.0;
const spacing = 0.1;
const colors = [0xffa500, 0xff2020, 0xffff00, 0xe0e0e0, 0x00ff00, 0x3030ff];

// キューブ全体を配列に格納
const cubelets = [];
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));
      const cubelet = new THREE.Mesh(geometry, materials);
      cubelet.position.set(x * (cubeSize + spacing), y * (cubeSize + spacing), z * (cubeSize + spacing));
      cubeGroup.add(cubelet);
      cubelets.push(cubelet);
    }
  }
}

scene.add(cubeGroup);

// カメラ位置を右手前上に設定
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// OrbitControlsを追加してマウス操作を有効化
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 滑らかな操作を有効にする
controls.dampingFactor = 0.1; // 減衰の強さを調整
controls.update();

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // コントロールを更新
  renderer.render(scene, camera);
}
animate();

// キーボードイベントで右端キューブ9つを回転
document.addEventListener('keydown', (event) => {
  if (event.key === 'r') {
    // 右端のキューブを取得（x座標が最大値のもの）
    const rightCubes = cubelets.filter(cubelet => cubelet.position.x > 0.9);

    // 回転用のアニメーション設定
    const targetRotation = Math.PI / 2; // 90度
    const rotationAxis = new THREE.Vector3(1, 0, 0); // x軸
    const duration = 500; // ミリ秒
    let startTime = null;

    function rotate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const t = Math.min(elapsedTime / duration, 1); // 線形補間
      const angle = targetRotation * t;

      rightCubes.forEach(cubelet => {
        cubelet.rotateOnWorldAxis(rotationAxis, angle);
      });

      if (t < 1) {
        requestAnimationFrame(rotate);
      }
    }

    requestAnimationFrame(rotate);
  } else if (event.key === 'r' && event.shiftKey) {
    // Shift + r キーで反対に 90度回転
    const rightCubes = cubelets.filter(cubelet => cubelet.position.x > 0.9);
    const targetRotation = -Math.PI / 2; // 逆方向 90度
    const rotationAxis = new THREE.Vector3(1, 0, 0); // x軸
    const duration = 500; // ミリ秒
    let startTime = null;

    function rotate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const t = Math.min(elapsedTime / duration, 1); // 線形補間
      const angle = targetRotation * t;

      rightCubes.forEach(cubelet => {
        cubelet.rotateOnWorldAxis(rotationAxis, angle);
      });

      if (t < 1) {
        requestAnimationFrame(rotate);
      }
    }

    requestAnimationFrame(rotate);
  }
});

// ルービックキューブの中心から x, y, z 軸を表示
const center = new THREE.Vector3(0, 0, 0);
const axisLength = 200;

// x軸
const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), center, axisLength, 0xff0000);
scene.add(xAxis);

// y軸
const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), center, axisLength, 0x00ff00);
scene.add(yAxis);

// z軸
const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), center, axisLength, 0x0000ff);
scene.add(zAxis);