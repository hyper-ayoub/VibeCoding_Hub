import React, { useState, useCallback } from 'react';
import './App.scss';

const JsonAnalyzer = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isValidJson, setIsValidJson] = useState(false);
  const [validationError, setValidationError] = useState('');

  // API Key directly in the component
  const GEMINI_API_KEY = 'YOUR_API_KEY';

  const validateJson = useCallback((input) => {
    if (!input.trim()) {
      setIsValidJson(false);
      setValidationError('');
      return false;
    }
    
    try {
      JSON.parse(input);
      setIsValidJson(true);
      setValidationError('');
      return true;
    } catch (error) {
      setIsValidJson(false);
      setValidationError(error.message);
      return false;
    }
  }, []);

  const handleJsonChange = (value) => {
    setJsonInput(value);
    validateJson(value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please upload a JSON file (.json)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      handleJsonChange(content);
    };
    reader.readAsText(file);
  };

  const analyzeJson = async () => {
    if (!isValidJson || !jsonInput.trim()) {
      alert('Please provide valid JSON before analyzing');
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Analyze this JSON data and provide insights:

${jsonInput}

Please provide a comprehensive analysis in the following JSON format:
{
  "summary": "Brief overview of what this JSON contains",
  "breakdown": "Detailed structural analysis",
  "insights": "Key patterns and interesting findings",
  "issues": "Potential problems or inefficiencies",
  "suggestions": "Recommendations for optimization"
}

Important: Return ONLY the JSON response with the five specified fields.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from AI');
      }

      // Clean the response to extract JSON
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysisResult = JSON.parse(cleanedText);
      
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze JSON. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleJsons = [
    {
      name: "User Profile",
      json: `{
  "user": {
    "id": 12345,
    "name": "John Doe",
    "email": "john@example.com",
    "profile": {
      "age": 30,
      "location": "New York",
      "interests": ["coding", "music", "travel"]
    },
    "settings": {
      "theme": "dark",
      "notifications": true
    }
  }
}`
    },
    {
      name: "E-commerce Order",
      json: `{
  "order": {
    "id": "ORD-2024-001",
    "customer": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "items": [
      {
        "id": "ITEM-001",
        "name": "Laptop",
        "price": 999.99,
        "quantity": 1
      },
      {
        "id": "ITEM-002",
        "name": "Mouse",
        "price": 29.99,
        "quantity": 2
      }
    ],
    "total": 1059.97,
    "status": "pending"
  }
}`
    }
  ];

  return (
    <div className="json-analyzer">
      {/* Advanced Background Effects */}
      <div className="background-effects">
        <div className="animated-grid"></div>
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="glow-effect glow-1"></div>
        <div className="glow-effect glow-2"></div>
        <div className="glow-effect glow-3"></div>
        <div className="wave-animation"></div>
      </div>
      
      <div className="container">
        {/* Hero Banner */}
        <header className="hero-banner">
          <div className="hero-content">
            <img 
              src="https://bing.com/th/id/BCO.044e3b34-403a-4793-b040-266fe2a5e8b8.png" 
              alt="HypraJson Analyzer - AI-Powered Analysis" 
              className="hero-image"
            />
            <div className="hero-overlay">
              <p className="hero-subtitle">
                Advanced JSON Analysis with AI-Powered Insights
              </p>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="input-section">
            {!jsonInput.trim() && (
              <div className="sample-jsons">
                <h3>Try a sample JSON:</h3>
                <div className="sample-buttons">
                  {sampleJsons.map((sample, index) => (
                    <button
                      key={index}
                      className="sample-button"
                      onClick={() => handleJsonChange(sample.json)}
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="input-card">
              <div className="card-header">
                <span className="upload-icon">📁</span>
                <h2>JSON Input</h2>
                {isValidJson && jsonInput.trim() && (
                  <span className="valid-icon">✅</span>
                )}
                {!isValidJson && jsonInput.trim() && (
                  <span className="invalid-icon">❌</span>
                )}
              </div>

              <div className="input-area">
                <textarea
                  placeholder="Paste your JSON here..."
                  value={jsonInput}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className={`json-textarea ${!isValidJson && jsonInput.trim() ? 'invalid' : ''}`}
                />
                
                {validationError && (
                  <div className="validation-error">
                    {validationError}
                  </div>
                )}
              </div>

              <div className="actions">
                <div className="file-upload">
                  <label htmlFor="file-upload" className="upload-button">
                    📤 Upload JSON File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <button
                  onClick={analyzeJson}
                  disabled={!isValidJson || isLoading}
                  className="analyze-button"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      ✨ Analyze JSON
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="results-section">
            {analysis ? (
              <div className="analysis-card">
                <div className="card-header">
                  <h2>AI Analysis Results</h2>
                  <span className="results-badge">Complete</span>
                </div>
                <div className="analysis-content">
                  <div className="analysis-section">
                    <h3>📊 Summary</h3>
                    <p>{analysis.summary}</p>
                  </div>
                  <div className="analysis-section">
                    <h3>🔍 Breakdown</h3>
                    <p>{analysis.breakdown}</p>
                  </div>
                  <div className="analysis-section">
                    <h3>💡 Insights</h3>
                    <p>{analysis.insights}</p>
                  </div>
                  <div className="analysis-section">
                    <h3>⚠️ Issues</h3>
                    <p>{analysis.issues}</p>
                  </div>
                  <div className="analysis-section">
                    <h3>🚀 Suggestions</h3>
                    <p>{analysis.suggestions}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="placeholder-card">
                <div className="placeholder-content">
                  <span className="placeholder-icon">⚡</span>
                  <h3>Ready to Analyze</h3>
                  <p>Paste valid JSON and click "Analyze JSON" to get AI-powered insights</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Impressive Footer */}
        <footer className="impressive-footer">
          <div className="footer-content">
            <div className="footer-glow"></div>
            <div className="creator-badge">
              <span className="created-text">Created by</span>
              <span className="creator-name">hyper-ayoub</span>
              <span className="full-name">ayoub bouagna</span>
            </div>
            <div className="footer-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default JsonAnalyzer;
