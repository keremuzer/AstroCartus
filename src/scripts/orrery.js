import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/Addons.js";
import * as XLSX from "xlsx";

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
let rates = [
	-4,
	-3,
	-120 / 60,
	-60 / 60,
	-28 / 60,
	-14 / 60,
	-7 / 60,
	-6 / 60,
	-5 / 60,
	-3 / 60,
	-2 / 60,
	-1 / 60,
	0,
	1 / 60,
	2 / 60,
	3 / 60,
	5 / 60,
	6 / 60,
	7 / 60,
	14 / 60,
	28 / 60,
	60 / 60,
	120 / 60,
	3,
	4,
];

speedUpButton.addEventListener("click", () => {
	// increase rate
	if (speed < rates[rates.length - 1]) {
		speed = rates[rates.indexOf(speed) + 1];
	}
});

speedDownButton.addEventListener("click", () => {
	// decrease rate
	if (speed > rates[0]) {
		speed = rates[rates.indexOf(speed) - 1];
	}
});

pauseButton.addEventListener("click", () => {
	speed = 0;
});

// Başlangıç epoch değeri (2451545.0)
let epochJD = 2451545.0;

// Şu anki Julian Date (günümüz değeri)
let currentJD = 2460589.0;

// Zamanı 1 gün artırmak için adım
let JD_step = 1; // 1 gün ilerletme

let asteroids = []; // Initialize as an empty array

fetch("sbdb_query_results.csv")
	.then((response) => response.text())
	.then((data) => {
		const workbook = XLSX.read(data, { type: "string" });
		const sheetName = workbook.SheetNames[0]; // İlk sayfayı al
		const worksheet = workbook.Sheets[sheetName];

		// Verileri JSON formatında al
		const asteroidData = XLSX.utils.sheet_to_json(worksheet);

		// Asteroid nesnelerini oluştur
		asteroids = asteroidData.map((item) => ({
			name: item.full_name,
			a: item.a, //semi major axis
			i: (item.i * Math.PI) / 180, // inclination
			argOfPeri: (item.w * Math.PI) / 180,
			e: item.e, // eccentricity
			longNode: (item.om * Math.PI) / 180, // long node
			period: item.per_y,
			M: (item.ma * Math.PI) / 180, //mean anomaly
			trueAnomaly: 0,
			position: [0, 0, 0],
			time: 0,
		}));

		// Asteroid verilerini kullan
		objCreate(asteroids);
	})
	.catch((err) => console.error(err));

function determinePos(trueAnomaly, obj) {
	let pos = [];
	let theta = trueAnomaly; // True anomaly
	let a = obj.a; // Semi-major Axis
	let i = obj.i; // Orbital Inclination
	let argOfPeri = obj.argOfPeri; // Argument of Perihelion
	let e = obj.e; // Orbital eccentricity
	let longNode = obj.longNode; // Ascending Node
	let sLR = a * (1 - e * e); // Semi-Latus Rectum
	let r = sLR / (1 + e * Math.cos(theta)); // Radial distance

	// Pozisyon hesaplaması (x, y, z)
	pos[0] =
		r *
		(Math.cos(argOfPeri + theta) * Math.cos(longNode) -
			Math.cos(i) * Math.sin(argOfPeri + theta) * Math.sin(longNode));
	pos[1] =
		r *
		(Math.cos(argOfPeri + theta) * Math.sin(longNode) +
			Math.cos(i) * Math.sin(argOfPeri + theta) * Math.cos(longNode));
	pos[2] = r * (Math.sin(argOfPeri + theta) * Math.sin(i));
	return pos;
}

function meanToEccentricAnomaly(e, M) {
	var tol = 0.0001; // Tolerance for convergence
	var eAo = M; // Initialize eccentric anomaly with mean anomaly
	var ratio = 1; // Set ratio higher than tolerance
	while (Math.abs(ratio) > tol) {
		var f_E = eAo - e * Math.sin(eAo) - M;
		var f_Eprime = 1 - e * Math.cos(eAo);
		ratio = f_E / f_Eprime;
		eAo = eAo - ratio;
	}
	return eAo;
}

function eccentricToTrueAnomaly(e, E) {
	return 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
}

// Asteroidleri sahneye ekle
function objCreate(asteroids) {
	for (let asteroid of asteroids) {
		const meteorGeometry = new THREE.SphereGeometry(0.01, 20, 20);
		// grey meteor color
		const meteorMaterial = new THREE.MeshBasicMaterial({
			color: 0xa0a0a0,
		});
		const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
		scene.add(meteor);
		asteroid.meteor = meteor;
		console.log(asteroid);
	}
}

