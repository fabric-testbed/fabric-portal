import React, { useState } from 'react';
import Avatar from 'react-avatar';
import clearLocalStorage from "../utils/clearLocalStorage";
import { NavLink } from "react-router-dom";

function ProfileModal(props) {
  const [isVisible, setIsVisible] = useState(false);

  const { userName, userEmail } = props;

  const toggleModal = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  const handleLogout = () => {
    clearLocalStorage();
    // nginx handle logout url.
    window.location.href = "/logout";
  }

  return (
    <div>
      <div
        className="user-profile-nav-btn"
        onClick={toggleModal}
      >
        <Avatar
          name={userName ? userName : "Anonymous User"}
          bgColor={"#5798bc"}
          borderColor={"#5798bc"}
          textColor={"#FFF"}
        />
      </div>
      {isVisible && (
        <div className="profile-modal">
          <div className="row my-2">
            <div className="col-3 mt-1">
              <Avatar
                name={userName ? userName : "Anonymous User"}
                bgColor={"#5798bc"}
                borderColor={"#5798bc"}
                textColor={"#FFF"}
              />
            </div>
            <div className="col-9">
              {userName ? userName : "Anonymous User"}
              <br/>
              <small>{userEmail ? userEmail : "Unknown Email"}</small>
            </div>
          </div>
          <div className="divider div-transparent"></div>
          <div className="d-flex justify-content-center">
              <button
                className="btn btn-sm btn-outline-primary me-3"
                onClick={toggleModal}
              >
                <NavLink to="/user">
                  User Profile
                </NavLink>
              </button>
            <NavLink to="/logout">
              <button
                className="btn btn-sm btn-outline-success"
                onClick={handleLogout}
              >
                Log out
              </button>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
