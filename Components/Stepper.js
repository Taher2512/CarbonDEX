"use client"

import React, { useState, useEffect } from 'react';

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(prevStep => prevStep + 1);
      }
    }, 2000); // Change step every 2 seconds

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="max-w-2xl mx-auto p-12">
      <div className="relative">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center mb-16">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-1000 ease-in-out ${
                  step < currentStep
                    ? 'bg-green text-black scale-90'
                    : step === currentStep
                    ? 'bg-green text-black scale-110 shadow-xl'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div 
                  className={`absolute left-8 top-16 w-1 h-24 transition-all duration-1000 ease-in-out ${
                    step < currentStep ? 'bg-green' : 'bg-gray-300'
                  }`} 
                />
              )}
            </div>
            <div className={`ml-8 transition-all duration-1000 ease-in-out ${
              step === currentStep ? 'transform translate-x-4' : ''
            }`}>
              <div className={`text-2xl font-bold mb-2 ${
                step === currentStep ? 'text-white' : 'text-gray-700'
              }`}>Step {step}</div>
              <div className={`text-lg transition-all duration-1000 ease-in-out ${
                step === currentStep ? 'text-gray-500' : 'text-gray-400'
              }`}>This is the description for Step {step}</div>
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default Stepper;