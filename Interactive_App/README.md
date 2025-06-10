# HyperBudget - AI-Powered Phone Recommender

HyperBudget is a modern, responsive web application designed to help users find the perfect smartphone based on their budget and preferences. It features dynamic filtering, real-time price simulations, and a powerful AI recommendation engine powered by Google's Gemini API.

![image](https://github.com/user-attachments/assets/cddc8936-54f2-4828-8e5c-1bf0397ebc0b)

## ✨ Core Features

- **Dynamic Filtering:** Instantly filter the phone list by maximum budget, brand, minimum battery life, and minimum camera quality.
- **AI Recommendations:** Select personal preferences like "gaming," "photography," or "business" and get a custom recommendation from the Gemini AI.
- **Real-time Price Simulation:** Phone prices on the product cards fluctuate periodically to simulate real-world market changes.
- **Persistent User Themes:** Customize the look and feel with a light/dark mode and a selectable accent color. Your theme choice is automatically saved to your user profile.
- **Secure Authentication:** Utilizes Firebase Anonymous Authentication to create a unique user ID for persisting preferences without requiring a formal sign-up.
- **Responsive Design:** A seamless experience whether you're on a desktop, tablet, or mobile device.

## 🛠️ Tech Stack

This project is built with a modern, scalable technology stack:

- **Frontend:**
  - React: A declarative JavaScript library for building user interfaces.
  - Tailwind CSS: A utility-first CSS framework for rapid UI development.

- **Backend & Database:**
  - Firebase: Provides the backend infrastructure.
  - Firestore: A NoSQL cloud database to store user theme preferences.
  - Firebase Authentication: Used for creating anonymous user sessions.

- **Artificial Intelligence:**
  - Google Gemini API: Powers the intelligent phone recommendation feature.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- NPM or Yarn Package Manager
- A Google account for Firebase and Google AI setup.

### Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/hyperbudget.git
   cd hyperbudget
   ```

2. Install NPM packages:

   ```bash
   npm install
   ```

3. Set up Firebase:

   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - In your project, create a new Web App.
   - Copy the `firebaseConfig` object. You will need this for the next step.
   - In the Firebase console, go to Build > Authentication. Click "Get Started" and enable the Anonymous sign-in provider.
   - Go to Build > Firestore Database. Create a database in production mode and choose a location near you.

4. Set up Google Gemini API:

   - Go to the [Google AI Studio](https://aistudio.google.com/).
   - Click "Get API key" to create a new API key.
   - Copy this key securely.

5. Configure the Application:

   - Open the `App.js` file (or wherever your main application component is) and locate the following lines to insert your credentials.

   - For the AI Recommendation: Find the `getAIRecommendation` function and replace the empty string with your Gemini API Key.

     ```javascript
     // Inside getAIRecommendation() function, around line 360
     const apiKey = "YOUR_GEMINI_API_KEY_HERE";
     ```

   - For Firebase: The application is set up to receive the Firebase configuration from a global variable. In a development environment, you can add this directly to your `index.html` or configure your bundler (like Vite or Create React App) to make it available. For a quick start, you can modify the code to include your config object directly.

     ```javascript
     // Inside FirebaseProvider component's useEffect
     try {
       // Replace this logic
       // const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

       // With your actual config object
       const firebaseConfig = {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_AUTH_DOMAIN",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_STORAGE_BUCKET",
         messagingSenderId: "YOUR_SENDER_ID",
         appId: "YOUR_APP_ID"
       };

       const app = initializeApp(firebaseConfig);
       // ... rest of the function
     ```

6. Run the application:

   ```bash
   npm start
   ```

The application should now be running locally, typically at [http://localhost:3000](http://localhost:3000).
