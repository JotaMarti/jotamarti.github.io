let PAIS_ELEGIDO = "Afghanistan";
let xml;
let chart;
let array;
let set;


window.onload = cargaPagina();

document.getElementById('paises')
  .addEventListener('change', refrescaPagina, false);

function cargaPagina() {
  fetchData().then(data => {
  array = HTMLCollectionToArray(data);
  set = getSetPaises(array);
  fillSelect(set);
  let filtrado = filtrarPais(array, PAIS_ELEGIDO);
  let datos = ExtraeDatosPais(filtrado);
  pintaGrafica(ExtraeDatosTabla(datos));
  pintaTabla(filtrado, datos);
  });
}

function refrescaPagina() {
  let elemento = document.getElementById("paises");
  let strUser = elemento.options[elemento.selectedIndex].value;
  PAIS_ELEGIDO = strUser;
  limpiaElemento(paises);
  fillSelect(set);
  let filtrado = filtrarPais(array, PAIS_ELEGIDO);
  let datos = ExtraeDatosPais(filtrado);
  limpiaElemento(tbody);
  limpiaElemento(tfoot);
  refrescaGrafica(ExtraeDatosTabla(datos));
  pintaTabla(filtrado, datos);
}


async function fetchData() {
  let value = fetch("https://jotamarti.github.io/covid/data/casos.xml", {
    cache: "no-store"
  })
    .then(response => {
      let texto = response.text();
      return texto;
    })
    .then(str => {
      let xml = new window.DOMParser().parseFromString(str, "text/xml");
      return xml;
    });
  return value;
};

function HTMLCollectionToArray(HTMLCollection){
  let x = HTMLCollection.getElementsByTagName("record");
  let array = [].slice.call(x);
  return array;
}

function getSetPaises(array){
  let set = new Set();
  array.forEach(elemento => {
    set.add(elemento.childNodes[13].textContent);
  })
  return set;
}

function fillSelect(set){
  for (let item of set) {
    if (PAIS_ELEGIDO === item) {
      document.getElementById("paises").innerHTML += `<option value="${item}" selected>${item}</option>`
    } else {
      document.getElementById("paises").innerHTML += `<option value="${item}">${item}</option>`
    }
    
  }
}

function filtrarPais(array, pais){
  let paisElegido = array.filter(record => record.childNodes[13].textContent === `${pais}`);
  return paisElegido;
}

function ExtraeDatosPais(array){
  let datos = {
    totalInfectados: 0,
    totalMuertos: 0,
    dias: [],
    infectados: [],
    muertos: []
  }
  array.forEach(elemento => {
    datos.totalInfectados += parseInt(elemento.childNodes[9].textContent);
    datos.totalMuertos += parseInt(elemento.childNodes[11].textContent);
    datos.dias.push(elemento.childNodes[1].textContent);
    datos.infectados.push(elemento.childNodes[9].textContent > 0 ? elemento.childNodes[9].textContent : 0);
    datos.muertos.push(elemento.childNodes[11].textContent);
  });
  return datos;
}

function pintaTabla(array, datos){
  array.map(andorra => (document.getElementById("tbody").innerHTML += `<tr><td></td><td>${andorra.childNodes[1].textContent}</td><td>${andorra.childNodes[9].textContent}</td><td>${andorra.childNodes[11].textContent}</td></tr>`));
  document.getElementById("tfoot").innerHTML += `<tr><td>Total</td><td></td><td>${datos.totalInfectados}</td><td>${datos.totalMuertos}</td></tr>`;
}

function pintaGrafica(datos){
  const ctx = document.getElementById("myChart").getContext("2d");
  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: datos,

    // Configuration options go here
    options: {
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Dia'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Numero Personas'
          }
        }]
      }
    }
  });
};

function refrescaGrafica(datos){
  chart.data = datos
  chart.update();
}

function ExtraeDatosTabla(datos){
  let datosTabla = {
    labels: datos.dias.reverse(),
    datasets: [
      {
        label: "Muertos",
        fill: false,
        backgroundColor: "red",
        borderColor: "red",
        data: datos.muertos.reverse()
      },
      {
        label: "Infectados",
        backgroundColor: "#4caf50",
        borderColor: "#4caf50",
        data: datos.infectados.reverse(),
        fill: true
      }
    ]
  }
  return datosTabla;
}

function limpiaElemento(elemento) {
  while (elemento.hasChildNodes()) {
    elemento.removeChild(elemento.firstChild);
  }
}
