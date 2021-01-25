import _ from "lodash";
import React, { useContext } from "react";
import AddButton from "../AddButton";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Tag from "./Tag";

const TagSection = ({ path }) => {
  const { dynamicState, dispatch, onChange } = useContext(
    DiaperMutationContext
  );
  const tags = _.get(dynamicState, path) || [];

  const onRemove = ({ id }, idx) => {
    console.log("remove TagSection");
    // (id.indexOf("tmp") > -1
    //   ? Promise.resolve()
    //   : axios({
    //       method: "POST",
    //       url: "/",
    //       data: {
    //         query: `
    //             mutation {
    //               DeleteTag(id: "${id}") {
    //                 id
    //               }
    //             }
    //           `,
    //       },
    //     })
    // ).then(() => {
    //   onChange(path, [...tags.slice(0, idx), ...tags.slice(idx + 1)]);
    //   dispatch({ type: "REMOVE", path, idx, list: tags });
    //   // TO DO
    //   // dispatch({ type: "REMOVE_TRAVERSE", fieldName: "tag_id" });
    // });
  };

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
                  onRemove={() => onRemove(tag, idx)}
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
