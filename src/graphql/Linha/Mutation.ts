import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SetLinhaFieldsFormData, SetLinhaFieldsFormInputs } from "./Validations";
import { SET_LINHA } from "./Schema";
import { TypesSetLinhaFields } from "./Types";

export function MutationSetMeta() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<SetLinhaFieldsFormInputs>({
    resolver: zodResolver(SetLinhaFieldsFormData),
  })

  const [MutationBody, { error, loading, data: DataSetMeta }] =
    useMutation<TypesSetLinhaFields>(SET_LINHA)


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

  return { register, isSubmitting, reset, handleSubmit, FormSetMeta, setValue, loading, errors, error, DataSetMeta, watch }
}