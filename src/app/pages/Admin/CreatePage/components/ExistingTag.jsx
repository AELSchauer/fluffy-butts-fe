import React from "react";
import { toTitleCase } from "../../../../utils/case-helper";

const CreatePattern = ({
  deleteButton,
  idx,
  onChange,
  onRemove,
  tag = {},
  referenceTags = [],
}) => {
  return (
    <div className="row">
      <select
        className="col-4"
        value={JSON.stringify({ id: tag.id, name: tag.name })}
        onChange={(e) => onChange(e.target.value, idx)}
      >
        <option value={JSON.stringify({})} selected>
          Select your option
        </option>{" "}
        {referenceTags.map(({ id = "NEW", name, category }, idx) => {
          const categoryName = toTitleCase(
            category.replace("PATTERN__", "").replace(/_/g, " ")
          ).replace(/AND/i, "&");
          return (
            <option
              value={JSON.stringify({ id, name })}
            >{`${categoryName} -- ${name}`}</option>
          );
        })}
      </select>
      {deleteButton ? (
        <i className="fas fa-minus" onClick={() => onRemove(idx)} />
      ) : (
        ""
      )}
    </div>
  );
};

export default CreatePattern;
