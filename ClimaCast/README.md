# ClimaCast Weather App

ClimaCast is a modern, mobile-inspired weather application that allows users to get current weather conditions and a 7-day forecast for any location worldwide. It also dynamically displays the flag of the country associated with the entered locations, Fast and Easy Access.
## ✨ Features
![image](https://github.com/user-attachments/assets/f354cc6e-5f39-434e-b04b-0cbcafdefe17)

* **Location-Based Weather:** Get real-time weather and forecast data by entering a city, country, or even a ZIP/postal code.
* **7-Day Forecast:** View upcoming weather conditions for the next week.
* **Dynamic Country Flag:** Automatically displays the flag of the country for the searched location.
* **Mobile-Inspired Design:** Clean, intuitive, and responsive user interface with a warm color palette, designed to resemble a mobile phone screen.
* **Loading & Error Handling:** Provides user feedback during data fetching and gracefully handles errors.

## 💻 Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

## 🌐 APIs Used

ClimaCast integrates with two external APIs to provide its functionality:

1.  **Visual Crossing Weather API**
    * **Purpose:** Fetches comprehensive weather data, including current conditions, daily forecasts, temperature, humidity, wind speed, precipitation probability, and more.
    * **API Key:** This API requires an API key. In the provided code, `const API_KEY = 'YOUR_VISUAL_CROSSING_API_KEY';` is where your Visual Crossing API key is placed. **Remember to keep your API key secure in a real-world production environment (e.g., using environment variables).**
    * **Website:** [https://www.visualcrossing.com/](https://www.visualcrossing.com/)

2.  **REST Countries API**
    * **Purpose:** Retrieves country information, specifically the flag image URL, based on the country name identified from the weather data's resolved address.
    * **API Key:** For the specific version used (`v3.1`) and its current usage in this project (fetching flag URLs by name), this API **does NOT require an API key or account creation**.
    * **Website:** [https://restcountries.com/](https://restcountries.com/)

## 🚀 Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the Repository (if applicable):** If you're managing this as a Git repository, clone it. Otherwise, create a new React project.
    ```bash
    # If starting a new React project (e.g., with Vite or Create React App)
    # npx create-react-app climacast-app
    # cd climacast-app
    ```
2.  **Install Dependencies:** Navigate to the project directory and install the necessary packages.
    ```bash
    npm install # or yarn install
    ```
3.  **Configure Tailwind CSS:** Ensure Tailwind CSS is correctly set up in your React project. If you started a new project, follow the official Tailwind CSS installation guide for React.
4.  **Replace `App.js`:** Copy the provided React code (from the immersive artifact) and replace the content of `src/App.js` (or `src/App.jsx`) in your project.
5.  **Add Your API Key:**
    * Open `src/App.js`.
    * Locate the line `const API_KEY = 'YOUR_VISUAL_CROSSING_API_KEY';`
    * Replace `'YOUR_VISUAL_CROSSING_API_KEY'` with your actual Visual Crossing API key.

## 🏃‍♀️ How to Run

After setting up, you can run the development server:

```bash
npm start # or yarn start (for Create React App)
# or npm run dev (for Vite)
