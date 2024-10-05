import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/Addons.js";

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
camera.position.set(0, 0, 3);

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 3.5;
controls.zoomSpeed = 1;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = true;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.1;
controls.minDistance = 0.5;
controls.maxDistance = 200;

// add ambient and point light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3.5, 1000);
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
	a_init: 0.38709843,
	a_cy: 0.0,
	e_init: 0.20563661,
	e_cy: 0.00002123,
	i_init: 7.00559432,
	i_cy: -0.00590158,
	L_init: 252.25166724,
	L_cy: 149472.67486623,
	longPeri_init: 77.45771895,
	longPeri_cy: 0.15940013,
	longNode_init: 48.33961819,
	longNode_cy: -0.12214182,
};

let venusParams = {
	a_init: 0.72332102,
	a_cy: -0.00000026,
	e_init: 0.00676399,
	e_cy: -0.00005107,
	i_init: 3.39777545,
	i_cy: 0.00043494,
	L_init: 181.9797085,
	L_cy: 58517.8156026,
	longPeri_init: 131.76755713,
	longPeri_cy: 0.05679648,
	longNode_init: 76.67261496,
	longNode_cy: -0.27274174,
};

let marsParams = {
	a_init: 1.52371243,
	a_cy: 0.00000097,
	e_init: 0.09336511,
	e_cy: 0.00009149,
	i_init: 1.85181869,
	i_cy: -0.00724757,
	L_init: -4.56813164,
	L_cy: 19140.29934243,
	longPeri_init: -23.91744784,
	longPeri_cy: 0.45223625,
	longNode_init: 49.71320984,
	longNode_cy: -0.26852431,
};

let earthParams = {
	a_init: 1.00000018,
	a_cy: -0.00000003,
	e_init: 0.01673163,
	e_cy: -0.00003661,
	i_init: -0.00003661,
	i_cy: -0.01337178,
	L_init: 100.46691572,
	L_cy: 35999.37306329,
	longPeri_init: 102.93005885,
	longPeri_cy: 0.3179526,
	longNode_init: -5.11260389,
	longNode_cy: -0.24123856,
};

let jupiterParams = {
	a_init: 5.20248019,
	a_cy: -0.00002864,
	e_init: 0.0485359,
	e_cy: 0.00018026,
	i_init: 1.29861416,
	i_cy: -0.00322699,
	L_init: 34.33479152,
	L_cy: 3034.90371757,
	longPeri_init: 14.27495244,
	longPeri_cy: 0.18199196,
	longNode_init: 0.13024619,
	longNode_cy: 113.63998702,
};

let saturnParams = {
	a_init: 9.54149883,
	a_cy: -0.00003065,
	e_init: 0.05550825,
	e_cy: -0.00032044,
	i_init: 2.49424102,
	i_cy: 0.00451969,
	L_init: 50.07571329,
	L_cy: 1222.11494724,
	longPeri_init: 92.86136063,
	longPeri_cy: 0.54179478,
	longNode_init: 113.63998702,
	longNode_cy: -0.25015002,
};

let uranusParams = {
	a_init: 19.18797948,
	a_cy: -0.00020455,
	e_init: 0.0468574,
	e_cy: -0.0000155,
	i_init: 0.77298127,
	i_cy: -0.00180155,
	L_init: 314.20276625,
	L_cy: 428.49512595,
	longPeri_init: 172.43404441,
	longPeri_cy: 0.09266985,
	longNode_init: 73.96250215,
	longNode_cy: 0.05739699,
};

// ! TEKRAR BAK YANLIS GIRDIM SANIRIM
let neptuneParams = {
	a_init: 30.06952752,
	a_cy: 0.00006447,
	e_init: 0.00895439,
	e_cy: 0.00000818,
	i_init: 1.7700552,
	i_cy: 0.000224,
	L_init: 304.22289287,
	L_cy: 218.46515314,
	longPeri_init: 46.68158724,
	longPeri_cy: 0.01009938,
	longNode_init: 46.68158724,
	longNode_cy: -0.12214182,
};

function updateParams(obj, T) {
	obj.a = obj.a_init + obj.a_cy * T;
	obj.e = obj.e_init + obj.e_cy * T;
	obj.i = obj.i_init + obj.i_cy * T;
	obj.L = obj.L_init + obj.L_cy * T;
	obj.longPeri = obj.longPeri_init + obj.longPeri_cy * T;
	obj.longNode = obj.longNode_init + obj.longNode_cy * T;
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
				(eccentricAnomaly - e * Math.sin(eccentricAnomaly))) /
			(1 - e * Math.cos(eccentricAnomaly));
		eccentricAnomaly += deltaE;
		if (Math.abs(deltaE) < 1e-8) {
			return eccentricAnomaly;
		}
	}
	throw new Error("Max iterations reached in eccentric anomaly calculation.");
}

function findXHelio(a, eccentricAnomaly, e) {
	return a * (Math.cos(eccentricAnomaly) - e);
}

function findYHelio(a, eccentricAnomaly, e) {
	return a * Math.sqrt(1 - degToRad(e) ** 2) * Math.sin(eccentricAnomaly);
}

let epoch = 2451545.0;
let currentDay = 2460589.0;

