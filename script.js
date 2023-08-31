//created queryslector variables and also the base for the key and the URL
var Currentcity = document.querySelector(".currentday-data")
var searchbtnel = document.querySelector(".search");
var forecast = document.querySelector(".futureday-data");
var h4 = document.querySelector("h4")
var historyEL = document.querySelector("#history-container")
var apiKey = "cf54dde4a7df3e380b59cabd8dfa3ea7"
var baseURL = "https://api.openweathermap.org/data/2.5/forecast?";

//this starts the search and gets the info so that the other functions can run
function search(){
  //this sets up the link that the fetch will use if a history button was clicked it would be from this.id
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
  //this fetches the data from the link
    fetch(link)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
        showcurrentweather(data)
        getForecast(data)
        storelink(data, link)
        displayHistory()
        //this is hidden at the start and to reset the search bar it empties it
        Currentcity.style.display ="block"
        searchEL.value = "";
    })
}
//this gets the first data set to display
function showcurrentweather(data){
  //empties out the info there first then it gets the name/date/icon/temp/wind/humidity creates elements
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
  //sets up the content displayed
  nameEL.textContent = "City: "+ name;
  dateEL.textContent = "Date: " + date;
  iconEL.src = iconImg;
  tempEL.textContent = "Temperature: "+ temp;
  windEL.textContent = "Wind Speed: "+ wind;
  humidEL.textContent = "Humidity: " + humid;
  //appends to the area that it needs to be in
  Currentcity.append(nameEL, dateEL, iconEL, tempEL, windEL, humidEL);
}
//this sets up the other 5 days
function getForecast(data){
  //empties it out first and displated
  forecast.innerHTML= "";
  h4.style.display = "block"
  //similar setup from showcurrentweather but instead of list[0] its i and is also in a card first
  for(var i = 1; i < data.list.length; i+=9){
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
    //sets up content
    dateEL.textContent = date;
    iconEL.src = iconImg;
    tempEL.textContent = "Temperature: "+temp;
    windEL.textContent = "Wind Speed: "+wind;
    humidEL.textContent = "Humidity: " +humid;
    //appends to card then appends the card to forecast
    card.append(dateEL, iconEL, tempEL, windEL, humidEL);
    forecast.append(card);
  }


}
//this gets everything into the local repository and makes sure there is no repeats
 function storelink(data, link){
  //gets the name and gets the repository
  var name = data.city.name
  var storedhistory = JSON.parse(localStorage.getItem("storedhistory")) || []
  //creates the object
  var history = {
    name: name,
    link: link
  }
  //checks if the array is empty first
  if(storedhistory.length == 0)
    {
      //if empty pushes and saves
      storedhistory.push(history);
      savesHistory(storedhistory);     
    }
    //looks for repeats
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
          //if no repeats it pushes and saves
          storedhistory.push(history);
          savesHistory(storedhistory); 
        }
      }
    }
}
//this saves local storage
function savesHistory(storedhistory){
  localStorage.setItem("storedhistory", JSON.stringify(storedhistory));
}
//this creates the history portion
function displayHistory(){
  //first empties out content
  historyEL.innerHTML = "";
  //gets local storage and checks the size if its 5 or bigger it removes the first one and puts in the new 5th one
  var storedhistory = JSON.parse(localStorage.getItem("storedhistory"))
  if(storedhistory.length > 5){
    storedhistory.shift() 
    savesHistory(storedhistory)
  }
  //for each one it it makes a button and has the button display the city name and makes the link the id of the button
  for(var i = 0; i < storedhistory.length; i++){
    var historybutton = document.createElement("button")
    historybutton.setAttribute("class", "btn btn-info my-2 btn-sml historybtn")
    historybutton.setAttribute("id", storedhistory[i].link)
    historybutton.textContent = storedhistory[i].name;
    //adds the buttons to the history then gets them an eventlistener for on click to do the search
    historyEL.append(historybutton);
    historybutton.addEventListener("click",search)
  }

}
displayHistory()
searchbtnel.addEventListener("click", search)