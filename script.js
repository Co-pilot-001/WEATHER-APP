const API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const STORAGE_KEYS = { unit: 'daybreak-unit', theme: 'daybreak-theme' };

const elements = {
  form: document.querySelector('#search-form'),
  search: document.querySelector('#city-search'),
  status: document.querySelector('#status-text'),
  hero: document.querySelector('#hero'),
  location: document.querySelector('#location-name'),
  country: document.querySelector('#location-country'),
  date: document.querySelector('#local-date'),
  temperature: document.querySelector('#temperature'),
  condition: document.querySelector('#condition'),
  feelsLike: document.querySelector('#feels-like'),
  currentIcon: document.querySelector('#current-icon'),
  humidity: document.querySelector('#humidity'),
  wind: document.querySelector('#wind'),
  pressure: document.querySelector('#pressure'),
  visibility: document.querySelector('#visibility'),
  forecast: document.querySelector('#forecast-list'),
  forecastLocation: document.querySelector('#forecast-location'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset'),
  sunriseLabel: document.querySelector('#sunrise-label'),
  sunsetLabel: document.querySelector('#sunset-label'),
  sunDate: document.querySelector('#sun-date'),
  sunOrb: document.querySelector('#sun-track-orb'),
  sunFill: document.querySelector('#sun-track-fill'),
  daylightNote: document.querySelector('#daylight-note'),
  updated: document.querySelector('#updated-at'),
  error: document.querySelector('#error-message'),
  themeToggle: document.querySelector('#theme-toggle'),
  unitButtons: document.querySelectorAll('[data-unit]'),
};

const weatherTypes = {
  0: { label: 'Clear sky', type: 'clear', icon: 'sun' },
  1: { label: 'Mainly clear', type: 'clear', icon: 'sun-cloud' },
  2: { label: 'Partly cloudy', type: 'clouds', icon: 'sun-cloud' },
  3: { label: 'Overcast', type: 'clouds', icon: 'cloud' },
  45: { label: 'Foggy', type: 'fog', icon: 'fog' },
  48: { label: 'Rime fog', type: 'fog', icon: 'fog' },
  51: { label: 'Light drizzle', type: 'rain', icon: 'rain' },
  53: { label: 'Drizzle', type: 'rain', icon: 'rain' },
  55: { label: 'Heavy drizzle', type: 'rain', icon: 'rain' },
  56: { label: 'Freezing drizzle', type: 'rain', icon: 'rain' },
  57: { label: 'Freezing drizzle', type: 'rain', icon: 'rain' },
  61: { label: 'Light rain', type: 'rain', icon: 'rain' },
  63: { label: 'Rain', type: 'rain', icon: 'rain' },
  65: { label: 'Heavy rain', type: 'rain', icon: 'rain' },
  66: { label: 'Freezing rain', type: 'rain', icon: 'rain' },
  67: { label: 'Heavy freezing rain', type: 'rain', icon: 'rain' },
  71: { label: 'Light snow', type: 'snow', icon: 'snow' },
  73: { label: 'Snow', type: 'snow', icon: 'snow' },
  75: { label: 'Heavy snow', type: 'snow', icon: 'snow' },
  77: { label: 'Snow grains', type: 'snow', icon: 'snow' },
  80: { label: 'Rain showers', type: 'rain', icon: 'rain' },
  81: { label: 'Rain showers', type: 'rain', icon: 'rain' },
  82: { label: 'Heavy showers', type: 'rain', icon: 'rain' },
  85: { label: 'Snow showers', type: 'snow', icon: 'snow' },
  86: { label: 'Heavy snow showers', type: 'snow', icon: 'snow' },
  95: { label: 'Thunderstorm', type: 'storm', icon: 'storm' },
  96: { label: 'Thunderstorm with hail', type: 'storm', icon: 'storm' },
  99: { label: 'Heavy thunderstorm', type: 'storm', icon: 'storm' },
};

const weatherGlyphs = {
  sun: '<svg viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="24" fill="#F6CA75"/><g stroke="#F6CA75" stroke-width="4" stroke-linecap="round"><path d="M60 8v13M60 99v13M8 60h13m78 0h13M23.2 23.2l9.2 9.2m55.2 55.2 9.2 9.2m0-73.6-9.2 9.2m-55.2 55.2-9.2 9.2"/></g></svg>',
  'sun-cloud': '<svg viewBox="0 0 120 120" fill="none"><circle cx="48" cy="43" r="21" fill="#F6CA75"/><g stroke="#F6CA75" stroke-width="4" stroke-linecap="round"><path d="M48 8v9M13 43h9M23.3 18.3l6.4 6.4m36.7-6.4L60 24.7"/></g><path d="M30 82a20 20 0 0 1 37-10 17 17 0 0 1 8-2 17 17 0 1 1 0 34H35a11 11 0 0 1-5-22Z" fill="#EDF2F1" stroke="#fff" stroke-width="2"/><path d="M38 95h35" stroke="#D0DAD6" stroke-width="3" stroke-linecap="round"/></svg>',
  cloud: '<svg viewBox="0 0 120 120" fill="none"><path d="M21 75a23 23 0 0 1 42-12 20 20 0 0 1 10-3 20 20 0 1 1 0 40H28a13 13 0 0 1-7-25Z" fill="#EDF2F1" stroke="#fff" stroke-width="2"/><path d="M42 88h32" stroke="#D0DAD6" stroke-width="3" stroke-linecap="round"/></svg>',
  rain: '<svg viewBox="0 0 120 120" fill="none"><path d="M18 58a22 22 0 0 1 42-11 19 19 0 0 1 9-2 19 19 0 1 1 0 38H25a13 13 0 0 1-7-25Z" fill="#EAF0EF" stroke="#fff" stroke-width="2"/><g stroke="#9BD0D2" stroke-width="4" stroke-linecap="round"><path d="m34 91-5 10m24-10-5 10m24-10-5 10"/></g></svg>',
  snow: '<svg viewBox="0 0 120 120" fill="none"><path d="M18 54a22 22 0 0 1 42-11 19 19 0 0 1 9-2 19 19 0 1 1 0 38H25a13 13 0 0 1-7-25Z" fill="#EDF2F1" stroke="#fff" stroke-width="2"/><g fill="#D7ECF2"><circle cx="34" cy="92" r="4"/><circle cx="54" cy="100" r="4"/><circle cx="74" cy="91" r="4"/></g><g stroke="#D7ECF2" stroke-width="2"><path d="M34 85v14m-6-11 12 7m0-7-12 7m26-2v14m-6-11 12 7m0-7-12 7m26-16v14m-6-11 12 7m0-7-12 7"/></g></svg>',
  storm: '<svg viewBox="0 0 120 120" fill="none"><path d="M18 51a22 22 0 0 1 42-11 19 19 0 0 1 9-2 19 19 0 1 1 0 38H25a13 13 0 0 1-7-25Z" fill="#E4E9EC" stroke="#fff" stroke-width="2"/><path d="m54 74-13 23h14l-4 17 22-28H59l7-12" fill="#F1C263" stroke="#F1C263" stroke-linejoin="round"/></svg>',
  fog: '<svg viewBox="0 0 120 120" fill="none"><path d="M22 55a19 19 0 0 1 36-10 17 17 0 0 1 8-2 17 17 0 1 1 0 34H28a11 11 0 0 1-6-22Z" fill="#E7EFEE" stroke="#fff" stroke-width="2"/><g stroke="#D4E2DF" stroke-width="3" stroke-linecap="round"><path d="M24 86h67M17 96h57M37 106h56"/></g></svg>',
};

let unit = localStorage.getItem(STORAGE_KEYS.unit) || 'celsius';
let currentWeather = null;
let latestRequest = 0;

function describeWeather(code) {
  return weatherTypes[code] || { label: 'Variable conditions', type: 'clouds', icon: 'cloud' };
}

function formatTemperature(celsius) {
  if (!Number.isFinite(celsius)) return '--';
  const value = unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;
  return String(Math.round(value));
}

function formatTime(isoDate) {
  const minutes = minutesAfterMidnight(isoDate);
  if (minutes === null) return '--:--';
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2000, 0, 1, Math.floor(minutes / 60), minutes % 60)));
}

