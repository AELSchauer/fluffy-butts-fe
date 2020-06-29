import React from "react";
import "../_search-page.scss";

const ProductLines = ({ defaultProducts = [] }) => {
  const [{ productLine: { brand = {} } = {} } = {}] = defaultProducts;
  return (
    <div className="product-line-grid">
      <h3 class="product-line-grid-heading">{brand.name} Product Lines</h3>
      <ul className="products-list">
        {defaultProducts.map(
          ({ id, images: [logo = {}] = [], productLine = {} }) => {
            const heading = productLine.name.replace(/-- .*/g, "");
            const subHeading = productLine.name.replace(/.* -- /g, "");
            const href = `search?brands=${
              brand.name
            }&product-lines=${productLine.name.replace("&", "%26")}&page=1`;
            return (
              <li key={id} className="product-container">
                <a className="product" href={href}>
                  <img
                    className="product-image"
                    alt={logo.name}
                    src={logo.link}
                  />
                  <p className="product-heading product-line">{heading}</p>
                  {subHeading !== heading ? (
                    <p className="product-attribute product-line-style">
                      Style: {subHeading}
                    </p>
                  ) : undefined}
                  <div className="product-tags">
                    {productLine.tags.map((tag) => (
                      <span key={tag.id} className="product-tag">
                        <a
                          className="product-tag-link"
                          href={`search?tags=${encodeURIComponent(
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
            );
          }
        )}
      </ul>
      <hr />
    </div>
  );
};

export default ProductLines;
