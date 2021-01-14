import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../Input";
import RemoveButton from "../RemoveButton/RemoveButton";
import { toTitleCase } from "../../../../../utils/case-helper";

const Tagging = ({ parentClassName, path, onRemove }) => {
  const { rootData } = useContext(DiaperMutationContext);
  const tagging = _.get(rootData, path);

  return (
    <div className="tagging col-12 info-display">
      <i className="fas fa-caret-right" />
      <Input disabled fieldName="id" path={path} title="ID" />
      <Input
        disabled
        fieldName={["tag", "name"]}
        path={path}
        title="Tag Name"
      />
      <RemoveButton onRemove={onRemove}>
        <span>
          <h5>
            Are you sure you want to remove this Tag from this{" "}
            {toTitleCase(parentClassName)}?
          </h5>
          <p>ID: {tagging.id}</p>
          <p>Name: {tagging.tag.name}</p>
        </span>
      </RemoveButton>
    </div>
  );
};

export default Tagging;
