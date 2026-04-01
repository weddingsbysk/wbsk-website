# WBSK Website

Next.js 15 wedding photography portfolio. No database, no CMS.

## Stack
- Next.js 15, React 19, TypeScript
- Tailwind CSS, GSAP, Lenis (smooth scroll)

## Key files
- `src/data/siteData.ts` — all site content (hero, philosophy, about, weddings). Edit here.
- `src/lib/data.ts` — query helpers over local data
- `src/lib/animations.ts` — `useMouseParallax` hook only
- `src/app/api/contact/route.ts` — contact form stub, no email wired yet

## Commands
```
npm run dev    # local dev
npm run build  # production build
```

## Adding content
- New wedding: add entry to `clients[]` in `siteData.ts`
- Images: drop in `public/images/`, reference as `/images/filename.jpg`
- Gallery/videos: populate the `gallery` and `videos` arrays per client

## Contact form
Currently returns success with no side effects. Integrate Resend or Formspree when email is needed.
