This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Design system

Styling follows the **Laundry Hub** design system (Coastal Breeze palette, Archivo, square corners, 2px rules). It lives as a claude.ai Design System artifact; this repo mirrors it:

- `src/app/globals.css`: every token. Brand values are `--lh-*` CSS variables, exposed to Tailwind as `bg-bg`, `bg-surface`, `text-ink`, `bg-accent`, `text-accent-700`, `border-control-border`, `text-danger` and so on. The type scale is `text-display-xl` … `text-label`, sizes are `h-control-md`, `size-icon-md`, and there are utilities `eyebrow`, `label-caps`, `page-container`, `section-rule`, `on-ink`, `on-accent` and `photo-bw`. Tailwind's default palette is switched off, and the shadcn variables map onto the brand.
- `src/app/fonts/`: Archivo 400/600/700/800/900 woff2, self-hosted with `next/font/local` (SIL OFL).
- `public/brand/`: logo SVGs and the 1024px app icon. `src/app/icon.svg` and `apple-icon.png` are the favicons. Use `<Logo />` from `src/components/brand/logo.tsx` and never live text.
- `src/components/ui/`: shadcn components restyled to the system, plus `field.tsx` (hint and error).
- `src/lib/utils.ts`: `cn`, configured with the custom type and size names so classes merge correctly.

## Landing page

Built to the design system's `flow.md`: a static export (`output: "export"`, written to `out/`) for Firebase Hosting.

- `src/app/page.tsx` puts the sections together, and they are server components (`src/components/landing/`). The client parts are the booking dialog (`src/components/booking/`), the mobile menu, the 3D hero and the GSAP scroll motion.
- **3D hero** (`src/components/hero/`): the scene code is in `stack-scene.ts`, plain three.js with no framework. `public/hero/hero-stack.avif` is a still of its final frame and is what the browser paints first, so it is the LCP image. The live canvas mounts after idle and fades in over it, except under reduced motion, Save-Data or on low-end devices. After you change the scene, run `npm run render:hero` to regenerate the still (needs firefox, avifenc and python3).
- **Booking**: `submitBooking()` in `src/lib/booking.ts` posts to `NEXT_PUBLIC_BOOKING_ENDPOINT` (the Cloud Function). While that variable isn't set, the dialog runs as a prototype, sends nothing and says so. `/#book` opens the dialog directly.
- Services and prices are in `src/lib/services.ts`. Bookable hours (`SLOT_HOURS`) are a placeholder until opening hours are decided.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
