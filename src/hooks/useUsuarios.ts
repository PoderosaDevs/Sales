import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Paginated, RankingItem, TipoPessoa, Usuario, UsuarioInsights } from "../types";

export function useUsuarios(tipo_pessoa?: TipoPessoa) {
  return useQuery({
    queryKey: ["usuarios", tipo_pessoa],
    queryFn: async () => {
      const { data } = await api.get<Usuario[]>("/usuarios", { params: { tipo_pessoa } });
      return data;
    },
  });
}

export function useUsuario(id?: number) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: async () => {
      const { data } = await api.get<Usuario>(`/usuarios/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUsuarioInsights(id?: number, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["usuario-insights", id, startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get<{ result: UsuarioInsights }>(`/usuarios/${id}/insights`, {
        params: { startDate, endDate },
      });
      return data.result;
    },
    enabled: !!id,
  });
}

export interface TimelinePonto {
  data: string;
  categories: { title: string; value: number }[];
}

export function useTimeline(targetId?: number, type: "USER" | "STORE" | "BRAND" = "USER", startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["timeline", targetId, type, startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get<TimelinePonto[]>("/usuarios/timeline", {
        params: { targetId, type, startDate, endDate },
      });
      return data;
    },
    enabled: !!targetId,
  });
}

export function useRankingUsuarios(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["ranking-usuarios", startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get<Paginated<RankingItem>>("/usuarios/ranking", {
        params: { startDate, endDate, quantidade: 100 },
      });
      return data.result;
    },
  });
}

interface CreateUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  funcao?: string;
  cpf?: string;
  tipo_pessoa: TipoPessoa;
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateUsuarioInput) => {
      const { data } = await api.post<Usuario>("/usuarios", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateUsuarioInput> & { id: number }) => {
      const { data } = await api.put<Usuario>(`/usuarios/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/usuarios/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useRecoverySenha() {
  return useMutation({
    mutationFn: async ({ id, senha }: { id: number; senha: string }) => {
      const { data } = await api.post(`/usuarios/${id}/recovery-senha`, { senha });
      return data;
    },
  });
}

interface UpdateOwnProfileInput {
  id: number;
  data_nascimento?: string;
  usuario_foto?: string;
  tema?: string;
  complemento?: string;
}

export function useUpdateOwnProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateOwnProfileInput) => {
      const { data } = await api.put<Usuario>(`/usuarios/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

export function useChangeOwnPassword() {
  return useMutation({
    mutationFn: async ({ id, senhaAtual, novaSenha }: { id: number; senhaAtual: string; novaSenha: string }) => {
      const { data } = await api.post(`/usuarios/${id}/senha`, { senhaAtual, novaSenha });
      return data;
    },
  });
}
