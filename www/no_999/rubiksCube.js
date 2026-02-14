//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// シーン、カメラ、レンダラーの初期化
// --- 修正後：最初から「半分」を意識して作る ---

// 1. まずサイズを計算しておく
const width = window.innerWidth;
const height = window.innerHeight / 2; // 「半分」であることを変数にする

const scene = new THREE.Scene();

// 2. カメラのアスペクト比を「半分」のサイズで計算する（ここが一番重要！）
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });

// 3. レンダラーのサイズを半分にする（ユーザーさんのコードと同じ内容）
renderer.setSize(width, height);

// 4. 指定したコンテナの中に入れる（これもユーザーさんのコードと同じ内容）
const container = document.getElementById('canvasContainer');
container.appendChild(renderer.domElement);
// カメラ位置を設定
camera.position.set(3.0, 2.5, 4.0); 
//camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// 面のサイズ
const faceSize = 0.9; // 面のサイズを0.9倍に変更

// 面の色
const colors = {
    white: 0xffffff,  // 上面
    red: 0xff0000,    // 右面
    blue: 0x0000ff,   // 左面
    green: 0x00ff00,  // 前面
    orange: 0xff2f00, // 背面
    yellow: 0xffff00  // 下面
};

// 各面の9枚の面を作成
function createFace(color, x, y, z, rotationX, rotationY, rotationZ) {
    const geometry = new THREE.PlaneGeometry(faceSize, faceSize); // 面のサイズを変更
    const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const face = new THREE.Mesh(geometry, material);
    face.position.set(x, y, z);
    face.rotation.set(rotationX, rotationY, rotationZ);
    return face;
}

function createFaceWithNumber(number, color, x, y, z, rotationX, rotationY, rotationZ) {
    // Canvas を作成
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');

    // 背景を塗りつぶし
    const hexString = `#${color.toString(16).padStart(6, '0')}`;
    context.fillStyle = hexString;
    context.fillRect(0, 0, canvas.width, canvas.height); // 背景色を塗りつぶし

    // 番号を描画
    context.fillStyle = '#000000';
    context.font = '96px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
//    context.fillText(number, canvas.width / 2, canvas.height / 2);

    // Canvas をテクスチャに変換
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true; // テクスチャ更新を有効化

    // 面を作成
    const geometry = new THREE.PlaneGeometry(faceSize, faceSize);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const face = new THREE.Mesh(geometry, material);

    // 位置と回転を設定
    face.position.set(x, y, z);
    face.rotation.set(rotationX, rotationY, rotationZ);

    // シーンに追加して表示
    scene.add(face);

    return face;
}

// 各面を格納する配列
const faces = {
    white: [], // 下面
    red: [],   // 左面
    yellow: [], // 上面
    blue: [],  // 背面
    green: [], // 前面
    orange: []  // 右面
};

// 各面の9枚の面を作成
function createCubeFaces() {
    // 上面 (黄色)
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3) - 1;
        const col = i % 3 - 1;
        faces.yellow.push(createFaceWithNumber(i, colors.yellow, col, 1.5, row, -Math.PI / 2, 0, 0)); // 上面はY軸方向に向ける
    }
    // 右面 (オレンジ)
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3) - 1;
        const col = i % 3 - 1;
        faces.orange.push(createFaceWithNumber(i, colors.orange, 1.5, row, col, 0, Math.PI / 2, 0)); // 右面はX軸方向に向ける
    }
    // 下面 (白)
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3) - 1;
        const col = i % 3 - 1;
        faces.white.push(createFaceWithNumber(i, colors.white, col, -1.5, row, Math.PI / 2, 0, 0)); // 下面はY軸方向に向ける
    }
    // 背面 (青)
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3) - 1;
        const col = i % 3 - 1;
        faces.blue.push(createFaceWithNumber(i, colors.blue, col, row, -1.5, 0, Math.PI, 0)); // 背面はZ軸方向に向ける
    }
    // 前面 (緑)
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3) - 1;
        const col = i % 3 - 1;
        faces.green.push(createFaceWithNumber(i, colors.green, col, row, 1.5, 0, 0, 0)); // 前面はZ軸方向に向ける
    }
    // 左面 (赤)
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3) - 1;
        const col = i % 3 - 1;
        faces.red.push(createFaceWithNumber(i, colors.red, -1.5, row, col, 0, -Math.PI / 2, 0)); // 左面はX軸方向に向ける
    }
}

