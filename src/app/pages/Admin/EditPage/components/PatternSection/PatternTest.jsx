import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../Input";
import RemoveButton from "../RemoveButton/RemoveButton";

const Pattern = ({ path, onRemove }) => {
  const { rootData } = useContext(DiaperMutationContext);

  return (
    <div>
      <div className="pattern col-12 info-display">
        <span
          className="info-toggle"
          data-toggle="collapse"
          data-target={`#collapse-pattern-${_.get(rootData, [...path, "id"])}`}
          aria-expanded="false"
          aria-controls={`collapse-pattern-${_.get(rootData, [...path, "id"])}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>Are you sure you want to remove this pattern?</h5>
            <p>ID: {_.get(rootData, [...path, "id"])}</p>
          </span>
        </RemoveButton>
      </div>
    </div>
  );
};

export default Pattern;