// Planet parameters
const planets = [
	mercuryParams,
	venusParams,
	earthParams,
	marsParams,
	jupiterParams,
	saturnParams,
	uranusParams,
	neptuneParams,
];

// Planet names and sizes
const planetNames = [
	"mercury",
	"venus",
	"earth",
	"mars",
	"jupiter",
	"saturn",
	"uranus",
	"neptune",
];

const planetSizes = {
	mercury: 0.02,
	venus: 0.02,
	earth: 0.02,
	mars: 0.02,
	jupiter: 0.08,
	saturn: 0.05,
	uranus: 0.05,
	neptune: 0.09,
};

// Array to store the planet meshes for later use
const planetMeshes = [];

// Create and add planets using a for loop
for (let i = 0; i < planets.length; i++) {
	const planetName = planetNames[i];
	const size = planetSizes[planetName] * 3.5;

	const geometry = new THREE.SphereGeometry(size, 32, 32);
	const texture = new THREE.TextureLoader().load(
		`../src/assets/${planetName}.jpg`
	);
	const material = new THREE.MeshLambertMaterial({ map: texture });
	const planetMesh = new THREE.Mesh(geometry, material);

	scene.add(planetMesh);

	planetMeshes.push(planetMesh);
}

// Sun
const sunGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const sunTexture = new THREE.TextureLoader().load("../src/assets/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
sun.rotation.x = Math.PI / 2;

// speed controls
const speedUpButton = document.getElementById("speed-up");
const speedDownButton = document.getElementById("speed-down");
const pauseButton = document.getElementById("pause");

let speed = 0;

speedUpButton.addEventListener("click", () => {
	if (speed < 7 / 60) {
		speed += 1 / 60;
	} else if (speed < 1) {
		speed += 14 / 60;
	} else {
		speed += 1 / 2;
	}
});

speedDownButton.addEventListener("click", () => {
	if (speed > 1) {
		speed -= 1 / 2;
	} else if (speed > 7 / 60) {
		speed -= 14 / 60;
	} else {
		speed -= 1 / 60;
	}
});

pauseButton.addEventListener("click", () => {
	speed = 0;
});

function animate() {
	let T = (currentDay - epoch) / 36525;

	// Loop through each planet to update their positions
	for (let i = 0; i < planets.length; i++) {
		const planet = planets[i];
		const planetMesh = planetMeshes[i]; // Get the corresponding mesh

		// Update the planet's orbital parameters
		updateParams(planet, T);

		// Calculate the mean anomaly and eccentric anomaly
		let meanAnomaly = planet.L - planet.longPeri;
		let eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, planet.e);

		// Calculate the heliocentric coordinates
		let xHelio = findXHelio(planet.a, eccentricAnomaly, planet.e);
		let yHelio = findYHelio(planet.a, eccentricAnomaly, planet.e);

		// Update the planet's position in the 3D scene
		planetMesh.position.set(xHelio, yHelio, 0);
		planetMesh.rotation.x = Math.PI / 2; // Rotate the planet to face the camera
	}

	// Update current day
	currentDay += speed;

	// Render the scene and camera
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	controls.update();
}
animate();

// Orbit colors for each planet
const orbitColors = {
	mercury: 0x909090,
	venus: 0xd4af37,
	earth: 0x1e90ff,
	mars: 0xff4500,
	jupiter: 0xf4a460,
	saturn: 0xfdd017,
	uranus: 0x87ceeb,
	neptune: 0x4169e1,
};

// Generate orbit lines for each planet
const planetOrbits = planets.map((planet, index) => {
	const orbitPoints = [];

	// Create points around the orbit (full 360 degrees)
	for (let angle = 0; angle <= 360; angle += 1) {
		const meanAnomaly = angle;
		const eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, planet.e);
		const xHelio = findXHelio(planet.a, eccentricAnomaly, planet.e);
		const yHelio = findYHelio(planet.a, eccentricAnomaly, planet.e);
		orbitPoints.push(new THREE.Vector3(xHelio, yHelio, 0));
	}

	const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);

	// Get the color from `orbitColors` based on the index from `planetNames`
	const planetName = planetNames[index]; // Get the planet's name
	const orbitMaterial = new THREE.LineBasicMaterial({
		color: orbitColors[planetName],
	});

	const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
	scene.add(orbitLine);

	return orbitLine;
});

// Create raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add event listener for clicks
window.addEventListener("click", onMouseClick, false);

function onMouseClick(event) {
	// Convert mouse position to normalized device coordinates (-1 to +1)
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// Update the raycaster with camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	// Check for intersections with planets and sun
	const intersects = raycaster.intersectObjects([...planetMeshes, sun]);

	// If there's an intersection, do something
	if (intersects.length > 0) {
		const clickedObject = intersects[0].object;

		// Check if the object is a planet or the sun
		if (planetMeshes.includes(clickedObject)) {
			const planetIndex = planetMeshes.indexOf(clickedObject);
			const planetName = planetNames[planetIndex];
			console.log(`You clicked on ${planetName}!`);
		} else if (clickedObject === sun) {
			console.log("You clicked on the sun!");
		}
	}
}
