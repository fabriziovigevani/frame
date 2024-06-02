const DAY_IN_SECONDS = 86400;
const HOUR_IN_SECONDS = 3600;
const MINUTE_IN_SECONDS = 60;

const Time = ({ seconds }: { seconds: number }) => {
  const timeFormatted = formatTime(seconds);

  return <div style={{ display: "flex" }}>{timeFormatted}</div>;
};

const formatTime = (seconds: number) => {
  let days, hours, minutes;

  if (seconds < MINUTE_IN_SECONDS) {
    return `${seconds} seconds`;
  } else if (seconds < HOUR_IN_SECONDS) {
    minutes = Math.floor(seconds / MINUTE_IN_SECONDS);
    return `${minutes} minutes ${seconds % MINUTE_IN_SECONDS} seconds`;
  } else if (seconds < DAY_IN_SECONDS) {
    hours = Math.floor(seconds / HOUR_IN_SECONDS);
    minutes = Math.floor((seconds % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS);
    return `${hours} hours ${minutes} minutes`;
  } else {
    days = Math.floor(seconds / DAY_IN_SECONDS);
    hours = Math.floor((seconds % DAY_IN_SECONDS) / HOUR_IN_SECONDS);
    minutes = Math.floor(
      ((seconds % DAY_IN_SECONDS) % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS
    );
    return `${days} days ${hours} hours ${minutes} minutes`;
  }
};

export default Time;