// 元の色を保持するための変数
const originalColors = {
    0: [],  // cubeGroups[6]の元の色
    1: [],  // cubeGroups[6]の元の色
    2: [],  // cubeGroups[6]の元の色
    3: [],  // cubeGroups[6]の元の色
    4: [],  // cubeGroups[6]の元の色
    5: [],  // cubeGroups[6]の元の色
    6: [],  // cubeGroups[6]の元の色
    7: [],  // cubeGroups[6]の元の色
    8: [],  // cubeGroups[6]の元の色
    9: [],  // cubeGroups[6]の元の色
    10: [],  // cubeGroups[6]の元の色
    11: [],   // cubeGroups[7]の元の色
    12: [],   // cubeGroups[7]の元の色
    13: [],   // cubeGroups[7]の元の色
    14: [],   // cubeGroups[7]の元の色
    15: [],   // cubeGroups[7]の元の色
    16: [],   // cubeGroups[7]の元の色
    17: [],   // cubeGroups[7]の元の色
    18: [],   // cubeGroups[7]の元の色
    19: [],   // cubeGroups[7]の元の色
    20: [],   // cubeGroups[7]の元の色
    21: [],   // cubeGroups[7]の元の色
    22: [],   // cubeGroups[7]の元の色
    23: [],   // cubeGroups[7]の元の色
    24: [],   // cubeGroups[7]の元の色
    25: []   // cubeGroups[7]の元の色
};

const pairs = [
    [6, 20],  // 白赤緑
    [4, 18],  // 白赤青
    [7, 21],  // 白オレンジ緑
    [5, 19],  // 白オレンジ青
];

const f2l_parts = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
//const f2l_parts = [4, 5, 6, 7, 18, 19, 20, 21];

// 輝度を下げる関数
const DecreaseBrightness = (material) => {
//    const color = material.color;
//    color.r = 0.25;  // 赤成分
//    color.g = 0.25;  // 緑成分
//    color.b = 0.25;  // 青成分
};

// 元の色に戻す関数
const resetBrightness = (material, originalColor) => {
    material.color.set(originalColor); // 元の色に戻す
};

// 輝度を変更する処理
const adjustBrightnessForGroup = (group, decrease, originalColors = []) => {
    group.forEach((face, index) => {
        if (face.material) {
            if (decrease) {
                // 輝度を下げる
                originalColors.push(face.material.color.getHex()); // 元の色を保存
                DecreaseBrightness(face.material);  // 輝度を下げる
            } else {
                // 元の色に戻す
                resetBrightness(face.material, originalColors[index]);
            }
        }
    });
};

createCubeFaces(); // 面を作成してシーンに追加

