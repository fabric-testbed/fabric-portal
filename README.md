# FABRIC Portal

The portal is a web based reflection of the user's rights and project associations within [FABRIC](https://fabric-testbed.net//0). From the portal the user can view projects, resources and other tooling that they have rights to interact with as deemed by project membership. The portal relies on the information it receives from [CILogon](https://www.cilogon.org/home)/[COmanage](https://www.cilogon.org/comanage) and from the System Services to determine what the user sees or has access to.

## Overview

![FABRIC Portal Site Map - Version 2](https://user-images.githubusercontent.com/37635744/134710001-610fa508-acc4-4732-a559-a8c24a584e09.png)

The portal provides a graphical user interface to many testbed functions. Those include:

- **User Profile Page**: users view their account information such as name, email, CILogon ID (Identity attributes are populated into the profile from CI Logon and are considered immutable) on the user profile page. Global roles and project roles are shown in tables as well as the ability of refreshing roles and requesting roles. Users have access to their stored ssh public keys and are able to view, search and download keys.
- **Credential Management**: the Portal calls Credential Manager API to provide a graphical interface for creating/ refreshing/ revoking credential tokens to use tools.
- **Project Management**: by interfacing with Project Registry API, the portal allows users to
  - Manage roles of other users
  - Manage projects - e.g. create projects, edit project metadata, manage project memberships, request to be added or removed from projects
- **Resource Discovery**: shows testbed resource availability summary in table; presents site resource availability in both resource map visualization and data table.
- **Experiment Profile Management**: each FABRIC experiment is launched using a profile that describes the topology and configuration of the experiment slice and the configuration of the measurement resources. A profile can be private or public based on users’ choices. The portal provides users a list of available public profiles, allows them to create new profiles and selectively share their profile with others. Public profiles can be cloned and modified by users to customize to their needs.
- **Launch and Run Experiments**: by interfacing with the control framework the portal allows experiments to be graphically defined and launched using an experiment profile. The portal provides a list of publicly available experiment profiles as well as private profiles belonging to an individual project. The portal allows users to interact with provisioned resources, collect measurement information (by interacting with the measurement framework) from the experiment.
  - Possible extensions: ability to cite experiment profiles via a persistent URL and/or a and show the scholarly communication via data visualization of the experiment profile citation relationship like node-link network diagrams.
- **Links**: The portal provides links to the Knowledge Base site and JupyterHub.

![FABRIC Portal - portal design v4](https://user-images.githubusercontent.com/37635744/134709211-2a56d05b-db4c-496f-8bef-9cb3face78a8.png)

FABRIC System Services and Portal consist of multiple components:

- **Portal**: presents the graphic interface to users and interacts with other components;
- **Project Registry**: manages and maintains projects and their memberships;
- **Credential Manager**: issues credentials for users to utilize the testbed resources via Control Framework APIs;
- **Experiment Profile Manager**: stores and allows to share experiment profile definitions;
- **User Information Service**: manages information/attributes about the users that are not stored in CI Logon - e.g. SSH keys, alternative identifiers (e.g. Orcid, Web-of-science etc) and any social aspects related to user identity;
- **CI Logon/COmanage Instance**: provides federated authentication, also provides identity attributes to other components for authorization decisions;
- **SSH Proxy Service**: allows browser-based SSH logins into slivers via Portal;
- **Knowledge Base**: contains user support documentation, allows users to ask questions and discuss about the testbed, provide feedback to operators etc;
- **JupyterHub**: provides on-demand notebooks for experimenters.

## Environment and Configuration

For local development you will need install [Node JS](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) will automatically be installed.

For IDE, [Visual Studio Code](https://code.visualstudio.com/) is highly recommended. After installation of VS Code, there are two helpful extensions to install for better development experience: [Simple React Snippets](https://marketplace.visualstudio.com/items?itemName=burkeholland.simple-react-snippets) and [Prettier Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

`config.template`

- This is the config file containing API url information;
- Copy and paste this file as config.json in /src;
- Replace \*\*\*\*\*\* with API domain names;
- Delete the 4 lines of comments and save.

## Scripts

In the project directory, you can run:

### `npm install`

Install all modules listed as dependencies in package.json.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Resources

- JavaScript
  - [React](https://reactjs.org/)
  - [Node JS](https://nodejs.org/en/)
