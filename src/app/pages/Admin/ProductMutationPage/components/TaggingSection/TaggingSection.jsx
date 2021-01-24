import _ from "lodash";
import React, { useContext, useState } from "react";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Tagging from "./Tagging";
import {
  toPascalCase,
  toUpperSnakeCase,
} from "../../../../../utils/case-helper";

const TaggingSection = ({ path, taggableId }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);
  const [newTag, setNewTag] = useState({ id: "" });

  const parentClassName = _.nth(path, -3).slice(0, -1);
  const sectionIndex = _.nth(path, -2);
  const taggings = _.get(rootData, path) || [];
  const tagSelection = _.get(rootData, "tags")
    .filter(
      ({ category = "" }) =>
        category.indexOf(toUpperSnakeCase(parentClassName)) === 0
    )
    .map((tag) => ({
      ...tag,
      disabled: taggings.map(({ tag: { id } }) => id).includes(tag.id),
    }));

  const onAdd = () => {
    const queryParams = [
      `tag_id: "${newTag.id}"`,
      `taggable_type: "${toPascalCase(parentClassName)}"`,
      `taggable_id: "${taggableId}"`,
    ].join(", ");

    if (taggableId.indexOf("tmp") > -1) {
      onChange(
        path,
        taggings.concat([Object.assign(newTag, { mutation: true })])
      );
      setNewTag({ id: "" });
    } else {
      axios({
        method: "POST",
        url: "/",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        data: {
          query: `
          mutation {
            CreateTagging(${queryParams}) {
              id
              tag {
                id
                name
              }
            }
          }
        `,
        },
      }).then(
        ({
          data: {
            data: { CreateTagging },
          },
        }) => {
          setNewTag({ id: "" });
          onChange(path, taggings.concat([CreateTagging]));
        }
      );
    }
  };

  const onRemove = ({ id }, idx) => {
    console.log("onRemove TaggingSection", id);
    (id.indexOf("tmp") > -1
      ? Promise.resolve()
      : axios({
          method: "POST",
          url: "/",
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          data: {
            query: `
            mutation {
              DeleteTagging(id: "${id}") {
                id
              }
            }
          `,
          },
        })
    ).then(() => {
      onChange(path, [...taggings.slice(0, idx), ...taggings.slice(idx + 1)]);
    });
  };
  return (
    <CollapsibleSection
      id={`collapse-${parentClassName}-${sectionIndex}-taggings-section`}
      label={<h6 className="category-name">Taggings</h6>}
    >
      <div className="tagging-list">
        {taggings.map((tagging, idx) => (
          <Tagging
            key={idx}
            parentClassName={parentClassName}
            path={[...path, `${idx}`]}
            onRemove={() => onRemove(tagging, idx)}
          />
        ))}
      </div>
      <div>
        <select
          defaultValue=""
          onChange={(e) =>
            setNewTag(tagSelection.find(({ id }) => e.target.value === id))
          }
          value={newTag.id}
        >
          <option value="" disabled>
            Select your option
          </option>
          {tagSelection.map(({ id, name, disabled }, idx) => (
            <option key={idx} value={id} disabled={disabled}>
              {name}
            </option>
          ))}
        </select>
        <span
          className={`add-tag`}
          onClick={onAdd}
          onKeyPress={(e) => {
            e.key === "Enter" && onAdd();
          }}
          tabIndex="0"
        >
          <i className="fas fa-plus" />
          <span>Add Tag</span>
        </span>
      </div>
    </CollapsibleSection>
  );
};

export default TaggingSection;
