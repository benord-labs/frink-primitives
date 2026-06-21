# @benord-labs/frink-primitives

Frink's shared UI primitives + design tokens (Tailwind v4). One source of truth for
the marketing site and (later) the internal app.

## What's inside

- **`src/`** — React primitives: `Alert`, `Badge`, `Button` (+`buttonVariants`), `Card`
  (+sub-parts), `Checkbox`, `FormMessage`, `Input`, `Label`, `Radio`/`RadioGroup`,
  `Select`, `Separator`, `Switch`, `Tabs`, `Textarea`, `Tile` (+`DiagonalCutDefs`),
  `TileSurface`, `Tooltip`, and the `cn` class joiner.
- **`styles/`** — `theme.css` (design tokens + `@theme inline`), `components.css`
  (recipe classes: `tile-rim`, `glow-rim*`, `clip-diagonal-cut`, `tile-notch`, `btn`,
  `@property --rim-angle`), and `index.css` (entry: imports both + a self-relative
  `@source "../src"`).
- **`eslint-rules/no-raw-color.mjs`** — the `frink/no-raw-color` rule (colours must use
  tokens, no raw hex / Tailwind palette classes).
- **`designs/frink-primitives.pen`** — the Pencil design source of truth. Edit it here.

## Install — GitHub Packages (private npm registry)

Token-based, so it works the same locally, across machines, and on Vercel/CI — no
SSH keys or git-protocol auth.

1. Consumer `.npmrc`:
   ```
   @benord-labs:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```
2. Consumer `package.json`: `"@benord-labs/frink-primitives": "^0.1.0"`.
3. Set `NODE_AUTH_TOKEN` to a GitHub token with **read:packages** (local: `export …`;
   Vercel/CI: a build env var). Then `bun install`.

**Publishing** is automated: push a `vX.Y.Z` tag → the `publish.yml` Action publishes
to GitHub Packages using the Actions `GITHUB_TOKEN` (no PAT needed).

Peers the consumer must provide: `react >=19`, `react-dom >=19`, `tailwindcss >=4`,
`lucide-react`, `class-variance-authority`.

## Wire-up (Tailwind v4 consumer)

1. **CSS** — in your global stylesheet, AFTER the Tailwind import:
   ```css
   @import "tailwindcss";
   @import "@benord-labs/frink-primitives/styles";
   /* belt-and-braces: helps Tailwind discover the lib's classes in some setups */
   @source "../../node_modules/@benord-labs/frink-primitives/src";
   ```
2. **Bundler** — Next.js: `transpilePackages: ['@benord-labs/frink-primitives']`.
   Vite transpiles package source natively.
3. **Mount the clip defs ONCE** in your root layout (required by `Tile`/`TileSurface`):
   ```tsx
   import { DiagonalCutDefs } from '@benord-labs/frink-primitives';
   // <body> ... <DiagonalCutDefs /> ... </body>
   ```
4. **ESLint colour rule** (optional but recommended):
   ```js
   import { noRawColor } from '@benord-labs/frink-primitives/eslint/no-raw-color';
   export default [{
     files: ['src/**/*.{ts,tsx}'],
     plugins: { frink: { rules: { 'no-raw-color': noRawColor } } },
     rules: { 'frink/no-raw-color': 'error' },
   }];
   ```

## Usage

```tsx
import { Button, Card, TileSurface } from '@benord-labs/frink-primitives';
```

## Tokens

Surfaces `bg`/`surface`/`elevated`/`raised`; text `ink`/`muted`/`dim`; borders
`hairline`/`hairline-strong`/`border`/`border-subtle`/`field-border`/`rim`; ramps
`primary`/`secondary`/`neutral`/`danger`/`warning`/`info` (50–950) + role aliases
`secondary`/`success`/`danger`/`warning`/`info`; status `online`; form `field`/`ring`.

## frink (internal app) adoption — future

frink is currently Tailwind v3 with a different token vocabulary
(`--background`/`--card`/`--foreground`) and its own richer Radix primitives.
Adopting this package there requires: Tailwind v3→v4, reconciling its tokens to the
ones above, replacing/bridging its primitives, and resolving `cn` duplication
(frink's clsx/tailwind-merge variant vs this dependency-free joiner). Separate effort.
