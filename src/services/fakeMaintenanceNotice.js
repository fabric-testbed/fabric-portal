export const notices = [
  {
    id: 1,
    content:
      "From 2/14/2022 00:00:00 EST until 2/28/2022 00:00:00 EST, all fabric racks/resources will be undergo a disruptive maintenance.",
    endTimeUTC: "2022-02-29 04:00:00",
    link: "https://learn.fabric-testbed.net/forums/topic/disruptive-maintenance-from-2-14-2022-000000-est-until-2-28-2014-0000/"
  },
  {
    id: 2,
    content:
      "Maintenance on Network AM on Wed 4/13/22 from 8PM to 10PM ET. The impacted services are FABnet4, FABnet6 and PortMirror.",
    endTimeUTC: "2022-04-14 02:00:00",
    link: "https://learn.fabric-testbed.net/forums/topic/maintenance-on-network-am-on-wed-4-13-22-8pm-10pm-et/",
  },
];

export function getActiveNotice() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const currentUTC =  today.toISOString().replace("T", " ").substring(0, 19);

  // return the active notice that hasn't reached the end time.
  return notices.filter(notice => notice.endTimeUTC > currentUTC )
}
