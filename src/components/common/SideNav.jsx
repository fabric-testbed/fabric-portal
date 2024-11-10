import React from "react";
import Nav from 'react-bootstrap/Nav';

class SideNav extends React.Component {
  render() {
    return (
      <div className="col-3 mt-4">
        <Nav defaultActiveKey={this.props.items[0].hash} className="flex-column">
          {this.props.items.map((item, index) => {
            return (
              item.active ? 
              <Nav.Link href={item.hash} key={`sidenav-${index}`} onClick={() => this.props.handleChange(index)}>{item.name}</Nav.Link> :
              <Nav.Link eventKey={item.hash} key={`sidenav-${index}`} onClick={() => this.props.handleChange(index)}>{item.name}</Nav.Link>
            );
          })}
        </Nav>
      </div>
    );
  }
}

export default SideNav;
