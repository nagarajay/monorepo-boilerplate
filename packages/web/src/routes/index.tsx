import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./GeneralRoutes/Home";
import { Register } from "./UserRoutes/Register";

export const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
    </Switch>
  </BrowserRouter>
);