// グループ化するための面を定義（シーンに追加しない）
const cubeGroups = [
    [faces.yellow[0], faces.red[6], faces.blue[6]],       // 0番ピース
    [faces.yellow[2], faces.orange[6], faces.blue[8]],    // 1番ピース
    [faces.yellow[6], faces.red[8], faces.green[6]],      // 2番ピース
    [faces.yellow[8], faces.orange[8], faces.green[8]],   // 3番ピース
    [faces.white[0], faces.blue[0], faces.red[0]],        // 4番ピース
    [faces.white[2], faces.blue[2], faces.orange[0]],     // 5番ピース
    [faces.white[6], faces.green[0], faces.red[2]],       // 6番ピース
    [faces.white[8], faces.green[2], faces.orange[2]],    // 7番ピース
    [faces.yellow[4]],                                    // 8番ピース
    [faces.white[4]],                                     // 9番ピース
    [faces.orange[4]],                                    // 10番ピース
    [faces.red[4]],                                       // 11番ピース
    [faces.green[4]],                                     // 12番ピース
    [faces.blue[4]],                                      // 13番ピース
    [faces.yellow[1], faces.blue[7]],                     // 14番ピース
    [faces.yellow[3], faces.red[7]],                      // 15番ピース
    [faces.yellow[5], faces.orange[7]],                   // 16番ピース
    [faces.yellow[7], faces.green[7]],                    // 17番ピース
    [faces.blue[3], faces.red[3]],                        // 18番ピース
    [faces.blue[5], faces.orange[3]],                     // 19番ピース
    [faces.green[3], faces.red[5]],                       // 20番ピース
    [faces.green[5], faces.orange[5]],                    // 21番ピース
    [faces.white[1], faces.blue[1]],                      // 22番ピース
    [faces.white[3], faces.red[1]],                       // 23番ピース
    [faces.white[5], faces.orange[1]],                    // 24番ピース
    [faces.white[7], faces.green[1]],                     // 25番ピース
];

// 現在で各位置にあるピース
const cube_now = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];

// 輝度変更の処理を関数化
const handleBrightnessChange = () => {

   let brightnessDecreased = false; // 輝度を下げたかどうかを判定するフラグ

    // 輝度を元に戻す
    for (let i = 0; i < f2l_parts.length; i++) {
        adjustBrightnessForGroup(cubeGroups[f2l_parts[i]], false, originalColors[f2l_parts[i]]);
        console.log(`Cube f2l_parts[i] brightness reset`);
    }

    for (let i = 0; i < pairs.length; i++) {
        for (let j = 0; j < pairs.length; j++) {
            // cube_now[pares[i][0]]がpares[j][0]と等しく、cube_now[pares[i][1]]がpares[j][1]等しい場合
            if (cube_now[pairs[i][0]] === pairs[j][0] && cube_now[pairs[i][1]] === pairs[j][1]) {
                // 輝度を上げる
                adjustBrightnessForGroup(cubeGroups[pairs[j][0]], true, originalColors[pairs[j][0]]);
                adjustBrightnessForGroup(cubeGroups[pairs[j][1]], true, originalColors[pairs[j][1]]);
                console.log(`Cube groups [${pairs[j][0]}] and [${pairs[j][1]}] brightness decreased`);
                brightnessDecreased = true;
            }
        }
    }
};

handleBrightnessChange(); // スロットが揃っていたら輝度を下げる

// 回転制御用変数
let currentRotation = 0; // 現在の回転量
let targetRotation = 0; // 目標の回転量
let isRotating = false; // 回転中フラグ

// 点を基準に回転させる関数
function rotateAroundPoint(object, point, axis, theta) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, theta); // 回転角度を設定

    // オブジェクトを中心点へ移動
    object.position.sub(point); 
    object.position.applyQuaternion(quaternion); // 回転を適用
    object.position.add(point); 

    // オブジェクト自体も回転
    object.quaternion.multiplyQuaternions(quaternion, object.quaternion);
}

