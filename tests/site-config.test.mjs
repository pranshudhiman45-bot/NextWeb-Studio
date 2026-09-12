import assert from "node:assert/strict";
import { test } from "node:test";
import { execFileSync } from "node:child_process";
import { resolveSiteUrl } from "../lib/utils.ts";

for (const [label, configured, deployment, expected] of [
  ["unset values", undefined, undefined, "http://localhost:3000"],
  ["empty values", "", "", "http://localhost:3000"],
  ["whitespace values", " \n ", "  ", "http://localhost:3000"],
  [
    "custom domain priority",
    "https://studio.example",
    "preview.vercel.app",
    "https://studio.example",
  ],
  [
    "trim and normalize custom origin",
    " HTTPS://Studio.Example/path?tracking=1#fragment ",
    "",
    "https://studio.example",
  ],
  [
    "Vercel hostname",
    "",
    "studio-preview.vercel.app",
    "https://studio-preview.vercel.app",
  ],
  [
    "Vercel HTTPS URL",
    "",
    " https://studio-preview.vercel.app/ ",
    "https://studio-preview.vercel.app",
  ],
  [
    "Vercel HTTP URL",
    "",
    "http://studio-preview.vercel.app/",
    "http://studio-preview.vercel.app",
  ],
  [
    "invalid custom origin",
    "not a URL",
    "studio-preview.vercel.app",
    "https://studio-preview.vercel.app",
  ],
  ["invalid origins", "https://", "not a URL", "http://localhost:3000"],
  [
    "unsupported protocols",
    "javascript:alert(1)",
    "ftp://studio.example",
    "http://localhost:3000",
  ],
  [
    "credentials are rejected",
    "https://user:password@studio.example",
    "https://user:password@preview.example",
    "http://localhost:3000",
  ],
  [
    "explicit local port",
    "http://localhost:3400/",
    "",
    "http://localhost:3400",
  ],
]) {
  test(label, () => {
    const actual = resolveSiteUrl(configured, deployment);
    assert.equal(actual, expected);
    assert.doesNotThrow(() => new URL(actual));
    assert.equal(
      new URL("/projects/ryora", actual).href,
      `${expected}/projects/ryora`,
    );
  });
}

test("metadata, sitemap, robots and optional integrations import safely without secrets", () => {
  // Fresh processes exercise module-import resolution with controlled settings.
  for (const [configured, deployment, expected] of [
    ["", "", "http://localhost:3000"],
    ["", "preview.vercel.app", "https://preview.vercel.app"],
    ["https://studio.example/", "preview.vercel.app", "https://studio.example"],
  ]) {
    execFileSync(
      process.execPath,
      [
        "--import",
        "./tests/register-typescript.mjs",
        "--input-type=module",
        "-e",
        `
      import assert from 'node:assert/strict';
      import {siteConfig} from './lib/utils.ts';
      import {pageMetadata} from './lib/metadata.ts';
      import sitemap from './app/sitemap.ts';
      import robots from './app/robots.ts';
      const base = new URL(siteConfig.url);
      assert.equal(siteConfig.url, ${JSON.stringify(expected)});
      for (const optional of ['github','linkedin','calendar']) assert.equal(siteConfig[optional], undefined);
      for (const entry of sitemap()) assert.equal(new URL(entry.url).origin, base.origin);
      assert.equal(robots().sitemap, siteConfig.url + '/sitemap.xml');
      const metadata = pageMetadata('Projects', 'Studio projects', '/projects');
      assert.equal(new URL(metadata.alternates.canonical, base).href, siteConfig.url + '/projects');
      assert.equal(new URL(metadata.openGraph.url, base).href, siteConfig.url + '/projects');
      assert.equal(new URL(metadata.openGraph.images[0].url, base).href, siteConfig.url + '/opengraph-image');
      assert.equal(new URL(metadata.twitter.images[0], base).href, siteConfig.url + '/twitter-image');
    `,
      ],
      {
        env: {
          ...process.env,
          NEXT_PUBLIC_SITE_URL: configured,
          VERCEL_URL: deployment,
          NEXT_PUBLIC_GITHUB_URL: "",
          NEXT_PUBLIC_LINKEDIN_URL: "",
          NEXT_PUBLIC_CAL_URL: "",
          NEXT_PUBLIC_CONTACT_EMAIL: "",
          MONGODB_URI: "",
          RESEND_API_KEY: "",
          CONTACT_EMAIL: "",
          CONTACT_FROM_EMAIL: "",
        },
        stdio: "pipe",
      },
    );
  }
});
