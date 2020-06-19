import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import groupBy from "lodash.groupby";
import Accordion from "react-bootstrap/Accordion";

const SearchFilter = ({ query }) => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterTags, setFilterTags] = useState(
    (query.get("tags") || "").split(",")
  );
  const [filterBrand, setFilterBrand] = useState(query.get("brand") || "");

  const getTags = async () =>
    axios({
      method: "get",
      url: "/tags",
      params: {
        sort: ["category", "name"],
      },
    }).then(({ data: { data = [] } }) => data);

  const getBrands = async () =>
    axios({
      method: "get",
      url: "/brands",
      params: {
        sort: ["name_insensitive"],
      },
    }).then(({ data: { data = [] } }) => data);

  useEffect(() => {
    async function fetchData() {
      const brandResult = await getBrands();
      setBrands(brandResult);
      const tagResult = await getTags();
      const categories = groupBy(tagResult, "attributes.category");
      setCategories(categories);
    }
    fetchData();
  }, []);

  const isTagActive = (tagName) => (filterTags || []).includes(tagName);

  const toggleTag = (tagName) => {
    const filterTagsTemp = filterTags || [];
    console.log(filterTags);
    const idx = filterTagsTemp.indexOf(tagName);
    idx < 0 ? filterTagsTemp.push(tagName) : filterTagsTemp.splice(idx, 1);
    setFilterTags(filterTagsTemp.filter(Boolean).sort());
  };

  const getLinkWithQuery = () => {
    const newQuery = new URLSearchParams(query);
    const filterTagsTemp = filterTags.filter(Boolean).sort()
    newQuery.set("page", 1);
    filterTagsTemp.length
      ? newQuery.set("tags", filterTagsTemp)
      : newQuery.delete("tags");
    filterBrand ? newQuery.set("brand", filterBrand) : newQuery.delete("brand");
    return `/search?${newQuery.toString()}`;
  };

  const getSubmissionButtons = () => {
    return (
      <div className="submission-buttons">
        <a className="btn btn-secondary" href={getLinkWithQuery()}>
          Search
        </a>
        <a className="btn btn-secondary" href="/search?page=1">
          Reset
        </a>
      </div>
    );
  };

  return (
    <div className="product-search">
      {getSubmissionButtons()}
      <Accordion className="category-group" key="brands">
        <Accordion.Toggle
          as={"h5"}
          eventKey="brands"
          className="category-header"
        >
          <i className="fas fa-caret-right" />
          <span className="category-name">Brands</span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="brands">
          <ul className="category-tags">
            <li className="category-tag" key={0}>
              <input
                type="radio"
                checked={filterBrand === ""}
                id={`radio-all-brands`}
                onChange={() => setFilterBrand("")}
              />
              <label htmlFor={`radio-all-brands`}>All Brands</label>
            </li>
            {brands.map((brand, index) => {
              const brandNameSlug = brand.attributes.name.replace(/ /g, "-");
              return (
                <li className="category-tag" key={index + 1}>
                  <input
                    type="radio"
                    checked={filterBrand === brand.attributes.name}
                    id={`radio-${brandNameSlug}`}
                    onChange={() => setFilterBrand(brand.attributes.name)}
                  />
                  <label htmlFor={`radio-${brandNameSlug}`}>
                    {brand.attributes.name}
                  </label>
                </li>
              );
            })}
          </ul>
        </Accordion.Collapse>
      </Accordion>
      {Object.entries(categories).map(([categoryName, tags], index) => {
        return (
          <Accordion className="category-group" key={index}>
            <Accordion.Toggle
              as={"h5"}
              eventKey={index}
              className="category-header"
            >
              <i className="fas fa-caret-right" />
              <span className="category-name">{categoryName}</span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index}>
              <ul className="category-tags">
                {tags.map((tag, index) => {
                  const tagNameSlug = tag.attributes.name.replace(/ /g, "-");
                  return (
                    <li className="category-tag" key={index}>
                      <input
                        type="checkbox"
                        checked={isTagActive(tag.attributes.name)}
                        id={`checkbox-${tagNameSlug}`}
                        onChange={() => toggleTag(tag.attributes.name)}
                      />
                      <label htmlFor={`checkbox-${tagNameSlug}`}>
                        {tag.attributes.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Accordion.Collapse>
          </Accordion>
        );
      })}
      {getSubmissionButtons()}
    </div>
  );
};

export default SearchFilter;
