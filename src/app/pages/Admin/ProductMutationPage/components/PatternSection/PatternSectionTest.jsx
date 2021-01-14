import _ from "lodash";
import React, { useContext } from "react";
import AddButton from "../AddButton";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Pattern from "./PatternTest";
import traverse from "traverse";

const PatternSection = ({ path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);
  const patterns = _.get(rootData, path) || [];

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
          {!!patterns
            ? patterns.map((pattern, idx) => (
                <Pattern
                  key={idx}
                  path={[...path, `${idx}`]}
                  onRemove={() => onRemove(pattern, idx)}
                />
              ))
            : ""}
        </div>
        <AddButton className="pattern" path={path} />
      </CollapsibleSection>
    </div>
  );
};

export default PatternSection;
