import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Venda } from "../types";

export function useVendasByUsuario(usuarioId?: number, dataMensal?: string) {
  return useQuery({
    queryKey: ["vendas-usuario", usuarioId, dataMensal],
    queryFn: async () => {
      const { data } = await api.get<Venda[]>(`/vendas/usuario/${usuarioId}`, {
        params: { data_mensal: dataMensal },
      });
      return data;
    },
    enabled: !!usuarioId,
  });
}

export function useVendas(startDate?: string, endDate?: string, funcionarioId?: number, lojaId?: number) {
  return useQuery({
    queryKey: ["vendas", startDate, endDate, funcionarioId, lojaId],
    queryFn: async () => {
      const { data } = await api.get<Venda[]>("/vendas", { params: { startDate, endDate, funcionarioId, lojaId } });
      return data;
    },
  });
}

interface CreateVendaInput {
  funcionarioId: number;
  lojaId: number;
  data_venda: string;
  vendaDetalhes: { produtoId: number; quantidade: number }[];
}

export function useCreateVenda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateVendaInput) => {
      const { data } = await api.post<Venda>("/vendas", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas-usuario"] });
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["ranking-usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuario-insights"] });
    },
  });
}

export function useDeleteVenda() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/vendas/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendas"] }),
  });
}
