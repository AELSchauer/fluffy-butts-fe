import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import axios from "../../../../../utils/axios";
import ProductLineSection from "../ProductLineSection";
import ChangePageContext from "../../../../../contexts/change-page-context";
import PatternContext from "../../../../../contexts/pattern-context";
import PatternSection from "../PatternSection";

const BrandSection = ({ brand = {}, onChange }) => {
  const { changePageType } = useContext(ChangePageContext);
  const [patterns, setPatterns] = useState(brand.patterns || []);
  const [productLines, setProductLines] = useState(brand.productLines || []);

  useEffect(() => {
    setPatterns(brand.patterns || []);
    setProductLines(brand.productLines || []);
  }, [brand]);

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
    (productLine.id.indexOf("tmp-") > -1
      ? Promise.resolve()
      : axios({
          method: "POST",
          url: "/",
          data: {
            query: `
              mutation {
                DeleteProductLine(id: "${productLine.id}") {
                  id
                }
              }
            `,
          },
        })
    )
      .then(() => {
        const idx = _.findIndex(productLines, { id: productLine.id });
        const newProductLines = [
          ...productLines.slice(0, idx),
          ...productLines.slice(idx + 1),
        ];
        setProductLines(newProductLines);
        onChange({ ...brand, productLines: newProductLines });
      })
      .catch((error) => {
        console.error("BrandSection", error);
      });
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
    (pattern.id.indexOf("tmp-") > -1
      ? Promise.resolve()
      : axios({
          method: "POST",
          url: "/",
          data: {
            query: `
              mutation {
                DeletePattern(id: "${pattern.id}") {
                  id
                }
              }
            `,
          },
        })
    ).then(() => {
      const idx = _.findIndex(patterns, { id: pattern.id });
      const newPatterns = [
        ...patterns.slice(0, idx),
        ...patterns.slice(idx + 1),
      ];
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
      <ProductLineSection
        onAdd={addProductLine}
        onRemove={removeProductLine}
        onChange={changeProductLine}
        productLines={productLines}
      />
      </PatternContext.Provider>
  );
};

export default BrandSection;
