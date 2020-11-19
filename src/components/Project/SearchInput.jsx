import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getPeopleByName } from "../../services/userInformationService";

class SearchInput extends React.Component {
  state = {
    users: [],
  };

  handleSearch = async (value) => {
    if (value.length > 3) {
      const { data: users } = await getPeopleByName(value);
      this.setState({ users });
    } else {
      this.setState({ users: [] });
    }
  };

  render() {
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
                    // onClick={this.handleAddUser(user)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchInput;
