import { extname } from "path";
import { builtinModules } from "module";

const isDev = process.env.ROLLUP_WATCH === true;

function getExternal(pkg) {
  return [
    ...builtinModules,
    ...(pkg.dependencies == null ? [] : Object.keys(pkg.dependencies)),
    ...(pkg.devDependencies == null ? [] : Object.keys(pkg.devDependencies)),
    ...(pkg.peerDependencies == null ? [] : Object.keys(pkg.peerDependencies))
  ];
}

function resolveInput(target) {
  const match = (target.import || target).match(/^\.\/dist\/(.*)/)[1];
  return "src/" + match;
}

function resolveOutput(target, type, moduleType) {
  let ext = ".js";
  if (moduleType === "esm" && type === "require") ext = ".cjs";
  if (moduleType === "cjs" && type === "import") ext = ".mjs";

  const match = target.match(/^\.\/(dist\/.*)\.[cm]?js$/)[1];
  const file = `${match}${ext}`;

  return { file, format: type === "import" ? "esm" : "cjs", sourcemap: isDev };
}

function parseExport(target, moduleType, plugins) {
  const input = resolveInput(target);
  let output;

  if (typeof target === "string") {
    output = resolveOutput(target, moduleType, moduleType);
    if (plugins != null) output.plugins = plugins;
  } else {
    output = Object.entries(target).map(([type, target]) => {
      const out = resolveOutput(target, type, moduleType);
      if (plugins != null) out.plugins = plugins;
      return out;
    });
  }

  return [input, output];
}

export function makeRollupConfig(pkg, plugins, outputPlugins) {
  const moduleType = pkg.type === "module" ? "esm" : "cjs";
  const external = getExternal(pkg);
  const configs = new Array();

  for (const [path, target] of Object.entries(pkg.exports)) {
    if (extname(path)) continue; // ignore package.json export

    const [input, output] = parseExport(target, moduleType, outputPlugins);

    const config = { input, output, external };
    if (plugins != null) config.plugins = plugins;

    configs.push(config);
  }

  return configs;
}
