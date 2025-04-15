const cities = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Bhopal"];

async function fetchWeather(city) {
  try {
    const apiKey = 'b5711101c19e19425e2309bea7b71742';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    if (!response.ok) throw new Error("Failed to fetch weather data");
    const data = await response.json();
    return {
      city,
      temp: data.main.temp,
      desc: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  } catch (error) {
    return { city, error: true };
  }
}

function createWeatherCard(weather) {
  const div = document.createElement("div");
  div.className = "city-weather";
  if (weather.error) {
    div.innerHTML = `<div class="city-name">${weather.city}</div><div class="error">Unable to fetch weather data</div>`;
  } else {
    div.innerHTML = `
      <div class="city-name">${weather.city}</div>
      <div><strong>Temperature:</strong> ${weather.temp}°C</div>
      <div><strong>Condition:</strong> ${weather.desc}</div>
      <div><strong>Humidity:</strong> ${weather.humidity}%</div>
      <div><strong>Wind Speed:</strong> ${weather.windSpeed} km/h</div>
    `;
  }
  return div;
}

async function displayWeather() {
  const container = document.getElementById("weatherContainer");
  container.innerHTML = '<div class="loading">Loading weather data...</div>';
  const weatherData = await Promise.all(cities.map(fetchWeather));
  container.innerHTML = "";
  weatherData.forEach((weather) => {
    const card = createWeatherCard(weather);
    container.appendChild(card);
  });
}

async function searchWeather() {
  const input = document.getElementById("searchInput").value.trim();
  if (!input) return;
  const container = document.getElementById("weatherContainer");
  container.innerHTML = '<div class="loading">Loading weather data...</div>';
  const weather = await fetchWeather(input);
  container.innerHTML = "";
  const card = createWeatherCard(weather);
  container.appendChild(card);
  document.getElementById("searchInput").value = ""; // Clear input after search
}

document.getElementById("searchButton").addEventListener("click", searchWeather);
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchWeather();
});

// Display weather for predefined cities on page load
displayWeather();