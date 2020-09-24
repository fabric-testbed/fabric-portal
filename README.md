# FABRIC Portal

The portal is a web based reflection of the user's rights and project associations within [FABRIC](https://fabric-testbed.net//0). From the portal the user can view projects, resources and other tooling that they have rights to interact with as deemed by project membership. The portal relies on the information it receives from [CILogon](https://www.cilogon.org/home)/[COmanage](https://www.cilogon.org/comanage) and from the System Services to determine what the user sees or has access to.

## Overview

![FABRIC Portal Site Map v2](https://user-images.githubusercontent.com/37635744/94174176-f2ae9800-fe62-11ea-91e3-060e59ebb29e.png)

The portal provides a graphical user interface to many testbed functions. Those include:

- Project management - by interfacing with the Project Registry the portal allows users to:
  - Manage roles of other users;
  - Manage projects - e.g. create projects, edit project metadata, manage project memberships, request to be added or removed from projects;
- Credential management - the Portal interfaces with Credential Manager to provide a graphical interface for acquiring credentials needed to use tools;
- Resource discovery - ability to find out what the testbed resources are, their level of availability with data visualization such as pie charts and histograms. Part of this function is also informing users of any maintenance events on any testbed resources;
- Experiment profile management - each FABRIC experiment is launched using a profile that describes the topology and configuration of the experiment slice and the configuration of the measurement resources. A profile can be private or public based on users’ choices. The portal provides users a list of available public profiles, allows them to create new profiles and selectively share their profile with others. Public profiles can be cloned and modified by users to customise to their needs;
- Launch and run experiments - by interfacing with the control framework the portal allows experiments to be graphically defined and launched using an experiment profile. The portal provides a list of publicly available experiment profiles as well as private profiles belonging to an individual project. The portal allows users to interact with provisioned resources, collect measurement information (by interacting with the measurement framework) from the experiment;
  - Possible extensions: ability to cite experiment profiles via a persistent URL and/or a and show the scholarly communication via data visualization of the experiment profile citation relationship like node-link network diagrams;
- User profile page - each user gets a profile page where they can set their preferences for e.g. communications about outages and level of visibility of their information in the portal to other users. Messages from the portal and other users are shown in the format of an inbox. Identity attributes are populated into the profile from CI Logon and are considered immutable;
- The portal provides links to the user support system and JupyterHub for convenience;
- User guide page. This page works as a knowledge base including portal tutorials with rich text and images, FAQs supporting user search and feedback methods such as email and phone.

![FABRIC Portal - portal design v2](https://user-images.githubusercontent.com/37635744/94175976-694c9500-fe65-11ea-987f-2d3e9b75d2c2.png)

FABRIC System Services and Portal consist of multiple components:

- Portal - presents the UI to users, interacts with other components;
- Credential Manager - issues credentials for users to utilize the testbed resources via APIs;
- Project Registry - manages and maintains projects and their memberships;
- CI Logon/COmanage instance - provides federated authentication, also provides identity attributes to other components for authorization decisions;
- User support system - provides ability to ask questions about the testbed, provide feedback to operators etc.

## Environment Setup

For local development you will need install [Node JS](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) will automatically be installed.

For IDE, [Visual Studio Code](https://code.visualstudio.com/) is highly recommended. After installation of VS Code, there are two helpful extensions to install for better development experience: [Simple React Snippets](https://marketplace.visualstudio.com/items?itemName=burkeholland.simple-react-snippets) and [Prettier Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

## Scripts

In the project directory, you can run:

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

### Deployment

TODO
