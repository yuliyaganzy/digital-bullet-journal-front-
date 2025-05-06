import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  options = [],
  value = null,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error = '',
  label = '',
  required = false,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  labelClassName = '',
  errorClassName = '',
  fullWidth = false,
  size = 'md',
  variant = 'outlined',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === value);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  // Base classes
  const baseClasses = 'relative focus:outline-none transition-colors duration-200';
  
  // Variant classes
  const variantClasses = {
    outlined: 'border rounded-md',
    filled: 'border-0 border-b-2 bg-gray-100 rounded-t-md',
    standard: 'border-0 border-b-2',
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
    normal: 'border-gray-300 hover:border-gray-400',
    error: 'border-red-500 text-red-900',
    disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Determine state
  let state = 'normal';
  if (error) state = 'error';
  if (disabled) state = 'disabled';
  
  // Combine classes
  const dropdownClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.custom}
    ${sizeClasses[size] || sizeClasses.custom}
    ${stateClasses[state]}
    ${widthClasses}
    ${dropdownClassName}
  `;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`} ref={dropdownRef}>
      {label && (
        <label className={`block mb-1 font-medium text-gray-700 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={dropdownClasses} onClick={toggleDropdown} {...props}>
        <div className="flex items-center justify-between cursor-pointer">
          <span className={!selectedOption ? 'text-gray-500' : ''}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg 
            className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  option.value === value ? 'bg-gray-100' : ''
                } ${optionClassName}`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.node,
  required: PropTypes.bool,
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  optionClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'custom']),
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard', 'custom'])
};

export default Dropdown;