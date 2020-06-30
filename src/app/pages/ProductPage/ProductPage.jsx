import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import _ from "lodash";
import dynamicClassNames from "classnames";
import Tooltip from "../../components/Tooltip";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import "./_product-page.scss";

const chunk = (array, groups) => {
  const size = Math.ceil(array.length / groups);
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
};

const formatMoney = (currency, amount) => {
  try {
    let symbol;
    if (currency === "USD") {
      symbol = "US$";
    }
    return symbol + amount.toFixed(2);
  } catch (e) {
    console.log(e);
  }
};

const ProductPage = (props) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [cousinProducts, setCousinProducts] = useState({
    total: 0,
    products: [],
  });
  const [siblingProducts, setSiblingProducts] = useState({
    total: 0,
    products: [],
  });

  const relatedProducts = (productRelList) =>
    productRelList
      .slice(0, 15)
      .map(({ images: [image] = {}, ...productRel }) => {
        return { ...productRel, image };
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  const getProduct = () => {
    return axios({
      method: "get",
      url: `/products/${props.match.params.id.match(/\d+$/)[0]}`,
      params: {
        include: [
          "brand",
          "images",
          "listings",
          "listings.company",
          "pattern.products.images",
          "pattern.products.product-line",
          "pattern.products",
          "pattern.tags",
          "product-line.products.images",
          "product-line.products",
          "product-line.tags",
          "product-line",
        ],
      },
    })
      .then(({ data: { data = {} } = {} }) => {
        console.log(data)
        const { pattern, productLine, images: [image] = [] } = data;

        const tags = [pattern, productLine]
          .reduce((allTags, { tags } = {}) => allTags.concat(tags), [])
          .sort((a, b) => (a.name > b.name ? 1 : -1));

        const [cousins, siblings] = [
          pattern,
          productLine,
        ].map(({ products = [] }) =>
          products.filter((sib) => sib.id !== data.id)
        );
        
        const pageProduct = { ...data, image, tags };
        setProduct(pageProduct);
        setCousinProducts({
          total: cousins.length,
          products: relatedProducts(cousins),
        });
        setSiblingProducts({
          total: siblings.length,
          products: [pageProduct].concat(relatedProducts(siblings)),
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error)
        setHasError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const slugifyProductName = ({
    id,
    name,
    productLine: { name: productLineName } = {},
  } = {}) => {
    return `${product.brand.name}-${productLineName}-${name}-${id}`
      .toLowerCase()
      .replace(/ /g, "-");
  };

  const renderRelatedProductsList = (
    { products = [], total = 0 },
    tooltipTextPath
  ) => {
    const productRows = chunk(products, products.length > 8 ? 2 : 1);
    const {
      brand: { name: brandName } = {},
      productLine: { name: productLineName } = {},
    } = product;
    return (
      <ul className="swatches">
        {productRows.map((productRow, index) => (
          <div className="swatch-row" key={index}>
            {productRow.map(({ id, image = {}, ...relProduct }) => {
              const classNames = {
                swatch: true,
                selected: product.id === id,
              };
              const href =
                id !== product.id && slugifyProductName({ id, ...relProduct });
              return (
                <Tooltip
                  placement="top"
                  content={_.get(relProduct, tooltipTextPath)}
                  key={id}
                >
                  <li className={dynamicClassNames(classNames)}>
                    {href ? (
                      <a href={`/products/${href}`}>
                        <img
                          className="swatch-image"
                          src={image.link}
                          alt={image.name}
                        />
                      </a>
                    ) : (
                      <img
                        className="swatch-image"
                        src={image.link}
                        alt={image.name}
                      />
                    )}
                  </li>
                </Tooltip>
              );
            })}
          </div>
        ))}
        {total > products.length ? (
          <li className="see-more">
            <a
              href={`/search?brands=${brandName}&product-lines=${productLineName}`}
            >
              See More
            </a>
          </li>
        ) : (
          ""
        )}
      </ul>
    );
  };

  const renderContent = () => {
    const {
      name: productName,
      brand = {},
      image = {},
      listings,
      productLine = {},
      tags = [],
    } = product;

    return (
      <div className="product-page-content">
        <div className="product-info">
          <img className="product-image" alt={image.name} src={image.link} />
          <div className="info-section">
            <a
              className="product-attribute product-brand"
              href={`/search?brands=${brand.name}`}
            >
              {brand.name}
            </a>
            <p className="product-attribute product-name">{productLine.name}</p>
            <div className="product-tags">
              {tags.map((tag, idx) => (
                <span className="product-tag" key={idx}>
                  <a
                    className="product-tag-link"
                    href={`/search?tags=${tag.name}`}
                  >
                    {tag.name.replace(/ /g, "\u00a0")}
                  </a>
                </span>
              ))}
            </div>
            <hr />
            <div className="related-products-section">
              <p className="product-color">
                Pattern: <span className="bold">{productName}</span>
              </p>
              {renderRelatedProductsList(siblingProducts, "name")}
            </div>
            {cousinProducts.total ? (
              <div className="related-products-section">
                <p className="section-heading">
                  Other Products in this Pattern
                </p>
                {renderRelatedProductsList(cousinProducts, "productLine.name")}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div>
          <h3 className="section-header listings-header">Product Listings</h3>
          <div className="container listings">
            {_.sortBy(listings, "price").map(
              ({ currency, link, price, company, ...listing }) => {
                const title =
                  company.name || (link.match(/\w*\.com/g) || [])[0];
                return (
                  <a className="listing listing-link" href={link}>
                    <div className="listing-title listing-prop">
                      <img
                        className="company-icon"
                        src={`https://storage.cloud.google.com/fluffy-butts/Favicons/${
                          company.name || "default"
                        }.png`}
                      />
                      {title}
                    </div>
                    <div className="listing-price listing-prop">
                      {formatMoney(currency, parseFloat(price))}
                    </div>
                  </a>
                );
              }
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="product-page page">
      {isLoading ? (
        <Ellipsis className="loading" color="#42b983" />
      ) : (
        renderContent()
      )}
    </section>
  );
};

export default ProductPage;
