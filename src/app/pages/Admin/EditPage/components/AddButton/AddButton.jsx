import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { toTitleCase } from "../../../../../utils/case-helper";

const AddButton = ({ className, path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);

  const onAdd = () => {
    onChange(
      path,
      (_.get(rootData, path) || []).concat([
        { id: `tmp-${Date.now()}`, mutation: true },
      ])
    );
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
