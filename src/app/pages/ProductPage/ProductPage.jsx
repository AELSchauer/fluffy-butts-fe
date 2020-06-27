import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import _ from "lodash";
import dynamicClassNames from "classnames";
import Tooltip from "../../components/Tooltip";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import { findMany, findOne } from "../../utils/json-api";
import { useQuery } from "../../utils/query-params";
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
  const query = useQuery();

  const getProduct = async () => {
    return axios({
      method: "get",
      url: `/products/${props.match.params.id}`,
      params: {
        include: [
          "brand",
          "images",
          "listings",
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
      .then(
        ({
          data: {
            data: {
              id,
              type,
              attributes,
              relationships: {
                brand: { data: brandRel = {} } = {},
                images: { data: [imageRel = {}] = [] } = {},
                listings: { data: listingsRel = {} } = {},
                pattern: { data: patternRel = {} } = {},
                "product-line": { data: productLineRel = {} } = {},
              },
            },
            included = [],
          },
        }) => {
          const brand = findOne(included, brandRel);
          const image = findOne(included, imageRel);
          const listings = findMany(included, listingsRel);
          const pattern = findOne(included, patternRel);
          const productLine = findOne(included, productLineRel);

          const tags = [pattern, productLine]
            .reduce(
              (
                tags,
                { relationships: { tags: { data = [] } = {} } = {} } = {}
              ) => tags.concat(data),
              []
            )
            .map((tag) => findOne(included, tag))
            .sort((a, b) => (a.attributes.name > b.attributes.name ? 1 : -1));

          const [cousins, siblings] = [pattern, productLine].map(
            ({
              relationships: {
                products: { data },
              },
            }) => data.filter((sib) => sib.id !== id)
          );

          const relatedProducts = (productRelList) =>
            productRelList
              .slice(0, 15)
              .map((sib) => findOne(included, sib))
              .map(({ id, type, attributes, relationships }) => {
                const image = findOne(
                  included,
                  _.get(relationships, "images.data[0]")
                );
                const productLine = findOne(
                  included,
                  _.get(relationships, "product-line.data")
                );
                return {
                  id,
                  type,
                  attributes,
                  image,
                  productLine,
                };
              })
              .sort((a, b) => (a.attributes.name > b.attributes.name ? 1 : -1));

          setProduct({
            id,
            type,
            attributes,
            brand,
            image,
            listings,
            pattern,
            productLine,
            tags,
          });

          setCousinProducts({
            total: cousins.length,
            products: relatedProducts(cousins),
          });

          setSiblingProducts({
            total: siblings.length,
            products: [{ id, type, attributes, image }].concat(
              relatedProducts(siblings)
            ),
          });

          setIsLoading(false);
        }
      )
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const renderRelatedProductsList = (
    { products = [], total = 0 },
    tooltipTextPath
  ) => {
    const productRows = chunk(products, products.length > 8 ? 2 : 1);
    const { brand, productLine } = product;
    return (
      <ul className="swatches">
        {productRows.map((productRow, index) => (
          <div className="swatch-row" key={index}>
            {productRow.map(
              ({
                id,
                image: { attributes: image = {} } = {},
                ...relProduct
              }) => {
                const classNames = {
                  swatch: true,
                  selected: product.id === id,
                };
                return (
                  <Tooltip
                    placement="top"
                    content={_.get(relProduct, tooltipTextPath)}
                  >
                    <li className={dynamicClassNames(classNames)} key={id}>
                      <a href={`/products/${id}`}>
                        <img
                          className="swatch-image"
                          src={image.link}
                          alt={image.name}
                        />
                      </a>
                    </li>
                  </Tooltip>
                );
              }
            )}
          </div>
        ))}
        {total > products.length ? (
          <li className="see-more">
            <a href={`/search?brands=${brand.attributes.name}&product-lines=${productLine.attributes.name}`}>See More</a>
          </li>
        ) : (
          ""
        )}
      </ul>
    );
  };

  const renderContent = () => {
    const {
      attributes: { name: productName } = {},
      brand: { attributes: brand = {} } = {},
      image: { attributes: image = {} } = {},
      listings,
      productLine: { attributes: productLine = {} } = {},
      tags = [],
    } = product;

    return (
      <div className="product-page-content">
        <div className="product-info">
          <img className="product-image" alt={image.name} src={image.link} />
          <div className="info-section">
            <p className="product-attribute product-brand">{brand.name}</p>
            <p className="product-attribute product-name">{productLine.name}</p>
            <div className="product-tags">
              {tags.map(({ attributes: { name } = {} }, idx) => (
                <span className="product-tag" key={idx}>
                  <a className="product-tag-link" href={`/search?tags=${name}`}>
                    {name.replace(/ /g, "\u00a0")}
                  </a>
                </span>
              ))}
            </div>
            <hr />
            <div className="related-products-section">
              <p className="product-color">
                Pattern: <span className="bold">{productName}</span>
              </p>
              {renderRelatedProductsList(siblingProducts, "attributes.name")}
            </div>
            {cousinProducts.total ? (
              <div className="related-products-section">
                <p className="section-heading">
                  Other Products in this Pattern
                </p>
                {renderRelatedProductsList(
                  cousinProducts,
                  "productLine.attributes.name"
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div>
          <h3 className="section-header listings-header">Product Listings</h3>
          <div className="container listings">
            {_.sortBy(listings, "attributes.price").map(
              ({
                attributes: { currency, link, price, quantity, company } = {},
              }) => {
                console.log(link);
                const title = company || (link.match(/\w*\.com/g) || [])[0];
                return (
                  <a className="listing listing-link" href={link}>
                    <div className="listing-title listing-prop">
                      <img
                        className="company-icon"
                        src={`https://storage.cloud.google.com/fluffy-butts/Favicons/${
                          company || "default"
                        }.png`}
                      />
                      {title}
                    </div>
                    <div className="listing-price listing-prop">
                      {formatMoney(currency, parseFloat(price))}
                    </div>
                    <div className="listing-quantity listing-prop">
                      Qty: {quantity || 1}
                    </div>
                    <div className="listing-price-count listing-prop">
                      {formatMoney(
                        currency,
                        parseFloat(price) / (quantity || 1)
                      )}
                      {" / Count"}
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
