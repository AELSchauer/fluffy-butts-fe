import React, { useContext, useEffect, useState } from "react";
import axios from "../../utils/axios";
import BrowseFilter from "./components/BrowseFilter";
import CountryContext from "../../contexts/country-context";
import ProductGrid from "./components/ProductGrid";
import QueryContext from "../../contexts/query-context";
import { useQuery } from "../../utils/query-params";
import _ from "lodash";
import "./_browse-page.scss";

const BrowsePage = () => {
  const [allProductLines, setAllProductLines] = useState([]);
  const [brands, setBrands] = useState([]);
  const { country } = useContext(CountryContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState(useQuery());
  const [tags, setTags] = useState([]);

  const categorizeTagGroups = (tagsToGroup = []) =>
    _.chain(tagsToGroup)
      .groupBy(({ category = "" } = {}) =>
        category.split("__")[0].toLowerCase()
      )
      .entries()
      .reduce(
        (obj, [key, group]) =>
          Object.assign(obj, { [key]: _.groupBy(group, "category") }),
        {}
      )
      .value();

  const filterProducts = (allProductLines) => {
    const queryTagGroups = categorizeTagGroups(
      (query.get("tags") || "")
        .split(",")
        .map((tagName) => tags.find((tag) => tag.name === tagName))
    );
    setFilteredProducts(
      allProductLines
        .filter(({ brand: { name } = {} }) =>
          query.get("brands")
            ? query.get("brands").split(",").includes(name)
            : true
        )
        .filter(({ tags }) => {
          const tagNames = tags.map(({ name }) => name);
          return query.get("tags")
            ? _.values(queryTagGroups.product).every((queryTags) =>
                queryTags.some(({ name }) => tagNames.includes(name))
              )
            : true;
        })
    );
  };

  const updateQuery = (query) => {
    window.history.replaceState(
      {},
      document.title,
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        query.toString()
    );

    filterProducts(allProductLines);
    setQuery(query);
  };

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

  const getProductLines = () => {
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
            brands (order_by: "name_insensitive:asc") {
              product_lines (order_by: "name_insensitive:asc") {
                brand {
                  id
                  name
                }
                images {
                  name
                  url
                }
                products (order_by: "name_insensitive:asc", filter__available: true${filterAvailability}) {
                  id
                  name
                  tags {
                    name
                    category
                  }
                }
                tags {
                  name
                  category
                }
              }
            }
          }
        `,
      },
    }).then(({ data: { data: { brands = [] } = {} } = {} }) => {
      const productLineArr = brands.reduce(
        (productLineArr, { productLines }) =>
          productLineArr.concat(productLines),
        []
      );
      setAllProductLines(productLineArr);
      // filterProducts(productLineArr);
      return productLineArr;
    });
  };

  useEffect(() => {
    // console.log(query.toString())
    Promise.all([getTags(), getProductLines(), getBrands()])
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  }, []);

  return (
    <QueryContext.Provider value={{ query, updateQuery }}>
      <section className="browse-page page">
        {isLoading ? (
          "..."
        ) : (
          <React.Fragment>
            <div className="browse-filter">
              <BrowseFilter
                brands={brands}
                tagCategoryGroups={categorizeTagGroups(tags)}
              />
            </div>
            <div className="browse-display">
              <ProductGrid products={filteredProducts} />
            </div>
          </React.Fragment>
        )}
      </section>
    </QueryContext.Provider>
  );
};

export default BrowsePage;
