import { useMutation } from "@apollo/client";
import { SetVendaUsuarioTypes } from "./Types";
import { SET_VENDA_SCHEMA } from "./Schema";

export function MutationSetVenda() {

  const [MutationBody, { error, loading, data: DataSetVenda }] =
    useMutation<SetVendaUsuarioTypes>(SET_VENDA_SCHEMA)


  async function FormSetVenda(data: any) {
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

  return {  FormSetVenda, loading, error, DataSetVenda }
}