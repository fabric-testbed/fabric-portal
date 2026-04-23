import React, { useState } from "react";
import { toast } from "react-toastify";
import { getPeople } from "../../../services/peopleService";
import Dropfile from "../../common/Dropfile";
import Tabs from "../../common/Tabs";
import SpinnerWithText from "../../common/SpinnerWithText";
import { Search, AlertTriangle, Plus, Check, X } from "lucide-react";

const AddPersonnel = ({ personnelType, users, onUpdateUsers }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [usersFailedToFind, setUsersFailedToFind] = useState([]);
  const [usersToAdd, setUsersToAdd] = useState([]);

  const handleDeleteUser = (userToDelete) => {
    const newUsers = [];
    for (const user of usersToAdd) {
      if (user.name !== userToDelete) {
        newUsers.push(user);
      }
    }
    setUsersToAdd(newUsers);
  };

  const handleInputChange = (input) => {
    setSearchInput(input);
    setWarningMessage("");
  };

  const handleSearch = async (value) => {
    try {
      if (value.length > 3) {
        const { data: res } = await getPeople(value, false);
        if (res.results.length === 0) {
          setSearchResults([]);
          setWarningMessage("No users found. Please update your search query and try again.");
        } else {
          setSearchResults(res.results);
          setWarningMessage("");
        }
      } else {
        setSearchResults([]);
        setWarningMessage("Please enter at least 4 letters to search.");
      }
    } catch (err) {
      toast.error("Cannot find the user. Please check your input to search by name or email address.");
      setSearchResults([]);
    }
  };

  const raiseInputKeyDown = (e) => {
    const query = e.target.value;
    if ((e.key === "Enter") && query) {
     handleSearch(query);
    }
  };

  const checkUserExist = (user, existingUsers) => {
    for (const u of existingUsers) {
      if (user.uuid === u.uuid) {
        return true;
      }
    }
    return false;
  };

  const handleAddUser = (newUser) => {
    if (checkUserExist(newUser, users)) {
      toast.warning(`${newUser.name} already exists in ${personnelType}.`);
    } else {
      const toAdd = [...usersToAdd];
      toAdd.push(newUser);
      setUsersToAdd(toAdd);
    }
    setSearchInput("");
    setSearchResults([]);
  };

  const handleSearchMembers = async (members) => {
    setShowSpinner(true);
    const foundUsersToAdd = [];
    const foundUsersFailedToFind = [];
    for (const memberStr of members) {
      const email = memberStr && memberStr.split(",")[0].trim().replace(/\s/g, "");
      try {
        const { data: res } = await getPeople(email, true);
        if (res.results[0]) {
          const memberToAdd = res.results[0];
          if (checkUserExist(memberToAdd, users)) {
            toast.warning(`${memberToAdd.name} already exists in ${personnelType}.`);
          } else {
            foundUsersToAdd.push(memberToAdd);
          }
        } else {
          foundUsersFailedToFind.push(memberStr);
        }
      }
      catch(err) {
        console.log(err);
      }
    }

    setUsersToAdd(foundUsersToAdd);
    setUsersFailedToFind(foundUsersFailedToFind);
    setSearchCompleted(true);
    setShowSpinner(false);
  };

  const handleFileDrop = (membersStr) => {
    try {
      const members = membersStr && membersStr.split(/\r?\n/);
      if (members.length <= 300) {
        handleSearchMembers(members);
      } else {
        toast.error("Please upload at most 300 users (300 rows for the CSV file) at a time.");
      }
    } catch (err) {
      toast.error("Failed to gather members' data from the CSV file. Please check if your file meets the format requirements.");
    }
  };

  const getIDs = (usersList) => {
    return usersList.map(user => user.uuid);
  };

  return (
    <div className="card mt-3">
      <div className="card-header" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne" id="headingOne">
        <h6 className="mb-0">
          Add {personnelType}
        </h6>
      </div>
      <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
        <div className="card-body">
          {
            personnelType === "Project Owners" && <div className="d-flex flex-column my-2">
            <div className="d-flex flex-row">
              <input
                className="form-control search-owner-input"
                value={searchInput}
                placeholder={`Search by name/email (at least 4 letters) or UUID to add ${personnelType}...`}
                onChange={(e) => handleInputChange(e.currentTarget.value)}
                onKeyDown={raiseInputKeyDown}
              />
              <button
                className="btn btn-outline-primary"
                onClick={() => handleSearch(searchInput)}
              >
                <Search size={20}/>
              </button>
            </div>
            {
              warningMessage !== "" &&
              <div className="alert alert-warning" role="alert">
                {warningMessage}
              </div>
            }
            {
              searchResults.length > 0 &&
              <ul className="list-group mb-2 search-box-list-group">
                {
                  searchResults.map((user, index) => {
                    return (
                      <li
                        key={`search-user-result-${index}`}
                        className="list-group-item d-flex flex-row justify-content-between"
                      >
                        {
                          user.email ? <div className="mt-1">{`${user.name} (${user.email})`}</div> :
                          <div className="mt-1">{user.name}</div>
                        }
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => handleAddUser(user)}
                        >
                          <Plus size={16} />
                        </button>
                      </li>
                    );
                  })
                }
              </ul>
            }
          </div>
          }
          {
            personnelType === "Project Members" &&
            <Tabs activeTab={"Search"}>
              <div label="Search">
              <div className="d-flex flex-row mb-2">
                <input
                  className="form-control search-owner-input"
                  value={searchInput}
                  placeholder={`Search by name/email (at least 4 letters) or UUID to add ${personnelType}...`}
                  onChange={(e) => handleInputChange(e.currentTarget.value)}
                  onKeyDown={raiseInputKeyDown}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleSearch(searchInput)}
                >
                  <Search size={20} />
                </button>
              </div>
              {
                  warningMessage !== "" &&
                  <div className="alert alert-warning" role="alert">
                    {warningMessage}
                  </div>
                }
                {
                  searchResults.length > 0 &&
                  <ul className="list-group search-box-list-group">
                  {
                    searchResults.map((user, index) => {
                      return (
                        <li
                          key={`search-user-result-${index}`}
                          className="list-group-item d-flex flex-row justify-content-between"
                        >
                          {
                            user.email ? <div className="mt-1">{`${user.name} (${user.email})`}</div> :
                            <div className="mt-1">{user.name}</div>
                          }
                          <button
                            className="btn btn-sm btn-outline-primary ms-2"
                            onClick={() => handleAddUser(user)}
                          >
                            <Plus size={16} />
                          </button>
                        </li>
                      );
                    })
                  }
                  </ul>
                }
              </div>
              <div label="Batch Upload">
                {
                  !searchCompleted && !showSpinner &&
                  <div className="w-100 bg-light border pt-3 mb-2">
                    <Dropfile
                      onFileDrop={handleFileDrop}
                      accept={{'text/csv': [".csv"]}}
                      acceptFormat={"csv"}
                      textStr={"Click to select or drag & drop CSV file (with user email as the first column). [Max: 300 rows]"}
                    />
                  </div>
                }
                {
                  showSpinner && !searchCompleted && <SpinnerWithText text={"Uploading users..."} />
                }
                {
                  usersFailedToFind.length > 0 &&
                  <div className="alert alert-warning max-height-overflow-scroll">
                    <AlertTriangle className="me-2" size={16} />
                    We couldn&apos;t find the users below. Please make sure:  1. email is the first column of the CSV file; 2. name and email information
                    are correct; 3. users have sucessfully enrolled as active FABRIC users.
                    <ul className="list-group mt-2 ms-4">
                      {
                        usersFailedToFind.map((memberStr, index) => {
                          return (
                            <li
                              key={`failed-search-user-result-${index}`}
                            >
                              { memberStr }
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                }
              </div>
            </Tabs>
          }
          {
            searchCompleted && !showSpinner &&
            <div className="alert alert-success my-2" role="alert">
              <Check className="me-2" size={16} />
              Users below are uploaded successfully! Please click the <b>Add</b> button to complete adding to project members.
            </div>
          }
          <ul className="input-tag__tags">
            {
              usersToAdd.length > 0 &&
              usersToAdd.map((user, index) =>
              <li
                key={`user-to-add-${index}`}
                className="me-2 my-2"
              >
                {user.email ? `${user.name}(${user.email})` : user.name}
              <X size={14} className="ms-2 cursor-pointer" onClick={() => handleDeleteUser(user.name)} />
            </li>)
            }
          </ul>
          <button
            className="btn btn-sm btn-outline-primary me-3 mt-1"
            onClick={() => onUpdateUsers(personnelType, getIDs(usersToAdd), "add")}
            disabled={ usersToAdd.length === 0}
          >
            Add to {personnelType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPersonnel;
