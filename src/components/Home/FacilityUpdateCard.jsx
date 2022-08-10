import React from "react";
import Parser from 'html-react-parser';

const FacilityUpdateCard = ({ data }) => {
  return (
    <div className="homepage-card card">
      <div className="card-header text-center">
        <b>Facility Updates</b>
      </div>
      <div className="card-body py-2">
        {data && data.map((update, index) => {
          return (
            <div
              className={`py-4 mx-4 ${
                index < data.length - 1 ? "border-bottom" : ""
              }`}
              key={`card-update-${index}`}
            >
              <h6 className="card-title">{update.display_date}</h6>
              <h5 className="card-title">{update.title}</h5>
              <p className="card-text">{Parser(update.content)}</p>
              {
                update.link && (
                  <a
                    href={update.link}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                  { update.button }
                </a>
                )
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacilityUpdateCard;
