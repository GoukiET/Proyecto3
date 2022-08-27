const boton = document.getElementById('boton')
const fecha = document.getElementById('fecha')
const temperatura = document.getElementById('temperatura')
const city = document.getElementById('ciudad')
const tempmin = document.getElementById('tempmin')
const tempmax = document.getElementById('tempmax')
const estado = document.getElementById('estado')
const icon = document.getElementById('icon')
/* const hora = document.getElementById('hora') */


/* Mi API KEY 0e92d3a889d4510f17b26636ff63a3e2*/
/* https://api.openweathermap.org/data/2.5/weather?q=${buscar}&units=metric&appid=616629f9acdc3b22b8b09553e632e5da&lang=es */ //Principal

let grados = [];
let horas = [];

async function clima(){
    
    let buscar = document.getElementById('buscar').value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${buscar}&units=metric&appid=616629f9acdc3b22b8b09553e632e5da&lang=es`
    let response = await axios.get(url)
    response = response.data; 
    console.log(response);
    let lat = response.coord.lat
    let lon = response.coord.lon
   
    let url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=616629f9acdc3b22b8b09553e632e5da&lang=es`
    let respuesta = await axios.get(url2)    
    respuesta = respuesta.data;
    console.log(respuesta);
    let info = respuesta.list;

    var map = L.map('map').setView([`${lat}`, `${lon}`], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([`${lat}`, `${lon}`]).addTo(map)
        /* .bindPopup('A pretty CSS3 popup.<br> Easily customizable.') */
        .openPopup();

/*     info.map((elemento) => {
        horas.innerHTML += `<div>${elemento.dt_txt}</div> <div>${elemento.main.temp}</div>`        
            grados.push(Math.trunc(elemento.main.temp));
            fechas.push(obtenerHora(elemento.dt_txt)); 
        }); */
    
    let grados_api = info.map((grado) => Math.trunc(grado.main.temp)) //Obtengo temperatura
    
    grados = grados_api
    
    let horas_api = info.map((fech) => obtenerHora(fech.dt_txt)) //Obtengo Horas
    console.log("Fechas: ",horas_api );
    horas = horas_api
    console.log("Grados: ",grados );
    console.log("Fechas: ",horas );


//Principio del Gráfico
    const data = {
        labels: horas,
         datasets: [{
                label: 'Temperatura próximas 5 Horas',
                data: grados,
                fill: false,
                borderColor: 'rgb(255,0,0)', //'rgb(75, 192, 192)'
                tension: 0.1
        }]
    };
    const config = {
        type: 'line',
        data: data,
        options: {}
      };
      
    const myChart = new Chart(
        document.getElementById('myChart'),
        config,        
      );
//Fin del gráfico       
    pintaDatos(response) //Pinto datos obtenidos de la api
}

function pintaDatos(response){
    /* let {temp, temp_max, temp_min } = response.main 
       console.log(temp);
    */  
    //Hora Unix a Hora UTC
    let unixTimestamp = response.dt
    let date = new Date(unixTimestamp*1000);
    fecha.textContent = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

    //Se obtiene nombre de ciudad
    city.textContent = `${response.name}`
    //Obtencion temperatura
    let tempRedondeada = Math.trunc(response.main.temp)
    temperatura.textContent = `${tempRedondeada}°C`

    let tempminima = Math.trunc(response.main.temp_min)
    tempmin.textContent = `${tempminima}°C`
    
    let tempmaxima = Math.trunc(response.main.temp_max)
    tempmax.textContent = `${tempmaxima}°C`

    estado.textContent = `${response.weather[0].description}`

    icon.src= `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`

    /* console.log(response.weather[0].description) */

}

function obtenerHora(fecha){ //Funcion que me formatea la hora 
    let hora_corregida = fecha;
    hora_corregida = hora_corregida.split(' ');
    hora_corregida = hora_corregida[1];
    hora_corregida = hora_corregida.split(':');
    hora_corregida = `${hora_corregida[0]}:${hora_corregida[1]}`
    return hora_corregida
}


boton.addEventListener('click', clima)


