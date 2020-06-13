import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import routes from "./routes";
import "./index.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <h1>Fluffy Butts</h1>
          {routes.map(({ path, title }, i) => (
            <Link to={path}>{title}</Link>
          ))}
        </nav>
        <Switch>
          {routes.map((route, i) => (
            <Route
              path={route.path}
              render={(props) => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} />
              )}
            />
          ))}
        </Switch>
      </header>
    </div>
  );
};

export default App;
