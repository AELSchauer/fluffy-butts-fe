import React from "react";
import "../_browse-page.scss";

const ProductGrid = ({ headingText, products = [] }) => {
  const slugifyProductName = ({
    id,
    name,
    brand = {},
    productLine = {},
  } = {}) => {
    return `/brands/${brand.name}/products/${productLine.name}-${productLine.id}?variant=${name}-${id}`
      .toLowerCase()
      .replace(/ /g, "-");
  };

  return (
    <div className="product-grid">
      {headingText ? (
        <h3 className="product-grid-heading">{headingText}</h3>
      ) : undefined}
      <ul className="products-list">
        {products.map(
          ({
            id,
            name,
            brand = {},
            images: [logo = {}] = [],
            pattern: { tags: patternTags = [] } = {},
            productLine: { tags: productLineTags = [], ...productLine } = {},
          }) => (
            <li key={id} className="product-container">
              <a
                className="product"
                href={slugifyProductName({
                  id,
                  name,
                  brand,
                  productLine,
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
                <p className="product-attribute product-line">
                  {productLine.name}
                </p>
                <p className="product-attribute product-name">{name}</p>
                <div className="product-tags">
                  {[...patternTags, ...productLineTags].map((tag) => (
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
  );
};

export default ProductGrid;
