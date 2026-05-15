export const weddingInvitation = {
  meta: {
    title: "Алмат + Снежанна",
    description: "Свадебное приглашение Алмата и Снежанны",
    ogDescription: "17.06.2026",
  },
  hero: {
    title: "Мы женимся!",
    quotes: [
      "- интересно, кто будет моим мужем, когда вырасту?",
      "- им буду я!",
    ],
    image: {
      src: "/wedding/snez.png",
      alt: "Снежанна и Алмат в детстве",
      width: 720,
      height: 560,
    },
    marquee: "вы приглашены",
    music: {
      src: "/wedding/music.mp4",
    },
  },
  date: {
    title: "17.06.2026",
    intro: [
      "Дорогие друзья и близкие,",
      "мы приглашаем вас разделить",
      "с нами наше свадебное торжество,",
      "которое состоится",
    ],
    calendar: {
      src: "/wedding/calendar.png",
      alt: "Календарь, июнь 2026, отмечено 17 число",
      width: 1392,
      height: 1464,
    },
    decor: {
      photo: {
        src: "/wedding/date-photo.png",
        width: 250,
        height: 184,
      },
      save: {
        src: "/wedding/save-the-date.svg",
        width: 69,
        height: 47,
      },
    },
  },
  location: {
    title: "Локация",
    name: "Status",
    address: ["Улица Орджоникидзе, 56а", "Костанай"],
    mapUrl: "https://2giskz.app/kostanay/geo/70000001040055505",
    mapLabel: "открыть на карте",
  },
  gathering: {
    title: "Сбор гостей",
    dateTime: "2026-06-17T17:00",
    time: "17:00",
    description: "",
  },
  rsvp: {
    title: "Анкета гостя",
    intro:
      "Пожалуйста, подтвердите свое присутствие, заполнив анкету ниже, это поможет нам в организации нашего праздника",
    guestNameLabel: "Имя и фамилия",
    guestNamePlaceholder: "Имя и фамилия",
    note: "Если будете с парой, то укажите оба имени",
    attendanceLegend: "Ваш ответ",
    submitLabel: "отправить",
    submittedLabel: "отправлено",
  },
  footer: {
    marquee: "17.06.2026",
    title: "мы вас очень ждем!",
    names: "ваши Алмат и Снежанна",
  },
} as const

export type WeddingInvitation = typeof weddingInvitation
