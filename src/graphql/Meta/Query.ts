import { useMutation, useQuery } from "@apollo/client";
import { TypesGetMetasFields } from "./Types";
import { DELETE_META, GET_METAS } from "./Schema";
import Swal from "sweetalert2";

interface QueryProps {
  variables: any;
  skip?: boolean;
}

type DeleteMetaVariables = { metaId: number };
type DeleteMetaData = { DeleteMeta: boolean | number };

export function QueryGetMetas({ variables, skip }: QueryProps) {
  const { data, error, loading } = useQuery<TypesGetMetasFields>(GET_METAS, {
    variables, // Example variables
    skip,
  });

  return { data, error, loading };
}

export function useConfirmDeleteMeta() {
  const [deleteMeta] = useMutation<DeleteMetaData, DeleteMetaVariables>(
    DELETE_META,
    {
      errorPolicy: "all",
      awaitRefetchQueries: true,
    }
  );

  const confirmAndDelete = async (
    metaId: number,
    refetchVars?: { usuarioIds?: number[] }
  ) => {
    // 1) Confirmação (aqui pode usar await)
    const confirm = await Swal.fire({
      title: "Excluir meta?",
      text: "Se esta meta for comparilhada irá ser excluída para outros funcionarios..",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    });
    if (!confirm.isConfirmed)
      return { ok: false as const, cancelled: true as const };

    // 2) Loading (NÃO use await aqui!)
    Swal.fire({
      title: "Excluindo...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const resp = await deleteMeta({
        variables: { metaId },
        refetchQueries: refetchVars?.usuarioIds
          ? [
              {
                query: GET_METAS,
                variables: { usuarioIds: refetchVars.usuarioIds },
              },
            ]
          : [],
        awaitRefetchQueries: false,
      });

      await Swal.fire(
        "Excluída!",
        "A meta foi excluída com sucesso.",
        "success"
      );
      return { ok: true as const };
    } catch (err: any) {
      const msg =
        err?.graphQLErrors?.[0]?.message ||
        err?.networkError?.result?.errors?.[0]?.message ||
        err?.networkError?.message ||
        err?.message ||
        "Erro ao excluir a meta.";
      await Swal.fire("Erro", msg, "error");
      return { ok: false as const, error: msg };
    } finally {
      // garante que o modal de loading seja fechado se ainda estiver aberto
      Swal.close();
    }
  };

  return { confirmAndDelete };
}
