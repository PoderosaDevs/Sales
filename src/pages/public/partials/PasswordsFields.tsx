// PasswordFields.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordFields = ({ register, errors }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block font-bold text-xl text-gray-700 tracking-wide mb-2"
        >
          Senha
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register("senha", { required: "A senha é obrigatória." })} // Adicionando registro com validação
            value={password}
            onChange={handlePasswordChange}
            className={`w-full px-3 py-2 bg-[#f5f5f5] border ${errors.senha ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Digite sua senha"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-2 top-2"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="mt-2">
          <div className="h-2 bg-gray-300 rounded">
            <div
              className={`h-full ${passwordStrength === 1 ? 'bg-red-500' :
                passwordStrength === 2 ? 'bg-yellow-500' :
                passwordStrength === 3 ? 'bg-blue-500' : 'bg-green-500'
              } rounded`}
              style={{ width: `${(passwordStrength / 4) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">
            {passwordStrength === 1 && 'Senha fraca'}
            {passwordStrength === 2 && 'Senha média'}
            {passwordStrength === 3 && 'Senha boa'}
            {passwordStrength === 4 && 'Senha forte'}
          </p>
        </div>
        {errors.senha && <span className="text-red-500 text-sm">{errors.senha.message}</span>} {/* Mensagem de erro */}
      </div>
      <div className="mb-6">
        <label
          htmlFor="confirm-password"
          className="block font-bold text-xl text-gray-700 tracking-wide mb-2"
        >
          Confirmar Senha
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full px-3 py-2 bg-[#f5f5f5] border ${password !== confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Confirme sua senha"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-2 top-2"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-500 text-sm mt-1">As senhas não coincidem.</p>
        )}
      </div>
    </div>
  );
};

export default PasswordFields;
