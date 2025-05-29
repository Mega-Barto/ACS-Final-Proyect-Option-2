import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const baseInputStyles = `
      px-3 py-2 
      bg-white 
      border border-gray-300 
      rounded-md 
      shadow-sm 
      focus:outline-none 
      focus:ring-2 
      focus:ring-primary-500 
      focus:border-primary-500
      disabled:bg-gray-100 
      disabled:cursor-not-allowed
    `;
    
    const errorInputStyles = error 
      ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
      : '';
    
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`mb-4 ${widthStyle}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div>
          <input
            ref={ref}
            className={`
              ${baseInputStyles} 
              ${errorInputStyles} 
              ${className}
            `}
            {...props}
          />
          {error && (
            <p className="mt-1 text-sm text-error-600">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;