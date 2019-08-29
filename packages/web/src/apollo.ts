import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { concat } from "apollo-link";

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
  credentials: "include"
});

export const client = new ApolloClient({
  link: concat(errorLink, httpLink),
  cache: new InMemoryCache()
});
