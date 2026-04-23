import React, { useEffect, useState } from 'react';
import { AlertTriangle } from "lucide-react";

const CountdownTimer = (props) => {
  const [timeLeft, setTimeLeft] = useState(props.interval);

  useEffect(() => {
    // exit early when we reach 0
    if (timeLeft <= 0) {
      window.location.reload();
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);

    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
    <div className="alert alert-primary mb-2" role="alert">
      <AlertTriangle className="me-2" size={16} /> 
      {props.text} The page will automatically refresh in 
      <span className="countdown-timer">{timeLeft}</span> seconds, or 
      <span
        className="countdown-timer-link"
        onClick={() => window.location.reload()}
      >
        reload the page
      </span>.
    </div>
  );
};

export default CountdownTimer;