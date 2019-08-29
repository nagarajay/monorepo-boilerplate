import * as React from "react";
import { NativeRouter, Route, Switch } from "react-router-native";

import { Home } from "./General Routes/Home";
import { Register } from "./UserRoutes/Register";

export const Routes = () => (
  <NativeRouter>
    <Switch>
      <Route exact path="/register" component={Home} />
      <Route exact path="/" component={Register} />
    </Switch>
  </NativeRouter>
);
