import React, { useContext } from "react";
// import CreateTag from "./Tag";
import TagContext from "../../../../contexts/tag-context";

const TagSection = () => {
  const { tags } = useContext(TagContext);

  return (
    <div>
      woot woot
      {/* <h5 className="category-name">Tags</h5>
      <div>
        <div className="tag-list">
          {tags.map((tag, idx) => (
            <CreateTag
              deleteButton={idx > 0 || tags.length > 1}
              idx={idx}
              tag={tag}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default TagSection;
