var Currentcity = document.querySelector(".currentday-data")
var searchbtnel = document.querySelector(".search");
var apiKey = "cf54dde4a7df3e380b59cabd8dfa3ea7"
var baseURL = "https://api.openweathermap.org/data/2.5/forecast?";
var storedhistory = [];
function search(){
  var searchTerm = document.querySelector("#search-input").value
  
    var link = baseURL +"q=" + searchTerm + "&appid=" + apiKey + "&units=imperial";
    Currentcity.style.display ="block"

    fetch(link)
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(function (data){
      console.log(data)
        var searchName = data.city.name;
        var searchLat = data.city.coord.lat;
        var searchLon = data.city.coord.lon;
        var searchicon = data.list[0].weather[0].description;
        var weatherDate = data.list[0].dt_txt.split(" ")[0];
        var datesplit = weatherDate.split("-")
        var dateformat = datesplit[1] + "/" + datesplit[2] + "/" + datesplit[0];
        var searchTemp = data.list[0].main.temp + " °F";
        var searchWind = data.list[0].wind.speed + " MPH";
        var searchHumid = data.list[0].main.humidity + "%"
        var citydata = {
          name: searchName,
          date: dateformat,
          icon: searchicon,
          temp: searchTemp,
          wind: searchWind,
          humid: searchHumid
        }

        showcurrentweather(citydata)
        Storelink(searchName, link)
        Currentcity.style.display ="block"



    })
}
function getForcast(lat , lon){
  var link = baseURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey
  fetch(link)
  .then(function (response) {
    return response.json();
  })
  .then(function (data){
    console.log(data)



  })

}
function showcurrentweather(data){
  Currentcity.innerHTML= "";
  var name = data.name
  var date = data.date
  var icon = data.icon
  var temp = data.temp
  var wind = data.wind
  var humid = data.humid
  var nameEL = document.createElement("h3");
  var dateEL = document.createElement("p");
  var iconEL = document.createElement("p");
  var tempEL = document.createElement("p");
  var windEL = document.createElement("p");
  var humidEL = document.createElement("p");

  nameEL.textContent = "City: "+name;
  dateEL.textContent = "Date: " +date;
  iconEL.textContent = icon;
  tempEL.textContent = "Temperature: "+temp;
  windEL.textContent = "Wind Speed: "+wind;
  humidEL.textContent = "Humidity: " +humid;
  console.log(nameEL)
  Currentcity.append(nameEL, dateEL, iconEL, tempEL, windEL, humidEL);


}
function Storelink(data, data2){
  var storedhistory = JSON.parse(localStorage.getItem("storedhistory"))
  var history = {
    name: data,
    link: data2
  }
  console.log(history)
  storedhistory.push(history);
  localStorage.setItem("storedhistory", JSON.stringify(storedhistory));


}
searchbtnel.addEventListener("click", search)
