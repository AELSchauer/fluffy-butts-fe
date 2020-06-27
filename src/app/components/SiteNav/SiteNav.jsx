import React from "react";
import "./_site-nav.scss";

const SiteNav = ({ routes = [] }) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-light site-navbar">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#siteNavbar"
        aria-controls="siteNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="siteNavbar">
        <div className="navbar-brand">
          <img
            className="navbar-brand-image"
            src="https://storage.googleapis.com/fluffy-butts/Fluffy%20Butts/logo.png"
          />
          <h1 className="navbar-brand-title">Fluffy Butts</h1>
        </div>
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          {routes
            .filter(({ includeInNavBar }) => includeInNavBar)
            .map(({ path, title }, i) => (
              <li className="nav-item active" key={i}>
                <a className="nav-link" href={path}>
                  {title}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default SiteNav;
