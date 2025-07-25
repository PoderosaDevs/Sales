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
    <header className="bg-indigo-600 text-white relative ">
      <div className='max-w-[1500px] m-auto py-8 px-6 flex items-center justify-between sm:py-6'>
      <span className="font-outfit text-2xl font-semibold hidden sm:block">{title}</span>
      </div>
    </header>
  );
}
