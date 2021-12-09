import React from "react";
import KeyCard from "./KeyCard";

const KeyCards = ({ keys, disableKeyDelete }) => {
  return (
    <div className="row text-sm-size">
      {
        keys.map((key, index) => {
          return (
            index % 2 === 0 ? (
              <div className="col" key={`sshkey-card-${index}`}>
                <KeyCard
                  data={key}
                  disableKeyDelete={disableKeyDelete}
                />
              </div>
            ): (
              <div className="col" key={`sshkey-card-${index}`}>
                <KeyCard
                  data={key}
                  disableKeyDelete={disableKeyDelete}
                />
                <div className="w-100"></div>
              </div>
            )
          )
        })
      }
    </div>
  );
};

export default KeyCards;
