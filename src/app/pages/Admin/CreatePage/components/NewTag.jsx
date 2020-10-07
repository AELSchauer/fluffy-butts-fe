import React, { useContext } from "react";
import TagContext from "../../../../contexts/tag-context";

const CreateNewTag = ({ deleteButton, idx, tag = {}, categories = [] }) => {
  const { changeNewTag: onChange, removeNewTag: onRemove } = useContext(TagContext);

  return (
    <div className="row">
      <label>Name</label>
      <input
        className="col-4"
        type="text"
        value={(tag.name || "").toLowerCase()}
        onChange={(e) =>
          onChange(JSON.stringify({ ...tag, name: e.target.value }), idx)
        }
      />
      <label>Category</label>
      <select
        className="col-4"
        value={tag.category}
        onChange={(e) =>
          onChange(JSON.stringify({ ...tag, category: e.target.value }), idx)
        }
      >
        <option value={""} disabled selected>
          Select your option
        </option>
        {categories.map((category, idx) => (
          <option value={category}>{category}</option>
        ))}
        <option value="PATTERN__TBD">PATTERN__TBD</option>
        <option value="PRODUCT__TBD">PRODUCT__TBD</option>
        <option value="TBD">TBD</option>
      </select>
      {deleteButton ? (
        <i className="fas fa-minus" onClick={() => onRemove(idx)} />
      ) : (
        ""
      )}
    </div>
  );
};

export default CreateNewTag;
