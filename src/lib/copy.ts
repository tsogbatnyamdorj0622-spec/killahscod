// =====================================================================
// БҮХ ТЕКСТ ЭНД. Солихдоо зөвхөн энэ файлыг GitHub дээр засаад commit.
// Код хөндөх шаардлагагүй. Emoji, Монгол, Англи юу ч бичиж болно.
// =====================================================================

export const COPY = {
  // ---------- Brand ----------
  brandName: "KILLAH",
  brandTag: "by ongod 👽",

  // ---------- Nav ----------
  nav: {
    dashboard: "Dashboard",
    habits: "Habits",
    life: "Life",
    daily: "Бүртгэл",
    logout: "Гарах →",
  },

  // ---------- Login ----------
  login: {
    privateLabel: "Ихэнхдээ нууц. Ядаж эмхтэй.",
    badgeLeft: "Ой санамжид бүү найд",
    badgeRight: "Баримттай бай",
    heroLine1: "Юу хийснээ",
    heroLine2: "мартчихдаг уу?",
    heroBody: "Mood, нойр, зуршил, ажлаа энд хийчих. Тэгээд сарын эцэст “би ер нь юу хийгээд байв?” гэж гайхахгүй.",
    heroNote: "Мотиваци ирэхийг хүлээвэл удах гээд байна. Бүртгэчих.",
    accessLabel: "Нууц хаалга",
    dataNote: "Энд бичсэн юм эндээ үлдэнэ",
    statToday: "Өнөөдөр",
    statTrend: "14 өдрийн савлагаа",
    statXp: "Цуглуулсан XP",
    titleIn: "За, ирчихэв үү.",
    titleUp: "За нэг үзье дээ.",
    subIn: "Өнөөдөр бас хүн шиг байв уу, харъя.",
    subUp: "“Маргаашаас” гэлгүй одоо бүртгүүлчих.",
    email: "И-мэйл",
    password: "Нууц үг",
    btnIn: "Ороод үзье",
    btnUp: "За, бүртгүүлье",
    swapToUp: "Анх удаа юу? Энд дарчих",
    swapToIn: "Бүртгэлтэй юм байна. Буцаад оръё",
    created: "Болчихлоо. Одоо шинэхэн бүртгэлээрээ ор.",
    wrongCreds: "И-мэйл эсвэл нууц үг чинь нэг л биш байна даа.",
    footer: "killah.ongod.space",
  },

  // ---------- Day Score үгс (оноогоор) ----------
  score: {
    s0: "Өдөр ч гэж дээ 💀",       // 0-29
    s30: "Амьд л гарлаа",           // 30-49
    s50: "За яах вэ, болно",        // 50-69
    s70: "Овоо шүү 🔥",             // 70-84
    s85: "Бараг гол дүр 👑",         // 85-100
  },

  // ---------- Dashboard ----------
  dash: {
    greetNight: "Унтахгүй яваа юм уу",
    greetMorning: "Өглөөний хүн болж жүжиглэе",
    greetDay: "Өдөр талдаа орчихлоо",
    greetEvening: "За, тайлангаа тавья",
    title: "Өнөөдөр юу амжуулав даа?",
    dayScoreLabel: "day score",
    emptyHint: "Одоохондоо нотлох баримт алга.",
    streakGoing: (n: number) => `${n} өдөр тасралтгүй. Овоо доо.`,
    streakNew: "Гинж 0. Гомдолгүй, эхэл.",
    breakdownTitle: "Оноог чинь хэн идэв?",
    buildBar: "✅ Хүн шиг хийсэн зуршлууд",
    breakBar: "🤡 Өөрийгөө хорлосон нь",
    breakBarHint: "бага байвал ичихгүй",
    moodBar: "😊 Mood",
    sleepBar: "😴 Нойр",
    tasksBar: "📋 Амласан юмнууд",
    streakLabel: "Streak",
    levelLabel: (lvl: number, rank: string) => `Level ${lvl} · ${rank}`,
    trendTitle: "Сүүлийн 14 хоногийн савлагаа",
    todayTitle: "Өнөөдөр хийхээр төлөвлөсөн жүжиг",
    todayEmpty: "Юу ч бичээгүй байна. Тэглээ гээд амарсан гэсэн үг биш.",
    todayEmptyLink: "Life",
    todayEmptyTail: "-аас нэм.",
    tagWork: "Ажил",
  },

  // ---------- Habits ----------
  habits: {
    title: "Habits",
    subtitle: "Сайнаа нэм. Муугаа бага багаар ичээ.",
    addBtn: "+ Нэмэх",
    closeBtn: "Хаах",
    kindBuild: "🌅 Сайн",
    kindBreak: "☠️ Хорт",
    tabAll: "Бүгд",
    placeholderBuild: "ж: Ус уух (кофе биш)",
    placeholderBreak: "ж: 2 цаг reel үзэхгүй",
    okBtn: "OK",
    colHabit: "Зуршил",
    col30d: "30х",
    badgeBreak: "хорт",
    pctSlipped: "автсан",
    emptyText: "Энд юу ч алга. Дээрээс",
    emptyLink: "+ Нэмэх",
    confirmDelete: "Үнэхээр устгах уу? Дараа нь “хаачив?” гэж асуухгүй шүү.",
    hintBuild: "Сайн:",
    hintBuildText: (xp: number) => `хийсэн бол чекл (+${xp} XP).`,
    hintBreak: "Хорт:",
    hintBreakText: "автсан өдрөө чекл (улаан). Хоосон = автаагүй = сайн.",
  },

  // ---------- Daily бүртгэл ----------
  daily: {
    title: "Өдрийн бүртгэл",
    saved: "болчихлоо ✓",
    subtitle: "Дармагц хадгална. Тусгай ёслол хэрэггүй.",
    scoreToday: "Өнөөдрийн үнэлгээ",
    scoreOf: (d: string) => `${d}-ний үнэлгээ`,
    scoreHint: "Шударга бөглө. Оноо өөрөө гарна.",
    scoreHabits: (done: number, total: number) => ` Зуршил ${done}/${total}.`,
    moodTitle: "Mood",
    moods: [
      { v: 1, e: "😩", l: "Хог" },
      { v: 2, e: "😕", l: "Дунд" },
      { v: 3, e: "😐", l: "Зүгээр" },
      { v: 4, e: "🙂", l: "Сайн" },
      { v: 5, e: "🔥", l: "Дэлбэ" },
    ],
    sleepTitle: "Нойр",
    sleepHint: "Оптимум ~7.5ц",
    energyTitle: "Энерги",
    noteTitle: "Тэмдэглэл",
    notePlaceholder: "Юу болов? Юуг дахиж хийхгүй вэ?",
  },

  // ---------- Life ----------
  life: {
    title: "Life",
    subtitle: "Ажил, мөнгө, ном, кино — тархинд бөөгнөрсөн бүгд.",
    buckets: {
      work: "Ажил",
      family: "Гэр бүл",
      money: "Санхүү",
      skill: "Ур чадвар",
      read: "Ном",
      watch: "Кино",
    },
    newProject: "Шинэ project",
    addProjectBtn: "+ Project",
    addTaskPlaceholder: "+ task",
    dueTodayTag: "өнөөдөр",
    noTasks: "Хоосон. Сэжигтэй тайван байна.",
    noProjects: "Project алга. Санаа их, сав алга.",
    confirmArchive: "Архивлая юу? Нүднээс л далд орно.",
    addToBucket: (icon: string, label: string) => `${icon} ${label}-д нэмэх`,
    emptyList: "Энд салхи л үлээж байна. Нэг юм нэм.",
    statusDefault: { todo: "Хийх", doing: "Явцтай", done: "Дууссан" },
    statusRead: { todo: "Хүсэлтэй", doing: "Уншиж байна", done: "Уншсан" },
    statusWatch: { todo: "Үзэх", doing: "Үзэж байна", done: "Үзсэн" },
    listHint: (todo: string, doing: string, done: string) =>
      `Status дээр дарж ${todo} → ${doing} → ${done} сэлгэнэ. Огноо тавьсан зүйл тухайн өдөр Dashboard-д гарна.`,
  },
};
