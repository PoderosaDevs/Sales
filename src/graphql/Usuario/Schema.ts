import { gql } from "@apollo/client";

export const LOGIN_SCHEMA = gql`
mutation Login($usuario: AutenticacaoInput!) {
  Login(usuario: $usuario) {
    id
    email
    nome
    uuid
    token_api
    telefone
    cpf
    tipo_pessoa
  }
}
`

export const CREATE_USUARIO_SCHEMA = gql`
mutation SetUsuario($data: UsuarioInput!) {
  SetUsuario(data: $data) {
    id
  }
}
`

export const GET_FUNCIONARIO_SCHEMA = gql`
query GetUsuarios($tipoSistema: String, $tipoPessoa: String) {
  GetUsuarios(Tipo_Sistema: $tipoSistema, Tipo_Pessoa: $tipoPessoa) {
    id
    email
    telefone
    cep
    endereco
    numero
    complemento
    cpf
    cnpj
    data_nascimento
    nome
    funcao
    usuario_foto
  }
}
`