function updateAsteroidPosition(asteroid, deltaJD) {
	// Calculate the updated mean anomaly based on time
	let n = (2 * Math.PI) / (asteroid.period * 365.25); // Mean motion (rad/day)
	let M = asteroid.M + n * deltaJD; // Updated mean anomaly

	// Solve Kepler's equation to get eccentric anomaly
	let eccentricAnomaly = meanToEccentricAnomaly(asteroid.e, M);

	// Convert eccentric anomaly to true anomaly
	asteroid.trueAnomaly = eccentricToTrueAnomaly(asteroid.e, eccentricAnomaly);

	// Calculate the new position using orbital elements
	let newPosition = determinePos(asteroid.trueAnomaly, asteroid);

	// Update the position of the asteroid mesh in 3D space
	asteroid.meteor.position.set(newPosition[0], newPosition[1], newPosition[2]);
}

// Initialize variables for selected planet and camera focus
let selectedPlanet = null;
let isCameraLocked = false;

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
			selectedPlanet = clickedObject; // Set selected planet
			isCameraLocked = true; // Lock the camera to the selected planet
		} else if (clickedObject === sun) {
			console.log("You clicked on the sun!");
		}
	}
}



function animate() {
	let T = (currentDay - epoch) / 36525; // Time in Julian centuries since the epoch

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

	// Update current day for planets based on speed
	currentDay += speed;

	if (asteroids && asteroids.length > 0) {
		// Animate only when asteroid data is available
		for (let asteroid of asteroids) {
			// Epoch ile currentJD arasındaki fark
			let deltaJD = currentJD - epochJD;

			// Ortalama Anomali'yi (M) güncelle
			let n = (2 * Math.PI) / (asteroid.period * 365.25); // Günlük açısal hız
			let e = asteroid.e;
			let M = asteroid.M + n * deltaJD; // Mean anomaly'yi JD farkına göre güncelle

			let eccentricAnomaly = meanToEccentricAnomaly(e, M); // Eccentric anomaly'yi bul
			asteroid.trueAnomaly = eccentricToTrueAnomaly(e, eccentricAnomaly); // True anomaly'yi güncelle

			// Yeni pozisyonu hesapla
			let currentPosition = determinePos(asteroid.trueAnomaly, asteroid);
			asteroid.meteor.position.set(
				currentPosition[0],
				currentPosition[1],
				currentPosition[2]
			);
		}

		// Update JD for asteroids based on speed, controlling time progression
		currentJD += speed; // Sync speed with planets

		// Camera follows the selected planet
		if (isCameraLocked && selectedPlanet) {
			// Adjust camera position relative to the planet
			camera.position.set(
				selectedPlanet.position.x + 0.2,
				selectedPlanet.position.y + 0.2,
				selectedPlanet.position.z + 0.2
			);

			// Make sure the camera is looking at the selected planet
			camera.lookAt(selectedPlanet.position);
		}



	}

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


// HTML elemanlarını seç
const searchBox = document.getElementById("search-box");
const resultList = document.getElementById("result-list");

// Arama kutusuna tıklanınca listeyi aç
searchBox.addEventListener("focus", function () {
    resultList.style.display = "block"; // Listeyi göster
});

// Arama kutusundan çıkıldığında listeyi kapatma
searchBox.addEventListener("blur", function () {
    setTimeout(() => {
        resultList.style.display = "none"; // Listeyi gizle
    }, 100); // 100ms gecikme, eleman seçimi için
});

// Arama kutusuna her yazıldığında dinleme
searchBox.addEventListener("input", function () {
    const searchText = searchBox.value.toLowerCase(); // Arama kutusundaki değeri küçük harfe çevir

    // Filtreleme işlemi: asteroitlerin isimlerini kontrol ederiz
    const filteredAsteroids = asteroids.filter(asteroid =>
        asteroid.name.toLowerCase().includes(searchText)
    );

    // Sonuç listesini temizle
    resultList.innerHTML = '';

    // Filtrelenmiş sonuçları ekrana yaz
    filteredAsteroids.forEach(asteroid => {
        const listItem = document.createElement("li");
        listItem.textContent = asteroid.name; // Asteroid ismini göster

        // Liste elemanına tıklanınca alert göster
        listItem.addEventListener("mousedown", () => {
            alert(`Asteroid Name: ${asteroid.name}\nSemi-major axis: ${asteroid.a}\nEccentricity: ${asteroid.e}`);
        });

        resultList.appendChild(listItem);
    });
});
