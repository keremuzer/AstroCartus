import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// create scene, camera, renderer and controls
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
controls.enablePan = false;
controls.maxDistance = 100;
controls.minDistance = 2;
controls.enableDamping = true;

// add ambient and point light
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

let mercuryParams = {
	a: 0.38709843,
	a_cy: 0.00000037,
	e: 0.20563661,
	e_cy: 0.00002123,
	i: 7.00559432,
	i_cy: -0.00590158,
	L: 252.25166724,
	L_cy: 149472.67486623,
	longPeri: 77.45771895,
	longPeri_cy: 0.15940013,
	longNode: 48.33961819,
	longNode_cy: -0.12214182,
};

function updateMercuryParams(T) {
	mercuryParams.a = mercuryParams.a + mercuryParams.a_cy * T;
	mercuryParams.e = 0.20563593 + mercuryParams.e_cy * T;
	mercuryParams.i = 7.00497902 + mercuryParams.i_cy * T;
	mercuryParams.L = 252.2503235 + mercuryParams.L_cy * T;
	mercuryParams.longPeri = 77.45779628 + mercuryParams.longPeri_cy * T;
	mercuryParams.longNode = 48.33076593 + mercuryParams.longNode_cy * T;
}

function degToRad(deg) {
	return (deg * Math.PI) / 180;
}

function eccentricAnomalyCalculator(meanAnomaly, e) {
	let eccentricAnomaly = degToRad(meanAnomaly);
	let deltaE;

	for (let i = 0; i < 100; i++) {
		deltaE =
			(degToRad(meanAnomaly) -
				(eccentricAnomaly - degToRad(e) * Math.sin(eccentricAnomaly))) /
			(1 - degToRad(e) * Math.cos(eccentricAnomaly));
		eccentricAnomaly += deltaE;
		if (Math.abs(deltaE) < 1e-8) {
			return eccentricAnomaly;
		}
	}
}

function findXHelio(a, eccentricAnomaly, e) {
	return a * (Math.cos(eccentricAnomaly) - degToRad(e));
}

function findYHelio(a, eccentricAnomaly, e) {
	return a * Math.sqrt(1 - degToRad(e) ** 2) * Math.sin(eccentricAnomaly);
}

let epoch = 2451545.0;
let currentDay = 2460589.0;

// add mercury
const mercuryGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const mercuryTexture = new THREE.TextureLoader().load(
	"../src/assets/mercury.jpg"
);
const mercuryMaterial = new THREE.MeshLambertMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
scene.add(mercury);
mercury.rotation.x = Math.PI / 2;

// Create orbit line
const orbitPoints = [];
for (let angle = 0; angle <= 360; angle += 1) {
	const meanAnomaly = angle;
	const eccentricAnomaly = eccentricAnomalyCalculator(
		meanAnomaly,
		mercuryParams.e
	);
	const xHelio = findXHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);
	const yHelio = findYHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);
	orbitPoints.push(new THREE.Vector3(xHelio * 5, yHelio * 5, 0));
}

const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 });
const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
scene.add(orbitLine);

// animate scene
const animate = function () {
	let T = (currentDay - epoch) / 36525;

	updateMercuryParams(T);

	const meanAnomaly = mercuryParams.L - mercuryParams.longPeri;
	const eccentricAnomaly = eccentricAnomalyCalculator(
		meanAnomaly,
		mercuryParams.e
	);
	const xHelio = findXHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);
	const yHelio = findYHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);

	currentDay += 0.5;

	console.log(
		"x" +
			xHelio +
			" -- " +
			"y" +
			yHelio +
			" distance: " +
			Math.sqrt(xHelio ** 2 + yHelio ** 2)
	);

	mercury.position.set(xHelio * 5, yHelio * 5, 0);

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	controls.update();
};
animate();

// add sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunTexture = new THREE.TextureLoader().load("../src/assets/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
sun.rotation.x = Math.PI / 2;
