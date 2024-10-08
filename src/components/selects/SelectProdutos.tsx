import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { QueryGetProdutos } from '../../graphql/Produto/Query';

const animatedComponents = makeAnimated();

const SelectProdutos = ({ isMulti }) => {
  const paginacao = { pagina: 1, quantidade: 10 };
  const { data, loading, error } = QueryGetProdutos({
    variables: {
      pagination: {
        pagina: paginacao.pagina,
        quantidade: paginacao.quantidade,
      },
      tipoSistema: "SALES",
    },
  });

  if (loading) return <div>Loading produtos...</div>;
  if (error) return <div>Error loading produtos.</div>;

  return (
    <Select
      closeMenuOnSelect={!isMulti}
      components={animatedComponents}
      isMulti={isMulti}
      options={data?.GetProdutos.result} // Ajuste conforme a estrutura dos dados
    />
  );
};

export default SelectProdutos;
