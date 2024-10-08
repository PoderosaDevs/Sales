export interface LoginFieldsTypes {
  Login: {
    id: number
    email: string
    nome: string
    uuid: string
    token_api: string
    telefone: string
    cpf: string
    tipo_pessoa: string
    tipos_sistemas: string[]
  }
}

export interface SetUsuarioFieldsTypes {
  SetUsuario: {
    id: number
  }
}

export interface GetFuncionarioFieldsTypes {
  GetUsuarios: {
    id: string
    email: string
    telefone: string
    cep: string
    endereco: string
    numero: string
    complemento: string
    cpf: string
    cnpj: string
    data_nascimento: string
    nome: string
    funcao: string
    usuario_foto: string
  }[]
}