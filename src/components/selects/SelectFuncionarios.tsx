import React, { useEffect, useState } from "react";
import Select, { OnChangeValue } from "react-select";
import { QueryGetFuncionarios } from "../../graphql/Usuario/Query";

type UsuarioOption = { value: number; label: string };

interface SelectFuncionariosProps {
  isMulti?: boolean;
  className?: string;
  // Sempre retorna array
  onChange?: (selected: UsuarioOption[]) => void;
}

const SelectFuncionarios: React.FC<SelectFuncionariosProps> = ({
  isMulti = false,
  className = "",
  onChange,
}) => {
  const [funcionarios, setFuncionarios] = useState<UsuarioOption[]>([]);

  const { data, loading, error } = QueryGetFuncionarios({
    variables: {
      pagination: { pagina: 0, quantidade: 10 },
      tipoSistema: "SALES",
    },
  });

  useEffect(() => {
    if (data) {
      const fetched = data.GetUsuarios.map((f: any) => ({
        value: f.id,
        label: f.nome,
      }));
      setFuncionarios([
        { value: 0, label: "Todos os Funcionários" },
        ...fetched,
      ]);
    }
  }, [data]);

  const handleChange = (
    selected: OnChangeValue<UsuarioOption, boolean>
  ) => {
    // Normaliza pra sempre ser array
    const normalized = Array.isArray(selected)
      ? selected
      : selected
      ? [selected]
      : [];
    onChange?.(normalized);
  };

  return (
    <Select<UsuarioOption, boolean>
      className={className}
      isMulti={isMulti}
      options={funcionarios}
      onChange={handleChange}
      isLoading={loading}
      placeholder="Selecione os funcionários"
      isClearable
      closeMenuOnSelect={!isMulti}
      getOptionValue={(opt) => String(opt.value)}
    />
  );
};

export default SelectFuncionarios;
