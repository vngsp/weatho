const today = document.querySelector('.today');
today.innerHTML = new Date().toLocaleDateString('eng', {weekday: 'long', day: 'numeric', month: 'long'});

const searchBar = document.querySelector('#search-bar');
searchBar.value = "Barretos"; 

const place = document.querySelector('.place');
place.textContent = searchBar.value;

searchBar.addEventListener('input', () => {
    place.textContent = searchBar.value;
})

async function fetchWeather() {
    const location = searchBar.value.trim();

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;

    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            return alert("Location not found.");
        }

        const { latitude, longitude, country } = geoData.results[0];

        place.textContent = `${location}, ${country}`;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,cloud_cover,visibility&daily=temperature_2m_max,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,wind_speed_10m_max,shortwave_radiation_sum`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        loadWeatherData(weatherData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

searchBar.addEventListener("dblclick", fetchWeather);

searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        fetchWeather();
    }
});

function fillItems(element, data) {
    element ? element.textContent = data : console.error('element not found');
}

async function loadWeatherData(weatherData) {
    //temperature
    weatherData ? fillItems(document.querySelector('.temperature'),`${weatherData.daily.temperature_2m_max[0]}°C`) : console.error('No data found');

    //previews
    weatherData ? fillItems(document.querySelector('[data-stat="humidity"]') , `${weatherData.hourly.relative_humidity_2m[0]} %`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="wind"]') , `${weatherData.daily.wind_speed_10m_max[0]} km/h`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="rain-chance"]') , `${weatherData.daily.precipitation_sum[0]} %`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="rain-qt"]') , `${weatherData.daily.precipitation_sum[0]} mm`) : console.error('No data found');

    //aside stats
    weatherData ? fillItems(document.querySelector('[data-stat="cloud-cover"]') , `${weatherData.hourly.cloud_cover[0]} %`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="visibility"]') , `${weatherData.hourly.visibility[0]} m`) : console.error('No data found');
    weatherData.hourly.visibility[0] <= 4000 
    ? document.querySelector('.adjective-state').textContent = 'Bad' 
    : weatherData.hourly.visibility[0] >= 10000 
    ? document.querySelector('.adjective-state').textContent = 'Good' 
    :document.querySelector('.adjective-state').textContent = 'Medium';

    //hour by hour
    generateCarouselItems(weatherData);

    //forecast
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date().getDay();
    const nextFourDays = Array.from({length: 4}, (_, i) => weekDays[(now + i) % 7]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdayElement = document.querySelectorAll('.week-day');
    const numberDay = document.querySelectorAll('.number-day');
    numberDay.forEach((element, index) => {
        element.textContent = `${months[new Date().getMonth()].slice(0,3)} ${new Date().getDate() + index}`;
    });
    weekdayElement.forEach((element, index) => {
        element.textContent = nextFourDays[index];
    });

    const dayTemperature = document.querySelectorAll('.day-temperature');
    dayTemperature.forEach((element, index) => {
        element.textContent = `${weatherData.daily.temperature_2m_max[index]}°C`;
    });

    //go out
    weatherData ? fillItems(document.querySelector('[data-out="uv"]') , `${weatherData.daily.uv_index_max[0]}`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="rad"]') , `${weatherData.daily.shortwave_radiation_sum[0]} MJ/m²`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="max"]') , `${weatherData.daily.apparent_temperature_max[0]}°C`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="min"]') , `${weatherData.daily.apparent_temperature_min[0]}°C`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="rain"]') , `${weatherData.daily.precipitation_sum[0]}%`) : console.error('No data found');
}

const hoursContainer = document.querySelector('.hours-container');
function generateCarouselItems(weatherData) {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const totalHours = 24;
    let currentHourIndex = new Date().getHours(); 

    function updateCarousel() {
        hoursContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const hourIndex = (currentHourIndex + i) % totalHours;
            const timeContainer = document.createElement('div');
            timeContainer.classList.add('time-container');
            const hour = hourIndex % 12 || 12;
            const period = hourIndex < 12 ? 'am' : 'pm';
            const temperature = weatherData.hourly.temperature_2m[hourIndex];
            const climateState = weatherData.hourly.cloud_cover[hourIndex] < 50 ? 'Cloudy' : 'Clear';
            timeContainer.innerHTML = `
            <h3 class="hours">${hour}${period}</h3>
            <img class="hour-logo" src="assets/interface/sun-light.png" alt="">
            <h5 class="hour-temperature">${temperature}°C</h5>
            <h4 class="climate-state">${climateState}</h4>`;
            hoursContainer.appendChild(timeContainer);
        }
    }

    prevBtn.addEventListener('click', () => {
        currentHourIndex = (currentHourIndex - 3 + totalHours) % totalHours;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentHourIndex = (currentHourIndex + 3) % totalHours;
        updateCarousel();
    });

    updateCarousel();
}

fetchWeather();