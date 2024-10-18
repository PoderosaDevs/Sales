import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa"; // Importando ícone de câmera
import Swal from "sweetalert2"; // Importando SweetAlert
import InputMask from "react-input-mask"; // Importando a biblioteca de máscaras
import { useAuth } from "../../context/AuthContext";

export function Perfil() {
  const { usuarioData } = useAuth();
  const [formData, setFormData] = useState({
    nome: usuarioData?.nome || "", // Nome fixo
    cpf: "123.456.789-00", // CPF fixo
    foto: "", // Foto a ser carregada
    endereco: usuarioData?.endereco || "",
    cep: usuarioData?.cep || "",
    numero: usuarioData?.numero || "",
    complemento: usuarioData?.complemento || "",
    telefone: usuarioData?.telefone || "",
    tipoPessoa: usuarioData?.tipo_usuario || "",
    funcao: usuarioData?.funcao || "",
    dataNascimento: usuarioData?.data_nascimento || "",
    isWhatsApp: false,
  });

  const [progress, setProgress] = useState(0);
  const [isFormComplete, setIsFormComplete] = useState(false);

  // Função para verificar o preenchimento dos campos e calcular o progresso
  useEffect(() => {
    const totalFields = 9; // Total de campos obrigatórios
    const filledFields = Object.values(formData).filter(value => value).length;
    const progressPercentage = Math.floor((filledFields / totalFields) * 100);

    setProgress(progressPercentage);
    setIsFormComplete(progressPercentage === 100);
  }, [formData]);

  // Atualizando a função para lidar com eventos de input e select
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWhatsAppChange = () => {
    setFormData((prev) => ({
      ...prev,
      isWhatsApp: !prev.isWhatsApp,
    }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, foto: URL.createObjectURL(e.target.files[0]) });
    }
  };

  // Função para lidar com o clique no botão de salvar
  const handleSave = () => {
    if (!isFormComplete) {
      Swal.fire({
        icon: "warning",
        title: "Preencha todas as informações",
        text: "Para salvar o perfil, todos os campos devem estar preenchidos.",
      });
      return;
    }
    // Ação de salvar aqui...
  };

  return (
    <div className="max-w-[1500px] pt-10 m-auto">
      <div className="bg-white px-10 py-6 rounded-xl flex flex-col mb-5 lg:mb-8">
        <h3 className="font-bold text-3xl text-gray-800 mb-6">Perfil</h3>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right mb-6">{progress}% completo</p>

        <div className="flex items-center justify-between mb-6">
          <label className="relative inline-block ml-4">
            <img
              src={formData.foto || "https://via.placeholder.com/150"}
              alt="Foto do Usuário"
              className="w-24 h-24 rounded-full object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="hidden"
            />
            <button className="absolute -right-2 -bottom-2 bg-blue-500 text-white rounded-full p-2">
              <FaCamera />
            </button>
          </label>
          <div className="ml-6">
            <div className="flex items-center">
              <label className="text-xl font-semibold mr-2">Nome:</label>
              <span className="text-xl font-normal">{formData.nome}</span>
            </div>
            <div className="flex items-center">
              <label className="text-xl font-semibold mr-2">CPF:</label>
              <span className="text-gray-600">{formData.cpf}</span>
            </div>
          </div>
        </div>

        <hr className="my-6" />
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <div className="w-full">
              <label className="block mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
            </div>

            <div className="w-full">
              <label className="block mb-1">Telefone</label>
              <InputMask
                mask="(99) 99999-9999"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
                placeholder="(00) 0 0000-0000"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block mb-1">Receber WhatsApp:</label>
              <input
                type="checkbox"
                checked={formData.isWhatsApp}
                onChange={handleWhatsAppChange}
                className="toggle-checkbox hidden"
              />
              <div
                onClick={handleWhatsAppChange}
                className={`toggle-label flex items-center cursor-pointer relative w-12 h-6 rounded-full bg-gray-400 transition-colors duration-300 ${formData.isWhatsApp ? 'bg-blue-600' : ''}`}
              >
                <span
                  className={`absolute w-6 h-6 rounded-full bg-white transition-transform duration-300 transform ${formData.isWhatsApp ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
              <div className="w-full">
                <label className="block mb-1">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              <div className="w-full">
                <label className="block mb-1">CEP</label>
                <InputMask
                  mask="99999-999"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="w-full">
                <label className="block mb-1">Número</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Número da residência"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1">Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Apto, Bloco, etc."
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="w-full">
                <label className="block mb-1">Tipo de Pessoa</label>
                <select
                  disabled
                  name="tipoPessoa"
                  value={formData.tipoPessoa}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="">{formData.tipoPessoa}</option>
                </select>
              </div>

              <div className="w-full">
                <label className="block mb-1">Função</label>
                <select
                  name="funcao"
                  value={formData.funcao}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="">{formData.funcao}</option>
                  <option value="gerente">Gerente</option>
                  <option value="funcionario">Funcionário</option>
                  <option value="cliente">Cliente</option>
                  <option value="convidado">Convidado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={!isFormComplete}
              onClick={handleSave}
              className={`px-6 py-3 rounded-lg text-white font-semibold ${
                isFormComplete ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
