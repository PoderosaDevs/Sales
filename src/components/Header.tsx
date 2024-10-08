import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="pl-[120px] bg-custom-gradient text-white p-4 relative ">
      <div className='max-w-[1500px] m-auto flex items-center justify-between px-6'>
        <span className='font-outfit text-2xl font-semibold'>{title}</span>
        <div className="relative">
          <FaUser
            className="text-xl cursor-pointer"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black border rounded shadow-lg z-10">
              <ul>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">Perfil</li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">Configurações</li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">Ajuda</li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">Sair</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
