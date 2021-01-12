import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { toTitleCase } from "../../../../../utils/case-helper";

const Input = ({
  disabled = false,
  fieldName,
  onChange: onChangeOverride,
  path,
  title,
}) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);

  const onInputChange = (e) => {
    onChange(
      Object.assign(_.get(rootData, path), {
        [fieldName]: e.target.value,
        mutation: true,
      })
    );
  };

  return (
    <span>
      <label>{title || toTitleCase(fieldName)}</label>
      <input
        disabled={disabled}
        onChange={disabled ? undefined : onChangeOverride || onInputChange}
        type="text"
        value={_.get(rootData, [...path, fieldName])}
      />
    </span>
  );
};

export default Input;
