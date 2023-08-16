import React from "react";
import Parser from 'html-react-parser';
import SpinnerWithText from "../common/SpinnerWithText";

const NewsCard = ({ showSpinner, news }) => {
  return (
    <div className="homepage-card card">
      <div className="card-header text-center">
        <b>Recent News</b>
      </div>
      <div className="card-body py-2">
        {
          showSpinner && <SpinnerWithText text={"Loading news..."} />
        }
        { !showSpinner && news.length > 0 && news.map((update, index) => {
          return (
            <div
              className={`py-4 mx-4 ${
                index < news.length - 1 ? "border-bottom" : ""
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
                    className="btn btn-primary mt-3 btn-sm"
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

export default NewsCard;
