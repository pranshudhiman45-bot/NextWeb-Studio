**NextWeb Studio — Feature Audit Report**

Date: 7 September 2026

Branch: `staging` · Commit: `1da37ad239dc88dcbd6f118d68ff2a922e058a48`

The public portfolio works for browsing services, viewing projects, filtering work, and selecting a project brief. The main incomplete area is inquiry handling: submissions fail in the current local configuration, the admin area is a static preview, and no notification system delivers inquiries to the founder. Several smaller defects affect contact URLs, search, mobile navigation, accessibility, and metadata.

This report covers the current repository and its production build served locally at `http://127.0.0.1:3100`. It is **not a verification of a hosted staging deployment**: no staging website URL or hosted environment settings were available. Configuration-dependent failures are identified separately from implementation defects.

Testing included source review, HTTP/API requests, and Chromium interaction checks. Desktop pages were checked at 1440px; selected layouts were also checked at 320px, 375px, and 768px. Lint and the production build passed for this same code during the preceding staging push. Passing these checks does not establish that every feature works.

Priority means: **High** = resolve before relying on the affected workflow; **Medium** = a reproducible defect or missing capability; **Low** = limited usability impact. “Not implemented” identifies a placeholder, not a feature that previously worked and regressed.

**Features that do not work or are not implemented**

| ID | Priority | Feature | Finding | Evidence type |
|---|---|---|---|---|
| F01 | High | Send project inquiry | Valid submissions return HTTP 500 in the audited environment because MongoDB is not configured. | Local API and browser reproduction; configuration-dependent |
| F02 | High | Contact-page query handling | Certain `project` values crash the contact page with HTTP 500. | Reproduced implementation defect |
| F03 | High | Admin inquiry/project/settings management | The dashboard is a static preview; its navigation and management features are not implemented. | Browser and source confirmation |
| F04 | High before real admin data/actions | Private admin access | `/admin` is accessible without signing in; authentication and authorization are not implemented. | Unauthenticated HTTP 200 and source confirmation |
| F05 | Medium | Inquiry notifications | Saving an inquiry does not email or notify the founder. | Source-confirmed missing capability |

**F01 — The contact form cannot save inquiries in the current local configuration.**

- Reproduce: open `/contact`, fill every required field with valid values, and submit.
- Observed: the API returns `500` and the form displays “Something went wrong. Please try again shortly.” The form retains entered data and re-enables the submit button correctly.
- Cause: `MONGODB_URI` is absent in the audited environment. The database helper throws before `Contact.create()` can run. The repository's environment template contains blank values; no local environment file was present.
- Impact: visitors cannot complete the site's primary lead-generation workflow in this environment. Repeated retries cannot resolve missing configuration.
- Fix: configure a reachable MongoDB database for the intended deployment, then verify a `201` response and the corresponding stored record. Provide an actionable fallback when submission is unavailable.
- Sources: [database connection](../lib/mongodb.ts), lines 17–24; [contact API](../app/api/contact/route.ts), lines 22–39.
- Limit: this does **not** establish that MongoDB is absent on a remote staging host. Successful persistence and form reset after a real save remain unverified.

**F02 — Some contact links crash the entire contact page.**

- Reproduce: request `/contact?project=constructor`, `/contact?project=toString`, or `/contact?project=__proto__`.
- Observed: all three return `500`; `/contact?project=unknown` returns `200`.
- Cause: `getProjectTypeFromQuery()` indexes a normal JavaScript object without checking whether the requested key is its own property. Inherited object members reach the client-component props instead of a valid project type or `undefined`.
- Impact: an altered or malformed contact link can prevent visitors from accessing the form.
- Fix: use a `Map`, an own-property check, or explicit enum validation before looking up the type. Every unsupported value should safely produce the default form.
- Source: [query mapping](../lib/validations.ts), lines 16–26.

**F03 — The admin dashboard is not an operational management tool.**

- Reproduce: open `/admin` and try Projects, Inquiries, or Settings.
- Observed: the admin navigation contains zero links or buttons. These items are plain `<span>` elements. Inquiry totals are hardcoded as `—`, and the inquiry panel is placeholder text.
- Missing capabilities: reading inquiries, viewing their details, changing inquiry status, adding/editing/deleting projects, and editing settings.
- Cause: the page reads the static project array. No inquiry retrieval or management endpoint exists. The `Project` database model is not connected to the public project API or pages; those use `lib/projects.ts`.
- Impact: connecting MongoDB alone will not make this dashboard display or manage inquiries. Project changes require editing source data and redeploying.
- Fix: implement protected data endpoints and connect real controls, lists, counts, and management actions. Alternatively, keep the preview out of the deployed site until it is ready.
- Sources: [admin page](../app/admin/page.tsx), lines 46–109; [project API](../app/api/projects/route.ts); [project data](../lib/projects.ts).

