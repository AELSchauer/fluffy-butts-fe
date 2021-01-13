import _ from "lodash";
import React from "react";
import Input from "../Input";
import PatternSection from "../PatternSection/PatternSectionTest";
import ProductLineSection from "../ProductLineSection/ProductLineSectionTest";
import "./_brand-section.scss";

const BrandTest = ({ path }) => {
  return (
    <div>
      <div className="info-display">
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} />
      </div>
      <PatternSection path={[...path, "patterns"]} />
      <ProductLineSection path={[...path, "productLines"]} />
    </div>
  );
};

export default BrandTest;
