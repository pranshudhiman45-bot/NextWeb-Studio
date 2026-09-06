# NextWeb Studio

NextWeb Studio is the portfolio and independent development-studio website of Vinay Kumar. It presents the studio's services, real project work, and interactive showcase applications through a responsive full-stack Next.js experience.

## What the site includes

- A dark, responsive studio website with restrained glass surfaces and motion
- Service, process, technology, about, work, project-detail, and contact pages
- Real project data for Ryora and the Buy Best e-commerce application
- A live in-site showcase route for the deployed e-commerce application
- Project filtering with separate project types and technical categories
- Contact inquiry persistence through MongoDB
- Next.js metadata, sitemap, robots rules, Open Graph imagery, and structured data
- A private admin area for reviewing stored inquiries

## Real project showcase

- **Ryora** — a deployed frontend experience for turning text prompts into animated-video concepts. Its source is not part of this repository, so the portfolio intentionally does not claim an unverified technology stack.
- **Buy Best E-commerce** — a deployed MERN e-commerce application with authentication, product discovery, cart and checkout flows, payments, and administrative functionality. The live application is also presented at `/showcase/ecommerce` without recreating or replacing it.

## Technology

The studio site uses Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Mongoose, MongoDB, React Hook Form, and Zod.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` after the development server starts.

Quality checks:

```bash
npm run lint
npm run build
```

## Environment configuration

Copy `.env.example` to `.env.local` and provide only the values needed for the target environment.

| Variable                    | Purpose                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| `MONGODB_URI`               | MongoDB connection used to store contact inquiries                    |
| `NEXT_PUBLIC_SITE_URL`      | Canonical production URL used by metadata, sitemap, and robots output |
| `NEXT_PUBLIC_GITHUB_URL`    | Optional studio GitHub profile shown in the interface                 |
| `NEXT_PUBLIC_LINKEDIN_URL`  | Optional studio/founder LinkedIn profile shown in the interface       |
| `NEXT_PUBLIC_CAL_URL`       | Optional booking URL used by call-to-action links                     |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional public contact email shown in the interface                  |

Never commit real credentials or secret values. The e-commerce application's database, authentication, OAuth, payment, email, and media credentials remain in that application's own environment configuration and are not copied into this project.

## Project data model

Project records live in `lib/projects.ts`. `projectType` describes the relationship to NextWeb Studio, while `primaryCategory` and `categories` describe the verified technical work. Optional `liveUrl`, `internalUrl`, and `githubUrl` fields ensure the interface only renders actions that have real destinations.

## Contact inquiries

The contact form posts to the existing Next.js API route and stores validated inquiries in MongoDB. The optional `source` value records where an inquiry originated, and project query parameters can preselect the relevant project type without exposing sensitive data.

## Deployment

Deploy the Next.js application to a compatible Node.js host, configure the required environment variables, and set `NEXT_PUBLIC_SITE_URL` to the public origin. The embedded e-commerce showcase loads the project's existing deployed frontend; it is not a localhost or placeholder preview.

## Brand

NextWeb Studio is an independent development studio founded and built by Vinay Kumar, Full Stack Developer.
