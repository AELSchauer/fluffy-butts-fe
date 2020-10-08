import React, { useContext } from "react";
import CreateNewTag from "./NewTag";
import TagContext from "../../../../../contexts/tag-context";
import _ from "lodash";

const TagSection = () => {
  const { existingTags, newTags, addNewTag } = useContext(TagContext);
  const categories = _.chain(existingTags).map("category").uniq().value();

  return (
    <div className="category-section">
      <div className="category-heading">
        <h3 className="category-name">Tags</h3>
        <span className="add-new-tag" onClick={addNewTag}>
          <i className="fas fa-plus" />
          <span>Add Tag</span>
        </span>
      </div>
      <ul className="tag-list">
        {newTags.map((tag = {}, idx) => (
          <CreateNewTag key={idx} tag={tag} categories={categories} />
        ))}
      </ul>
    </div>
  );
};

export default TagSection;
