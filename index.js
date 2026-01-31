// Using Open-Meteo (No API key required)
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

const WMO_CODES = {
    0: { desc: "Clear sky", icon: "01d" },
    1: { desc: "Mainly clear", icon: "02d" },
    2: { desc: "Partly cloudy", icon: "02d" },
    3: { desc: "Overcast", icon: "03d" },
    45: { desc: "Fog", icon: "50d" },
    48: { desc: "Depositing rime fog", icon: "50d" },
    51: { desc: "Light drizzle", icon: "09d" },
    53: { desc: "Moderate drizzle", icon: "09d" },
    55: { desc: "Dense drizzle", icon: "09d" },
    61: { desc: "Slight rain", icon: "10d" },
    63: { desc: "Moderate rain", icon: "10d" },
    65: { desc: "Heavy rain", icon: "10d" },
    71: { desc: "Slight snow fall", icon: "13d" },
    73: { desc: "Moderate snow fall", icon: "13d" },
    75: { desc: "Heavy snow fall", icon: "13d" },
    95: { desc: "Thunderstorm", icon: "11d" }
};

function getWeatherInfo(code) {
    return WMO_CODES[code] || { desc: "Unknown", icon: "01d" };
}

let cityInput = document.getElementById("city-input");
let searchForm = document.getElementById("search-form");

async function fetchWeather(city) {
    try {
        // 1. Geocoding
        const geoResponse = await fetch(`${GEO_API_URL}?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found. Please try another name.");
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Fetch Weather & Forecast
        const weatherUrl = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,cloud_cover&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const current = weatherData.current;
        const daily = weatherData.daily;
        const weatherInfo = getWeatherInfo(current.weather_code);

        // Store temperature and forecast data for unit conversion
        currentTempValue = Math.round(current.temperature_2m);
        window.forecastData = {
            daily: daily,
            weatherData: weatherData
        };

        // Update Current Weather
        document.getElementById("location-city").textContent = name;
        document.getElementById("location-country").textContent = country;
        document.getElementById("current-temp").innerHTML = `${currentTempValue}°<span>${currentUnit}</span>`;
        document.getElementById("current-condition").textContent = weatherInfo.desc;

        const hiTemp = currentUnit === "F" ? convertTemp(Math.round(daily.temperature_2m_max[0]), "F") : Math.round(daily.temperature_2m_max[0]);
        const lowTemp = currentUnit === "F" ? convertTemp(Math.round(daily.temperature_2m_min[0]), "F") : Math.round(daily.temperature_2m_min[0]);
        document.getElementById("current-hi-low").textContent = `H: ${hiTemp}° L: ${lowTemp}°`;

        // Update Icon
        const iconContainer = document.getElementById("current-icon-container");
        iconContainer.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png" alt="${weatherInfo.desc}" width="120" height="120">`;

        // Update Metrics
        document.getElementById("visibility-val").textContent = "N/A"; // Open-Meteo doesn't provide this easily in free tier
        document.getElementById("wind-speed-val").textContent = `${current.wind_speed_10m} km/h`;
        document.getElementById("humidity-val").textContent = `${current.relative_humidity_2m}%`;
        document.getElementById("pressure-val").textContent = `${current.surface_pressure} hPa`;

        const feelsLike = currentUnit === "F" ? convertTemp(Math.round(current.apparent_temperature), "F") : Math.round(current.apparent_temperature);
        document.getElementById("feels-like-val").textContent = `${feelsLike}°${currentUnit}`;
        document.getElementById("cloudiness-val").textContent = `${current.cloud_cover}%`;

        // Update Sun Times
        const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById("sunrise-val").textContent = formatTime(daily.sunrise[0]);
        document.getElementById("sunset-val").textContent = formatTime(daily.sunset[0]);

        // Date & Time
        const now = new Date();
        document.getElementById("current-date").textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
        document.getElementById("current-time").textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 5-Day Forecast
        renderForecast(weatherData, daily, currentUnit);

    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Something went wrong. Check the console for details.");
    }
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = "";
    }
});

// Initial Load
fetchWeather("New York");

