import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function Calendar({ onTimeChange }) {
  const [value, onChange] = useState(new Date());

  return (
    <div>
      <DateTimePicker
        onChange={(value) => {onChange(value); onTimeChange(value);}}
        value={value}
        disableClock={true}
        minDate={new Date()}
        required={true}
        format="yyyy-MM-dd HH:mm:ss"
      />
    </div>
  );
}

export default Calendar;