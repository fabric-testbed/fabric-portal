import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function Calendar({ id, name, parent, onTimeChange, currentTime }) {
  // if no time param passed in, set the default time as 24 hours later.
  const today = new Date();
  const startTime = new Date(today);
  const endTime = new Date(today);
  endTime.setDate(endTime.getDate() + 1);

  const [value, onChange] = useState(parent !== "newSliceForm"? `${startTime}|${currentTime}` : `${startTime}|${endTime}`);

  return (
    <div key={`${id}-${name}`}>
      <DateTimePicker
        onChange={(value) => {onChange(value); onTimeChange(value);}}
        value={value}
        disableClock={true}
        startDate={startTime}
        endDate={endTime}
        required={true}
        // format="yyyy-MM-dd HH:mm:ss"
      />
    </div>
  );
}

export default Calendar;