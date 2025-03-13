document.addEventListener('DOMContentLoaded', () => {
const today = document.querySelector('.today');
today.innerHTML = new Date().toLocaleDateString('eng', { weekday: 'long', day: 'numeric', month: 'long' });

const firstLetterUpperCase = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const searchBar = document.querySelector('#search-bar');
searchBar.value = "New York";

const place = document.querySelector('.place');

place.textContent = firstLetterUpperCase(searchBar.value);

searchBar.addEventListener('input', () => {
    place.textContent = firstLetterUpperCase(searchBar.value);
});

searchBar.addEventListener("click", fetchWeather);

searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        fetchWeather();
    }
});

// sup functions
function fillItems(element, data) {
    element ? element.textContent = data : console.error('element not found');
}

function changeUniqueColor(element, colorCode) {
    element.style.backgroundColor = colorCode;
}

function changeColors(elements, colorCodes) {
    if (!elements) { 
        console.error("No elements found");
        return;
    }
    const validElements = elements.filter(el => el !== null); 

    validElements.forEach((element, index) => {
        element.style.backgroundColor = colorCodes[index];
    });
}

function changeImg(element, imgPath) {
    if (element) {
        if (element.tagName === 'IMG') {
            element.src = imgPath;
        } else {
            console.error('Invalid tag name, this is not an img tag', element);
        }
    } else {
        console.error('Invalid element, the element is null', element);
    }
}
function changeBackgroundImage(className) {
    document.body.classList.remove('sunny', 'cloudy', 'rainy', 'heavy-rain', 'snow');
    document.body.classList.add(className);
}
function removeContainerBg(element) {
    element.style.backgroundImage = 'none';
}

// weather colors
const cloudyColors = {
    'stat-color': '#C48A94',
    'cloud-cover': '#6A5D78',
    'visibility': '#8C9E69',
    'hour-by-hour': '#90B9D1',
    'hour-time': '#C1D2DB',
    'forecast': '#5F96B0',
    'go-out': '#A39CB6'
};
const sunnyColors = {
    'stat-color': '#FF6B81',
    'cloud-cover': '#7A1FA2',
    'visibility': '#A6D155',
    'hour-by-hour': '#A3D9F7',
    'hour-time': '#E8F0F4',
    'forecast': '#76C9E6',
    'go-out': '#B8A8D2'
};
const heavyRainColors = {
    'stat-color': '#A75C6B',
    'cloud-cover': '#5B3F6B',
    'visibility': '#7A7F4A',
    'hour-by-hour': '#6B8A9F',
    'hour-time': '#A1BCC7',
    'forecast': '#4F7B97',
    'go-out': '#7F7B96'
};
const rainyColors = {
    'stat-color': '#D48C96',
    'cloud-cover': '#6A4E7B',
    'visibility': '#8A9F6E',
    'hour-by-hour': '#8BA9B9',
    'hour-time': '#B5C5D1',
    'forecast': '#6A8D9F',
    'go-out': '#9A8C9D'
};
const snowColors = {
    'stat-color': '#D1657F',
    'cloud-cover': '#693B98',
    'visibility': '#94C78E',
    'hour-by-hour': '#8AC4E8',
    'hour-time': '#DDE8F0',
    'forecast': '#60B3D4',
    'go-out': '#A497C6'
}
// elements
const stats = document.querySelector('.stats');
const cover = document.querySelector('.cover');
const visibility = document.querySelector('.visibility');
const hourContainer = document.querySelector('.hour-container');
const timeContainer = document.querySelector('.time-container');
const forecast = document.querySelector('.forecast');
const goOutContainer = document.querySelector('.go');
const principal = document.querySelector('.principal-stats');
const goTitle = document.querySelector('.go-title');
const forecastLogo = document.querySelectorAll('.forecast-logo');
// principal img
const sunImg = document.querySelector('.sun');
//principal container
const sunContainer = document.querySelector('.sun-container');
const body = document.querySelector('body');
const bodyAfter = getComputedStyle(body, '::after');
// paths
const cloudImgPath = 'assets/interface/cloud-day.png';
const sunImgPath = 'assets/interface/sol-sunny day.png';
const rainImgPath = 'assets/interface/rain.png';
const heavyRaingImgPath = 'assets/interface/heavy-rain.png';
const snowImg = 'assets/interface/snow-img.png';
// background images path
const raingImgBackground = 'assets/interface/lil-rain.png';
const sunImgBackground = 'assets/interface/light-interface.png';
const cloudImgBackground = 'assets/interface/cloud-img.png';
const heavyRainImgBackground = 'assets/interface/lil-drip.png'
const snowImgBackground = 'assets/interface/snow-bg.ong'
// sun container img
const sunContainerBackground = 'assets/interface/light-efect.png';