// 右面のピースを回転させる関数（アニメーション制御付き）
function rotateRightFace(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const rightFacePieces = [cube_now[1], cube_now[3], cube_now[5], cube_now[7], cube_now[10], cube_now[16], cube_now[19], cube_now[21], cube_now[24]]; // 右面のピース
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(1, 0, 0); // グローバルX軸
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise ) { 
                [cube_now[1], cube_now[3], cube_now[5], cube_now[7]] = [cube_now[3], cube_now[7], cube_now[1], cube_now[5]];  // コーナー入れ替え
                [cube_now[16], cube_now[19], cube_now[21], cube_now[24]] = [cube_now[21], cube_now[16], cube_now[24], cube_now[19]];  // エッジ入れ替え
            } else {
                [cube_now[1], cube_now[3], cube_now[5], cube_now[7]] = [cube_now[5], cube_now[1], cube_now[7], cube_now[3]];  // コーナー入れ替え
                [cube_now[16], cube_now[19], cube_now[21], cube_now[24]] = [cube_now[19], cube_now[24], cube_now[16], cube_now[21]];  // エッジ入れ替え
            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        rightFacePieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// 上面のピースを回転させる関数
function rotateUpperFace(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const upperFacePieces = [cube_now[0], cube_now[1], cube_now[2], cube_now[3], cube_now[8], cube_now[14], cube_now[15], cube_now[16], cube_now[17]]; // 上面のピース
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(0, 1, 0); // グローバルY軸
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise ) { 
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3]] = [cube_now[2], cube_now[0], cube_now[3], cube_now[1]];  // コーナー入れ替え上面
                [cube_now[14], cube_now[15], cube_now[16], cube_now[17]] = [cube_now[15], cube_now[17], cube_now[14], cube_now[16]];  // エッジ入れ替え
            } else {
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3]] = [cube_now[1], cube_now[3], cube_now[0], cube_now[2]];  // コーナー入れ替え
                [cube_now[14], cube_now[15], cube_now[16], cube_now[17]] = [cube_now[16], cube_now[14], cube_now[17], cube_now[15]];  // エッジ入れ替え
            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        upperFacePieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// 上面のピースを回転させる関数
function rotateFrontFace(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const upperFacePieces = [cube_now[2], cube_now[3], cube_now[6], cube_now[7], cube_now[12], cube_now[17], cube_now[20], cube_now[21], cube_now[25]]; // 前面のピース
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(0, 0, 1); // グローバルZ軸
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise ) { 
                [cube_now[2], cube_now[3], cube_now[6], cube_now[7]] = [cube_now[6], cube_now[2], cube_now[7], cube_now[3]];  // コーナー入れ替え上面
                [cube_now[17], cube_now[20], cube_now[21], cube_now[25]] = [cube_now[20], cube_now[25], cube_now[17], cube_now[21]];  // エッジ入れ替え
            } else {
                [cube_now[2], cube_now[3], cube_now[6], cube_now[7]] = [cube_now[3], cube_now[7], cube_now[2], cube_now[6]];  // コーナー入れ替え
                [cube_now[17], cube_now[20], cube_now[21], cube_now[25]] = [cube_now[21], cube_now[17], cube_now[25], cube_now[20]];  // エッジ入れ替え
            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        upperFacePieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// X回転させる関数
function rotateX(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const allPieces = [...Array(26).keys()];
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(1, 0, 0); // グローバルX軸
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise ) { 
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3], cube_now[4], cube_now[5], cube_now[6], cube_now[7]]
              = [cube_now[2], cube_now[3], cube_now[6], cube_now[7], cube_now[0], cube_now[1], cube_now[4], cube_now[5]];  // コーナー入れ替え
                [cube_now[14], cube_now[15], cube_now[16], cube_now[17], cube_now[18], cube_now[19], cube_now[20], cube_now[21], cube_now[22], cube_now[23], cube_now[24], cube_now[25]]
              = [cube_now[17], cube_now[20], cube_now[21], cube_now[25], cube_now[15], cube_now[16], cube_now[23], cube_now[24], cube_now[14], cube_now[18], cube_now[19], cube_now[22]];  // エッジ入れ替え
                [cube_now[8], cube_now[9], cube_now[12], cube_now[13]]
              = [cube_now[12], cube_now[13], cube_now[9], cube_now[8]];  // センター入れ替え
            } else {
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3], cube_now[4], cube_now[5], cube_now[6], cube_now[7]]
              = [cube_now[4], cube_now[5], cube_now[0], cube_now[1], cube_now[6], cube_now[7], cube_now[2], cube_now[3]];  // コーナー入れ替え
                [cube_now[14], cube_now[15], cube_now[16], cube_now[17], cube_now[18], cube_now[19], cube_now[20], cube_now[21], cube_now[22], cube_now[23], cube_now[24], cube_now[25]]
              = [cube_now[22], cube_now[18], cube_now[19], cube_now[14], cube_now[23], cube_now[24], cube_now[15], cube_now[16], cube_now[25], cube_now[20], cube_now[21], cube_now[17]];  // エッジ入れ替え
                [cube_now[8], cube_now[9], cube_now[12], cube_now[13]]
              = [cube_now[13], cube_now[12], cube_now[8], cube_now[9]];  // センター入れ替え
            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        allPieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// Y回転させる関数
