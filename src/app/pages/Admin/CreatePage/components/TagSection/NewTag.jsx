import React, { useContext } from "react";
import TagContext from "../../../../../contexts/tag-context";

const CreateNewTag = ({ tag = {}, categories = [] }) => {
  const { changeNewTag: onChange, removeNewTag: onRemove } = useContext(
    TagContext
  );

  return (
    <li className="tag col-12 info-display">
      <label>ID</label>
      <input type="text" value={tag.id} disabled />
      <label>Name</label>
      <input
        type="text"
        required
        value={(tag.name || "").toLowerCase()}
        onChange={(e) => onChange({ ...tag, name: e.target.value })}
      />
      <label>Category</label>
      <select
        value={tag.category}
        required
        onChange={(e) => onChange({ ...tag, category: e.target.value })}
        defaultValue=""
      >
        <option value="" disabled>
          Select your option
        </option>
        {categories.map((category, idx) => (
          <option key={idx} value={category}>
            {category}
          </option>
        ))}
        <option value="PATTERN__TBD">PATTERN__TBD</option>
        <option value="PRODUCT__TBD">PRODUCT__TBD</option>
        <option value="TBD">TBD</option>
      </select>
      <label>Display Order</label>
      <input
        value={tag.displayOrder}
        onChange={(e) => onChange({ ...tag, displayOrder: e.target.value })}
      />
      <i className="fas fa-minus" onClick={() => onRemove(tag)} />
    </li>
  );
};

export default CreateNewTag;
