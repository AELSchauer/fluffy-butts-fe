import React, { useState } from "react";
import CreateExistingTag from "./ExistingTag";
import _ from "lodash";

const CreatePattern = ({
  deleteButton,
  idx,
  onChange,
  onRemove,
  pattern = {},
  allTags = [],
}) => {
  const [tags, setTags] = useState([{}]);

  const changeTag = (tagJson, tagIdx) => {
    const tag = JSON.parse(tagJson);
    console.log("changeTag", tag, tagIdx);
    const newTags = [...tags.slice(0, tagIdx), tag, ...tags.slice(tagIdx + 1)];
    setTags(newTags);
    onChange({ ...pattern, tags: newTags }, idx);
  };

  const removeTag = (tagIdx) => {
    console.log("removeTag", tagIdx, removedTag);
    const removedTag = tags[tagIdx];
    const newTags = [...tags.slice(0, tagIdx), ...tags.slice(tagIdx + 1)];
    setTags(newTags.length ? newTags : [{}]);
  };

  return (
    <React.Fragment>
      <div className="pattern row">
        <div
          data-toggle="collapse"
          data-target={`#collapse-pattern-${idx}`}
          aria-expanded="false"
          aria-controls={`collapse-pattern-${idx}`}
        >
          <i className="fas fa-caret-right" />
          <label>Name</label>
        </div>
        <input
          className="col-4"
          type="text"
          value={pattern.name}
          onChange={(e) => onChange({ ...pattern, name: e.target.value }, idx)}
        />
      </div>
      <div className="collapse" id={`collapse-pattern-${idx}`}>
        <div>
          <label>Tags</label>
          {tags.map((tag, idx) => (
            <CreateExistingTag
              allTags={allTags}
              idx={idx}
              onChange={changeTag}
              onRemove={removeTag}
              tag={tag}
              deleteButton={true}
            />
          ))}
        </div>
        <div
          className="row add-existing-tag"
          onClick={() => setTags(tags.concat({}))}
        >
          <i className="fas fa-plus" />
          <span>Add Tag</span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreatePattern;
