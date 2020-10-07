import React from "react";
import { toTitleCase } from "../../../../utils/case-helper";

const CreatePattern = ({
  deleteButton,
  idx,
  onChange,
  onRemove,
  tag = {},
  categories = [],
}) => {
  return (
    <div className="row">
      <label className="col-2">Name</label>
      <input
        className="col-4"
        type="text"
        value={tag.name}
        onChange={(e) =>
          onChange(JSON.stringify({ ...tag, name: e.target.value }), idx)
        }
      />

      <label className="col-2">Category</label>
      <select
        className="col-4"
        value={tag.category}
        onChange={(e) =>
          onChange(JSON.stringify({ ...tag, category: e.target.value }), idx)
        }
      >
        <option value={""} disabled selected>
          Select your option
        </option>{" "}
        {categories.map((category, idx) => {
          const categoryName = toTitleCase(
            category.replace("PATTERN__", "").replace(/_/g, " ")
          ).replace(/AND/i, "&");
          return <option value={category}>{categoryName}</option>;
        })}
        <option value="TBD">TBD</option>
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
