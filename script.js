const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainner = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially veriables needed

let currentTab = userTab;
const API_KEY = "afbda9993aa0fd2ad05a43ebde80a7fc";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainner.classList.remove("active");
            searchForm.classList.add("active");
            error.classList.remove("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            error.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
});


searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

//check if coordinates are already present in session stoarge
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainner.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grant acceses invisible
    grantAccessContainner.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");


    //api call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    } catch (error) {
        loadingScreen.classList.remove("active");
        alert(error);
    }


}

function renderWeatherInfo(weatherInfo) {
    // Fetch all the elements needed
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const weatherDec = document.querySelector('[data-weatherDec]');
    const weatherIcon = document.querySelector('[data-weathericon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-clouds]');
  
    // Show in UI with null/undefined checks
    cityName.innerText = weatherInfo?.name || "";
    countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
    weatherDec.innerText = weatherInfo?.weather?.[0]?.description || "";
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${(weatherInfo?.main?.temp - 273.15).toFixed(2)} °C` || "";
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s` || "";
    humidity.innerText = `${weatherInfo?.main?.humidity}%` || "";
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%` || "";
  }
  

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("no geolocation support available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector('[data-grant-access]');
grantAccessBtn.addEventListener("click", getlocation);

const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName == "") {
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
});
const error = document.querySelector('.error');
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainner.classList.remove('active');
     error.classList.remove('active');
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();
        if(data.cod != 404){
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        error.classList.remove("active");
        renderWeatherInfo(data);
        }else{
            loadingScreen.classList.remove('active');
            error.classList.add('active');
        }
    } catch (error) {
        alert(error);
    }
}
