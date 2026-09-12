# NextWeb Studio theme system

Implemented September 8, 2026.

1. **Architecture:** Extended the existing semantic CSS tokens in `app/globals.css`. A small client store uses React's `useSyncExternalStore`, with a synchronous document-head script that resolves the initial theme before paint. No theme dependency was added. The App Router layout mounts the theme synchronization component once.
2. **Options:** System, Light, and Dark are supported. System is the default and follows live `prefers-color-scheme` changes. The existing navy design remains the dark variant; the light variant uses a pale-blue page, white surfaces, navy text, and blue accents.
3. **Persistence:** `localStorage["nextweb-studio-theme"]` stores only the selected preference. Selection survives refresh/navigation and is applied on a subsequent visit. Other tabs synchronize through the storage event. When browser storage is unavailable, changing the theme still works for the current visit.
4. **Components:** Updated navbar, wordmark text, hero and its seven-stage product illustration, shared cards/buttons, service sections, solution selector, project filters/cards/details, technology stack, contact form and validation colors, CTA surfaces, shared page text, showcase wrapper, and admin preview. Browser theme-color metadata and native control color-scheme follow the resolved theme. Removed a copy of the user brief accidentally prepended to the admin TSX file. Fixed an existing reduced-motion reveal problem that could leave section headings hidden.
5. **Intentionally retained colors:** The official logo mark, product screenshots, embedded showcase application, navy photo overlays, and deep-navy footer retain their original identity. The footer scopes dark tokens so its wordmark stays readable. The standalone Mostar page is separate from this theme system. Decorative blue/cyan gradients retain fixed colors where suitable; light text accents use deeper shades for contrast. Existing hero illustration dark values remain fallbacks for its semantic light-theme roles.
6. **Mobile:** The three-option control is in the mobile navigation menu under Appearance, with a 44px minimum touch target. Desktop uses a compact select beside the project CTA. Keyboard selection, focus styling, and Escape-to-close menu behavior are retained.
7. **Hydration:** No hydration or runtime errors were observed in Chromium production checks. With saved Light against a dark OS and saved Dark against a light OS, all twelve sampled initial frames per case used the expected theme and page background. Shared surface color transitions are 200ms and respect reduced motion.
8. **Lint:** `npm run lint` passed.
9. **Build:** `npm run build` passed, including TypeScript and generation of all 18 static pages.

## Verification

- Changed Dark → Light and Light → Dark; refreshed both manual choices and changed the OS preference while each override was active.
- Changed System between light and dark OS preferences while the page was open.
- Checked Home, Services, Projects, both project details, About, Contact, Admin, and the showcase wrapper in both themes.
- Checked 390px, 768px, 1024px, and 1440px widths; no document horizontal overflow was observed.
- Verified cross-tab preference changes and a browser-storage-disabled fallback.
- Exercised all seven hero stage controls in both themes, solution selection, mobile menu controls, and reduced-motion transitions.
- Checked the contact form's client validation without sending an inquiry.
- Verified the footer remains navy with white wordmark text in light mode.
- Sample contrast ratios: white primary-button text 4.61:1; light muted text on the page 4.80:1; light blue text on the page 5.05:1; light cyan text on the page 4.63:1; dark muted text on the strongest navy surface 4.89:1.

The admin route remains its existing development preview; this change does not implement authentication or CRUD actions. Persistence requires browser storage, and the initial-theme checks cover Chromium rather than every browser.

Implementation references: [React useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore), [Next.js viewport configuration](https://nextjs.org/docs/app/api-reference/functions/generate-viewport).
