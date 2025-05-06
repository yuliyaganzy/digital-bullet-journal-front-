import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '', 
  rounded = 'md', 
  shadow = 'md', 
  padding = 'md',
  border = false,
  borderColor = 'gray-200',
  ...props 
}) => {
  const roundedClasses = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    'full': 'rounded-full',
    'custom': ''
  };

  const shadowClasses = {
    'none': 'shadow-none',
    'sm': 'shadow-sm',
    'md': 'shadow',
    'lg': 'shadow-lg',
    'xl': 'shadow-xl',
    '2xl': 'shadow-2xl',
    'custom': ''
  };

  const paddingClasses = {
    'none': 'p-0',
    'sm': 'p-2',
    'md': 'p-4',
    'lg': 'p-6',
    'xl': 'p-8',
    'custom': ''
  };

  const borderClasses = border ? `border border-${borderColor}` : '';

  const cardClasses = `
    bg-white 
    ${roundedClasses[rounded]} 
    ${shadowClasses[shadow]} 
    ${paddingClasses[padding]}
    ${borderClasses}
    ${className}
  `;

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full', 'custom']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'custom']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'custom']),
  border: PropTypes.bool,
  borderColor: PropTypes.string
};

export default Card;