import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	5000
);
camera.position.set(0, 0, 10);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
camera.lookAt(scene.position);
controls.enablePan = false;
controls.maxDistance = 100;
controls.minDistance = 4;
controls.enableDamping = true;

const animate = function () {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	controls.update();
};
animate();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30, 1000);
scene.add(pointLight);

//add skybox
const loader = new THREE.CubeTextureLoader();
const textureCube = loader.load([
	"../src/assets/px.png",
	"../src/assets/nx.png",
	"../src/assets/py.png",
	"../src/assets/ny.png",
	"../src/assets/pz.png",
	"../src/assets/nz.png",
]);
scene.background = textureCube;

//resize renderer on window resize
window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});
