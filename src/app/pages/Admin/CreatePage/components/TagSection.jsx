import React, { useContext } from "react";
import CreateNewTag from "./NewTag";
import TagContext from "../../../../contexts/tag-context";
import _ from "lodash";

const TagSection = () => {
  const { existingTags, newTags } = useContext(TagContext);
  const categories = _.chain(existingTags).map("category").uniq().value();

  return (
    <div>
      <h5 className="category-name">Tags</h5>
      <div>
        <div className="tag-list">
          {newTags.map((tag = {}, idx) => (
            <CreateNewTag
              deleteButton={idx > 0 || newTags.length > 1}
              idx={idx}
              tag={tag}
              categories={categories}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSection;
