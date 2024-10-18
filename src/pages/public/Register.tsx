import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MutationSetUsuario } from "../../graphql/Usuario/Mutation";
import PasswordFields from "./partials/PasswordsFields";
import Swal from "sweetalert2";

function Register() {
  const { register, FormSetUsuario, loading, handleSubmit, errors } = MutationSetUsuario();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) {
    Swal.fire("Enviando Informações...", "");
    Swal.showLoading();
  }


  const onSubmit = async (data: any) => {
    try {
      const result = await FormSetUsuario(data);
      console.log(result);

      // Verifica se o result tem um networkError ou response status 400
      if (result?.networkError?.response?.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Ocorreu um erro, tente novamente mais tarde.',
        });
        return; // Para a execução em caso de erro
      }

      // Verifica se há erros no result
      if (result?.errors && result.errors.length > 0) {
        let errorMessage = result.errors[0]?.message || 'Erro desconhecido.';

        // Verifica se o erro está relacionado ao email já cadastrado
        if (result.errors[0]?.message === 'Email já cadastrado no sistema!') {
          errorMessage = 'Esse email já está cadastrado. Tente outro.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: errorMessage,
        });
        return; // Para a execução em caso de erro
      }

      // Se não houver erros, exibe o Swal de sucesso
      Swal.fire({
        icon: 'success',
        title: 'Conta criada com sucesso!',
        text: 'Você pode agora fazer login.',
      }).then(() => {
        navigate("/");
      });


    } catch (error: any) {
      console.error(error);

      // Captura os erros de requisição HTTP
      let errorMessage = 'Houve um erro ao salvar os dados do usuário.';

      // Verifica se o erro tem uma resposta HTTP válida
      if (error?.response) {
        errorMessage = `Erro: ${error.response.status} - ${error.response.statusText}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: errorMessage,
      });
    }
  };

  return (
    <div className={`bg-white ${isMobile ? 'w-[80%] px-5 py-3' : 'max-w-[500px] px-14 py-6'} rounded-lg mx-auto shadow-md w-full`}>
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
            onKeyPress={(event) => {
              const regex = /^[A-Za-z\s]+$/; // Permite letras maiúsculas, minúsculas e espaços
              if (!regex.test(event.key)) {
                event.preventDefault(); // Impede a entrada de caracteres inválidos
              }
            }}
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
            type="text"
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

        <PasswordFields errors={errors} register={register} />

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
