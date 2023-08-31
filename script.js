var Currentcity = document.querySelector(".currentday-data")
var searchbtnel = document.querySelector(".search");
var forecast = document.querySelector(".futureday-data");
var h4 = document.querySelector("h4")
var historyEL = document.querySelector("#history-container")
var apiKey = "cf54dde4a7df3e380b59cabd8dfa3ea7"
var baseURL = "https://api.openweathermap.org/data/2.5/forecast?";
function search(){
  var searchEL = document.querySelector("#search-input")
  var searchTerm = searchEL.value
  if(searchTerm != ""){
    var link = baseURL +"q=" + searchTerm + "&appid=" + apiKey + "&units=imperial";
  }
  else if(this.id != ""){
    var link = this.id
  }
  else{
    return;

  }
    Currentcity.style.display ="block"

    fetch(link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
        showcurrentweather(data)
        getForecast(data)
        Storelink(data, link)
        displayHistory()
        Currentcity.style.display ="block"
        searchEL.value = "";
    })
}
function getForecast(data){
  forecast.innerHTML= "";
  h4.style.display = "block"
  for(var i = 1; i < data.list.length; i+=8){
    var date = dayjs.unix(data.list[i].dt).format('MM/DD/YYYY')
    var icon = data.list[i].weather[0].icon;
    var iconImg = `https://openweathermap.org/img/wn/${icon}@2x.png`
    var temp = data.list[i].main.temp + " °F";
    var wind = data.list[i].wind.speed + " MPH";
    var humid = data.list[i].main.humidity + "%"
    var card = document.createElement("div");
    card.setAttribute("class", "card m-2 p-3 w-25 bg-info bg-gradient")
    var dateEL = document.createElement("p");
    var iconEL = document.createElement("img");
    var tempEL = document.createElement("p");
    var windEL = document.createElement("p");
    var humidEL = document.createElement("p");
  
    dateEL.textContent = date;
    iconEL.src = iconImg;
    tempEL.textContent = "Temperature: "+temp;
    windEL.textContent = "Wind Speed: "+wind;
    humidEL.textContent = "Humidity: " +humid;
    card.append(dateEL, iconEL, tempEL, windEL, humidEL);
    forecast.append(card);
  

    

  }


}
function showcurrentweather(data){
  Currentcity.innerHTML= "";
  var name = data.city.name;
  var date = dayjs.unix(data.list[0].dt).format('MM/DD/YYYY')
  var icon = data.list[0].weather[0].icon;
  var iconImg = `https://openweathermap.org/img/wn/${icon}@2x.png`
  var temp = data.list[0].main.temp + " °F";
  var wind = data.list[0].wind.speed + " MPH";
  var humid = data.list[0].main.humidity + "%"
  var nameEL = document.createElement("h3");
  var dateEL = document.createElement("p");
  var iconEL = document.createElement("img");
  var tempEL = document.createElement("p");
  var windEL = document.createElement("p");
  var humidEL = document.createElement("p");

  nameEL.textContent = "City: "+ name;
  dateEL.textContent = "Date: " + date;
  iconEL.src = iconImg;
  tempEL.textContent = "Temperature: "+ temp;
  windEL.textContent = "Wind Speed: "+ wind;
  humidEL.textContent = "Humidity: " + humid;
  Currentcity.append(nameEL, dateEL, iconEL, tempEL, windEL, humidEL);


}
 function Storelink(data, link){
  var name = data.city.name
  var storedhistory = JSON.parse(localStorage.getItem("storedhistory")) || []
  var history = {
    name: name,
    link: link
  }
  if(storedhistory.length == 0)
    {
      storedhistory.push(history);
      savesHistory(storedhistory);     
    }
    else
    {
      for( var i = 0; i < storedhistory.length; i++)
     {
        if(storedhistory[i].name == history.name)
        { 
         return;
        }
        else if( i == storedhistory.length-1 && storedhistory[i].name != history.name)
        {
          storedhistory.push(history);
          savesHistory(storedhistory); 
        }
      }
    }
}
function savesHistory(storedhistory){
  localStorage.setItem("storedhistory", JSON.stringify(storedhistory));
}
function displayHistory(){
  historyEL.innerHTML = "";
  var storedhistory = JSON.parse(localStorage.getItem("storedhistory"))
  if(storedhistory.length > 5){
    storedhistory.shift() 
    savesHistory(storedhistory)
  }
  for(var i = 0; i < storedhistory.length; i++){
    var historybutton = document.createElement("button")
    historybutton.setAttribute("class", "btn btn-info my-2 btn-sml historybtn")
    historybutton.setAttribute("id", storedhistory[i].link)
    historybutton.textContent = storedhistory[i].name;
    historyEL.append(historybutton);
    historybutton.addEventListener("click",search)
  }

}
displayHistory()
searchbtnel.addEventListener("click", search)
