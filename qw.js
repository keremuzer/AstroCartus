// Başlangıç epoch değeri (2451545.0)
let epochJD = 2451545.0;

// Şu anki Julian Date (günümüz değeri)
let currentJD = 2460589.0;

// Zamanı 1 gün artırmak için adım
let JD_step = 1;  // 1 gün ilerletme

// Asteroid verilerini al ve oluştur
fetch('sbdb_query_results.csv') // Dosya yolunu doğru şekilde ayarlayın
    .then(response => response.text())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'string' });
        const sheetName = workbook.SheetNames[0]; // İlk sayfayı al
        const worksheet = workbook.Sheets[sheetName];

        // Verileri JSON formatında al
        const asteroidData = XLSX.utils.sheet_to_json(worksheet);

        // Asteroid nesnelerini oluştur
        const asteroids = asteroidData.map(item => ({
            name: item.full_name,
            a : item.a, //semi major axis
            i: item.i * Math.PI/180, // inclination
            argOfPeri: item.w * Math.PI/180,
            e: item.e, // eccentricity
            longNode: item.om * Math.PI / 180, // long node
            period: item.per_y, 
            M: item.ma * Math.PI / 180, //mean anomaly
            trueAnomaly : 0,
            position : [0,0,0],
            time : 0
        }));

        // Asteroid verilerini kullan
        objCreate(asteroids);
        console.log(scene)
        console.log(asteroids);
        animate(asteroids);
    })
    .catch(err => console.error(err));

function determinePos(trueAnomaly, obj) {
    let pos = [] ;
    let theta = trueAnomaly; // True anomaly
    let a = obj.a;           // Semi-major Axis
    let i = obj.i;           // Orbital Inclination
    let argOfPeri = obj.argOfPeri; // Argument of Perihelion
    let e = obj.e;           // Orbital eccentricity
    let longNode = obj.longNode; // Ascending Node
    let sLR = a * (1 - e * e);  // Semi-Latus Rectum
    let r = sLR / (1 + e * Math.cos(theta)); // Radial distance

    // Pozisyon hesaplaması (x, y, z)
    pos[0] = r * (Math.cos(argOfPeri + theta) * Math.cos(longNode) - Math.cos(i) * Math.sin(argOfPeri + theta) * Math.sin(longNode));
    pos[1] = r * (Math.cos(argOfPeri + theta) * Math.sin(longNode) + Math.cos(i) * Math.sin(argOfPeri + theta) * Math.cos(longNode));
    pos[2] = r * (Math.sin(argOfPeri + theta) * Math.sin(i));
    return pos;
}

function meanToEccentricAnomaly(e, M) {
    var tol = 0.0001; // Tolerance for convergence
    var eAo = M;      // Initialize eccentric anomaly with mean anomaly
    var ratio = 1;    // Set ratio higher than tolerance
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

// 3D Sahne Kurulumu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sun
const sunGeometry = new THREE.SphereGeometry(0.05, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Asteroidleri sahneye ekle
function objCreate(asteroids) {
    for (let asteroid of asteroids) {
        const meteorGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
        scene.add(meteor);
        asteroid.meteor = meteor;
    }
}

// Animasyon Fonksiyonu
function animate(asteroids) {
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
        asteroid.meteor.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
    }

    // JD'yi her karede 1 gün artır (Simülasyon her karede 1 gün ilerleyecek)
    currentJD += JD_step;

    renderer.render(scene, camera);
    requestAnimationFrame(() => animate(asteroids));
}

// Başlangıç Kamera Pozisyonu
camera.position.z = 5;
