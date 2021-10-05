# foxkit internal

This repository holds project configurations for all foxkit-js packages

## Setup

- Install dependencies:

```shell
yarn add -D @foxkit/internal rollup eslint prettier eslint-config-prettier clean-publish lint-staged simple-git-hooks
```

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
    "prebuild": "eslint .",
    "build": "rollup -c",
    "prepare": "simple-git-hooks",
    "dev": "rollup -c -w",
    "publish": "yarn build && clean-publish --fields scripts"
  },
  "prettier": "@foxkit/internal/prettier",
  "browserslist": ["maintained node versions"],
  "simple-git-hooks": {
    "pre-commit": "yarn lint-staged"
  },
  "lint-staged": {
    "**/*.js": ["eslint", "prettier -w"],
    "**/*.{json,md}": ["prettier -w"]
  },
  "directories": {
    "dist": "dist",
    "src": "src"
  }
}
```

- Add `.eslintrc.json`

_(TODO: will get moved to own package)_

- Add `.prettierignore`

```
node_modules/**
dist/**
```

- Add `.gitignore`

```
node_modules/**
*.log
```

- Add `rollup.config.js`

```js
import { readFileSync } from "fs";
import { join } from "path";
import { makeRollupConfig } from "@foxkit/internal";

const pkg = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
);
const config = makeRollupConfig(pkg);

export default config;
```

This builds a config based on the `exports` field in the project's `package.json`.

## Testing with mocha (optional, recommended)

Install `yarn add -D mocha` and add the following script:

```json
{ "postbuild": "mocha" }
```

Tests should be `*.test.js` files and run tests on the finished builds in `./dist`. Remember to test both esm and cjs for dual-published packages.
