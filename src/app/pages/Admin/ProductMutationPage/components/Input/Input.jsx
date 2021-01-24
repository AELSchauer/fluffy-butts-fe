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
  const value =
    typeof fieldName === "string"
      ? _.get(rootData, [...path, fieldName])
      : _.get(rootData, [...path, ...fieldName]);

  const onInputChange = (e) => {
    if (typeof fieldName === "string") {
      onChange(path, {
        ..._.get(rootData, path),
        [fieldName]: e.target.value,
        mutation: true,
      });
    }
    // else if (fieldName.length === 2) {
    //   const data = _.get(rootData, path);
    //   onChange(
    //     Object.assign(data, {
    //       ...data,
    //       [fieldName[0]]: {
    //         ...data[fieldName[0]],
    //         [fieldName[1]]: e.target.value,
    //       },
    //       mutation: true,
    //     })
    //   );
    // }
  };

  return (
    <span>
      <label>{title || toTitleCase(fieldName)}</label>
      <input
        disabled={disabled}
        onChange={disabled ? undefined : onChangeOverride || onInputChange}
        type="text"
        value={value}
      />
    </span>
  );
};

export default Input;
