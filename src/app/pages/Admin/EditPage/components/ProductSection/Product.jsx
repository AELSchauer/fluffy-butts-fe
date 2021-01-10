import _ from "lodash";
import React, { useContext } from "react";
import PatternContext from "../../../../../contexts/pattern-context";
import RemoveButton from "../RemoveButton";

const Product = ({ onRemove, onChange, product }) => {
  const { patterns } = useContext(PatternContext);

  return (
    <div>
      <span className="product col-12 info-display">
        <span
          data-toggle="collapse"
          data-target={`#collapse-product-${product.id}`}
          aria-expanded="false"
          aria-controls={`collapse-product-${product.id}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <label>ID</label>
        <input type="text" value={product.id} disabled />
        <label>Name</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) =>
            onChange({ ...product, name: e.target.value, updated: true })
          }
        />
        <label>Pattern</label>
        <select
          value={
            patterns.map(({ id }) => id).includes(product.patternId)
              ? product.patternId
              : ""
          }
          onChange={(e) =>
            onChange({ ...product, patternId: e.target.value, updated: true })
          }
        >
          <option value="">Select an option</option>
          {_.chain(patterns)
            .filter(({ name }) => !!name)
            .sortBy(["name"])
            .map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))
            .value()}
        </select>
        <RemoveButton onRemove={() => onRemove(product)}>
          <span>
            <h5>
              Are you sure you want to remove this product and all its children?
            </h5>
            <p>ID: {product.id}</p>
            <p>Name: {product.name}</p>
          </span>
        </RemoveButton>
        {JSON.stringify(product)}
      </span>
      <div className="collapse" id={`collapse-product-${product.id}`}>
        Stuff Goes Here?
      </div>
    </div>
  );
};

export default Product;
