// 1. API configuration
const API_KEY = "8d3f4f3093217db0442af9ef26523560";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// 2. Select HTML elements
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

const statusMessage = document.getElementById("status-message");
const weatherSection = document.getElementById("weather-section");

const cityName = document.getElementById("city-name");
const weatherDescription = document.getElementById("weather-description");
const weatherIcon = document.getElementById("weather-icon");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");

// 3. Fetch weather data
async function getWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        statusMessage.textContent = "Loading weather...";
        weatherSection.hidden = true;
        searchButton.disabled = true;

        const response = await fetch(url);
        const data = await response.json();

        // Handle API errors
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            }

            if (response.status === 401) {
                throw new Error("API key error. Please check your API key.");
            }

            throw new Error(data.message || "Unable to fetch weather.");
        }

        // 4. Display weather information
        cityName.textContent = `${data.name}, ${data.sys.country}`;

        weatherDescription.textContent =
            data.weather?.[0]?.description ?? "Weather unavailable";

        temperature.textContent = `${Math.round(data.main.temp)}°C`;

        feelsLike.textContent =
            `Feels like ${Math.round(data.main.feels_like)}°C`;

        humidity.textContent = `${data.main.humidity}%`;

        windSpeed.textContent = `${data.wind.speed} m/s`;

        pressure.textContent = `${data.main.pressure} hPa`;

        // Display the weather icon
        if (data.weather?.[0]?.icon) {
           weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt = data.weather[0].description;
    weatherIcon.hidden = false;

    weatherIcon.onerror = function () {
        weatherIcon.hidden = true;
    };
        } else {
            weatherIcon.hidden = true;
        }

        // Show weather section
        weatherSection.hidden = false;
        statusMessage.textContent = "Weather updated successfully!";

    } catch (error) {
        statusMessage.textContent = error.message;
    } finally {
        searchButton.disabled = false;
    }
}

// 5. Handle the search form
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        statusMessage.textContent = "Please enter a city name.";
        weatherSection.hidden = true;
        return;
    }

    getWeather(city);
});