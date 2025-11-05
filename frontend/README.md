# Skill Exchange — Frontend (Minimalist & Personable)

This is a minimal React frontend scaffold demonstrating the "Minimalist & Personable" design system: custom MUI theme, Google Fonts, global styles, and a person-centric `SkillCard` component used on a sample Discover page.

Quick start

```bash
cd frontend
npm install
npm start
```

What I added

- `public/index.html` — includes Google Fonts for Inter and Lora
- `src/index.css` — global styles (Linen background, Charcoal text)
- `src/theme.js` — MUI theme implementing the color palette and typography
- `src/components/SkillCard.js` — the person-centric card component
- `src/pages/Discover.js` — sample page that renders several skill cards
- `src/App.js`, `src/index.js` — app entry and theme wiring
- `package.json` — dependency manifest for quick install

Notes & next steps

- Avatars are currently blank; you can wire real image URLs from your API or placeholder service.
- If you'd like, I can add authentication context, axios wiring, or additional pages (Profile, Offer details).
