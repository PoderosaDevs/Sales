import React, { useState } from "react";
import { FaCamera } from "react-icons/fa"; // Importando ícone de câmera

export function Perfil() {
  const [formData, setFormData] = useState({
    nome: "João Silva", // Nome fixo
    cpf: "123.456.789-00", // CPF fixo
    foto: "", // Foto a ser carregada
    endereco: "",
    cep: "",
    numero: "",
    complemento: "",
    telefone: "",
    tipoPessoa: "",
    funcao: "",
    dataNascimento: "",
    isWhatsApp: false,
  });

  // Atualizando a função para lidar com eventos de input e select
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined; // Type guard para acessar 'checked'

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

  return (
    <div className="max-w-[1500px] pt-10 m-auto">
      <div className="bg-white px-10 py-6 rounded-xl flex flex-col mb-5 lg:mb-8">
        <h3 className="font-bold text-3xl text-gray-800 mb-6">Perfil</h3>

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
          <div className="ml-6"> {/* Espaço aumentado entre imagem e informações */}
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
          <div className="flex space-x-2"> {/* Flexbox para manter na mesma linha */}
            <div className="w-full">
              <label className="block mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
            </div>

            <div className="w-full">
              <label className="block mb-1">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
                placeholder="(00) 0 0000-0000"
              />
            </div>

            <div className="flex flex-col justify-center"> {/* Alinhando o switch */}
              <label className="block mb-1">Receber WhatsApp:</label>
              <input
                type="checkbox"
                checked={formData.isWhatsApp}
                onChange={handleWhatsAppChange} // Chamando a nova função
                className="toggle-checkbox hidden"
              />
              <div
                onClick={handleWhatsAppChange} // Chamando a nova função
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
                <input
                  type="text"
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
                  name="tipoPessoa"
                  value={formData.tipoPessoa}
                  onChange={handleInputChange} // Usando a mesma função
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="">Selecione</option>
                  <option value="fisica">Física</option>
                  <option value="juridica">Jurídica</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block mb-1">Função</label>
                <input
                  type="text"
                  name="funcao"
                  value={formData.funcao}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Sua função"
                />
              </div>
            </div>

            <div className="w-full flex justify-end space-x-4">
              <button className="bg-gray-900 text-white rounded-md px-4 py-2">
                Voltar
              </button>
              <button className="bg-custom-bg-start text-white rounded-md px-4 py-2">
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
