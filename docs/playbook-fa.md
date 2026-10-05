# 📘 کتاب اجرای پروژه — THE HER × OMID
## قدم‌به‌قدم: از کدام ابزار، چه پرامپتی بگیرم، و خروجی را دقیقاً کجای گیت‌هاب بگذارم

> این سند **سیستم عامل پروژه** توست. هیچ‌چیز را از حفظ نکن — فقط هر قدم را باز کن، اجرا کن، برو قدم بعد.
> قاعده کلی: **AI پیش‌نویس می‌دهد، تو تصمیم می‌گیری، گیت‌هاب نگه می‌دارد.**

---

## ۰) نقشه ۵ ابزار — چه کسی چه کاری

| ابزار | وظیفه | کی استفاده می‌کنی |
|---|---|---|
| **GitHub** (ریپوی `theher`) | انبار همه‌چیز: متن، پرامپت، ویدیو، کد | بعد از هر خروجی |
| **Google AI Studio** (aistudio.google.com) | تحلیل، نوشتن متن EN/FA، استوری‌برد | قدم‌های ۱، ۳، ۴ |
| **Arena Agent** (همین چت) | سنتز، ساخت فایل، کدنویسی، QA | قدم‌های ۲، ۵، ۷، ۸، ۹، ۱۰، ۱۱ |
| **Google Flow** (flow.google.com) | ساخت ۷ ویدیوی سینمایی | قدم ۶ |
| **Netlify** (netlify.com) | انتشار سایت | قدم ۱۰ |

---

## ۱) سه قانون طلایی

1. **بدون تأیید خودت قدم بعد نرو.** آخر هر قدم یک «✅ چک» دارد — تا مطمئن نشدی، نرو جلو.
2. **هر خروجی AI را خودت بخوان.** حداقل ۲ دقیقه. لحن و درستی را تو تأیید می‌کنی، نه AI.
3. **هر پرامپتی که جواب داد را در گیت‌هاب ذخیره کن** در `prompts/` — این حافظه پروژه است.

---

## ۲) دو راه گذاشتن فایل در گیت‌هاب

### راه ۱ — ساده‌ترین: به من بده (توصیه می‌شود)
در همین چت بنویس: «این متن را در `docs/intelligence-report.md` بگذار» + متن را پیست کن. من خودم کامیت و پوش می‌کنم. ✅

### راه ۲ — دستی در سایت گیت‌هاب
1. برو به `github.com` → ریپوی **theher** را باز کن
2. **فایل متنی جدید:** دکمه سبز `Add file` → `Create new file` → بالای صفحه نام را **با مسیر کامل** بنویس (مثلاً `docs/intelligence-report.md` — با زدن `/` پوشه خودکار ساخته می‌شود) → متن را پیست کن → `Commit changes`
3. **آپلود فایل (ویدیو/عکس):** اول وارد پوشه موردنظر شو (مثلاً `assets/video/`) → `Add file` → `Upload files` → فایل را بکش و رها کن → `Commit changes`
4. پیام کامیت کوتاه: `Phase 06: scene-01 video` — فرمت: `Phase شماره: توضیح`

---

## ۳) قدم ۰ — یک بار برای همیشه: مرج کردن ساختار

**🔧 ابزار:** GitHub
**کاری که می‌کنی:** لینک Pull Request را باز کن (من ساخته‌ام) → دکمه **Merge pull request** را بزن.
بعد از این، همه فایل‌های اسکلت (قالب‌ها، پرامپت‌ها، کانفیگ‌ها) در شاخه `main` هستند و همه‌چیز را روی `main` می‌گذاری.

---

## ۴) قدم ۱ — گزارش هوشمندی The Her (فاز ۰۱)

**🎯 چی می‌سازی:** فهم دقیق از برند The Her — جدا کردن «واقعیت» از «حدس».
**🔧 ابزار:** Google AI Studio + اسکرین‌شات‌های The Her

### مرحله ۱الف — تحلیل با AI Studio
1. برو به `aistudio.google.com` → مدل **Gemini** (آخرین نسخه) را انتخاب کن
2. اسکرین‌شات‌های The Her را **attach** کن (آیکون کلیپ/+</>)
3. این پرامپت را پیست کن:

