import React, { createContext, useEffect, useState } from "react";
import axios from "../../../utils/axios";
import CreateBrand from "./components/Brand";
import TagContext from "../../../contexts/tag-context";
import TagSection from "./components/TagSection";
// import "./_brand-index-page.scss";

const CreatePage = () => {
  const [brand, setBrand] = useState({});
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            tags (order_by: "category:asc,name:asc") {
              id
              name
              category
            }
          }
        `,
      },
    }).then(({ data: { data: { tags = [] } = {} } = {} }) => {
      setTags(tags);
    });
  }, []);

  const changeTag = (tag, tagIdx) => {
    setTags([...tags.slice(0, tagIdx), tag, ...tags.slice(tagIdx + 1)]);
  };

  const removeTag = (tagIdx) => {
    setTags([...tags.slice(0, tagIdx), ...tags.slice(tagIdx + 1)]);
  };

  return (
    <TagContext.Provider value={{ tags, changeTag, removeTag }}>
      <section className="create-page page">
        <form>
          <div>
            <h3>Brand</h3>
            <CreateBrand brand={brand} onChange={setBrand} />
          </div>
          <div>
            <TagSection />
          </div>
        </form>
      </section>
      {JSON.stringify(brand)}
    </TagContext.Provider>
  );
};

export default CreatePage;
