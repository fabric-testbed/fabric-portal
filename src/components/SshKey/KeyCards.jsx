import React from "react";
import KeyCard from "./KeyCard";

const KeyCards = ({ keys }) => {
  return (
    <div className="row text-sm-size">
      {
        keys.map((key, index) => {
          return (
            index % 2 === 0 ? (
              <div className="col">
                <KeyCard
                  data={key}
                />
              </div>
            ): (
              <div className="col">
                <KeyCard
                  data={key}
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
