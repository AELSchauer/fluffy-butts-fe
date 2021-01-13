import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../Input";
import RemoveButton from "../RemoveButton/RemoveButton";

const Tag = ({ categories, onRemove, path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);
  const tag = _.get(rootData, path);

  return (
    <div>
      <div className="pattern col-12 info-display">
        <span
          className="info-toggle"
          data-toggle="collapse"
          data-target={`#collapse-pattern-${tag.id}`}
          aria-expanded="false"
          aria-controls={`collapse-pattern-${tag.id}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <Input disabled fieldName="id" path={path} title="ID" set />
        <Input fieldName="name" path={path} />
        <span>
          <label>Category</label>
          <select
            value={tag.category}
            required
            onChange={(e) =>
              onChange(
                Object.assign(tag, {
                  category: e.target.value,
                  mutation: true,
                })
              )
            }
            defaultValue=""
          >
            <option value="" disabled>
              Select your option
            </option>
            {categories.map((category, idx) => (
              <option key={idx} value={category}>
                {category}
              </option>
            ))}
            <option value="TBD">TBD</option>
          </select>
        </span>
        <Input fieldName="displayOrder" path={path} />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>Are you sure you want to remove this pattern?</h5>
            <p>ID: {tag.id}</p>
            <p>Name: {tag.name}</p>
          </span>
        </RemoveButton>
      </div>
    </div>
  );
};

export default Tag;
