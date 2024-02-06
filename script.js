const apiKey = '55fa1005f8bd48638e391551240602';

// Function to fetch weather data for a specific city
function fetchWeather(city) {
    return fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
        .then(response => response.json());
}

function fetchWeatherForecast(city) {
    return fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6`)
        .then(response => response.json());
}

function updateWeatherInfo(city) {
    const citySelectHTML = document.getElementById('citySelect').outerHTML; // Store dropdown HTML

    Promise.all([fetchWeather(city) , fetchWeatherForecast(city)])
        .then(([data , forecastData]) => {
            const leftSideContent = document.querySelector('.left-side');
            const rightSideContent = document.querySelector('.right-side');
            const currentDate = new Date(data.current.last_updated);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);

            leftSideContent.innerHTML = `
            <div class="weather-info">
                <div class="city">${city}</div>
                <div class="date">${formattedDate}</div>
                <h1 class="temperature">${data.current.temp_c}°C</h1>
                <div class="details">
                    <p>Humidity: ${data.current.humidity}%</p>
                    <p>Wind Speed: ${data.current.wind_kph} km/h</p>
                </div>
            </div>
            `;

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set hours to 0 for accurate comparison
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1); // Get date for tomorrow

            const forecastCards = forecastData.forecast.forecastday.filter(day => new Date(day.date) > tomorrow).map(day => `
                <div class="forecast-card">
                    <h3>${(new Date(day.date)).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                    <p>Temp: ${day.day.avgtemp_c}°C</p>
                    <p>Humidity: ${day.day.avghumidity}%</p>
                    <p>Wind Speed: ${day.day.maxwind_kph} km/h</p>
                </div>
            `).join('');
            rightSideContent.innerHTML = forecastCards;

        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Event listener for dropdown selection
document.getElementById('citySelect').addEventListener('change', function() {
    const selectedCity = this.value;
    updateWeatherInfo(selectedCity);
});

// Initialize with default city
updateWeatherInfo('Karachi'); // Default city