**F04 — The admin route is public.**

- Reproduce: request `/admin` in a fresh browser session without credentials.
- Observed: the page returns `200` and renders the dashboard preview. There is no login flow, session verification, or role check in this repository.
- Impact: the README's description of a “private admin area” is inaccurate. This audit did not find real inquiry data exposed there: the page currently contains placeholders and public project information.
- Fix: enforce authentication and role checks on both the page and any future administrative APIs before connecting private records or actions. A robots exclusion and `noindex` metadata do not restrict access.
- Sources: [admin page](../app/admin/page.tsx), lines 12–37; [README](../README.md).

**F05 — “Your inquiry goes directly to Pranshu Dhiman” has no notification workflow behind it.**

- Observed in source: after validation, the contact endpoint connects to MongoDB, creates a record, and returns a response. There is no email sender, notification integration, or background delivery job.
- Impact: even after database storage is configured, a submission does not actively alert the founder. Together with F03, there is no implemented in-app workflow for discovering and processing new leads.
- Fix: add a tested notification or inquiry-review workflow, and make the interface copy match what is actually delivered.
- Sources: [contact API](../app/api/contact/route.ts), lines 22–31; [contact form copy](../components/contact/contact-form.tsx), lines 172–174.

**Features that work but do not function properly in all tested cases**

| ID | Priority | Feature | What works | What does not work properly |
|---|---|---|---|---|
| F06 | Medium | Page metadata | Titles and descriptions render; social images are generated. | Pages inherit the homepage canonical and Open Graph URL. |
| F07 | Low | Project search | Normal and case-insensitive searches work. | Surrounding spaces cause false “no results.” |
| F08 | Medium | Mobile navigation | Toggle and menu links work. | Logo navigation leaves the menu open; Escape does not dismiss it. |
| F09 | Medium | Project and solution tabs | Mouse selection works. | Arrow-key navigation is not implemented. |
| F10 | Medium | Form validation accessibility | Invalid fields show visible error text. | Inputs do not expose an invalid state or explicit error-description association. |
| F11 | Medium | Page rendering resilience | Content appears when JavaScript runs normally. | Main page content stays transparent when JavaScript is unavailable. |
| F12 | Low | Contact API error handling | Invalid field values return `400`. | Malformed JSON incorrectly returns a generic server error, `500`. |
| F13 | Medium | Embedded commerce showcase | The wrapper and external-link fallback render. | A failed embedded load has no clear error or recovery state. |

**F06 — Page-specific SEO and sharing metadata are incomplete.**

- Reproduce: inspect metadata on `/about`, `/services`, `/projects`, both project details, and `/contact`.
- Observed: all point their canonical URL to `http://localhost:3000/` and their Open Graph URL to the same homepage origin in this local build. The path problem persists even when a valid public origin is configured because the root layout sets canonical to `/`, and these pages do not override it.
- Impact: individual pages identify the homepage as their canonical destination. Project pages also inherit generic studio sharing metadata rather than complete project-specific metadata.
- Fix: generate a canonical and Open Graph URL for each page; provide appropriate project sharing titles/descriptions. Separately, set a valid public site origin as described under configuration below.
- Sources: [root metadata](../app/layout.tsx), lines 7–38; [project metadata](../app/projects/[slug]/page.tsx), lines 21–32.

**F07 — Search does not ignore accidental whitespace.**

- Reproduce: on `/projects`, search `Ryora`, then ` Ryora `.
- Observed: the first finds Ryora; the second displays “No projects match that search yet.” Searching `ryora` and `MongoDB` works correctly.
- Cause/fix: the search lowercases the query but does not trim it. Normalize with `query.trim().toLowerCase()` before matching.
- Source: [project filter](../components/projects/project-filter.tsx), lines 24–33.

**F08 — The mobile menu remains open after logo navigation.**

- Reproduce at 375px: open the menu on `/projects`, then click the studio logo.
- Observed: navigation reaches `/`, but the expanded menu remains over the homepage. Pressing Escape while the menu is open also leaves it open. Clicking an ordinary menu item correctly closes it.
- Cause: only menu-item clicks call `setOpen(false)`; the component does not reset the open state when the route changes.
- Fix: close on pathname changes and logo navigation; implement Escape dismissal with sensible focus restoration.
- Source: [navbar](../components/layout/navbar.tsx), lines 20–24, 41–42, and 115–117. [Screenshot](./evidence/mobile-menu-after-logo.png).

