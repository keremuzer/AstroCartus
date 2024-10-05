let mercuryParams = {
    a_init: 0.38709843,
    a_cy: 0.00000000,
    e_init: 0.20563661,
    e_cy: 0.00002123,
    i_init: 7.00559432,
    i_cy: -0.00590158,
    L_init: 252.25166724,
    L_cy: 149472.67486623,
    longPeri_init: 77.45771895,
    longPeri_cy: 0.15940013,
    longNode_init: 48.33961819,
    longNode_cy: -0.12214182
}

let venusParams = {
    a_init: 0.72332102,
    a_cy: -0.00000026,
    e_init: 0.00676399,
    e_cy: -0.00005107,
    i_init: 3.39777545,
    i_cy: 0.00043494,
    L_init: 181.97970850, 
    L_cy: 58517.81560260,
    longPeri_init: 131.76755713,
    longPeri_cy: 0.05679648,
    longNode_init:  76.67261496,
    longNode_cy: -0.27274174 
}

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
    longNode_cy: -0.26852431
}

let earthParams = {
    a_init: 1.00000018,
    a_cy: -0.00000003,
    e_init: 0.01673163,
    e_cy: -0.00003661,
    i_init: -0.00003661,
    i_cy:  -0.01337178,
    L_init: 100.46691572,
    L_cy: 35999.37306329,
    longPeri_init: 102.93005885,
    longPeri_cy:  0.31795260,
    longNode_init: -5.11260389,
    longNode_cy: -0.24123856 
}


let jupiterParams = {
    a_init: 5.20248019,
    a_cy: -0.00002864,
    e_init: 0.04853590,
    e_cy: 0.00018026,
    i_init: 1.29861416,
    i_cy: -0.00322699,
    L_init: 34.33479152,
    L_cy: 3034.90371757,
    longPeri_init: 14.27495244,
    longPeri_cy:  0.18199196,
    longNode_init: 0.13024619,
    longNode_cy: 113.63998702
}

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
    longNode_cy: -0.25015002 
}

let uranusParams = {
    a_init: 19.18797948,
    a_cy: -0.00020455,
    e_init: 0.04685740,
    e_cy: -0.00001550,
    i_init: 0.77298127,
    i_cy: -0.00180155,
    L_init: 314.20276625,
    L_cy: 428.49512595,
    longPeri_init: 172.43404441,
    longPeri_cy: 0.09266985,
    longNode_init: 73.96250215,
    longNode_cy: 0.05739699
}

// ! TEKRAR BAK YANLIS GIRDIM SANIRIM
let neptuneParams = {
    a_init: 30.06952752,
    a_cy: 0.00006447,
    e_init: 0.00895439,
    e_cy: 0.00000818,
    i_init: 1.77005520 ,
    i_cy: 0.00022400,
    L_init: 304.22289287,
    L_cy: 218.46515314,
    longPeri_init: 46.68158724,
    longPeri_cy: 0.01009938,
    longNode_init: 46.68158724,
    longNode_cy: -0.12214182
}


function updateParams(obj,T){
    obj.a = obj.a_init + obj.a_cy * T;
    obj.e = obj.e_init + obj.e_cy * T;
    obj.i = obj.i_init  + obj.i_cy * T;
    obj.L = obj.L_init + obj.L_cy * T;
    obj.longPeri = obj.longPeri_init + obj.longPeri_cy * T;
    obj.longNode = obj.longNode_init + obj.longNode_cy * T;
}

function degToRad(deg){
    return deg * Math.PI / 180;
}

function eccentricAnomalyCalculator(meanAnomaly, e){
    let eccentricAnomaly= degToRad(meanAnomaly);
    let deltaE;

    for(let i = 0; i< 100; i++){
        deltaE = (degToRad(meanAnomaly) - (eccentricAnomaly - e * Math.sin(eccentricAnomaly))) / (1 - e * Math.cos(eccentricAnomaly));
        eccentricAnomaly += deltaE;
        if (Math.abs(deltaE) < 1e-8) {
            return eccentricAnomaly;
        }
    }
    throw new Error("Max iterations reached in eccentric anomaly calculation.");

}


function findXHelio(a, eccentricAnomaly, e){
    return a * (Math.cos(eccentricAnomaly) - e);

}


