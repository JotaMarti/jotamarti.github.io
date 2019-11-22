console.log("Hello Word!");

const ANGULO_RECTO = 90;
const MAX_ANGULO_TRIANGULO = 180;
let triangulos = {
  datosIntroducidos: {
    fovCamara: 0,
    tilt: 0,
    altura: 0
  },
  trianguloSombra: {
    SanguloA: 0,
    SanguloB: 0,
    SanguloC: 90,
    Sladoa: 0,
    Sladob: 0,
    Sladoc: 0
  },
  trianguloCamara: {
    CanguloA: 0,
    CanguloB: 0,
    CanguloC: 0,
    Cladoa: 0,
    Cladob: 0,
    Cladoc: 0
  }
};

//A = 180 - B - C;

//b = (a * Math.sin(toRadian(B))) / Math.sin(toRadian(A));

//console.log(b);


const formulario = document.getElementById("formulario").addEventListener("submit", e => {
  e.preventDefault();
  triangulos.datosIntroducidos.altura = parseInt(document.getElementById("altura").value);
  triangulos.datosIntroducidos.tilt = parseInt(document.getElementById("tilt").value);
  triangulos.datosIntroducidos.fovCamara = parseInt(document.getElementById("fov").value);

  let { fovCamara, tilt, altura } = triangulos.datosIntroducidos;
  triangulos.trianguloSombra.Sladoa = altura;


  triangulos.trianguloSombra.SanguloB = ANGULO_RECTO - tilt - fovCamara;
  triangulos.trianguloSombra.SanguloA = MAX_ANGULO_TRIANGULO - triangulos.trianguloSombra.SanguloB - triangulos.trianguloSombra.SanguloC;

  let { SanguloA, SanguloB, SanguloC } = triangulos.trianguloSombra;

  let { Sladoa } = triangulos.trianguloSombra;

  triangulos.trianguloSombra.Sladob = (Sladoa * Math.sin(toRadian(SanguloB))) / Math.sin(toRadian(SanguloA));
  triangulos.trianguloSombra.Sladoc = (Sladoa * Math.sin(toRadian(SanguloC))) / Math.sin(toRadian(SanguloA));

  let { Sladob, Sladoc } = triangulos.trianguloSombra;


  triangulos.trianguloCamara.Cladoa = Sladoc;

  triangulos.trianguloCamara.CanguloC = MAX_ANGULO_TRIANGULO - SanguloA;

  triangulos.trianguloCamara.CanguloB = fovCamara;

  triangulos.trianguloCamara.CanguloA = MAX_ANGULO_TRIANGULO - triangulos.trianguloCamara.CanguloB - triangulos.trianguloCamara.CanguloC;


  let { Cladoa, CanguloB, CanguloA } = triangulos.trianguloCamara;

  triangulos.trianguloCamara.Cladob = (Cladoa * Math.sin(toRadian(CanguloB))) / Math.sin(toRadian(CanguloA));


  alert(`La sombra de este cámara es ${Math.round(Sladob * 100) / 100}m y la distancia máxima es : ${Math.round((triangulos.trianguloCamara.Cladob + Sladob) * 100) / 100}m`);






});

















function toRadian(num) {
  return (num * Math.PI) / 180;
}
