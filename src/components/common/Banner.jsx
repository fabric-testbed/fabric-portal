import React from "react";
import Parser from 'html-react-parser';

const Banner = (props) => {
  return (
    <div className="alert alert-warning alert-dismissible fade show notice-banner" role="alert">
      <strong>{props.notice.title}:</strong> {Parser(props.notice.content)} &nbsp;
      <a href={props.notice.link} target="_blank" rel="noreferrer">&nbsp;&gt;&gt;&gt;More details...</a>
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default Banner;
