import React, { useState, useEffect } from "react";
import Select from "react-select";
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

  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      placeholder="Selecione uma marca..."
      options={marcaOptions}
      isDisabled={loading}
      isLoading={loading}
      onChange={handleChange}
    />
  );
}
