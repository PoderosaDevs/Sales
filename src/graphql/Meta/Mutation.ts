import { useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TypesSetMetaFields } from "./Types"
import { SET_META } from "./Schema"
import { SetMetaFieldsFormData, SetMetaFieldsFormInputs } from "./Validations"

export function MutationSetMeta() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SetMetaFieldsFormInputs>({
    resolver: zodResolver(SetMetaFieldsFormData),
  });

  const [MutationBody, { error, loading, data: DataSetMeta }] = useMutation<TypesSetMetaFields>(SET_META);

  // Função para processar os dados do formulário e fazer a chamada à mutation
  async function FormSetMeta(formData: SetMetaFieldsFormInputs) {
    try {
      // Aqui mapeamos os dados para os parâmetros da mutation
      const {
        etapas,              // Passa as etapas diretamente
        quantidade_total,      // Passa o valor de pontosObjetivo
        data_fim,
        data_inicio,
        situacao,
        usuario_id,                // Passa o nome da meta
        descricao,           // Passa a descrição
        marca_id,            // Passa a marcaId
      } = formData;

      // Verifica se a variável etapas é uma array e, caso contrário, transforma em array vazio
      const etapasValidadas = Array.isArray(etapas) ? etapas : [];

      // Chama a mutation com os dados processados
      return await MutationBody({
        variables: {
          etapas: etapasValidadas.map((etapa) => ({
            importancia: etapa.importancia ?? null, // Se não tiver valor, coloca null
            quantidade: etapa.quantidade ?? null,   // Se não tiver valor, coloca null
            recompensa: etapa.recompensa ?? null,   // Se não tiver valor, coloca null
            valor: etapa.valor ?? null,             // Se não tiver valor, coloca null
            etapa_numero: etapa.etapa_numero ?? null, // Se não tiver valor, coloca null
          })),
          quantidade_total: quantidade_total ?? null,  // Se não tiver valor, passa null
          usuario_id: usuario_id ?? null,            // Se não tiver valor, passa null
          descricao: descricao ?? null,            // Se não tiver valor, passa null
          marcaId: marca_id ?? null,               // Se não tiver valor, passa null
        },
      });
    } catch (e) {
      console.error('Erro na requisição:', e.message);
      return e.message;
    }
  }

  return {
    register,
    reset,
    handleSubmit,
    FormSetMeta, // Passa a função ajustada
    setValue,
    loading,
    errors,
    error,
    DataSetMeta,
    watch,
  };
}
