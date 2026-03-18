import React, { useState, ChangeEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface PasswordFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({ register, errors }) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const calculatePasswordStrength = (pass: string): void => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  const toggleShowPassword = (): void => setShowPassword(!showPassword);

  // Mapeamento de cores e textos para a força da senha
  const strengthConfig = [
    { label: "Muito fraca", color: "bg-red-500/50", width: "25%" },
    { label: "Fraca", color: "bg-orange-500/50", width: "50%" },
    { label: "Boa", color: "bg-emerald-400/50", width: "75%" },
    { label: "Forte", color: "bg-emerald-500", width: "100%" },
  ];

  const currentStrength = strengthConfig[passwordStrength - 1] || { label: "", color: "bg-white/5", width: "0%" };

  return (
    <div className="space-y-5">
      {/* Campo: Senha */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1"
        >
          Senha de Acesso
        </label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("senha", { 
              required: "A senha é obrigatória.",
              onChange: handlePasswordChange 
            })}
            className={`w-full px-4 py-3 bg-white/[0.03] border ${
              errors.senha ? "border-red-500/50" : "border-white/10 group-hover:border-white/20"
            } rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300 shadow-inner`}
            placeholder="Crie uma senha forte"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-emerald-400 transition-colors"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        {/* Strength Meter Profissional */}
        <div className="px-1 pt-2">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${currentStrength.color}`}
              style={{ width: currentStrength.width }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
              Segurança: <span className="text-gray-300">{currentStrength.label || "---"}</span>
            </p>
            {errors.senha && (
              <span className="text-red-400 text-[10px] font-bold italic">
                {String(errors.senha.message)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Campo: Confirmar Senha */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirm-password"
          className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1"
        >
          Confirmar Senha
        </label>
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3 bg-white/[0.03] border ${
              confirmPassword && password !== confirmPassword
                ? "border-red-500/50"
                : "border-white/10 group-hover:border-white/20"
            } rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300 shadow-inner`}
            placeholder="Repita sua senha"
          />
        </div>
        
        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-400 text-[10px] font-bold ml-1 animate-pulse">
            As senhas não coincidem.
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordFields;