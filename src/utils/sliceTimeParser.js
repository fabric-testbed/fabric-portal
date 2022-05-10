import moment from 'moment';

export default function sliceTimeParser(UTCtime) {
  // the time in orchestrator api response is in UTC 
  // input format: %Y-%m-%d %H:%M:%S %z (offset %z is +0000)
  const utcDateTime = UTCtime.substring(0, 19);
  const stillUtc = moment.utc(utcDateTime).toDate();
  const localTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');

  return localTime;
}
