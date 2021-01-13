import _ from "lodash";
import React, { useContext, useState } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../Input";
import RemoveButton from "../RemoveButton/RemoveButton";

const Pattern = ({ onRemove, path }) => {
  const { rootData } = useContext(DiaperMutationContext);
  const pattern = _.get(rootData, path);

  return (
    <div>
      <div className="pattern col-12 info-display">
        <span
          className="info-toggle"
          data-toggle="collapse"
          data-target={`#collapse-pattern-${pattern.id}`}
          aria-expanded="false"
          aria-controls={`collapse-pattern-${pattern.id}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <Input disabled fieldName="id" path={path} title="ID" set />
        <Input fieldName="name" path={path} />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>Are you sure you want to remove this pattern?</h5>
            <p>ID: {pattern.id}</p>
            <p>Name: {pattern.name}</p>
          </span>
        </RemoveButton>
      </div>
    </div>
  );
};

export default Pattern;
