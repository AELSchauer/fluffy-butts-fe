import _ from "lodash";
import React, { useContext, useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import CreateTagging from "../BrandSection/Tagging";
import PatternContext from "../../../../../contexts/pattern-context";
import TagContext from "../../../../../contexts/tag-context";
import RemoveButton from "../RemoveButton/RemoveButton";

const Pattern = ({ path, pattern = {}, onRemove }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);

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
        <label>ID</label>
        <input type="text" value={_.get(rootData, [...path, "id"])} disabled />
        <label>Name</label>
        <input
          type="text"
          value={_.get(rootData, [...path, "name"])}
          onChange={(e) =>
            onChange(
              Object.assign(_.get(rootData, path), {
                name: e.target.value,
                mutation: true,
              })
            )
          }
        />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>Are you sure you want to remove this pattern?</h5>
            <p>ID: {_.get(rootData, [...path, "id"])}</p>
            <p>Name: {_.get(rootData, [path, "name"])}</p>
          </span>
        </RemoveButton>
      </div>
    </div>
  );
};

export default Pattern;
