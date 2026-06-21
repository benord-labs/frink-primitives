// ESLint rule: no raw HUE colour in inline `style={{ … }}` props.
// Companion to frink/no-raw-color (which governs classNames). Scoped tightly to SOLID
// single-colour CSS props — gradients/masks/filters/shaders legitimately need arbitrary
// stops and stay free. White/black at any alpha is neutral light/shadow and is exempt.
// Escape hatch: `// eslint-disable-next-line frink/no-raw-style-color`.

import { RAW_COLOR_RE, isArtContext, isLight } from './color-predicates.mjs';

// Solid single-colour properties (kebab-case). `background` is included but only flagged
// when its value carries no gradient/url (handled in checkDecl). `background-image` is NOT
// here — it holds gradients/urls (art), never a flat colour we'd tokenise.
const SOLID_PROPS = new Set([
  'color',
  'background',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'fill',
  'stroke',
  'caret-color',
  'text-decoration-color',
  'column-rule-color',
  'text-emphasis-color',
]);

// camelCase (style object) or kebab (CSS-in-JS string) → kebab.
const toKebab = (name) => name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).toLowerCase();

// A static string value, or null for anything dynamic (`${…}`, calls like useTransform).
const staticString = (node) => {
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0)
    return node.quasis[0].value.cooked;
  return null;
};

// Decide whether one declaration is a raw-hue violation.
const isViolation = (prop, value) => {
  if (!SOLID_PROPS.has(prop)) return false;
  if (!RAW_COLOR_RE.test(value)) return false; // var(), currentColor, none, inherit → no match
  if (isArtContext(value)) return false; // gradient / url() / image-set()
  if (isLight(value)) return false; // white/black at any alpha
  if (/var\(/.test(value)) return false; // token reference (e.g. inside color-mix)
  return true;
};

/** @type {import('eslint').Rule.RuleModule} */
export const noRawStyleColor = {
  meta: {
    type: 'problem',
    docs: { description: 'No raw hue colour in inline style; use a globals.css token.' },
    messages: {
      raw: 'Raw colour "{{m}}" in inline style "{{prop}}". Use a globals.css token (var(--ink), var(--primary), …) or a token utility class.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        const container = node.value;
        if (container?.type !== 'JSXExpressionContainer') return;
        const obj = container.expression;
        if (obj.type !== 'ObjectExpression') return;
        for (const p of obj.properties) {
          if (p.type !== 'Property' || p.computed) continue;
          const key =
            p.key.type === 'Identifier'
              ? p.key.name
              : p.key.type === 'Literal'
                ? String(p.key.value)
                : null;
          if (key == null) continue;
          const value = staticString(p.value);
          if (value == null) continue;
          if (isViolation(toKebab(key), value)) {
            context.report({
              node: p.value,
              messageId: 'raw',
              data: { m: value, prop: toKebab(key) },
            });
          }
        }
      },
    };
  },
};

export default noRawStyleColor;
