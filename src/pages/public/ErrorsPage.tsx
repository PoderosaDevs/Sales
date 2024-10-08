import React from 'react';
import Lottie from 'react-lottie';
import animationErrorPage from '../../assets/animations/errorsPage.json';
import { Link } from 'react-router-dom';

export default function ErrorsPage() {
  // Configurações para o Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationErrorPage,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh - 76px] bg-gray-100 px-4">


      <div className="relative w-full flex justify-center">
        {/* Contenção da animação */}
        <div className="w-full max-w-[1000px] md:max-w-[600px] lg:max-w-[600px] h-auto">
          <Lottie
            options={defaultOptions}
            height={'100%'}
            width={'100%'}
            className="max-h-[600px] md:max-h-[600px] lg:max-h-[600px] w-full"
          />
        </div>
      </div>
      <h1 className="text-7xl md:text-5xl font-bold text-gray-800 mb-4">
        Página não encontrada
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mt-4">
        Parece que a página que você está procurando não existe.
      </p>

      <Link to="/" className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow hover:bg-blue-600">
        Voltar para a Home
      </Link>
    </div>
  );
}