```text
You are a senior brand strategist analyzing a women-focused business brand
called "The Her". I have attached screenshots of The Her's public material.

Produce a Markdown report with EXACTLY these 8 sections:

## 1. FACTS
Only what is directly visible in the screenshots. Number them F1, F2, …
(colors, typography, imagery style, tone, offers, programs, audience cues)

## 2. HYPOTHESES
Everything you infer but cannot verify. Number them H1, H2, …
Each MUST start with "Hypothesis:" or "Potential opportunity:".
NEVER present an inference as a fact.

## 3. VISUAL LANGUAGE MAP
Palette (approximate hex), typography style, imagery direction, tone of voice.

## 4. AUDIENCE MAP
Apparent primary audience, their needs and desires.

## 5. VISIBLE OFFERS
Every product / service / program visible.

## 6. BRAND STRENGTHS
5 bullets.

## 7. DIGITAL OPPORTUNITIES
5 bullets — every one phrased as a hypothesis, e.g.
"If acquisition is primarily social-led, a funnel opportunity may exist."

## 8. PARTNERSHIP FIT
One paragraph: where a growth / data / AI partner could complement The Her —
written as potential opportunity, not fact.

RULES: premium quiet-luxury editorial tone, no fluff. Anything not visible in
the screenshots MUST go to Hypotheses. Output pure Markdown, in English.
```

**📤 خروجی:** یک گزارش Markdown
**📁 در گیت‌هاب:** جایگزین بدنه `docs/intelligence-report.md` کن (عنوان را نگه دار) — راه ۱ یا ۲

### مرحله ۱ب — سنتز نهایی با Arena
این پیام را در همین چت بفرست:

```text
گزارش هوشمندی را در docs/intelligence-report.md گذاشتم. آن را نهایی کن:
واقعیت‌ها و فرضیه‌ها را جدا نگه دار، جدول «فرصت‌های مشتری–سرویس» را کامل کن،
و جمع‌بندی یک‌خطی برای Gate 01 بنویس. بعد پرامپت استفاده‌شده را هم در
prompts/ai-studio/PH01-intelligence.md ذخیره کن.
```

**✅ چک قبل از قدم بعد (Gate 01):** آیا جدول واقعیت/حدس جدا است؟ آیا هیچ عدد داخلی The Her ادعا نشده؟ آیا فرصت شراکت برایت منطقی است؟ → اگر بله، در `docs/decision-gates.md` ردیف Gate 01 را ✅ کن (یا به من بگو تا کنم).

---

## ۵) قدم ۲ — معماری پروپوزال (فاز ۰۲)

**🎯 چی می‌سازی:** نقشه نهایی صفحه — سکشن‌ها، تیترها، ترتیب، رفتار دوزبانه.
**🔧 ابزار:** Arena Agent (چون هندآف و خروجی قدم ۱ اینجاست)

**تصمیم‌های قفل‌شده (دیگر لازم نیست فکر کنی):** مقصد CTA = باکس پیش‌نمایش زندهٔ `omidadli.site` + دکمه تب جدید · دوزبانه از روز اول · موسیقی همگام با اسکرول.

این پیام را بفرست:

```text
فاز ۰۲ را اجرا کن: بر اساس هندآف و docs/intelligence-report.md،
فایل docs/proposal-architecture.md را کامل و نهایی کن.
تصمیم‌های من: مقصد CTA = [اینجا بنویس]، دوزبانه از روز اول = [بله/خیر].
برای هر سکشن: تیتر EN، هدف احساسی، ترنزیشن ورودی، و نوع تعامل را مشخص کن.
```

**✅ چک (Gate 02):** کل تجربه را فقط با خواندن این فایل می‌توانی جلوت تصور کنی؟ سکشن «اثبات تفکر» قبل از «مدارک» می‌آید؟ → Gate 02 را ✅

---

## ۶) قدم ۳ — متن انگلیسی + ترنس‌کریشن فارسی (فاز ۰۳)

**🎯 چی می‌سازی:** متن نهایی و قفل‌شده هر دو زبان (ترجمه تحت‌اللفظی ممنوع).
**🔧 ابزار:** Google AI Studio

این پرامپت را پیست کن (متن را همزمان می‌سازد):

