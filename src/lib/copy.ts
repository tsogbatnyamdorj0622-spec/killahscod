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
    privateLabel: "Хувийн орон зай",
    badgeLeft: "Өдөр тутмын бүртгэл",
    badgeRight: "Нэг дор",
    heroLine1: "Өдрөө",
    heroLine2: "нэг дор.",
    heroBody: "Зуршил, нойр, сэтгэл санаа, хийх ажлаа хялбар бүртгэж, ахицаа хараарай.",
    heroNote: "Өдөр бүрийн жижиг бүртгэл.",
    accessLabel: "Нэвтрэх",
    dataNote: "Таны мэдээлэл хувийн",
    statToday: "Өнөөдөр",
    statTrend: "14 хоног",
    statXp: "Ахиц",
    titleIn: "Тавтай морил.",
    titleUp: "Бүртгэл үүсгэх",
    subIn: "Бүртгэлдээ нэвтэрнэ үү.",
    subUp: "Эхлэхэд хэдхэн секунд.",
    email: "И-мэйл",
    password: "Нууц үг",
    btnIn: "Нэвтрэх",
    btnUp: "Бүртгэл үүсгэх",
    swapToUp: "Шинэ хэрэглэгч үү? Бүртгүүлэх",
    swapToIn: "Бүртгэлтэй юу? Нэвтрэх",
    created: "Бүртгэл үүслээ. Одоо нэвтэрнэ үү.",
    wrongCreds: "И-мэйл эсвэл нууц үг буруу байна.",
    footer: "killah.ongod.space",
  },

  // ---------- Day Score үгс (оноогоор) ----------
  score: {
    s0: "Бүртгэл дутуу",       // 0-29
    s30: "Бага ахиц",           // 30-49
    s50: "Дундаж өдөр",         // 50-69
    s70: "Сайн өдөр",           // 70-84
    s85: "Маш сайн өдөр",       // 85-100
  },

  // ---------- Dashboard ----------
  dash: {
    greetNight: "Оройн бүртгэл",
    greetMorning: "Өглөөний мэнд",
    greetDay: "Өдрийн мэнд",
    greetEvening: "Оройн мэнд",
    title: "Өнөөдрийн тойм",
    dayScoreLabel: "day score",
    emptyHint: "Өнөөдрийн бүртгэл хоосон байна.",
    streakGoing: (n: number) => `${n} өдөр дараалсан байна.`,
    streakNew: "Шинэ дараалал эхэлж байна.",
    breakdownTitle: "Онооны бүтэц",
    buildBar: "Сайн зуршил",
    breakBar: "Хорт зуршил",
    breakBarHint: "бага байх тусам сайн",
    moodBar: "😊 Mood",
    sleepBar: "😴 Нойр",
    tasksBar: "Өдрийн ажил",
    streakLabel: "Streak",
    levelLabel: (lvl: number, rank: string) => `Level ${lvl} · ${rank}`,
    trendTitle: "Сүүлийн 14 хоног",
    todayTitle: "Өнөөдрийн төлөвлөгөө",
    todayEmpty: "Өнөөдөрт товлосон зүйл алга.",
    todayEmptyLink: "Life",
    todayEmptyTail: "-аас нэм.",
    tagWork: "Ажил",
  },

  // ---------- Habits ----------
  habits: {
    title: "Habits",
    subtitle: "Өдөр тутмын зуршлуудаа хянаарай.",
    addBtn: "+ Нэмэх",
    closeBtn: "Хаах",
    kindBuild: "🌅 Сайн",
    kindBreak: "☠️ Хорт",
    tabAll: "Бүгд",
    placeholderBuild: "ж: Өглөө ус уух",
    placeholderBreak: "ж: Амттан идэхгүй",
    okBtn: "OK",
    colHabit: "Зуршил",
    col30d: "30х",
    badgeBreak: "хорт",
    pctSlipped: "автсан",
    emptyText: "Зуршил алга. Дээрээс",
    emptyLink: "+ Нэмэх",
    confirmDelete: "Устгах уу? Түүх нь мөн арилна.",
    hintBuild: "Сайн:",
    hintBuildText: (xp: number) => `хийсэн бол чекл (+${xp} XP).`,
    hintBreak: "Хорт:",
    hintBreakText: "автсан өдрөө чекл (улаан). Хоосон = автаагүй = сайн.",
  },

  // ---------- Daily бүртгэл ----------
  daily: {
    title: "Өдрийн бүртгэл",
    saved: "хадгалагдлаа ✓",
    subtitle: "Сонголт бүр автоматаар хадгалагдана.",
    scoreToday: "Өнөөдрийн үнэлгээ",
    scoreOf: (d: string) => `${d}-ний үнэлгээ`,
    scoreHint: "Бөглөх тусам оноо шинэчлэгдэнэ.",
    scoreHabits: (done: number, total: number) => ` Зуршил ${done}/${total}.`,
    moodTitle: "Mood",
    moods: [
      { v: 1, e: "😩", l: "Хог" },
      { v: 2, e: "😕", l: "Тиймхэн" },
      { v: 3, e: "😐", l: "Зүгээр" },
      { v: 4, e: "🙂", l: "Сайн" },
      { v: 5, e: "🔥", l: "Дэлбэ" },
    ],
    sleepTitle: "Нойр",
    sleepHint: "Оптимум ~7.5ц",
    energyTitle: "Энерги",
    noteTitle: "Тэмдэглэл",
    notePlaceholder: "Өдрийн тэмдэглэл...",
  },

  // ---------- Life ----------
  life: {
    title: "Life",
    subtitle: "Амьдралын чухал зүйлсээ нэг дор зохион байгуул.",
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
    noTasks: "Task алга.",
    noProjects: "Project алга. Дээрээс нэгийг үүсгээрэй.",
    confirmArchive: "Архивлах уу?",
    addToBucket: (icon: string, label: string) => `${icon} ${label}-д нэмэх`,
    emptyList: "Хоосон байна. Дээрээс нэмээрэй.",
    statusDefault: { todo: "Хийх", doing: "Явцтай", done: "Дууссан" },
    statusRead: { todo: "Хүсэлтэй", doing: "Уншиж байна", done: "Уншсан" },
    statusWatch: { todo: "Үзэх", doing: "Үзэж байна", done: "Үзсэн" },
    listHint: (todo: string, doing: string, done: string) =>
      `Status дээр дарж ${todo} → ${doing} → ${done} сэлгэнэ. Огноо тавьсан зүйл тухайн өдөр Dashboard-д гарна.`,
  },
};
