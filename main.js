const boton = document.getElementById('boton')
const fecha = document.getElementById('fecha')
const temperatura = document.getElementById('temperatura')
const city = document.getElementById('ciudad')
const tempmin = document.getElementById('tempmin')
const tempmax = document.getElementById('tempmax')
const estado = document.getElementById('estado')
const icon = document.getElementById('icon')
const horas = document.getElementById('horas')


/* https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid={API key}
API key = 0e92d3a889d4510f17b26636ff63a3e2 */
/* let url = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=0e92d3a889d4510f17b26636ff63a3e2' */

/* https://api.openweathermap.org/data/2.5/weather?q=${buscar}&units=metric&appid=616629f9acdc3b22b8b09553e632e5da */

/* https://api.openweathermap.org/data/2.5/weather?q=${buscar}&units=metric&appid=616629f9acdc3b22b8b09553e632e5da&lang=es */ //Principal

/* https://api.openweathermap.org/data/2.5/forecast?q=${buscar}&cnt=5&appid=616629f9acdc3b22b8b09553e632e5da&lang=es 5 dias*/

/* https://tile.openweathermap.org/map/temp_new/25/34.9833/71.2333.png?appid=616629f9acdc3b22b8b09553e632e5da 

    https://maps.openweathermap.org/maps/2.0/weather/1h/TA2/25/-34.9833/-71.2333?appid=616629f9acdc3b22b8b09553e632e5da
*/
let grados = []
let fechas = []

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

    info.map((elemento) => {
        horas.innerHTML += `<div>${elemento.dt_txt}</div> <div>${elemento.main.temp}</div>`        
/*             grados.push(Math.trunc(elemento.main.temp));
            fechas.push(obtenerHora(elemento.dt_txt)); */
        });
    
    let grados1 = info.map((grado) => Math.trunc(grado.main.temp))
    grados = grados1
    
    let fechas1 = info.map((fech) => obtenerHora(fech.dt_txt))
    fechas = fechas1
    console.log("Grados: ",grados );
    console.log("Fechas: ",fechas );

    const data = {
        labels: fechas,
         datasets: [{
                label: 'Temperatura Por hora',
                data: grados,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
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
       
    pintaDatos(response) 
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

function obtenerHora(fecha){
    let hora_corregida = fecha;
    hora_corregida = hora_corregida.split(' ');
    hora_corregida = hora_corregida[1];
    hora_corregida = hora_corregida.split(':');
    hora_corregida = `${hora_corregida[0]}:${hora_corregida[1]}`
    return hora_corregida
}


boton.addEventListener('click', clima)


/* coord:
lat: -33.4569
lon: -70.6483 */

/* https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=616629f9acdc3b22b8b09553e632e5da */