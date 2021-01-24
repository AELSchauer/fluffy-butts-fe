import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../Input";
import RemoveButton from "../RemoveButton/RemoveButton";

const Product = ({ onRemove, path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);
  const product = _.get(rootData, path);
  const patterns = _.get(rootData, ["brand", "patterns"]);
  const patternSelection = _.chain(patterns)
    .filter(({ name }) => !!name)
    .sortBy(["name"])
    .value();

  return (
    <div className="product">
      <div className="col-12 info-display">
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" required path={path} />
        <span>
          <label>Pattern</label>
          <select
            value={
              patterns.map(({ id }) => id).includes(product.patternId)
                ? product.patternId
                : ""
            }
            onChange={(e) =>
              onChange(path, {
                patternId: e.target.value,
                mutation: true,
              })
            }
          >
            <option value="">Select an option</option>
            {patternSelection.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </span>
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>
              Are you sure you want to remove this Product and all its children?
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