function rotateY(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const allPieces = [...Array(26).keys()];
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(0, 1, 0); // グローバルY軸
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise ) { 
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3], cube_now[4], cube_now[5], cube_now[6], cube_now[7]]
              = [cube_now[2], cube_now[0], cube_now[3], cube_now[1], cube_now[6], cube_now[4], cube_now[7], cube_now[5]];  // コーナー入れ替え
                [cube_now[14], cube_now[15], cube_now[16], cube_now[17], cube_now[18], cube_now[19], cube_now[20], cube_now[21], cube_now[22], cube_now[23], cube_now[24], cube_now[25]]
              = [cube_now[15], cube_now[17], cube_now[14], cube_now[16], cube_now[20], cube_now[18], cube_now[21], cube_now[19], cube_now[23], cube_now[25], cube_now[22], cube_now[24]];  // エッジ入れ替え
                [cube_now[10], cube_now[11], cube_now[12], cube_now[13]]
              = [cube_now[13], cube_now[12], cube_now[10], cube_now[11]];  // センター入れ替
            } else {
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3], cube_now[4], cube_now[5], cube_now[6], cube_now[7]]
              = [cube_now[1], cube_now[3], cube_now[0], cube_now[2], cube_now[5], cube_now[7], cube_now[4], cube_now[6]];  // コーナー入れ替え
                [cube_now[14], cube_now[15], cube_now[16], cube_now[17], cube_now[18], cube_now[19], cube_now[20], cube_now[21], cube_now[22], cube_now[23], cube_now[24], cube_now[25]]
              = [cube_now[16], cube_now[14], cube_now[17], cube_now[15], cube_now[19], cube_now[21], cube_now[18], cube_now[20], cube_now[24], cube_now[22], cube_now[25], cube_now[23]];  // エッジ入れ替え
                [cube_now[10], cube_now[11], cube_now[12], cube_now[13]]
              = [cube_now[12], cube_now[13], cube_now[11], cube_now[10]];  // センター入れ替
            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        allPieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// 左面のピースを回転させる関数
