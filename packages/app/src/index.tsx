import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";

import { Routes } from "./routes";
import { client } from "./apollo";

export default class App extends React.PureComponent {
  render() {
    return (
      <ApolloProvider client={client}>
        <Routes></Routes>
      </ApolloProvider>
    );
  }
}
