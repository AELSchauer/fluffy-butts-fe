import React, { useState, useEffect } from "react";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import axios from "../../utils/axios";
import { findOne } from "../../utils/json-api";
import groupBy from "lodash.groupby";
import Modal from "react-bootstrap/Modal";
import Pagination from "../../components/Pagination";
import SearchFilter from "./SearchFilter";
import { useQuery } from "../../utils/query-params";
import "./_search-page.scss";

const SearchPage = (props) => {
  const query = useQuery();
  const [currentPage] = useState(parseInt(query.get("page") || 1));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPages, setMaxPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);

  const convertPageQueryToJsonApiQuery = () => {
    return Object.assign(
      !!query.get("tags") && {
        "filter[tags.name]": query.get("tags"),
      },
      !!query.get("brands") && {
        "filter[brand.name]": query.get("brands"),
      },
      !!query.get("product-lines") && {
        "filter[product-line]": query.get("product-lines"),
      },
      !!query.get("page") && { "page[number]": query.get("page") },
      !!query.get("size") && { "page[size]": query.get("size") }
    );
  };

  const getBrands = async () => {
    return axios({
      method: "get",
      url: "/brands",
      params: {
        sort: ["name_insensitive"],
      },
    }).then(({ data: { data = [] } }) => setBrands(data));
  };

  const getTags = async () => {
    return axios({
      method: "get",
      url: "/tags",
      params: {
        sort: ["category", "name"],
      },
    }).then(({ data: { data = [] } }) =>
      setCategories(groupBy(data, "attributes.category"))
    );
  };

  const getProducts = async () =>
    axios({
      method: "get",
      url: "/products",
      params: {
        include: [
          "brand",
          "images",
          "pattern.tags",
          "product-line",
          "product-line.tags",
        ],
        sort: ["brand.name", "product-line.name", "name"],
        ...convertPageQueryToJsonApiQuery(),
      },
    })
      .then(
        ({
          data: {
            data = [],
            included = [],
            links: { last: lastPageLink } = {},
          },
        }) => ({
          maxPages: parseInt(lastPageLink.match(/&page%5Bnumber%5D=(\d+)/)[1]),
          products: data.map(
            ({
              id,
              type,
              attributes,
              relationships: {
                brand: { data: brandRel = {} } = {},
                images: { data: [imageRel = {}] = [] } = {},
                pattern: { data: patternRel = {} } = {},
                "product-line": { data: productLineRel = {} } = {},
              },
            }) => {
              const brand = findOne(included, brandRel);
              const logo = findOne(included, imageRel) || {
                attributes: { link: "", name: "" },
              };
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
                .sort((a, b) =>
                  a.attributes.name > b.attributes.name ? 1 : -1
                );

              return {
                id,
                type,
                attributes,
                brand,
                logo,
                pattern,
                productLine,
                tags,
              };
            }
          ),
        })
      )
      .then((result) => {
        result.maxPages && setMaxPages(result.maxPages);
        result.products && setProducts(result.products);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        return {};
      });

  useEffect(() => {
    Promise.all([getBrands(), getProducts(), getTags()]);
  }, []);

  const getPagination = () => {
    return products.length ? (
      <Pagination
        currentPage={currentPage}
        description="Search page pagination"
        maxPages={maxPages}
        query={query}
        url="/search"
      />
    ) : (
      ""
    );
  };

  const getActiveTags = () => {
    const getUpdatedHref = (categoryName, itemName) => {
      return query
        .toString()
        .split("&")
        .map((str) => {
          return str.indexOf(categoryName) >= 0
            ? str
                .replace(itemName, "")
                .replace("=%2C", "=")
                .replace("%2C%2C", "%2C")
                .replace(/%2C$/, "")
                .replace(new RegExp(categoryName + "=$"), "")
            : str;
        })
        .filter(Boolean)
        .join("&")
        .replace(/page=\d+/g, "page=1");
    };

    query.sort();
    const activeTags = [];
    for (var [key, values] of query.entries()) {
      if (key !== "page" && key !== "size") {
        values
          .split(",")
          .sort()
          .forEach((value) => {
            activeTags.push(
              <div className="active-tag">
                <span>{value}</span>
                <a
                  className="close-active-tag"
                  href={`/search?${getUpdatedHref(
                    key,
                    encodeURI(value.replace(/ /g, "+"))
                  )}`}
                >
                  <i className="fas fa-times" />
                </a>
              </div>
            );
          });
      }
    }
    return activeTags;
  };

  const getProductsGrid = () => {
    return (
      <div className="products-grid">
        <div class="modal-toggle">
          <div className="btn-secondary" onClick={() => setShow(true)}>
            Filter
          </div>
          <Modal
            show={show}
            onHide={() => setShow(false)}
            dialogClassName="woohoo"
            aria-labelledby="example-custom-modal-styling-title"
            scrollable={true}
          >
            <Modal.Header closeButton />
            <Modal.Body>
              <SearchFilter
                brands={brands}
                categories={categories}
                query={query}
              />
            </Modal.Body>
          </Modal>
        </div>
        {getPagination()}
        <div className="active-tags">{getActiveTags()}</div>
        <ul className="products-list">
          {products.length ? (
            products.map((product) => (
              <li key={product.id} className="product-container">
                <a className="product" href={`products/${product.id}`}>
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
            ))
          ) : (
            <div className="no-results">Sorry, no results were found!</div>
          )}
        </ul>
        {getPagination()}
      </div>
    );
  };

  return (
    <section className="search-page page">
      {isLoading ? (
        <Ellipsis className="loading" color="#42b983" />
      ) : (
        <React.Fragment>
          <div className="product-search">
            <SearchFilter
              brands={brands}
              categories={categories}
              query={query}
            />
          </div>
          {getProductsGrid()}
        </React.Fragment>
      )}
    </section>
  );
};

export default SearchPage;
