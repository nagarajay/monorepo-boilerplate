export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ChangePasswordInput = {
  token: Scalars["String"];
  newPassword: Scalars["String"];
};

export type EmailExistsInput = {
  email: Scalars["String"];
};

export type ErrorOutput = {
  __typename?: "ErrorOutput";
  path: Scalars["String"];
  message: Scalars["String"];
};

export type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type LoginOutput = {
  __typename?: "LoginOutput";
  errors?: Maybe<Array<ErrorOutput>>;
  sessionId: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  changePassword?: Maybe<Array<ErrorOutput>>;
  confirmUser?: Maybe<Scalars["Boolean"]>;
  forgotPassword?: Maybe<Array<ErrorOutput>>;
  login?: Maybe<LoginOutput>;
  logout: Scalars["Boolean"];
  register?: Maybe<Array<ErrorOutput>>;
  removeAllUserSession: Scalars["Boolean"];
};

export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};

export type MutationConfirmUserArgs = {
  token: Scalars["String"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  emailExists?: Maybe<Array<ErrorOutput>>;
};

export type QueryEmailExistsArgs = {
  data: EmailExistsInput;
};

export type RegisterInput = {
  fullname: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  firstname?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
};
