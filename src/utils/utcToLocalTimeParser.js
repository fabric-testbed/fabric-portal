import moment from 'moment';

export default function utcToLocalTimeParser(UTCtime) {
  console.log("-----utcToLocalTimeParser------");
  // the time in orchestrator api response is in UTC 
  // input format: %Y-%m-%d %H:%M:%S %z (offset %z is +0000)
  const utcDateTime = UTCtime.substring(0, 19);
  console.log(utcDateTime);
  const stillUtc = moment.utc(utcDateTime).toDate();
  console.log(stillUtc);
  const localTime = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  console.log(localTime);
  console.log(new Date(localTime.replace(/-/g, "/")))
  return localTime;
}
