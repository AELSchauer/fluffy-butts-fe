import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import routes from "./routes";
import "./index.scss";

function App() {
  return (
    <React.Fragment>
      <header>
        <nav className="site-nav">
          <div className="site-logo">
            <img
              className="site-logo-image"
              src="https://storage.googleapis.com/fluffy-butts/Fluffy%20Butts/logo.png"
            />
            <h1 className="site-title">Fluffy Butts</h1>
          </div>
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
      <a href="https://www.freepik.com/free-photos-vectors/baby">
        Fluffy Butts Logo created by freepik - www.freepik.com
      </a>
    </React.Fragment>
  );
}

export default App;
