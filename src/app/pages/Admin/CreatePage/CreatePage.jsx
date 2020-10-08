import React, { createContext, useEffect, useState } from "react";
import axios from "../../../utils/axios";
import CreateBrand from "./components/BrandSection";
import TagContext from "../../../contexts/tag-context";
import TagSection from "./components/TagSection";
import _ from "lodash";
import "./_create-page.scss";

const CreatePage = () => {
  const [brand, setBrand] = useState({});
  const [existingTags, setExistingTags] = useState([]);
  const [newTags, setNewTags] = useState([]);

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
      setExistingTags(tags);
    });
  }, []);

  const addNewTag = () => {
    setNewTags(newTags.concat([{ id: Date.now() }]));
  };

  const changeNewTag = (newTag) => {
    const idx = _.findIndex(newTags, { id: newTag.id });
    setNewTags([...newTags.slice(0, idx), newTag, ...newTags.slice(idx + 1)]);
  };

  const removeNewTag = (newTag) => {
    const idx = _.findIndex(newTags, { id: newTag.id });
    setNewTags([...newTags.slice(0, idx), ...newTags.slice(idx + 1)]);
  };

  return (
    <TagContext.Provider
      value={{ existingTags, newTags, addNewTag, changeNewTag, removeNewTag }}
    >
      <section className="create-page page">
        <form>
          <div>
            <h3>Brand</h3>
            <CreateBrand brand={brand} onChange={setBrand} />
          </div>
          <TagSection />
        </form>
      </section>
    </TagContext.Provider>
  );
};

export default CreatePage;
