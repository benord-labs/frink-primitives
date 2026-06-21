// ESLint rule: colours must come from globals.css tokens.
// Surfaces live in the editor via the ESLint LSP (immediate squiggle) AND at commit.
// Forbids:
//   1. raw colour in an arbitrary Tailwind utility  (bg-[#fff], text-[rgb(..)], bg-[linear-gradient(..rgba..)], bg-[red])
//   2. Tailwind default-palette colour classes       (text-red-500, border-blue-400/25)
// Token utilities (bg-surface, text-ink, from-field, bg-primary, text-secondary-200, bg-neutral-900) pass.
// NOT flagged (decorative / no token): shadow-[..#hex] glows (shadow isn't a colour utility),
// raw colour in inline `style` (see frink/no-raw-style-color), shaders/3D — eslint.config ignores or a disable comment.
// Allowlist + escape: ESLint `ignores` (config) + `// eslint-disable-next-line frink/no-raw-color`.

import { COLOR_FN_ALT, NAMED_HUE_ALT } from './color-predicates.mjs';

const UTIL =
  'bg|text|border|ring|from|via|to|fill|stroke|outline|decoration|caret|accent|divide|placeholder';
const PALETTE =
  'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|stone';

// Arbitrary utility holding a raw colour: either a hex/colour-function anywhere inside the
// brackets (covers gradients), or a bare named hue as the whole value (`bg-[red]`).
export const ARBITRARY_RE = new RegExp(
  `\\b(?:${UTIL})-\\[(?:[^\\]]*(?:#[0-9a-fA-F]{3}|(?:${COLOR_FN_ALT})\\()|(?:${NAMED_HUE_ALT})\\])`,
);
export const PALETTE_RE = new RegExp(`\\b(?:${UTIL})-(?:${PALETTE})-\\d{2,3}\\b`);

// Report EVERY match in a string, not just the first (two bad classes in one className).
const reportAll = (context, node, source, messageId) => {
  for (const m of source.matchAll(new RegExp(messageId === 'arbitrary' ? ARBITRARY_RE.source : PALETTE_RE.source, 'g'))) {
    context.report({ node, messageId, data: { m: m[0] } });
  }
};

/** @type {import('eslint').Rule.RuleModule} */
export const noRawColor = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Colours must use globals.css tokens; no raw or Tailwind default-palette colours.',
    },
    messages: {
      arbitrary:
        'Non-token colour "{{m}}". Use a globals.css token (bg-surface, text-ink, from-primary, …).',
      palette:
        'Tailwind default-palette colour "{{m}}". Use a globals.css token ramp (primary/secondary/danger/warning/info/neutral).',
    },
    schema: [],
  },
  create(context) {
    const check = (node, text) => {
      if (typeof text !== 'string') return;
      reportAll(context, node, text, 'arbitrary');
      reportAll(context, node, text, 'palette');
    };
    return {
      Literal(node) {
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};

export default noRawColor;
