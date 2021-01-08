import React, { useContext, useState } from "react";
import CreateTagging from "../Tagging";
import PatternContext from "../../../../../../contexts/pattern-context";
import TagContext from "../../../../../../contexts/tag-context";
import _ from "lodash";

const CreatePattern = ({ pattern = {} }) => {
  const [taggings, setTaggings] = useState([]);
  const { changePattern: onChange, removePattern: onRemove } = useContext(
    PatternContext
  );

  const addTagging = () => {
    setTaggings(taggings.concat({ id: `tmp-${Date.now()}` }));
  };

  const changeTagging = (tagging) => {
    const idx = _.findIndex(taggings, { id: tagging.id });
    const newTaggings = [...taggings.slice(0, idx), tagging, ...taggings.slice(idx + 1)];
    setTaggings(newTaggings);
    onChange({ ...pattern, taggings: newTaggings });
  };

  const removeTagging = (tagging) => {
    const idx = _.findIndex(taggings, { id: tagging.id });
    const newTaggings = [...taggings.slice(0, idx), ...taggings.slice(idx + 1)];
    setTaggings(newTaggings.length ? newTaggings : []);
    onChange({ ...pattern, taggings: newTaggings });
  };

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
        <label>ID</label>
        <input type="text" value={pattern.id} disabled />
        <label>Name</label>
        <input
          type="text"
          value={pattern.name}
          onChange={(e) => onChange({ ...pattern, name: e.target.value })}
        />
        <i className="fas fa-minus" onClick={() => onRemove(pattern)} />
      </div>
      <div className="collapse" id={`collapse-pattern-${pattern.id}`}>
        <div>
          <label>Tags</label>
          <TagContext.Consumer>
            {({ existingTags, newTags }) =>
              taggings.map((tagging, idx) => (
                <CreateTagging
                  referenceTags={[...existingTags, ...newTags].filter(
                    ({ category = "" }) => !!~category.indexOf("PATTERN__")
                  )}
                  key={idx}
                  onChange={changeTagging}
                  onRemove={removeTagging}
                  tagging={tagging}
                />
              ))
            }
          </TagContext.Consumer>
        </div>
        <div className="row add-tagging" onClick={addTagging}>
          <i className="fas fa-plus" />
          <span>Add Tagging</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePattern;
