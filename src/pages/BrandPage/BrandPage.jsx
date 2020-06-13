import React, { Component } from "react";
import axios from "../../utils/axios";
import { findOne } from "../../utils/json-api";

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
      const brands = data.map(
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
      );
      this.setState({ brands });
    });
  }

  render() {
    return <ul>{JSON.stringify(this.state.brands)}</ul>;
  }
}

export default BrandPage;
