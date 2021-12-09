import React from "react";
import KeyCard from "./KeyCard";

const KeyCards = ({ keys, disableKeyDelete }) => {
  return (
    <div className="row text-sm-size">
      {
        keys.map((key, index) => {
          return (
            index % 2 === 0 ? (
              <div className="col">
                <KeyCard
                  data={key}
                  disableKeyDelete={disableKeyDelete}
                  key={`sshkey-card-${index}`}
                />
              </div>
            ): (
              <div className="col">
                <KeyCard
                  data={key}
                  disableKeyDelete={disableKeyDelete}
                  key={`sshkey-card-${index}`}
                />
                <div class="w-100"></div>
              </div>
            )
          )
        })
      }
    </div>
  );
};

export default KeyCards;
