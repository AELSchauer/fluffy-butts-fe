import React, { useState } from "react";
import TagContext from "../../../../../contexts/tag-context";
import Tagging from "./TaggingTest"

const TaggingSection = (props) => {

  const onRemove = ({ id }, idx) => {
    console.log("onRemove TaggingSection")
    // (id.indexOf("tmp-") > -1
    //   ? Promise.resolve()
    //   : axios({
    //       method: "POST",
    //       url: "/",
    //       data: {
    //         query: `
    //         mutation {
    //           DeletePattern(id: "${id}") {
    //             id
    //           }
    //         }
    //       `,
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
    <TagContext.Consumer>
      {({ existingTags, newTags }) =>
        !!_.get(rootData, path)
          ? (_.get(rootData, path) || []).map((tagging, idx) => (
              <Tagging
                referenceTags={[...existingTags, ...newTags].filter(
                  ({ category = "" }) => !!~category.indexOf("PRODUCT__")
                )}
                key={idx}
                onChange={changeTagging}
                onRemove={removeTagging}
                tagging={tagging}
              />
            ))
          : ""
      }
    </TagContext.Consumer>
  );
};

export default TaggingSection;
