import React, { useEffect, useState } from "react";
import Select from "react-select";
import { QueryGetFuncionarios } from "../../graphql/Usuario/Query";

type UsuarioOption = { value: number; label: string };

interface SelectFuncionariosProps {
  isMulti?: boolean;
  className?: string; // Adicionando prop className
  onChange?: (selected: UsuarioOption[] | UsuarioOption | null) => void;
}

const SelectFuncionarios: React.FC<SelectFuncionariosProps> = ({
  isMulti = false,
  className = "", // Prop padrão para className
  onChange,
}) => {
  const [funcionarios, setFuncionarios] = useState<UsuarioOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<UsuarioOption | null>(
    null
  );

  const [paginacao, setPaginacao] = useState({ pagina: 0, quantidade: 10 });
  const { data, loading, error } = QueryGetFuncionarios({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
      tipoSistema: 'SALES',
    },
  });
  useEffect(() => {
    if (data) {
      const fetchedFuncionarios = data.GetUsuarios.map((funcionario: any) => ({
        value: funcionario.id,
        label: funcionario.nome,
      }));
      setFuncionarios([{ value: 0, label: "Todos os Funcionarios" }, ...fetchedFuncionarios]);
    }
  }, [data]);

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  return (
    <Select
      className={className} // Aplicando a prop className
      isMulti={isMulti}
      options={funcionarios}
      value={selectedOption}
      onChange={handleChange}
      isLoading={loading}
      placeholder="Selecione os funcionários"
    />
  );
};

export default SelectFuncionarios;
