import React, { useContext, useEffect, useState } from "react";
import QueryContext from "../../../contexts/query-context";
import "../_browse-page.scss";

const ProductGrid = ({ allProducts = [] }) => {
  // const { query, updateQuery } = useContext(QueryContext);
  const [products, setProducts] = useState(allProducts);

  const slugifyProductName = ({ id, name, brand = {} } = {}) => {
    return `/brands/${brand.name}/products/${name}-${id}`
      .toLowerCase()
      .replace(/ /g, "-");
  };

  return (
    <QueryContext.Consumer>
      {({ query, updateQuery }) => (
        <div className="product-grid">
          <ul className="products-list">
            {products
              .filter(product => {
                console.log(query.toString())
                return true
              })
              .map(
                ({
                  id,
                  name,
                  brand = {},
                  images: [logo = {}] = [],
                  tags = [],
                }) => (
                  <li key={id} className="product-container">
                    <a
                      className="product"
                      href={slugifyProductName({
                        id,
                        name,
                        brand,
                      })}
                    >
                      <img
                        className="product-image"
                        alt={logo.name}
                        src={logo.url}
                      />
                      <p className="product-attribute product-brand product-heading">
                        {brand.name}
                      </p>
                      <p className="product-attribute product-line">{name}</p>
                      <p className="product-attribute product-name">{name}</p>
                      <div className="product-tags">
                        {tags.map((tag) => (
                          <span key={tag.id} className="product-tag">
                            <a
                              className="product-tag-link"
                              href={`browse?tags=${encodeURIComponent(
                                tag.name
                              )}&page=1`}
                            >
                              {tag.name
                                .replace(/ /g, "\u00a0")
                                .replace(/-/g, "\u2011")}
                            </a>
                          </span>
                        ))}
                      </div>
                    </a>
                  </li>
                )
              )}
          </ul>
        </div>
      )}
    </QueryContext.Consumer>
  );
};

export default ProductGrid;
