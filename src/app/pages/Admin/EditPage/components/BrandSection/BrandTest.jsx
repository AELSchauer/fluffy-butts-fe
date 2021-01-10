import _ from "lodash";
import React, { useEffect, useState } from "react";

import "./_brand-section.scss";

const BrandTest = ({ path, rootData, onChange }) => {
  const [brand, setBrand] = useState({
    id: `tmp-${Date.now()}`,
    mutation: true,
  });

  useEffect(() => {
    !!rootData && setBrand(_.get(rootData, path));
    console.log(brand);
  });

  const changeBrand = (path, data) => {
    onChange(path, data);
    setBrand(data);
  };

  return (
    <div className="info-display">
      <label>ID</label>
      <input type="text" value={brand.id} disabled />
      <label>Name</label>
      <input
        type="text"
        required
        value={brand.name}
        onChange={(e) =>
          changeBrand(path, {
            ...brand,
            name: e.target.value,
            mutation: true,
          })
        }
      />
    </div>
  );
};

export default BrandTest;