```text
You are a world-class bilingual copywriter for premium editorial websites:
native-level English + native Persian (Farsi).

CONTEXT: A cinematic scroll-driven partnership proposal:
"The Her" (a brand for business women) × "Omid" (growth, data, marketing,
digital experience, AI).
Narrative: The Her understands the woman behind the business. Omid focuses on
the system behind the business.
Tone: quiet luxury, editorial, premium, concise. No fluff, no buzzwords,
no exclamation marks.

TASK 1 — ENGLISH FINAL COPY
For each section write: kicker, headline, subheadline (max 12 words),
body (max 40 words), plus microcopy for buttons.
Sections:
1. Opening — A world of business women
2. Behind every ambitious woman, there is a different business
3. Different businesses. Different problems. (the 7 problems list)
4. So why should they all receive the same solution?
5. The partnership split (The Her = the woman / Omid = the system)
6. Growth engine — DATA + MARKETING + EXPERIENCE + AI → one engine
7. Proof of thinking — "We need more sales." (7-step diagnostic)
8. Three hypothetical cases — quote → diagnosis → response → key line,
   each labeled "Hypothetical client scenario"
9. Proof numbers (5+ yrs, +50% organic, −30% CPA, 3.5% CTR, 15 keywords)
10. Partnership value + 3 collaboration models (Direct / Client / White label)
11. CTA — Let's explore what we could build together.

TASK 2 — PERSIAN TRANSCREATION
Transcreate, do NOT translate literally. Preserve meaning, emotional effect,
clarity, persuasion, premium tone. Rules:
- Use نیم‌فاصله (ZWNJ) correctly.
- Keep "The Her" and "Omid" in Latin script.
- Natural Persian — no translated-page feeling, like an elegant Persian editorial.
- Numbers in Persian digits (۱۲۳).

Output two Markdown chapters: "## ENGLISH" and "## فارسی".
```

**📤 خروجی:** متن دوزبانه
**📁 در گیت‌هاب:**
- بخش ENGLISH → `content/en/copy.md` (جایگزین کن)
- بخش فارسی → `content/fa/copy.md` (جایگزین کن)
- پرامپت را در `prompts/ai-studio/PH03-copy-transcreation.md` ذخیره کن

**بعدش این پیام را به من بفرست:**

```text
متن‌های نهایی را در content/ گذاشتم. آن‌ها را در src/i18n/en.json و
src/i18n/fa.json هم اعمال کن تا سایت از همان‌ها بخواند.
```

**✅ چک (Gate 03):** هر دو متن را بلند بخوان. جایی گیرت می‌کند؟ برچسب «سناریوی فرضی» روی هر ۳ کیس هست؟ → Gate 03 را ✅ — از اینجا به بعد تولید دارایی آزاد است.

---

## ۷) قدم ۴ — استوری‌برد ۷ صحنه (فاز ۰۴)

**🎯 چی می‌سازی:** سناریوی سینمایی هر صحنه اسکرول — قبل از ساخت ویدیو.
**🔧 ابزار:** Google AI Studio

این پرامپت را پیست کن:

```text
You are a cinematic storyboard artist for scroll-driven editorial websites.
For EACH of the 7 scenes below, fill this exact template:

Scene: / Purpose: / Narrative line: / Visual: / Motion: / Transition: /
Interaction: / Audio: / Asset required: / Mobile fallback:

Scenes:
1. The Vision — Act I: A world of business women (The Her's world first)
2. The Business — Act II: Behind every ambitious woman, a different business
3. The Complexity — Act III: Different businesses, different problems
4. The System — Act V: the partnership (The Her = the woman / Omid = the system)
5. The Growth Engine — Act VI: DATA + MARKETING + EXPERIENCE + AI → one engine
6. The Collaboration — partnership value
7. The Future — CTA

Constraints: slow, intentional, elegant, cinematic motion (700–1200ms,
cubic-bezier(0.22,1,0.36,1)); warm ivory / champagne / espresso palette;
no neon, no tech clichés; every scroll moment must have a reason to exist;
a mobile fallback for every scene. Output Markdown: one detail block per scene.
```

**📁 در گیت‌هاب:** بخش‌های صحنه ۱ تا ۷ را در `docs/storyboard.md` جای‌گذاری کن + پرامپت در `prompts/ai-studio/PH04-storyboard.md`

