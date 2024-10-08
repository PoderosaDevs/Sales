import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { QueryGetMarcas } from '../../graphql/Marca/Query';

// Definindo o tipo de MarcaOption
type MarcaOption = {
  value: number; // value deve ser uma string
  label: string;
};

// Definindo o tipo das props
type SelectMarcasProps = {
  isMulti: boolean; // Garantindo que é único
  className?: string; // className é opcional
  setSelectedMarcas: React.Dispatch<React.SetStateAction<MarcaOption | null>>; // Atualizado para MarcaOption | null
};

const animatedComponents = makeAnimated();

const SelectMarcas: React.FC<SelectMarcasProps> = ({ isMulti, className, setSelectedMarcas }) => {
  const { data, loading, error } = QueryGetMarcas();

  // Exibindo um carregando enquanto as marcas são buscadas
  if (loading) return <div>Loading marcas...</div>;
  
  // Exibindo uma mensagem de erro caso a busca falhe
  if (error) return <div>Error loading marcas.</div>;

  // Mapeando os dados das marcas para o formato correto
  const options: MarcaOption[] = data?.GetMarcas.map((marca: any) => ({
    value: marca.id, // Certificando-se de que value é uma string
    label: marca.nome,
  })) || [];

  return (
    <Select
      closeMenuOnSelect={true} // Fechar o menu ao selecionar
      components={animatedComponents} // Usando animações
      isMulti={isMulti} // Definindo se é multi ou não
      options={options} // Passando as opções
      className={className} // Aplicando a classe recebida via props
      onChange={(selected) => {
        // O selected pode ser null ou a MarcaOption
        setSelectedMarcas(selected ? (selected as MarcaOption) : null); // Atualizando o estado com a seleção
      }}
    />
  );
};

export default SelectMarcas;
