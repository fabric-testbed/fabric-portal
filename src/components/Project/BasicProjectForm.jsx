import React from "react";
import _ from "lodash";

// FOR NON PROJECT MEMBER & NON FACILITY OPERATOR
// ONLY SHOW BASIC PROJECT INFO: NAME, DESCRIPTION, FACILITY
// AND BUTTON TO "REQUEST TO JOIN"

const projectStaticInfoRows = [
  { label: "Project Name", path: "name" },
  { label: "Project Description", path: "description" },
  { label: "Project Facility", path: "facility" },
  { label: "Project ID", path: "uuid" },
  { label: "Created Time", path: "created_time" },
];

const BasicProjectForm = ({project}) =>{
    return (
      <div>
        <table className="table table-striped table-bordered mt-4">
          <tbody>
            {projectStaticInfoRows.map((row, index) => {
              return (
                <tr key={`project-basic-info-${index}`}>
                  <td>{row.label}</td>
                  <td>
                    {_.get(project, row.path)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
}

export default BasicProjectForm;