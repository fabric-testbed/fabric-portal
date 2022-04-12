import React from "react";
import Parser from 'html-react-parser';

const Banner = (props) => {
  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Maintenance Notice:</strong> {Parser(props.notice.content)} &nbsp;
      <a href={props.notice.link} target="_blank">&nbsp;&gt;&gt;&gt;More details...</a>
    </div>
  );
};

export default Banner;
