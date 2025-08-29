import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function CalendarDateTime({ id, name, offset, onTimeChange, time }) {
  // offset: -1, use time passed in 
  // offset: 0, use current time
  // offset: 1, use a day after
  const today = new Date();
  const adjustedTime = new Date(today);
  if (offset >= 0) {
    adjustedTime.setDate(adjustedTime.getDate() + offset);
  }

  const [value, onChange] = useState(offset < 0 ? time : adjustedTime );

  return (
    <div key={`${id}-${name}`}>
      <DateTimePicker
        onChange={(value) => {onChange(value); onTimeChange(value);}}
        value={value}
        disableClock={true}
        required={true}
        format="yyyy-MM-dd HH:mm:ss"
      />
    </div>
  );
}

export default CalendarDateTime;