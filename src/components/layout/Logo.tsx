import React from 'react';

export const Logo: React.FC<{ className?: string; size?: number; color?: string }> = ({ 
  className = "", 
  size = 32,
  color = "#fe4a49" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="4" />
      <path 
        d="M30 70V30L50 50L70 30V70" 
        stroke={color} 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;
