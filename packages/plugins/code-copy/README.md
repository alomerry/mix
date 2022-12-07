# @rainbowatcher/vuepress-plugin-code-copy

## About <a name = "about"></a>

Simple vuepress plugin for copy button in code blocks.

## Getting Started <a name = "getting_started"></a>

install the plugin

```bash
# pnpm
pnpm i @rainbowatcher/vuepress-plugin-code-copy
```

add plugin to `config.ts`

```typescript
import copyCodePlugin from "@rainbowatcher/vuepress-plugin-code-copy";

export default defineUserConfig({
  plugins: [copyCodePlugin(/*{ options }*/)],
});
```

## Options

### style

- Type: `string`
- Default: `"github"`
- Details: The style for copy button.

### selector

- Type: `string`
- Default: `div[class*="language-"] pre`
- Details: A CSS selector for the plugin to select code blocks.
