import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { GroupBase, OptionsOrGroups } from "react-select";
import ReactSelect from "react-select/creatable";
import type { SelectOption } from "./Select";

type Props = {
  options: OptionsOrGroups<unknown, GroupBase<unknown>>;
  placeholder?: string;
  value?: SelectOption | null;
  setValue?: Dispatch<SetStateAction<SelectOption | null>>;
};

export default function Creatable({
  options,
  placeholder,
  value,
  setValue,
}: Props) {
  const [inputValue, setInputValue] = useState<SelectOption | null>(null);

  const handleChange = (v: SelectOption) => {
    setInputValue(v);
    if (setValue) {
      setValue(v);
    }
  };

  useEffect(() => {
    setInputValue(value || null);
  }, [value]);

  return (
    <div className="mb-10">
      <ReactSelect
        isClearable
        value={inputValue}
        onChange={(v) => handleChange(v as SelectOption)}
        options={options}
        placeholder={placeholder || "Select..."}
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: "transparent",
            borderColor: state.isFocused ? "#f5f5f5" : "#737373",
            borderWidth: "1px",
            borderRadius: "0.5rem",
            height: "2.5rem",
            boxShadow: "none",
            ":hover": {
              borderColor: state.isFocused ? "#f5f5f5" : "#737373",
            },
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#171717",
            borderRadius: "0.5rem",
            boxShadow: "0 0 0 1px #737373",
            color: "#f5f5f5",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? "rgb(64 64 64 / 0.1)"
              : "#171717",
            color: state.isFocused ? "#f5f5f5" : "#737373",
            ":hover": {
              backgroundColor: "rgb(64 64 64 / 0.1)",
              color: "#f5f5f5",
            },
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isFocused ? "#f5f5f5" : "#737373",
          }),
          indicatorSeparator: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#f5f5f5" : "#737373",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "#f5f5f5",
            fontFamily: "monospace",
          }),
          valueContainer: (provided) => ({
            ...provided,
            ":focus": {
              outline: "none",
              borderColor: "#737373",
            },
          }),
          input: (provided) => ({
            ...provided,
            fontFamily: "monospace",
            color: "#f5f5f5",
          }),
          placeholder: (provided) => ({
            ...provided,
            fontFamily: "monospace",
            color: "#737373",
          }),
        }}
      />
    </div>
  );
}