**✅ چک:** برای هر لحظه اسکرول می‌توانی بگویی «چرا وجود دارد»؟ صحنه‌های موبایل تعریف شده؟

---

## ۸) قدم ۵ — آرت‌دایرکشن (فاز ۰۵)

**🎯 چی می‌سازی:** قفل سیستم بصری: رنگ، فونت، فاصله، موشن، RTL.
**🔧 ابزار:** Arena Agent

این پیام را بفرست:

```text
فاز ۰۵ را اجرا کن: بر اساس پالت واقعی The Her (از قدم ۱) و استوری‌برد،
فایل docs/art-direction.md را نهایی کن:
- رنگ‌های دقیق (hex) بر اساس برند The Her
- جفت‌فونت نهایی: انگلیسی (serif ادیتوریال) + فارسی (Vazirmatn)
- تصمیم: اعداد فارسی ۱۲۳ یا لاتین 123؟ (پیشنهاد بده + دلیل)
- قوانین RTL و موبایل را قطعی کن
- توکن‌های src/styles/global.css را با مقادیر نهایی همگام کن
```

**✅ چک (Gate 04):** رنگ‌ها حس The Her را دارند نه حس «سایت AI»؟ فونت فارسی شیک و خواناست؟ → Gate 04 را ✅

---

## ۹) قدم ۶ — ویدیوها با Flow + موسیقی با AI Studio (فاز ۰۶) ⭐

**🎯 چی می‌سازی:** ۷ ویدیوی سینمایی ۶–۱۰ ثانیه‌ای + پوستر هرکدام + موسیقی متن بی‌کلامِ همگام با اسکرول.
**🔧 ابزار:** Google Flow (ویدیو) + Google AI Studio → Lyria (موسیقی — نه Flow!)

### ۶-الف — ویدیوها: برای هر صحنه (۱ تا ۷):
1. برو به `flow.google.com` → **New Project** → نامش: `The Her x Omid`
2. حالت **Text to Video** → نسبت تصویر **16:9**
3. پرامپت صحنه را از فایل `prompts/flow/scene-prompts.md` در ریپو کپی کن (پرامپت‌ها از قبل نوشته و آماده‌اند — شامل DNA بصری مشترک)
4. **Generate** → چند نسخه بگیر → بهترین را انتخاب کن (معیار: آرام، گرم، ادیتوریال — نه تکنولوژیک)
5. **Download** کن (MP4)

### فشرده‌سازی (الزامی — گیت‌هاب فایل بزرگ را دوست ندارد):
- هدف: **هر ویدیو زیر ۸ مگابایت، 1080p، بدون صدا**
- راه ساده: فایل را در یک سایت فشرده‌سازی آنلاین بگذار (مثل `freeconvert.com` یا `8mb.video`) → خروجی MP4 زیر ۸MB
- حرفه‌ای‌تر: دستور `ffmpeg` داخل `assets/video/README.md` هست

### نام‌گذاری دقیق و آپلود:

| فایل | کجا در گیت‌هاب |
|---|---|
| `scene-01-vision.mp4` … `scene-07-future.mp4` | `assets/video/` |
| `scene-01-vision-mobile.mp4` (نسخه 720p، اختیاری) | `assets/video/` |
| پوستر هر ویدیو: ویدیو را اجرا کن، روی بهترین فریم توقف کن، اسکرین‌شات بگیر → `scene-01-vision-poster.jpg` | `assets/images/posters/` |

### ۶-ب — موسیقی متن (با AI Studio → Lyria، نه Flow) 🎵

**⚠️ نکته:** Flow فقط ویدیو می‌سازد. موسیقی را در همان **Google AI Studio** با مدل **Lyria** بساز:

1. برو به `aistudio.google.com` → انتخاب مدل **Lyria** (موسیقی)
2. این پرامپت را پیست کن (کپی از `assets/audio/README.md` هم می‌شود):

```text
A slow, elegant, cinematic ambient instrumental for a luxury brand film.
Instrumentation: soft felt piano, warm string swells, deep gentle bass, airy pads.
Tempo & rhythm: very slow, 60–70 BPM, free-flowing, no drums, no percussion.
Soundscape: warm spacious reverb, intimate and quiet, like sunrise in an ivory room.
Emotional arc: calm curiosity → quiet confidence → warm optimism. Seamless loop.
Instrumental only, no vocals.
```

