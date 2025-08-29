import React from "react";
import CalendarDateTime from 'react-datetime-picker';

const TimePicker = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      <CalendarDateTime id={name} className="ms-2"/>
    </div>
  );
};

export default TimePicker;
