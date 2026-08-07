import React from "react";
import KeyCard from "./KeyCard";

const KeyCards = ({ keys, disableKeyDelete }) => {
  return (
    <div className="row text-sm-size g-3">
      {
        keys.map((key, index) => (
          <div className="col-12 col-md-6" key={`sshkey-card-${index}`}>
            <KeyCard
              data={key}
              disableKeyDelete={disableKeyDelete}
            />
          </div>
        ))
      }
    </div>
  );
};

export default KeyCards;
