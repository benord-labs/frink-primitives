// ESLint rule: colours must come from globals.css tokens.
// Surfaces live in the editor via the ESLint LSP (immediate squiggle) AND at commit.
// Forbids:
//   1. raw colour in an arbitrary Tailwind utility  (bg-[#fff], text-[rgb(..)], bg-[linear-gradient(..rgba..)])
//   2. Tailwind default-palette colour classes       (text-red-500, border-blue-400/25)
// Token utilities (bg-surface, text-ink, from-field, bg-primary, text-secondary-200, bg-neutral-900) pass.
// NOT flagged (decorative / no token): shadow-[..#hex] glows (shadow isn't a colour utility),
// raw colour in inline `style`/shaders/3D — those live in eslint.config ignores or use a disable comment.
// Allowlist + escape: ESLint `ignores` (config) + `// eslint-disable-next-line frink/no-raw-color`.

const UTIL =
  'bg|text|border|ring|from|via|to|fill|stroke|outline|decoration|caret|accent|divide|placeholder';
const PALETTE =
  'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|stone';

export const ARBITRARY_RE = new RegExp(
  `\\b(?:${UTIL})-\\[[^\\]]*(?:#[0-9a-fA-F]{3}|rgba?\\(|hsla?\\(|oklch\\(|oklab\\()`,
);
export const PALETTE_RE = new RegExp(`\\b(?:${UTIL})-(?:${PALETTE})-\\d{2,3}\\b`);

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
      const a = ARBITRARY_RE.exec(text);
      if (a) context.report({ node, messageId: 'arbitrary', data: { m: a[0] } });
      const p = PALETTE_RE.exec(text);
      if (p) context.report({ node, messageId: 'palette', data: { m: p[0] } });
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
