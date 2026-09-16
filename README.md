# RAFFEL — Personal Branding (KIK)

A personal website for **Raffael Reyndra (Raffel)**, a student at
**SMK Telkom Purwokerto — PPLG (Pengembangan Perangkat Lunak dan Gim)**.

Built for the **KIK / Personal Branding** school assignment.

> Concept: cars · mountains · music · code · design.
> Still learning. Still creating. Still figuring things out.

---

## 1. How to run the website

No build step, no frameworks. Just open the file or serve the folder.

**Simplest:** double-click `index.html`.

**Better (recommended)** — run a tiny local server so images/fonts always load
and the URL looks clean:

```bash
# from inside the project folder
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

---

## 2. Where to replace images

All images live in `assets/images/`. Keep the **same file name** when you
replace a photo — nothing else needs to change.

| What | Path |
|---|---|
| Hero (big cinematic photo) | `assets/images/hero/hero.jpg` |
| About portrait | `assets/images/about/about.jpg` |
| Mercedes W124 | `assets/images/automotive/w124.jpg` |
| Yamaha RX-Z | `assets/images/automotive/rxz.jpg` |
| Car close-ups (headlights, wheels…) | `assets/images/automotive/details/*.jpg` |
| Album covers | `assets/images/music/*.jpg` |
| Skate photo | `assets/images/skate/skate.jpg` |
| Mountain photo | `assets/images/mountain/mountain.jpg` |
| Design photo | `assets/images/design/design.jpg` |
| Space Jump screenshot | `assets/images/projects/space-jump.jpg` |
| AsetKita preview | `assets/images/projects/asetkita.jpg` |

> The current images are **auto-generated placeholders** so the site looks
> designed before you add real photos. Just drop your real JPGs over them.

To regenerate the placeholders (optional):

```bash
python gen_placeholders.py
```

---

## 3. Where to edit personal information

Open `index.html` and search for the section you want:

- **Hero name / tagline** — `.hero__title`, `.hero__sub`
- **School & major** — `.hero__school`, `.hero__major`
- **About me copy** — `.about__text` paragraphs
- **“Outside the screen”** paragraphs — `.outside__note`

---

## 4. Where to edit project information

In `index.html` under **`<section id="projects">`**:

- Titles: `.project__title`
- Category labels: `.project__cat`
- Descriptions: `.project__desc`
- Extra meta (tech / role / competition / result): `.project__meta` — the
  `<span class="ph">` bits are placeholders marked in taupe, ready to edit.
- Real links: the `VIEW PROJECT →` buttons have `href="#" data-placeholder` —
  put your real URL in `href` and remove `data-placeholder`.

---

## 5 / 6 / 7. Add your social links

In `index.html` under **`<section id="contact">`**, three links:

- Instagram → `.contact__link[data-social="instagram"]` → put your URL in `href`
- LinkedIn → `.contact__link[data-social="linkedin"]`
- WhatsApp → `.contact__link[data-social="whatsapp"]` (use `https://wa.me/<number>`)

The `YOUR_INSTAGRAM` / `YOUR_LINKEDIN` / `YOUR_WHATSAPP` handles are
`<span class="ph">` — replace the text and fill in the `href`.

---

## 8. Where to change colors

All colors are defined once at the top of `style.css` in `:root` as CSS
variables:

```css
--bone:   #f5f1e8;  /* main background */
--brown:  #2b211b;  /* dark sections + footer */
--warm:   #6b4f3a;  /* accent / highlights */
--taupe:  #a89582;  /* muted text */
--cream:  #e6ded2;  /* highlight surface */
```

Change a variable and the whole site follows. No need to hunt through rules.

---

## 9. Where to change fonts

Fonts are loaded in `index.html` in the `<head>` (Google Fonts link) and
assigned in `style.css`:

```css
--font-head: "Space Grotesk", sans-serif;   /* headings */
--font-body: "Poppins", sans-serif;         /* body text */
--font-mono: "IBM Plex Mono", monospace;    /* labels / specs */
```

To swap a font: replace it in the Google Fonts `<link>` and update the variable.

---

## 10. How the hover interactions work

All interaction logic is in `script.js`, one clearly-commented block each:

- **Records / vinyl (`#6`)**: moving the cursor over an album cover tilts it
  slightly and slides the vinyl record out behind it. On touch devices it
  becomes a tap-to-toggle instead.
- **Automotive tilt (`#7`)**: moving the cursor over the W124 / RX-Z photo
  nudges the image and shifts the spec text slightly. Subtle by design.
- **Media tilt (`#5`)**: gentle 3D tilt on project / “outside the screen”
  images.
- **Custom cursor (`#8`)**: a small label ring follows the mouse over
  interactive areas (`EXPLORE` / `MOVE` / `VIEW`). Disabled on touch.
- **Scroll reveal (`#3`)**: sections fade up as you scroll; respects
  `prefers-reduced-motion`.

Tweak the feel by editing the small numbers (degrees, scale amounts) in those
sections.

---

## 11. How to deploy the website

Any static host works. Options, easiest first:

- **GitHub Pages** — push this folder to a GitHub repo, enable Pages → Branch
  `main` / `/root`. Free, no account config beyond that.
- **Netlify / Vercel** — drag-and-drop the folder into the dashboard.
- **Hostinger / any web hosting** — upload the files via FTP / file manager to
  `public_html`.

No build command is needed — the site is plain HTML/CSS/JS.

---

## Folder structure

```
raffel-personal-branding/
│
├── index.html        → page structure
├── style.css         → all styling + color/font variables
├── script.js         → all interactions
├── README.md
├── gen_placeholders.py
│
└── assets/
    ├── images/
    │   ├── hero/  about/  automotive/  music/
    │   ├── skate/  mountain/  design/  projects/
    │   └── automotive/details/
    └── icons/        (ready for any custom icons you add)
```
