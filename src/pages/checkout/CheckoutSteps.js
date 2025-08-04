import React from 'react';

const CheckoutSteps = ({ steps, activeStep }) => {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`flex flex-col items-center ${index <= activeStep ? 'text-slate-900' : 'text-slate-400'}`}
          style={{ width: `${100 / steps.length}%` }}
        >
          <div 
            className={`
              flex items-center justify-center w-10 h-10 rounded-full mb-2
              ${index < activeStep 
                ? 'bg-green-500 text-white' 
                : index === activeStep 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }
            `}
          >
            {index < activeStep ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              step.icon || (index + 1)
            )}
          </div>
          <span className={`text-sm font-medium ${index <= activeStep ? 'text-slate-900' : 'text-slate-400'}`}>
            {step.name}
          </span>
          
          {/* Connector line between steps */}
          {index < steps.length - 1 && (
            <div className="hidden sm:block absolute h-0.5 w-full" style={{ 
              left: `calc(${(index + 0.5) * 100 / steps.length}%)`,
              width: `${100 / steps.length}%`,
              top: '1.25rem',
              transform: 'translateY(-50%)',
              background: index < activeStep ? '#10b981' : '#e2e8f0'
            }}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
