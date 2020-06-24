import React, { Component } from "react";
import axios from "../../utils/axios";
import groupBy from "lodash.groupby";
import Accordion from "react-bootstrap/Accordion";
import { camelToPascalCase } from "../../utils/case-helper";

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      categories: [],
      filterBrands: (props.query.get("brands") || "").split(","),
      filterTags: (props.query.get("tags") || "").split(","),
    };
  }

  async getBrands() {
    return axios({
      method: "get",
      url: "/brands",
      params: {
        sort: ["name_insensitive"],
      },
    }).then(({ data: { data = [] } }) => this.setState({ brands: data }));
  }

  async getTags() {
    return axios({
      method: "get",
      url: "/tags",
      params: {
        sort: ["category", "name"],
      },
    }).then(({ data: { data = [] } }) =>
      this.setState({ categories: groupBy(data, "attributes.category") })
    );
  }

  componentDidMount() {
    this.getBrands();
    this.getTags();
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
        <a className="btn btn-secondary" href={this.getLinkWithQuery()}>
          Search
        </a>
        <a className="btn btn-secondary" href="/search?page=1">
          Reset
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className="product-search">
        {this.getSubmissionButtons()}
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
          </Accordion.Collapse>
        </Accordion>
        {Object.entries(this.state.categories).map(
          ([categoryName, tags], index) => {
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
                </Accordion.Collapse>
              </Accordion>
            );
          }
        )}
        {this.getSubmissionButtons()}
      </div>
    );
  }
}

export default SearchFilter;
