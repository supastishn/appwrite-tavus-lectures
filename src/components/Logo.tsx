import React from 'react';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 40 }) => {
  return (
    <div className="bg-indigo-600 flex items-center justify-center rounded-lg" style={{ width: size, height: size }}>
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 12L9 19L9 5L19 12Z" fill="white" />
        <path d="M5 5V19" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default Logo;
