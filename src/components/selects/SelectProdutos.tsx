import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { QueryGetProdutos } from '../../graphql/Produto/Query';

const animatedComponents = makeAnimated();

type ProdutoOption = { value: number; label: string };

interface SelectProdutosProps {
  isMulti?: boolean;
  className?: string; // Adicionando prop className
  onChange?: (selected: ProdutoOption[] | ProdutoOption | null) => void;
}

const SelectProdutos: React.FC<SelectProdutosProps> = ({
  isMulti = false,
  className = "", // Prop padrão para className
  onChange,
}) => {
  const [produtos, setProdutos] = useState<ProdutoOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ProdutoOption | null>(null);

  const paginacao = { pagina: 0, quantidade: 10 };
  const { data, loading, error } = QueryGetProdutos({
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
      const fetchedProdutos = data.GetProdutos.result.map((produto: any) => ({
        value: produto.id, // Ajuste para o campo correto que representa o ID do produto
        label: produto.nome, // Ajuste para o campo correto que representa o nome do produto
      }));
      setProdutos(fetchedProdutos);
    }
  }, [data]);

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      maxHeight: 200, // Altura máxima para o menu
      overflowY: 'auto', // Permitir rolagem no menu
    }),
    control: (provided: any) => ({
      ...provided,
      minHeight: 35, // Altura mínima do controle do Select
    }),
  };

  if (loading) return <div>Loading produtos...</div>;
  if (error) return <div>Error loading produtos.</div>;

  return (
    <Select
      className={className} // Aplicando a prop className
      components={animatedComponents}
      closeMenuOnSelect={!isMulti}
      isMulti={isMulti}
      options={produtos}
      value={selectedOption}
      onChange={handleChange}
      isLoading={loading}
      placeholder="Selecione os produtos"
      styles={customStyles} // Aplica os estilos personalizados
    />
  );
};

export default SelectProdutos;
