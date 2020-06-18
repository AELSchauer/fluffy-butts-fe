import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import routes from "./routes";
import "./index.scss";

function App() {
  return (
    <React.Fragment>
      <header>
        <nav className="site-nav">
          <h1 className="site-title">Fluffy Butts</h1>
          <ul className="nav-links">
            {routes.map(({ path, title }, i) => (
              <li className="nav-link">
                <Link to={path} key={i}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <Switch>
        {routes.map((route, i) => (
          <Route
            path={route.path}
            key={i}
            render={(props) => (
              <route.component {...props} routes={route.routes} />
            )}
          />
        ))}
      </Switch>
    </React.Fragment>
  );
}

export default App;
