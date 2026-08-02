import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Loja, Paginated } from "../types";

export interface LojaRankingItem {
  id: number;
  nome_fantasia: string;
  total_vendas: number;
}

export function useLojasRanking(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["lojas-ranking", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get<Paginated<LojaRankingItem>>("/lojas/ranking", {
        params: { startDate, endDate, quantidade: 100 },
      });
      return data.result;
    },
  });
}

export function useLojas(quantidade = 100) {
  return useQuery({
    queryKey: ["lojas", quantidade],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Loja>>("/lojas", { params: { quantidade } });
      return data.result;
    },
  });
}

export function useLoja(id?: number) {
  return useQuery({
    queryKey: ["loja", id],
    queryFn: async () => {
      const { data } = await api.get<Loja>(`/lojas/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useLojaInsights(id?: number, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["loja-insights", id, startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get(`/lojas/${id}/insights`, { params: { startDate, endDate } });
      return data.result;
    },
    enabled: !!id,
  });
}

export function useCreateLoja() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { nome_fantasia: string; razao_social: string }) => {
      const { data } = await api.post<Loja>("/lojas", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lojas"] }),
  });
}

export function useUpdateLoja() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: number; nome_fantasia?: string; razao_social?: string }) => {
      const { data } = await api.put<Loja>(`/lojas/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lojas"] }),
  });
}

export function useDeleteLoja() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/lojas/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lojas"] }),
  });
}
