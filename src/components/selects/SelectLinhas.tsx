import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { QueryGetLinhas } from '../../graphql/Linha/Query';

// Definindo o tipo das props
type SelectLinhasProps = {
  isMulti: boolean;
  className?: string; // className é opcional
};

const animatedComponents = makeAnimated();

const SelectLinhas: React.FC<SelectLinhasProps> = ({ isMulti, className }) => {
  const { data, loading, error } = QueryGetLinhas();

  if (loading) return <div>Loading linhas...</div>;
  if (error) return <div>Error loading linhas.</div>;

  const options = data?.GetLinhas.map((linha: any) => ({
    value: linha.id,
    label: linha.nome,
  }));

  return (
    <Select
      closeMenuOnSelect={!isMulti}
      components={animatedComponents}
      isMulti={isMulti}
      options={options} // Mapeando dados das linhas para o formato correto
      className={className} // Aplicando a classe recebida via props
    />
  );
};

export default SelectLinhas;
