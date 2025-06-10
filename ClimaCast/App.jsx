import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
    // State variables
    const [location, setLocation] = useState(''); // Stores the user-entered location
    const [weatherData, setWeatherData] = useState(null); // Stores the fetched weather data
    const [loading, setLoading] = useState(false); // Indicates if data is being fetched
    const [error, setError] = useState(''); // Stores any error messages
    const [flagUrl, setFlagUrl] = useState(''); // Stores the URL for the location's flag

    // Your Visual Crossing API Key
    const API_KEY = '9LPLGS4LY8K84NSEHH9MVKM5V';

    // Function to fetch weather data from Visual Crossing API
    const fetchWeather = async () => {
        if (!location) {
            setError('Please enter a location.');
            setWeatherData(null);
            setFlagUrl(''); // Clear flag if no location
            return;
        }

        setLoading(true); // Set loading to true
        setError(''); // Clear any previous errors
        setWeatherData(null); // Clear previous weather data
        setFlagUrl(''); // Clear previous flag

        try {
            // Fetch weather data from Visual Crossing API
            const weatherResponse = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=us&include=days&key=${API_KEY}&contentType=json`
            );

            if (!weatherResponse.ok) {
                const errorData = await weatherResponse.json();
                const errorMessage = errorData.message || 'Could not fetch weather data. Please check the location.';
                throw new Error(errorMessage);
            }

            const weatherJson = await weatherResponse.json();
            setWeatherData(weatherJson);

            // --- Fetch Flag Data ---
            // Extract country name from resolvedAddress
            const resolvedAddress = weatherJson.resolvedAddress;
            let countryName = '';

            // Attempt to parse the country from the resolved address
            // This is a simple heuristic; more robust parsing might be needed for complex addresses
            if (resolvedAddress) {
                const parts = resolvedAddress.split(',');
                // Go through parts from end to find what looks like a country
                for (let i = parts.length - 1; i >= 0; i--) {
                    const trimmedPart = parts[i].trim();
                    if (trimmedPart.length > 1) { // Avoid single-letter parts
                        countryName = trimmedPart;
                        break;
                    }
                }
            }

            if (countryName) {
                try {
                    // Fetch country data from RestCountries API to get the flag URL
                    // Using v3.1 and filtering for only 'flags' to keep the response light
                    const flagResponse = await fetch(
                        `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=flags`
                    );

                    if (flagResponse.ok) {
                        const flagJson = await flagResponse.json();
                        // Check if the response contains flag data and if it's an array with at least one item
                        if (flagJson && Array.isArray(flagJson) && flagJson.length > 0 && flagJson[0].flags && flagJson[0].flags.png) {
                            setFlagUrl(flagJson[0].flags.png);
                        } else {
                            // If no flag found, but weather data is there, don't set a global error
                            console.warn('No flag found or unexpected structure for', countryName);
                        }
                    } else {
                        console.warn('Failed to fetch flag for', countryName, flagResponse.statusText);
                    }
                } catch (flagError) {
                    console.error("Error fetching flag:", flagError);
                    // Do not set global error, as weather data is already fetched.
                    // Just log the flag error.
                }
            }

        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message || 'Failed to fetch data. Please try again.');
            setWeatherData(null); // Clear weather data on main error
            setFlagUrl(''); // Clear flag on main error
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    // Handler for input field changes
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    // Helper function to get weather icon (using emojis for simplicity and mobile-like appearance)
    const getWeatherIcon = (iconName) => {
        switch (iconName) {
            case 'clear-day': return '☀️';
            case 'clear-night': return '🌙';
            case 'partly-cloudy-day': return '⛅';
            case 'partly-cloudy-night': return '☁️🌙';
            case 'cloudy': return '☁️';
            case 'rain': return '🌧️';
            case 'snow': return '❄️';
            case 'sleet': return '🌨️';
            case 'wind': return '💨';
            case 'fog': return '🌫️';
            default: return '❓'; // Unknown icon
        }
    };

    // Main component render
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 font-sans text-gray-800 bg-cover bg-center relative"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/907485/pexels-photo-907485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')` }} // New weather background image
        >
            {/* Background overlay for readability */}
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* Main card container, simulating a mobile phone screen */}
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-6 w-full max-w-sm mx-auto overflow-hidden
                            transform transition-all duration-300 ease-in-out
                            aspect-[9/16] md:aspect-auto md:max-w-md"> {/* Added aspect ratio for mobile phone shape */}

                {/* Top bar with stylized elements like in the example image */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <div className="w-10 h-1 rounded-full bg-gray-300"></div> {/* Placeholder for notch/speaker */}
                    <h1 className="text-3xl font-extrabold text-center text-gray-900 drop-shadow-sm">
                        ClimaCast
                    </h1>
                    <div className="w-10 h-1 rounded-full bg-gray-300"></div> {/* Another placeholder */}
                </div>

                <div className="flex flex-col gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Enter location (e.g., Stockholm)"
                        className="flex-grow p-3 border-none bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200 text-lg"
                        value={location}
                        onChange={handleLocationChange}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                fetchWeather();
                            }
                        }}
                    />
                    <button
                        onClick={fetchWeather}
                        className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition-all duration-200 active:scale-95 text-lg"
                        disabled={loading}
                    >
                        {loading ? 'Fetching...' : 'Get Weather ✨'}
                    </button>
                </div>

                {/* Loading state display */}
                {loading && (
                    <div className="text-center text-amber-700 text-lg font-medium animate-pulse mt-4">
                        <p>Summoning the weather spirits... 🌬️</p>
                    </div>
                )}

                {/* Error state display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center shadow-inner mt-4">
                        <p className="font-semibold">Oops!</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Weather data display */}
                {weatherData && !loading && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            {flagUrl && (
                                <img
                                    src={flagUrl}
                                    alt="Location Flag"
                                    className="w-10 h-auto rounded-md shadow-sm"
                                    onError={(e) => { e.target.style.display = 'none'; console.warn('Flag image failed to load.'); }}
                                />
                            )}
                            <h2 className="text-3xl font-bold text-center text-gray-800">
                                {weatherData.resolvedAddress || location}
                            </h2>
                        </div>
                        {weatherData.days && weatherData.days.length > 0 && (
                            <div className="bg-white p-4 rounded-xl shadow-lg text-center border border-gray-100">
                                <h3 className="text-xl font-semibold mb-2 text-gray-700">Today</h3>
                                <p className="text-6xl mb-2 flex items-center justify-center gap-2">
                                    {getWeatherIcon(weatherData.days[0].icon)} {Math.round(weatherData.days[0].temp)}°F
                                </p>
                                <p className="text-lg text-gray-600">
                                    {weatherData.days[0].conditions}
                                </p>
                                <div className="grid grid-cols-3 gap-2 mt-4 text-sm font-medium">
                                    <div className="p-2 bg-amber-50 rounded-lg flex flex-col items-center">
                                        <span className="text-2xl">💧</span>
                                        <span>{Math.round(weatherData.days[0].precipprob)}%</span>
                                        <span>Rain</span>
                                    </div>
                                    <div className="p-2 bg-amber-50 rounded-lg flex flex-col items-center">
                                        <span className="text-2xl">💨</span>
                                        <span>{Math.round(weatherData.days[0].windspeed)} mph</span>
                                        <span>Wind</span>
                                    </div>
                                    <div className="p-2 bg-amber-50 rounded-lg flex flex-col items-center">
                                        <span className="text-2xl">💧</span>
                                        <span>{Math.round(weatherData.days[0].humidity)}%</span>
                                        <span>Humidity</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Next 7 Days Forecast */}
                        {weatherData.days && weatherData.days.length > 1 && (
                            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">Next 7 Days</h3>
                                <div className="space-y-3">
                                    {weatherData.days.slice(1, 8).map((day, index) => ( // Display next 7 days (index 1 to 7)
                                        <div key={index} className="flex items-center justify-between bg-amber-50 p-3 rounded-xl shadow-sm">
                                            <p className="font-bold text-lg w-1/4">
                                                {new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </p>
                                            <p className="text-4xl w-1/4 text-center">
                                                {getWeatherIcon(day.icon)}
                                            </p>
                                            <p className="text-lg font-medium w-1/4 text-center">
                                                {Math.round(day.tempmax)}°F
                                            </p>
                                            <p className="text-sm text-gray-600 w-1/4 text-right">
                                                {day.conditions.split(',')[0]} {/* Show only first condition for brevity */}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Initial prompt or no data message */}
                {!weatherData && !loading && !error && (
                    <div className="text-center text-gray-500 mt-6">
                        <p className="text-lg">Enter a location above to reveal its magic weather!</p>
                        <p className="text-sm mt-2">Example: Stockholm, Sweden</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
