import React from "react";
import { Link } from "react-router-dom";
import { MutationSetUsuario } from "../../graphql/Usuario/Mutation";
import PasswordFields from "./partials/PasswordsFields";
import Swal from "sweetalert2";
import { z } from "zod";

// Definição do esquema de validação com Zod
const SetUsuarioFieldsFormSchema = z.object({
  nome: z.string().nonempty("Por favor, preencha seu nome completo."),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos."),
  email: z.string().email("Por favor, insira um email válido."),
  telefone: z.string().nonempty("O telefone deve seguir o formato esperado."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

function Register() {
  const { register, FormSetUsuario, loading, handleSubmit, errors } = MutationSetUsuario();
  console.log(errors)
  const onSubmit = async (data: any) => {
    try {
      const result = await FormSetUsuario(data);
      Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Você pode agora fazer login.',
      });
    } catch (error) {
      let errorMessage = 'Houve um erro ao salvar os dados do usuário.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="bg-white max-w-[500px] rounded-lg mx-auto px-14 py-6 shadow-md w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl text-center font-bold my-6 text-gray-800">
          Criar Conta
        </h1>
        
        <div className="mb-4">
          <label htmlFor="name" className="block font-bold text-xl text-gray-700 tracking-wide mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            className={`w-full px-3 py-2 bg-[#f5f5f5] border ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Seu nome completo"
            {...register("nome")}
          />
          {errors.nome && <span className="text-red-500 text-sm">{errors.nome.message}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-bold text-xl text-gray-700 tracking-wide mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-3 py-2 bg-[#f5f5f5] border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ex: usuario@poderosa"
            {...register("email")}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block font-bold text-xl text-gray-700 tracking-wide mb-2">
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            className={`w-full px-3 py-2 bg-[#f5f5f5] border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ex: (11) 98765-4321"
            {...register("telefone")}
          />
          {errors.telefone && <span className="text-red-500 text-sm">{errors.telefone.message}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="cpf" className="block font-bold text-xl text-gray-700 tracking-wide mb-2">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            className={`w-full px-3 py-2 bg-[#f5f5f5] border ${errors.cpf ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ex: 000.000.000-00"
            {...register("cpf")}
          />
          {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf.message}</span>}
        </div>

        <PasswordFields errors={errors} register={{...register}} />

        <button
          type="submit"
          className="w-full bg-custom-gradient text-xl font-semibold tracking-wide text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Criar Conta
        </button>

        <span className="block text-center font-semibold mt-5 text-gray-600 text-md">
          Já tem uma conta?{" "}
          <Link to="/" className="text-blue-500 font-bold hover:underline">
            Fazer Login
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Register;
