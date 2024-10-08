import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt
} from 'react-icons/fa';

export function MenuUser() {
  return (
    <div className='relative h-full w-64 p-x-2'>
      <div className='flex flex-col h-full'>
        {/* Menu Items */}
        <ul className='flex flex-col space-y-4'>
          <li>
            <Link
              to='/perfil'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <FaUserAlt className='mr-3 text-lg' />
              Perfil
            </Link>
          </li>
          <li>
            <Link
              to='/ajuda'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <FaQuestionCircle className='mr-3 text-lg' />
              Ajuda
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
