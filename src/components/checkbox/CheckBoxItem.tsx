import { FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface CheckboxOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

interface Props {
  options: string[] | CheckboxOption[];
  value: any[];
  handleChange: (value: string[]) => void;
}

const CheckBoxItem = ({ options, value, handleChange }: Props) => {
  const [values, setValues] = useState<string[]>([]);

  const itemsFiltered = useMemo(() => {
    return options;
  }, [options]);

  const handleChangeCheck = (e: any) => {
    //buscar repetidos
    const findRepeat = values.find((mod) => mod === e.target.name);
    //si encuentra repetido
    if (findRepeat) {
      //filtra y lo quita del array
      const kickModule = values.filter((mod) => mod !== findRepeat);
      setValues(kickModule);
      handleChange(kickModule);
      return;
    }
    //si no encuentra, lo agrega
    setValues([...values, e.target.name]);

    handleChange([...values, e.target.name]);
  };

  useEffect(() => {
    setValues(value);
  }, [value]);

  return (
    <>
      {itemsFiltered.map((item: any, i) => {
        return (
          <FormControlLabel
            key={typeof item === "string" ? i + item : item.value}
            control={
              <Checkbox
                onChange={handleChangeCheck}
                name={typeof item === "string" ? item : item.value}
                checked={
                  typeof item === "string"
                    ? values.some((value) => value === item)
                    : values.some((value) => value === item.value)
                }
                disabled={typeof item === "string" ? false : item.disabled}
              />
            }
            label={typeof item === "string" ? item : item.label}
          />
        );
      })}
    </>
  );
};

export default CheckBoxItem;