3. ۳–۵ نسخه بگیر → آرام‌ترین و گرم‌ترین را انتخاب کن (معیار: توجه را نکشد)
4. دانلود کن → نام: `score.mp3` (هدف: ۲–۳ دقیقه، لوپ بی‌درز، زیر ~۳MB)
5. آپلود در گیت‌هاب: `assets/audio/score.mp3`

**نحوهٔ پخش (خودکار در فاز ۰۸ پیاده می‌شود):** موقعیت موسیقی = موقعیت اسکرول؛ اولین اسکرول شروع می‌کند و اسکرول به عقب، موسیقی را به همان نسبت برمی‌گرداند.

**✅ چک:** هر ۷ ویدیو زیر ۸MB است؟ همه پوستر دارند؟ پالت همه گرم و یکدست است؟ موسیقی بی‌کلام، آرام و لوپ‌پذیر است؟

---

## ۱۰) قدم ۷ — پروتوتایپ تعاملی (فاز ۰۷)

**🔧 ابزار:** Arena Agent — فقط این پیام را بفرست:

```text
فاز ۰۷ را اجرا کن: پروتوتایپ تعاملی را با Astro بساز:
- hero با ویدیوی صحنه ۱ + پوستر
- ناوبری مینیمال + سوییچ زبان EN↔FA (با حفظ جایگاه اسکرول و dir=rtl)
- روایت اسکرول با GSAP ScrollTrigger (با احترام به prefers-reduced-motion)
- استپر تعاملی «We need more sales» (۷ مرحله تشخیص)
- بخش موتور رشد (۴ لایه → همگرایی)
- ۳ سناریوی فرضی با برچسب + مدرک‌ها + CTA
فعلاً هر دارایی نهایی که نیست، placeholder بگذار. بعد از ساخت، پیش‌نمایش را
برایم اجرا کن تا ببینم.
```

**✅ چک (Gate 05):** روایت درست حس می‌شود؟ سوییچ زبان درست کار می‌کند؟ موبایل را چک کن → Gate 05 را ✅

---

## ۱۱) قدم ۸ — ساخت نسخه نهایی سایت (فاز ۰۸)

**🔧 ابزار:** Arena Agent — این پیام را بفرست:

```text
فاز ۰۸ را اجرا کن: نسخه پروداکشن را بساز — همه ۱۱ سکشن طبق
docs/proposal-architecture.md با متن‌های قفل‌شده در content/ و
src/i18n/، دارایی‌های نهایی در assets/، ویدیوها lazy-load با پوستر،
تصاویر WebP با srcset، HTML معنایی، و CSS منطقی برای RTL.
```

**✅ چک:** همه ویدیوها فقط نزدیک دید لود می‌شوند؟ حالت reduced-motion استاتیک است؟

---

## ۱۲) قدم ۹ — آنالیتیکس + QA (فاز ۰۹)

### ۹الف — ساخت GA4 (۵ دقیقه، خودت):
1. برو به `analytics.google.com` → **Admin** (چرخ‌دنده) → **Create → Property**
2. نام: `The Her x Omid` → منطقه → بساز
3. **Web** را انتخاب → URL سایت + نام `the-her-omid` → بساز
4. **Measurement ID** را کپی کن (شبیه `G-XXXXXXX`)

### ۹ب — QA با Arena — این پیام را بفرست:

```text
فاز ۰۹ را اجرا کن: QA کامل طبق docs/qa-checklist.md — بصری، تعاملی،
ریسپانسیو، دسترس‌پذیری، پرفورمنس — و qa/qa-report.md را پر کن.
آنالیتیکس GA4 را هم با این Measurement ID وایر کن: G-XXXXXXX
ایونت‌های لازم: page_view, language_switch, cta_click, case_interaction,
scroll_depth, contact_initiation
```

**✅ چک:** هیچ 🔴 FAIL در `qa/qa-report.md` باز نیست؟ → آماده لانچ

---

## ۱۳) قدم ۱۰ — انتشار روی Netlify (فاز ۱۰)

