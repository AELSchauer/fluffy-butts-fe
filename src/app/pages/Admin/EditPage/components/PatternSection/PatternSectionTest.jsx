import _ from "lodash";
import React, { useContext } from "react";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Pattern from "./Pattern";
import traverse from "traverse";

const PatternSection = ({ path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);

  const onAdd = () => {
    onChange(
      path,
      (_.get(rootData, path) || []).concat([
        { id: `tmp-${Date.now()}`, mutation: true },
      ])
    );
  };

  const onRemove = ({ id }, idx) => {
    (id.indexOf("tmp-") > -1
      ? Promise.resolve()
      : axios({
          method: "POST",
          url: "/",
          data: {
            query: `
              mutation {
                DeletePattern(id: "${id}") {
                  id
                }
              }
            `,
          },
        })
    ).then(() => {
      const patterns = _.get(rootData, path);
      onChange(path, [...patterns.slice(0, idx), ...patterns.slice(idx + 1)]);
      // TO DO
      // Update any objects that have pattern_id w/ traverse
    });
  };

  return (
    <div className="category-section">
      <CollapsibleSection
        id={"pattern-section"}
        label={<h5 className="category-name">Patterns</h5>}
      >
        <div className="pattern-list">
          {!!_.get(rootData, path)
            ? (_.get(rootData, path) || []).map((pattern, idx) => (
                <Pattern
                  key={idx}
                  path={[...path, `${idx}`]}
                  onRemove={() => onRemove(pattern, idx)}
                />
              ))
            : ""}
          <span
            className="add-pattern"
            onClick={onAdd}
            onKeyPress={(e) => {
              e.key === "Enter" && onAdd();
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
