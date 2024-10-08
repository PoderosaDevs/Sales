import React, { useState, useEffect } from 'react';
import { MenuUser } from './menu-user';
import { MenuBackoffice } from './menu-backoffice';

interface AsideSecondaryProps {
  isOpen: boolean;
  activeIcon: 'home' | 'user' | 'cog' | 'catalog' | 'backoffice' | null;
  buttonRef: React.RefObject<HTMLButtonElement> | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function AsideSecondary({ isOpen, activeIcon, buttonRef, onMouseEnter, onMouseLeave }: AsideSecondaryProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (buttonRef && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const tooltipWidth = 200; // Largura do tooltip
      const tooltipHeight = 300; // Altura do tooltip
      setPosition({
        left: rect.right + window.scrollX, // Alinha ao lado direito do ícone
        top: rect.top + window.scrollY + (rect.height - tooltipHeight) / 2, // Centraliza verticalmente
      });
    }
  }, [buttonRef, isOpen]);

  useEffect(() => {
    if (activeIcon === 'user') {
      setActiveTab('user');
    } else if (activeIcon === 'backoffice') {
      setActiveTab('backoffice');
    } else {
      setActiveTab(null);
    }
  }, [activeIcon]);

  return (
    <div
      className={`transition-transform duration-300 ease-in-out absolute bg-white shadow-lg rounded-md overflow-hidden z-10 ${
        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      style={{
        
        width: '200px',
        top: position?.top,
        left: position?.left,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Indicador de seta */}
      <div
        className="absolute w-0 h-0 border-t-8 border-t-white border-r-8 border-r-transparent border-b-8 border-b-transparent"
        style={{ top: '50%', left: '-8px', transform: 'translateY(-50%)' }}
      ></div>

      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="border-b border-gray-300">
          <ul className="flex space-x-2 p-2">
            {activeIcon === 'user' && (
              <li
                className={`cursor-pointer py-2 px-4 text-center ${
                  activeTab === 'user' ? 'text-gray-600 font-semibold' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('user')}
              >
                Usuário
              </li>
            )}
            {activeIcon === 'backoffice' && (
              <li
                className={`cursor-pointer py-2 px-4 text-center ${
                  activeTab === 'backoffice' ? 'text-gray-600 font-semibold' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('backoffice')}
              >
                Backoffice
              </li>
            )}
          </ul>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'user' && <MenuUser />}
          {activeTab === 'backoffice' && <MenuBackoffice />}
        </div>
      </div>
    </div>
  );
}
