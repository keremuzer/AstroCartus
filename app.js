// Excel dosyasını oku
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
        console.log(asteroids);
        animate(asteroids);

    })
    .catch(err => console.error(err));

function determinePos(trueAnomaly, obj) {
    let pos = [] ;
    let xdot; let ydot; let zdot;            // velocity coordinates
    let theta = trueAnomaly;                          // Update true anomaly.
    let a = obj.a;                      // Semi-major Axis
    let i =  obj.i ;                      // Orbital Inclination
    let argOfPeri = obj.argOfPeri ;                       // Get the object's orbital elements.
    let e = obj.e;                        // Orbital eccentricity
    let longNode = obj.longNode ;                       // ascending Node
    let sLR = a * (1 - e^2) ;             // Compute Semi-Latus Rectum.
    let r = sLR/(1 + e * Math.cos(theta));  // Compute radial distance.

    // Compute position coordinates pos[0] is x, pos[1] is y, pos[2] is z
    pos[0] = r * (Math.cos(argOfPeri + theta) * Math.cos(longNode) - Math.cos(i) * Math.sin(argOfPeri + theta) * Math.sin(longNode)) ;  
    pos[1] = r * (Math.cos(argOfPeri + theta) * Math.sin(longNode) + Math.cos(i) * Math.sin(argOfPeri + theta) * Math.cos(longNode)) ;
    pos[2] = r * (Math.sin(argOfPeri + theta) * Math.sin(i)) ;
    return pos;
}

function trueToEccentricAnomaly(e,trueAnomaly) {
    
     var eccentricAnomaly = 2* Math.atan(Math.sqrt((1-e)/(1+e))* Math.tan(trueAnomaly/2));
    
        return eccentricAnomaly ;
    }

// bu fonksiyonu ileride değiştir
function meanToEccentricAnomaly (e, M) {
    // Solves for eccentric anomaly, E from a given mean anomaly, M
    // and eccentricty, e.  Performs a simple Newton-Raphson iteration
    // Code derived from Matlab scripts written by Richard Rieber, 1/23/2005
    // http://www.mathworks.com/matlabcentral/fileexchange/6779-calce-m
        var tol = 0.0001;  // tolerance
        var eAo = M;       // initialize eccentric anomaly with mean anomaly
        var ratio = 1;     // set ratio higher than the tolerance
    while (Math.abs(ratio) > tol) {
        var f_E = eAo - e * Math.sin(eAo) - M;
        var f_Eprime = 1 - e * Math.cos(eAo);
        ratio = f_E / f_Eprime;
        if (Math.abs(ratio) > tol) {
            eAo = eAo - ratio;
            // console.log ("ratio  " + ratio) ;
            }
        else
            eccentricAnomaly = eAo;
        }
        return eccentricAnomaly 
    } 

    function eccentricToTrueAnomaly(e, E) {
           var trueAnomaly = 2 * Math.atan(Math.sqrt((1+e)/(1-e))* Math.tan(E/2));
           return trueAnomaly
       }
    function updateTheDate() 
        { // Display the simulated date to the right of the model.
        //  epoch.setTime(epoch.getTime() + simSpeed * 86400)
        if (simSpeed == 1) {
            epoch.setDate(epoch.getDate() + 1) ;            // At maximum speed, increment calendar by a day for each clock-cycle.
        } else {  epoch.setTime(epoch.getTime() + simSpeed * 24 * 3600000) ; }  // 24 hours * milliseconds in an hour * simSpeed 
    
    //	 document.getElementById("modelDate").innerHTML = (epoch.getMonth() + 1) + "-" + epoch.getDate() + "-" + epoch.getFullYear() ;
        }
        // 3D Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        function objCreate(asteroids){
            for (let asteroid of asteroids) {
                const meteorGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
                const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
                scene.add(meteor);
                asteroid.meteor = meteor;
                // You can perform your animation updates here based on asteroid data
                // For example, update position or draw them on a canvas/3D environment
            }
        }

        function animate(asteroids) {
            let currentPosition = [];
            let deltaTime = 0;
            for (let asteroid of asteroids) {
                let trueAnomaly = asteroid.trueAnomaly;
                let currentPosition = determinePos(trueAnomaly, asteroid);
                console.log(currentPosition);

                asteroid.meteor.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);

                // You can perform your animation updates here based on asteroid data
                // For example, update position or draw them on a canvas/3D environment
            }   
        }

//animate(asteroids);




/*
// Three.js sahnesini oluştur
function createScene(asteroids) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    // kamera ekle
    scene.add(camera);

    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Işık ekle

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);    
    

    // Yörünge pozisyonunu hesapla
    function calculatePosition(a, e, i, w, ma, n, t) {
        const mu = 398600; // Dünya'nın çekim parametresi (km^3/s^2)
        const T = Math.sqrt(Math.pow(a, 3) / mu);
        const M = ma + (2 * Math.PI / T) * t;
        let E = M;

        for (let j = 0; j < 10; j++) {
            E += (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
        }

        
        const x = a * (Math.cos(E) - e);
        const y = a * Math.sqrt(1 - e * e) * Math.sin(E);

        let retVal = new THREE.Vector3(x, y, 0);
        return retVal;
    }

    // Asteroidleri sahneye ekle
    asteroids.forEach(data => {
        const asteroidGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        
        const position = calculatePosition(data.semiMajorAxis, data.eccentricity, data.inclination, data.argumentOfPeriapsis, data.meanAnomaly, data.ascendingNode, 0);
        asteroid.position.copy(position);
        scene.add(asteroid);
    });

    // Animasyon döngüsü
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        asteroids.forEach((data, index) => {
            const thePosition = calculatePosition(data.semiMajorAxis, data.eccentricity, data.inclination, data.argumentOfPeriapsis, data.meanAnomaly, data.ascendingNode, time);
            const asteroid = scene.children[index + 2]; // +2, çünkü sadece ilk iki çocuktan sonrası asteroid (ilk ikisi ışık ve kamera)
            if (asteroid == null) debugger;
            asteroid.position.copy(thePosition);
        });

        renderer.render(scene, camera);
    }

    animate();
}
    */


