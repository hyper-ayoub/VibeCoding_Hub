import React, { useState, useEffect, useRef } from 'react';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? initialAuthToken : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const App = () => {
  const [email, setEmail] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validationSectionRef = useRef(null);

  const abstractApiKey = 'YOUR_Apstract_API_KEY';
  const geminiApiKey = 'YOUR_GEMINI_API_KEY';

  const showCustomModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeCustomModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const validateEmail = async () => {
    if (!email) {
      showCustomModal('Please enter an email address to validate.');
      return;
    }

    setLoading(true);
    setError('');
    setValidationResult(null);

    try {
      const abstractApiUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${abstractApiKey}&email=${encodeURIComponent(email)}`;
      const abstractResponse = await fetch(abstractApiUrl);
      const abstractData = await abstractResponse.json();

      if (!abstractResponse.ok) {
        throw new Error(abstractData.error?.message || 'Failed to validate email with Abstract API.');
      }

      const emailLocalPart = email.split('@')[0];
      let lengthAnalysis = 'Optimal';
      if (emailLocalPart.length < 5) {
        lengthAnalysis = 'Too short (might be less descriptive)';
      } else if (emailLocalPart.length > 25) {
        lengthAnalysis = 'Too long (might be harder to remember)';
      }

      const prompt = `Given the email address "${email}" and the following validation details:
      - Is valid format: ${abstractData.is_valid_format.value}
      - Is deliverable (SMTP check): ${abstractData.is_smtp_valid.value}
      - Is a free email provider (e.g., Gmail, Outlook): ${abstractData.is_free_email.value}
      - Domain: ${abstractData.domain}
      - Email local part length analysis: ${lengthAnalysis}

      Please provide a comprehensive analysis in JSON format, including:
      1.  A "professionalismScore" (integer out of 100).
      2.  A "readabilityMemorability" assessment (string).
      3.  An "improvementTips" array (strings), suggesting how to enhance professionalism, readability, or memorability.

      Example JSON structure:
      {
        "professionalismScore": 75,
        "readabilityMemorability": "Easy to read but could be more memorable.",
        "improvementTips": ["Consider adding your full name.", "Use a custom domain for business."]
      }`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "professionalismScore": { "type": "NUMBER" },
              "readabilityMemorability": { "type": "STRING" },
              "improvementTips": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              }
            },
            "propertyOrdering": ["professionalismScore", "readabilityMemorability", "improvementTips"]
          }
        }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      }

      const geminiResult = await geminiResponse.json();

      let aiAnalysis = {};
      if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
          geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
          geminiResult.candidates[0].content.parts.length > 0) {
        const jsonString = geminiResult.candidates[0].content.parts[0].text;
        aiAnalysis = JSON.parse(jsonString);
      } else {
        throw new Error('Gemini API response structure unexpected or empty.');
      }

      setValidationResult({
        email: email,
        status: abstractData.is_valid_format.value ? '✅ Valid' : '❌ Invalid Format',
        smtpValid: abstractData.is_smtp_valid.value ? '✅ Yes' : '❌ No',
        domain: abstractData.domain,
        isFreeEmail: abstractData.is_free_email.value ? 'Public/Free' : 'Custom/Professional',
        lengthAnalysis: lengthAnalysis,
        professionalismScore: aiAnalysis.professionalismScore,
        readabilityMemorability: aiAnalysis.readabilityMemorability,
        improvementTips: aiAnalysis.improvementTips || []
      });

    } catch (err) {
      console.error('Validation error:', err);
      setError(`Error: ${err.message}. Please try again.`);
      showCustomModal(`Error: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const scrollToValidation = () => {
    if (validationSectionRef.current) {
      validationSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
     
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '1rem',
      fontFamily: 'Inter, sans-serif',
      color: '#374151'
    }}>
      <section style={{
        width: '100%',
        maxWidth: '64rem',
        textAlign: 'center',
        paddingTop: '5rem',
        paddingBottom: '5rem',
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        marginBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{
          fontSize: '3.75rem',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          GooseMail <span style={{
            fontSize: '4.375rem',
          }}>📧</span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4b5563',
          marginBottom: '2.5rem',
          maxWidth: '48rem',
          margin: '0 auto',
          lineHeight: '1.625',
        }}>
          Your advanced email validator that checks not only format, but also the <span style={{ fontWeight: '600', color: '#2563eb' }}>strength</span>, <span style={{ fontWeight: '600', color: '#9333ea' }}>readability</span>, and <span style={{ fontWeight: '600', color: '#059669' }}>professionalism</span> of an email address. Get instant insights and AI-generated improvement tips.
        </p>
        
        <button
          onClick={scrollToValidation}
          style={{
            background: 'linear-gradient(to right, #10b981, #0d9488)',
            color: '#fff',
            fontWeight: '700',
            padding: '1rem 2.5rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            margin: '0 auto',
            fontSize: '1.5rem',
          }}
        >
          Get Started <span style={{
            fontSize: '1.875rem',
          }}>🚀</span>
        </button>
      </section>

      <section style={{
        width: '100%',
        maxWidth: '64rem',
        marginBottom: '3rem',
        padding: '2rem',
        backgroundColor: '#eff6ff',
        borderRadius: '0.75rem',
        border: '1px solid #bfdbfe',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          color: '#1e40af',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{ fontSize: '3rem' }}>✅</span> What It Does
        </h2>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '1.25rem',
          color: '#4b5563'
        }}>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#3b82f6', fontSize: '1.875rem', fontWeight: '700' }}>•</span> Validates email format with precision.
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#3b82f6', fontSize: '1.875rem', fontWeight: '700' }}>•</span> Checks domain and MX records for deliverability (optional).
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#3b82f6', fontSize: '1.875rem', fontWeight: '700' }}>•</span> Rates email length & memorability for user-friendliness.
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#3b82f6', fontSize: '1.875rem', fontWeight: '700' }}>•</span> Provides a professionalism score out of 100.
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#3b82f6', fontSize: '1.875rem', fontWeight: '700' }}>•</span> Offers AI-generated improvement tips for enhanced impact.
          </li>
        </ul>
      </section>

      <section style={{
        width: '100%',
        maxWidth: '64rem',
        marginBottom: '3rem',
        padding: '2rem',
        backgroundColor: '#f3e8ff',
        borderRadius: '0.75rem',
        border: '1px solid #d8b4fe',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          color: '#6b21a8',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{ fontSize: '3rem' }}>🔧</span> How to Use
        </h2>
        <ol style={{
          listStyle: 'decimal',
          paddingLeft: '1.5rem',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '1.25rem',
          color: '#4b5563'
        }}>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#a855f7', fontSize: '1.875rem', fontWeight: '700' }}>1.</span> Simply enter any email address in the field below.
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#a855f7', fontSize: '1.875rem', fontWeight: '700' }}>2.</span> Click the "Analyze Email" button to initiate the scan.
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '0.75rem', color: '#a855f7', fontSize: '1.875rem', fontWeight: '700' }}>3.</span> Receive a full, detailed analysis and a comprehensive score instantly.
          </li>
        </ol>
      </section>

      <section ref={validationSectionRef} style={{
        width: '100%',
        maxWidth: '64rem',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        marginBottom: '3rem',
      }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '800',
          textAlign: 'center',
          color: '#374151',
          marginBottom: '2rem',
        }}>
          Start Your Email Analysis
        </h2>
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="emailInput" style={{
            display: 'block',
            color: '#4b5563',
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
          }}>
            Enter Email Address:
          </label>
          <input
            type="email"
            id="emailInput"
            style={{
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              appearance: 'none',
              border: '1px solid #d1d5db',
              borderRadius: '0.75rem',
              width: '100%',
              padding: '1rem 1.25rem',
              color: '#374151',
              lineHeight: '1.25',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              fontSize: '1.25rem',
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'text',
            }}
            placeholder="e.g., dev.john.smith@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          onClick={validateEmail}
          style={{
            width: '100%',
            background: 'linear-gradient(to right, #3b82f6, #9333ea)',
            color: '#fff',
            fontWeight: '700',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            outline: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontSize: '1.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg style={{ animation: 'spin 1s linear infinite', height: '1.5rem', width: '1.5rem', color: '#fff' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              Analyze Email <span style={{ fontSize: '1.875rem' }}>🚀</span>
            </>
          )}
        </button>
        {error && (
          <p style={{
            color: '#dc2626',
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '1.125rem',
            fontWeight: '500',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            borderRadius: '0.5rem',
            border: '1px solid #fca5a5',
          }}>
            {error}
          </p>
        )}

        {validationResult && (
          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}>
            <h3 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              Analysis Results
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              columnGap: '2rem',
              rowGap: '1.5rem',
              color: '#4b5563',
              fontSize: '1.125rem',
            }}>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0.75rem',
                backgroundColor: '#fff',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                border: '1px solid #f3f4f6'
              }}>
                <span style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>Email:</span>
                <span style={{ fontFamily: 'monospace', wordBreak: 'break-word', color: '#1d4ed8', fontWeight: '500', fontSize: '1rem' }}>{validationResult.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Status:</span>
                <span style={{ color: validationResult.status.includes('Valid') ? '#16a34a' : '#dc2626', fontWeight: '700', fontSize: '1.25rem' }}>{validationResult.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Domain:</span>
                <span style={{ fontFamily: 'monospace', color: '#7e22ce', fontWeight: '500' }}>{validationResult.domain}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Domain Type:</span>
                <span style={{ fontWeight: '500', color: '#ea580c' }}>{validationResult.isFreeEmail}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>SMTP Valid:</span>
                <span style={{ color: validationResult.smtpValid.includes('Yes') ? '#16a34a' : '#dc2626', fontWeight: '700', fontSize: '1.25rem' }}>{validationResult.smtpValid}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Length:</span>
                <span style={{ fontWeight: '500', color: '#0f766e' }}>{validationResult.lengthAnalysis}</span>
              </div>
            </div>

            <div style={{
              marginTop: '2.5rem',
              borderTop: '2px solid #e5e7eb',
              paddingTop: '2.5rem',
            }}>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '1rem',
              }}>
                Professionalism Score: <span style={{ color: '#7e22ce', fontSize: '2.5rem' }}>{validationResult.professionalismScore}/100</span>
              </p>
              <p style={{
                color: '#4b5563',
                fontSize: '1.25rem',
                marginBottom: '1.5rem',
              }}>
                
                <span style={{ fontWeight: '600', color: '#374151' }}>Readability & Memorability:</span> {validationResult.readabilityMemorability}
              </p>

              {validationResult.improvementTips.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                    <span style={{ fontSize: '1.875rem' }}>💡</span> AI-Generated Improvement Tips:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: '#4b5563',
                    fontSize: '1.125rem',
                  }}>
                    {validationResult.improvementTips.map((tip, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        backgroundColor: '#fff',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        border: '1px solid #bfdbfe',
                      }}>
                        <span style={{ marginRight: '0.75rem', color: '#3b82f6', fontSize: '1.5rem', fontWeight: '700' }}>•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <p style={{
        textAlign: 'center',
        color: 'black',
        fontSize: '1.2rem',
        marginTop: '2.5rem',
        marginBottom: '2rem',
        fontFamily: 'Montserrat ',
      }}>
        Powered by Bouagna Ayoub Software Engineer and AI Research
      </p>

      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '1.5rem',
            maxWidth: '24rem',
            width: '100%',
            textAlign: 'center',
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '1rem',
            }}>Notification</h3>
            <p style={{
              color: '#4b5563',
              marginBottom: '1.5rem',
            }}>{modalMessage}</p>
            <button
              onClick={closeCustomModal}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                fontWeight: '700',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