**F09 — Tab controls are only partially keyboard-operable.**

- Reproduce: focus a category tab or a product-type tab and press ArrowRight.
- Observed: focus and selection do not advance. Both controls advertise `tablist`/`tab` roles but have no arrow-key handling or managed tab focus. The project categories also lack an associated tabpanel.
- Impact: keyboard users can still reach buttons and activate them, but the controls do not provide the navigation their tab semantics suggest.
- Fix: implement the tab keyboard interaction and relationships, or use ordinary filter buttons with pressed-state semantics for project categories.
- Sources: [project filter](../components/projects/project-filter.tsx), lines 43–65; [solution selector](../components/solutions/product-selector.tsx), lines 228–274.

**F10 — Contact errors have incomplete assistive-technology support.**

- Reproduce: submit an empty contact form. Six visible field errors appear. Inspect the name input: both `aria-invalid` and `aria-describedby` are absent.
- Impact: the labels and visible messages exist, but invalid state and error relationships are not explicitly exposed to assistive technology. A full screen-reader test was not performed.
- Fix: set `aria-invalid` for invalid fields, give error messages stable IDs, and connect them with `aria-describedby`.
- Source: [contact form](../components/contact/contact-form.tsx), lines 60–155.

**F11 — Animation defaults hide content when JavaScript cannot run.**

- Reproduce: load `/about` with JavaScript disabled.
- Observed: the server sends the page text, but the main element has computed opacity `0`. `PageTransition` and `Reveal` rely on client animation to make content visible.
- Impact: a visitor with disabled JavaScript or a failed client bundle can see the surrounding navigation while the main content remains invisible.
- Fix: make server-rendered content visible by default and add animation after client initialization, or provide an effective no-JavaScript fallback.
- Sources: [page transition](../components/animations/page-transition.tsx), lines 5–13; [reveal animation](../components/animations/reveal.tsx), lines 20–24.

**F12 — Invalid JSON is reported as a server failure.**

- Reproduce: POST the raw byte `{` to `/api/contact` with `Content-Type: application/json`.
- Observed: `500` with “Something went wrong.” By comparison, a valid JSON object with missing fields correctly returns `400` and field errors.
- Cause: JSON parsing and database operations share the same catch block.
- Fix: catch malformed JSON separately and return `400`; reserve `500` for unexpected server failures. Add useful server-side diagnostics without logging message contents or credentials.
- Source: [contact API](../app/api/contact/route.ts), lines 7–9 and 33–39.

**F13 — The showcase has no embedded-load failure experience.**

- Reproduce: block the external iframe request while opening `/showcase/ecommerce`.
- Observed: the wrapper continues to say “Interactive production preview,” with no loading/failure explanation. The existing “Open full live site” link remains available and is a useful manual fallback.
- Impact: visitors cannot tell whether the preview is still loading or unavailable. This test simulated a dependency failure; it does **not** establish that the live commerce application is down.
- Fix: provide clear loading and timeout/unavailable guidance with an obvious external-open action. Because the iframe is cross-origin, design around the limits of detecting its internal errors.
- Source: [showcase page](../app/showcase/ecommerce/page.tsx), lines 34–53.

**Configuration-dependent and unverified features**

| Area | Current evidence | What still needs verification |
|---|---|---|
| Email link, booking link, GitHub/LinkedIn profile links | Their optional environment variables are unset locally, so those actions are intentionally hidden. The contact page has zero email or booking links. | Configure valid destinations and verify them in the deployed build. This is missing configuration, not evidence of broken link handlers. |
| Site origin, sitemap, robots and structured data | `NEXT_PUBLIC_SITE_URL` is unset locally. Generated URLs use `http://localhost:3000`, including all eight sitemap entries. | Verify the public deployment origin is configured at build time and inspect the deployed output. This issue is separate from the canonical-path defect in F06. |
| Blank site URL | The environment template contains a blank `NEXT_PUBLIC_SITE_URL`. The code uses `??`, which does not replace an empty string, and then calls `new URL(...)`. | Source-identified configuration hazard: copying the template without filling this value can cause an invalid-URL failure. That alternate build was not run during this audit. |
| Real inquiry persistence and success state | The schema, database model, success response, and client reset branch exist. Only the missing-database failure path was exercised end to end. | Use an authorized test database to verify record creation, successful reset, and follow-up handling. |
| Ryora and Buy Best application internals | The portfolio links to external deployments; their application source is outside this repository. External web retrieval did not provide usable verification. | Login, video generation/download, cart, checkout, payment, support, and external admin workflows remain unverified. They are not marked working or broken on the basis of portfolio descriptions. |
| Hosted staging deployment | The code was pushed to `staging`; this audit ran the local build of that commit. | Confirm the hosting deployment, environment variables, domain, and live browser behavior separately. |

