import React from "react";
import { toTitleCase } from "../../../../../utils/case-helper";
import _ from "lodash";

const CreatePattern = ({
  onChange,
  onRemove,
  referenceTags,
  tagging = {},
}) => {
  const sortedReferenceTags = _.sortBy(referenceTags, ["category", "name"]);
  return (
    <div className="tagging col-12 info-display">
      <i className="fas fa-caret-right" />
      <label>ID</label>
      <input type="text" value={tagging.id} disabled />
      <label>Taggings</label>
      <select
        value={tagging.id || ""}
        onChange={(e) => onChange({ ...tagging, tag_id: e.target.value })}
      >
        <option value="">Select your option</option>
        {sortedReferenceTags.map(({ id, name = "", category = "" }, idx) => {
          const categoryName = toTitleCase(
            category.replace(/[A-Z]*__/, "").replace(/_/g, " ")
          ).replace(/AND/i, "&");
          return (
            <option key={idx} value={id}>{`${categoryName} -- ${name}`}</option>
          );
        })}
      </select>
      <i
        className="fas fa-minus"
        onClick={() => onRemove(tagging)}
        onKeyPress={(e) => {
          e.key === "Enter" && onRemove(tagging);
        }}
        tabIndex="0"
      />
    </div>
  );
};

export default CreatePattern;
