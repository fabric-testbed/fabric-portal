import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function Calendar({ onTimeChange, currentTime }) {
  // if no time param passed in, set the default time as 24 hours later.
  const today = new Date();
  const time = new Date(today);
  time.setDate(time.getDate() + 1);

  const [value, onChange] = useState(currentTime? currentTime : time);

  return (
    <div>
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