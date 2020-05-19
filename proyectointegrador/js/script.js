let puntos = [];
let mymap = L.map("mapid").setView([39.942, -0.09], 13);
let altitudDistancia = [];
let arrayCorazon = [];
let arrayCorazonDistancia = [];

window.onload = cargaPagina();

function cargaPagina() {
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVhbm1hODg3IiwiYSI6ImNrYTV2bnk4YzAwenMzM3F5OWVoa3JxM3EifQ.917DxX9epryDDNHZ4ws-cA",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "your.mapbox.access.token",
    }
  ).addTo(mymap);
  fetchData().then((data) => {
    let tiempoTotal = data.getElementsByTagName("TotalTimeSeconds")[0].textContent;
    let distanciaTotal = data.getElementsByTagName("DistanceMeters")[0].textContent;
    let calorias = data.getElementsByTagName("Calories")[0].textContent;
    let velocidadMedia = calculaVelocidadMedia(distanciaTotal, tiempoTotal);
    array = HTMLCollectionToArray(data);
    array.forEach((elemento) => {
      let latitud;
      let longitud;
      let array = [];
      let arrayAltitudDistanciaTemp = [];
      let arrayCorazonDistanciaTemp = [];
      arrayAltitudDistanciaTemp.push(elemento.childNodes[5]);
      arrayAltitudDistanciaTemp.push(elemento.childNodes[7]);
      arrayCorazon.push(elemento.childNodes[9].childNodes[1].textContent);
      altitudDistancia.push(arrayAltitudDistanciaTemp);
      arrayCorazonDistanciaTemp.push(elemento.childNodes[9].childNodes[1].textContent);
      arrayCorazonDistanciaTemp.push(elemento.childNodes[7].textContent);
      arrayCorazonDistancia.push(arrayCorazonDistanciaTemp);
      latitud = parseFloat(elemento.childNodes[3].childNodes[1].textContent);
      longitud = parseFloat(elemento.childNodes[3].childNodes[3].textContent);
      array.push(latitud);
      array.push(longitud);
      puntos.push(array);
    });
    let polygon = L.polygon(puntos).addTo(mymap);
    imprimeDatos(tiempoTotal, distanciaTotal, calorias, velocidadMedia);
    let datos = ExtraeDatosDistancia(altitudDistancia);
    pintaGraficaDistancia(ExtraeDatosTablaDistancia(datos));
    let arrayCorazonNumeros = parseaObjeto(arrayCorazon);
    let media = calculaMediaArray(arrayCorazonNumeros);
    imprimeDatosCorazon(arrayCorazon, media);
    let datosCorazon = ExtraeDatosCorazon(arrayCorazonDistancia);
    pintaGraficaCorazon(ExtraeDatosTablaCorazon(datosCorazon));
    let acumulado = 0;
    for(let i=0; i<puntos.length-1; i++){
      acumulado = acumulado + calculaDistancia(puntos[i], puntos[(i+1)]);
    }
    console.log(acumulado);
  });
}

async function fetchData() {
  let value = fetch("../data/rellotgeA.xml", {
    cache: "no-store",
  })
    .then((response) => {
      let texto = response.text();
      return texto;
    })
    .then((str) => {
      let xml = new window.DOMParser().parseFromString(str, "text/xml");
      return xml;
    });
  return value;
}

function calculaVelocidadMedia(distanciaMetros, tiempoSegundos) {
  let resultado = (((distanciaMetros/tiempoSegundos)*60)*60);
  resultado = (resultado/1000).toFixed(2);
  return resultado;

}

function parseaObjeto(objeto) {
  let array = [];
  for (let i = 0; i < objeto.length; i++) {
    array.push(parseInt(objeto[i]));
  }
  return array;
}

function calculaMediaArray(array) {
  let media;
  media = array.reduce((a, b) => a + b, 0) / array.length;
  return parseFloat(media).toFixed(1);
}

function HTMLCollectionToArray(HTMLCollection) {
  let x = HTMLCollection.getElementsByTagName("Trackpoint");
  let array = [].slice.call(x);
  return array;
}

function imprimeDatos(tiempo, distancia, calorias, velocidad) {
  document.getElementById("totales").innerHTML += `
  <h3>Tiempo total</h3>
  <p>${new Date(tiempo * 1000).toISOString().substr(11, 8)}</p>
  <h3>Distancia recorrida</h3>
  <p>${distancia} metros</p>
  <h3>Velocidad media</h3>
  <p>${velocidad} Km/h</p>
  <h3>Calorias quemadas</h3>
  <p>${calorias}</p>
  `;
}

function imprimeDatosCorazon(array, media) {
  document.getElementById("corazon").innerHTML += `
  <div id="mediaCorazon">
    <h2>Ritmo cardiaco medio</h2>
    <p>${media}<p>
  </div>
  <div id="datosCorazon">
    <div id=maxima>
      <h3>Pulsaciones máximas</h3>
      <p>${Math.max(...array)}</p>
    </div>
    <div id=minima>
      <h3>Pulsaciones mínimas</h3>
      <p>${Math.min(...array)}</p>
    </div>
  </div>
  `;
}

function ExtraeDatosDistancia(array) {
  let datos = {
    distancias: [],
    altitudes: [],
  };
  array.forEach((elemento) => {
    datos.distancias.push(parseFloat(elemento[1].textContent).toFixed(1));
    datos.altitudes.push(elemento[0].textContent);
  });
  return datos;
}

function ExtraeDatosTablaDistancia(datos) {
  let datosTabla = {
    labels: datos.distancias,
    datasets: [
      {
        label: "Altitud (Metros)",
        fill: true,
        backgroundColor: "#65dd9b",
        borderColor: "#65dd9b",
        borderWidth: 1,
        data: datos.altitudes,
      },
    ],
  };
  return datosTabla;
}

function pintaGraficaDistancia(datos) {
  const ctx = document.getElementById("graficaDistancia").getContext("2d");
  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: datos,

    // Configuration options go here
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      legend: {
        labels: {
          fontColor: "white",
        },
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              fontColor: "white",
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Distancia",
              fontColor: "white",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              fontColor: "white",
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Altura (Metros)",
              fontColor: "white",
            },
          },
        ],
      },
    },
  });
}

function ExtraeDatosCorazon(array) {
  let datos = {
    distancias: [],
    latidospm: [],
  };
  array.forEach((elemento) => {
    datos.distancias.push(parseFloat(elemento[1]).toFixed(1));
    datos.latidospm.push(elemento[0]);
  });
  return datos;
}

function ExtraeDatosTablaCorazon(datos) {
  let datosTabla = {
    labels: datos.distancias,
    datasets: [
      {
        label: "Latidos por minuto",
        fill: true,
        backgroundColor: "#f65164",
        borderColor: "#f65164",
        borderWidth: 1,
        data: datos.latidospm,
      },
    ],
  };
  return datosTabla;
}

function pintaGraficaCorazon(datos) {
  const ctx = document.getElementById("graficaCorazon").getContext("2d");
  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: datos,

    // Configuration options go here
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      legend: {
        labels: {
          fontColor: "white",
        },
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              fontColor: "white",
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Distancia",
              fontColor: "white",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              fontColor: "white",
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Latidos",
              fontColor: "white",
            },
          },
        ],
      },
    },
  });
}




function calculaDistancia(latlong1, latlong2) {
    var R = 6371e3; // Radius of the earth in km
    var dLat = deg2rad(latlong2[0]-latlong1[0]);  // deg2rad below
    var dLon = deg2rad(latlong2[1]-latlong1[1]); 
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(latlong1[0])) * Math.cos(deg2rad(latlong2[0])) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
