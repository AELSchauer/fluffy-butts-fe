import _ from "lodash";
import React, { useContext } from "react";
import AddButton from "../AddButton";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Pattern from "./Pattern";

const PatternSection = ({ path }) => {
  const { dynamicState, dispatch, onChange } = useContext(
    DiaperMutationContext
  );
  const patterns = _.get(dynamicState, path, []);

  const onRemove = ({ id }, idx) => {
    (id.indexOf("tmp") > -1
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
      dispatch({ type: "REMOVE", path, idx, list: patterns });
      dispatch({ type: "REMOVE_TRAVERSE", fieldName: "patternId", value: id });
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
        <AddButton
          className="pattern"
          defaultObj={{ id: `tmp${Date.now()}`, name: "", mutation: true }}
          path={path}
        />
      </CollapsibleSection>
    </div>
  );
};

export default PatternSection;
