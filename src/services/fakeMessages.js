export const messages = [
  {
    message_id: 1,
    subject: "Message 1",
    content:
      "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth.",
    from: "User A",
    from_user_link: "",
    date: "2020-10-12",
    active: true,
  },
  {
    message_id: 2,
    subject: "Message 2",
    content:
      "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth.",
    from: "User B",
    from_user_link: "",
    date: "2020-10-12",
    active: true,
  },
  {
    message_id: 3,
    subject: "Message 3",
    content:
      "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth.",
    from: "User C",
    from_user_link: "",
    date: "2020-10-12",
    active: false,
  },
];

export function getMessages() {
  return messages;
}

export function getActiveMessages() {
  return messages.filter((m) => m.active);
}

export function getTrashMessages() {
  return messages.filter((m) => !m.active);
}
