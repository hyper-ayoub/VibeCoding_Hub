import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// --- Firebase Context ---
const FirebaseContext = createContext(null);

const FirebaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    try {
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Sign in and set up auth state listener
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // If no user, try to sign in with custom token or anonymously
          try {
            if (typeof __initial_auth_token !== 'undefined') {
              await signInWithCustomToken(firebaseAuth, __initial_auth_token);
            } else {
              await signInAnonymously(firebaseAuth);
            }
            // User will be set by the onAuthStateChanged listener after successful sign-in
          } catch (error) {
            console.error("Firebase authentication failed:", error);
            // Fallback to a random ID if auth fails completely
            setUserId(crypto.randomUUID());
          }
        }
        setIsAuthReady(true); // Auth state is ready after initial check
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      // Fallback to random ID if Firebase initialization fails
      setUserId(crypto.randomUUID());
      setIsAuthReady(true);
    }
  }, []);

  const value = useMemo(() => ({ db, auth, userId, isAuthReady }), [db, auth, userId, isAuthReady]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebase = () => useContext(FirebaseContext);

// --- Theme Context ---
const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const { db, userId, isAuthReady } = useFirebase();
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const [accentColor, setAccentColor] = useState('#6366f1'); // Default accent color (indigo-500)

  // Load theme preferences from Firestore
  useEffect(() => {
    if (db && userId && isAuthReady) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/preferences/theme`);

      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDarkMode(data.darkMode || false);
          setAccentColor(data.accentColor || '#6366f1');
        } else {
          // Set default theme if no preferences exist
          setDarkMode(false);
          setAccentColor('#6366f1');
        }
      }, (error) => {
        console.error("Error fetching theme preferences:", error);
      });

      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady]);

  // Functions to toggle dark mode and change accent color (kept for programmatic use)
  const toggleDarkMode = async () => {
    if (db && userId) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/preferences/theme`);
      try {
        await setDoc(userDocRef, { darkMode: !darkMode, accentColor }, { merge: true });
      } catch (e) {
        console.error("Error updating dark mode:", e);
      }
    } else {
      setDarkMode(!darkMode);
    }
  };

  const changeAccentColor = async (color) => {
    if (db && userId) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/preferences/theme`);
      try {
        await setDoc(userDocRef, { accentColor: color, darkMode }, { merge: true });
      } catch (e) {
        console.error("Error updating accent color:", e);
      }
    } else {
      setAccentColor(color);
    }
  };

  const themeClasses = darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900';

  const value = useMemo(() => ({ darkMode, toggleDarkMode, accentColor, changeAccentColor, themeClasses }), [darkMode, accentColor, themeClasses]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// --- Mock Phone Data ---
const mockPhones = [
  {
    id: '1',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 1199,
    performanceScore: 9.8,
    batteryLifeHours: 28,
    cameraQualityMP: 200,
    image: 'https://placehold.co/150x150/E0E7FF/3730A3?text=S24U',
    description: 'Top-tier Android flagship with an incredible camera and powerful performance, ideal for photography and business.',
    tags: ['photography', 'business', 'high-performance'],
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: 1299,
    performanceScore: 9.9,
    batteryLifeHours: 30,
    cameraQualityMP: 48,
    image: 'https://placehold.co/150x150/FEE2E2/991B1B?text=iP15PM',
    description: 'The ultimate iPhone experience with exceptional performance and battery life, great for gaming and general use.',
    tags: ['gaming', 'high-performance', 'photography'],
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: 899,
    performanceScore: 9.0,
    batteryLifeHours: 24,
    cameraQualityMP: 50,
    image: 'https://placehold.co/150x150/DBEAFE/1E40AF?text=P8P',
    description: 'Excellent camera and AI features, offering a pure Android experience. Good for everyday use and photography.',
    tags: ['photography', 'everyday'],
  },
  {
    id: '4',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 799,
    performanceScore: 9.5,
    batteryLifeHours: 26,
    cameraQualityMP: 50,
    image: 'https://placehold.co/150x150/D1FAE5/065F46?text=OP12',
    description: 'Fast charging and smooth performance, a great all-rounder for gaming and daily tasks.',
    tags: ['gaming', 'everyday', 'high-performance'],
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    price: 999,
    performanceScore: 9.7,
    batteryLifeHours: 27,
    cameraQualityMP: 50,
    image: 'https://placehold.co/150x150/FFFBEB/92400E?text=X14U',
    description: 'Powerful camera system and high-end specs, appealing to photography enthusiasts and power users.',
    tags: ['photography', 'high-performance'],
  },
  {
    id: '6',
    name: 'Samsung Galaxy A55',
    brand: 'Samsung',
    price: 499,
    performanceScore: 7.5,
    batteryLifeHours: 20,
    cameraQualityMP: 50,
    image: 'https://placehold.co/150x150/E0E7FF/3730A3?text=A55',
    description: 'Mid-range option with a good display and reliable battery life, suitable for general use.',
    tags: ['everyday'],
  },
  {
    id: '7',
    name: 'iPhone SE (2022)',
    brand: 'Apple',
    price: 429,
    performanceScore: 8.0,
    batteryLifeHours: 15,
    cameraQualityMP: 12,
    image: 'https://placehold.co/150x150/FEE2E2/991B1B?text=iPSE',
    description: 'Compact and powerful, an affordable entry into the Apple ecosystem.',
    tags: ['everyday'],
  },
  {
    id: '8',
    name: 'Redmi Note 13 Pro+',
    brand: 'Xiaomi',
    price: 399,
    performanceScore: 7.0,
    batteryLifeHours: 22,
    cameraQualityMP: 200,
    image: 'https://placehold.co/150x150/FFFBEB/92400E?text=RN13P',
    description: 'Budget-friendly phone with a high-resolution camera, great for casual photography.',
    tags: ['photography', 'budget'],
  },
  {
    id: '9',
    name: 'ASUS ROG Phone 8 Pro',
    brand: 'ASUS',
    price: 1099,
    performanceScore: 9.9,
    batteryLifeHours: 29,
    cameraQualityMP: 50,
    image: 'https://placehold.co/150x150/F0F9FF/0C4A6E?text=ROG8P',
    description: 'Designed specifically for gaming, with top-tier performance and cooling.',
    tags: ['gaming', 'high-performance'],
  },
  {
    id: '10',
    name: 'Sony Xperia 1 V',
    brand: 'Sony',
    price: 1099,
    performanceScore: 9.2,
    batteryLifeHours: 25,
    cameraQualityMP: 48,
    image: 'https://placehold.co/150x150/F0FDF4/14532D?text=Xperia1V',
    description: 'A multimedia powerhouse with a focus on camera and display quality, good for content creators.',
    tags: ['photography', 'business'],
  },
];

// --- Components ---

const Header = () => {
  const { darkMode, accentColor } = useTheme(); // Removed toggleDarkMode and changeAccentColor as they are not used in UI
  const { userId } = useFirebase();

  return (
    <header className="p-4 shadow-md transition-colors duration-300" style={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff' }}>
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-3xl font-extrabold mb-4 sm:mb-0" style={{ color: accentColor }}>HyperBudget</h1> {/* Changed app name here */}
        <div className="flex items-center space-x-4">
          {userId && (
            <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: accentColor, color: 'white' }}>
              User ID: {userId.substring(0, 8)}...
            </span>
          )}
          {/* Removed the entire Themes button and dropdown */}
        </div>
      </div>
    </header>
  );
};

const FilterSection = ({ filters, setFilters, onBudgetChange, budget, aiRecommendations, aiLoading, aiError, aiSuggestedPhone }) => {
  const { accentColor, darkMode } = useTheme();
  const [localBudget, setLocalBudget] = useState(budget); // Local state for budget input

  useEffect(() => {
    setLocalBudget(budget); // Sync local budget with prop
  }, [budget]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetInputChange = (e) => {
    setLocalBudget(e.target.value);
  };

  const handleBudgetSubmit = () => {
    onBudgetChange(Number(localBudget));
  };

  const handlePreferenceChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      preferences: checked
        ? [...prev.preferences, value]
        : prev.preferences.filter(pref => pref !== value)
    }));
  };

  // New AI recommendation options
  const aiPreferenceOptions = [
    'gaming',
    'photography',
    'business',
    'everyday use',
    'long battery life',
    'best camera',
    'budget-friendly'
  ];

  return (
    <aside className={`p-6 rounded-lg shadow-lg space-y-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>Filters & Preferences</h2>

      {/* Budget Input (serves as max price) */}
      <div>
        <label htmlFor="budget" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Max Budget ($)</label>
        <div className="flex">
          <input
            type="number"
            id="budget"
            name="budget"
            value={localBudget}
            onChange={handleBudgetInputChange}
            placeholder="e.g., 800"
            className={`flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            min="0"
          />
          <button
            onClick={handleBudgetSubmit}
            className={`px-4 py-3 rounded-r-lg font-semibold transition-all duration-300 hover:opacity-90`}
            style={{ backgroundColor: accentColor, color: 'white' }}
          >
            Set
          </button>
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <label htmlFor="brand" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Brand</label>
        <select
          id="brand"
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
        >
          <option value="">All Brands</option>
          <option value="Samsung">Samsung</option>
          <option value="Apple">Apple</option>
          <option value="Google">Google</option>
          <option value="OnePlus">OnePlus</option>
          <option value="Xiaomi">Xiaomi</option>
          <option value="ASUS">ASUS</option>
          <option value="Sony">Sony</option>
        </select>
      </div>

      {/* Removed Performance Filter */}
      {/* <div>
        <label htmlFor="performance" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Performance (Score)</label>
        <input
          type="range"
          id="performance"
          name="performance"
          min="0"
          max="10"
          step="0.1"
          value={filters.performance}
          onChange={handleFilterChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${filters.performance * 10}%, ${darkMode ? '#4b5563' : '#d1d5db'} ${filters.performance * 10}%, ${darkMode ? '#4b5563' : '#d1d5db'} 100%)` }}
        />
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{filters.performance} / 10</span>
      </div> */}

      {/* Battery Life Filter */}
      <div>
        <label htmlFor="battery" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Battery Life (Hours)</label>
        <input
          type="range"
          id="battery"
          name="battery"
          min="0"
          max="30"
          step="1"
          value={filters.battery}
          onChange={handleFilterChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${filters.battery / 0.3}%, ${darkMode ? '#4b5563' : '#d1d5db'} ${filters.battery / 0.3}%, ${darkMode ? '#4b5563' : '#d1d5db'} 100%)` }}
        />
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{filters.battery}+ hours</span>
      </div>

      {/* Camera Quality Filter */}
      <div>
        <label htmlFor="camera" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Camera Quality (MP)</label>
        <input
          type="range"
          id="camera"
          name="camera"
          min="0"
          max="200"
          step="10"
          value={filters.camera}
          onChange={handleFilterChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${filters.camera / 2}%, ${darkMode ? '#4b5563' : '#d1d5db'} ${filters.camera / 2}%, ${darkMode ? '#4b5563' : '#d1d5db'} 100%)` }}
        />
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{filters.camera}+ MP</span>
      </div>

      {/* AI Preferences */}
      <div>
        <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>AI Recommendations (Preferences)</h3>
        <div className="flex flex-wrap gap-3">
          {aiPreferenceOptions.map(pref => (
            <label key={pref} className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-full transition-all duration-300 ${filters.preferences.includes(pref) ? 'text-white' : (darkMode ? 'text-gray-300 border border-gray-600' : 'text-gray-700 border border-gray-300')}`}
              style={{ backgroundColor: filters.preferences.includes(pref) ? accentColor : (darkMode ? '#374151' : '#f3f4f6') }}
            >
              <input
                type="checkbox"
                value={pref}
                checked={filters.preferences.includes(pref)}
                onChange={handlePreferenceChange}
                className="form-checkbox h-4 w-4 hidden"
              />
              <span className="ml-2 capitalize">{pref}</span>
            </label>
          ))}
        </div>
        <button
          onClick={aiRecommendations}
          disabled={aiLoading}
          className={`mt-4 w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:opacity-90 ${aiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: accentColor, color: 'white' }}
        >
          {aiLoading ? 'Thinking...' : 'Get AI Recommendation'}
        </button>
        {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
      </div>
      {aiSuggestedPhone && (
        <div className={`mt-6 p-4 rounded-lg shadow-inner ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-blue-800'}`}>AI's Top Pick:</h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-blue-700'}`}>{aiSuggestedPhone.name} ({aiSuggestedPhone.brand}) - ${aiSuggestedPhone.price}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>{aiSuggestedPhone.description}</p>
        </div>
      )}
    </aside>
  );
};

const PhoneCard = ({ phone, accentColor, darkMode }) => {
  // Simulate real-time price update
  const [displayPrice, setDisplayPrice] = useState(phone.price);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const priceVariation = (Math.random() - 0.5) * 20; // +/- $10
      setDisplayPrice(Math.max(1, Math.round(phone.price + priceVariation)));
      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [phone.price]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`relative rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <img src={phone.image} alt={phone.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2" style={{ color: accentColor }}>{phone.name}</h3>
        <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Brand: {phone.brand}</p>
        {/* Removed Performance Score display */}
        {/* <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Performance: {phone.performanceScore}/10</p> */}
        <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Battery: {phone.batteryLifeHours} hrs</p>
        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Camera: {phone.cameraQualityMP} MP</p>
        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{phone.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-extrabold" style={{ color: accentColor }}>${displayPrice}</span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Updated: {timeAgo(lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
};

const MessageBox = ({ message, type, onClose }) => {
  const { accentColor, darkMode } = useTheme();
  let bgColor = '';
  let textColor = '';

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'error':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl p-6 max-w-sm w-full ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <div className={`p-3 rounded-md ${bgColor} ${textColor} mb-4`}>
          <p className="font-semibold">{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 hover:opacity-90`}
          style={{ backgroundColor: accentColor, color: 'white' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};


// --- Core App Content Component ---
// This component will be wrapped by the providers
function AppContent() {
  const { themeClasses, accentColor, darkMode } = useTheme();
  const [budget, setBudget] = useState(1000);
  const [filters, setFilters] = useState({
    brand: '',
    // Removed performance from filters state
    battery: 0,
    camera: 0,
    preferences: [], // For AI recommendations
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [messageBox, setMessageBox] = useState(null); // { message: '', type: '' }
  const [aiSuggestedPhone, setAiSuggestedPhone] = useState(null); // New state for AI suggested phone

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
  };

  const getAIRecommendation = async () => {
    setAiLoading(true);
    setAiError(null);
    setMessageBox(null);
    setAiSuggestedPhone(null); // Clear previous AI suggestion

    const preferenceText = filters.preferences.length > 0
      ? `user preferences for ${filters.preferences.join(', ')}`
      : 'general use';

    // Get all phones, regardless of current brand filter, to allow AI to suggest different brands
    const allPhonesForAI = mockPhones;
    const phoneNames = allPhonesForAI.map(p => p.name).join(', ');

    // Adjusted prompt to encourage different brands if a brand filter is active,
    // and to be more direct about the recommendation.
    let prompt = `Given a budget of $${budget} and ${preferenceText}, suggest a suitable phone from the following list. Focus on the best fit for the preferences.`;
    if (filters.brand) {
      prompt += ` The user is currently filtering by ${filters.brand}. If a better option from another brand exists within the budget and preferences, suggest it. Otherwise, suggest the best ${filters.brand} phone.`;
    }
    prompt += ` Only provide the name of the phone. If no phone perfectly matches, suggest the closest one. Phone list: ${phoneNames}.`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const aiSuggestedPhoneName = result.candidates[0].content.parts[0].text.trim();
        const suggestedPhone = mockPhones.find(p => aiSuggestedPhoneName.includes(p.name));

        if (suggestedPhone) {
          setAiSuggestedPhone(suggestedPhone); // Store the suggested phone
          setMessageBox({ message: `AI recommends: ${suggestedPhone.name}!`, type: 'success' });
          // Do NOT automatically change filters here. Display the suggestion separately.
        } else {
          setMessageBox({ message: `AI suggested "${aiSuggestedPhoneName}", but it's not in our list. Please try adjusting your preferences.`, type: 'info' });
        }
      } else {
        setMessageBox({ message: "AI couldn't generate a recommendation. Please try again.", type: 'error' });
      }
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
      setAiError("Failed to get AI recommendation. Please try again.");
      setMessageBox({ message: "Failed to get AI recommendation. Please check your network.", type: 'error' });
    } finally {
      setAiLoading(false);
    }
  };

  const filteredPhones = useMemo(() => {
    return mockPhones.filter(phone => {
      const matchesBudget = phone.price <= budget; // Budget now acts as max price
      const matchesBrand = filters.brand === '' || phone.brand === filters.brand;
      // Removed matchesPerformance from filtering logic
      const matchesBattery = phone.batteryLifeHours >= filters.battery;
      const matchesCamera = filters.camera === 0 || phone.cameraQualityMP >= filters.camera; // Ensure camera filter works correctly

      return matchesBudget && matchesBrand && matchesBattery && matchesCamera;
    });
  }, [budget, filters]);

  return (
    <div className={`min-h-screen font-sans antialiased ${themeClasses}`}>
      <Header />
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterSection
            filters={filters}
            setFilters={setFilters}
            onBudgetChange={handleBudgetChange}
            budget={budget}
            aiRecommendations={getAIRecommendation}
            aiLoading={aiLoading}
            aiError={aiError}
            aiSuggestedPhone={aiSuggestedPhone} // Pass the AI suggested phone to FilterSection
          />
        </div>
        <section className="lg:col-span-3">
          <h2 className="text-3xl font-bold mb-6" style={{ color: accentColor }}>Recommended Phones</h2>
          {filteredPhones.length === 0 ? (
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No phones match your criteria. Try adjusting your filters or budget.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPhones.map(phone => (
                <PhoneCard key={phone.id} phone={phone} accentColor={accentColor} darkMode={darkMode} />
              ))}
            </div>
          )}
        </section>
      </main>
      {messageBox && (
        <MessageBox
          message={messageBox.message}
          type={messageBox.type}
          onClose={() => setMessageBox(null)}
        />
      )}
    </div>
  );
}

// --- Main App Component that provides contexts ---
function App() {
  return (
    <FirebaseProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </FirebaseProvider>
  );
}

export default App;
