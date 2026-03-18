import React, { useState, useEffect } from "react";
import Select, { StylesConfig } from "react-select";
import { QueryGetMarcas } from "../../../graphql/Marca/Query";

interface MarcaOption {
  value: number;
  label: string;
}

interface MarcasSelectProps {
  onChange: (id: number) => void;
}

export default function MarcasSelect({ onChange }: MarcasSelectProps) {
  const { data, loading } = QueryGetMarcas();
  const [marcaOptions, setMarcaOptions] = useState<MarcaOption[]>([]);

  useEffect(() => {
    if (data?.GetMarcas) {
      setMarcaOptions(
        data.GetMarcas.map((marca) => ({
          value: marca.id,
          label: marca.nome,
        }))
      );
    }
  }, [data]);

  const handleChange = (selectedOption: MarcaOption | null) => {
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  // Configuração de Estilos Dark para o React Select
  const customStyles: StylesConfig<MarcaOption, false> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#0a0a0c",
      borderColor: state.isFocused ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.1)",
      borderRadius: "1rem",
      padding: "0.4rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "rgba(16, 185, 129, 0.4)",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#0d0d10",
      borderRadius: "1rem",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "0.5rem",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "#10b981" 
        : state.isFocused 
        ? "rgba(16, 185, 129, 0.1)" 
        : "transparent",
      color: state.isSelected ? "#000" : "#94a3b8",
      borderRadius: "0.5rem",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: state.isSelected ? "bold" : "normal",
      "&:active": {
        backgroundColor: "#10b981",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
      fontSize: "0.875rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#4b5563",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
  };

  return (
    <Select
      styles={customStyles}
      placeholder="Pesquisar fabricante..."
      options={marcaOptions}
      isDisabled={loading}
      isLoading={loading}
      onChange={handleChange}
      noOptionsMessage={() => "Nenhuma marca encontrada"}
      loadingMessage={() => "Buscando marcas..."}
    />
  );
}