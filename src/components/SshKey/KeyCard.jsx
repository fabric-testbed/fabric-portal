import React from "react";

const KeyCard = ({ data, ...rest }) => {
  return (
    <div className="homepage-card card">
      <div className="card-body py-2">
        {data.name}
      </div>
    </div>
  );
};

export default KeyCard;
