"use client"

import React, { useState } from 'react';

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <div className="relative">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center mb-8">
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                  step < currentStep
                    ? 'bg-green text-white scale-90'
                    : step === currentStep
                    ? 'bg-green text-white scale-110 shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div 
                  className={`absolute left-4 top-8 w-0.5 h-12 transition-all duration-300 ease-in-out ${
                    step < currentStep ? 'bg-green' : 'bg-gray-300'
                  }`} 
                />
              )}
            </div>
            <div className={`ml-4 transition-all duration-300 ease-in-out ${
              step === currentStep ? 'transform translate-x-2' : ''
            }`}>
              <div className={`font-medium ${
                step === currentStep ? 'text-white' : 'text-gray-700'
              }`}>Step {step}</div>
              <div className={`text-sm transition-all duration-300 ease-in-out ${
                step === currentStep ? 'text-gray-500' : 'text-gray-400'
              }`}>Step {step} description</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 border border-gray-200 rounded-md mb-4 transition-all duration-300 ease-in-out">
        <p className="text-gray-600">Step {currentStep} Content</p>
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Stepper;