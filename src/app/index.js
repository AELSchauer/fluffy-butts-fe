import React from "react";
import { Route, Switch } from "react-router-dom";
import routes from "./routes";
import SiteNav from "./components/SiteNav";
import "./index.scss";

const App = () => {
  return (
    <React.Fragment>
      <header>
        <SiteNav routes={routes} />
      </header>
      <Switch>
        {routes.map((route, i) => (
          <Route
            path={route.path}
            key={i}
            render={(props) => (
              <route.component {...props} />
            )}
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
  );
}

export default App;
