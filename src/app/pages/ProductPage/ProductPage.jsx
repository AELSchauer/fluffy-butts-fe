import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import _ from "lodash";
import dynamicClassNames from "classnames";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import { findMany, findOne } from "../../utils/json-api";
import { useQuery } from "../../utils/query-params";
import "./_product-page.scss";

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
                listings: { data: listingsRel = [] } = {},
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
          const {
            relationships: {
              products: { data: cousinProductRel = [] } = {},
              tags: { data: patternTags = [] } = {},
            } = {},
          } = pattern;
          const {
            relationships: {
              products: { data: siblingProductRel = [] } = {},
              tags: { data: productLineTags = [] } = {},
            } = {},
          } = productLine;

          const tags = [...patternTags, ...productLineTags]
            .map((tag) => findOne(included, tag))
            .sort((a, b) => (a.attributes.name > b.attributes.name ? 1 : -1));

          const relatedProducts = (productRelList) =>
            productRelList
              .filter((sib) => sib.id !== id)
              .slice(0, 13)
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
            total: cousinProductRel.length,
            products: relatedProducts(cousinProductRel),
          });
          setSiblingProducts({
            total: siblingProductRel.length,
            products: [{ id, type, attributes, image }].concat(
              relatedProducts(siblingProductRel)
            ),
          });
        }
      )
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  };

  useEffect(() => {
    async function fetchData() {
      await getProduct();
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const renderRelatedProductsList = (
    { products = [], total = 0 },
    tooltipTextPath
  ) => {
    return (
      <ul className="swatches">
        {products.map(
          ({ id, image: { attributes: image = {} } = {}, ...relProduct }) => {
            const classNames = {
              swatch: true,
              selected: product.id === id,
            };
            return (
              <OverlayTrigger
                key={id}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${id}`}>
                    {_.get(relProduct, tooltipTextPath)}
                  </Tooltip>
                }
              >
                <li className={dynamicClassNames(classNames)} key={id}>
                  <a href={`products/${id}`}>
                    <img
                      className="swatch-image"
                      src={image.link}
                      alt={image.name}
                    />
                  </a>
                </li>
              </OverlayTrigger>
            );
          }
        )}
        {total > 14 ? (
          <li style="text: red;">!!! MORE LINK GOES HERE !!!</li>
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
      productLine: { attributes: productLine = {} } = {},
      tags = [],
    } = product;

    return (
      <section className="product-page page">
        <div className="product-page-content">
          <img className="product-image" alt={image.name} src={image.link} />
          <div className="info-section">
            <p className="product-attribute product-brand">{brand.name}</p>
            <p className="product-attribute product-name">{productLine.name}</p>
            <div className="product-tags">
              {tags.map(({ attributes: { id, name } = {} }) => (
                <span className="product-tag" key={id}>
                  <a className="product-tag-link" href={`/search?tags=${name}`}>
                    {name.replace(/ /g, "\u00a0")}
                  </a>
                </span>
              ))}
            </div>
            <hr />
            <div className="related-products-section">
              <p className="section-heading product-color">
                Style: <span className="bold">{productName}</span>
              </p>
              {renderRelatedProductsList(siblingProducts, "attributes.name")}
            </div>
            {cousinProducts.total > 1 ? (
              <div className="related-products-section">
                <p className="section-heading">Other Products in this Color:</p>
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
      </section>
    );
  };

  return (
    <section className="search-page page">
      {isLoading ? (
        <Ellipsis className="loading" color="#42b983" />
      ) : (
        renderContent()
      )}
    </section>
  );
};

export default ProductPage;
