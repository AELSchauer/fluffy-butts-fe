import React from "react";
import "../_search-page.scss";

const ProductLines = ({ brand = {}, defaultProducts = [] }) => {
  return (
    <div className="product-line-grid">
      <ul class="product-list">
        {defaultProducts.map((product) => (
          <li key={product.id} className="product-line-container">
            <a
              className="product"
              href={`search/brand=${brand}&product-line=${product.productLine.attributes.name}`}
            >
              <img
                className="product-image"
                alt={product.logo.attributes.name}
                src={product.logo.attributes.link}
              />
              <p className="product-attribute product-line">
                {product.productLine.attributes.name}
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

export default ProductLines;
