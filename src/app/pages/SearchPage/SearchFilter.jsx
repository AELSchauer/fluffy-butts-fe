import React, { Component } from "react";
// import Accordion from "react-bootstrap/Accordion";
import Collapse from "../../components/Collapse";
import { camelToPascalCase } from "../../utils/case-helper";

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: props.brands || [],
      categories: props.categories || [],
      filterBrands: (props.query.get("brands") || "").split(","),
      filterTags: (props.query.get("tags") || "").split(","),
    };
  }

  isParamActive(categoryName, paramName) {
    const filterName = `filter${camelToPascalCase(categoryName)}`;
    return (this.state[filterName] || []).includes(paramName);
  }

  toggleParam(categoryName, paramName) {
    const filterName = `filter${camelToPascalCase(categoryName)}`;
    const filterTemp = this.state[filterName] || [];
    const idx = filterTemp.indexOf(paramName);
    idx < 0 ? filterTemp.push(paramName) : filterTemp.splice(idx, 1);
    this.setState({
      [filterName]: filterTemp.filter(Boolean).sort(),
    });
  }

  getLinkWithQuery() {
    const newQuery = new URLSearchParams(this.props.query);
    const filterBrands = this.state.filterBrands.filter(Boolean).sort();
    const filterTags = this.state.filterTags.filter(Boolean).sort();
    newQuery.set("page", 1);
    filterBrands.length
      ? newQuery.set("brands", filterBrands)
      : newQuery.delete("brands");
    filterTags.length
      ? newQuery.set("tags", filterTags)
      : newQuery.delete("tags");
    return `/search?${newQuery.toString()}`;
  }

  getSubmissionButtons() {
    return (
      <div className="submission-buttons">
        <a
          className="submission-button btn btn-secondary"
          href={this.getLinkWithQuery()}
        >
          Search
        </a>
        <a
          className="submission-button btn btn-secondary"
          href="/search?page=1"
        >
          Reset
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className="search-bar">
        {this.getSubmissionButtons()}
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
              {this.state.brands.map((brand, index) => {
                const brandNameSlub = brand.attributes.name.replace(/ /g, "-");
                return (
                  <li className="category-item" key={index}>
                    <input
                      type="checkbox"
                      checked={this.isParamActive(
                        "brands",
                        brand.attributes.name
                      )}
                      id={`checkbox-${brandNameSlub}`}
                      onChange={() =>
                        this.toggleParam("brands", brand.attributes.name)
                      }
                    />
                    <label htmlFor={`checkbox-${brandNameSlub}`}>
                      {brand.attributes.name}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {Object.entries(this.state.categories).map(
          ([categoryName, tags], index) => {
            const categorySlug = categoryName.replace(/ /g, '-').replace('&','')
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
                  <span className="category-name">{categoryName}</span>
                </h5>
                <div className="collapse" id={`collapse-${categorySlug}`}>
                  <ul className="category-items">
                    {tags.map((tag, index) => {
                      const tagNameSlug = tag.attributes.name.replace(
                        / /g,
                        "-"
                      );
                      return (
                        <li className="category-item" key={index}>
                          <input
                            type="checkbox"
                            checked={this.isParamActive(
                              "tags",
                              tag.attributes.name
                            )}
                            id={`checkbox-${tagNameSlug}`}
                            onChange={() =>
                              this.toggleParam("tags", tag.attributes.name)
                            }
                          />
                          <label htmlFor={`checkbox-${tagNameSlug}`}>
                            {tag.attributes.name}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          }
        )}
        {this.getSubmissionButtons()}
      </div>
    );
  }
}

export default SearchFilter;
