import React, { useContext } from "react";
import CreatePattern from "./Pattern";
import PatternContext from "../../../../../../contexts/pattern-context";

const PatternSection = () => {
  const { patterns, addPattern } = useContext(PatternContext);

  return (
    <div className="category-section">
      <div className="category-heading">
        <h5 className="category-name">Patterns</h5>
        <span
          className="add-pattern"
          onClick={addPattern}
          onKeyPress={(e) => {
            e.key === "Enter" && addPattern();
          }}
          tabIndex="0"
        >
          <i className="fas fa-plus" />
          <span>Add Pattern</span>
        </span>
      </div>
      <div className="pattern-list">
        {patterns.map((pattern, idx) => (
          <CreatePattern key={idx} pattern={pattern} />
        ))}
      </div>
    </div>
  );
};

export default PatternSection;
