import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function Calendar({ id, name, parent, onTimeChange, currentTime }) {
  // if no time param passed in, set the default time as 24 hours later.
  const today = new Date();
  const time = new Date(today);
  time.setDate(time.getDate() + 1);

  const [value, onChange] = useState(parent === "sliceDetailForm"? currentTime : time);

  return (
    <div key={`${id}-${name}`}>
      <DateTimePicker
        onChange={(value) => {onChange(value); onTimeChange(value);}}
        value={value}
        disableClock={true}
        minDate={today}
        required={true}
        format="yyyy-MM-dd HH:mm:ss"
      />
    </div>
  );
}

export default Calendar;