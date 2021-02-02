import _ from "lodash";
import React, { useContext, useState } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../FormElements/Input";
import Select from "../FormElements/Select";
import RemoveButton from "../RemoveButton";

const categories = [
  { value: "PATTERN__COLOR" },
  { value: "PATTERN__PATTERN_AND_THEME" },
  { value: "PATTERN__TBD" },
  { value: "PRODUCT_LINE__FEATURES" },
  { value: "PRODUCT_LINE__AGE" },
  { value: "PRODUCT_LINE__PRODUCT_TYPE" },
  { value: "PRODUCT_LINE__PRODUCT_SERIES" },
  { value: "PRODUCT_LINE__TBD" },
  { value: "TBD" },
];

const Tag = ({ onRemove, path }) => {
  const { state } = useContext(DiaperMutationContext);
  const [tag, setTag] = useState(_.get(state, path));

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
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} onChange={setTag} />
        <Select
          fieldName="category"
          optionList={categories}
          path={path}
          setParent={setTag}
        />
        <Input fieldName="displayOrder" path={path} onChange={setTag} />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>Are you sure you want to remove this tag?</h5>
            <p>ID: {tag.id}</p>
            <p>Name: {tag.name}</p>
          </span>
        </RemoveButton>
      </div>
    </div>
  );
};

export default Tag;
