This setup is the template for overall monorepo setup template.

The project uses

- Typescript
- PostGres
- ApolloServer
- ApolloClient
- GraphQL
- TypeORM
- TypeGraphQL
- Formik - For forms for both app and web
- Social Login - Twitter, Facebook and Google Setup

P.S -> The boiler plate does not use any styling library. Please use as per your preference.

GFS(General Folder Structure)
The general structure for app and web is that the Route will point to the route component.
The Route Component combines LayoutModel with View Component as child.
If there are multiple Views then the styling will be done at Route Component.

Layout may have AppBar, Footer, Side Drawer or any other combination of any of the following.
Flexible Scrolling is also need of the hour.

Views connects the Controller with the View.

Route(routes) --> Layout(layouts) --> View/s(modules)

The folder structures are as follows:
app (GFS applied) - Front End for App - React Native
common - Yup Validation - Used by server/web/app
controller - Apollo Client - React Hooks - Used by web and app
server - Graphql - TypeORM - ApolloServer - TypeGraphql
web (GFS applied) - Front for Website - React

Assumptions:

1. PostGres or MySQL or other database utility is installed.
2. Redis Cli is installed.

Installation Instruction :

1.  Clone the repository.
2.  Change folder directory to the project folder.
3.  Run yarn install.
4.  In the project folder change the ormconfig.json file to add the database connectivity credentials.
5.  Create the respective databases for development and test environment.
6.  Go to the common folder and run command yarn build.
7.  Go to the controller folder and run command yarn build.
8.  Go to server folder and create a copy of .env.example file as .env.
9.  Provide values in the .env file as appropriate. Social Logins also activated from this file.
10. Run yarn install again just to be sure all the packages are up to date.
11. Run yarn start at server / web / app as required.