function rotateLeftFace(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const leftFacePieces = [cube_now[0], cube_now[2], cube_now[4], cube_now[6], cube_now[11], cube_now[15], cube_now[18], cube_now[20], cube_now[23]]; // 左面のピース
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(-1, 0, 0); // グローバルX軸（左方向）
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise ) {
                [cube_now[0], cube_now[2], cube_now[6], cube_now[4]] = [cube_now[4], cube_now[0], cube_now[2], cube_now[6]];  
                [cube_now[15], cube_now[20], cube_now[23], cube_now[18]] = [cube_now[18], cube_now[15], cube_now[20], cube_now[23]];
            } else {
                [cube_now[0], cube_now[2], cube_now[6], cube_now[4]] = [cube_now[2], cube_now[6], cube_now[4], cube_now[0]];  
                [cube_now[15], cube_now[20], cube_now[23], cube_now[18]] = [cube_now[20], cube_now[23], cube_now[18], cube_now[15]];
            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        leftFacePieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// 下面のピースを回転させる関数
function rotateDownFace(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const downFacePieces = [cube_now[4], cube_now[5], cube_now[6], cube_now[7], cube_now[9], cube_now[22], cube_now[23], cube_now[24], cube_now[25]]; // 下面のピース
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(0, -1, 0); // グローバルY軸（下方向）
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise) { 
                [cube_now[4], cube_now[5], cube_now[6], cube_now[7]] = [cube_now[5], cube_now[7], cube_now[4], cube_now[6]]; 
                [cube_now[22], cube_now[24], cube_now[25], cube_now[23]] = [cube_now[24], cube_now[25], cube_now[23], cube_now[22]]; 
            } else {
                [cube_now[4], cube_now[5], cube_now[6], cube_now[7]] = [cube_now[6], cube_now[4], cube_now[7], cube_now[5]]; 
                [cube_now[22], cube_now[24], cube_now[25], cube_now[23]] = [cube_now[23], cube_now[22], cube_now[24], cube_now[25]]; 
            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        downFacePieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// 背面のピースを回転させる関数
function rotateBackFace(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const backFacePieces = [cube_now[0], cube_now[1], cube_now[4], cube_now[5], cube_now[13], cube_now[14], cube_now[18], cube_now[19], cube_now[22]]; // 背面のピース
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(0, 0, -1); // グローバルZ軸（背方向）
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise) { 
                [cube_now[0], cube_now[4], cube_now[5], cube_now[1]] = [cube_now[1], cube_now[0], cube_now[4], cube_now[5]]; 
                [cube_now[18], cube_now[22], cube_now[19], cube_now[14]] = [cube_now[14], cube_now[18], cube_now[22], cube_now[19]]; 
            } else {
                [cube_now[0], cube_now[1], cube_now[5], cube_now[4]] = [cube_now[4], cube_now[0], cube_now[1], cube_now[5]]; 
                [cube_now[14], cube_now[19], cube_now[22], cube_now[18]] = [cube_now[18], cube_now[14], cube_now[19], cube_now[22]]; 
            }

            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        backFacePieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// Z回転させる関数
function rotateZ(clockwise = true) {
    if (isRotating) return; // 回転中なら入力を無視

    const allPieces = [...Array(26).keys()];
    const step = Math.PI / 12; // 1フレームごとの回転量
    const totalRotation = Math.PI / 2; // 目標回転量
    const axis = new THREE.Vector3(0, 0, 1); // グローバルZ軸
    const center = new THREE.Vector3(0, 0, 0); // 回転の中心

    targetRotation = totalRotation * (clockwise ? -1 : 1); // 目標回転量を設定
    currentRotation = 0; // 現在の回転量をリセット
    isRotating = true; // 回転中フラグを立てる

    function animateRotation() {
        if (Math.abs(currentRotation) >= Math.abs(targetRotation)) {
            isRotating = false; // 回転完了
            // 回転後の場所置き換え
            if (clockwise ) { 
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3], cube_now[4], cube_now[5], cube_now[6], cube_now[7]]
              = [cube_now[4], cube_now[0], cube_now[6], cube_now[2], cube_now[5], cube_now[1], cube_now[7], cube_now[3]];  // コーナー入れ替え

                [cube_now[14], cube_now[15], cube_now[16], cube_now[17], cube_now[18], cube_now[19], cube_now[20], cube_now[21], cube_now[22], cube_now[23], cube_now[24], cube_now[25]]
              = [cube_now[18], cube_now[23], cube_now[15], cube_now[20], cube_now[22], cube_now[14], cube_now[25], cube_now[17], cube_now[19], cube_now[24], cube_now[16], cube_now[21]];  // エッジ入れ替え

                [cube_now[8], cube_now[9], cube_now[10], cube_now[11]]
              = [cube_now[11], cube_now[10], cube_now[8], cube_now[9]];  // センター入れ替え

            } else {
                [cube_now[0], cube_now[1], cube_now[2], cube_now[3], cube_now[4], cube_now[5], cube_now[6], cube_now[7]]
              = [cube_now[1], cube_now[5], cube_now[3], cube_now[7], cube_now[0], cube_now[4], cube_now[2], cube_now[6]];  // コーナー入れ替え

                [cube_now[14], cube_now[15], cube_now[16], cube_now[17], cube_now[18], cube_now[19], cube_now[20], cube_now[21], cube_now[22], cube_now[23], cube_now[24], cube_now[25]]
              = [cube_now[19], cube_now[16], cube_now[24], cube_now[21], cube_now[14], cube_now[22], cube_now[17], cube_now[25], cube_now[18], cube_now[15], cube_now[23], cube_now[20]];  // エッジ入れ替え

                [cube_now[8], cube_now[9], cube_now[10], cube_now[11]]
              = [cube_now[10], cube_now[11], cube_now[9], cube_now[8]];  // センター入れ替え

            }
            handleBrightnessChange(); // スロットが揃っていたら輝度を下げる
            return;
        }

        // 1ステップ分の回転量を計算
        const rotationStep = Math.sign(targetRotation) * Math.min(step, Math.abs(targetRotation - currentRotation));
        currentRotation += rotationStep; // 現在の回転量を更新

        // 各ピースに回転を適用
        allPieces.forEach(index => {
            const group = cubeGroups[index];
            group.forEach(piece => {
                rotateAroundPoint(piece, center, axis, rotationStep);
            });
        });

        // 次のフレームを要求
        requestAnimationFrame(animateRotation);
    }

    animateRotation();
}

