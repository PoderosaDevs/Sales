import { useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TypesSetMetaFields } from "./Types"
import { SET_META } from "./Schema"
import { SetMetaFieldsFormData, SetMetaFieldsFormInputs } from "./Validations"

export function MutationSetMeta() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SetMetaFieldsFormInputs>({
    resolver: zodResolver(SetMetaFieldsFormData),
  })

  const [MutationBody, { error, loading, data: DataSetMeta }] =
    useMutation<TypesSetMetaFields>(SET_META)


  async function FormSetMeta(data) {
    try {
      return await MutationBody({
        variables: {
          data: {
            data,
          },
        },
      });

    } catch (e) {
      console.error('Erro na requisição:', e.message);
      return e.message
    }
  }

  return { register, reset, handleSubmit, FormSetMeta, setValue, loading, errors, error, DataSetMeta, watch }
}