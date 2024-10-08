import React from "react";
import { Link } from "react-router-dom";
import { MutationLogin } from "../../graphql/Usuario/Mutation";
import {
  BounceLoader
} from "react-spinners";

function LoginComponent() {
  const { FormLogin, errors, handleSubmit, register, loading, DataLogin } =
    MutationLogin();

  console.log(errors);

  const onSubmit = async (data: any) => {
    try {
      const result = await FormLogin(data);
      console.log(result)
      if (result.data.Login) {
        if (DataLogin) {
          localStorage.setItem("token", DataLogin.Login.token_api);
          window.location.reload();
        }
      }
    } catch (error) {
      let errorMessage = "Houve um erro ao salvar os dados do usuario.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      console.log(errorMessage);
    }
    console.log(data);
  };

  return (
    <div className="bg-white max-w-[450px] rounded-lg mx-auto px-10 py-14 shadow-md w-full">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <img
          src="https://media.graphassets.com/rCIs5vtxQPueHiCYLZDL"
          className="max-w-60 m-auto"
          alt=""
        />
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block font-bold text-xl text-gray-700 tracking-wide mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 bg-[#f5f5f5] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 123."
            {...register("email")}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="flex justify-between items-center font-bold text-xl text-gray-700 tracking-wide mb-2"
          >
            Senha{" "}
            <Link
              to="/forgot-password"
              className="text-blue-500 text-sm hover:underline"
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
          className="w-full outline-none bg-custom-gradient text-xl font-semibold tracking-wide text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? <BounceLoader
            color="#ffffff" size={36} /> : "Entrar"}
        </button>
        <span className="block text-center font-semibold mt-7 text-gray-600  text-md">
          Novo Aqui?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-bold hover:underline"
          >
            Criar uma Conta
          </Link>
        </span>
      </form>
    </div>
  );
}

export default LoginComponent;
