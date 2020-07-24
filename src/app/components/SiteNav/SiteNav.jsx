import React, { useContext } from "react";
import CountryContext from "../../contexts/country-context";
import { supportedCountries } from "../../utils/supported-countries";
import "./_site-nav.scss";

const SiteNav = ({ routes = [] }) => {
  const { country, setCountry } = useContext(CountryContext);
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
        <a className="navbar-brand" href="/">
          <img
            className="navbar-brand-image"
            src="https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/Fluffy+Butts/Logo.png"
          />
          <h1 className="navbar-brand-title">Fluffy Butts</h1>
        </a>
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              {country.emoji} {country.name}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              {supportedCountries.map((country) => {
                return (
                  <div
                    className="dropdown-item"
                    onClick={() => setCountry(country)}
                  >
                    {country.name}
                  </div>
                );
              })}
            </div>
          </li>
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
