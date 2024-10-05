let mercuryParams = {
    a: 0.38709843,
    a_cy: 0.00000000,
    e: 0.20563661,
    e_cy: 0.00002123,
    i: 7.00559432,
    i_cy: -0.00590158,
    L: 252.25166724,
    L_cy: 149472.67486623,
    longPeri: 77.45771895,
    longPeri_cy: 0.15940013,
    longNode: 48.33961819,
    longNode_cy: -0.12214182
}

function updateMercuryParams(T){
    mercuryParams.a = mercuryParams.a + mercuryParams.a_cy * T;
    mercuryParams.e = 0.20563593 + mercuryParams.e_cy * T;
    mercuryParams.i = 7.00497902 + mercuryParams.i_cy * T;
    mercuryParams.L = 252.25032350 + mercuryParams.L_cy * T;
    mercuryParams.longPeri = 77.45779628 + mercuryParams.longPeri_cy * T;
    mercuryParams.longNode = 48.33076593 + mercuryParams.longNode_cy * T;
}

function degToRad(deg){
    return deg * Math.PI / 180;
}

function eccentricAnomalyCalculator(meanAnomaly, e){
    let eccentricAnomaly= degToRad(meanAnomaly);
    let deltaE;

    for(let i = 0; i< 100; i++){
        deltaE = (degToRad(meanAnomaly) - (eccentricAnomaly - degToRad(e) * Math.sin(eccentricAnomaly))) / (1 - degToRad(e) * Math.cos(eccentricAnomaly));
        eccentricAnomaly += deltaE;
        if (Math.abs(deltaE) < 1e-8) {
            return eccentricAnomaly;
        }
        
    }
}


function findXHelio(a, eccentricAnomaly, e){
    return a * (Math.cos(eccentricAnomaly) - degToRad(e));

}


function findYHelio(a, eccentricAnomaly, e) {
    return a * Math.sqrt(1 - degToRad(e) ** 2) * Math.sin(eccentricAnomaly);
}


let epoch = 2451545.0;
let currentDay = 2460589.0;

for(let i = 0; i< 10; i++){

    let T = (currentDay - epoch)/36525;

    updateMercuryParams(T);

    const meanAnomaly = mercuryParams.L - mercuryParams.longPeri;
    const eccentricAnomaly = eccentricAnomalyCalculator(meanAnomaly, mercuryParams.e);
    const xHelio = findXHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);
    const yHelio = findYHelio(mercuryParams.a, eccentricAnomaly, mercuryParams.e);
    
    currentDay += 1;
    
    console.log("x" + xHelio + " -- " + "y" + yHelio)
}
