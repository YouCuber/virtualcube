import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

// �V�[���A�J�����A�����_���[�̍쐬
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ���[�r�b�N�L���[�u�̍쐬
const cubeGroup = new THREE.Group();
const cubeSize = 1.0;
const spacing = 0.1;
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0xffffff];

// �L���[�u�S�̂�z��Ɋi�[
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

// �e���̒����� 50 �{�ɃX�P�[��
const axisLength = 50; 

// ���[�r�b�N�L���[�u�̒��S
const center = new THREE.Vector3(0, 0, 0);

// x��
const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), center, axisLength, 0xff0000);
scene.add(xAxis);

// y��
const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), center, axisLength, 0x00ff00);
scene.add(yAxis);

// z��
const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), center, axisLength, 0x0000ff);
scene.add(zAxis);

// �J�����ʒu���E��O��ɐݒ�
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// OrbitControls��ǉ����ă}�E�X�����L����
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // ���炩�ȑ����L���ɂ���
controls.dampingFactor = 0.1; // �����̋����𒲐�
controls.update();

// �A�j���[�V�������[�v
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // �R���g���[�����X�V
  renderer.render(scene, camera);
}
animate();

// �L�[�{�[�h�C�x���g�ŉE�[�L���[�u9����]
document.addEventListener('keydown', (event) => {
  if (event.key === 'r') {
    // ���ׂẴL���[�u�̒��S����������O���[�o���� x ������ɁA�E�[�̃L���[�u���擾
    const rightCubes = cubelets.filter(cubelet => cubelet.position.x > 0.9);

    // ��]�p�̃A�j���[�V�����ݒ�
    const targetRotation = Math.PI / 2; // 90�x
    const rotationAxis = new THREE.Vector3(1, 0, 0); // x��
    const duration = 500; // �~���b
    let startTime = null;

    function rotate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const t = Math.min(elapsedTime / duration, 1); // ���`���
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
    // Shift + r �L�[�Ŕ��΂� 90�x��]
    const rightCubes = cubelets.filter(cubelet => cubelet.position.x > 0.9);
    const targetRotation = -Math.PI / 2; // �t���� 90�x
    const rotationAxis = new THREE.Vector3(1, 0, 0); // x��
    const duration = 500; // �~���b
    let startTime = null;

    function rotate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const t = Math.min(elapsedTime / duration, 1); // ���`���
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
