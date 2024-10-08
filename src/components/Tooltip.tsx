import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  tooltipText: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, tooltipText }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className="absolute top-1/2 left-full ml-2 p-2 bg-white text-black rounded-md text-sm font-semibold shadow-lg"
          style={{ transform: 'translateY(-50%)', zIndex: 50 }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};
