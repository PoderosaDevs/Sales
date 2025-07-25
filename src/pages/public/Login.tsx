import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MutationLogin } from "../../graphql/Usuario/Mutation";
import { BounceLoader } from "react-spinners";
import Swal from "sweetalert2";

function LoginComponent() {
  const { FormLogin, errors, handleSubmit, register, loading, DataLogin } =
    MutationLogin();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);

  useEffect(() => {
    // Function to handle window resize and update state
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const result = await FormLogin(data);
      if (result.data?.Login) {
        localStorage.setItem("token", result.data.Login.token_api);
        window.location.replace("/"); // Redireciona imediatamente após o login
      } else {
        throw new Error("Login inválido");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Usuário ou senha incorretos.";
      Swal.fire({
        icon: "error",
        title: "Erro no Login",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Tentar novamente",
      });
    }
  };

  return (
    <div
      className={
        `bg-white ${
          isMobile ? "w-[100%] px-5 py-7" : "w-[450px] px-16 py-14"
        } rounded-lg mx-auto shadow-md w-full` + "sm:w-4/5"
      }
    >
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block font-bold text-md text-gray-700 tracking-wide mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 bg-[#f5f5f5] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite seu email"
            {...register("email")}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="flex justify-between items-center font-bold text-md text-gray-700 tracking-wide mb-2"
          >
            Senha
            <Link
              to="/forgot-password"
              className="text-indigo-600 text-sm hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite sua senha"
            {...register("senha")}
          />
        </div>
        <button
          type="submit"
          className="w-full outline-none bg-indigo-600 text-xl font-semibold tracking-wide text-white py-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? <BounceLoader color="#ffffff" size={24} /> : "Entrar"}
        </button>
        <span className="block text-center font-semibold mt-7 text-gray-600 text-md">
          Novo aqui?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-bold hover:underline"
          >
            Criar uma Conta
          </Link>
        </span>
      </form>
    </div>
  );
}

export default LoginComponent;
