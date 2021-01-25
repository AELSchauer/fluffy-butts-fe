import _ from "lodash";
import React, { useContext, useState } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../FormElements/Input";
import RemoveButton from "../RemoveButton/RemoveButton";

const Product = ({ onRemove, path }) => {
  const { state, dispatch } = useContext(DiaperMutationContext);
  const [product, setProduct] = useState(_.get(state, path));
  const patterns = _.get(state, ["brand", "patterns"]);
  const patternSelection = _.chain(patterns)
    .filter(({ name }) => !!name)
    .sortBy(["name"])
    .value();

  return (
    <div className="product">
      <div className="col-12 info-display">
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} onChange={setProduct} />
        <span>
          <label>Pattern</label>
          <select
            value={
              patterns.map(({ id }) => id).includes(product.patternId)
                ? product.patternId
                : ""
            }
            onChange={(e) => {
              setProduct({
                ..._.set(product, "patternId", e.target.value),
                mutation: true,
              });
              dispatch({
                type: "UPDATE",
                fieldName: "patternId",
                path,
                value: e.target.value,
              });
            }}
          >
            <option value="">Select an option</option>
            {patternSelection.map(({ id, name }, idx) => (
              <option key={idx} value={id}>
                {name}
              </option>
            ))}
          </select>
        </span>
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
