import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Archive, Trash } from 'lucide-react';
import ArchiveConfirmDialog from '../components/ArchiveConfirmDialog';
import { getBrandImage } from '../utils/brandImages';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    budget: '',
    useCase: '',
    preferences: [],
    additionalRequirements: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [archivedPhones, setArchivedPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [archiveDialog, setArchiveDialog] = useState({ isOpen: false, phone: null });

  const GEMINI_API_KEY = 'YOUR_API_KEY';

  // Load archived phones from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('archivedPhones');
    if (saved) {
      try {
        setArchivedPhones(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse archived phones:', e);
      }
    }
  }, []);

  // Save archived phones to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('archivedPhones', JSON.stringify(archivedPhones));
  }, [archivedPhones]);

  const steps = [
    { title: 'Budget', subtitle: 'What\'s your budget range?' },
    { title: 'Use Case', subtitle: 'How will you use your phone?' },
    { title: 'Preferences', subtitle: 'What features matter most?' },
    { title: 'Additional', subtitle: 'Any other requirements?' }
  ];

  const useCases = [
    { id: 'gaming', label: '🎮 Gaming', desc: 'High performance for mobile games' },
    { id: 'photography', label: '📸 Photography', desc: 'Excellent camera system' },
    { id: 'business', label: '💼 Business', desc: 'Professional use and productivity' },
    { id: 'everyday', label: '📱 Everyday', desc: 'General daily usage' },
    { id: 'content', label: '🎥 Content Creation', desc: 'Video and content creation' },
    { id: 'travel', label: '✈️ Travel', desc: 'Long battery and durability' }
  ];

  const preferenceOptions = [
    { id: 'battery', label: '🔋 Long Battery Life', desc: 'All-day usage' },
    { id: 'camera', label: '📷 Camera Quality', desc: 'Top-tier photography' },
    { id: 'performance', label: '⚡ High Performance', desc: 'Fast and smooth' },
    { id: 'display', label: '📺 Great Display', desc: 'Vivid colors and clarity' },
    { id: 'storage', label: '💾 Large Storage', desc: 'Plenty of space' },
    { id: 'brand', label: '🏆 Premium Brand', desc: 'Trusted manufacturers' },
    { id: 'design', label: '✨ Sleek Design', desc: 'Beautiful aesthetics' },
    { id: 'durability', label: '🛡️ Durability', desc: 'Resistant to damage' }
  ];

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

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.budget !== '';
      case 1: return formData.useCase !== '';
      case 2: return formData.preferences.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const openArchiveDialog = (phone) => {
    setArchiveDialog({ isOpen: true, phone });
  };

  const closeArchiveDialog = () => {
    setArchiveDialog({ isOpen: false, phone: null });
  };

  const confirmArchive = () => {
    if (archiveDialog.phone) {
      const phoneWithId = { ...archiveDialog.phone, id: Date.now() + Math.random() };
      setArchivedPhones(prev => [...prev, phoneWithId]);
    }
    closeArchiveDialog();
  };

  const removeFromArchive = (phoneId) => {
    setArchivedPhones(prev => prev.filter(phone => phone.id !== phoneId));
  };

  const isPhoneArchived = (phone) => {
    return archivedPhones.some(archived => archived.name === phone.name && archived.brand === phone.brand);
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError('');

    const prompt = `You are a phone recommendation expert. Based on the following user requirements, recommend 3-4 specific phone models with detailed explanations:

Budget: $${formData.budget}
Primary Use Case: ${formData.useCase}
Key Preferences: ${formData.preferences.join(', ')}
Additional Requirements: ${formData.additionalRequirements || 'None'}

For each phone recommendation, provide:
1. Exact model name and brand
2. Current approximate price
3. Key specifications (processor, RAM, storage, camera, battery)
4. Why it fits their needs
5. Pros and cons
6. Overall rating out of 10

Format your response as a JSON array with objects containing: name, brand, price, specs, whyRecommended, pros, cons, rating

Ensure all recommendations are within budget and available in 2024/2025.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        const responseText = result.candidates[0].content.parts[0].text;
        
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsedRecommendations = JSON.parse(jsonMatch[0]);
          setRecommendations(parsedRecommendations);
        } else {
          // If no JSON found, parse the text response manually
          const textRecommendations = parseTextRecommendations(responseText);
          setRecommendations(textRecommendations);
        }
      } else {
        throw new Error('No recommendations received');
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseTextRecommendations = (text) => {
    // Fallback parser for non-JSON responses
    const lines = text.split('\n').filter(line => line.trim());
    const recommendations = [];
    let currentRec = null;

    lines.forEach(line => {
      if (line.match(/^\d+\./)) {
        if (currentRec) recommendations.push(currentRec);
        currentRec = {
          name: line.replace(/^\d+\.\s*/, ''),
          brand: 'Various',
          price: 'TBD',
          specs: {},
          whyRecommended: '',
          pros: [],
          cons: [],
          rating: 8
        };
      } else if (currentRec && line.includes('Price:')) {
        currentRec.price = line.replace(/.*Price:\s*/, '');
      } else if (currentRec && line.includes('Why:')) {
        currentRec.whyRecommended = line.replace(/.*Why:\s*/, '');
      }
    });

    if (currentRec) recommendations.push(currentRec);
    return recommendations;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">What's your budget?</h3>
              <p className="text-cyan-200">Enter your maximum budget in USD</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300 text-xl">$</span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={handleBudgetChange}
                  placeholder="1000"
                  className="w-full pl-8 pr-4 py-4 text-xl border-2 border-cyan-400/30 bg-black/20 backdrop-blur-sm rounded-xl focus:border-cyan-400 focus:outline-none transition-all text-white placeholder-cyan-300/50"
                />
              </div>
              <div className="flex justify-between mt-4 text-sm text-cyan-200">
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
              <p className="text-cyan-200">Select your primary use case</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {useCases.map((useCase) => (
                <button
                  key={useCase.id}
                  onClick={() => handleUseCaseSelect(useCase.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transform duration-300 bg-black/20 backdrop-blur-sm ${
                    formData.useCase === useCase.id
                      ? 'border-cyan-400 bg-cyan-500/20 shadow-cyan-500/30'
                      : 'border-cyan-400/30 hover:border-cyan-400/60'
                  }`}
                >
                  <div className="text-2xl mb-2">{useCase.label.split(' ')[0]}</div>
                  <div className="font-semibold text-white">{useCase.label.substring(2)}</div>
                  <div className="text-sm text-cyan-200 mt-1">{useCase.desc}</div>
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
              <p className="text-cyan-200">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {preferenceOptions.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => handlePreferenceToggle(pref.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-md hover:shadow-cyan-500/20 hover:scale-105 transform duration-300 bg-black/20 backdrop-blur-sm ${
                    formData.preferences.includes(pref.id)
                      ? 'border-cyan-400 bg-cyan-500/20 shadow-cyan-500/30'
                      : 'border-cyan-400/30 hover:border-cyan-400/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{pref.label}</div>
                      <div className="text-sm text-cyan-200">{pref.desc}</div>
                    </div>
                    {formData.preferences.includes(pref.id) && (
                      <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
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
              <p className="text-cyan-200">Specific brands, features, or dealbreakers (optional)</p>
            </div>
            <div className="max-w-lg mx-auto">
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="e.g., Must have wireless charging, prefer Samsung, no older than 2023..."
                className="w-full px-4 py-4 border-2 border-cyan-400/30 bg-black/20 backdrop-blur-sm rounded-xl focus:border-cyan-400 focus:outline-none transition-all resize-none text-white placeholder-cyan-300/50"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (recommendations.length > 0) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('/lovable-uploads/c6b815f1-90da-4241-a0c6-6c875be399f7.png')` }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        <div className="relative z-10 container mx-auto px-4 max-w-7xl py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Your Perfect Phone Matches</h1>
            <p className="text-cyan-200 text-lg drop-shadow">Based on your preferences, here are our AI-powered recommendations</p>
            <button
              onClick={() => {
                setRecommendations([]);
                setCurrentStep(0);
                setFormData({ budget: '', useCase: '', preferences: [], additionalRequirements: '' });
              }}
              className="mt-4 px-6 py-2 bg-black/30 backdrop-blur-sm text-cyan-200 rounded-lg hover:bg-black/50 transition-all border border-cyan-400/30 hover:border-cyan-400/60"
            >
              Start Over
            </button>
          </div>

          {/* Archived Phones Section */}
          {archivedPhones.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">📥 Your Saved Favorites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archivedPhones.map((phone) => (
                  <div key={phone.id} className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 transform border border-purple-400/30">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative">
                      <div className="absolute top-2 right-2 bg-purple-500/30 px-2 py-1 rounded-full text-xs font-semibold">
                        SAVED
                      </div>
                      <div className="flex items-center mb-4">
                        <img 
                          src={getBrandImage(phone.brand)} 
                          alt={phone.brand}
                          className="w-12 h-12 rounded-lg object-cover mr-3 border-2 border-white/20"
                        />
                        <div>
                          <h3 className="text-xl font-bold mb-1">{phone.name}</h3>
                          <p className="text-purple-100">{phone.brand}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{phone.price}</span>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                          {phone.rating}/10 ⭐
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold text-white mb-2">Why this phone?</h4>
                        <p className="text-purple-200 text-sm">{phone.whyRecommended}</p>
                      </div>

                      {phone.specs && Object.keys(phone.specs).length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-white mb-2">Key Specs</h4>
                          <div className="text-sm text-purple-200 space-y-1">
                            {Object.entries(phone.specs).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm flex-1">
                          <div>
                            <h5 className="font-semibold text-green-400 mb-1">Pros</h5>
                            <ul className="text-purple-200 space-y-1">
                              {(phone.pros || []).slice(0, 2).map((pro, i) => (
                                <li key={i} className="text-xs">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-red-400 mb-1">Cons</h5>
                            <ul className="text-purple-200 space-y-1">
                              {(phone.cons || []).slice(0, 2).map((con, i) => (
                                <li key={i} className="text-xs">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromArchive(phone.id)}
                          className="ml-4 bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-110 flex items-center text-sm border border-red-400/30"
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Recommendations Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">🔥 Fresh Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((phone, index) => (
                <div key={index} className="bg-gradient-to-br from-cyan-900/80 to-blue-900/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-105 transform border border-cyan-400/30">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center mb-4">
                      <img 
                        src={getBrandImage(phone.brand)} 
                        alt={phone.brand}
                        className="w-12 h-12 rounded-lg object-cover mr-3 border-2 border-white/20"
                      />
                      <div>
                        <h3 className="text-xl font-bold mb-1">{phone.name}</h3>
                        <p className="text-cyan-100">{phone.brand}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{phone.price}</span>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                        {phone.rating}/10 ⭐
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-white mb-2">Why this phone?</h4>
                      <p className="text-cyan-200 text-sm">{phone.whyRecommended}</p>
                    </div>

                    {phone.specs && Object.keys(phone.specs).length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-white mb-2">Key Specs</h4>
                        <div className="text-sm text-cyan-200 space-y-1">
                          {Object.entries(phone.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <h5 className="font-semibold text-green-400 mb-1">Pros</h5>
                        <ul className="text-cyan-200 space-y-1">
                          {(phone.pros || []).slice(0, 3).map((pro, i) => (
                            <li key={i} className="text-xs">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-400 mb-1">Cons</h5>
                        <ul className="text-cyan-200 space-y-1">
                          {(phone.cons || []).slice(0, 3).map((con, i) => (
                            <li key={i} className="text-xs">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => openArchiveDialog(phone)}
                      disabled={isPhoneArchived(phone)}
                      className={`w-full py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center ${
                        isPhoneArchived(phone)
                          ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                          : 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60'
                      }`}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      {isPhoneArchived(phone) ? 'Already Saved' : '📥 Save to Favorites'}
                    </button>
                  </div>
                </div>
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

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('/lovable-uploads/c6b815f1-90da-4241-a0c6-6c875be399f7.png')` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      <div className="relative z-10 min-h-screen flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">HyperBudget</h1>
            <p className="text-xl text-cyan-200 drop-shadow-lg">Find your perfect phone with AI-powered recommendations</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      index <= currentStep 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' 
                        : 'bg-black/30 backdrop-blur-sm text-cyan-300 border border-cyan-400/30'
                    }`}>
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                        index < currentStep ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-cyan-400/30'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-white drop-shadow-lg">{steps[currentStep].title}</h2>
              <p className="text-cyan-200 drop-shadow">{steps[currentStep].subtitle}</p>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-cyan-400/20">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                  : 'bg-black/30 backdrop-blur-sm text-cyan-200 hover:bg-black/50 border border-cyan-400/30 hover:border-cyan-400/60 hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={getRecommendations}
                disabled={loading || !canProceed()}
                className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  loading || !canProceed()
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:scale-105 hover:shadow-cyan-500/50'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
                disabled={!canProceed()}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  !canProceed()
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-400/30'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:scale-105 hover:shadow-cyan-500/50'
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/80 backdrop-blur-sm border border-red-400/50 text-red-200 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
