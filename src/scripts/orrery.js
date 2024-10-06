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
let currentDay = Date.now() / (1000 * 60 * 60 * 24); // Convert milliseconds to days

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

function getJulianDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1; // January is 0, so add 1
	const day = now.getDate();

	// Julian Date formula
	const a = Math.floor((14 - month) / 12);
	const y = year + 4800 - a;
	const m = month + 12 * a - 3;

	const julianDay =
		day +
		Math.floor((153 * m + 2) / 5) +
		365 * y +
		Math.floor(y / 4) -
		Math.floor(y / 100) +
		Math.floor(y / 400) -
		32045;

	// Get fractional day by adding time part
	const dayFraction =
		(now.getUTCHours() - 12) / 24 +
		now.getUTCMinutes() / 1440 +
		now.getUTCSeconds() / 86400;

	return julianDay + dayFraction;
}

// Şu anki Julian Date (günümüz değeri)
let currentJD = getJulianDate();

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

let speedRate = document.getElementById("speed-rate");

function julianToDate(julianDate) {
	let j = julianDate + 0.5;

	let z = Math.floor(j);
	let f = j - z;

	let a;
	if (z >= 2299161) {
		let alpha = Math.floor((z - 1867216.25) / 36524.25);
		a = z + 1 + alpha - Math.floor(alpha / 4);
	} else {
		a = z;
	}

	let b = a + 1524;
	let c = Math.floor((b - 122.1) / 365.25);
	let d = Math.floor(365.25 * c);
	let e = Math.floor((b - d) / 30.6001);

	let day = b - d - Math.floor(30.6001 * e) + f;
	let dayInt = Math.floor(day);

	let month = e < 14 ? e - 1 : e - 13;

	let year = month > 2 ? c - 4716 : c - 4715;

	// Return in DD/MM/YYYY format
	return `${dayInt.toString().padStart(2, "0")}/${month
		.toString()
		.padStart(2, "0")}/${year}`;
}

const dailyRotations = [
	{ name: "Mercury", rotationsPerDay: 0.017 }, // Merkür
	{ name: "Venus", rotationsPerDay: -0.004 }, // Venüs (Geri yönde döner)
	{ name: "Earth", rotationsPerDay: 1 }, // Dünya
	{ name: "Mars", rotationsPerDay: 1.03 }, // Mars
	{ name: "Jupiter", rotationsPerDay: 2.41 }, // Jüpiter
	{ name: "Saturn", rotationsPerDay: 2.23 }, // Satürn
	{ name: "Uranus", rotationsPerDay: -1 }, // Uranüs (Geri yönde döner)
	{ name: "Neptune", rotationsPerDay: 1.48 }, // Neptün
];

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