Sources for configuration: [site configuration](../lib/utils.ts), [environment template](../.env.example), [contact page](../app/contact/page.tsx), [footer](../components/layout/footer.tsx), [sitemap](../app/sitemap.ts), and [robots](../app/robots.ts).

**Additional implementation observations**

- The showcase renders a `<main>` inside the `<main>` supplied by `PageTransition`, and has no H1. This weakens the page's document structure. Use one main landmark and a visible page heading. Source: [showcase page](../app/showcase/ecommerce/page.tsx), line 17.
- Every page repeats the SVG IDs `nextweb-ring` and `nextweb-blue` because the logo appears in both the header and footer; admin adds another instance. The logos rendered during this audit, so this is a markup collision risk rather than a confirmed visible failure. Generate unique IDs per instance. Source: [brand logo](../components/brand/brand-logo.tsx), lines 19–24.
- Project detail pages use the generic contact CTA, which always records `source=cta` and does not pass a project identifier. Basic source tracking works, but it cannot distinguish those individual case-study leads. Sources: [contact CTA](../components/contact/contact-cta.tsx), line 24; [project page](../app/projects/[slug]/page.tsx).
- The contact endpoint contains no application-level rate limiting or duplicate-submission protection. These are robustness gaps before opening database-backed submissions broadly, not failures demonstrated by load or abuse testing. Hosting-level controls were not inspected. Source: [contact API](../app/api/contact/route.ts).
- Update the README after resolving F03–F05: it currently describes private admin inquiry review that the implementation does not provide.

**What worked in the tested cases**

| Feature | Result and limit |
|---|---|
| Home, About, Services, Projects, Contact | Returned `200` and rendered expected headings. |
| Both case-study pages | Returned `200`; case-study and “Next case study” navigation worked. |
| Homepage internal links | All 12 distinct internal link destinations present in the initial homepage state returned `200`. |
| Category filters | Full Stack, Frontend, Backend, Showcase, and All produced the expected project lists. |
| Search and combined filtering | Normal/case-insensitive text, technology search, empty results, and combined category/search worked; F07 is the whitespace exception. |
| Solution selector | All six tabs changed their panel and generated a contact link with the correct project preselection and source. |
| Contact preselection | SaaS selection and `solution-selector` source survived page rendering and browser hydration. An ordinary unknown project/source value safely fell back; F02 lists the exceptions. |
| Contact field validation | Empty-form submission displayed six field errors; the API rejected missing required fields with `400`. |
| Contact failure recovery | Error message appeared, entered values remained, and the submit button became available again. Successful delivery was not verified. |
| Mobile menu basics | Toggle and ordinary navigation links worked; F08 describes dismissal exceptions. |
| Responsive page width | No document-level horizontal overflow on Home, Projects, Contact, Admin, or Showcase at 320px, 375px, or 768px. This does not certify every visual detail or the embedded application's layout. |
| Project images | Both homepage thumbnails loaded after scrolling them into view; initial unloaded lazy images were not counted as defects. |
| Project API | `GET /api/projects` returned `200`, success, and the two static project records. |
| Missing pages | HTTP checks returned `404` and the not-found view rendered, including an unknown project slug. One browser network-idle wait timed out; a direct HTTP check confirmed the generic missing page's `404`. |
| Site assets | Favicon, Open Graph image, and Twitter image returned `200` with image content types. |
| Sitemap and robots endpoints | Returned `200` with expected formats; their domain configuration still needs attention. |
| Normal client execution | No page JavaScript exceptions were captured during the main interaction run. This excludes the deliberately malformed URL tests and does not certify third-party applications. |

**Recommended order of work**

1. Restore the complete inquiry workflow: configure the database, verify saving, and implement a way to notify/review leads.
2. Fix the contact URL crash. Protect or remove the admin preview before connecting private data or management actions.
3. Correct page-specific canonical/sharing metadata and deployment origin settings.
4. Fix mobile-menu dismissal, keyboard controls, form error semantics, and whitespace search.
5. Improve JavaScript-failure rendering, malformed-request responses, and showcase failure guidance; then address the smaller markup and tracking observations.

Supporting evidence: [structured audit results](./evidence/feature-audit-results.json) and [mobile-menu screenshot](./evidence/mobile-menu-after-logo.png). Test submissions used synthetic data against the local server with no database configured. No application code was changed as part of this report.
