import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import routes from "./routes";
import "./index.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <h1>Fluffy Butts</h1>
          {routes.map(({ path, title }, i) => (
            <Link to={path} key={i}>{title}</Link>
          ))}
        </nav>
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
      </header>
    </div>
  );
};

export default App;
