import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Meta } from "../types";

export function useMetasByUsuario(usuarioId?: number, dataInicio?: string, dataFim?: string) {
  return useQuery({
    queryKey: ["metas", usuarioId, dataInicio, dataFim],
    queryFn: async () => {
      const { data } = await api.get<Meta[]>("/metas", {
        params: { usuarioId, data_inicio: dataInicio, data_fim: dataFim },
      });
      return data;
    },
    enabled: !!usuarioId,
  });
}

export function useMetasTodas() {
  return useQuery({
    queryKey: ["metas-todas"],
    queryFn: async () => {
      const { data } = await api.get<Meta[]>("/metas");
      return data;
    },
  });
}

export function useMeta(id?: number) {
  return useQuery({
    queryKey: ["meta", id],
    queryFn: async () => {
      const { data } = await api.get<Meta>(`/metas/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

interface CreateMetaInput {
  nome: string;
  marcaId: number;
  quantidade_objetivo: number;
  data_inicio: string;
  data_fim: string;
  usuarioIds: number[];
  descricao?: string;
  etapas?: { nome: string; quantidade_objetivo: number }[];
}

export function useCreateMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMetaInput) => {
      const { data } = await api.post<Meta>("/metas", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metas"] }),
  });
}

export function useDeleteMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/metas/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metas"] }),
  });
}
