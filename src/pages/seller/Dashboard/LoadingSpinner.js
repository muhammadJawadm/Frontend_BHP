import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
