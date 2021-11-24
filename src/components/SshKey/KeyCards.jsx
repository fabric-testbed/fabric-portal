import React from "react";
import KeyCard from "./KeyCard";

const KeyCards = ({ keys, ...rest }) => {
  return (
    <div className="container">
      {
        keys.map((key, index) => {
          return (
            <KeyCard data={key} key={`sshkey-card-${index}`}/>
          )
        })
      }
    </div>
  );
};

export default KeyCards;
