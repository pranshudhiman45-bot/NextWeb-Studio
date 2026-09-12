import type { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "Ryora",
    slug: "ryora",
    shortDescription:
      "A cinematic creative-workspace demo with scene prompts, style selection, and a video-library interface.",
    fullDescription:
      "Ryora explores how a prompt-led creative workspace can feel: a scene brief, a visual style, and a library for reviewing work. The public site presents the interface; the reviewed backend uses sample video media rather than generating original video.",
    projectType: "Personal Project",
    primaryCategory: "Frontend",
    categories: ["Frontend", "Full Stack", "Backend"],
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    technologyNote:
      "Stack confirmed in the local project source. The reviewed video provider returns demo media. Production prompt enhancement and authenticated workflows still need live verification.",
    thumbnail: "/images/project-ryora-preview.png",
    images: ["/images/project-ryora-preview.png"],
    liveUrl: "https://ryora.vercel.app/",
    featured: true,
    problem:
      "A prompt-led creative tool needs to make scene input, visual style, progress, and previous work easy to navigate without overwhelming the user.",
    solution:
      "The interface brings scene prompts, visual-style options, and a video-library layout into one creative workspace. The public landing page includes a studio preview and links to account creation.",
    architecture:
      "The source pairs a React and TypeScript frontend with an Express API and MongoDB models for accounts, generations, and video records. A provider interface separates the generation workflow from its video source.",
    architectureHeading: "Source architecture",
    implementation:
      "The backend includes optional Gemini prompt enhancement with a local text fallback, account sessions, a generation allowance, and video-library routes. The currently selected video provider returns a sample MP4; this case study does not claim original AI video generation.",
    implementationHeading: "Implementation and demo scope",
    resultsEyebrow: "Project scope",
    resultsTitle: "What this project demonstrates.",
    results: [
      "A responsive landing page and cinematic creative-workspace interface",
      "Account, generation-record, and video-library architecture in the source",
      "A demo-media workflow with a replaceable video provider",
    ],
  },
  {
    title: "Buy Best Grocery E-commerce",
    slug: "e-commerce",
    shortDescription:
      "A full-stack grocery storefront with product discovery, account and cart flows, coupon-aware checkout, Stripe payments, admin operations, and real-time support.",
    fullDescription:
      "Buy Best is a deployed grocery commerce application that brings catalog browsing, authenticated customer journeys, delivery addresses, promotions, payments, store administration, and live support into one responsive product experience.",
    projectType: "Showcase Application",
    primaryCategory: "Full Stack",
    categories: ["Full Stack", "Frontend", "Backend", "E-commerce", "Showcase"],
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Express",
      "MongoDB",
      "Google OAuth",
      "Stripe",
      "Socket.IO",
    ],
    thumbnail: "/images/project-e-commerce.png",
    images: ["/images/project-e-commerce.png"],
    githubUrl:
      "https://github.com/pranshudhiman45-bot/BuyBest-Grocery-MERN-E-Commerce-App",
    liveUrl: "https://buy-best-grocery-mern-e-commerce-ap.vercel.app/",
    internalUrl: "/showcase/ecommerce",
    featured: true,
    problem:
      "A grocery storefront needs to coordinate discovery, availability, account state, delivery details, promotions, payment, fulfillment records, and customer support without fragmenting the buying journey.",
    solution:
      "Buy Best connects those workflows in a single application: customers can browse and search the live catalog, maintain a guest or authenticated cart, choose an address, apply eligible coupons, and use the implemented cash-on-delivery or Stripe Checkout flow. Live payment completion depends on the deployed account and gateway configuration.",
    architecture:
      "A React 19 and TypeScript client built with Vite communicates through credentialed Axios clients with an Express 5 API. The server persists commerce and account data through Mongoose, issues access and refresh tokens, handles Stripe events, uploads media to Cloudinary, and hosts Socket.IO support channels.",
    implementation:
      "The frontend uses lazy-loaded views, reusable store and auth clients, and responsive Tailwind CSS layouts. The backend separates routes, controllers, services, middleware, and Mongoose models, with centralized environment configuration, validation, CORS, Helmet, rate limiting, error handling, and request idempotency.",
    details: [
      {
        title: "Frontend architecture",
        description:
          "The storefront is a React 19 and TypeScript single-page application built with Vite and Tailwind CSS 4. Context-backed store logic coordinates products, carts, settings, and authenticated transitions.",
        items: [
          "Lazy-loaded shop, product, cart, checkout, offers, account, admin, and support views",
          "Credentialed Axios clients with access-token attachment and refresh-session retries",
          "Responsive layouts and navigation across compact and wide breakpoints",
        ],
      },
      {
        title: "Backend architecture and APIs",
        description:
          "The Node.js backend runs Express 5 on a shared HTTP server with Socket.IO. REST resources are organized by route, controller, service, middleware, and model responsibilities.",
        items: [
          "Implemented API groups: auth, products, cart, addresses, categories, coupons, offers, settings, payment, and support",
          "Helmet, credential-aware CORS, cookie parsing, centralized errors, and request idempotency middleware",
          "Role-aware user, admin, and support endpoints",
        ],
      },
      {
        title: "Authentication",
        description:
          "Authentication supports email and password registration with OTP verification, sign-in, access and refresh sessions, logout, password recovery, profile updates, and Passport-based Google OAuth.",
        items: [
          "bcrypt password hashing and separate access and refresh JWT secrets in production",
          "HTTP-only auth cookies with secure cross-site settings for the deployed frontend and API",
          "Role authorization, authentication rate limits, Google handoff completion, and socket authentication",
        ],
      },
      {
        title: "MongoDB data design",
        description:
          "Mongoose persists users, products, carts, orders, delivery addresses, categories, subcategories, coupons, support tickets, application settings, and idempotency records without exposing the database connection to the client.",
        items: [
          "Product documents cover catalog metadata, gallery images, stock, purchase limits, expiry dates, tags, and merchandising flags",
          "Order records retain product snapshots, payment state, coupon data, totals, and delivery-address references",
          "The long-running Express server establishes one Mongoose connection during startup and reuses it for requests",
        ],
      },
      {
        title: "Catalog, cart, and checkout",
        description:
          "The commerce flow covers public product browsing and search, product details, guest and authenticated carts, quantity limits, address management, coupon validation, tax and delivery calculations, and order history.",
        items: [
          "Cash on delivery and Stripe Checkout integration; payment-method availability depends on gateway configuration",
          "Stripe webhook handling for successful, failed, asynchronous, and expired checkout sessions",
          "Stock validation and decrement, order finalization, cart cleanup, and idempotent checkout requests",
        ],
      },
      {
        title: "Admin, media, and support",
        description:
          "Protected operational tools manage products, categories, coupons, offers, tax settings, and inventory alerts. Product and avatar images use Cloudinary-backed uploads, while customer tickets support live Socket.IO conversations with support agents.",
        items: [
          "Admin product publishing, merchandising flags, stock and expiry visibility, and image uploads",
          "Separate customer and support-agent ticket views with authenticated real-time messages",
          "Email delivery for registration and password workflows through Gmail OAuth-compatible configuration",
        ],
      },
    ],
    challengesHeading: "Technical safeguards verified in code",
    challenges: [
      "Credential-aware CORS and secure cookie settings cover the separate Vercel frontend and Render API origins",
      "Idempotency records and Stripe event handling coordinate payment state, stock updates, order finalization, and cart cleanup",
      "Guest-cart normalization and authenticated synchronization preserve product limits, promotions, and address selection",
    ],
    resultsEyebrow: "Source implementation",
    resultsTitle: "Implemented commerce workflows.",
    results: [
      "Responsive product discovery, cart, address, promotion, and checkout workflows",
      "Protected customer, admin, and support experiences backed by role-aware APIs",
      "Implemented MongoDB, Stripe, Cloudinary, email, and real-time support integrations",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
