

let div_date = document.querySelector('.date');
let show_temp = document.querySelector('.temp');
let show_hum = document.querySelector('.hum');
let show_wind = document.querySelector('.wind');
let show_pres = document.querySelector('.pressure');
let show_cloud = document.querySelector('.cloud');

let show_placeName = document.querySelector('.city')
let show_all_details =document.querySelector('.all-details');
let show_future_details = document.querySelector('.future-details');
let searchBox = document.getElementById('search-box');
let search_button = document.querySelector('.fa-search');

// DISPLAY TODAY'S DAY AND DATE

const today = new Date();
//console.log(today)

weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
months = ['January','February','March','April','May','June','July','August','September','November','December'];


const date = today.getDate();
const day = weekday[today.getDay()];
const Month = months[today.getMonth()];
const year = today.getFullYear();

let fullDate = `${day} | ${date} ${Month}, ${year}`;
div_date.innerHTML = fullDate;

let show_hrs = document.querySelector('.hour');
let show_min = document.querySelector('.min');
let show_sec = document.querySelector('.sec');
let updatemyTime;
let updateLocationTime;

// Get mytime and Display time 

function displayMyTime(){

    clearInterval(updateLocationTime);
    clearInterval(updatemyTime);
    updatemyTime = setInterval(()=>{
    let m = moment();
        displayFinalTime(m);
  //  show_sec.innerHTML =sec;
},1000)

}
// Get LOCATION timezone and Display time 

function displayLocationTime(timezone){
    clearInterval(updatemyTime);
    clearInterval(updateLocationTime);
    updateLocationTime = setInterval(()=>{
        let m = moment.tz(timezone);
        displayFinalTime(m);
     //   show_sec.innerHTML =sec;
      //  console.log(min)
    },1000)
}


//Display Final Time
function displayFinalTime(m){

    let hr = m.format("HH");
    let min = m.format("mm");
    let sec = m.format("ss");
    show_hrs.innerHTML = hr + ":" ;
    show_min.innerHTML = min + "";

    if(hr<5){
        document.body.style.backgroundImage = "url('imgs/nightt.jpg')";
    }
    else if(hr<12){
        document.body.style.backgroundImage = "url('imgs/morning.jpg')";
    }
    else if(hr<18){
        document.body.style.backgroundImage = "url('imgs/afternoon.jpg')";
    }
    else if(hr<20){
        document.body.style.backgroundImage = "url('imgs/evening.jpg')";
    }
    else if (hr < 24){
        document.body.style.backgroundImage = "url('imgs/nightt.jpg')";
    }

}


// If location is not allowed then display data by entered location
// POSITIONSTACK API TO GET CITY's DATA i.e. lon and lat and name

searchBox.addEventListener("keyup",function(e){
    if(e.keyCode == 13){
        e.preventDefault();
        getEnteredPosition();
    }
});
search_button.addEventListener("click", getEnteredPosition);

function getEnteredPosition(){
    let searchBoxValue = document.getElementById('search-box').value;
   // console.log(searchBoxValue);

    const postion_apiURL= `https://api.opencagedata.com/geocode/v1/json?q=${searchBoxValue}&key=565adc4e5b404eb3a0d2e66df10b4a49`
    fetch(postion_apiURL).then(response => response.json())
    .then(city_data => { console.log(city_data);
        getCity(city_data,searchBoxValue)})
}


