import _ from "lodash";
import React, { useContext, useState } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../FormElements/Input";
import RemoveButton from "../RemoveButton/RemoveButton";
import TaggingSection from "../TaggingSection";

const Pattern = ({ onRemove, path }) => {
  const { state } = useContext(DiaperMutationContext);
  const [pattern, setPattern] = useState(_.get(state, path));

  return (
    <div className="pattern">
      <div className="col-12 info-display">
        <span
          className="info-toggle"
          data-toggle="collapse"
          data-target={`#collapse-pattern-${pattern.id}`}
          aria-expanded="false"
          aria-controls={`collapse-pattern-${pattern.id}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} onChange={setPattern} />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>Are you sure you want to remove this pattern?</h5>
            <p>ID: {pattern.id}</p>
            <p>Name: {pattern.name}</p>
          </span>
        </RemoveButton>
      </div>
      <ul className="collapse" id={`collapse-pattern-${pattern.id}`}>
        <li>
          <TaggingSection
            parentClassName="pattern"
            path={[...path, "taggings"]}
            taggableId={pattern.id}
          />
        </li>
      </ul>
    </div>
  );
};

export default Pattern;
