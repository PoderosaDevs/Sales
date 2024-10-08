import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserAlt
} from 'react-icons/fa';
import { BsBagHeartFill } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
import { BsRocketTakeoffFill } from "react-icons/bs";
import { BiSolidShoppingBags } from "react-icons/bi";
import { IoStorefront } from "react-icons/io5";

export function MenuBackoffice() {
  return (
    <div className='relative h-full w-64 p-x-2'>
      <div className='flex flex-col h-full'>
        {/* Menu Items */}
        <ul className='flex flex-col space-y-2'>
          <li className='border-b border-gray-300 last:border-none'>
            <Link
              to='/produtos'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <AiFillProduct className='mr-3 text-lg' />
              Produtos
            </Link>
          </li>
          <li className='border-b border-gray-300 last:border-none'>
            <Link
              to='/lojas'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <IoStorefront className='mr-3 text-lg' />
              Lojas
            </Link>
          </li>
          <li className='border-b border-gray-300 last:border-none'>
            <Link
              to='/linhas'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <BiSolidShoppingBags className='mr-3 text-lg' />
              Linhas
            </Link>
          </li>
          <li className='border-b border-gray-300 last:border-none'>
            <Link
              to='/marcas'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <BsBagHeartFill className='mr-3 text-lg' />
              Marcas
            </Link>
          </li>
          <li className='border-b border-gray-300 last:border-none'>
            <Link
              to='/funcionarios'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <FaUserAlt className='mr-3 text-lg' />
              Funcionarios
            </Link>
          </li>
          <li className='border-b border-gray-300 last:border-none'>
            <Link
              to='/metas'
              className='flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-300'
            >
              <BsRocketTakeoffFill className='mr-3 text-lg' />
              Metas
            </Link>
          </li>
        </ul>

      </div>
    </div>
  );
}
