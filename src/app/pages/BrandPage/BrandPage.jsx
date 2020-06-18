import React, { Component } from "react";
import axios from "../../utils/axios";
import { findOne } from "../../utils/json-api";
import "./brand-page.scss";

class BrandPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      url: "/brands",
      params: {
        include: ["images"],
        sort: ["name_insensitive"],
      },
    }).then(({ data: { data = [], included = [] } }) => {
      this.setState({
        brands: data.map(
          ({
            id,
            type,
            attributes,
            relationships: { images: { data: [imageRel = {}] = [] } = {} },
          }) => ({
            id,
            type,
            attributes,
            logo: findOne(included, imageRel),
          })
        ),
      });
    });
  }

  render() {
    return (
      <div className="brands brand-page">
        {this.state.brands.map((brand) => (
          <li className="brand col-3" key={brand.id}>
            <a
              className="brand-link"
              href={`/search?brand=${brand.attributes.name}&page=1`}
            >
              <img
                className="brand-logo"
                alt={brand.logo.attributes.name}
                src={brand.logo.attributes.link}
              />
            </a>
          </li>
        ))}
      </div>
    );
  }
}

export default BrandPage;
