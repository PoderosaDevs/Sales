import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Linha, Paginated } from "../types";

export function useLinhas(quantidade = 100) {
  return useQuery({
    queryKey: ["linhas", quantidade],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Linha>>("/linhas", { params: { quantidade } });
      return data.result;
    },
  });
}

export function useCreateLinha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { nome: string; marcaId: number; produtosIds?: number[] }) => {
      const { data } = await api.post<Linha>("/linhas", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["linhas"] }),
  });
}

export function useUpdateLinha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, nome }: { id: number; nome: string }) => {
      const { data } = await api.put<Linha>(`/linhas/${id}`, { nome });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["linhas"] }),
  });
}

export function useDeleteLinha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/linhas/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["linhas"] }),
  });
}
