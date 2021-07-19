import _ from "lodash";
import React, { useContext } from "react";
import AddButton from "../AddButton";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Tag from "./Tag";
import traverse from "traverse"

const TagSection = ({ path }) => {
  const { dynamicState, dispatch, onChange } = useContext(
    DiaperMutationContext
  );
  const tags = _.get(dynamicState, path) || [];

  return (
    <div className="category-section">
      <CollapsibleSection
        id={"tag-section"}
        label={<h5 className="category-name">Tags</h5>}
      >
        <div className="tag-list">
          {!!tags.length
            ? tags.map((tag, idx) => (
                <Tag
                  key={idx}
                  path={[...path, `${idx}`]}
                />
              ))
            : ""}
        </div>
        <AddButton
          className="tag"
          defaultObj={{ id: `tmp${Date.now()}`, name: "", mutation: true }}
          path={path}
        />
      </CollapsibleSection>
    </div>
  );
};

export default TagSection;
