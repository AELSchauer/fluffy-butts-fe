import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { toTitleCase } from "../../../../../utils/case-helper";

const Input = ({ disabled = false, fieldName, onChange, path, title }) => {
  const { state, dispatch } = useContext(DiaperMutationContext);
  const parent = _.get(state, path);

  const onInputChange = (e) => {
    onChange({ ..._.set(parent, fieldName, e.target.value), mutation: true });
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
      <input
        disabled={disabled}
        onChange={disabled ? undefined : onInputChange}
        type="text"
        value={_.get(parent, fieldName)}
      />
    </span>
  );
};

export default Input;
