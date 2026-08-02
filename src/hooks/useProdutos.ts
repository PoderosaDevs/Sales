import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Categoria, Paginated, Produto } from "../types";

interface ProdutoFiltros {
  nome?: string;
  marca?: string;
  pontos_min?: number;
  pontos_max?: number;
  pagina?: number;
  quantidade?: number;
}

export function useProdutos(filtros: ProdutoFiltros = {}) {
  return useQuery({
    queryKey: ["produtos", filtros],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Produto>>("/produtos", { params: filtros });
      return data;
    },
  });
}

export function useProduto(id?: number) {
  return useQuery({
    queryKey: ["produto", id],
    queryFn: async () => {
      const { data } = await api.get<Produto>(`/produtos/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

interface ProdutoInput {
  codigo: string;
  nome: string;
  descricao?: string;
  id_marca?: number;
  preco?: number;
  pontos?: number;
  situacao: boolean;
  imagem?: string;
  categorias?: { nome: string }[];
}

export function useCreateProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProdutoInput) => {
      const { data } = await api.post<Produto>("/produtos", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produtos"] }),
  });
}

export function useUpdateProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<ProdutoInput> & { id: number }) => {
      const { data } = await api.put<Produto>(`/produtos/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produtos"] }),
  });
}

export function useDeleteProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/produtos/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["produtos"] }),
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data } = await api.get<Categoria[]>("/categorias");
      return data;
    },
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nome: string) => {
      const { data } = await api.post<Categoria>("/categorias", { nome });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categorias/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });
}