**🔧 ابزار:** Netlify — دکمه‌به‌دکمه:

1. برو به `netlify.com` → **Sign up with GitHub** (اجازه دسترسی به ریپوها را بده)
2. **Add new site → Import an existing project → GitHub**
3. ریپوی **theher** را انتخاب کن
4. تنظیمات بیلد از فایل `netlify.toml` خودکار خوانده می‌شود → فقط **Deploy** را بزن
5. ۱–۲ دقیقه صبر کن → URL سایت را می‌گیری (چیزی مثل `something.netlify.app`)
6. **Site configuration → Change site name** → بنویس: `the-her-omid` → URL می‌شود `the-her-omid.netlify.app`
7. این پیام را به من بفرست تا URL نهایی را در `astro.config.mjs` و `public/robots.txt` ست کنم:

```text
سایت لایو شد: https://the-her-omid.netlify.app
URL نهایی را در astro.config.mjs و robots.txt ست کن و آیکون اشتراک
og-image هم بساز.
```

**✅ چک (Gate 06):** سایت را در موبایل + دسکتاپ باز کن، حالت فارسی را چک کن، روی CTA کلیک کن، در GA4 ببین ایونت‌ها ثبت می‌شوند؟ → Gate 06 را ✅

---

## ۱۴) قدم ۱۱ — تمرین ارائه (فاز ۱۱)

**🔧 ابزار:** Arena Agent — این پیام را بفرست:

```text
فاز ۱۱: یک سناریوی ارائه ۵ دقیقه‌ای برای جلسه با The Her بنویس در
docs/presentation-script.md: باز کردن صفحه، دیدن صحنه‌ها، توقف روی
سناریوهای فرضی، توضیح مدل شراکت، نشان دادن مدرک‌ها، بستن با چشم‌انداز.
+ ۵ سوالی که احتمالاً می‌پرسند و جواب‌های پیشنهادی.
```

---

## ۱۵) جدول جمع‌بندی — کل مسیر در یک نگاه

| قدم | فاز | ابزار | خروجی | مسیر در گیت‌هاب |
|---|---|---|---|---|
| ۰ | — | GitHub | مرج PR | — |
| ۱ | ۰۱ | AI Studio → Arena | گزارش هوشمندی | `docs/intelligence-report.md` |
| ۲ | ۰۲ | Arena | معماری ۱۱ سکشن | `docs/proposal-architecture.md` |
| ۳ | ۰۳ | AI Studio | متن EN + FA | `content/en/copy.md` + `content/fa/copy.md` + `src/i18n/*.json` |
| ۴ | ۰۴ | AI Studio | استوری‌برد | `docs/storyboard.md` |
| ۵ | ۰۵ | Arena | سیستم بصری قفل | `docs/art-direction.md` |
| ۶ | ۰۶ | Google Flow | ۷ ویدیو + پوستر | `assets/video/` + `assets/images/posters/` |
| ۷ | ۰۷ | Arena | پروتوتایپ | `src/` |
| ۸ | ۰۸ | Arena | سایت نهایی | `src/` |
| ۹ | ۰۹ | تو (GA4) + Arena | QA + آنالیتیکس | `qa/qa-report.md` |
| ۱۰ | ۱۰ | Netlify | سایت لایو | — |
| ۱۱ | ۱۱ | Arena | سناریو ارائه | `docs/presentation-script.md` |

**یادآوری:** بعد از هر قدمِ AI Studio / Flow، پرامپت استفاده‌شده را هم در `prompts/` ذخیره کن — نام‌گذاری: `PH{شماره‌فاز}-{کار}.md`

---

## ۱۶) اگر گیر کردی

- **خروجی AI بد بود؟** همان پرامپت را با «Be more specific about X» یا نمونه‌ی دلخواهت تکرار کن — ۲–۳ بار تکرار طبیعی است.
- **فایلی جا ماند؟** به من بگو «فلان فایل را ندارم» — از روی هندآف می‌سازم.
- **مطمئن نیستی کدام قدم؟** در چت بپرس: «الان کدام قدم است؟» — من مسیر را نشانت می‌دهم.

**THE HER × OMID — کسب‌وکارهای متفاوت. مسائل متفاوت. یک شریک. بی‌نهایت امکان.**
