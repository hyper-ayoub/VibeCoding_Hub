import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Archive, Trash, X, CheckCircle, Info } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Toast Notification Component ---
const ToastNotification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-blue-600';
  const icon = type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <Info className="w-5 h-5 mr-2" />;

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} transition-all duration-300 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      {icon}
      <span>{message}</span>
      <button onClick={() => setIsVisible(false)} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Archive Confirmation Dialog Component
const ArchiveConfirmDialog = ({ isOpen, onClose, onConfirm, phoneName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-poppins">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-2">Confirm Archive</h3>
          <p className="text-gray-300 text-lg">
            Are you sure you want to archive <span className="font-semibold text-purple-400">"{phoneName}"</span>?
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Phone Card Component ---
const PhoneCard = ({ phone, isArchived, onArchive, onRemove }) => {
  const cardBgGradient = isArchived ? 'from-purple-900/80 to-indigo-900/80' : 'from-blue-900/80 to-purple-900/80';
  const headerBgGradient = isArchived ? 'from-purple-600 to-indigo-700' : 'from-blue-500 to-purple-600';
  const borderColor = isArchived ? 'border-purple-400/40' : 'border-blue-400/40';
  const shadowColor = isArchived ? 'shadow-purple-500/40' : 'shadow-blue-500/40';
  const textColor = isArchived ? 'text-purple-200' : 'text-blue-200';
  const brandTextColor = isArchived ? 'text-purple-100' : 'text-blue-100';

  return (
    <div className={`bg-gradient-to-br ${cardBgGradient} backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:${shadowColor} transition-all duration-500 hover:scale-[1.02] transform border ${borderColor}`}>
      <div className={`bg-gradient-to-r ${headerBgGradient} p-6 text-white relative`}>
        {isArchived && (
          <div className="absolute top-4 right-4 bg-purple-500/40 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            ARCHIVED
          </div>
        )}
        <div className="flex items-center mb-4">
          <img
            src={phone.brandImageUrl || 'https://placehold.co/48x48/60A5FA/FFFFFF?text=PH'}
            alt={phone.brand}
            className="w-14 h-14 rounded-xl object-cover mr-4 border-2 border-white/30 shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/60A5FA/FFFFFF?text=PH'; }}
          />
          <div>
            <h3 className="text-2xl font-bold mb-1">{phone.name}</h3>
            <p className={`${brandTextColor} text-lg`}>{phone.brand}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-3xl font-bold">{phone.price}</span>
          <span className="bg-white bg-opacity-20 px-4 py-1.5 rounded-full text-base flex items-center font-semibold">
            {phone.rating?.toFixed(1)}/10 ⭐
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5">
          <h4 className="font-semibold text-white text-lg mb-2">Why this phone?</h4>
          <p className={`${textColor} text-sm leading-relaxed`}>{phone.whyRecommended}</p>
        </div>

        {phone.specs && (
          <div className="mb-5">
            <h4 className="font-semibold text-white text-lg mb-2">Key Specs</h4>
            <div className={`text-sm ${textColor} space-y-1.5`}>
              {phone.specs.split(',').map((spec, i) => {
                const [key, value] = spec.split(':').map(s => s.trim());
                return (
                  <div key={i} className="flex justify-between items-center">
                    <span className="capitalize font-medium">{key}:</span>
                    <span className={brandTextColor}>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <h5 className="font-semibold text-green-400 text-base mb-1">Pros</h5>
            <ul className={`${textColor} space-y-1`}>
              {(phone.pros || []).slice(0, 3).map((pro, i) => (
                <li key={i} className="text-xs flex items-start">
                  <span className="mr-1 text-green-300">•</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-red-400 text-base mb-1">Cons</h5>
            <ul className={`${textColor} space-y-1`}>
              {(phone.cons || []).slice(0, 2).map((con, i) => (
                <li key={i} className="text-xs flex items-start">
                  <span className="mr-1 text-red-300">•</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isArchived ? (
          <button
            onClick={() => onRemove(phone.id)}
            className="w-full py-3 px-4 bg-red-600/30 hover:bg-red-600/50 text-red-200 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center font-semibold border border-red-500/40 shadow-md hover:shadow-lg hover:shadow-red-500/30"
          >
            <Trash className="w-5 h-5 mr-2" />
            Remove from Archive
          </button>
        ) : (
          <button
            onClick={() => onArchive(phone)}
            disabled={phone.isArchived} // Assuming isArchived is a prop passed to the phone object for this button's state
            className={`w-full py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center font-semibold ${
              phone.isArchived // Check against the phone object's archived status
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                : 'bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 shadow-md hover:shadow-lg hover:shadow-blue-500/30'
            }`}
          >
            <Archive className="w-5 h-5 mr-2" />
            {phone.isArchived ? 'Already Archived' : '📥 Archive'}
          </button>
        )}
      </div>
    </div>
  );
};


// Main App Component
const App = () => {
  // State for form data and UI flow
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    budget: '',
    useCase: '',
    preferences: [],
    additionalRequirements: ''
  });
  // State for recommendations and archived phones
  const [recommendations, setRecommendations] = useState([]);
  const [archivedPhones, setArchivedPhones] = useState([]);
  // State for loading, errors, and dialogs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [archiveDialog, setArchiveDialog] = useState({ isOpen: false, phone: null });
  const [toast, setToast] = useState(null); // State for toast notification

  // Firebase authentication states
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Effect for Firebase Initialization and Authentication
  useEffect(() => {
    const initFirebase = async () => {
      try {
        const firebaseConfig = typeof __firebase_config !== 'undefined'
          ? JSON.parse(__firebase_config)
          : {};

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            setUserId(crypto.randomUUID());
          }
          setIsAuthReady(true);
        });

        return () => unsubscribe();
      } catch (e) {
        console.error("Firebase initialization or authentication error:", e);
        setError("Failed to initialize application. Please refresh and try again.");
        setIsAuthReady(true);
      }
    };

    initFirebase();
  }, []);

  // Effect to load archived phones from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('hyperbudgetArchivedPhones');
    if (saved) {
      try {
        setArchivedPhones(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse archived phones from localStorage:', e);
      }
    }
  }, []);

  // Effect to save archived phones to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('hyperbudgetArchivedPhones', JSON.stringify(archivedPhones));
  }, [archivedPhones]);

  // Define the steps for the recommendation process
  const steps = [
    { title: 'Budget', subtitle: 'What\'s your budget range?' },
    { title: 'Use Case', subtitle: 'How will you use your phone?' },
    { title: 'Preferences', subtitle: 'What features matter most?' },
    { title: 'Additional', subtitle: 'Any other requirements?' }
  ];

  // Define primary use cases for phone recommendation
  const useCases = [
    { id: 'gaming', label: '🎮 Gaming', desc: 'High performance for mobile games' },
    { id: 'photography', label: '📸 Photography', desc: 'Excellent camera system' },
    { id: 'business', label: '💼 Business', desc: 'Professional use and productivity' },
    { id: 'everyday', label: '📱 Everyday', desc: 'General daily usage' },
    { id: 'content', label: '🎥 Content Creation', desc: 'Video and content creation' },
    { id: 'travel', label: '✈️ Travel', desc: 'Long battery and durability' }
  ];

  // Define preference options for phone features
  const preferenceOptions = [
    { id: 'battery', label: '🔋 Long Battery Life', desc: 'All-day usage' },
    { id: 'camera', label: '📷 Camera Quality', desc: 'Top-tier photography' },
    { id: 'performance', label: '⚡ High Performance', desc: 'Fast and smooth' },
    { id: 'display', label: '📺 Great Display', desc: 'Vivid colors and clarity' },
    { id: 'storage', label: '💾 Large Storage', desc: 'Plenty of space' },
    { id: 'brand', label: '🏆 Premium Brand', desc: 'Trusted manufacturers' },
    { id: 'design', label: '✨ Sleek Design', 'desc': 'Beautiful aesthetics' },
    { id: 'durability', label: '🛡️ Durability', desc: 'Resistant to damage' }
  ];

  // Handlers for form input changes
  const handleBudgetChange = (e) => {
    setFormData({ ...formData, budget: e.target.value });
  };

  const handleUseCaseSelect = (useCase) => {
    setFormData({ ...formData, useCase });
  };

  const handlePreferenceToggle = (preference) => {
    const newPreferences = formData.preferences.includes(preference)
      ? formData.preferences.filter(p => p !== preference)
      : [...formData.preferences, preference];
    setFormData({ ...formData, preferences: newPreferences });
  };

  // Navigation functions for multi-step form
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Determine if the user can proceed to the next step
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0: return formData.budget !== '' && !isNaN(parseFloat(formData.budget)) && parseFloat(formData.budget) > 0;
      case 1: return formData.useCase !== '';
      case 2: return formData.preferences.length > 0;
      case 3: return true; // Additional requirements are optional
      default: return false;
    }
  }, [currentStep, formData]);

  // Functions for managing the archive confirmation dialog
  const openArchiveDialog = (phone) => {
    setArchiveDialog({ isOpen: true, phone });
  };

  const closeArchiveDialog = () => {
    setArchiveDialog({ isOpen: false, phone: null });
  };

  // Confirm archiving a phone
  const confirmArchive = () => {
    if (archiveDialog.phone) {
      // Add a unique ID to the archived phone for proper list rendering and removal
      // Also mark it as archived for the button state
      const phoneWithId = { ...archiveDialog.phone, id: Date.now() + Math.random(), isArchived: true };
      setArchivedPhones(prev => [...prev, phoneWithId]);
      // Update the original recommendations to reflect the archived status
      setRecommendations(prev => prev.map(rec =>
        (rec.name === phoneWithId.name && rec.brand === phoneWithId.brand)
          ? { ...rec, isArchived: true }
          : rec
      ));
      setToast({ message: `"${archiveDialog.phone.name}" archived successfully!`, type: 'success' });
    }
    closeArchiveDialog();
  };

  // Remove a phone from the archived list
  const removeFromArchive = (phoneId) => {
    setArchivedPhones(prev => prev.filter(phone => phone.id !== phoneId));
    // Also update the original recommendations to unmark the archived status
    setRecommendations(prev => prev.map(rec =>
      (rec.id === phoneId) // Use the unique ID for removal from recommendations
        ? { ...rec, isArchived: false }
        : rec
    ));
    setToast({ message: `Phone removed from archive.`, type: 'info' });
  };

  // Check if a phone is already in the archived list
  const isPhoneArchived = (phone) => {
    return archivedPhones.some(archived => archived.name === phone.name && archived.brand === phone.brand);
  };

  // Function to get AI-powered phone recommendations
  const getRecommendations = async () => {
    setLoading(true);
    setError('');
    setRecommendations([]); // Clear previous recommendations

    // Updated prompt to ask for a generic brand image URL
    const prompt = `You are a phone recommendation expert. Based on the following user requirements, recommend 3-4 specific phone models with detailed explanations:

Budget: $${formData.budget}
Primary Use Case: ${formData.useCase}
Key Preferences: ${formData.preferences.join(', ')}
Additional Requirements: ${formData.additionalRequirements || 'None'}

For each phone recommendation, provide:
1. Exact model name and brand
2. Current approximate price (e.g., "$799")
3. Key specifications (e.g., "Processor: Snapdragon 8 Gen 3, RAM: 12GB, Storage: 256GB, Camera: 50MP, Battery: 5000mAh")
4. Why it fits their needs
5. Pros (2-3 concise bullet points)
6. Cons (1-2 concise bullet points)
7. Overall rating out of 10 (e.g., 9.2, use a float if appropriate)
8. A generic placeholder image URL for the brand (e.g., "https://placehold.co/48x48/000000/FFFFFF?text=Brand")

Format your response as a JSON array with objects containing the following keys (ensure all keys are present and correctly typed for each object):
name (string), brand (string), price (string), specs (string, comma-separated key:value pairs), whyRecommended (string), pros (array of strings), cons (array of strings), rating (number, float allowed), brandImageUrl (string)

Ensure all recommendations are within the specified budget and are models available in 2024/2025.`;

    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                brand: { type: "STRING" },
                price: { type: "STRING" },
                specs: { type: "STRING" },
                whyRecommended: { type: "STRING" },
                pros: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                cons: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                rating: { type: "NUMBER" },
                brandImageUrl: { type: "STRING" }
              },
              required: ["name", "brand", "price", "specs", "whyRecommended", "pros", "cons", "rating", "brandImageUrl"]
            }
          }
        }
      };

      const apiKey = "YOUR_API_KEY";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      console.log("Attempting to fetch recommendations...");
      console.log("API URL:", apiUrl);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log("API Response Status:", response.status);
      console.log("API Response OK:", response.ok);

      const responseBodyText = await response.text();
      console.log("Raw API Response Body Text:", responseBodyText);


      if (!response.ok) {
        let errorDetails = `Status: ${response.status} ${response.statusText}`;
        try {
          const errorJson = JSON.parse(responseBodyText);
          errorDetails += `, Details: ${errorJson.error?.message || responseBodyText}`;
        } catch (parseError) {
          errorDetails += `, Raw Body: ${responseBodyText.substring(0, 200)}...`;
        }
        throw new Error(`API request failed: ${errorDetails}`);
      }

      let result;
      try {
          result = JSON.parse(responseBodyText);
      } catch (parseError) {
          throw new Error(`Failed to parse API response as JSON: ${parseError.message}. Raw: ${responseBodyText.substring(0, 200)}...`);
      }

      console.log("Parsed API Result Object:", result);

      if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        let responseText = result.candidates[0].content.parts[0].text;
        console.log("AI Generated Text (from parts[0].text):", responseText);

        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch && jsonMatch[0].trim()) {
          responseText = jsonMatch[0];
          console.log("Extracted JSON string:", responseText);
        } else if (!responseText.trim()) {
          throw new Error("AI response was empty or did not contain valid JSON. Please try again with different input.");
        } else {
            throw new Error("AI response did not return a valid JSON array. Received: " + responseText.substring(0, 200) + "...");
        }

        try {
          const parsedRecommendations = JSON.parse(responseText);
          if (Array.isArray(parsedRecommendations) && parsedRecommendations.every(item => typeof item === 'object' && item !== null && 'name' in item)) {
            // Mark recommendations as archived if they are already in the archived list
            const recommendationsWithArchivedStatus = parsedRecommendations.map(rec => ({
              ...rec,
              isArchived: isPhoneArchived(rec) // Check against the current archived list
            }));
            setRecommendations(recommendationsWithArchivedStatus);
          } else {
            throw new Error("Received valid JSON, but it's not in the expected phone recommendation format.");
          }
        } catch (jsonErr) {
          console.error('Failed to parse extracted JSON response:', jsonErr, 'Extracted response text:', responseText);
          setError('Failed to process AI response. The extracted JSON might be incomplete or malformed. Please try again or refine your input.');
          setRecommendations([]);
        }
      } else {
        setError('No valid candidates or content received from the AI. This might indicate an issue with the AI generation itself.');
      }
    } catch (err) {
      console.error('Error getting recommendations (top-level catch):', err);
      setError(`Failed to get recommendations: ${err.message}. Please check your input and try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Render content for each step of the form
  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">What's your budget?</h3>
              <p className="text-purple-200">Enter your maximum budget in USD</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 text-xl">$</span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={handleBudgetChange}
                  placeholder="1000"
                  className="w-full pl-8 pr-4 py-4 text-xl border-2 border-purple-400/30 bg-black/20 backdrop-blur-sm rounded-xl focus:border-purple-400 focus:outline-none transition-all text-white placeholder-purple-300/50 appearance-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none font-poppins"
                  min="0"
                />
              </div>
              <div className="flex justify-between mt-4 text-sm text-purple-200 font-poppins">
                <span>Budget phones: $200-400</span>
                <span>Flagship: $800-1200+</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">How will you use your phone?</h3>
              <p className="text-purple-200">Select your primary use case</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {useCases.map((useCase) => (
                <button
                  key={useCase.id}
                  onClick={() => handleUseCaseSelect(useCase.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transform duration-300 bg-black/20 backdrop-blur-sm font-poppins ${
                    formData.useCase === useCase.id
                      ? 'border-purple-400 bg-purple-500/20 shadow-purple-500/30'
                      : 'border-purple-400/30 hover:border-purple-400/60'
                  }`}
                >
                  <div className="text-2xl mb-2">{useCase.label.split(' ')[0]}</div>
                  <div className="font-semibold text-white">{useCase.label.substring(2)}</div>
                  <div className="text-sm text-purple-200 mt-1">{useCase.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">What features matter most?</h3>
              <p className="text-purple-200">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {preferenceOptions.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => handlePreferenceToggle(pref.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-md hover:shadow-purple-500/20 hover:scale-[1.02] transform duration-300 bg-black/20 backdrop-blur-sm font-poppins ${
                    formData.preferences.includes(pref.id)
                      ? 'border-purple-400 bg-purple-500/20 shadow-purple-500/30'
                      : 'border-purple-400/30 hover:border-purple-400/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{pref.label}</div>
                      <div className="text-sm text-purple-200">{pref.desc}</div>
                    </div>
                    {formData.preferences.includes(pref.id) && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Any additional requirements?</h3>
              <p className="text-purple-200">Specific brands, features, or dealbreakers (optional)</p>
            </div>
            <div className="max-w-lg mx-auto">
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="e.g., Must have wireless charging, prefer Samsung, no older than 2023..."
                className="w-full px-4 py-4 border-2 border-purple-400/30 bg-black/20 backdrop-blur-sm rounded-xl focus:border-purple-400 focus:outline-none transition-all resize-none text-white placeholder-purple-300/50 font-poppins"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [currentStep, formData, handleBudgetChange, handleUseCaseSelect, handlePreferenceToggle, useCases, preferenceOptions]);

  // Conditional rendering for recommendations view vs. form view
  if (recommendations.length > 0) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed relative font-poppins" style={{ backgroundImage: `url('https://i.ibb.co/Nnypvspg/Focus.png')` }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="relative z-10 container mx-auto px-4 max-w-7xl py-8 md:py-12">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Your Perfect Phone Matches</h1>
            <p className="text-purple-200 text-lg md:text-xl drop-shadow">Based on your preferences, here are our AI-powered recommendations</p>
            <button
              onClick={() => {
                setRecommendations([]);
                setCurrentStep(0);
                setFormData({ budget: '', useCase: '', preferences: [], additionalRequirements: '' });
                setError(''); // Clear any previous errors
              }}
              className="mt-6 px-8 py-3 bg-black/40 backdrop-blur-sm text-purple-200 rounded-full hover:bg-black/60 transition-all border border-purple-400/30 hover:border-purple-400/60 shadow-lg hover:shadow-purple-500/20 transform hover:scale-105"
            >
              Start Over
            </button>
          </div>

          {/* User ID Display */}
          {userId && isAuthReady && (
            <div className="text-center text-sm text-gray-300 mb-8 p-3 bg-black/30 rounded-lg border border-gray-700 shadow-inner max-w-md mx-auto">
              Your User ID: <span className="font-mono text-gray-100 break-all">{userId}</span>
            </div>
          )}

          {/* Archived Phones Section */}
          {archivedPhones.length > 0 && (
            <div className="mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">📥 Your Archived Phones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archivedPhones.map((phone) => (
                  <PhoneCard
                    key={phone.id}
                    phone={phone}
                    isArchived={true}
                    onArchive={openArchiveDialog}
                    onRemove={removeFromArchive}
                  />
                ))}
              </div>
            </div>
          )}

          {/* New Recommendations Section */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">🔥 Fresh Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((phone) => (
                <PhoneCard
                  key={phone.name + phone.brand} // Using name+brand as a key, assuming uniqueness for new recommendations
                  phone={phone}
                  isArchived={isPhoneArchived(phone)} // Pass the archived status to the card
                  onArchive={openArchiveDialog}
                  onRemove={removeFromArchive}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Archive Confirmation Dialog */}
        <ArchiveConfirmDialog
          isOpen={archiveDialog.isOpen}
          onClose={closeArchiveDialog}
          onConfirm={confirmArchive}
          phoneName={archiveDialog.phone?.name || ''}
        />
      </div>
    );
  }

  // Default view (form steps)
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative font-poppins" style={{ backgroundImage: `url('https://i.ibb.co/Nnypvspg/Focus.png')` }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">HyperBudget</h1>
            <p className="text-xl md:text-2xl text-purple-200 drop-shadow-lg">Find your perfect phone with AI-powered recommendations</p>
          </div>

          {/* User ID Display */}
          {userId && isAuthReady && (
            <div className="text-center text-sm text-gray-300 mb-8 p-3 bg-black/30 rounded-lg border border-gray-700 shadow-inner max-w-md mx-auto">
              Your User ID: <span className="font-mono text-gray-100 break-all">{userId}</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-center mb-5">
              <div className="flex items-center space-x-4 md:space-x-6">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold text-xl transition-all duration-300 transform ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                        : 'bg-black/30 backdrop-blur-sm text-purple-300 border border-purple-400/30'
                    }`}>
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 md:w-20 h-1.5 mx-2 rounded-full transition-all duration-300 ${
                        index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-purple-400/30'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-white drop-shadow-lg">{steps[currentStep].title}</h2>
              <p className="text-purple-200 text-lg drop-shadow">{steps[currentStep].subtitle}</p>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-black/30 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mb-10 border border-purple-400/20">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || loading}
              className={`flex items-center px-7 py-3.5 rounded-full font-semibold text-lg transition-all duration-300 ${
                currentStep === 0 || loading
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                  : 'bg-black/30 backdrop-blur-sm text-purple-200 hover:bg-black/50 border border-purple-400/30 hover:border-purple-400/60 hover:scale-105 shadow-md hover:shadow-purple-500/20'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={getRecommendations}
                disabled={loading || !canProceed() || !isAuthReady}
                className={`flex items-center px-9 py-3.5 rounded-full font-semibold text-lg transition-all duration-300 ${
                  loading || !canProceed() || !isAuthReady
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/40 hover:scale-105 hover:shadow-blue-500/60'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    Get Recommendations
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed() || loading}
                className={`flex items-center px-7 py-3.5 rounded-full font-semibold text-lg transition-all duration-300 ${
                  !canProceed() || loading
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/40 hover:scale-105 hover:shadow-blue-500/60'
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mt-8 p-4 bg-red-900/80 backdrop-blur-sm border border-red-400/50 text-red-200 rounded-lg text-center shadow-lg font-poppins">
              {error}
            </div>
          )}
        </div>
      </div>
      {/* Footer with copyright */}
      <footer className="relative z-10 text-center py-4 text-purple-300 text-sm font-poppins">
        &copy; hyper-ayoub 2025-2026
      </footer>
    </div>
  );
};

export default App;
