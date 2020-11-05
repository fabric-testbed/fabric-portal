import React from "react";
<<<<<<< HEAD
import { getProjects } from "../services/projectRegistryService";

class Projects extends React.Component {
  state = {
    projects: [],
    projectCols: [
      { display: "Project Name", field: "name", subfield: null },
      { display: "Description", field: "description", subfield: null },
      { display: "Facility", field: "facility", subfield: null },
      { display: "Created By", field: "created_by", subfield: "name" },
      { display: "UUID", field: "uuid", subfield: null },
    ],
  };

  async componentDidMount() {
    const { data } = await getProjects();
    this.setState({ projects: data });
  }

  render() {
    return (
      <div className="container">
        <h1>Projects</h1>
        <table className="table table-striped table-bordered my-4">
          <tbody>
            <tr>
              {this.state.projectCols.map((col, index) => {
                return (
                  <th key={`project-table-header-${index}`}>{col.display}</th>
                );
              })}
            </tr>
            {this.state.projects.map((project, index) => {
              return (
                <tr key={`project-row-${index}`}>
                  {this.state.projectCols.map((col, index) => {
                    return (
                      <td key={`project-col-${index}`}>
                        {col.subfield
                          ? project[col.field][col.subfield]
                          : project[col.field]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
=======
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
>>>>>>> master
      </div>
    );
  }
}

export default Projects;
