import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { toTitleCase } from "../../../../../utils/case-helper";

const Select = ({ fieldName, onChange, optionList, path, title }) => {
  const { state, dispatch } = useContext(DiaperMutationContext);
  const parent = _.get(state, path);

  const onSelectChange = (e) => {
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
      <select
        defaultValue=""
        onChange={onSelectChange}
        required
        value={_.get(parent, fieldName)}
      >
        <option value="" disabled>
          Select your option
        </option>
        {optionList.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
    </span>
  );
};

export default Select;
