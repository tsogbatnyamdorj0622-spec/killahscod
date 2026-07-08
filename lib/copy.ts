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
    titleIn: "Буцаж ирлээ.",
    titleUp: "Grind эхэлье.",
    subIn: "Өдрийн бүртгэлээ нээ.",
    subUp: "Зөвхөн чиний нүд харна. Хэн ч биш.",
    email: "И-мэйл",
    password: "Нууц үг",
    btnIn: "Нэвтрэх",
    btnUp: "Бүртгүүлэх",
    swapToUp: "Шинэ хэрэглэгч үү? Бүртгүүлэх",
    swapToIn: "Аль хэдийн бүртгэлтэй? Нэвтрэх",
    created: "Бүртгэл үүслээ. Одоо нэвтэрч ор.",
    wrongCreds: "И-мэйл эсвэл нууц үг буруу.",
    footer: "killah.ongod.space",
  },

  // ---------- Day Score үгс (оноогоор) ----------
  score: {
    s0: "Өмхий өдөр 💀",     // 0-29
    s30: "Сул өдөр",          // 30-49
    s50: "Дунд зэрэг",        // 50-69
    s70: "Дажгүй өдөр 🔥",    // 70-84
    s85: "Дэлбэ өдөр 👑",     // 85-100
  },

  // ---------- Dashboard ----------
  dash: {
    greetNight: "Шөнө дунд",
    greetMorning: "Өглөөний grind",
    greetDay: "Өдрийн track",
    greetEvening: "Өдрийн дүн",
    title: "Өнөөдөр хэр дажгүй вэ?",
    dayScoreLabel: "day score",
    emptyHint: "Бүртгэл хоосон. Доороос эхэл.",
    streakGoing: (n: number) => `${n} өдрийн гинж. Бүү тас.`,
    streakNew: "Шинэ гинж эхэлж байна.",
    breakdownTitle: "Юунаас бүрдэв",
    buildBar: "🌅 Сайн зуршил хийсэн",
    breakBar: "☠️ Хорт зуршилд автсан",
    breakBarHint: "бага нь дээр",
    moodBar: "😊 Mood",
    sleepBar: "😴 Нойр",
    tasksBar: "✅ Өдрийн ажил",
    streakLabel: "Streak",
    levelLabel: (lvl: number, rank: string) => `Level ${lvl} · ${rank}`,
    trendTitle: "Сүүлийн 14 хоногийн Day Score",
    todayTitle: "Өнөөдрийн төлөвлөгөө · Life-аас",
    todayEmpty: "Өнөөдөрт товлосон зүйл алга.",
    todayEmptyLink: "Life",
    todayEmptyTail: "-аас нэм.",
    tagWork: "Ажил",
  },

  // ---------- Habits ----------
  habits: {
    title: "Habits",
    subtitle: "Сайныг бос. Муугаа тас.",
    addBtn: "+ Нэмэх",
    closeBtn: "Хаах",
    kindBuild: "🌅 Сайн",
    kindBreak: "☠️ Хорт",
    tabAll: "Бүгд",
    placeholderBuild: "ж: Wake up 05:00",
    placeholderBreak: "ж: No sugar",
    okBtn: "OK",
    colHabit: "Зуршил",
    col30d: "30х",
    badgeBreak: "хорт",
    pctSlipped: "автсан",
    emptyText: "Зуршил алга. Дээрээс",
    emptyLink: "+ Нэмэх",
    confirmDelete: "Устгах уу? Түүх нь бас арилна.",
    hintBuild: "Сайн:",
    hintBuildText: (xp: number) => `хийсэн бол чекл (+${xp} XP).`,
    hintBreak: "Хорт:",
    hintBreakText: "автсан өдрөө чекл (улаан). Хоосон = автаагүй = сайн.",
  },

  // ---------- Daily бүртгэл ----------
  daily: {
    title: "Өдрийн бүртгэл",
    saved: "хадгалагдлаа ✓",
    subtitle: "Сонгоход шууд хадгална. Товч дарах хэрэггүй.",
    scoreToday: "Өнөөдрийн үнэлгээ",
    scoreOf: (d: string) => `${d}-ний үнэлгээ`,
    scoreHint: "Бөглөх тусам шинэчлэгдэнэ.",
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
    notePlaceholder: "Юу болов? Юунд талархав?",
  },

  // ---------- Life ----------
  life: {
    title: "Life",
    subtitle: "Зөвхөн ажил биш. Бүх амьдрал нэг дор.",
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
    noProjects: "Project алга. Дээрээс нэг үүсгэ.",
    confirmArchive: "Архивлах уу?",
    addToBucket: (icon: string, label: string) => `${icon} ${label}-д нэмэх`,
    emptyList: "Хоосон байна. Дээрээс нэм.",
    statusDefault: { todo: "Хийх", doing: "Явцтай", done: "Дууссан" },
    statusRead: { todo: "Хүсэлтэй", doing: "Уншиж байна", done: "Уншсан" },
    statusWatch: { todo: "Үзэх", doing: "Үзэж байна", done: "Үзсэн" },
    listHint: (todo: string, doing: string, done: string) =>
      `Status дээр дарж ${todo} → ${doing} → ${done} сэлгэнэ. Огноо тавьсан зүйл тухайн өдөр Dashboard-д гарна.`,
  },
};
