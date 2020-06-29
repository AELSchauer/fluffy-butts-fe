import React from "react";
import "../_search-page.scss";

const ProductGrid = ({ products = [] }) => {
  const slugifyProductName = ({
    id,
    attributes: { name } = {},
    brand: { attributes: { name: brandName } = {} } = {},
    productLine: { attributes: { name: productLineName } = {} } = {},
  } = {}) => {
    return `${brandName}-${productLineName}-${name}-${id}`
      .toLowerCase()
      .replace(/ /g, "-");
  };

  return (
    <div className="product-grid">
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-container">
            <a
              className="product"
              href={`products/${slugifyProductName(product)}`}
            >
              <img
                className="product-image"
                alt={product.logo.attributes.name}
                src={product.logo.attributes.link}
              />
              <p className="product-attribute product-brand">
                {product.brand.attributes.name}
              </p>
              <p className="product-attribute product-line">
                {product.productLine.attributes.name}
              </p>
              <p className="product-attribute product-name">
                {product.attributes.name}
              </p>
              <div className="product-tags">
                {product.tags.map((tag) => (
                  <span key={tag.id} className="product-tag">
                    <a
                      className="product-tag-link"
                      href={`search?tags=${encodeURIComponent(
                        tag.attributes.name
                      )}&page=1`}
                    >
                      {tag.attributes.name
                        .replace(/ /g, "\u00a0")
                        .replace(/-/g, "\u2011")}
                    </a>
                  </span>
                ))}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductGrid;
