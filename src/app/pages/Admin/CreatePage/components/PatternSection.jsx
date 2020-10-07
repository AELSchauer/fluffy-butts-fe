import React, { useContext } from "react";
import CreatePattern from "./Pattern";
import PatternContext from "../../../../contexts/pattern-context";

const PatternSection = ({ patternTags = [] }) => {
  const { patterns, addPattern } = useContext(PatternContext);

  return (
    <div>
      <h5 className="category-name">Patterns</h5>
      <div>
        <div className="pattern-list">
          {patterns.map((pattern, idx) => (
            <CreatePattern
              deleteButton={idx > 0 || patterns.length > 1}
              idx={idx}
              pattern={pattern}
            />
          ))}
        </div>
        <div
          className="row add-pattern"
          onClick={addPattern}
        >
          <i className="fas fa-plus" />
          <span>Add Pattern</span>
        </div>
      </div>
    </div>
  );
};

export default PatternSection;
