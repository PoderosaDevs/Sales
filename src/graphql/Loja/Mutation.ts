import { useMutation } from "@apollo/client";
import { TypesDeleteLojaFields, TypesSetLojaFields } from "./Types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DELETE_LOJA, GET_LOJAS, SET_LOJA } from "./Schema";
import { SetLojaFieldsFormData, SetLojaFieldsFormInputs } from "./Validations";

export function MutationSetLoja() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<SetLojaFieldsFormInputs>({
    resolver: zodResolver(SetLojaFieldsFormData),
  })

  const [MutationBody, { error, loading, data: DataSetMeta }] =
    useMutation<TypesSetLojaFields>(SET_LOJA, {
      refetchQueries: [GET_LOJAS],
    })

  async function FormSetLoja(data) {
    try {
      return await MutationBody({
        variables: {
          data,
        },
      });

    } catch (e) {
      console.error('Erro na requisição:', e.message);
      return e.message
    }
  }

  return { register, isSubmitting, reset, handleSubmit, FormSetLoja, setValue, loading, errors, error, DataSetMeta, watch }
}

export function MutationDeleteLoja() {
  const [deleteLoja, { loading, data, error }] = useMutation<TypesDeleteLojaFields>(DELETE_LOJA, {
    refetchQueries: [GET_LOJAS],
  })

  async function HandleDeleteLoja(deleteLojaId: number) {
    try {
      const result = await deleteLoja({
        variables: { deleteLojaId },
        refetchQueries: [GET_LOJAS],
      })
      return result
    } catch (e) {
      if (e) {
        return false
      }
    }
  }

  return { HandleDeleteLoja, loading, error, data }
}