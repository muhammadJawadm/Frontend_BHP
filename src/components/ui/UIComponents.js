import React from 'react';

export const Avatar = ({ className, children }) => (
  <div className={`rounded-full bg-gray-300 flex items-center justify-center ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt }) => null;

export const AvatarFallback = ({ className, children }) => (
  <span className={`text-gray-600 ${className}`}>{children}</span>
);

export const Button = ({ children, className = "", variant = "default", size = "default", onClick, disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-slate-800 text-white hover:bg-slate-900",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-0 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

export const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    secondary: "bg-gray-100 text-gray-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Select = ({ children, value, onValueChange }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ className, children }) => children;
export const SelectValue = () => null;
export const SelectContent = ({ children }) => children;
export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);