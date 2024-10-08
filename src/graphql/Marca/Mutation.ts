import { useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TypesSetMarcaFields } from "./Types"
import { SET_META } from "./Schema"
import { SetMarcaFieldsFormData, SetMarcaFieldsFormInputs } from "./Validations"

export function MutationSetMeta() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<SetMarcaFieldsFormInputs>({
    resolver: zodResolver(SetMarcaFieldsFormData),
  })

  const [MutationBody, { error, loading, data: DataSetMarca }] =
    useMutation<TypesSetMarcaFields>(SET_META)


  async function FormSetMarca(data) {
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

  return { isSubmitting,register, reset, handleSubmit, FormSetMarca, setValue, loading, errors, error, DataSetMarca, watch }
}