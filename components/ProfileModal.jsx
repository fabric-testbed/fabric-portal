'use client';

import React, { useState } from 'react';
import Avatar from 'react-avatar';
import Link from 'next/link';
import clearLocalStorage from '../utils/clearLocalStorage';
import { useAuth } from '@/lib/auth/AuthContext';

function ProfileModal(props) {
  const [isVisible, setIsVisible] = useState(false);
  const { logout } = useAuth();

  const { userName, userEmail } = props;

  const toggleModal = (e) => {
    e.preventDefault();
    setIsVisible((v) => !v);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleLogout = () => {
    logout();
    window.location.replace('/logout?url=' + encodeURIComponent(window.location.origin));
  };

  return (
    <div>
      <Avatar
        name={userName || 'Anonymous User'}
        color="rgb(87, 152, 188)"
        size="35px"
        textMarginRatio={0.1}
        round
        onClick={toggleModal}
      />

      {isVisible && (
        <div className="profile-modal">
          <div className="row my-2">
            <div className="col-3 mt-1">
              <Avatar
                name={userName || 'Anonymous User'}
                color="rgb(87, 152, 188)"
                size="40px"
                textMarginRatio={0.1}
                round
              />
            </div>
            <div className="col-9">
              {userName || 'Anonymous User'}
              <br />
              <small>{userEmail || 'Unknown Email'}</small>
            </div>
          </div>

          <div className="divider div-transparent"></div>

          <div className="d-flex justify-content-center">
            <Link
              href="/user"
              className="btn btn-sm btn-outline-primary me-3"
              onClick={closeModal}
            >
              User Profile
            </Link>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
