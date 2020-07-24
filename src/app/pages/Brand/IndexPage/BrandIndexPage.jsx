import React, { Component } from "react";
import axios from "../../../utils/axios";
import "./_brand-index-page.scss";

class BrandIndexPage extends Component {
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
        include: "images",
        sort: "name_insensitive",
      },
    }).then(({ data: { data = [], included = [] } }) => {
      this.setState({
        brands: data,
      });
    });
  }

  render() {
    return (
      <section className="brand-index-page page">
        {this.state.brands.map(({ id, name, images: [logo = {}] = [] }) => (
          <li className="brand col-3" key={id}>
            <a
              className="brand-link"
              href={`/brands/${name
                .toLowerCase()
                .replace(/ /g, "-")
                .replace("™", "")}-${id}`}
            >
              <img className="brand-logo" alt={logo.name} src={logo.url} />
            </a>
          </li>
        ))}
      </section>
    );
  }
}

export default BrandIndexPage;
