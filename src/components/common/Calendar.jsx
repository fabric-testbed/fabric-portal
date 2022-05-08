import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

function Calendar({ onTimeChange }) {
  const [value, onChange] = useState(new Date());

  return (
    <div>
      <DateTimePicker
        onChange={e => {onChange(e); onTimeChange(value);}}
        value={value}
        disableClock={true}
        minDate={new Date()}
        required={true}
        format="y-MM-dd h:mm:ss"
      />
    </div>
  );
}

export default Calendar;