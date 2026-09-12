import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

const root = new URL("../", import.meta.url);

// Reuse the installed TypeScript compiler and Node test runner; no test package.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(
        new URL(`${specifier.slice(2)}.ts`, root).href,
        context,
      );
    }
    return nextResolve(
      specifier === "next/server" ? "next/server.js" : specifier,
      context,
    );
  },
  load(url, context, nextLoad) {
    if (
      url.startsWith(root.href) &&
      url.endsWith(".ts") &&
      !url.includes("/node_modules/")
    ) {
      const { outputText } = ts.transpileModule(
        readFileSync(new URL(url), "utf8"),
        {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        },
      );
      return { format: "module", source: outputText, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
