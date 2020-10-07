import React, { useContext, useState } from "react";
import CreateProductLine from "./ProductLine";
import PatternContext from "../../../../contexts/pattern-context";
import PatternSection from "./PatternSection";

const CreateBrand = ({ brand = {}, onChange }) => {
  const [patterns, setPatterns] = useState([{}]);
  const [productLines, setProductLines] = useState([{}]);

  const changeProductLine = (productLine, productLineIdx) => {
    const newProductLines = [
      ...productLines.slice(0, productLineIdx),
      productLine,
      ...productLines.slice(productLineIdx + 1),
    ];
    setProductLines(newProductLines);
    onChange({ ...brand, productLines: newProductLines });
  };

  const removeProductLine = (productLineIdx) => {
    const newProductLines = [
      ...productLines.slice(0, productLineIdx),
      ...productLines.slice(productLineIdx + 1),
    ];
    setProductLines(newProductLines);
    onChange({ ...brand, productLines: newProductLines });
  };

  const addPattern = () => {
    const newPatterns = patterns.concat([{}]);
    setPatterns(newPatterns);
    onChange({ ...brand, patterns: newPatterns });
  };

  const changePattern = (pattern, patternIdx) => {
    const newPatterns = [
      ...patterns.slice(0, patternIdx),
      pattern,
      ...patterns.slice(patternIdx + 1),
    ];
    setPatterns(newPatterns);
    onChange({ ...brand, patterns: newPatterns });
  };

  const removePattern = (patternIdx) => {
    const newPatterns = [
      ...patterns.slice(0, patternIdx),
      ...patterns.slice(patternIdx + 1),
    ];
    setPatterns(newPatterns);
    onChange({ ...brand, patterns: newPatterns });
  };

  return (
    <PatternContext.Provider
      value={{ patterns, addPattern, changePattern, removePattern }}
    >
      <div>
        <label>Name</label>
        <input
          className="col-4"
          type="text"
          value={brand.name}
          onChange={(e) => onChange({ ...brand, name: e.target.value })}
        />
      </div>
      <PatternSection />
      <div>
        <h5 className="category-name">Product Lines</h5>
        <div>
          <div className="product-line-list">
            {productLines.map((productLine, idx) => (
              <CreateProductLine
                deleteButton={idx > 0 || productLines.length > 1}
                idx={idx}
                onRemove={removeProductLine}
                onChange={changeProductLine}
                productLine={productLine}
              />
            ))}
          </div>
        </div>
        <div
          className="row add-product-line"
          onClick={() => setProductLines(productLines.concat({}))}
        >
          <i className="fas fa-plus" />
          <span>Add Another Product Line</span>
        </div>
      </div>
    </PatternContext.Provider>
  );
};

export default CreateBrand;
