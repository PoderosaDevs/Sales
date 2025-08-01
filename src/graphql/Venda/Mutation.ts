import { useMutation } from "@apollo/client";
import { DeleteVendaTypes, SetVendaUsuarioTypes } from "./Types";
import {
  DELETE_VENDA,
  GET_VENDA_BY_USUARIO_ID,
  SET_VENDA_SCHEMA,
} from "./Schema";

export function MutationSetVenda() {
  const [MutationBody, { error, loading, data: DataSetVenda }] =
    useMutation<SetVendaUsuarioTypes>(SET_VENDA_SCHEMA);

  async function FormSetVenda(data: any) {
    try {
      return await MutationBody({
        variables: {
          data,
        },
      });
    } catch (e) {
      console.error("Erro na requisição:", e);
      console.error("Erro na requisição:", e);
      console.error("Erro na requisição:", e.name);

      return e;
    }
  }

  return { FormSetVenda, loading, error, DataSetVenda };
}

export function MutationDeleteVenda(usuarioId: number) {
  const [MutationBody, { error, loading, data: DataSetRecovery }] =
    useMutation<DeleteVendaTypes>(DELETE_VENDA);

  async function FormDeleteVenda(id: number) {
    try {
      return await MutationBody({
        variables: {
          deleteVendaId: id,
        },
        refetchQueries: [
          {
            query: GET_VENDA_BY_USUARIO_ID,
            variables: {
              getVendaByUsuarioIdId: usuarioId,
            },
          },
        ],
        awaitRefetchQueries: true,
      });
    } catch (e) {
      console.error("Erro na requisição:", e);
      return e;
    }
  }

  return {
    FormDeleteVenda,
    loading,
    error,
    DataSetRecovery,
  };
}