// キーボードイベントリスナーを追加
document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'r') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateRightFace(clockwise);
    }
    if (event.key.toLowerCase() === 'u') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateUpperFace(clockwise);
    }
    if (event.key.toLowerCase() === 'f') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateFrontFace(clockwise);
    }
    if (event.key.toLowerCase() === 'l') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateLeftFace(clockwise);
    }
    if (event.key.toLowerCase() === 'd') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateDownFace(clockwise);
    }
    if (event.key.toLowerCase() === 'b') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateBackFace(clockwise);
    }
    if (event.key.toLowerCase() === 'x') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateX(clockwise);
    }
    if (event.key.toLowerCase() === 'y') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateY(clockwise);
    }
    if (event.key.toLowerCase() === 'z') {
        const clockwise = !event.shiftKey; // Shiftキーを押している場合は反時計回り
        rotateZ(clockwise);
    }
});

// ボタンイベントリスナーを追加
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    const text = button.textContent.trim();
    if (text === 'R') {
        button.addEventListener('click', () => rotateRightFace(true)); // R: 時計回り
    } else if (text === "R'") {
        button.addEventListener('click', () => rotateRightFace(false)); // R': 反時計回り
    } else if (text === 'U') {
        button.addEventListener('click', () => rotateUpperFace(true)); // U: 時計回り
    } else if (text === "U'") {
        button.addEventListener('click', () => rotateUpperFace(false)); // U': 反時計回り
    } else if (text === 'F') {
        button.addEventListener('click', () => rotateFrontFace(true)); // F: 時計回り
    } else if (text === "F'") {
        button.addEventListener('click', () => rotateFrontFace(false)); // F': 反時計回り
    } else if (text === 'L') {
        button.addEventListener('click', () => rotateLeftFace(true)); // L: 時計回り
    } else if (text === "L'") {
        button.addEventListener('click', () => rotateLeftFace(false)); // L': 反時計回り
    } else if (text === 'D') {
        button.addEventListener('click', () => rotateDownFace(true)); // D: 時計回り
    } else if (text === "D'") {
        button.addEventListener('click', () => rotateDownFace(false)); // D': 反時計回り
    } else if (text === 'B') {
        button.addEventListener('click', () => rotateBackFace(true)); // B: 時計回り
    } else if (text === "B'") {
        button.addEventListener('click', () => rotateBackFace(false)); // B': 反時計回り
    }else if (text === 'X') {
        button.addEventListener('click', () => rotateX(true));
    } else if (text === "X'") {
        button.addEventListener('click', () => rotateX(false));
    } else if (text === 'Y') {
        button.addEventListener('click', () => rotateY(true));
    } else if (text === "Y'") {
        button.addEventListener('click', () => rotateY(false));
    } else if (text === 'Z') {
        button.addEventListener('click', () => rotateZ(true));
    } else if (text === "Z'") {
        button.addEventListener('click', () => rotateZ(false));
    }
});

