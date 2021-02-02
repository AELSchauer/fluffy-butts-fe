import _ from "lodash";
import React, { useContext, useState } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../FormElements/Input";
import RemoveButton from "../RemoveButton/RemoveButton";
import Select from "../FormElements/Select";

const Product = ({ onRemove, path }) => {
  const { state, dispatch } = useContext(DiaperMutationContext);
  const [product, setProduct] = useState(_.get(state, path));
  const patterns = _.get(state, ["brand", "patterns"]);
  const patternSelection = _.chain(patterns)
    .filter(({ name }) => !!name)
    .sortBy(["name"])
    .map(({ id, name }) => ({
      text: name,
      value: id,
    }))
    .value();

  return (
    <div className="product">
      <div className="col-12 info-display">
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} onChange={setProduct} />
        <Select
          fieldName="patternId"
          optionList={patternSelection}
          path={path}
          required={true}
          setParent={setProduct}
          title="Pattern"
          value={
            patterns.map(({ id }) => id).includes(product.patternId)
              ? product.patternId
              : ""
          }
        />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>
              Are you sure you want to remove this product and all its children?
            </h5>
            <p>ID: {product.id}</p>
            <p>Name: {product.name}</p>
          </span>
        </RemoveButton>
      </div>
    </div>
  );
};

export default Product;
