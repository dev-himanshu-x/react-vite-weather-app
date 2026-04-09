# SkyPulse

SkyPulse is a neo-brutalist weather dashboard for Indian cities, built with React and Vite.
It provides current conditions, forecast intelligence, air quality, alerting, and planning tools in a fast and responsive UI.

## Highlights

- Current weather with detailed metrics
- 7-day forecast and 24-hour timeline
- Air quality insights (AQI, PM2.5, PM10, gases)
- Smart advisories from live weather patterns
- Outdoor activity planner for best upcoming time slots
- Favorites and recent searches with persistence
- Geolocation support with fallback behavior
- Custom alert rules and browser notifications
- Unit switching between Celsius and Fahrenheit

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Open-Meteo APIs (forecast, geocoding, reverse geocoding, air quality)

## Project Structure

```text
src/
	App.jsx
	main.jsx
	index.css
	assets/
		weather-logo.svg
	components/
		ActivityPlanner.jsx
		AirQualityPanel.jsx
		AlertCenter.jsx
		CurrentWeather.jsx
		ErrorMessage.jsx
		Forecast.jsx
		HourlyForecast.jsx
		SearchBar.jsx
		TrendChart.jsx
		WeatherInsights.jsx
	utils/
		weather.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

App runs by default at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Data Sources

- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Reverse Geocoding API: `https://geocoding-api.open-meteo.com/v1/reverse`
- Forecast API: `https://api.open-meteo.com/v1/forecast`
- Air Quality API: `https://air-quality-api.open-meteo.com/v1/air-quality`

## Browser Features Used

- Geolocation API for "Use My Location"
- Notifications API for active weather alerts
- Clipboard API for copyable weather reports
- Local Storage for favorites, recents, and alert rules

## Build and Deploy

```bash
npm run build
```

The production output is generated in `dist/` and can be deployed to any static hosting provider.

## Troubleshooting

- If location fails, allow location permission in browser settings.
- If notifications do not appear, enable notification permission for the site.
- If city results fail, verify internet access and try another Indian city spelling.

## License

This project is for educational and portfolio use.