const planetData = {
	mercury: {
		name: "Mercury",
		description:
			"The closest planet Despite its proximity to the Sun, Mercury is not the hottest planet in our solar system, thanks to its dense atmosphere. But Mercury is the fastest planet, zipping around the Sun every 88 Earth days.to the Sun. From an average distance of 36 million miles (58 million kilometers), Mercury is 0.4 astronomical units away from the Sun. From this distance, it takes sunlight 3.2 minutes to travel from the Sun to Mercury.",
	},
	venus: {
		name: "Venus",
		description:
			"Venus is the second planet from the Sun, and Earth's closest planetary neighbor. Venus is the third brightest object in the sky after the Sun and Moon. Venus spins slowly in the opposite direction from most planets. Thirty miles up (about 50 kilometers) from the surface of Venus temperatures range from 86 to 158 Fahrenheit (30 to 70 Celsius). This temperature range could accommodate Earthly life, such as “extremophile” microbes. And atmospheric pressure at that height is similar to what we find on Earth’s surface.",
	},
	earth: {
		name: "Earth",
		description:
			"While Earth is only the fifth largest planet in the solar system, it is the only world in our solar system with liquid water on the surface. With an equatorial diameter of 7926 miles (12,760 kilometers), Earth is the biggest of the terrestrial planets and the fifth largest planet in our solar system. From an average distance of 93 million miles (150 million kilometers), Earth is exactly one astronomical unit away from the Sun because one astronomical unit (abbreviated as AU), is the distance from the Sun to Earth.",
	},
	mars: {
		name: "Mars",
		description:
			"Mars is one of the most explored bodies in our solar system, and it's the only planet where we've sent rovers to roam the alien landscape. NASA missions have found lots of evidence that Mars was much wetter and warmer, with a thicker atmosphere, billions of years ago. With a radius of 2,106 miles (3,390 kilometers), Mars is about half the size of Earth. From an average distance of 142 million miles (228 million kilometers), Mars is 1.5 astronomical units away from the Sun.",
	},
	jupiter: {
		name: "Jupiter",
		description:
			"Jupiter is a world of extremes. It's the largest planet in our solar system. It's also the oldest planet, forming from the dust and gases left over from the Sun's formation 4.6 billion years ago. But it has the shortest day in the solar system, taking only 10.5 hours to spin around once on its axis.With a radius of 43,440.7 miles (69,911 kilometers), Jupiter is 11 times wider than Earth.From an average distance of 484 million miles (778 million kilometers), Jupiter is 5.2 astronomical units away from the Sun.",
	},
	saturn: {
		name: "Saturn",
		description:
			"Saturn is the sixth planet from the Sun, and the second-largest planet in our solar system. Saturn is a massive ball made mostly of hydrogen and helium. Saturn is not the only planet to have rings, but none are as spectacular or as complex as Saturn's. With an equatorial diameter of about 74,897 miles (120,500 kilometers), Saturn is 9 times wider than Earth. From an average distance of 886 million miles (1.4 billion kilometers), Saturn is 9.5 astronomical units away from the Sun.  Saturn also has dozens of moons.",
	},
	uranus: {
		name: "Uranus",
		description:
			"Uranus is the seventh planet from the Sun, and it has the third largest diameter of planets in our solar system. Uranus is a very cold and windy world.  The temperatures, pressures, and materials that characterize this planet are most likely too extreme and volatile for organisms to adapt to. With an equatorial diameter of 31,763 miles (51,118 kilometers), Uranus is four times wider than Earth. From an average distance of 1.8 billion miles (2.9 billion kilometers), Uranus is about 19 astronomical units away from the Sun.",
	},
	neptune: {
		name: "Neptune",
		description:
			"Neptune is the eighth and most distant planet in our solar system. Dark, cold, and whipped by supersonic winds, ice giant Neptune is more than 30 times as far from the Sun as Earth. Neptune is the only planet in our solar system not visible to the naked eye. With an equatorial diameter of 30,775 miles (49,528 kilometers), Neptune is about four times wider than Earth. From an average distance of 2.8 billion miles (4.5 billion kilometers), Neptune is 30 astronomical units away from the Sun.",
	},
	sun: {
		name: "Sun",
		description:
			"The Sun is the star at the heart of our solar system. Its gravity holds the solar system together, keeping everything — from the biggest planets to the smallest bits of debris — in its orbit.",
	},
};

function showPopup(planetName) {
	const popup = document.getElementById("popup");
	const popupPlanetName = document.getElementById("planet-name");
	const popupPlanetDescription = document.getElementById("planet-description");
	console.log("geldi");

	const planetInfo = planetData[planetName]; // planetName ile gezegen bilgilerini al
	if (planetInfo) {
		popupPlanetName.textContent = planetInfo.name; // Doğru anahtarı kullan
		popupPlanetDescription.textContent = planetInfo.description;

		// Pop-up'ı sabit bir konumda göster
		popup.style.left = "20px"; // Sol kenarda sabit
		popup.style.top = "50px"; // Sabit üstten mesafe

		// Eski pop-up'ı gizleyip yenisini göster
		hidePopup(); // Eski pop-up'ı gizle
		popup.style.display = "block"; // Yeni pop-up'ı göster
		popup.classList.add("show"); // Görünür yap

		// Kapatma simgesine tıklama olayı ekle
		const closePopupButton = document.getElementById("close-popup");
		closePopupButton.onclick = hidePopup; // Kapatma işlevini bağla
	} else {
		console.error("No data found for planet: ${planetName}"); // Hata durumunda konsola yazdır
	}
}

