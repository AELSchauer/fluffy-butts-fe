import React, { useContext } from "react";
import CollapsibleSection from "../CollapsibleSection";
import CreatePattern from "./Pattern";
import PatternContext from "../../../../../contexts/pattern-context";

const PatternSection = () => {
  const { patterns, addPattern } = useContext(PatternContext);

  return (
    <div className="category-section">
      <CollapsibleSection
        id={"pattern-section"}
        label={<h5 className="category-name">Patterns</h5>}
      >
        <div className="pattern-list">
          {patterns.map((pattern, idx) => (
            <CreatePattern key={idx} pattern={pattern} />
          ))}
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
      </CollapsibleSection>
    </div>
  );
};

export default PatternSection;
