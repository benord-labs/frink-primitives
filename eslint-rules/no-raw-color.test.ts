import tsParser from '@typescript-eslint/parser';
import { RuleTester } from 'eslint';
import { noRawColor } from './no-raw-color.mjs';

// RuleTester drives its own describe/it (bun:test provides them globally), so it is
// called at top level — NOT inside a test(), which bun forbids (describe-in-test).
const ruleTester = new RuleTester({
  languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-raw-color', noRawColor, {
  valid: [
    'const a = <div className="bg-surface text-ink border-hairline from-field to-surface bg-primary text-secondary-200 bg-neutral-900 ring-ring" />;',
    'const a = <div className="shadow-[inset_0_1px_0_#ffffff0a,0_8px_24px_-12px_#000000]" />;',
    'const a = <div className="text-[15px] w-[440px] text-[clamp(2rem,8vw,4rem)]" />;',
    'const a = <div className={`bg-surface text-ink`} />;',
  ],
  invalid: [
    { code: 'const a = <div className="bg-[#ff0000]" />;', errors: [{ messageId: 'arbitrary' }] },
    { code: 'const a = <div className="text-red-500" />;', errors: [{ messageId: 'palette' }] },
    {
      code: 'const a = clsx("bg-[linear-gradient(180deg,rgba(1,2,3,0.5),transparent)]");',
      errors: [{ messageId: 'arbitrary' }],
    },
    {
      code: 'const a = <div className={`border-blue-400/25`} />;',
      errors: [{ messageId: 'palette' }],
    },
  ],
});