function minutesAfterMidnight(isoDate) {
  const [, hour, minute] = isoDate.match(/T(\d{2}):(\d{2})/) || [];
  return hour === undefined ? null : Number(hour) * 60 + Number(minute);
}

function formatDate(date, options) {
  const calendarDate = date.slice(0, 10);
  return new Intl.DateTimeFormat('en', { ...options, timeZone: 'UTC' }).format(new Date(`${calendarDate}T12:00:00Z`));
}

function setLoading(isLoading, message = '') {
  document.body.classList.toggle('is-loading', isLoading);
  elements.status.textContent = message || (currentWeather ? 'Forecast updated just now' : 'Connecting to the forecast');
  elements.form.querySelector('button').disabled = isLoading;
}

function showError(message) {
  elements.error.textContent = message;
  elements.error.hidden = false;
  document.body.classList.add('has-error');
}

function clearError() {
  elements.error.hidden = true;
  elements.error.textContent = '';
  document.body.classList.remove('has-error');
}

async function fetchWeather(city) {
  const requestId = ++latestRequest;
  clearError();
  setLoading(true, `Finding the forecast for ${city}…`);

  try {
    const searchUrl = new URL(GEOCODING_API);
    searchUrl.search = new URLSearchParams({ name: city, count: '1', language: 'en', format: 'json' });
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) throw new Error('City search is temporarily unavailable. Try again in a moment.');
    const searchData = await searchResponse.json();
    if (requestId !== latestRequest) return;
    const place = searchData.results?.[0];
    if (!place) throw new Error(`We couldn't find “${city}”. Check the spelling and try another city.`);

    const weatherUrl = new URL(API);
    weatherUrl.search = new URLSearchParams({
      latitude: place.latitude,
      longitude: place.longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m,visibility',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      timezone: 'auto',
      forecast_days: '5',
    });
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error('The weather service couldn’t load this forecast. Please try again.');
    const weatherData = await weatherResponse.json();
    if (requestId !== latestRequest) return;
    if (weatherData.error) throw new Error(weatherData.reason || 'The weather service returned an error.');

    currentWeather = { place, weather: weatherData };
    renderWeather(place, weatherData);
    elements.search.value = place.name;
    setLoading(false, `Updated for ${place.name}`);
  } catch (error) {
    if (requestId !== latestRequest) return;
    showError(error instanceof TypeError
      ? 'Unable to reach the weather service. Check your connection and try again.'
      : error.message);
    setLoading(false, 'Forecast unavailable');
  }
}