// principal functions
async function fetchWeather() {
    const location = searchBar.value.trim();

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;

    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            document.getElementById("error-message").textContent = "Location not found. Please try another place";
            return;
        } else {
            document.getElementById("error-message").textContent = '';
        }

        const { latitude, longitude, country } = geoData.results[0];

        place.textContent = `${firstLetterUpperCase(location)}, ${country}`;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,cloud_cover,visibility,wind_speed_10m,precipitation_probability&daily=temperature_2m_max,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,wind_speed_10m_max,shortwave_radiation_sum,precipitation_probability_max&forecast_days=16`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        if (weatherData.daily.precipitation_probability_max[0] >= 60) {
            changeColors([cover, visibility, hourContainer, goOutContainer],
             [heavyRainColors['cloud-cover'], heavyRainColors['visibility'], heavyRainColors['hour-by-hour'], heavyRainColors['go-out']]);
        }else if (weatherData.daily.temperature_2m_max[0] < 15) {
            changeColors([cover, visibility, hourContainer, goOutContainer],
             [snowColors['cloud-cover'], snowColors['visibility'], snowColors['hour-by-hour'], snowColors['go-out']]);
        } else if (weatherData.daily.precipitation_probability_max[0] >= 50 && weatherData.daily.precipitation_probability_max[0] < 60) {
            changeColors([cover, visibility, hourContainer, goOutContainer],
             [rainyColors['cloud-cover'], rainyColors['visibility'], rainyColors['hour-by-hour'], rainyColors['go-out']]);
        } else if (weatherData.hourly.cloud_cover[0] > 50) {
            changeColors([cover, visibility, hourContainer, goOutContainer],
             [cloudyColors['cloud-cover'], cloudyColors['visibility'], cloudyColors['hour-by-hour'], cloudyColors['go-out']]);
        } else if (weatherData.hourly.cloud_cover[0] < 50) {
            changeColors([cover, visibility, hourContainer, goOutContainer],
             [sunnyColors['cloud-cover'], sunnyColors['visibility'], sunnyColors['hour-by-hour'], sunnyColors['go-out']]);
        }
        loadWeatherData(weatherData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function loadWeatherData(weatherData) {
    //temperature
    weatherData ? fillItems(document.querySelector('.temperature'), `${weatherData.daily.temperature_2m_max[0]}°C`) : console.error('No data found');

    //previews
    weatherData ? fillItems(document.querySelector('[data-stat="humidity"]'), `${weatherData.hourly.relative_humidity_2m[0]} %`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="wind"]'), `${weatherData.daily.wind_speed_10m_max[0]} km/h`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="rain-chance"]'), `${weatherData.daily.precipitation_probability_max[0]} %`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="rain-qt"]'), `${weatherData.daily.precipitation_probability_max[0]} mm`) : console.error('No data found');

    //aside stats
    weatherData ? fillItems(document.querySelector('[data-stat="cloud-cover"]'), `${weatherData.hourly.cloud_cover[0]} %`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-stat="visibility"]'), `${weatherData.hourly.visibility[0]} m`) : console.error('No data found');
    weatherData.hourly.visibility[0] <= 4000
        ? document.querySelector('.adjective-state').textContent = 'Bad'
        : weatherData.hourly.visibility[0] >= 10000
            ? document.querySelector('.adjective-state').textContent = 'Good'
            : document.querySelector('.adjective-state').textContent = 'Medium';

    //hour by hour
    generateCarouselItems(weatherData);

    //forecast
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date().getDay();
    const nextFourDays = Array.from({ length: 4 }, (_, i) => weekDays[(now + i) % 7]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdayElement = document.querySelectorAll('.week-day');
    const numberDay = document.querySelectorAll('.number-day');
    numberDay.forEach((element, index) => {
        element.textContent = `${months[new Date().getMonth()].slice(0, 3)} ${new Date().getDate() + index}`;
    });
    weekdayElement.forEach((element, index) => {
        element.textContent = nextFourDays[index];
    });

    const dayTemperature = document.querySelectorAll('.day-temperature');
    dayTemperature.forEach((element, index) => {
        element.textContent = `${weatherData.daily.temperature_2m_max[index]}°C`;
    });

    forecastLogo.forEach((element, index) => {
        if (weatherData.daily.temperature_2m_max[index] > 18) {
            element.src = 'assets/interface/sun-light.png';
        } else if (weatherData.daily.temperature_2m_max[index] < 18 && weatherData.daily.temperature_2m_max[index] > 13) {
            element.src = 'assets/interface/alt-cloud.png';
        } else {
            element.src = 'assets/interface/so-cold.png'
        }
    })
    //go out
    weatherData ? fillItems(document.querySelector('[data-out="uv"]'), `${weatherData.daily.uv_index_max[0]}`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="rad"]'), `${weatherData.daily.shortwave_radiation_sum[0]} MJ/m²`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="max"]'), `${weatherData.daily.apparent_temperature_max[0]}°C`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="min"]'), `${weatherData.daily.apparent_temperature_min[0]}°C`) : console.error('No data found');
    weatherData ? fillItems(document.querySelector('[data-out="rain"]'), `${weatherData.daily.precipitation_sum[0]}%`) : console.error('No data found');

    //interative lay
    const stats = document.querySelector('.stats');
    if (stats && stats.parentNode) {
        const newStats = stats.cloneNode(true);
        stats.parentNode.replaceChild(newStats, stats);

        let myChart = null;
        if (weatherData.daily.precipitation_probability_max[0] >= 60) {
            changeColors([newStats,forecast],
             [heavyRainColors['stat-color'], heavyRainColors['forecast'] ]);
            changeImg(sunImg, heavyRaingImgPath);
            changeBackgroundImage('heavy-rain');
            removeContainerBg(sunContainer);
            goTitle.textContent = 'Stay Home';
        }else if (weatherData.daily.temperature_2m_max[0] < 15) {
            changeColors([newStats, forecast],
             [snowColors['stat-color'], snowColors['forecast']]);
            changeImg(sunImg, snowImg);
            changeBackgroundImage('snow');
            removeContainerBg(sunContainer);
            goTitle.textContent = 'Stay Home';
        } 
        else if (weatherData.daily.precipitation_probability_max[0] >= 50 && weatherData.daily.precipitation_probability_max[0] < 60) {
            changeColors([newStats, forecast],
             [rainyColors['stat-color'], rainyColors['forecast']]);
            changeImg(sunImg, rainImgPath);
            changeBackgroundImage('rainy');
            removeContainerBg(sunContainer);
            goTitle.textContent = 'Stay Home';
        } else if (weatherData.hourly.cloud_cover[0] > 50) {
            changeColors([newStats, forecast],
             [cloudyColors['stat-color'], cloudyColors['forecast']]);
             changeUniqueColor(goOutContainer, )
            changeImg(sunImg, cloudImgPath);
            changeBackgroundImage('cloudy');
            removeContainerBg(sunContainer);
            weatherData.daily.temperature_2m_max[0] >= 18 ? goTitle.textContent = 'Go out' : goTitle.textContent = 'Stay Home';
        } else if (weatherData.hourly.cloud_cover[0] < 50) {
            changeColors([newStats, forecast],
             [sunnyColors['stat-color'], sunnyColors['forecast']]);
             changeUniqueColor(goOutContainer, )
            changeImg(sunImg, sunImgPath);
            changeBackgroundImage('sunny');
            sunContainer.style.backgroundImage = `url(${sunContainerBackground})`;
            goTitle.textContent = 'Go out';
        }


        newStats.addEventListener('click', () => {
            principal.classList.toggle('desactive');
            newStats.classList.toggle('desactive');
            cover.classList.toggle('desactive');
            visibility.classList.toggle('desactive');

            if (newStats.classList.contains('desactive')) {
                let lineGraphDiv = newStats.querySelector('.line-graph');
                if (!lineGraphDiv) {
                    lineGraphDiv = document.createElement('div');
                    lineGraphDiv.classList.add('line-graph');
                    const canvas = document.createElement('canvas');
                    lineGraphDiv.appendChild(canvas);
                    newStats.appendChild(lineGraphDiv);

                    const ctx = canvas.getContext('2d');

                    myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: weatherData.hourly.time
                                .filter(time => new Date(time).getDate() === new Date().getDate())
                                .map(time => new Date(time).toLocaleTimeString()),
                            datasets: [
                                {
                                    label: 'Relative Humidity (%) - Hourly',
                                    data: weatherData.hourly.relative_humidity_2m,
                                    borderColor: 'rgba(77, 214, 108, 1)',
                                    borderWidth: 1,
                                    fill: false
                                },
                                {
                                    label: 'Wind (km/h) - Hourly',
                                    data: weatherData.hourly.wind_speed_10m,
                                    borderColor: 'rgba(78, 202, 255, 1)',
                                    borderWidth: 1,
                                    fill: false
                                },
                                {
                                    label: 'Precipitation Probability (%) - Daily',
                                    data: weatherData.hourly.precipitation_probability,
                                    borderColor: 'rgba(255, 204, 82, 1)',
                                    borderWidth: 1,
                                    fill: false
                                },
                                {
                                    label: 'Precipitation (mm) - Hourly',
                                    data: weatherData.hourly.precipitation_probability,
                                    borderColor: 'rgba(50, 50, 50, 1)',
                                    borderWidth: 1,
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                x: {
                                    ticks: {
                                        display: false
                                    },
                                    grid: {
                                        display: false
                                    }
                                },
                                y: {
                                    ticks: {
                                        display: false
                                    },
                                    grid: {
                                        display: false
                                    },
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }
                    });
                }
            } else {
                const lineGraphDiv = newStats.querySelector('.line-graph');
                if (lineGraphDiv) {
                    newStats.removeChild(lineGraphDiv);

                    stats.classList.remove('desactive');
                    cover.classList.remove('desactive');
                    visibility.classList.remove('desactive');
                    principal.classList.remove('desactive');
                }
            }
        });

        newStats.click();
    } else {
        console.error('stats element or its parentNode is not found');
    }
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
            if (weatherData.daily.precipitation_probability_max[0] >= 60) {
                changeUniqueColor(timeContainer, heavyRainColors['hour-time']);
            } else if (weatherData.daily.precipitation_probability_max[0] >= 50 && weatherData.daily.precipitation_probability_max[0] < 60) {
                changeUniqueColor(timeContainer, rainyColors['hour-time']);
            } else if (weatherData.hourly.cloud_cover[0] > 50) {
                changeUniqueColor(timeContainer, cloudyColors['hour-time']);
            } else if (weatherData.hourly.cloud_cover[0] < 50) {
                changeUniqueColor(timeContainer, sunnyColors['hour-time']);
            }
            
            const hour = hourIndex % 12 || 12;
            const period = hourIndex < 12 ? 'am' : 'pm';
            const temperature = weatherData.hourly.temperature_2m[hourIndex];
            const climateState = weatherData.hourly.cloud_cover[hourIndex] < 45 ? 'Cloudy' : 'Clear';
            if(temperature > 18) {
                timeContainer.innerHTML = `
                <h3 class="hours">${hour}${period}</h3>
                <img class="hour-logo" src="assets/interface/sun-light.png" alt="">
                <h5 class="hour-temperature">${temperature}°C</h5>
                <h4 class="climate-state">${climateState}</h4>`;
                hoursContainer.appendChild(timeContainer);
            } else if(temperature < 18 && temperature > 13) {
                timeContainer.innerHTML = `
                <h3 class="hours">${hour}${period}</h3>
                <img class="hour-logo" src="assets/interface/alt-cloud.png" alt="">
                <h5 class="hour-temperature">${temperature}°C</h5>
                <h4 class="climate-state">${climateState}</h4>`;
                hoursContainer.appendChild(timeContainer);
            } else {
                timeContainer.innerHTML = `
                <h3 class="hours">${hour}${period}</h3>
                <img class="hour-logo" src="assets/interface/so-cold.png" alt="">
                <h5 class="hour-temperature">${temperature}°C</h5>
                <h4 class="climate-state">${climateState}</h4>`;
                hoursContainer.appendChild(timeContainer);
            }
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
})
