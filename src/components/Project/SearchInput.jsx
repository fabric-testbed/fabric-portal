import React from "react";

import ProjectUserTable from "./ProjectUserTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getPeopleByName } from "../../services/userInformationService";

class SearchInput extends React.Component {
  state = {
    users: [],
    addedUsers: [],
    activeTableIndex: 0,
    ownerSetting: {
      pageSize: 5,
      currentPage: 1,
      searchQuery: "",
      sortColumn: { path: "name", order: "asc" },
    },
  };

  handleSearch = async (value) => {
    if (value.length > 3) {
      const { data: users } = await getPeopleByName(value);
      this.setState({ users });
    } else {
      this.setState({ users: [] });
    }
  };

  handleAddUser = (user) => {
    const added = this.state.addedUsers;
    let found = false;
    for (let i = 0; i < added.length; i++) {
      if (added[i].eppn === user.eppn) {
        found = true;
        break;
      }
    }
    if (!found) {
      added.push(user);
      this.setState({ addedUsers: added });
    }
  };

  handleSort = (sortColumn) => {
    if (this.state.activeTableIndex === 0) {
      this.setState({
        ownerSetting: { ...this.state.ownerSetting, sortColumn: sortColumn },
      });
    } else if (this.state.TableactiveIndex === 1) {
      this.setState({
        memberSetting: { ...this.state.memberSetting, sortColumn: sortColumn },
      });
    }
  };

  handleDelete = (user) => {
    // only delete a added user from state, no interaction with api.
    let added = this.state.addedUsers;
    added = added.filter((u) => u.eppn !== user.eppn);
    this.setState({ addedUsers: added });
  };

  render() {
    const that = this;
    return (
      <div>
        <input
          name={this.props.name}
          className="form-control"
          onChange={(e) => this.handleSearch(e.currentTarget.value)}
        />
        <div>
          <ul>
            {this.state.users.map((user, index) => {
              return (
                <li key={index}>
                  {user.name}
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => that.handleAddUser(user)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <ProjectUserTable
            users={this.state.addedUsers}
            sortColumn={this.state.ownerSetting.sortColumn}
            onSort={this.handleSort}
            onDelete={this.handleDelete}
          />
        </div>
      </div>
    );
  }
}

export default SearchInput;
