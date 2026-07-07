# KILLAH — grind ledger

Хувийн habit / mood / productivity / wellness tracker. Зөвхөн өөрөө нэвтэрч ордог.
Stack: **Next.js 14 + Supabase (Postgres + Auth) + Tailwind + Recharts**.

Дата бүх төхөөрөмжид cloud-оор sync болно. RLS-ээр хамгаалагдсан — зөвхөн чиний нүд харна.

---

## 1. Supabase тохируулах (5 мин)

1. [supabase.com](https://supabase.com) → **New project** үүсгэ.
2. Project дотор **SQL Editor** → `supabase/schema.sql` доторх бүх кодыг paste хийж **Run** дар.
   (Table, RLS policy, auto-profile trigger бүгд үүснэ.)
3. **Authentication → Sign In / Providers → Email** → **"Confirm email"-ийг УНТРАА**.
   (Нэг хэрэглэгчийн app тул email баталгаажуулалт шаардлагагүй, шууд нэвтэрнэ.)
4. **Project Settings → API** хэсгээс дараах 2 утгыг хуулж ав:
   - `Project URL`
   - `anon public` key

## 2. Локалд ажиллуулах

```bash
npm install
cp .env.local.example .env.local
# .env.local дотор дээрх 2 утгаа тавь:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
npm run dev
```
→ http://localhost:3000 нээгээд **Бүртгүүлэх** дар. Бүртгэл үүсээд шууд нэвтэрнэ.

## 3. GitHub → Vercel deploy

```bash
git init && git add . && git commit -m "killah tracker"
git branch -M main
git remote add origin https://github.com/<чиний-нэр>/killah.git
git push -u origin main
```

1. [vercel.com](https://vercel.com) → **Add New → Project** → GitHub repo-гоо import хий.
2. **Environment Variables** хэсэгт 2 утгаа нэм:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** дар.

## 4. killah.ongod.space домэйн холбох

1. Vercel project → **Settings → Domains** → `killah.ongod.space` нэмэ.
2. `ongod.space` DNS provider дээрээ Vercel-ийн зааж өгсөн бичлэгийг нэм:
   - **CNAME** `killah` → `cname.vercel-dns.com`
3. 5–30 минутын дараа SSL-тэй амьдарна.
4. Supabase → **Authentication → URL Configuration → Site URL**-д
   `https://killah.ongod.space` тавь.

---

## Юу дотор нь байгаа вэ

| Хуудас | Юу хийдэг |
|---|---|
| **Dashboard** | Sunrise ring (өнөөдрийн %), streak, level/XP, wellness score, 14 хоногийн mood+нойр график, 30 хоногийн гүйцэтгэл |
| **Habits** | Notion шиг өдөр тутмын checkbox grid. Чек бүрт +10 XP → level ахина |
| **Mood** | Өдрийн mood (1–5), нойр, энерги, тэмдэглэл. Өмнөх өдрүүдийг ч бөглөнө |
| **Projects** | Project + task, progress bar |

## Дараагийн upgrade санаанууд
- Weekly review автомат тайлан
- Habit reminder (push notification)
- PWA болгож утсандаа icon-оор суулгах (`manifest.json` нэмэхэд л)
- Notion / Apple Health-с дата import

Босч бүтээ. 🌅
