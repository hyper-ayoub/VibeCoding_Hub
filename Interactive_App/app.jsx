import React, { useState, useEffect } from 'react';
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
