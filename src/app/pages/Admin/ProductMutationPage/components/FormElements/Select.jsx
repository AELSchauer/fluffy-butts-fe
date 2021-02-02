import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { toTitleCase } from "../../../../../utils/case-helper";

const Select = ({
  fieldName,
  optionList,
  path,
  required,
  setParent,
  title,
  value: valueOverride,
}) => {
  const { state, dispatch } = useContext(DiaperMutationContext);
  const parent = _.get(state, path);

  const onSelectChange = (e) => {
    setParent({ ..._.set(parent, fieldName, e.target.value), mutation: true });
    dispatch({
      type: "UPDATE",
      fieldName,
      path,
      value: e.target.value,
    });
  };

  return (
    <span>
      <label>{title || toTitleCase(fieldName)}</label>
      <select
        defaultValue=""
        onChange={onSelectChange}
        required={required}
        value={valueOverride || _.get(parent, fieldName)}
      >
        <option value="">
          Select your option
        </option>
        {optionList.map(({ disabled = false, text, value }, idx) => (
          <option key={idx} value={value} disabled={disabled}>
            {text || value}
          </option>
        ))}
      </select>
    </span>
  );
};

export default Select;