// Temperature Unit Toggle
const btnCelsius = document.getElementById("btn-celsius");
const btnFahrenheit = document.getElementById("btn-fahrenheit");
let currentUnit = "C";
let currentTempValue = null;

function convertTemp(temp, toUnit) {
    if (toUnit === "F") {
        return Math.round((temp * 9 / 5) + 32);
    } else {
        return Math.round((temp - 32) * 5 / 9);
    }
}

function renderForecast(weatherData, daily, unit) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // Clear existing

    for (let i = 0; i < 5; i++) {
        const date = new Date(weatherData.daily.time[i]);
        const dayName = i === 0 ? "Today" : date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        const dayWeather = getWeatherInfo(daily.weather_code[i]);

        const highTemp = unit === "F" ? convertTemp(Math.round(daily.temperature_2m_max[i]), "F") : Math.round(daily.temperature_2m_max[i]);
        const lowTemp = unit === "F" ? convertTemp(Math.round(daily.temperature_2m_min[i]), "F") : Math.round(daily.temperature_2m_min[i]);

        const forecastItem = `
            <div class="forecast-item">
                <span class="day">${dayName}</span>
                <div class="condition">
                    <img src="https://openweathermap.org/img/wn/${dayWeather.icon}.png" alt="${dayWeather.desc}" width="30">
                    <span class="desc">${dayWeather.desc}</span>
                </div>
                <div class="temps">
                    <span class="high">${highTemp}°</span>
                    <span class="low">${lowTemp}°</span>
                </div>
            </div>
        `;
        forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
    }
}

function updateTemperatureDisplay(unit) {
    const tempElement = document.getElementById("current-temp");
    const feelsLikeElement = document.getElementById("feels-like-val");
    const hiLowElement = document.getElementById("current-hi-low");

    if (currentTempValue !== null) {
        const displayTemp = unit === "F" ? convertTemp(currentTempValue, "F") : currentTempValue;
        tempElement.innerHTML = `${displayTemp}°<span>${unit}</span>`;

        // Update feels like if it exists
        const feelsLikeText = feelsLikeElement.textContent;
        if (feelsLikeText && feelsLikeText !== "N/A") {
            const currentFeelsLike = parseInt(feelsLikeText);
            if (!isNaN(currentFeelsLike)) {
                const newFeelsLike = unit === "F" ? convertTemp(currentFeelsLike, "F") : currentFeelsLike;
                feelsLikeElement.textContent = `${newFeelsLike}°${unit}`;
            }
        }

        // Update hi/low and forecast if data exists
        if (window.forecastData) {
            const daily = window.forecastData.daily;
            const hiTemp = unit === "F" ? convertTemp(Math.round(daily.temperature_2m_max[0]), "F") : Math.round(daily.temperature_2m_max[0]);
            const lowTemp = unit === "F" ? convertTemp(Math.round(daily.temperature_2m_min[0]), "F") : Math.round(daily.temperature_2m_min[0]);
            hiLowElement.textContent = `H: ${hiTemp}° L: ${lowTemp}°`;

            // Re-render forecast with new unit
            renderForecast(window.forecastData.weatherData, daily, unit);
        }
    }
}

btnCelsius.addEventListener("click", () => {
    if (currentUnit !== "C") {
        currentUnit = "C";
        btnCelsius.classList.add("active");
        btnFahrenheit.classList.remove("active");
        updateTemperatureDisplay("C");
    }
});

btnFahrenheit.addEventListener("click", () => {
    if (currentUnit !== "F") {
        currentUnit = "F";
        btnFahrenheit.classList.add("active");
        btnCelsius.classList.remove("active");
        updateTemperatureDisplay("F");
    }
});

// About Us Modal
const aboutBtn = document.getElementById("about-btn");
const aboutModal = document.getElementById("about-modal");
const closeModal = document.querySelector(".close-modal");

aboutBtn.addEventListener("click", () => {
    aboutModal.classList.add("active");
});

closeModal.addEventListener("click", () => {
    aboutModal.classList.remove("active");
});

// Close modal when clicking outside
aboutModal.addEventListener("click", (e) => {
    if (e.target === aboutModal) {
        aboutModal.classList.remove("active");
    }
});
