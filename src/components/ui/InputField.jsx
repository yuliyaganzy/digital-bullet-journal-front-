import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const InputField = forwardRef(({
  id,
  name,
  type = 'text',
  label,
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperTextClassName = '',
  fullWidth = false,
  variant = 'outlined',
  size = 'md',
  startIcon,
  endIcon,
  ...props
}, ref) => {
  
  // Base classes
  const baseInputClasses = 'focus:outline-none transition-colors duration-200';
  
  // Variant classes
  const variantClasses = {
    outlined: 'border rounded-md focus:ring-2 focus:ring-offset-0',
    filled: 'border-0 border-b-2 bg-gray-100 focus:bg-gray-50 rounded-t-md',
    standard: 'border-0 border-b-2 focus:border-b-2',
    custom: ''
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
    custom: ''
  };
  
  // State classes
  const stateClasses = {
    normal: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900',
    disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Determine state
  let state = 'normal';
  if (error) state = 'error';
  if (disabled) state = 'disabled';
  
  // Combine classes
  const inputClasses = `
    ${baseInputClasses}
    ${variantClasses[variant] || variantClasses.custom}
    ${sizeClasses[size] || sizeClasses.custom}
    ${stateClasses[state]}
    ${widthClasses}
    ${inputClassName}
  `;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={id || name} 
          className={`block mb-1 font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${inputClasses} ${startIcon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''}`}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={`mt-1 text-sm text-gray-500 ${helperTextClassName}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.node,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  helperTextClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard', 'custom']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'custom']),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node
};

export default InputField;