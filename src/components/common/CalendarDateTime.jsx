import React, { useState } from 'react';
import moment from "moment";
import DateTimePicker from 'react-datetime-picker';

function CalendarDateTime({ id, name, parent, onTimeChange, time }) {
  const [value, onChange] = useState(time);

  return (
    <div key={`${id}-${name}`}>
      <DateTimePicker
        onChange={(value) => {onChange(value); onTimeChange(value);}}
        value={value}
        disableClock={true}
        minDate={moment().format('MMMM Do YYYY, h:mm:ss')}
        required={true}
        format="yyyy-MM-dd HH:mm:ss"
      />
    </div>
  );
}

export default CalendarDateTime;