import React from "react";
import Parser from 'html-react-parser';
import SpinnerWithText from "../common/SpinnerWithText";

const FacilityUpdateCard = ({ showSpinner, updates }) => {
  return (
    <div className="homepage-card card my-4">
      <div className="card-header text-center">
        <b>Facility Updates</b>
      </div>
      <div className="card-body py-2">
        {
          showSpinner && <SpinnerWithText text={"Loading updates..."} />
        }
        { !showSpinner && updates.length > 0 && updates.map((update, index) => {
          return (
            <div
              className={`py-4 mx-4 ${
                index < updates.length - 1 ? "border-bottom" : ""
              }`}
              key={`card-update-${index}`}
            >
              <h6 className="card-title">{update.display_date}</h6>
              <h5 className="card-title">{update.title}</h5>
              <div className="card-text">{Parser(update.content)}</div>
              {
                update.link && (
                  <a
                    href={update.link}
                    className="btn btn-primary btn-sm"
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
