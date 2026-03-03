const cityInput = document.getElementById("city");
const suggestionsBox = document.getElementById("suggestions");

// Press Enter support
cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();
    const card = document.getElementById("weatherCard");
    const errorBox = document.getElementById("errorBox");
    const loading = document.getElementById("loading");
    const iconBox = document.getElementById("weatherIcon");

    errorBox.style.display = "none";
    card.style.display = "none";
    loading.style.display = "none";

    if (!city) {
        showError("Please enter a valid city name.");
        return;
    }

    loading.style.display = "block";

    try {
        // 🔎 STEP 1: Validate city using Geocoding API
        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );

        const geoData = await geoResponse.json();

        // 🚫 If no results found
        if (!geoData || geoData.length === 0) {
            loading.style.display = "none";
            showError("City not found. Enter proper city name.");
            return;
        }

        // ✅ Valid city found
        const { lat, lon, name, country } = geoData[0];

        // 🌤 STEP 2: Fetch weather using lat & lon
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await weatherResponse.json();
        loading.style.display = "none";

        card.style.display = "block";

        document.getElementById("cityName").innerText = `${name}, ${country}`;
        document.getElementById("description").innerText =
            data.weather[0].description;
        document.getElementById("temp").innerText =
            Math.round(data.main.temp) + "°C";
        document.getElementById("humidity").innerText =
            data.main.humidity + "%";
        document.getElementById("wind").innerText =
            data.wind.speed + " m/s";

        // 🌟 Animated icon
        const condition = data.weather[0].main.toLowerCase();
        iconBox.className = "weather-icon";

        if (condition.includes("clear")) {
            iconBox.innerHTML = "☀";
            iconBox.classList.add("sun");
        } else if (condition.includes("cloud")) {
            iconBox.innerHTML = "☁";
            iconBox.classList.add("cloud");
        } else if (condition.includes("rain")) {
            iconBox.innerHTML = "🌧";
            iconBox.classList.add("rain");
        } else if (condition.includes("snow")) {
            iconBox.innerHTML = "❄";
            iconBox.classList.add("snow");
        } else {
            iconBox.innerHTML = "🌤";
        }

    } catch (error) {
        loading.style.display = "none";
        showError("Network error. Please try again.");
    }
}

function showError(message) {
    const errorBox = document.getElementById("errorBox");
    errorBox.innerText = message;
    errorBox.style.display = "block";
}