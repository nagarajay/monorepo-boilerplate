import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { concat } from "apollo-link";
import { Platform } from "react-native";

const host =
  Platform.OS === "ios"
    ? "http://localhost:4000/graphql"
    : "http://10.0.2.2:4000/graphql";

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const httpLink = new HttpLink({
  uri: host,
  credentials: "include"
});

export const client = new ApolloClient({
  link: concat(errorLink, httpLink),
  cache: new InMemoryCache()
});
