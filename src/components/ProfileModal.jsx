import React, { useState } from 'react';
import { NameInitialsAvatar } from 'react-name-initials-avatar';
import clearLocalStorage from "../utils/clearLocalStorage";
import { NavLink } from "react-router-dom";

function ProfileModal(props) {
  const [isVisible, setIsVisible] = useState(false);

  const { user } = props;

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
        <NameInitialsAvatar
          name={user? user.name : ""}
          bgColor={"#5798bc"}
          borderColor={"#5798bc"}
          textColor={"#FFF"}
        />
      </div>
      {isVisible && (
        <div className="profile-modal">
          <div className="row my-2">
            <div className="col-3 mt-1">
              <NameInitialsAvatar
                name={user? user.name : "Anonymous"}
                bgColor={"#5798bc"}
                borderColor={"#5798bc"}
                textColor={"#FFF"}
              />
            </div>
            <div className="col-9">
              {user? user.name : "Anonymous"}
              <br/>
              <small>{user? user.email : "Email: Unknown"}</small>
            </div>
          </div>
          <div className="divider div-transparent"></div>
          <div className="d-flex justify-content-center">
            <NavLink to="/user">
              <button
                className="btn btn-sm btn-outline-primary mr-3"
              >
                User Profile
              </button>
            </NavLink>
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
