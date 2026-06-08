# Atelier — Premium Furniture Manufacturing

An ultra-premium single-page website for a high-end furniture manufacturer.
Built with Next.js (App Router) + TypeScript, Tailwind CSS v4, Framer Motion,
GSAP + ScrollTrigger, Lenis smooth scroll, Three.js / React Three Fiber / Drei.

## Run it

```bash
npm install        # already done
npm run dev        # development  → http://localhost:3000
# or production:
npm run build
npm run start      # → http://localhost:3000
```

Open **http://localhost:3000**.

## What's inside

Seven cinematic sections:

1. **Hero** — real-time 3D bedroom interior (auto-framed from the inside), cursor camera drift.
2. **Wardrobe** — pre-rendered showcase images with a scroll-driven door-opening reveal.
3. **Kitchen** — real-time 3D with a scroll-driven camera fly-through.
4. **Cabinet** — real-time 3D exploded view (parts separate & reassemble on scroll).
5. **Manufacturing Excellence** — animated counters.
6. **Why Choose Us** — six hover-reactive cards.
7. **Final CTA** — marquee + contact.

Plus: preloader, custom cursor, Lenis smooth scroll, full SEO (metadata, OpenGraph,
JSON-LD schema), and dedicated mobile / tablet / laptop / desktop layouts.

## 3D asset pipeline (`/scripts`)

The original models in `/Models` are huge (wardrobe alone is 255 MB). They are
optimised into web-ready assets in `/public`:

| Model    | Original | Web                          |
|----------|----------|------------------------------|
| bedroom  | 88 MB    | 5.4 MB (meshopt + 1024 webp) |
| kitchen  | 64 MB    | 13.9 MB (meshopt + 1024 webp)|
| cabinet  | 2.9 MB   | 0.5 MB (meshopt, parts kept) |
| wardrobe | 255 MB   | **static renders** (896 KB)  |

The 255 MB wardrobe is **never** rendered in real time — it is converted to
high-quality showcase images via headless WebGL (`scripts/render-wardrobe.mjs`).

Regenerate (optional):

```bash
node scripts/analyze.mjs          # bounds / nodes / auto-framing report
node scripts/render-wardrobe.mjs  # re-render wardrobe showcase images
```

## Deploy

```bash
npx vercel        # preview
npx vercel --prod # production (public URL)
```
