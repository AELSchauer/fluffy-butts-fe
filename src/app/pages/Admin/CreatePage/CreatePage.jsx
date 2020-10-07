import React, { createContext, useEffect, useState } from "react";
import axios from "../../../utils/axios";
import CreateProductLine from "./components/ProductLine";
import CreatePattern from "./components/Pattern";
// import "./_brand-index-page.scss";

const CreatePage = () => {
  const [productLines, setProductLines] = useState([{}]);
  const [patterns, setPatterns] = useState([{}]);
  const [patternTags, setPatternTags] = useState([]);
  const [productTags, setProductTags] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            tags (order_by: "category:asc,name:asc") {
              id
              name
              category
            }
          }
        `,
      },
    }).then(({ data: { data: { tags = [] } = {} } = {} }) => {
      setProductTags(
        tags.filter(({ category }) => !!~category.indexOf("PRODUCT__"))
      );
      setPatternTags(
        tags.filter(({ category }) => !!~category.indexOf("PATTERN__"))
      );
    });
  }, []);

  const changeProductLine = (productLine, idx) => {
    setProductLines([
      ...productLines.slice(0, idx),
      productLine,
      ...productLines.slice(idx + 1),
    ]);
  };

  const removeProductLine = (idx) => {
    setProductLines([
      ...productLines.slice(0, idx),
      ...productLines.slice(idx + 1),
    ]);
  };

  const changePattern = (pattern, idx) => {
    console.log('changePattern', pattern, idx)
    // setPatterns([
      //   ...patterns.slice(0, idx),
      //   pattern,
      //   ...patterns.slice(idx + 1),
      // ]);
    };
    
    const removePattern = (idx) => {
      console.log('removePattern', idx)
    // setPatterns([...patterns.slice(0, idx), ...patterns.slice(idx + 1)]);
  };

  // useEffect(() => {
  //   console.log(productLines);
  // }, [productLines]);

  return (
    <section className="create-page page">
      <form>
        <div>
          <label>Brand Name</label>
          <input type="text" />
        </div>
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
                  allPatterns={patterns}
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
        <div>
          <h5 className="category-name">Patterns</h5>
          <div>
            <div className="product-line-list">
              {patterns.map((pattern, idx) => (
                <CreatePattern
                  deleteButton={idx > 0 || patterns.length > 1}
                  idx={idx}
                  onRemove={removePattern}
                  onChange={changePattern}
                  pattern={pattern}
                  allTags={patternTags}
                />
              ))}
            </div>
          </div>
          <div
            className="row add-pattern"
            onClick={() => setPatterns(patterns.concat({}))}
          >
            <i className="fas fa-plus" />
            <span>Add Another Pattern</span>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreatePage;
