async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert('give a city name');
    return;
  }

  document.getElementById('loading').style.display = 'block';
  document.getElementById('weatherCard').style.display = 'none';

  try {
  
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      alert('city not found!');
      document.getElementById('loading').style.display = 'none';
      return;
    }

    const lat = geoData.results[0].latitude;
    const lon = geoData.results[0].longitude;
    const cityName = geoData.results[0].name;

    
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
    const weatherData = await weatherRes.json();

    const temp = weatherData.current.temperature_2m;
    const humidity = weatherData.current.relative_humidity_2m;
    const wind = weatherData.current.wind_speed_10m;
    const code = weatherData.current.weather_code;

    
    document.getElementById('cityName').innerText = cityName;
    document.getElementById('temp').innerText = temp + '°C';
    document.getElementById('condition').innerText = getCondition(code);
    document.getElementById('humidity').innerText = 'Humidity: ' + humidity + '%';
    document.getElementById('wind').innerText = 'Wind: ' + wind + ' km/h';

    document.getElementById('loading').style.display = 'none';
    document.getElementById('weatherCard').style.display = 'block';
  } catch (error) {
    alert("something's wrong");
    document.getElementById('loading').style.display = 'none';
  }
}

function getCondition(code) {
  if (code === 0) return '☀️ Clear Sky';
  if (code === 1 || code === 2) return '⛅ Partly Cloudy';
  if (code === 3) return '☁️ Cloudy';
  if (code >= 51 && code <= 67) return '🌧️ Rainy';
  if (code >= 71 && code <= 77) return '❄️ Snowy';
  if (code >= 95) return '⛈️ Thunderstorm';
  return '🌤️ Clear';
}