import React, { Fragment } from "react";

const CollapsibleSection = ({ children, id, label }) => {
  return (
    <Fragment>
      <span
        className="info-toggle"
        data-toggle="collapse"
        data-target={`#${id}`}
        aria-expanded="true"
        aria-controls={id}
      >
        <i className="fas fa-caret-right" />
        {label}
      </span>
      <div className="collapse show" id={id}>
        {children}
      </div>
    </Fragment>
  );
};

export default CollapsibleSection;
