import React from "react";
import DateTimePicker from 'react-datetime-picker';

const TimePicker = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      <DateTimePicker id={name} className="ml-2"/>
    </div>
  );
};

export default TimePicker;
