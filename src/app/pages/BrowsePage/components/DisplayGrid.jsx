import React from "react";
import ItemImageCarousel from "./ItemImageCarousel";
import "../_browse-page.scss";

const DisplayGrid = ({ filteredByPattern = false, productLines = [] }) => {
  const getProductHref = ({ id, name, brand = {}, product } = {}) => {
    return `/brands/${brand.name}/products/${name}-${id}${
      !product ? "" : `?variant=${product.name}--${product.id}`
    }`
      .toLowerCase()
      .replace(/ /g, "-");
  };

  const renderItemImage = (id, name, brand, logo, products) => {
    if (!filteredByPattern) {
      return (
        <a href={getProductHref({ id, name, brand })}>
          <img className="product-image" alt={logo.name} src={logo.url} />
        </a>
      );
    }
    if (products.length > 1) {
      return (
        <ItemImageCarousel
          items={products.map((product) => ({
            ...product,
            href: getProductHref({ id, name, brand, product }),
          }))}
        />
      );
    }
    const [{ images: [image = {}] = [], ...product } = {}] = products;
    return (
      <a href={getProductHref({ id, name, brand, product })}>
        <img className="product-image" alt={image.name} src={image.url} />
      </a>
    );
  };

  return (
    <div className="product-grid">
      <ul className="products-list">
        {productLines.map(
          ({
            id,
            name,
            brand = {},
            images: [logo = {}] = [],
            products,
            tags = [],
          }) => (
            <li key={id} className="product-container">
              <div className="product">
                {renderItemImage(id, name, brand, logo, products)}
                <p className="product-attribute product-brand product-heading">
                  {brand.name}
                </p>
                <p className="product-attribute product-line">{name}</p>
                <div className="product-tags">
                  {tags.map((tag) => (
                    <span key={tag.id} className="product-tag">
                      <span className="product-tag-link">
                        {tag.name
                          .replace(/ /g, "\u00a0")
                          .replace(/-/g, "\u2011")}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default DisplayGrid;
