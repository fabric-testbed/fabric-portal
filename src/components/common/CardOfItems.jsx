import React from "react";

// interface
// header: string
// data: array of objects with date, title, content and id.

const CardOfItems = ({ header, data, ...rest }) => {
  return (
    <div className="homepage-card card">
      <div className="card-header text-center">
        <b>{header}</b>
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
              <p className="card-text">{item.content}</p>
              {
                item.link && (
                  <a
                    href={item.link}
                    className="btn btn-primary"
                    target="_blank"
                  >
                  { item.button ? item.button : "Read More"}
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

export default CardOfItems;
