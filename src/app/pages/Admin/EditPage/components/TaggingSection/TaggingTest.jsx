import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../Input";
import RemoveButton from "../RemoveButton/RemoveButton";

const Tagging = ({ onRemove, path }) => {
  const { rootData } = useContext(DiaperMutationContext);
  const tagging = _.get(rootData, path);

  return (
    <div className="tagging col-12 info-display">
      <i className="fas fa-caret-right" />
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input disabled fieldName="name" path={path} />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>Are you sure you want to remove this tag?</h5>
            <p>ID: {tagging.id}</p>
            <p>Name: {tagging.name}</p>
          </span>
        </RemoveButton>
        {JSON.stringify(tagging)}
      </div>
  );
};

export default Tagging;
