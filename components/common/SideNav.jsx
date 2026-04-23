import React from "react";
import Nav from 'react-bootstrap/Nav';

function SideNav({ items, handleChange }) {
  return (
    <div className="mt-4 side-nav">
      <Nav defaultActiveKey={items[0].hash} className="flex-column">
        {items.map((item, index) => {
          return (
            item.active ?
            <Nav.Link href={item.hash} key={`sidenav-${index}`} onClick={() => handleChange(index)} className="active">{item.name}</Nav.Link> :
            <Nav.Link eventKey={item.hash} key={`sidenav-${index}`} onClick={() => handleChange(index)}>{item.name}</Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}

export default SideNav;
