import _ from "lodash";
import React, { useContext } from "react";
import AddButton from "../AddButton";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Tag from "./Tag";
import traverse from "traverse";

const TagSection = ({ path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);
  const tags = _.get(rootData, path) || [];
  const categories = _.chain(tags)
    .filter(({ id }) => id.indexOf("tmp-") === -1)
    .map("category")
    .uniq()
    .concat("PATTERN__TBD", "PRODUCT__TBD")
    .sort()
    .value();

  const onRemove = ({ id }, idx) => {
    console.log("remove TagSection");
    // (id.indexOf("tmp-") > -1
    //   ? Promise.resolve()
    //   : axios({
    //       method: "POST",
    //       url: "/",
    //       data: {
    //         query: `
    //           mutation {
    //             DeletePattern(id: "${id}") {
    //               id
    //             }
    //           }
    //         `,
    //       },
    //     })
    // ).then(() => {
    //   const patterns = _.get(rootData, path);
    //   onChange(path, [...patterns.slice(0, idx), ...patterns.slice(idx + 1)]);
    //   // TO DO
    //   // Update any objects that have pattern_id w/ traverse
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
                  categories={categories}
                  key={idx}
                  path={[...path, `${idx}`]}
                  onRemove={() => onRemove(tag, idx)}
                />
              ))
            : ""}
        </div>
        <AddButton className="tag" path={path} />
      </CollapsibleSection>
    </div>
  );
};

export default TagSection;
