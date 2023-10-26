# Fiyu Frontend seed project

## Prerequisite for adding capabilities to your workspace

- Install latest Node.js LTS version

- Install Powershell Core latest version (recommended for Windows users)

- Run `npm install -g nx` to install **nx** package as global dependency.

- Setup environment variables `NPM_TOKEN` and `PROJECT_NPM_TOKEN` in user profile (e.g. bash profile, Powershell profile)

- **Windows** users - for permanent shell usage you can set it in Powershell profile, like this:

  ```bash
  // edit powershell profile
  notepad $PROFILE
  // set env vars at top of the file
  $env:NPM_TOKEN = "xxxx"
  $env:PROJECT_NPM_TOKEN = "xxxx"
  ```

- **Mac / Linux** users - for permanent shell usage you can set it in bash / zsh profile, like this:

  ```bash
  // edit bash profile (if profile does not exist create it)
  nano ~/.bash_profile
  // set env vars at top of the file
  export NPM_TOKEN="xxxx"
  export PROJECT_NPM_TOKEN="xxxx"
  ```

  ```bash
  // edit zsh profile (if profile does not exist create it)
  nano ~/.zshrc
  // set env vars at top of the file
  export NPM_TOKEN="xxxx"
  export PROJECT_NPM_TOKEN="xxxx"
  ```

- Reset terminal after setting environment variables

- Run `npm install`

## Generate an application

Run this commands to generate an application and starter components:

`nx generate @fiyu/lib-toolkit:app-generator --name=<appname> --orgName=<orgname> --gitlabProjectId=<gitlabprojectid> --gitlabGroupName=<gitlabgroupname> --moduleName=<modulename>`

`nx generate @fiyu/lib-toolkit:create-app-components-generator --name=<appname> --orgName=<orgname> --moduleName=<modulename>`

## Generate a library

Run this command to generate a library:

`nx generate @fiyu/lib-toolkit:lib-toolkit --name=<modulename> --importPathPrefix=<orgname> --appName=<appname>`.

> importPathPrefix is used for npm package scope, e.g. @<orgname>/<modulename> (@fiyu/lib-toolkit)

Libraries are shareable across libraries and applications. They can be imported from `@<orgname>/<modulename>`.

## Development server

Run `ng serve <appname> --configuration=dev` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component <my-component> --project=<appname>` to generate a new component.

## Build

Run `ng build <appname>` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test <appname>` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e <appname>` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