function getCity(city_data,searchBoxValue){
    console.log("city",city_data)
    let display_place;
    if(city_data.results[0].components.city && (city_data.results[0].components.city).toUpperCase() == searchBoxValue.toUpperCase()){
        display_place = city_data.results[0].components.city;
    }
    else if(city_data.results[0].components.station && (city_data.results[0].components.station).toUpperCase() == searchBoxValue.toUpperCase()){
        display_place = city_data.results[0].components.station;
    }
    else if(city_data.results[0].components.state && (city_data.results[0].components.state).toUpperCase() == searchBoxValue.toUpperCase()){
        display_place = city_data.results[0].components.state;
    }
    else if(city_data.results[0].components.county && (city_data.results[0].components.county).toUpperCase() == searchBoxValue.toUpperCase()){
        display_place = city_data.results[0].components.county;
    }
    else{
        display_place = city_data.results[0].components.country;
    }

    let lat = city_data.results[0].geometry.lat;
    let lon =  city_data.results[0].geometry.lng;
    //console.log(lat,lon)

    show_placeName.innerHTML = display_place;

    //calling weather api to get weather data using lon and lat

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&%20exclude=hourly,daily&appid=54175a73c73470b1810d761786a3154e`;

    const info = fetch(url)
                .then(response => response.json())
                .then(data =>{ show_data(data); 
                    displayLocationTime(data.timezone);
                 })
                .catch(error => console.log(error))
}


// If Location is allowed get my location and display data
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getmyposition);
}
else{
    alert("Enter Location");
}

//GETTING CITY'S DATA I.E. LONG LAT AND NAME

function getmyposition(pos){
    let my_lat= pos.coords.latitude;
    let my_lon = pos.coords.longitude;

    let my_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${my_lat}&lon=${my_lon}&units=metric&%20exclude=hourly,daily&appid=54175a73c73470b1810d761786a3154e`;
    let rev_geo = `https://api.opencagedata.com/geocode/v1/json?q=${my_lat}+${my_lon}&key=565adc4e5b404eb3a0d2e66df10b4a49`;

    const city_name = fetch(rev_geo)
    .then(response => response.json())
    .then(pos_data =>{
        console.log("my position data",pos_data);
         const cur_loc_name = pos_data.results[0].components.city;
         //console.log(cur_loc_name)
         show_placeName.innerHTML = cur_loc_name;
    })
    .catch(error => console.log(error))

    const info = fetch(my_url)
    .then(response => response.json())
    .then(data => {show_data(data); displayMyTime()})
    .catch(error => console.log(error))

}



// DISPLAYING ALL THE DATA'S

function show_data(data){
    console.log("weather",data);
    //today
    const curTemp = data.current.temp;
    const clouds = data.current.clouds;
    const humidity = data.current.humidity;
    const wind = data.current.wind_speed;
    const pressure = data.current.pressure;
    const timezone = data.timezone;

    show_temp.innerHTML= `${Math.round(curTemp)}&deg;`;
    show_hum.innerHTML = humidity;
    show_cloud.innerHTML = clouds;
    show_wind.innerHTML = wind;
    show_pres.innerHTML = pressure;

/*   Object.entries(w_details).forEach(entry => {
        show_all_details.innerHTML += `<div class="detail-item"><div class="item-name">${entry[0]}</div><div class="item-value">${entry[1]}</div></div>`
 //       console.log(entry); 
                }); */
    

    //Name of the next 7 days
    let next_day_names = [];
    let next_day = (today.getDay()+1);
    //if today is sat(i.e nextday=7) then make nextday=0
    if(next_day==7){
        next_day = 0;
        next_day_names = weekday;
        console.log(next_day_names)
    }
    else{
        half_1 = weekday.slice(next_day,7);
        half_2 = weekday.slice(0,next_day);
        next_day_names = half_1.concat(half_2);
    }
    //display next 7 days logic


   //get next 7 days temperature
    let future_data = [];
    for(i=0; i<7;i++){
    future_data[i] = data.daily[i].temp.max; 
    }
    //console.log(future_data)

let f_day_name = document.querySelectorAll('.day-name');
let f_weather = document.querySelectorAll('.f-weater');

    f_day_name.forEach((div,index) => {
        div.innerHTML = next_day_names[index];
    })

    f_weather.forEach((div,index) => {
        div.innerHTML = Math.ceil(future_data[index]) + "&deg;";
    })
};

