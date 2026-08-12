# @benord-labs/frink-primitives

Frink's shared UI primitives + design tokens (Tailwind v4). One source of truth for
the marketing site and (later) the internal app.

## What's inside

- **`src/`** — React primitives: `ActivityRow`, `Alert`, `Badge`, `Button`
  (+`buttonVariants`), `Card` (+sub-parts), `Checkbox`, `DropdownMenu`, `FormMessage`, `Input`, `Label`,
  `Progress` (+`progressVariants`), `Radio`/`RadioGroup`, `Select`, `Separator`, `Switch`, `Tabs`,
  `Textarea`, `Tile` (+`DiagonalCutDefs`), `TileSurface`, `Tooltip`, and the `cn` class
  joiner.
- **`styles/`** — `theme.css` (design tokens + `@theme inline`), `components.css`
  (recipe classes: `tile-rim`, `glow-rim*`, `clip-diagonal-cut`, `tile-notch`, `btn`,
  `track-recess`, `track-indeterminate`, `@property --rim-angle`), and `index.css`
  (entry: imports both + a self-relative `@source "../src"`).
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

Use `TileSurface variant="attention"` for the restrained accent rim on a human-review
or awaiting-input card. The default stays neutral for account, auth, and content surfaces.

`ActivityRow` owns the dense, divided activity-list presentation while callers supply
their domain data and activation behavior:

```tsx
<ul>
  <ActivityRow
    state="running"
    pulse
    leading={<Github aria-hidden />}
    title="Fix flaky auth test"
    description="From CI · login session expiry"
    meta={<Badge shape="tag" noDot>frink-web</Badge>}
    trailing="2m"
    onActivate={() => openTask(task)}
  />
</ul>
```

`pulse` is an opt-in visual modifier for live activity. It does not change the
semantic `state`, stays static by default, and uses `motion-safe:animate-pulse`
so reduced-motion users keep the same status dot and textual status without
animation.

`DropdownMenu` owns the accessible command-menu behavior and surface styling.
Icon-only triggers still need a caller-supplied accessible name:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" aria-label="More actions">…</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={openTask}>Open task</DropdownMenuItem>
    <DropdownMenuItem tone="danger" onSelect={deleteTask}>Delete task</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

`Progress` has three modes, in precedence order — `segments` → `indeterminate` → `value`:

```tsx
<Progress value={64} />        // determinate
<Progress indeterminate />     // unknown progress
<Progress legend segments={[   // a queue split across states
  { key: 'running', label: 'Running', value: 6,  tone: 'primary' },
  { key: 'review',  label: 'Review',  value: 1,  tone: 'primary-soft' },
  { key: 'queued',  label: 'Queued',  value: 15, tone: 'muted' },
]} />
```

The legend's counts and the stripe widths come from that one array, so they cannot drift.
Without `legend`, the same numbers are still exposed as an `sr-only` summary.

## Tokens

Surfaces `bg`/`surface`/`elevated`/`raised`; text `ink`/`muted`/`dim`; borders
`hairline`/`hairline-strong`/`border`/`border-subtle`/`field-border`/`rim`; ramps
`primary`/`secondary`/`neutral`/`danger`/`warning`/`info` (50–950) + role aliases
`secondary`/`success`/`danger`/`warning`/`info`; status `online`; form `field`/`ring`.

Each status role also ships a `-fg` step — `success-fg`/`danger-fg`/`warning-fg`/`info-fg` —
for the role used as standalone TEXT or an ICON, where the role alias itself is too light to
clear WCAG AA. These flip per theme at the token layer, so use `text-info-fg`, never a
`dark:` pair over a raw ramp step.

Geometry tokens are themeable per consumer and theme-independent (`:root` only):
`--btn-radius-base`/`-pill`/`-md`/`-square` for Button, and `--field-radius` (shared by
`Input`/`Textarea`/`Select`) plus `--field-height-base`/`--field-pad-y-base`, which a
default (no `size` prop) `Input` resolves to. Flip those two to re-scale every unsized
field without touching a call site. `Progress` follows the same contract with
`--track-radius` and `--track-height-base`.

`--track-recess` is the one track token that is NOT geometry — it is the inset shadow
that makes the well look machined, so it flips per theme alongside `--card-shadow`.

## Theming (light & dark)

Class-based, following the standard Tailwind v4 convention. The base theme is
**light**; add `class="dark"` on `<html>` (or any ancestor) for dark.

```ts
document.documentElement.classList.toggle("dark", isDark);
```

`theme.css` registers the variant as `@custom-variant dark (&:is(.dark *))`. If your
app already defines that variant (e.g. via a theme provider), the redefinition is a
no-op — keep yours. Ramps (`primary`/`secondary`/… 50–950) are theme-independent;
only surface/text/border/role tokens flip. Components carry `dark:*` utilities for
the few colours a CSS var can't flip alone (semantic text steps, hover overlays).

**Breaking (from 0.3.x):** the default (no class) theme is now **light** — the prior
build was dark-only. For the old always-dark behaviour, render under `class="dark"`.

## frink (internal app) adoption — future

frink is currently Tailwind v3 with a different token vocabulary
(`--background`/`--card`/`--foreground`) and its own richer Radix primitives.
Adopting this package there requires: Tailwind v3→v4, reconciling its tokens to the
ones above, replacing/bridging its primitives, and resolving `cn` duplication
(frink's clsx/tailwind-merge variant vs this dependency-free joiner). Separate effort.
