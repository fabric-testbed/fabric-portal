import React from "react";
import Parser from 'html-react-parser';

const Banner = (props) => {
  return (
    <div className="alert alert-warning alert-dismissible fade show notice-banner" role="alert">
      <div>
        <span className="me-2">{Parser(props.notice.content)} </span>
        { 
          props.notice.link && 
          <a href={props.notice.link} target="_blank" rel="noreferrer">
            &gt;&gt;&gt;{props.notice.title}
          </a>
        }
      </div>
      <button type="button" className="btn-close banner-close-btn" data-bs-dismiss="alert" aria-label="Close">
      </button>
    </div>
  );
};

export default Banner;