// OrbitControlsのインスタンス作成
const controls = new OrbitControls(camera, renderer.domElement);

// アニメーション関数
function animate() {
    requestAnimationFrame(animate);

    // OrbitControlsの更新（カメラ位置や回転を更新）
    controls.update(); 

    renderer.render(scene, camera);
}


// カメラの位置設定
camera.position.z = 5;  // 例えばカメラを手前に配置

animate(); // アニメーションを開始

// ★ 修正箇所：カメラをデフォルト位置に戻すボタンのロジック
const resetCameraButton = document.getElementById('resetCameraButton');
if (resetCameraButton) {
    resetCameraButton.addEventListener('click', () => {
        // カメラの初期位置を設定した場所の値を再設定するのだ
        camera.position.set(3.0, 2.5, 4.0); 
        camera.lookAt(0, 0, 0);

        // OrbitControls も初期位置に戻さないと、すぐにドラッグした位置に戻っちゃうのだ
        controls.reset(); 

        renderer.render(scene, camera); // 即座に画面を更新するのだ
    });
}

// ★ 修正箇所：ウィンドウリサイズ時のカメラ調整
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.4;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// レイアウトを強制更新する関数
function updateLayoutForce() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const warning = document.getElementById('landscape-warning'); // 警告メッセージの要素
    const canvasContainer = document.getElementById('canvasContainer');
    const buttonContainer = document.getElementById('buttonContainer');

    // 縦画面と横画面で表示を切り替えるロジック
    if (height > width) { // 縦画面の場合
        // 警告メッセージを非表示にする
        if (warning) warning.style.display = 'none';
        // キューブとボタンを表示する
        if (canvasContainer) canvasContainer.style.display = 'block';
        if (buttonContainer) buttonContainer.style.display = 'flex';

        const cubeHeight = Math.floor(height * 0.4);
        
        // CSSのvhに頼らず、ピクセル単位で高さを強制上書きする
        if (canvasContainer) canvasContainer.style.height = cubeHeight + "px";
        if (buttonContainer) buttonContainer.style.height = (height - cubeHeight) + "px";

        renderer.setSize(width, cubeHeight);
        camera.aspect = width / cubeHeight;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    } else { // 横画面の場合
        // 警告メッセージを表示する
        if (warning) warning.style.display = 'flex';
        // キューブとボタンを非表示にする
        if (canvasContainer) canvasContainer.style.display = 'none';
        if (buttonContainer) buttonContainer.style.display = 'none';
    }
}

// レイアウト更新イベントリスナーを、関数の定義後にまとめて登録
window.addEventListener('resize', updateLayoutForce);
window.addEventListener('orientationchange', () => {
    // 回転時はChromeのサイズ確定を待つため、しつこく実行
    setTimeout(updateLayoutForce, 100);
    setTimeout(updateLayoutForce, 500);
    setTimeout(updateLayoutForce, 1000);
});

// 500ミリ秒ごとに常にチェックし続ける（これでChromeのズレをねじ伏せるのだ）
//setInterval(updateLayoutForce, 500);

// 初期起動時も実行（これが動かないと初期表示もおかしいはずなのだ）
updateLayoutForce();