function findYHelio(a, eccentricAnomaly, e) {
    return a * Math.sqrt(1 - degToRad(e) ** 2) * Math.sin(eccentricAnomaly);
}


let epoch = 2451545.0;
let currentDay = 2460589.0;


        // 3D Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Sun
        const sunGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Mercury
        const mercuryGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const mercuryMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
        scene.add(mercury);

        // Venus
        const venusGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const venusMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const venus = new THREE.Mesh(venusGeometry, venusMaterial);
        scene.add(venus);



        // Mars 
        const marsGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const marsMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const mars = new THREE.Mesh(marsGeometry, marsMaterial);
        scene.add(mars);

        // Earth
        const earthGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const earthMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Jupiter

        const jupiterGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const jupiterMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
        scene.add(jupiter);

        // Saturn
        const saturnGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const saturnMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
        scene.add(earth);

        // Uranus

        const uranusGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const uranusMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
        scene.add(uranus);

        // Neptune

        const neptuneGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const neptuneMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733 });
        const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
        scene.add(neptune);

        camera.position.z = 2;





function animate(){

    let T = (currentDay - epoch)/36525;

    // ! Koordinat sistemini ekvatoral duzleme gore tekrar duzenle

    // Mercury icin
    updateParams(mercuryParams,T);
    let meanAnomaly = mercuryParams.L - mercuryParams.longPeri;
    let eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, mercuryParams.e);
    let xHelio = findXHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);
    let yHelio = findYHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);

    mercury.position.x = xHelio;
    mercury.position.y = yHelio;

    // Venus icin
    updateParams(venusParams,T);

    meanAnomaly = venusParams.L - venusParams.longPeri;
    eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, venusParams.e);
    xHelio = findXHelio(venusParams.a, eccentricAnomaly, venusParams.e);
    yHelio = findYHelio(venusParams.a, eccentricAnomaly, venusParams.e);

    venus.position.x = xHelio;
    venus.position.y = yHelio;

    // Mars

    updateParams(marsParams,T);

    meanAnomaly = marsParams.L - marsParams.longPeri;
    eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, marsParams.e);
    xHelio = findXHelio(marsParams.a, eccentricAnomaly, marsParams.e);
    yHelio = findYHelio(marsParams.a, eccentricAnomaly, marsParams.e);

    mars.position.x = xHelio;
    mars.position.y = yHelio;

    // Jupiter

    updateParams(jupiterParams,T);

    meanAnomaly = jupiterParams.L - jupiterParams.longPeri;
    eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, jupiterParams.e);
    xHelio = findXHelio(jupiterParams.a, eccentricAnomaly, jupiterParams.e);
    yHelio = findYHelio(jupiterParams.a, eccentricAnomaly, jupiterParams.e);

    jupiter.position.x = xHelio;
    jupiter.position.y = yHelio;

    // Saturn

    updateParams(saturnParams,T);

    meanAnomaly = saturnParams.L - saturnParams.longPeri;
    eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, saturnParams.e);
    xHelio = findXHelio(saturnParams.a, eccentricAnomaly, saturnParams.e);
    yHelio = findYHelio(saturnParams.a, eccentricAnomaly, saturnParams.e);

    saturn.position.x = xHelio;
    saturn.position.y = yHelio;

    // Uranus
    
    updateParams(uranusParams,T);

    meanAnomaly = uranusParams.L - uranusParams.longPeri;
    eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, uranusParams.e);
    xHelio = findXHelio(uranusParams.a, eccentricAnomaly, uranusParams.e);
    yHelio = findYHelio(uranusParams.a, eccentricAnomaly, uranusParams.e);

    uranus.position.x = xHelio;
    uranus.position.y = yHelio;

    // Neptune

    updateParams(neptuneParams,T);

    meanAnomaly = neptuneParams.L - neptuneParams.longPeri;
    eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, neptuneParams.e);
    xHelio = findXHelio(neptuneParams.a, eccentricAnomaly, neptuneParams.e);
    yHelio = findYHelio(neptuneParams.a, eccentricAnomaly, neptuneParams.e);

    neptune.position.x = xHelio;
    neptune.position.y = yHelio;

    currentDay += 1;
    


    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();




