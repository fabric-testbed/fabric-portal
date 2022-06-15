import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function Calendar({ onTimeChange }) {
  // Set default time to be 24 hours later.
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [value, onChange] = useState(tomorrow);

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