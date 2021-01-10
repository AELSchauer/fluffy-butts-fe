import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CountryContext from "./contexts/country-context";
import { getSupportedCountry } from "./utils/supported-countries";
import { Route, Switch } from "react-router-dom";
import routes from "./routes";
import SiteNav from "./components/SiteNav";


import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

const App = () => {
  const [country, updateCountry] = useState(
    Cookies.get("fluffy-butts.country")
      ? JSON.parse(Cookies.get("fluffy-butts.country"))
      : getSupportedCountry("World")
  );

  const setCountry = (country) => {
    Cookies.set("fluffy-butts.country", JSON.stringify(country), {
      sameSite: "lax",
    });
    updateCountry(country);
  };

  const getCountry = async () => {
    if (!Cookies.get("fluffy-butts.country")) {
      return axios
        .get("https://ipapi.co/json/")
        .then(({ data: { country_name } = {} }) => {
          setCountry(getSupportedCountry(country_name));
        });
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      <React.Fragment>
        <header>
          <SiteNav routes={routes} />
        </header>
        <Switch>
          {routes.map((route, i) => (
            <Route
              path={route.path}
              key={i}
              render={(props) => <route.component {...props} />}
            />
          ))}
        </Switch>
        <footer>
          <div className="credits">
            <a href="https://www.freepik.com/free-photos-vectors/baby">
              Fluffy Butts Logo created by freepik - www.freepik.com
            </a>
            <a href="https://www.freepik.com/free-photos-vectors/baby">
              Home page image created by grmarc - www.freepik.com
            </a>
          </div>
        </footer>
      </React.Fragment>
    </CountryContext.Provider>
  );
};

export default App;
