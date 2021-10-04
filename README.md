# foxkit internal

This repository holds project configurations for all foxkit-js packages

## Install with TypeScript

- Install dependencies:

```shell
yarn add -D @foxkit/internal rollup typescript eslint prettier rollup-plugin-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser clean-publish lint-staged simple-git-hooks
```

- Add to `package.json`:

```json
{
  "types": "./index.d.ts",
  "scripts": {
    "lint": "eslint .",
    "format": "prettier -w .",
    "test": "eslint .",
    "prepare": "simple-git-hooks",
    "dev": "rollup -c -w",
    "prepublish": "eslint . && rollup -c",
    "publish": "clean-publish --fields scripts"
  },
  "eslintConfig": {
    "extends": ["@foxkit/internal/eslint", "@foxkit/internal/eslint-ts"]
  },
  "prettier": "@foxkit/internal/prettier",
  "browserslist": ["maintained node versions"],
  "simple-git-hooks": {
    "pre-commit": "yarn lint-staged"
  },
  "lint-staged": {
    "**/*.{j,t}s": ["eslint", "prettier -w"],
    "**/*.{json,md}": ["prettier -w"]
  },
  "directories": {
    "dist": "dist"
  }
}
```

- Add `tsconfig.json`

```json
{
  "extends": "@foxkit/internal/tsconfig"
}
```

- Add `.prettierignore`

```
node_modules/**
dist/**
```

- Add `rollup.config.js`

```js
import { makeRollupConfig } from "@foxkit/interal";
export default makeRollupConfig();
```

This builds a config based on the `exports` field in the project's `package.json`.

- Testing with mocha (optional, recommended)

Install `yarn add -D mocha` and replace `"test"` with `"mocha"`, as well as adding `& mocha` to `"prepublish"`

## Install without TypeScript

<details>
<summary>Click to expand</summary>

- Install dependencies:

```shell
yarn add -D @foxkit/internal rollup eslint prettier  clean-publish lint-staged simple-git-hooks
```

- Add to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier -w .",
    "test": "eslint .",
    "prepare": "simple-git-hooks",
    "dev": "rollup -c -w",
    "prepublish": "eslint . && rollup -c",
    "publish": "clean-publish --fields scripts"
  },
  "eslintConfig": {
    "extends": "@foxkit/internal/eslint"
  },
  "prettier": "@foxkit/internal/prettier",
  "browserslist": ["maintained node versions"],
  "simple-git-hooks": {
    "pre-commit": "yarn lint-staged"
  },
  "lint-staged": {
    "**/*.js": ["eslint", "prettier -w"],
    "**/*.{json,md}": "prettier -w"
  },
  "directories": {
    "dist": "dist"
  }
}
```

- Add `.prettierignore`

```
node_modules/**
dist/**
```

- Add `rollup.config.js`

**_WARN_**: currently not supported. If needed temporarily fork the script and include it as `tools/makeRollupConfig.mjs`;

```js
import { makeRollupConfig } from "@foxkit/interal";
export default makeRollupConfig({ disableTs: true });
```

This builds a config based on the `exports` field in the project's `package.json`.

</details>

## Testing with mocha (optional, recommended)

Install `yarn add -D mocha` and replace `"test"` with `"mocha"`, as well as adding `& mocha` to `"prepublish"`
