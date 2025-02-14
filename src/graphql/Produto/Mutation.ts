import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client"; // Certifique-se de que a importação do useMutation esteja correta
import {
  formSchema,
  FormValues,
} from "./Validations"; // Certifique-se de que o schema está sendo importado corretamente
import { DELETE_PRODUTO_SCHEMA, GET_PRODUTO_SCHEMA, SET_PRODUTO_SCHEMA } from "./Schema";
import { TypesDeleteProdutosFields, TypesSetProdutosFields } from "./Types";

interface Props {
  variables: any
}


export function MutationSetProduto() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [setProdutoBody, { error, loading, data: DataSetProduto }] =
    useMutation<TypesSetProdutosFields>(SET_PRODUTO_SCHEMA, {
      refetchQueries: [GET_PRODUTO_SCHEMA],
    });

  const FormProduto = async (data: FormValues) => {
    await setProdutoBody({
      variables: {
        data,
      },
    });
    reset();
  };

  return {
    register,
    handleSubmit,
    FormProduto,
    loading,
    errors,
    reset,
    error,
    DataSetProduto,
    isSubmitting,
  };
}


export function MutationDeleteProduto() {
  const [deleteProduto, {loading, data, error}] = useMutation<TypesDeleteProdutosFields>(DELETE_PRODUTO_SCHEMA, {
    refetchQueries: [GET_PRODUTO_SCHEMA],
  })

  async function HandleDeleteProduto({variables}: Props) {
    try {
      const result = await deleteProduto({
        variables: {...variables},
        refetchQueries: [GET_PRODUTO_SCHEMA],
      })
      return result
    } catch (e) {
      if (e) {
        return false
      }
    }
  }

  return {HandleDeleteProduto, loading, error, data}
}