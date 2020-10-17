import React from "react";
import { BrowserRouter as Route } from "react-router-dom";
import AllProjects from "../pages/AllProjects";
import MyProjects from "../pages/MyProjects";

class Projects extends React.Component {
  render() {
    return (
      <div>
        <Route
          path={`${this.props.match.path}/all-projects`}
          component={AllProjects}
        />
        <Route
          path={`${this.props.match.path}/my-projects`}
          component={MyProjects}
        />
      </div>
    );
  }
}

export default Projects;
