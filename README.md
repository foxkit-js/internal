# foxkit internal

This repository holds rollup configuration generator and prettierrc for all foxkit-js packages

## Setup

- Install dependencies:

```shell
yarn add -D @foxkit/internal @foxkit/eslint-config rollup eslint prettier mocha eslint-config-prettier clean-publish lint-staged simple-git-hooks
```

## package.json

- Add to `package.json`:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "lint": "eslint .",
    "format": "prettier -w .",
    "prebuild": "eslint src/**",
    "build": "rollup -c",
    "postbuild": "mocha",
    "prepare": "simple-git-hooks",
    "dev": "rollup -c -w",
    "publish": "yarn build && clean-publish --fields scripts --files src"
  },
  "eslintConfig": { "extends": "@foxkit" },
  "prettier": "@foxkit/internal/prettier",
  "browserslist": ["maintained node versions"],
  "simple-git-hooks": { "pre-commit": "yarn lint-staged" },
  "lint-staged": {
    "**/*.js": ["eslint", "prettier -w"],
    "**/*.{json,md}": ["prettier -w"]
  },
  "directories": { "dist": "dist" }
}
```

## Ignore-files

- Add `.prettierignore`

```
node_modules/**
dist/**
```

- Add `.gitignore`

```
node_modules
dist
*.log
```

- Add `.npmignore`

```
node_modules
rollup.config.mjs
```

## Rollup config

- Add `rollup.config.js`

```js
import { readFileSync, rmdirSync } from "fs";
import { join } from "path";
import { makeRollupConfig } from "@foxkit/internal";

// clean dist dir
rmdirSync(join(process.cwd(), "dist"), { recursive: true });

const pkg = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
);
const config = makeRollupConfig(pkg);

export default config;
```

This builds a config based on the `exports` field in the project's `package.json`.

## Testing with mocha

Tests go in `./test` and run tests on the finished builds in `./dist` or helper functions in `./src`. Remember to test both esm and cjs for dual-published packages. Test-files should be called like `subjectFunction-{esm,cjs}.{js,cjs}`.
