import React from "react";

class SideNav extends React.Component {
  render() {
    return (
      <div className="col-3 mt-4">
        <div
          className="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          {this.props.items.map((item, index) => {
            return (
              <a
                className={"nav-link" + (item.active ? " active" : "")}
                id="v-pills-home-tab"
                data-toggle="pill"
                href="#v-pills-home"
                role="tab"
                aria-controls="v-pills-home"
                aria-selected="true"
                key={`sidenav-${index}`}
                onClick={() => this.props.handleChange(index)}
              >
                {item.name}
              </a>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SideNav;
