import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Marca, Paginated, RankingItem } from "../types";

export function useMarcas() {
  return useQuery({
    queryKey: ["marcas"],
    queryFn: async () => {
      const { data } = await api.get<Marca[]>("/marcas");
      return data;
    },
  });
}

export function useMarca(id?: number) {
  return useQuery({
    queryKey: ["marca", id],
    queryFn: async () => {
      const { data } = await api.get<Marca>(`/marcas/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useMarcasRanking(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["marcas-ranking", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get<Paginated<RankingItem & { total_vendas: number }>>("/marcas/ranking", {
        params: { startDate, endDate, quantidade: 100 },
      });
      return data.result;
    },
  });
}

export function useMarcaInsights(id?: number, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["marca-insights", id, startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get(`/marcas/${id}/insights`, { params: { startDate, endDate } });
      return data.result;
    },
    enabled: !!id,
  });
}

export function useCreateMarca() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { nome: string; cor: string }) => {
      const { data } = await api.post<Marca>("/marcas", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["marcas"] }),
  });
}

export function useUpdateMarca() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, nome, cor }: { id: number; nome: string; cor: string }) => {
      const { data } = await api.put<Marca>(`/marcas/${id}`, { nome, cor });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["marcas"] }),
  });
}

export function useDeleteMarca() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/marcas/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["marcas"] }),
  });
}

export function useAssociarProdutosMarca() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, produtoIds }: { id: number; produtoIds: number[] }) => {
      const { data } = await api.post(`/marcas/${id}/produtos`, { produtoIds });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marcas"] });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
