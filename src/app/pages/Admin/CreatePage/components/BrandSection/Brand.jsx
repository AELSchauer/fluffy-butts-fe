import React, { useContext, useState } from "react";
import CreateProductLine from "./ProductLineSection";
import PatternContext from "../../../../../contexts/pattern-context";
import PatternSection from "./PatternSection";
import _ from "lodash";

const CreateBrand = ({ brand = {}, onChange }) => {
  const [patterns, setPatterns] = useState(brand.patterns || []);
  const [productLines, setProductLines] = useState(brand.productLines || []);

  const addProductLine = () => {
    setProductLines(productLines.concat({ id: `tmp-${Date.now()}` }));
  };

  const changeProductLine = (productLine) => {
    const idx = _.findIndex(productLines, { id: productLine.id });
    const newProductLines = [
      ...productLines.slice(0, idx),
      productLine,
      ...productLines.slice(idx + 1),
    ];
    setProductLines(newProductLines);
    onChange({ ...brand, productLines: newProductLines });
  };

  const removeProductLine = (productLine) => {
    const idx = _.findIndex(productLines, { id: productLine.id });
    const newProductLines = [
      ...productLines.slice(0, idx),
      ...productLines.slice(idx + 1),
    ];
    setProductLines(newProductLines);
    onChange({ ...brand, productLines: newProductLines });
  };

  const addPattern = () => {
    const newPatterns = patterns.concat([{ id: `tmp-${Date.now()}` }]);
    setPatterns(newPatterns);
    onChange({ ...brand, patterns: newPatterns });
  };

  const changePattern = (pattern) => {
    const idx = _.findIndex(patterns, { id: pattern.id });
    const newPatterns = [
      ...patterns.slice(0, idx),
      pattern,
      ...patterns.slice(idx + 1),
    ];
    setPatterns(newPatterns);
    onChange({ ...brand, patterns: newPatterns });
  };

  const removePattern = (pattern) => {
    const idx = _.findIndex(patterns, { id: pattern.id });
    const newPatterns = [...patterns.slice(0, idx), ...patterns.slice(idx + 1)];
    const newProductLines = productLines.map(
      ({ products = [], ...productLine }) => ({
        ...productLine,
        products: products.map(({ pattern, ...product }) => ({
          ...product,
          pattern: newPatterns.map(({ name }) => name).includes(pattern)
            ? pattern
            : "",
        })),
      })
    );
    setPatterns(newPatterns);
    setProductLines(newProductLines);
    onChange({
      ...brand,
      patterns: newPatterns,
      productLines: newProductLines,
    });
  };

  return (
    <PatternContext.Provider
      value={{ patterns, addPattern, changePattern, removePattern }}
    >
      <div className="info-display">
        <label>ID</label>
        <input type="text" value={brand.id} disabled />
        <label>Name</label>
        <input
          type="text"
          required
          value={brand.name}
          onChange={(e) => onChange({ ...brand, name: e.target.value })}
        />
      </div>
      <PatternSection />
      <div className="category-section">
        <div className="category-heading">
          <h5 className="category-name">Product Lines</h5>
          <span className="add-product-line" onClick={addProductLine}>
            <i className="fas fa-plus" />
            <span>Add Product Line</span>
          </span>
        </div>
        <div className="product-line-list">
          {productLines.map((productLine, idx) => (
            <CreateProductLine
              key={idx}
              onRemove={removeProductLine}
              onChange={changeProductLine}
              productLine={productLine}
            />
          ))}
        </div>
      </div>
    </PatternContext.Provider>
  );
};

export default CreateBrand;
