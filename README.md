# FABRIC Portal

FABRIC Portal is a web based reflection of the user's rights and project associations within [FABRIC](https://fabric-testbed.net//0). From Portal the user can view resources, manage projects and experiments. Portal relies on the information it receives from [CILogon](https://www.cilogon.org/home)/[COmanage](https://www.cilogon.org/comanage) and from the System Services to determine what the user sees or has access to.

## Overview

![FABRIC Portal Site Map - v5](https://github.com/user-attachments/assets/0dacf05f-6326-473c-9f3e-954517e4b8f2)

Portal provides a graphical user interface to many testbed functions:

- **Homepage**: Users will find a carousel of introduction to FABRIC Portal and recent news on Portal homepage, along with the resource topology map, Facility updates and FABRIC partners.
- **Resource Discovery**: Resources page shows testbed resource availability summary in table; presents site resource availability in both resource map visualization and data table.
- **Experiments**: Users can manage projects, slices, tokens and SSH keys on Experiments page. The UI will differ based on the user's privileges.
  - **Project Management**: by interfacing with the FABRIC Core API, Portal allows users to manage projects based on their roles, including the ability to create projects, edit project metadata, edit project permissions and manage project memberships.
  - **Credential Management**: Portal provides a link to the Credential Manager app, which requires login authentication and provides a graphical interface for creating/ refreshing and revoking credential tokens.
  - **SSH Key Management**: Portal supports SSH key management functions to view/ generate/ upload or delete sliver/ bastion keys.
  - **Slice Builder**: Portal includes a graphical Slice Builder that allows experimenters to graphically define their experiment slice topology with provisionable resources. The features to download and upload slice as a JSON-format file are under development.
  - **Slice Viewer**: Portal includes a graphical Slice Viewer that helps you display your slice including slice information and topology. The features to modify and renew slice are under development.
- **Links**: Portal provides links to the Knowledge Base site and JupyterHub. Knowledge Base site provides documentation and user guide to various FABRIC tools and services, also includes a forum for FABRIC announcements and users to discuss and ask questions.
- **Contact Us**: Besides guide articles and forum support from FABRIC Knowledge Base, users can find categorized help from the Contact Us page including how to solve experiment issues/ account issues, how to book office hours and how to use FABRIC to teach classes.
- **About**: About pages contain information of overview of FABRIC and FAB,scientific advisory committe, and leadership team.
- **Community**: Community pages contain links to news/ events, newsletter signup form, funding opportunities, testbed and facilities, and publications.
- **User Profile Page**: users view their account information such as name, email, CILogon ID (Identity attributes are populated into the profile from CI Logon and are considered immutable) on the user profile page. Global roles and project roles are shown in tables as well as the ability of refreshing roles and requesting roles. Users have access to their stored SSH public keys and are able to view, search and download keys. Users can edit bio, pronouns, job title and personal website in this page.

![FABRIC Portal - portal design v5](https://user-images.githubusercontent.com/37635744/190232916-e655e917-145b-46ff-b5fd-a5c8ea174de0.png)

FABRIC System Services and Portal consist of multiple components:

- **Portal**: presents the graphic interface to users and interacts with other components;
- **FABRIC Core API**: Previously separated back-end services of Project Registry API and User Information Services have been coalesced into this FABRIC Core API service. The service provides access to FABRIC People/ Project and SSH Key management and is enhanced to support a richer set of options related to customizing information about projects and people shown through the Portal.
- **Orchestrator API**: provides endpoints for slice and sliver management,also for listing and description of available resources of sites across the FABRIC testbed.
- **CI Logon/COmanage Instance**: provides federated authentication, also provides identity attributes to other components for authorization decisions;
- **SSH Proxy Service**: allows browser-based SSH logins into slivers via Portal (not implemented yet);
- **Knowledge Base**: contains user support documentation, allows users to ask questions and discuss about the testbed, provide feedback to operators etc;
- **JupyterHub**: provides on-demand notebooks for experimenters;
- **Credential Manager API/ App**: issues credentials for users to utilize the testbed resources via Control Framework APIs.

## Environment and Configuration

For local development you will need install [Node JS](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) will automatically be installed.

For IDE, [Visual Studio Code](https://code.visualstudio.com/) is highly recommended. After installation of VS Code, there are two helpful extensions to install for better development experience: [Simple React Snippets](https://marketplace.visualstudio.com/items?itemName=burkeholland.simple-react-snippets) and [Prettier Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

`config.template`

- This is the config file containing API url information;
- Copy and paste this file as config.json in /src;
- Replace \*\*\*\*\*\* with API domain names;
- Delete the 4 lines of comments and save.

```
cd src
cp config.template config.json            # create the config.json file
vim config.json                           # set api urls accordingly
```

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
