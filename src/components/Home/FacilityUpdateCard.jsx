import React from "react";
import Parser from 'html-react-parser';

const FacilityUpdateCard = ({ data }) => {
  return (
    <div className="homepage-card card">
      <div className="card-header text-center">
        <b>Facility Updates</b>
      </div>
      <div className="card-body py-2">
        {data.map((item, index) => {
          return (
            <div
              className={`py-4 mx-4 ${
                index < data.length - 1 ? "border-bottom" : ""
              }`}
              key={`card-item-${index}`}
            >
              <h6 className="card-title">{item.date}</h6>
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{Parser(item.content)}</p>
              {
                item.link && (
                  <a
                    href={item.link}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                  { item.button }
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
