import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function Calendar({ onTimeChange, currentTime }) {
  const today = new Date();
  const time = new Date(today);

  if (!currentTime) {
    // Set default time to be 24 hours later.
    time.setDate(time.getDate() + 1);
  } else {
    time.setDate(currentTime);
  }
 

  const [value, onChange] = useState(time);

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