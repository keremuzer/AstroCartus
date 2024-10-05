obj = {

    a: 1.078,  // Semi-major axis (AU)
    a_sigma: 1.3e-09,
    e: 0.8270,  // Eccentricity (rad)
    e_sigma:  2.3e-09,
    i: 22.80,  // Inclination (deg)
    i_sigma: 6.0e-07,
    peri : 31.43, // Longitude of perihelion (deg)
    peri_sigma : 3.6e-07,
    node : 87.95,  // Longitude of the ascending node (deg)
    node_sigma: 2.3e-07,
    M: 160.86,  // init Mean Anomaly (deg)
    M_sigma: 4.9e-06,
    n: 0.8805 * Math.PI / 180 // rad/day
}



// ! JD HESALPLAYAN fonk yaz!


function degToRad(param){
    return param * Math.PI / 180 ;
}

function argPeriCalculator(peri, node){
    return peri - node;

}


function eccentricAnomalyCalc(obj, e, T, maxIteration = 100){

    obj.M += (obj.n * T)*180/Math.PI;
    

    if (M>180){
        obj.M - 180;
    }else if ( M<-180){
        obj.M + 180;
    }

// 2460589
    let M = obj.M
    let E = obj.M;
    deltaE;

    for ( i = 0; i<maxIteration; i++){

        deltaE = ((E- degToRad(e)*Math.sin(E) - M) / (1-e*Math.cos(E)));
        
        E -= deltaE // ! geri bak

        if (Math.abs(deltaE) < 1e-6){
            return E;
        }
    }
}

function findXHelio(obj, a, e, T, maxIteration = 100){
    let E = eccentricAnomalyCalc(obj, e, T, maxIteration = 100);
    return a*(Math.cos(E)) - degToRad(e);
}

function findYHelio(obj, a, e, T, maxIteration = 100){
    let E = eccentricAnomalyCalc(obj, e, T, maxIteration = 100);
    return a* Math.sqrt(1-degToRad(e)**2)* Math.sin(E);
}













