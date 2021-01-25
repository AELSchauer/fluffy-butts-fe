import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { toTitleCase } from "../../../../../utils/case-helper";

const AddButton = ({
  className,
  defaultObj = { id: `tmp${Date.now()}`, mutation: true },
  path,
}) => {
  const { dynamicState, dispatch, onChange } = useContext(
    DiaperMutationContext
  );

  const onAdd = () => {
    dispatch({ type: "CREATE", path, data: defaultObj });
    onChange(path, _.get(dynamicState, path, []).concat([defaultObj]));
  };

  return (
    <span
      className={`add-${className}`}
      onClick={onAdd}
      onKeyPress={(e) => {
        e.key === "Enter" && onAdd();
      }}
      tabIndex="0"
    >
      <i className="fas fa-plus" />
      <span>Add {toTitleCase(className)}</span>
    </span>
  );
};

export default AddButton;
