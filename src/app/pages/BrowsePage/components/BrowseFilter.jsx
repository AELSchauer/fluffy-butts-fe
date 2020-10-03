import React, { useContext, useState } from "react";
import { toPascalCase, toTitleCase } from "../../../utils/case-helper";
import QueryContext from "../../../contexts/query-context";
import _ from "lodash";
import "../_browse-page.scss";

const BrowseFilter = ({ brands, tags }) => {
  const { query, updateQuery } = useContext(QueryContext);

  const [filterBrands, setFilterBrands] = useState(
    (query.get("brands") || "").split(",").filter(Boolean).sort()
  );
  const [filterTags, setFilterTags] = useState(
    (query.get("tags") || "").split(",").filter(Boolean).sort()
  );

  const categoryGroups = _.chain(tags)
    .groupBy(({ category }) => category.split("__")[0].toLowerCase())
    .entries()
    .reduce(
      (obj, [key, group]) =>
        Object.assign(obj, { [key]: _.groupBy(group, "category") }),
      {}
    )
    .value();

  const isParamActive = (categoryName, paramName) => {
    const filterName = `filter${toPascalCase(categoryName)}`;
    return (eval(filterName) || []).includes(paramName);
  };

  const toggleParam = (categoryName, paramName) => {
    const filterName = `filter${toPascalCase(categoryName)}`;
    const filterTemp = eval(filterName) || [];
    const idx = filterTemp.indexOf(paramName);
    idx < 0 ? filterTemp.push(paramName) : filterTemp.splice(idx, 1);
    eval(`set${toPascalCase(filterName)}`)(filterTemp.filter(Boolean).sort());

    query.set("page", 1);
    filterBrands.length
      ? query.set("brands", filterBrands)
      : query.delete("brands");
    filterTags.length ? query.set("tags", filterTags) : query.delete("tags");

    updateQuery(query);
  };

  const resetParams = () => {
    setFilterBrands("");
    setFilterTags("");

    query.set("page", 1);
    query.delete("brands");
    query.delete("tags");

    updateQuery(query);
  };

  const renderResetButton = () => {
    return (
      <div className="submission-buttons">
        <a
          className="submission-button btn btn-secondary"
          onClick={() => resetParams()}
        >
          Reset
        </a>
      </div>
    );
  };

  const renderTagSection = (categories) =>
    Object.entries(categories).map(([categoryName, tags], index) => {
      const categoryDisplayName = toTitleCase(
        categoryName.split("__")[1].replace(/_/g, " ")
      ).replace(/ and /gi, " & ");
      const categorySlug = categoryName.replace(/_+/g, "-");
      return (
        <div className="category-group" key={index}>
          <h5
            className="category-header"
            data-toggle="collapse"
            data-target={`#collapse-${categorySlug}`}
            aria-expanded="false"
            aria-controls={`collapse-${categorySlug}`}
          >
            <i className="fas fa-caret-right" />
            <span className="category-name">{categoryDisplayName}</span>
          </h5>
          <div className="collapse" id={`collapse-${categorySlug}`}>
            <ul className="category-items">
              {tags.map((tag, index) => {
                const tagNameSlug = tag.name.replace(/ /g, "-");
                return (
                  <li className="category-item" key={index}>
                    <input
                      type="checkbox"
                      checked={isParamActive("tags", tag.name)}
                      id={`checkbox-${tagNameSlug}`}
                      onChange={() => toggleParam("tags", tag.name)}
                    />
                    <label htmlFor={`checkbox-${tagNameSlug}`}>
                      {tag.name}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    });

  return (
    <div className="browse-bar">
      {renderResetButton()}
      <div className="category-group" key="brands">
        <h5
          className="category-header"
          data-toggle="collapse"
          data-target="#collapse-brands"
          aria-expanded="false"
          aria-controls="collapse-brands"
        >
          <i className="fas fa-caret-right" />
          <span className="category-name">Brands</span>
        </h5>
        <div className="collapse" id="collapse-brands">
          <ul className="category-items">
            {brands.map((brand, index) => {
              const brandNameSlug = brand.name.replace(/ /g, "-");
              return (
                <li className="category-item" key={index}>
                  <input
                    type="checkbox"
                    checked={isParamActive("brands", brand.name)}
                    id={`checkbox-${brandNameSlug}`}
                    onChange={() => toggleParam("brands", brand.name)}
                  />
                  <label htmlFor={`checkbox-${brandNameSlug}`}>
                    {brand.name}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {renderTagSection(categoryGroups.product)}
      {renderTagSection(categoryGroups.pattern)}
      {renderResetButton()}
    </div>
  );
};

export default BrowseFilter;
