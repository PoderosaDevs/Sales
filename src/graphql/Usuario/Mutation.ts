import { useMutation } from "@apollo/client"
import { LoginFieldsFormData, LoginFieldsFormSchema, SetUsuarioFieldsFormData, SetUsuarioFieldsFormSchema } from "./Validations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFieldsTypes, SetUsuarioFieldsTypes } from "./Types"
import { CREATE_USUARIO_SCHEMA, LOGIN_SCHEMA } from "./Schema"

export function MutationLogin() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFieldsFormData>({
    resolver: zodResolver(LoginFieldsFormSchema),
  })

  const [LoginBody, { error, loading, data: DataLogin }] =
    useMutation<LoginFieldsTypes>(LOGIN_SCHEMA)


  async function FormLogin(data: LoginFieldsFormData, path?: [string]) {
    try {
      return await LoginBody({
        variables: {
          usuario: { ...data },
        },
      });

    } catch (e) {
      console.error('Erro na requisição:', e.message);
      return e.message
    }
  }

  return { register, handleSubmit, FormLogin, setValue, loading, errors, error, DataLogin, watch }
}

export function MutationSetUsuario() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SetUsuarioFieldsFormData>({
    resolver: zodResolver(SetUsuarioFieldsFormSchema),
  })

  const [MutationBody, { error, loading, data: DataSetUsuario }] =
    useMutation<SetUsuarioFieldsTypes>(CREATE_USUARIO_SCHEMA)


  async function FormSetUsuario(data) {
    try {
      return await MutationBody({
        variables: {
            data,
        },
      });
      

    } catch (e) {
      console.error('Erro na requisição:', e);
      console.error('Erro na requisição:', e);
      console.error('Erro na requisição:', e.name);

      return e
    }
  }

  return { register, handleSubmit, FormSetUsuario, setValue, loading, errors, error, DataSetUsuario, watch }
}