import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import axios from "../../utils/axios";
import BrowseFilter from "./components/BrowseFilter";
import CountryContext from "../../contexts/country-context";
import Pagination from "../../components/Pagination";
import ProductGrid from "./components/ProductGrid";
import { useQuery } from "../../utils/query-params";
import "./_browse-page.scss";

const BrowsePage = () => {
  const { country } = useContext(CountryContext);
  const query = useQuery();
  const [currentPage, setCurrentPage] = useState(
    parseInt(query.get("page") || 1)
  );
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPages, setMaxPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [products, setProducts] = useState([]);

  const getBrands = () => {
    return axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            brands (order_by: "name_insensitive:asc") {
              id
              name
            }
          }
        `,
      },
    }).then(({ data: { data: { brands = [] } = {} } }) => {
      setBrands(brands);
      return brands;
    });
  };

  const getTags = () => {
    return axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            tags (order_by: "category:asc,display_order:asc,name:asc") {
              name
              category
              display_order
            }
          }
        `,
      },
    }).then(({ data: { data: { tags = [] } = {} } }) => {
      setTags(tags);
      return tags;
    });
  };

  const getProducts = () => {
    const brandFilters = query.get("brands")
      ? `, filter__name: "${query.get("brands")}"`
      : "";

    const productLineFilters = query.get("product-lines")
      ? `, filter__name: "${query.get("product-lines")}"`
      : "";

    const filterAvailability =
      country.name !== "World"
        ? `, filter__availability: "${country.name}"`
        : "";

    return axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            brands (order_by: "name_insensitive:asc"${brandFilters}) {
              product_lines (order_by: "name_insensitive:asc"${productLineFilters}) {
                products (order_by: "name_insensitive:asc", filter__available: true${filterAvailability}) {
                  id
                  name
                  brand {
                    id
                    name
                  }
                  images {
                    name
                    url
                  }
                  product_line {
                    id
                    name
                  }
                  tags {
                    name
                    category
                  }
                }
              }
            }
          }
        `,
      },
    }).then(({ data: { data: { brands = [] } = {} } = {} }) => {
      const productArr = brands.reduce(
        (productArr, { productLines }) =>
          productArr.concat(...productLines.map(({ products }) => products)),
        []
      );
      setAllProducts(productArr);
      return productArr;
    });
  };

  const getFilteredProducts = (args) => {
    const queryTagGroups = _.chain(args.tags || tags)
      .filter(
        ({ name }) =>
          args.queryTags || query.get("tags").split(",").includes(name)
      )
      .groupBy("category")
      .values()
      .map((tags) => tags.map(({ name }) => name))
      .value();
    const filteredProducts = (args.allProducts || allProducts).filter(
      ({ tags }) => {
        const tagNames = tags.map(({ name }) => name);
        return queryTagGroups.every((queryTags) =>
          queryTags.some((tagName) => tagNames.includes(tagName))
        );
      }
    );
    setProducts(filteredProducts);
    setMaxPages(Math.ceil(filteredProducts.length / 30));
  };

  useEffect(() => {
    Promise.all([getTags(), getProducts(), getBrands()])
      .then(([tags, allProducts]) => {
        getFilteredProducts({ allProducts, tags });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getProducts()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  }, [country]);

  const renderPagination = () => {
    return products.length ? (
      <Pagination
        currentPage={currentPage}
        description="Browse page pagination"
        maxPages={maxPages}
        query={query}
        setCurrentPage={setCurrentPage}
        url="/browse"
      />
    ) : (
      ""
    );
  };

  const getUpdatedHref = (categoryName, itemName) => {
    const tempQuery = new URLSearchParams(query.toString());
    const newSet = tempQuery
      .get(categoryName)
      .split(",")
      .filter((i) => i !== itemName);

    if (newSet.length) {
      tempQuery.set(categoryName, newSet);
    } else {
      tempQuery.delete(categoryName);
      categoryName === "brands" && tempQuery.delete("product-lines");
    }
    tempQuery.set("page", 1);
    return tempQuery.toString();
  };

  const renderActiveTags = () => {
    query.sort();
    const activeTags = [];
    let i = 0;
    for (var [categoryName, values] of query.entries()) {
      if (categoryName !== "page" && categoryName !== "size") {
        values
          .split(",")
          .sort()
          .forEach((tagName) => {
            activeTags.push(
              <div className="active-tag" key={i}>
                <span>{tagName}</span>
                <a
                  className="close-active-tag"
                  href={`/browse?${getUpdatedHref(categoryName, tagName)}`}
                >
                  <i className="fas fa-times" />
                </a>
              </div>
            );
          });
        i++;
      }
    }
    return <div className="active-tags">{activeTags}</div>;
  };

  const filterProducts = (newQuery) => {
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      newQuery.toString();
    getFilteredProducts({ queryTags: newQuery.get("tags") });
    window.history.replaceState({}, document.title, newUrl);
  };

  const updateWindowQuery = () => {
    var newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      query.toString();
    window.history.replaceState({}, document.title, newUrl);
  };

  const renderFilterModal = () => {
    return (
      <div className="modal-toggle">
        <div
          className="bg-secondary modal-button text-body"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Filter
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fas fa-times" />
                </button>
                <BrowseFilter
                  brands={brands}
                  categories={_.groupBy(tags, "category")}
                  filterProducts={filterProducts}
                  query={query}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="browse-page page">
      {isLoading ? (
        "..."
      ) : (
        <React.Fragment>
          <div className="browse-filter">
            <BrowseFilter
              brands={brands}
              categories={_.groupBy(tags, "category")}
              filterProducts={filterProducts}
              query={query}
            />
          </div>
          <div className="browse-display">
            {renderFilterModal()}
            {renderPagination()}
            {renderActiveTags()}
            {products.length ? (
              <ProductGrid
                headingText={
                  defaultProducts.length &&
                  `Browse All ${products[0].brand.name} Products`
                }
                products={products.slice(
                  (currentPage - 1) * 30,
                  currentPage * 30
                )}
              />
            ) : (
              <div className="no-results">Sorry, no results were found!</div>
            )}
            {renderPagination()}
          </div>
        </React.Fragment>
      )}
    </section>
  );
};

export default BrowsePage;