function hidePopup() {
	const popup = document.getElementById("popup");
	popup.style.display = "none"; // Pop-up'ı gizle
	popup.classList.remove("show"); // Görünürlük sınıfını kaldır
}

// Pop-up'ı gösteren bir buton varsa (örneğin, "show-popup" ID'si olan bir buton)
// Olay dinleyicisini ekleyin
document.getElementById("speed-up").addEventListener("click", function () {
	document.getElementById("popup").classList.add("show"); // Pop-up'ı göster
});

// Kapatma simgesine tıklama olayı
document.getElementById("close-popup").addEventListener("click", function () {
	document.getElementById("popup").classList.remove("show"); // Pop-up'ı gizle
});

// Pop-up dışında bir yere tıklanırsa pop-up'ı kapatma işlevi
window.addEventListener("click", function (event) {
	const popup = document.getElementById("popup");
	const closeButton = document.getElementById("close-popup");

	// Eğer tıklanan, pop-up veya kapanma simgesi dışında bir yer ise
	if (event.target == closeButton) {
		popup.classList.remove("show"); // Pop-up'ı gizle
		resetCamera();
	}
});

// Pop-up kapandığında kamerayı eski haline döndür
function resetCamera() {
	isCameraLocked = false; // Kameranın takibini durdur
	selectedPlanet = null; // Seçili gezegen yok

	// Kamerayı başlangıç pozisyonuna ve bakış noktasına geri getir
	camera.position.set(0, 0, 3); // Başlangıç pozisyonu
}
// date element
const dateElement = document.getElementById("date");

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

	// show the current date on the screen
	console.log(`Current Julian Date: ${currentJD}`);
	const date = julianToDate(currentJD);
	console.log(`Current Date: ${date}`);
	dateElement.innerHTML = date;

	// update speed rate
	const speedRates = [
		"-8 Months / second",
		"-6 Months / second",
		"-4 Months / second",
		"-2 Months / second",
		"-1 Month / second",
		"-2 Weeks / second",
		"-1 Week / second",
		"-6 Days / second",
		"-5 Days / second",
		"-3 Days / second",
		"-2 Days / second",
		"-1 Day / second",
		"Paused",
		"1 Day / second",
		"2 Days / second",
		"3 Days / second",
		"5 Days / second",
		"6 Days / second",
		"1 Week / second",
		"2 Weeks / second",
		"1 Month / second",
		"2 Months / second",
		"4 Months / second",
		"6 Months / second",
		"8 Months / second",
	];
	speedRate.innerHTML = `${speedRates[rates.indexOf(speed)]}`;

	/*// Rotate the planets based on their daily rotation rates and speed rate along y axis
	for (let i = 0; i < planetMeshes.length; i++) {
		const planetMesh = planetMeshes[i];
		const planetName = planetNames[i];

		// Find the corresponding planet rotation rate
		const planetData = dailyRotations.find(
			(planet) => planet.name === planetName
		);

		// If the planet is found, update its rotation
		if (planetData) {
			const rotationRate = planetData.rotationsPerDay;
			planetMesh.rotation.y += (rotationRate / 365) * speed;
		}
	}*/

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
	controls.update();
	requestAnimationFrame(animate);
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
	const filteredAsteroids = asteroids.filter((asteroid) =>
		asteroid.name.toLowerCase().includes(searchText)
	);

	// Sonuç listesini temizle
	resultList.innerHTML = "";

	// Filtrelenmiş sonuçları ekrana yaz
	filteredAsteroids.forEach((asteroid) => {
		const listItem = document.createElement("li");
		listItem.textContent = asteroid.name; // Asteroid ismini göster

		// Liste elemanına tıklanınca alert göster
		listItem.addEventListener("mousedown", () => {
			alert(
				`Asteroid Name: ${asteroid.name}\n
				Semi-major axis: ${asteroid.a}\n
				Eccentricity: ${asteroid.e}\n
				Argument of Perihelion: ${asteroid.argOfPeri}\n
				Longitute of Ascending Node: ${asteroid.longNode}\n
				Mean Anomaly: ${asteroid.M}\n
				Period (year): ${asteroid.period}`
			);
		});

		resultList.appendChild(listItem);
	});
});
