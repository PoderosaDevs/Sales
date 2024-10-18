import { useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TypesSetMarcaFields } from "./Types"
import { SET_META } from "./Schema"
import { SetMarcaFieldsFormData, SetMarcaFieldsFormInputs } from "./Validations"
import { z } from "zod"


const SetMarca = z.object({
  nome: z.string({
    required_error: 'O campo "nome" é obrigatório.',
    invalid_type_error: 'O campo "nome" deve ser um texto.',
  }).nonempty('O nome da marca não pode estar vazio.'),
});
export type SetMarcaType = z.infer<typeof SetMarca>;

export function MutationSetMeta() {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<SetMarcaType>({
    resolver: zodResolver(SetMarca),
  })

  const [MutationBody, { error, loading, data: DataSetMarca }] =
    useMutation<TypesSetMarcaFields>(SET_META)


  async function FormSetMarca(data) {
    console.log(data)
    try {
      return await MutationBody({
        variables: {
            nome: data,
        },
      });

    } catch (e) {
      console.error('Erro na requisição:', e.message);
      return e.message
    }
  }

  return { isSubmitting,register, reset, handleSubmit, FormSetMarca, setValue, loading, errors, error, DataSetMarca, watch }
}