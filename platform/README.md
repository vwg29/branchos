# BranchOS

منصة SaaS متعددة المستأجرين لإدارة الشركات ذات الفروع والوكالات، مع **عزل تام** بين كل شركة، ولوحة مزوّد منصة منفصلة.

## التقنيات
- Next.js 14 (App Router) + TypeScript
- PostgreSQL عبر Prisma
- NextAuth (JWT) لمصادقة العملاء + جلسة HMAC منفصلة لمدير المنصة
- next-intl (عربي RTL / إنجليزي LTR)
- Tailwind بأسلوب "Liquid Glass"

## التشغيل محليًا
```bash
npm install
cp .env.example .env      # عبّئ القيم الثلاث
npm run db:migrate        # ينشئ جداول قاعدة البيانات
npm run db:seed           # يزرع الصلاحيات والخطط ومدير المنصة
npm run dev
```

## متغيرات البيئة (3)
- `DATABASE_URL` — رابط PostgreSQL
- `NEXTAUTH_SECRET` — سرّ جلسة العملاء
- `PLATFORM_ADMIN_SECRET` — سرّ جلسة مدير المنصة (يجب أن يختلف عن الأول)

## النشر على Vercel
- **Root Directory = `platform`**
- أضِف المتغيرات الثلاثة
- أمر البناء الجاهز: `prisma generate && prisma migrate deploy && tsx prisma/seed.ts && next build`

## مدير المنصة الافتراضي (بعد seed)
`admin@branchos.app` / `ChangeMe!2026` — غيّرها فورًا.

## بنية العزل
كل استعلام على بيانات المستأجرين يمرّ حصريًا عبر `src/lib/db/scoped.ts`،
الذي يحقن `tenantId` من الجلسة الموثوقة فقط — لا يُقرأ من إدخال المستخدم إطلاقًا.
