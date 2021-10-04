import fs from "fs";
import path from "path";
import ts from "rollup-plugin-ts";
import { builtinModules } from "module";

const inCwd = p => path.join(process.cwd(), p);

export function makeRollupConfig({ tsConfig = {}, disableTs = false }) {
  const pkg = JSON.parse(fs.readFileSync(inCwd("package.json"), "utf8"));
  const pkgIsModule = pkg.type === "module";
  const moduleIndex = disableTs ? "index.js" : "index.ts";

  const plugins = disableTs ? [] : [tsConfig ? ts(tsConfig) : ts()];
  const external = [
    ...builtinModules,
    ...(pkg.dependencies == null ? [] : Object.keys(pkg.dependencies)),
    ...(pkg.devDependencies == null ? [] : Object.keys(pkg.devDependencies)),
    ...(pkg.peerDependencies == null ? [] : Object.keys(pkg.peerDependencies)),
    ...(pkg.optionalDependencies == null
      ? []
      : Object.keys(pkg.optionalDependencies))
  ];

  const configs = new Array();

  for (const [src, dist] of Object.entries(pkg.exports)) {
    if (path.extname(src)) continue; // ignore package.json export

    const output = new Array();
    if (typeof dist === "string") {
      output.push({
        file: dist.substring(2),
        format: pkgIsModule ? "esm" : "cjs",
        sourcemap: true
      });
    } else {
      output.push(
        ...Object.entries(dist).map(([type, distPath]) => ({
          file: distPath.substring(2),
          format: type === "import" ? "esm" : "cjs",
          sourcemap: true
        }))
      );
    }

    const config = {
      input: `src/${src.substring(2)}${
        src.endsWith("/") ? "" : "/"
      }${moduleIndex}`,
      output,
      plugins,
      external
    };

    configs.push(config);
  }

  return configs;
}
