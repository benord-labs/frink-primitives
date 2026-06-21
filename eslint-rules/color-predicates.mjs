// Shared colour predicates for the frink colour-governance ESLint rules.
// Single source of what counts as a raw colour, as "light" (white/black at any alpha —
// neutral light/shadow, exempt), and as an "art context" (gradient/url/image — needs
// arbitrary stops, exempt). Both `no-raw-color` (classNames) and `no-raw-style-color`
// (inline styles) import from here so they agree on those definitions.

// CSS colour-function names, as a regex alternation fragment (no anchors).
export const COLOR_FN_ALT = 'rgba?|hsla?|oklch|oklab|lab|lch|hwb|color';

// Named CSS *hue* colours we forbid inside arbitrary utilities (`bg-[red]`).
// Deliberately excludes neutrals + keywords (white/black/gray/grey/silver/transparent/
// currentColor/inherit/none) — those are light/shadow or non-colours, not brand hues.
export const NAMED_HUE_ALT =
  'aqua|blue|brown|chartreuse|coral|crimson|cyan|fuchsia|gold|green|indigo|khaki|' +
  'lavender|lime|magenta|maroon|navy|olive|orange|orchid|pink|plum|purple|red|salmon|' +
  'teal|tomato|turquoise|violet|yellow';

// A raw colour anywhere in a value: a 3–8 digit hex, or any colour function.
export const RAW_COLOR_RE = new RegExp(`#[0-9a-fA-F]{3,8}\\b|\\b(?:${COLOR_FN_ALT})\\(`);

// White or black at ANY alpha — handles comma- and space-separated rgb()/rgba() and
// 3/4/6/8-digit hex. This is the "light/shadow is exempt" predicate.
const WHITE_RGB = /rgba?\(\s*255\s*[,\s]\s*255\s*[,\s]\s*255\b/i;
const BLACK_RGB = /rgba?\(\s*0+\s*[,\s]\s*0+\s*[,\s]\s*0+\b/i;
const WHITE_HEX = /#(?:fff|ffff|ffffff|ffffff[0-9a-f]{2})\b/i;
const BLACK_HEX = /#(?:000|0000|000000|000000[0-9a-f]{2})\b/i;

export const isLight = (value) =>
  WHITE_RGB.test(value) ||
  BLACK_RGB.test(value) ||
  WHITE_HEX.test(value) ||
  BLACK_HEX.test(value);

// Gradient / url() / image-set() — arbitrary colour stops are legitimate here, so skip.
// SVG paint `url(#id)` also lands here (exempt), as intended.
export const isArtContext = (value) =>
  /(?:repeating-)?(?:linear|radial|conic)-gradient\(|\burl\(|\bimage-set\(/i.test(value);