function renderWeather(place, data) {
  const current = data.current;
  const daily = data.daily;
  const condition = describeWeather(current.weather_code);
  const windValue = current.wind_speed_10m * (unit === 'fahrenheit' ? 0.621371 : 1);
  const windUnit = unit === 'fahrenheit' ? ' mph' : ' km/h';

  elements.location.textContent = place.name;
  elements.country.textContent = [place.admin1, place.country].filter((value, index, values) => value && values.indexOf(value) === index).join(', ');
  elements.date.textContent = formatDate(current.time, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  elements.temperature.innerHTML = `${formatTemperature(current.temperature_2m)}<span>°</span>`;
  elements.feelsLike.textContent = `${formatTemperature(current.apparent_temperature)}°`;
  elements.condition.textContent = condition.label;
  elements.currentIcon.innerHTML = weatherGlyphs[condition.icon];
  elements.hero.dataset.condition = condition.type;
  elements.humidity.innerHTML = `${Math.round(current.relative_humidity_2m)}<small>%</small>`;
  elements.wind.innerHTML = `${Math.round(windValue)}<small>${windUnit}</small>`;
  elements.pressure.innerHTML = `${Math.round(current.pressure_msl)}<small> hPa</small>`;
  const visibilityKm = current.visibility / 1000;
  const visibilityValue = unit === 'fahrenheit' ? visibilityKm * 0.621371 : visibilityKm;
  const visibilityUnit = unit === 'fahrenheit' ? ' mi' : ' km';
  elements.visibility.innerHTML = `${visibilityValue.toFixed(1)}<small>${visibilityUnit}</small>`;
  elements.updated.textContent = `Local time ${formatTime(current.time)}`;
  elements.daylightNote.textContent = current.is_day ? 'A little weather, a little perspective.' : 'A quieter sky settles in tonight.';
  elements.forecastLocation.textContent = place.name;
  renderForecast(daily);
  renderSun(daily, current.time);
}

function renderForecast(daily) {
  elements.forecast.innerHTML = daily.time.map((day, index) => {
    const condition = describeWeather(daily.weather_code[index]);
    const label = index === 0 ? 'Today' : formatDate(`${day}T12:00:00`, { weekday: 'short' });
    return `<div class="forecast-row">
      <span class="forecast-day">${label}</span>
      <span class="forecast-icon" aria-hidden="true">${weatherGlyphs[condition.icon]}</span>
      <span class="forecast-condition">${condition.label}</span>
      <span class="forecast-temperatures"><span>${formatTemperature(daily.temperature_2m_max[index])}°</span><span class="forecast-low">${formatTemperature(daily.temperature_2m_min[index])}°</span></span>
    </div>`;
  }).join('');
}

function renderSun(daily, currentTime) {
  const sunrise = daily.sunrise[0];
  const sunset = daily.sunset[0];
  elements.sunrise.textContent = formatTime(sunrise);
  elements.sunset.textContent = formatTime(sunset);
  elements.sunriseLabel.textContent = formatTime(sunrise);
  elements.sunsetLabel.textContent = formatTime(sunset);
  elements.sunDate.textContent = formatDate(`${daily.time[0]}T12:00:00`, { weekday: 'long', month: 'short', day: 'numeric' });

  const sunriseMinutes = minutesAfterMidnight(sunrise);
  const sunsetMinutes = minutesAfterMidnight(sunset);
  const nowMinutes = minutesAfterMidnight(currentTime);
  const daylightHours = (sunsetMinutes - sunriseMinutes) / 60;
  const progress = sunriseMinutes === null || sunsetMinutes === null || nowMinutes === null
    ? 0.5
    : Math.min(1, Math.max(0, (nowMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes)));
  const daylightLabel = `${Math.floor(daylightHours)}h ${Math.round((daylightHours % 1) * 60)}m of daylight`;
  elements.sunDate.title = daylightLabel;
  elements.sunOrb.style.left = `${progress * 100}%`;
  elements.sunFill.style.width = `${progress * 100}%`;
}

function setUnit(nextUnit) {
  unit = nextUnit;
  localStorage.setItem(STORAGE_KEYS.unit, unit);
  elements.unitButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.unit === unit));
  });
  if (currentWeather) renderWeather(currentWeather.place, currentWeather.weather);
}

function setTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark', dark);
  localStorage.setItem(STORAGE_KEYS.theme, dark ? 'dark' : 'light');
  elements.themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  document.querySelector('meta[name="theme-color"]').content = dark ? '#151b19' : '#f4f5f1';
}

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = elements.search.value.trim();
  if (city) fetchWeather(city);
});

elements.unitButtons.forEach((button) => {
  button.addEventListener('click', () => setUnit(button.dataset.unit));
});

elements.themeToggle.addEventListener('click', () => {
  setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
});

setUnit(unit);
setTheme(localStorage.getItem(STORAGE_KEYS.theme) || 'light');
fetchWeather('London');
