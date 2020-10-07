import React, { useContext, useEffect } from "react";
import PatternContext from "../../../../contexts/pattern-context";

const CreateProduct = ({ deleteButton, idx, onRemove, onChange, product }) => {
  const { patterns } = useContext(PatternContext);

  return (
    <React.Fragment>
      <div className="product row">
        <div
          data-toggle="collapse"
          data-target={`#collapse-product-${idx}`}
          aria-expanded="false"
          aria-controls={`collapse-product-${idx}`}
        >
          <i className="fas fa-caret-right" />
          <label>Name</label>
        </div>
        <input
          className="col-4"
          type="text"
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value }, idx)}
        />
        <label>Pattern</label>
        <select
          className="col-4"
          value={
            patterns.map(({ name }) => name).includes(product.pattern)
              ? product.pattern
              : ""
          }
          onChange={(e) =>
            onChange({ ...product, pattern: e.target.value }, idx)
          }
        >
          <option value="" selected disabled>
            Select an option
          </option>
          {patterns
            .filter(({ name }) => !!name)
            .map(({ name }, idx) => (
              <option value={name}>{name}</option>
            ))}
        </select>
        {deleteButton ? (
          <i className="fas fa-minus" onClick={() => onRemove(idx)} />
        ) : (
          ""
        )}
      </div>
      <div className="collapse" id={`collapse-product-${idx}`}>
        Stuff Goes Here?
      </div>
    </React.Fragment>
  );
};

export default CreateProduct;
